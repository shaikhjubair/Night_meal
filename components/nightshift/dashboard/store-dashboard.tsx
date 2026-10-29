"use client"

import { useEffect, useMemo, useState, type FormEvent } from "react"
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Clock3,
  Download,
  Flame,
  Package,
  Plus,
  Receipt,
  Sparkles,
  Store,
  Utensils,
  Wallet,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { downloadCsv } from "@/lib/download-csv"
import { formatCurrency, previewOrders, type PreviewOrder } from "@/lib/nightshift-data"
import {
  fetchLiveOrders,
  fetchStoreProducts,
  insertStoreProduct,
  updateOrderStatusInDb,
} from "@/lib/nightshift-service"

type MenuItem = { id: number; name: string; category: string; price: number; stock: number; available: boolean }

const initialMenu: MenuItem[] = [
  { id: 1, name: "Beef Khichuri", category: "Rice Items", price: 280, stock: 24, available: true },
  { id: 2, name: "Morog Polao", category: "Rice Items", price: 235, stock: 18, available: true },
  { id: 3, name: "Chicken Khichuri Boiler Murgi", category: "Rice Items", price: 199, stock: 20, available: true },
  { id: 4, name: "Chicken Chaap + Porota 2 piece", category: "Grill Items", price: 210, stock: 15, available: true },
  { id: 5, name: "Grilled Chicken + Porota 2 piece", category: "Grill Items", price: 199, stock: 16, available: true },
  { id: 6, name: "Chicken Shawarma", category: "Grill Items", price: 180, stock: 30, available: true },
  { id: 7, name: "Mineral Water 2 litre", category: "Beverages", price: 80, stock: 45, available: true },
  { id: 8, name: "Mishti Doi", category: "Beverages", price: 90, stock: 0, available: false },
]

