// Review tooling only. Never import this inventory into application code.
export const reviewGroups = [
  { id: 'foundation-evidence', marker: 'data-foundation-fixture', ticket: 'B01-004', components: ['StatusSummary'], states: ['system font fallback', 'long English', 'Ethiopic shaping', 'mixed script', 'focus', 'print'] },
  { id: 'action-evidence', marker: 'data-essential-actions-fixture', ticket: 'B01-005', components: ['ActionButton', 'ActionGroup', 'ActionLink', 'CallAction', 'EmergencyAction', 'TextLink', 'TaskCard', 'Icon'], states: ['primary', 'secondary', 'tertiary', 'disabled with reason', 'controlled call', 'protected emergency'] },
  { id: 'shell-evidence', marker: 'data-global-shell-fixture', ticket: 'B01-006', components: ['Breadcrumbs', 'LanguageSwitcher', 'PrimaryNavigation', 'SiteFooter', 'SiteHeader', 'SiteShell', 'SkipLink'], states: ['wide', 'compact', 'open', 'closed', 'current', 'language unavailable', 'skip target', 'Escape focus restoration'] },
  { id: 'search-controls-evidence', marker: 'data-search-controls-fixture', ticket: 'B01-007', components: ['ActiveFilterList', 'FilterDisclosure', 'FilterGroup', 'Pagination', 'ResultCount', 'SearchBox', 'SearchControlsForm'], states: ['default', 'filtered', 'empty', 'reset', 'pagination', 'compact disclosure', 'deep link', 'Back/Forward'] },
  { id: 'form-primitives-evidence', marker: 'data-form-primitives-fixture', ticket: 'B01-009', components: ['ChoiceGroup', 'ErrorSummary', 'FormActions', 'FormPrimitiveForm', 'FormStatus', 'FormSubmitButton', 'SelectField', 'TextAreaField', 'TextField'], states: ['required', 'optional', 'help', 'validation error', 'summary focus', 'pending', 'synthetic receipt', 'delivery warning', 'known failure', 'collection disabled', 'retained values'] },
  { id: 'system-states-evidence', marker: 'data-system-states-fixture', ticket: 'B01-010', components: ['LoadingStatus', 'NonCriticalSkeleton', 'SystemAlert', 'SystemState', 'TemporaryNotice'], states: ['information', 'warning', 'success specimen', 'blocking error', 'temporary notice', 'loading', 'empty', 'error', 'offline', 'unavailable', 'expired', 'state precedence'] },
  { id: 'motion-media-evidence', marker: 'data-motion-media-fixture', ticket: 'B01-012', components: ['ExperienceRegion', 'MotionAccent', 'OptInMedia'], states: ['Level 0 protected', 'Level 1 ceiling', 'Level 2 composed', 'Level 3 decorative', 'Level 4 explicit media', 'poster', 'playing', 'paused', 'stopped', 'ended', 'failed', 'captions', 'transcript', 'route exit', 'history restoration'] },
  { id: 'governed-cards-evidence', marker: 'data-governed-cards-fixture', ticket: 'B01-008', components: ['GovernedCard'], states: ['doctor', 'service', 'location', 'vacancy', 'optional omission', 'review metadata', 'neutral media fallback', 'unavailable', 'expired', 'retired', 'public gate closed'] },
  { id: 'optional-map-evidence', marker: 'data-optional-map-fixture', ticket: 'B01-011', components: ['OptionalMap'], states: ['idle', 'blocked', 'loading', 'failure', 'local acknowledgement', 'local placeholder active', 'removed', 'revoked', 'route exit', 'provider disabled'] },
]

export const reviewCapabilities = [
  'default', 'reduced-motion', 'save-data', 'forced-colors', 'no-javascript',
  'images-fonts-blocked', 'coarse-pointer', 'print', '200%-text',
]

export const reviewLanguages = ['en', 'am']
