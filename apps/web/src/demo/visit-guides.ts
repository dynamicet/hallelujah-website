// Existing preview routes remain stable while preparation guides are separated from care services.
export const visitGuides: Readonly<Record<string, { title: string; action: string }>> = {
  pub_121212121212: { title: 'Preparing for a hospital stay', action: 'Prepare for your stay' },
  pub_131313131313: { title: 'Preparing for a day visit', action: 'Prepare for your day visit' },
  pub_191919191919: { title: 'Preparing for a therapy conversation', action: 'Prepare your therapy questions' },
}
