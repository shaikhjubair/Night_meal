import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export function DashboardHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
        <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight sm:text-3xl text-foreground">{title}</h1>
        <p className="mt-1.5 max-w-2xl text-xs sm:text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
      {action && <div className="flex flex-wrap items-center gap-2.5 shrink-0">{action}</div>}
    </div>
  )
}

export function MetricCard({
  label,
  value,
  note,
  trend,
  icon: Icon,
  direction = "up",
}: {
  label: string
  value: string
  note: string
  trend?: string
  icon: LucideIcon
  direction?: "up" | "down"
}) {
  const TrendIcon = direction === "up" ? ArrowUpRight : ArrowDownRight

  return (
    <Card className="rounded-[26px] border border-border/80 bg-card/65 p-0 shadow-md backdrop-blur-xl transition-all duration-300 hover:border-primary/40 hover:shadow-xl">
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="grid size-12 place-items-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-inner">
            <Icon aria-hidden="true" className="size-5" />
          </span>
          {trend && (
            <Badge
              variant="outline"
              className="gap-1 border-primary/30 bg-primary/10 text-[10px] font-bold text-primary px-2.5 py-0.5"
            >
              <TrendIcon aria-hidden="true" className="size-3" />
              {trend}
            </Badge>
          )}
        </div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="mt-1 font-mono text-2xl font-extrabold tracking-tight text-foreground tabular-nums sm:text-3xl">
          {value}
        </p>
        <p className="mt-1.5 text-[11px] text-muted-foreground font-medium">{note}</p>
      </CardContent>
    </Card>
  )
}

export function SectionHeading({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">{title}</h2>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="flex flex-wrap items-center gap-2">{action}</div>}
    </div>
  )
}
