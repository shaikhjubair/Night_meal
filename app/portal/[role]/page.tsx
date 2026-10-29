import { notFound } from "next/navigation"
import { PortalLogin } from "@/components/nightshift/auth/portal-login"
import { portalRoleKeys, portalRoles } from "@/lib/nightshift-data"

export default async function PortalPage({ params }: { params: Promise<{ role: string }> }) {
  const { role: roleKey } = await params
  if (!portalRoleKeys.includes(roleKey as (typeof portalRoleKeys)[number])) notFound()

  const typedRoleKey = roleKey as (typeof portalRoleKeys)[number]
  return <PortalLogin roleKey={typedRoleKey} role={portalRoles[typedRoleKey]} />
}
