import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowUpRight, Bike, CheckCircle2, ChevronRight, ClipboardList, LayoutDashboard, Lock, ShieldCheck, Sparkles, Store } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BrandMark } from "@/components/nightshift/brand"
import type { DashboardRole } from "@/lib/nightshift-data"

const roleNavigation: { slug: DashboardRole; label: string; icon: typeof LayoutDashboard }[] = [
  { slug: "admin", label: "Super Admin", icon: ShieldCheck },
  { slug: "store", label: "Store Portal", icon: Store },
  { slug: "staff", label: "Staff Desk", icon: ClipboardList },
  { slug: "rider", label: "Rider Hub", icon: Bike },
]

const roleLabels: Record<DashboardRole, string> = {
  admin: "Super Admin Platform",
  store: "Store Vendor Space",
  staff: "Operations Dispatch Desk",
  rider: "Courier Fleet Terminal",
}

export function DashboardShell({ role, children }: { role: DashboardRole; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      <div className="mx-auto flex min-h-screen max-w-[1720px]">
        {/* Desktop Sleek Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col border-r border-border/70 bg-card/40 px-5 py-6 backdrop-blur-2xl lg:flex">
          <BrandMark />
          <div className="mt-8 px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Workspaces
          </div>
          <nav aria-label="Workspaces" className="mt-3 flex flex-col gap-1.5">
            {roleNavigation.map(({ slug, label, icon: Icon }) => {
              const active = role === slug
              return (
                <Link
                  key={slug}
                  href={`/dashboard/${slug}`}
                  aria-current={active ? "page" : undefined}
                  className={`group flex items-center justify-between rounded-2xl px-3.5 py-3 text-sm font-semibold transition-all duration-200 ${
                    active
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 ring-1 ring-primary/40"
                      : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon aria-hidden="true" className={`size-4.5 ${active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"}`} />
                    <span>{label}</span>
                  </div>
                  {active && <span aria-hidden="true" className="size-2 rounded-full bg-primary-foreground shadow-sm animate-pulse" />}
                </Link>
              )
            })}
          </nav>

          {/* Quick Outpost Info Card */}
          <div className="mt-auto rounded-3xl border border-border/80 bg-background/60 p-4 backdrop-blur-xl shadow-sm">
            <div className="flex items-center gap-2">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Bashundhara R/A</p>
            </div>
            <p className="mt-2 text-xs font-bold text-foreground">Night Shift Active</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">Hours: 10 PM — 4 AM BST</p>
            <Link
              href="/"
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary underline underline-offset-4 hover:text-primary/90"
            >
              Open Customer Storefront
              <ArrowUpRight className="size-3" />
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Top Sticky Header */}
          <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-xl">
            <div className="mx-auto flex h-[70px] max-w-[1400px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <span className="lg:hidden"><BrandMark compact /></span>
                <span className="hidden text-base font-bold tracking-tight text-foreground lg:inline">
                  {roleLabels[role]}
                </span>
                <Badge
                  variant="outline"
                  className="gap-1.5 border-primary/30 bg-primary/10 text-primary font-bold text-[10px] tracking-wider uppercase px-2.5 py-0.5"
                >
                  <span className="size-1.5 rounded-full bg-primary animate-pulse" aria-hidden="true" />
                  Live Operational Console
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-xs font-semibold border border-border/70 bg-background/50 hover:bg-background/80"
                  nativeButton={false}
                  render={<Link href="/" />}
                >
                  <ArrowUpRight data-icon="inline-start" aria-hidden="true" />
                  Storefront
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs font-semibold"
                  nativeButton={false}
                  render={<Link href={`/portal/${role === "admin" ? "super-admin" : role}`} />}
                >
                  <Lock className="mr-1 size-3 text-primary" />
                  Switch Login
                </Button>
              </div>
            </div>

            {/* Mobile Tab Pills */}
            <nav aria-label="Dashboard mobile navigation" className="hide-scrollbar flex gap-1.5 overflow-x-auto border-t border-border/60 bg-secondary/20 px-4 py-2 lg:hidden">
              {roleNavigation.map(({ slug, label }) => (
                <Link
                  key={slug}
                  href={`/dashboard/${slug}`}
                  aria-current={role === slug ? "page" : undefined}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                    role === slug
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </header>

          {/* Main Dashboard Canvas */}
          <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 pb-14 pt-6 sm:px-6 lg:px-8 lg:pt-8">
            {children}
          </main>

          <footer className="border-t border-border/70 bg-card/20 px-4 py-4 text-center text-xs text-muted-foreground sm:px-6 lg:px-8">
            Rater khabar · Bashundhara R/A Operational Workspace (10 PM — 4 AM). All prices in BDT (৳).
          </footer>
        </div>
      </div>
    </div>
  )
}
