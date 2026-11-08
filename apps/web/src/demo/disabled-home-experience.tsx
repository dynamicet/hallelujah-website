// Selected at build time for normal production. Demo client modules never enter
// this build's homepage graph; enabling a demo requires an explicit demo build.
export function WebsiteHome() { throw new Error('The enhanced homepage requires a demo build') }
export function DemoHeroArtwork() { return null }
export const HomeCareContent: (props: { partial?: boolean }) => null = () => null
export function HomeDemoContactDetails() { return null }
export function HomeInstitutionalContent() { return null }
