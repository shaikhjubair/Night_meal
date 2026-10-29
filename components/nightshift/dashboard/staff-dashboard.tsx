"use client"

import { useEffect, useMemo, useState } from "react"
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Bike,
  Check,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Download,
  MapPin,
  Search,
  Store,
  UserCheck,
  UsersRound,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { downloadCsv } from "@/lib/download-csv"
import { formatCurrency, previewOrders, type OrderStatus, type PreviewOrder } from "@/lib/nightshift-data"
import { fetchLiveOrders, updateOrderStatusInDb } from "@/lib/nightshift-service"

const riderOptions = [
  "Unassigned",
  "Rafi Islam (Zone 1)",
  "Samir Chowdhury (Zone 2)",
  "Mina Akter (Zone 1)",
  "Tanvir Hossain (Zone 3)",
  "Farhan Ahmed (Zone 4)",
]

function nextStatus(status: OrderStatus): OrderStatus {
  if (status === "Preparing") return "Ready for pickup"
  if (status === "Ready for pickup") return "On the way"
  if (status === "On the way") return "Delivered"
  return "Delivered"
}

export function StaffDashboard() {
  const [orders, setOrders] = useState<PreviewOrder[]>(previewOrders)
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [assignments, setAssignments] = useState<Record<string, string>>({
    "NS-9058": "Unassigned",
    "NS-9057": "Rafi Islam (Zone 1)",
    "NS-9056": "Mina Akter (Zone 1)",
    "NS-9055": "Samir Chowdhury (Zone 2)",
    "NS-9054": "Tanvir Hossain (Zone 3)",
    "NS-9053": "Unassigned",
    "NS-9052": "Rafi Islam (Zone 1)",
    "NS-9051": "Mina Akter (Zone 1)",
    "NS-9050": "Samir Chowdhury (Zone 2)",
  })
  const [notice, setNotice] = useState("")

  useEffect(() => {
    async function loadLiveOrders() {
      try {
        const live = await fetchLiveOrders()
        if (live && live.length > 0) {
          setOrders(live)
        }
      } catch (e) {
        console.warn("Using baseline staff orders:", e)
      }
    }
    loadLiveOrders()
  }, [])

  const filteredOrders = useMemo(() => {
    const q = query.trim().toLowerCase()
    return orders.filter((order) => {
      const matchesSearch =
        !q ||
        order.id.toLowerCase().includes(q) ||
        order.customer.toLowerCase().includes(q) ||
        order.vendor.toLowerCase().includes(q) ||
        order.block.toLowerCase().includes(q) ||
        order.items.toLowerCase().includes(q) ||
        (assignments[order.id] ?? "").toLowerCase().includes(q)

      const matchesStatus =
        statusFilter === "All"
          ? true
          : statusFilter === "Needs Dispatch"
            ? (assignments[order.id] ?? "Unassigned") === "Unassigned"
            : order.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [orders, query, statusFilter, assignments])

  const openOrdersCount = orders.filter((o) => o.status !== "Delivered").length
  const needsDispatchCount = orders.filter((o) => (assignments[o.id] ?? "Unassigned") === "Unassigned").length
  const inKitchenCount = orders.filter((o) => o.status === "Preparing").length
  const onRoadCount = orders.filter((o) => o.status === "On the way").length

  function updateOrder(orderId: string) {
    const target = orders.find((o) => o.id === orderId)
    if (!target) return
    const newStatus = nextStatus(target.status)

    setOrders((current) =>
      current.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order,
      ),
    )
    setNotice(`Order ${orderId} status advanced to "${newStatus}".`)
    updateOrderStatusInDb(orderId, newStatus).catch(console.warn)

    window.setTimeout(() => setNotice(""), 3500)
  }

  function assignRider(orderId: string, rider: string) {
    setAssignments((current) => ({ ...current, [orderId]: rider }))
    setNotice(`${rider === "Unassigned" ? "Rider unassigned" : `Assigned ${rider}`} to order ${orderId}.`)
    window.setTimeout(() => setNotice(""), 3500)
  }

  function downloadQueueCsv() {
    downloadCsv("rater-khabar-dispatch-queue.csv", [
      ["Order ID", "Customer", "Vendor", "Delivery Block", "Assigned Rider", "Status", "Amount (BDT)", "Placed Time"],
      ...orders.map((order) => [
        order.id,
        order.customer,
        order.vendor,
        order.block,
        assignments[order.id] ?? "Unassigned",
        order.status,
        order.amount,
        order.placed,
      ]),
    ])
  }

  function handlePingOps() {
    setNotice("Priority broadcast alert sent to all active couriers across Bashundhara R/A.")
    window.setTimeout(() => setNotice(""), 3500)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* HIGH-END OPERATIONS DISPATCH HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-400">
              Operations Dispatch
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-xs text-slate-400">Rater khabar Fleet Control</span>
          </div>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Staff Dispatch Hub
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Real-time courier allocation, kitchen preparation tracking, and neighborhood gate clearance.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePingOps}
            className="h-9 rounded-xl border-white/10 bg-white/[0.04] text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/[0.08] backdrop-blur-xl transition-all"
          >
            <Bell className="mr-1.5 size-3.5 text-amber-400" />
            Alert Fleet
          </Button>
          <Button
            size="sm"
            onClick={downloadQueueCsv}
            className="h-9 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-xs font-bold text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:brightness-110 transition-all"
          >
            <Download className="mr-1.5 size-3.5" />
            Export Queue (CSV)
          </Button>
        </div>
      </div>

      {/* METRIC TILES WITH SOFT PADDING & BREATHING ROOM */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1 */}
        <div className="rounded-[24px] border border-white/[0.08] bg-slate-900/60 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.36)] backdrop-blur-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Queue</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <ClipboardList className="size-4" />
            </div>
          </div>
          <p className="mt-3 font-mono text-2xl sm:text-3xl font-black text-white tracking-tight">
            {openOrdersCount} Orders
          </p>
          <p className="mt-2 text-[11px] text-slate-400">
            Currently in delivery pipeline
          </p>
        </div>

        {/* Metric 2 */}
        <div className="rounded-[24px] border border-white/[0.08] bg-slate-900/60 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.36)] backdrop-blur-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Needs Rider</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <AlertTriangle className="size-4" />
            </div>
          </div>
          <p className="mt-3 font-mono text-2xl sm:text-3xl font-black text-amber-400 tracking-tight">
            {needsDispatchCount} Unassigned
          </p>
          <p className="mt-2 text-[11px] text-slate-400">
            Awaiting courier assignment
          </p>
        </div>

        {/* Metric 3 */}
        <div className="rounded-[24px] border border-white/[0.08] bg-slate-900/60 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.36)] backdrop-blur-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">In Kitchen</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <Store className="size-4" />
            </div>
          </div>
          <p className="mt-3 font-mono text-2xl sm:text-3xl font-black text-white tracking-tight">
            {inKitchenCount} Cooking
          </p>
          <p className="mt-2 text-[11px] text-slate-400">
            Food prep underway
          </p>
        </div>

        {/* Metric 4 */}
        <div className="rounded-[24px] border border-white/[0.08] bg-slate-900/60 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.36)] backdrop-blur-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">On the Road</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <Bike className="size-4" />
            </div>
          </div>
          <p className="mt-3 font-mono text-2xl sm:text-3xl font-black text-purple-300 tracking-tight">
            {onRoadCount} En Route
          </p>
          <p className="mt-2 text-[11px] text-slate-400">
            Riders delivering to block gates
          </p>
        </div>
      </div>

      {notice && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs font-semibold text-emerald-200 backdrop-blur-xl">
          <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
          <span>{notice}</span>
        </div>
      )}

      {/* DISPATCH QUEUE - SPACIOUS & GLASSMORPHIC */}
      <div className="rounded-[24px] border border-white/[0.08] bg-slate-900/60 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.36)] backdrop-blur-2xl space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.08] pb-4">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Courier Allocation & Status Queue</h2>
            <p className="text-xs text-slate-400 mt-0.5">Assign riders to active orders and clear delivery bottlenecks</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative w-full sm:w-60">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search orders, riders..."
                className="h-8 rounded-xl pl-8 text-xs border-white/10 bg-black/40 text-white placeholder:text-slate-500"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-1">
              {["All", "Needs Dispatch", "Preparing", "Ready for pickup", "On the way", "Delivered"].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                    statusFilter === st
                      ? "bg-white/[0.12] text-white border border-white/10"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="divide-y divide-white/[0.06]">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              const assignedRider = assignments[order.id] ?? "Unassigned"
              const isUnassigned = assignedRider === "Unassigned"

              return (
                <div
                  key={order.id}
                  className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between hover:bg-white/[0.02] px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    <span className="font-mono text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                      {order.id}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-white">{order.vendor}</p>
                        <span className="rounded-full bg-white/[0.06] border border-white/[0.08] px-2 py-0.2 text-[10px] font-bold text-slate-300">
                          Block {order.block}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">{order.items}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {order.customer} · {order.placed}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {/* Rider Assign Dropdown */}
                    <div className="w-48">
                      <Select
                        value={assignedRider}
                        onValueChange={(val) => val && assignRider(order.id, val)}
                      >
                        <SelectTrigger
                          className={`h-8 rounded-xl text-xs border ${
                            isUnassigned
                              ? "border-amber-500/40 bg-amber-500/15 text-amber-200 font-bold"
                              : "border-white/10 bg-black/40 text-white"
                          }`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {riderOptions.map((rider) => (
                            <SelectItem key={rider} value={rider} className="text-xs">
                              {rider}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Badge
                      variant="outline"
                      className={`text-[10px] font-semibold border-0 ${
                        order.status === "Delivered"
                          ? "bg-slate-800 text-slate-400"
                          : order.status === "On the way"
                            ? "bg-blue-500/15 text-blue-300"
                            : order.status === "Ready for pickup"
                              ? "bg-purple-500/15 text-purple-300"
                              : "bg-amber-500/15 text-amber-300"
                      }`}
                    >
                      {order.status}
                    </Badge>

                    {order.status !== "Delivered" ? (
                      <Button
                        size="sm"
                        onClick={() => updateOrder(order.id)}
                        className="h-8 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-xs font-bold text-white shadow-sm hover:brightness-110 transition-all"
                      >
                        <ArrowRight className="mr-1 size-3.5" />
                        Advance
                      </Button>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">Delivered</span>
                    )}
                  </div>
                </div>
              )
            })
          ) : (
            <p className="py-8 text-center text-xs text-slate-400">
              No orders found matching your filter criteria.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
