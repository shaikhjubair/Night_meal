"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

export type SalesPoint = { day: string; sales: number }

const chartConfig = {
  sales: { label: "GMV (৳k)", color: "var(--chart-1)" },
} satisfies ChartConfig

const defaultData: SalesPoint[] = [
  { day: "Mon", sales: 142 },
  { day: "Tue", sales: 178 },
  { day: "Wed", sales: 162 },
  { day: "Thu", sales: 224 },
  { day: "Fri", sales: 296 },
  { day: "Sat", sales: 268 },
  { day: "Sun", sales: 342 },
]

export function SalesChart({ data = defaultData }: { data?: SalesPoint[] }) {
  return (
    <ChartContainer config={chartConfig} className="h-[230px] w-full aspect-auto">
      <AreaChart data={data} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="nightshift-sales-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-sales)" stopOpacity={0.32} />
            <stop offset="100%" stopColor="var(--color-sales)" stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 4" />
        <XAxis dataKey="day" axisLine={false} tickLine={false} tickMargin={9} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
        <Area dataKey="sales" type="monotone" stroke="var(--color-sales)" strokeWidth={2.5} fill="url(#nightshift-sales-fill)" activeDot={{ r: 4, strokeWidth: 0 }} />
      </AreaChart>
    </ChartContainer>
  )
}
