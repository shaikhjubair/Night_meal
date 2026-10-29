import { notFound } from "next/navigation"
import { DashboardExperience } from "@/components/nightshift/dashboard/dashboard-experience"
import type { DashboardRole } from "@/lib/nightshift-data"

const dashboardRoles: DashboardRole[] = ["admin", "store", "rider", "staff"]

export default async function DashboardPage({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params
  if (!dashboardRoles.includes(role as DashboardRole)) notFound()
  return <DashboardExperience role={role as DashboardRole} />
}
