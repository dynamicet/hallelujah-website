import {
  EmergencyAction,
  LanguageSwitcher,
  type EmergencyActionProps,
  type LanguageSwitcherProps,
} from '../components'
import { HomeContactTemplate, type HomeContactTemplateProps } from './home-contact-template'

export interface HomePageTemplateProps extends Omit<HomeContactTemplateProps, 'shell'> {
  readonly shell: Omit<HomeContactTemplateProps['shell'], 'header'> & {
    readonly header: Omit<HomeContactTemplateProps['shell']['header'], 'emergencyAction' | 'languageSwitcher'> & {
      readonly emergencyAction: EmergencyActionProps
      readonly languageSwitcher: LanguageSwitcherProps
    }
  }
}

// Routes supply content; the template owns composition of the shared shell controls.
export function HomePageTemplate({ shell, ...props }: HomePageTemplateProps) {
  return (
    <HomeContactTemplate
      {...props}
      shell={{
        ...shell,
        header: {
          ...shell.header,
          emergencyAction: <EmergencyAction {...shell.header.emergencyAction} />,
          languageSwitcher: <LanguageSwitcher {...shell.header.languageSwitcher} />,
        },
      }}
    />
  )
}
