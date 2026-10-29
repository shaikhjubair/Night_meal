"use client"

import { useEffect, useMemo, useState, type FormEvent } from "react"
import {
  ArrowUpRight,
  Bike,
  Check,
  CheckCircle2,
  Clock3,
  Download,
  FileDown,
  Lock,
  Plus,
  Receipt,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  TrendingUp,
  UserCheck,
  Users,
  Wallet,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { downloadCsv } from "@/lib/download-csv"
import { formatCurrency, previewOrders, type PreviewOrder } from "@/lib/nightshift-data"
import { fetchLiveOrders } from "@/lib/nightshift-service"

type TeamMember = { id: number; name: string; email: string; role: string; active: boolean }

const initialTeam: TeamMember[] = [
  { id: 1, name: "Farhan Chowdhury", email: "farhan@raterkhabar.express", role: "Super Admin", active: true },
  { id: 2, name: "Mina Rahman", email: "mina@raterkhabar.express", role: "Operations Lead", active: true },
  { id: 3, name: "Farid Hossain", email: "farid@raterkhabar.express", role: "Staff Dispatcher", active: true },
  { id: 4, name: "Tania Ahmed", email: "tania@dhaba.express", role: "Store Manager", active: true },
  { id: 5, name: "Rafi Islam", email: "rafi@raterkhabar.express", role: "Zone 1 Rider", active: true },
  { id: 6, name: "Samir Chowdhury", email: "samir@raterkhabar.express", role: "Zone 2 Rider", active: true },
  { id: 7, name: "Nabila Karim", email: "nabila@cornerstop.express", role: "Vendor Lead", active: true },
  { id: 8, name: "Tanvir Hossain", email: "tanvir@raterkhabar.express", role: "Zone 3 Rider", active: false },
]

export function AdminDashboard() {
  const [feeRate, setFeeRate] = useState(8)
  const [feeMessage, setFeeMessage] = useState("")
  const [team, setTeam] = useState<TeamMember[]>(initialTeam)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteName, setInviteName] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("Staff")
  const [activeTab, setActiveTab] = useState<"orders" | "finance" | "team">("orders")
  const [orderSearch, setOrderSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  const [orders, setOrders] = useState<PreviewOrder[]>(previewOrders)

  useEffect(() => {
    async function loadLiveOrders() {
      try {
        const live = await fetchLiveOrders()
        if (live && live.length > 0) {
          setOrders(live)
        }
      } catch (err) {
        console.warn("Using baseline orders:", err)
      }
    }
    loadLiveOrders()
  }, [])

  const totalGmv = 2_870_450
  const platformRevenue = Math.round((totalGmv * feeRate) / 100)
  const vendorPayouts = totalGmv - platformRevenue

  const filteredOrders = useMemo(() => {
    const q = orderSearch.trim().toLowerCase()
    return orders.filter((o) => {
      const matchesSearch =
        !q ||
        o.id.toLowerCase().includes(q) ||
        o.vendor.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.block.toLowerCase().includes(q) ||
        o.items.toLowerCase().includes(q) ||
        o.status.toLowerCase().includes(q)
      const matchesStatus = statusFilter === "All" || o.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [orders, orderSearch, statusFilter])

  function saveFee(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFeeMessage(`Commission policy updated: ${feeRate}% platform fee applied.`)
    window.setTimeout(() => setFeeMessage(""), 3500)
  }

  function stageInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!inviteName.trim() || !inviteEmail.trim()) return

    const newMember: TeamMember = {
      id: Date.now(),
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      active: true,
    }

    setTeam((current) => [...current, newMember])
    setInviteName("")
    setInviteEmail("")
    setInviteOpen(false)
  }

  function toggleAccess(id: number) {
    setTeam((current) =>
      current.map((member) =>
        member.id === id ? { ...member, active: !member.active } : member,
      ),
    )
  }

  function handleExportOrdersCsv() {
    downloadCsv("rater-khabar-admin-orders.csv", [
      ["Order ID", "Vendor", "Customer", "Delivery Block", "Status", "Amount in TK (BDT)", "Placed Time", "ETA"],
      ...orders.map((order) => [
        order.id,
        order.vendor,
        order.customer,
        order.block,
        order.status,
        order.amount,
        order.placed,
        order.eta,
      ]),
    ])
  }

  function handleSavePdf() {
    window.print()
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* HIGH-END SAAS EXECUTIVE HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-400">
              Rater khabar Executive
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-xs text-slate-400">Bashundhara Operations</span>
          </div>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Admin Control Room
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Nightly GMV, vendor settlement reconciliation, live queue oversight, and staff access.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSavePdf}
            className="h-9 rounded-xl border-white/10 bg-white/[0.04] text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/[0.08] backdrop-blur-xl transition-all"
          >
            <FileDown className="mr-1.5 size-3.5" />
            PDF Export
          </Button>
          <Button
            size="sm"
            onClick={handleExportOrdersCsv}
            className="h-9 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-xs font-bold text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:brightness-110 transition-all"
          >
            <Download className="mr-1.5 size-3.5" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* SLEEK GLASSMORPHIIC METRIC TILES - WITH BREATHING ROOM */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1 */}
        <div className="rounded-[24px] border border-white/[0.08] bg-slate-900/60 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.36)] backdrop-blur-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Tonight's GMV</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="size-4" />
            </div>
          </div>
          <p className="mt-3 font-mono text-2xl sm:text-3xl font-black text-white tracking-tight">
            {formatCurrency(totalGmv)}
          </p>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
            <ArrowUpRight className="size-3" />
            <span>+12.6% vs last shift</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-[24px] border border-white/[0.08] bg-slate-900/60 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.36)] backdrop-blur-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Orders Processed</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <Receipt className="size-4" />
            </div>
          </div>
          <p className="mt-3 font-mono text-2xl sm:text-3xl font-black text-white tracking-tight">
            1,248
          </p>
          <p className="mt-2 text-[11px] text-slate-400">
            Across Blocks A to M
          </p>
        </div>

        {/* Metric 3 */}
        <div className="rounded-[24px] border border-white/[0.08] bg-slate-900/60 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.36)] backdrop-blur-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Platform Cut ({feeRate}%)</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <Wallet className="size-4" />
            </div>
          </div>
          <p className="mt-3 font-mono text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
            {formatCurrency(platformRevenue)}
          </p>
          <p className="mt-2 text-[11px] text-slate-400">
            Retained net margin
          </p>
        </div>

        {/* Metric 4 */}
        <div className="rounded-[24px] border border-white/[0.08] bg-slate-900/60 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.36)] backdrop-blur-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Kitchens</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <Store className="size-4" />
            </div>
          </div>
          <p className="mt-3 font-mono text-2xl sm:text-3xl font-black text-white tracking-tight">
            42 Stores
          </p>
          <p className="mt-2 text-[11px] text-slate-400">
            Open in Bashundhara
          </p>
        </div>
      </div>

      {/* NATIVE iOS STYLE SEGMENTED CONTROL */}
      <div className="inline-flex items-center gap-1.5 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-1.5 backdrop-blur-2xl">
        <button
          type="button"
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "orders"
              ? "bg-white/[0.12] text-white shadow-sm border border-white/10"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Receipt className="size-3.5" />
          <span>Live Orders ({orders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("finance")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "finance"
              ? "bg-white/[0.12] text-white shadow-sm border border-white/10"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Wallet className="size-3.5" />
          <span>Financials & Fees</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("team")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "team"
              ? "bg-white/[0.12] text-white shadow-sm border border-white/10"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Users className="size-3.5" />
          <span>Team Access ({team.length})</span>
        </button>
      </div>

      {/* TAB 1: LIVE ORDERS LIST */}
      {activeTab === "orders" && (
        <div className="rounded-[24px] border border-white/[0.08] bg-slate-900/60 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.36)] backdrop-blur-2xl space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.08] pb-4">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Active Delivery Pipeline</h2>
              <p className="text-xs text-slate-400 mt-0.5">Orders placed across Bashundhara residential blocks</p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative w-full sm:w-60">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
                <Input
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search order, block, customer..."
                  className="h-8 rounded-xl pl-8 text-xs border-white/10 bg-black/40 text-white placeholder:text-slate-500"
                />
              </div>

              {/* Status Filter Pills */}
              <div className="flex flex-wrap gap-1">
                {["All", "Preparing", "Ready for pickup", "On the way", "Delivered"].map((st) => (
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

          <div className="divide-y divide-white/[0.06] overflow-x-auto">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between hover:bg-white/[0.02] px-2 rounded-xl transition-colors"
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
                        {order.customer} {order.phone && `· +880 ${order.phone}`} · {order.placed}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-semibold border-0 ${
                        order.status === "Delivered"
                          ? "bg-emerald-500/15 text-emerald-300"
                          : order.status === "On the way"
                            ? "bg-blue-500/15 text-blue-300"
                            : order.status === "Ready for pickup"
                              ? "bg-purple-500/15 text-purple-300"
                              : "bg-amber-500/15 text-amber-300"
                      }`}
                    >
                      {order.status}
                    </Badge>
                    <span className="font-mono text-sm font-black text-white">
                      {formatCurrency(order.amount)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-xs text-slate-400">
                No orders match your filter criteria.
              </p>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: FINANCIALS & COMMISSION POLICY */}
      {activeTab === "finance" && (
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-[24px] border border-white/[0.08] bg-slate-900/60 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.36)] backdrop-blur-2xl space-y-6">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Shift Financial Reconciliation</h2>
              <p className="text-xs text-slate-400 mt-0.5">Nightly gross revenue split between restaurant partners and platform margin.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/[0.06] bg-black/40 p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Gross Sales</span>
                <p className="mt-2 font-mono text-xl font-black text-white">{formatCurrency(totalGmv)}</p>
                <p className="mt-1 text-[11px] text-slate-400">100% customer gross</p>
              </div>

              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Platform Margin ({feeRate}%)</span>
                <p className="mt-2 font-mono text-xl font-black text-emerald-400">{formatCurrency(platformRevenue)}</p>
                <p className="mt-1 text-[11px] text-slate-300">Rater khabar fee</p>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-black/40 p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Vendor Net</span>
                <p className="mt-2 font-mono text-xl font-black text-white">{formatCurrency(vendorPayouts)}</p>
                <p className="mt-1 text-[11px] text-slate-400">{100 - feeRate}% to restaurant outposts</p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-black/40 p-4 text-xs text-slate-400 leading-relaxed">
              <p className="font-bold text-white mb-1">Automated Settlement Window</p>
              Platform margins and restaurant balances are finalized nightly at 4:30 AM after the close of the 10 PM – 4 AM shift window. Payouts are transferred automatically via corporate bKash / bank transfer.
            </div>
          </div>

          {/* Commission Policy Adjustment Form */}
          <div className="rounded-[24px] border border-white/[0.08] bg-slate-900/60 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.36)] backdrop-blur-2xl space-y-4">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Platform Commission</h2>
              <p className="text-xs text-slate-400 mt-0.5">Adjust the platform percentage fee charged to merchant kitchens.</p>
            </div>

            <form onSubmit={saveFee} className="space-y-4 pt-2">
              <div>
                <label htmlFor="admin-fee-rate" className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Commission Percentage (%)
                </label>
                <div className="flex gap-2">
                  <Input
                    id="admin-fee-rate"
                    type="number"
                    min="1"
                    max="25"
                    value={feeRate}
                    onChange={(e) => setFeeRate(Number(e.target.value))}
                    className="h-9 rounded-xl font-mono text-sm font-bold border-white/10 bg-black/40 text-white"
                  />
                  <Button type="submit" size="sm" className="h-9 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-xs font-bold text-white">
                    Save Rate
                  </Button>
                </div>
                <span className="mt-1.5 text-[11px] text-slate-400 block">
                  Default platform fee is 8%. Vendor payouts recalculate automatically.
                </span>
              </div>

              {feeMessage && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-300">
                  <CheckCircle2 className="size-3.5 shrink-0" />
                  <span>{feeMessage}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: TEAM & STAFF DIRECTORY */}
      {activeTab === "team" && (
        <div className="rounded-[24px] border border-white/[0.08] bg-slate-900/60 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.36)] backdrop-blur-2xl space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.08] pb-4">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Operations Personnel</h2>
              <p className="text-xs text-slate-400 mt-0.5">Staff leads, dispatchers, and active couriers across Bashundhara R/A.</p>
            </div>

            <Button
              size="sm"
              onClick={() => setInviteOpen((v) => !v)}
              className="h-8 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/10 text-xs font-semibold text-white"
            >
              <Plus className="mr-1.5 size-3.5" />
              Add Staff Member
            </Button>
          </div>

          {inviteOpen && (
            <form onSubmit={stageInvite} className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-3">
              <p className="text-xs font-bold text-white">Add New Team Member</p>
              <div className="grid gap-3 sm:grid-cols-3">
                <Input
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="Full name"
                  required
                  className="h-8 rounded-xl text-xs border-white/10 bg-slate-900 text-white"
                />
                <Input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="name@raterkhabar.express"
                  required
                  className="h-8 rounded-xl text-xs border-white/10 bg-slate-900 text-white"
                />
                <Select value={inviteRole} onValueChange={(v) => v && setInviteRole(v)}>
                  <SelectTrigger className="h-8 rounded-xl text-xs border-white/10 bg-slate-900 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Super Admin">Super Admin</SelectItem>
                    <SelectItem value="Operations Lead">Operations Lead</SelectItem>
                    <SelectItem value="Staff Dispatcher">Staff Dispatcher</SelectItem>
                    <SelectItem value="Store Manager">Store Manager</SelectItem>
                    <SelectItem value="Zone Rider">Zone Rider</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setInviteOpen(false)} className="h-7 text-xs text-slate-400">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="h-7 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white">
                  Add Member
                </Button>
              </div>
            </form>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <div
                key={member.id}
                className="flex flex-col justify-between rounded-2xl border border-white/[0.06] bg-black/30 p-4 transition-all hover:border-white/20"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-white truncate">{member.name}</p>
                    <span
                      className={`size-2 rounded-full ${
                        member.active ? "bg-emerald-400" : "bg-slate-600"
                      }`}
                      title={member.active ? "Active" : "Paused"}
                    />
                  </div>
                  <p className="mt-0.5 font-mono text-[11px] text-slate-400 truncate">{member.email}</p>
                  <p className="mt-2 text-[11px] font-bold text-emerald-400">{member.role}</p>
                </div>

                <div className="mt-3 border-t border-white/[0.06] pt-2.5">
                  <button
                    type="button"
                    onClick={() => toggleAccess(member.id)}
                    className="w-full text-left text-[11px] font-medium text-slate-400 hover:text-white transition-colors"
                  >
                    {member.active ? "Pause access" : "Activate access"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
