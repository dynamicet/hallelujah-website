import pg from 'pg'
import type {
  AppointmentCreateCommand,
  AppointmentCreateOutcome,
  AppointmentRepository,
} from './service.ts'

const { Pool } = pg

type AppointmentDatabaseOptions = Readonly<{
  connectionString: string
  mode: 'synthetic'
}>

type SubmissionRow = Readonly<{
  outcome: 'accepted' | 'invalid_selector' | 'rate_limited'
  public_reference: string | null
}>

export class PostgresAppointmentRepository implements AppointmentRepository {
  readonly #pool: pg.Pool
  readonly #synthetic: true

  constructor(options: AppointmentDatabaseOptions) {
    this.#pool = new Pool({
      connectionString: options.connectionString,
      max: 5,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 3_000,
      allowExitOnIdle: true,
      application_name: 'hallelujah-appointment-runtime',
    })
    this.#synthetic = true
  }

  async create(command: AppointmentCreateCommand): Promise<AppointmentCreateOutcome> {
    const { submission } = command
    const result = await this.#pool.query<SubmissionRow>({
      name: 'b03-015-submit-appointment-request',
      text: `SELECT outcome, public_reference::text
        FROM appointment.submit_request($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      values: [
        submission.fullName,
        submission.phone,
        submission.careRoute,
        submission.doctorId ?? null,
        submission.serviceId ?? null,
        submission.preferredDate ?? null,
        command.noticeVersion,
        submission.privacyAcknowledged,
        command.abuseKey,
        command.correlationId,
        this.#synthetic,
      ],
    })

    const row = result.rows[0]
    if (result.rowCount !== 1 || !row) throw new Error('Appointment operation returned no outcome')
    if (row.outcome === 'accepted') {
      if (!row.public_reference) throw new Error('Appointment operation returned no reference')
      return { status: 'accepted', reference: row.public_reference }
    }
    if (row.outcome === 'invalid_selector' || row.outcome === 'rate_limited') {
      return { status: row.outcome }
    }
    throw new Error('Appointment operation returned an unsupported outcome')
  }

  async close(): Promise<void> {
    await this.#pool.end()
  }
}
