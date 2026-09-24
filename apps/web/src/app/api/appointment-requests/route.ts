import { createAppointmentPostHandler } from '@/appointment/handler.ts'
import { PostgresAppointmentRepository } from '@/appointment/postgres.ts'
import { consoleAppointmentAuditSink } from '@/appointment/service.ts'
import { loadServerEnvironment } from '@/server/environment.ts'

export const runtime = 'nodejs'

let repository: PostgresAppointmentRepository | undefined

export async function POST(request: Request): Promise<Response> {
  const environment = loadServerEnvironment()
  const collectionEnabled = environment.personalDataCollection === 'enabled'
  if (collectionEnabled && environment.appointment && !repository) {
    repository = new PostgresAppointmentRepository({
      connectionString: environment.appointment.databaseUrl,
      mode: 'synthetic',
    })
  }

  return createAppointmentPostHandler({
    collectionEnabled,
    repository,
    audit: consoleAppointmentAuditSink,
    noticeVersion: environment.appointment?.noticeVersion,
    abuseSecret: environment.appointment?.abuseSecret,
  })(request)
}