export function StoreDashboard() {
  const [menu, setMenu] = useState<MenuItem[]>(initialMenu)
  const [addOpen, setAddOpen] = useState(false)
  const [newName, setNewName] = useState("")
  const [newCategory, setNewCategory] = useState("Rice Items")
  const [newPrice, setNewPrice] = useState("250")
  const [newStock, setNewStock] = useState("20")
  const [notice, setNotice] = useState("")
  const [activeTab, setActiveTab] = useState<"kitchen" | "menu" | "earnings">("kitchen")

  const [storeOrders, setStoreOrders] = useState<PreviewOrder[]>(previewOrders)

  useEffect(() => {
    async function loadData() {
      try {
        const liveOrders = await fetchLiveOrders()
        if (liveOrders && liveOrders.length > 0) {
          setStoreOrders(liveOrders)
        }

        const liveProducts = await fetchStoreProducts()
        if (liveProducts && liveProducts.length > 0) {
          setMenu(
            liveProducts.map((p, idx) => ({
              id: idx + 1,
              name: p.name,
              category: p.category,
              price: Number(p.price),
              stock: p.stock,
              available: p.is_available,
            })),
          )
        }
      } catch (e) {
        console.warn("Using baseline store data:", e)
      }
    }
    loadData()
  }, [])

  const grossSales = 186_400
  const feeRate = 8
  const platformFee = Math.round((grossSales * feeRate) / 100)
  const netPayout = grossSales - platformFee

  const preparingCount = storeOrders.filter((o) => o.status === "Preparing").length
  const readyCount = storeOrders.filter((o) => o.status === "Ready for pickup").length

  function addMenuItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!newName.trim()) return

    const createdItem: MenuItem = {
      id: Date.now(),
      name: newName.trim(),
      category: newCategory,
      price: Math.max(0, Number(newPrice)),
      stock: Math.max(0, Number(newStock)),
      available: true,
    }

    setMenu((current) => [createdItem, ...current])
    setNewName("")
    setNewPrice("250")
    setNewStock("20")
    setNotice(`"${createdItem.name}" published to menu.`)
    setAddOpen(false)

    insertStoreProduct({
      name: createdItem.name,
      category: createdItem.category,
      price: createdItem.price,
      stock: createdItem.stock,
    }).catch(console.warn)

    window.setTimeout(() => setNotice(""), 3500)
  }

  function toggleMenuItem(id: number) {
    setMenu((current) =>
      current.map((item) =>
        item.id === id ? { ...item, available: !item.available } : item,
      ),
    )
    const updated = menu.find((i) => i.id === id)
    setNotice(
      updated?.available
        ? `"${updated.name}" paused from orders.`
        : `"${updated?.name}" turned on in menu.`,
    )
    window.setTimeout(() => setNotice(""), 3000)
  }

  function advanceStoreOrder(orderId: string) {
    setStoreOrders((current) =>
      current.map((order) => {
        if (order.id !== orderId) return order
        const next =
          order.status === "Preparing"
            ? "Ready for pickup"
            : order.status === "Ready for pickup"
              ? "On the way"
              : "Delivered"
        return { ...order, status: next }
      }),
    )

    const target = storeOrders.find((o) => o.id === orderId)
    const nextStatus = target?.status === "Preparing" ? "Ready for pickup" : "On the way"
    updateOrderStatusInDb(orderId, nextStatus).catch(console.warn)

    setNotice(`Order ${orderId} marked as "${nextStatus}".`)
    window.setTimeout(() => setNotice(""), 3000)
  }

  function downloadOrdersCsv() {
    downloadCsv("rater-khabar-store-orders.csv", [
      ["Order ID", "Items", "Customer", "Block", "Status", "Amount in TK"],
      ...storeOrders.map((o) => [o.id, o.items, o.customer, o.block, o.status, o.amount]),
    ])
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* HIGH-END RESTAURANT KITCHEN HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-400">
              Merchant Kitchen Console
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-xs text-slate-400">Rater khabar Partner</span>
          </div>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Dhaba Night Outpost
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Live food preparation queue, dish inventory toggles, and nightly merchant settlement.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setActiveTab("menu")
              setAddOpen(true)
            }}
            className="h-9 rounded-xl border-white/10 bg-white/[0.04] text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/[0.08] backdrop-blur-xl transition-all"
          >
            <Plus className="mr-1.5 size-3.5" />
            Add Dish
          </Button>
          <Button
            size="sm"
            onClick={downloadOrdersCsv}
            className="h-9 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-xs font-bold text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:brightness-110 transition-all"
          >
            <Download className="mr-1.5 size-3.5" />
            Export Orders (CSV)
          </Button>
        </div>
      </div>

      {/* METRIC TILES WITH SOFT PADDING & BREATHING ROOM */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1 */}
        <div className="rounded-[24px] border border-white/[0.08] bg-slate-900/60 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.36)] backdrop-blur-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Tonight's Net Pay</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <Wallet className="size-4" />
            </div>
          </div>
          <p className="mt-3 font-mono text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
            {formatCurrency(netPayout)}
          </p>
          <p className="mt-2 text-[11px] text-slate-400">
            Net payout after 8% commission
          </p>
        </div>

        {/* Metric 2 */}
        <div className="rounded-[24px] border border-white/[0.08] bg-slate-900/60 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.36)] backdrop-blur-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Cooking Now</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <Flame className="size-4" />
            </div>
          </div>
          <p className="mt-3 font-mono text-2xl sm:text-3xl font-black text-white tracking-tight">
            {preparingCount} Orders
          </p>
          <p className="mt-2 text-[11px] text-slate-400">
            Requires stove preparation
          </p>
        </div>

        {/* Metric 3 */}
        <div className="rounded-[24px] border border-white/[0.08] bg-slate-900/60 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.36)] backdrop-blur-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Awaiting Courier</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <Clock3 className="size-4" />
            </div>
          </div>
          <p className="mt-3 font-mono text-2xl sm:text-3xl font-black text-white tracking-tight">
            {readyCount} Packed
          </p>
          <p className="mt-2 text-[11px] text-slate-400">
            Ready for rider pickup
          </p>
        </div>

        {/* Metric 4 */}
        <div className="rounded-[24px] border border-white/[0.08] bg-slate-900/60 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.36)] backdrop-blur-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Menu Items Live</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-slate-800 text-slate-300">
              <Utensils className="size-4" />
            </div>
          </div>
          <p className="mt-3 font-mono text-2xl sm:text-3xl font-black text-white tracking-tight">
            {menu.filter((m) => m.available).length} / {menu.length}
          </p>
          <p className="mt-2 text-[11px] text-slate-400">
            In stock on storefront
          </p>
        </div>
      </div>

      {notice && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs font-semibold text-emerald-200 backdrop-blur-xl">
          <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
          <span>{notice}</span>
        </div>
      )}

      {/* iOS STYLE SEGMENTED CONTROL */}
      <div className="inline-flex items-center gap-1.5 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-1.5 backdrop-blur-2xl">
        <button
          type="button"
          onClick={() => setActiveTab("kitchen")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "kitchen"
              ? "bg-white/[0.12] text-white shadow-sm border border-white/10"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Flame className="size-3.5" />
          <span>Kitchen Tickets ({storeOrders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("menu")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "menu"
              ? "bg-white/[0.12] text-white shadow-sm border border-white/10"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Utensils className="size-3.5" />
          <span>Menu Inventory ({menu.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("earnings")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "earnings"
              ? "bg-white/[0.12] text-white shadow-sm border border-white/10"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Wallet className="size-3.5" />
          <span>Shift Payout</span>
        </button>
      </div>

      {/* TAB 1: KITCHEN TICKETS LIST */}
      {activeTab === "kitchen" && (
        <div className="rounded-[24px] border border-white/[0.08] bg-slate-900/60 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.36)] backdrop-blur-2xl space-y-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.08] pb-4">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Active Kitchen Tickets</h2>
              <p className="text-xs text-slate-400 mt-0.5">Cook dishes promptly. Tap "Mark Ready" once bagged for the rider.</p>
            </div>
            <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl">
              Shift: 10 PM – 4 AM
            </span>
          </div>

          <div className="divide-y divide-white/[0.06]">
            {storeOrders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between hover:bg-white/[0.02] px-2 rounded-xl transition-colors"
              >
                <div className="flex items-start gap-4">
                  <span className="font-mono text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                    {order.id}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-white tracking-tight">{order.items}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Customer: {order.customer} · <span className="text-emerald-400 font-semibold">Block {order.block}</span> · {order.placed}
                    </p>
                    <p className="font-mono text-xs font-black text-emerald-400 mt-1">
                      {formatCurrency(order.amount)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
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

                  {order.status === "Preparing" ? (
                    <Button
                      size="sm"
                      onClick={() => advanceStoreOrder(order.id)}
                      className="h-8 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-xs font-bold text-white shadow-sm hover:brightness-110 transition-all"
                    >
                      <Check className="mr-1.5 size-3.5" />
                      Mark Ready
                    </Button>
                  ) : order.status === "Ready for pickup" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => advanceStoreOrder(order.id)}
                      className="h-8 rounded-xl border-white/10 bg-white/[0.04] text-xs font-semibold text-slate-200 hover:text-white"
                    >
                      Hand to Rider
                    </Button>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">Handoff complete</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MENU INVENTORY */}
      {activeTab === "menu" && (
        <div className="rounded-[24px] border border-white/[0.08] bg-slate-900/60 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.36)] backdrop-blur-2xl space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.08] pb-4">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Dish Inventory Stock</h2>
              <p className="text-xs text-slate-400 mt-0.5">Toggle dishes On/Off immediately if ingredients run low during the night.</p>
            </div>

            <Button
              size="sm"
              onClick={() => setAddOpen((v) => !v)}
              className="h-8 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-xs font-bold text-white"
            >
              <Plus className="mr-1.5 size-3.5" />
              Add Dish
            </Button>
          </div>

          {addOpen && (
            <form onSubmit={addMenuItem} className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-3">
              <p className="text-xs font-bold text-white">Add New Food Item</p>
              <div className="grid gap-3 sm:grid-cols-4">
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Dish name (e.g. Beef Khichuri)"
                  required
                  className="h-8 rounded-xl text-xs border-white/10 bg-slate-900 text-white"
                />
                <Select value={newCategory} onValueChange={(v) => v && setNewCategory(v)}>
                  <SelectTrigger className="h-8 rounded-xl text-xs border-white/10 bg-slate-900 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rice Items">Rice Items</SelectItem>
                    <SelectItem value="Grill Items">Grill Items</SelectItem>
                    <SelectItem value="Beverages">Beverages</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="Price in TK (৳)"
                  required
                  className="h-8 rounded-xl text-xs border-white/10 bg-slate-900 text-white"
                />
                <Input
                  type="number"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  placeholder="Portions available"
                  required
                  className="h-8 rounded-xl text-xs border-white/10 bg-slate-900 text-white"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setAddOpen(false)} className="h-7 text-xs text-slate-400">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="h-7 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white">
                  Publish Dish
                </Button>
              </div>
            </form>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {menu.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-2xl border border-white/[0.06] bg-black/30 p-4 transition-all hover:border-white/20"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-bold text-white line-clamp-1">{item.name}</p>
                    <span
                      className={`size-2 rounded-full shrink-0 mt-1 ${
                        item.available ? "bg-emerald-400" : "bg-red-400"
                      }`}
                    />
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-400">{item.category}</p>
                  <p className="mt-2 font-mono text-sm font-black text-emerald-400">
                    {formatCurrency(item.price)}
                  </p>
                </div>

                <div className="mt-3 border-t border-white/[0.06] pt-2.5 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {item.available ? `${item.stock} left` : "Sold Out"}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleMenuItem(item.id)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                      item.available
                        ? "bg-white/[0.08] text-slate-300 hover:text-white"
                        : "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                    }`}
                  >
                    {item.available ? "Pause Item" : "Enable Item"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SHIFT PAYOUT */}
      {activeTab === "earnings" && (
        <div className="rounded-[24px] border border-white/[0.08] bg-slate-900/60 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.36)] backdrop-blur-2xl space-y-6">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Restaurant Shift Payout</h2>
            <p className="text-xs text-slate-400 mt-0.5">Transparent breakdown of shift kitchen sales and automatic payout disbursement.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/[0.06] bg-black/40 p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Gross Food Sales</span>
              <p className="mt-2 font-mono text-xl font-black text-white">{formatCurrency(grossSales)}</p>
              <p className="mt-1 text-[11px] text-slate-400">100% kitchen sales</p>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-black/40 p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Platform Margin ({feeRate}%)</span>
              <p className="mt-2 font-mono text-xl font-black text-slate-300">{formatCurrency(platformFee)}</p>
              <p className="mt-1 text-[11px] text-slate-400">Rater khabar fee</p>
            </div>

            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Net Merchant Payout</span>
              <p className="mt-2 font-mono text-xl font-black text-emerald-400">{formatCurrency(netPayout)}</p>
              <p className="mt-1 text-[11px] text-slate-300">Direct transfer at 4:30 AM</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-black/40 p-4 text-xs text-slate-400 leading-relaxed">
            <p className="font-bold text-white mb-1">bKash Merchant Settlement</p>
            Net earnings are settled directly to Dhaba Night Outpost's verified merchant wallet (+880 1711-223344) at 4:30 AM right as the late-night shift ends.
          </div>
        </div>
      )}
    </div>
  )
}
