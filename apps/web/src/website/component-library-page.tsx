import { notFound } from 'next/navigation'
import { isLocalDemo } from '@/server/environment'
import { ComponentLibraryTemplate } from '@/design-system/templates'

export default function ComponentLibraryPage() {
  if (!isLocalDemo()) notFound()
  return <ComponentLibraryTemplate />
}
