/** Mock editorial content for the representative frontend care records. */
export const careContent: Readonly<Record<string, { about: string; preparation: string; team?: string }>> = {
  pub_111111111111: {
    about: 'Plan your arrival with the admissions team and your referring clinician. Discuss the documents you need, support during your stay and who to contact with questions.',
    preparation: 'Keep your referral, identification and earlier reports together. Confirm your arrival arrangements before travelling.',
    team: 'The admissions team coordinates arrival arrangements with your referring clinician. Use the referral guidance to prepare the information they need.',
  },
  pub_141414141414: {
    about: 'Family medicine is a starting point for new concerns and continuing care. Discuss everyday health, review ongoing conditions and plan any specialist follow-up you may need.',
    preparation: 'Bring your current medicine list and notes from earlier visits. Write down the concerns you would like to discuss first.',
  },
  pub_151515151515: {
    about: 'Discuss heart-health concerns, earlier investigations and your current care plan. A cardiology consultation can include reviewing previous test results and planning follow-up or further assessment.',
    preparation: 'Bring earlier heart reports, consultation notes and a current medicine list. Include any referral letter and the questions you want to discuss.',
  },
  pub_161616161616: {
    about: 'Talk through breathing concerns, their effect on daily life and any existing lung condition. The specialist will review your history and earlier results with you.',
    preparation: 'Bring previous chest or breathing-test reports and a current medicine list. Note when your concerns began and what you would like explained.',
  },
  pub_171717171717: {
    about: 'Describe the movements and everyday activities you want to improve. The physiotherapy team will discuss your recovery goals, earlier treatment and the support that may help you work towards them.',
    preparation: 'Bring your referral and any relevant imaging or therapy notes. Think about the activities that matter most to you and what currently feels difficult.',
    team: 'Your visit is coordinated by the physiotherapy team. Request the service without choosing a doctor; the team will discuss the assessment and visit arrangements with you.',
  },
  pub_181818181818: {
    about: 'Discuss speech, language or communication needs and how they affect everyday life. An initial conversation helps the therapy team understand your goals and any previous support.',
    preparation: 'Bring earlier assessment or therapy reports if you have them. A family member or caregiver can help describe your questions and communication goals.',
    team: 'Reception can connect you with the speech and language therapy team. Explain the support you are looking for and ask how to arrange an initial assessment.',
  },
  pub_212121212121: {
    about: 'Use a follow-up visit to review progress since your last appointment. Discuss new results, questions about your care plan and the next steps agreed with your doctor.',
    preparation: 'Bring previous visit notes, any new results and an up-to-date medicine list. Write down what has changed since your last appointment.',
  },
  pub_232323232323: {
    about: 'Discuss concerns involving the brain and nerves, their history and their effect on daily activities. The specialist can review previous assessments and help plan continuing care.',
    preparation: 'Bring earlier consultation notes, imaging or test reports and a current medicine list. Prepare a short timeline of the concerns you want to discuss.',
  },
  pub_242424242424: {
    about: 'Review kidney-health concerns, previous results and any ongoing care. Discuss the questions you have about your care plan and the follow-up you may need.',
    preparation: 'Bring earlier kidney-related blood and urine results, consultation notes and your current medicine list.',
  },
  pub_252525252525: {
    about: 'Talk through bone and joint concerns and how they affect movement, work or everyday activities. The specialist will review earlier treatment and any relevant imaging with you.',
    preparation: 'Bring previous imaging and treatment notes if available. Think about the activities you want to return to or find easier.',
  },
  pub_262626262626: {
    about: 'Discuss your child’s health, development and any concerns you have as a family. A consultation can review earlier care and help you plan the next steps together.',
    preparation: 'Bring your child’s health records, earlier reports and current medicine information. Write down questions you and your child would like answered.',
  },
  pub_272727272727: {
    about: 'Echocardiography uses ultrasound to examine the heart. The care team will explain the examination and how the report fits into the plan from your referring clinician.',
    preparation: 'Bring the examination request and earlier heart reports. Follow any visit-specific instructions given by the care team.',
  },
}
