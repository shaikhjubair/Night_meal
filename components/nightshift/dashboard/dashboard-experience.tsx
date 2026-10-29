import type { DashboardRole } from "@/lib/nightshift-data"
import { AdminDashboard } from "@/components/nightshift/dashboard/admin-dashboard"
import { DashboardShell } from "@/components/nightshift/dashboard/dashboard-shell"
import { RiderDashboard } from "@/components/nightshift/dashboard/rider-dashboard"
import { StaffDashboard } from "@/components/nightshift/dashboard/staff-dashboard"
import { StoreDashboard } from "@/components/nightshift/dashboard/store-dashboard"

export function DashboardExperience({ role }: { role: DashboardRole }) {
  const dashboard = {
    admin: <AdminDashboard />,
    store: <StoreDashboard />,
    rider: <RiderDashboard />,
    staff: <StaffDashboard />,
  }[role]

  return <DashboardShell role={role}>{dashboard}</DashboardShell>
}
