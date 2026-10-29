"use client"

import { useState } from "react"
import {
  AlertTriangle,
  ArrowRight,
  Bike,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Download,
  MapPin,
  Navigation,
  Package,
  PackageCheck,
  Phone,
  Power,
  ShieldCheck,
  Store,
  Wallet,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RoutePreview } from "@/components/nightshift/route-preview"
import { downloadCsv } from "@/lib/download-csv"
import { formatCurrency } from "@/lib/nightshift-data"

type DeliveryStep = "offered" | "accepted" | "picked-up" | "delivered"

type DeliveryHandoff = {
  id: string
  store: string
  block: string
  time: string
  status: string
  pay: number
}

const initialHandoffs: DeliveryHandoff[] = [
  { id: "NS-9055", store: "Dhaba Night Outpost", block: "L", time: "11:42 PM", status: "Delivered", pay: 160 },
  { id: "NS-9051", store: "Block G Charcoal Corner", block: "K", time: "11:15 PM", status: "Delivered", pay: 150 },
  { id: "NS-9049", store: "Bashundhara Kitchen", block: "A", time: "10:52 PM", status: "Delivered", pay: 140 },
  { id: "NS-9048", store: "Dhaba Night Outpost", block: "G", time: "10:44 PM", status: "Delivered", pay: 140 },
  { id: "NS-9047", store: "Corner Stop Hub", block: "A", time: "10:30 PM", status: "Delivered", pay: 140 },
]

export function RiderDashboard() {
  const [online, setOnline] = useState(true)
  const [step, setStep] = useState<DeliveryStep>("accepted")
  const [notice, setNotice] = useState("")
  const [handoffs, setHandoffs] = useState<DeliveryHandoff[]>(initialHandoffs)
  const [earnings, setEarnings] = useState(1240)
  const [completedCount, setCompletedCount] = useState(9)
  const [cigarettePurchased, setCigarettePurchased] = useState(false)

  function advanceDelivery() {
    if (!online) {
      setNotice("You are currently offline. Tap Online to accept deliveries.")
      window.setTimeout(() => setNotice(""), 3000)
      return
    }

    if (step === "offered") {
      setStep("accepted")
      setNotice("Order accepted! Head to Block G Charcoal Corner.")
    } else if (step === "accepted") {
      setStep("picked-up")
      setNotice("Pickup confirmed! Navigating to customer at Block A Gate 2.")
    } else if (step === "picked-up") {
      setStep("delivered")
      const tripPay = 180
      setEarnings((prev) => prev + tripPay)
      setCompletedCount((prev) => prev + 1)
      setHandoffs((current) => [
        {
          id: "NS-9057",
          store: "Block G Charcoal Corner",
          block: "A",
          time: "Just now",
          status: "Delivered",
          pay: tripPay,
        },
        ...current.filter((h) => h.id !== "NS-9057"),
      ])
      setNotice("Drop confirmed! ৳180 added to your shift wallet.")
    }

    window.setTimeout(() => setNotice(""), 3500)
  }

  function resetToNewOffer() {
    setStep("offered")
    setCigarettePurchased(false)
    setNotice("New delivery offer assigned: Block A Gate 2.")
    window.setTimeout(() => setNotice(""), 3000)
  }

  function downloadHandoffsCsv() {
    downloadCsv("rater-khabar-rider-handoffs.csv", [
      ["Order ID", "Store / Kitchen", "Delivery Block", "Completion Time", "Status", "Earnings (BDT)"],
      ...handoffs.map((h) => [h.id, h.store, h.block, h.time, h.status, h.pay]),
    ])
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-24 lg:pb-8">
      {/* NATIVE iOS / MODERN SAAS TOP BAR */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-[24px] border border-white/[0.08] bg-slate-900/60 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.36)] backdrop-blur-2xl">
        <div className="flex items-center gap-3.5">
          <div className="relative flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-400 shadow-inner">
            <Bike className="size-6" />
            <span
              className={`absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full border-2 border-slate-900 ${
                online ? "bg-emerald-400" : "bg-slate-500"
              }`}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight">Rafi Islam</h1>
              <span className="rounded-full bg-white/[0.06] border border-white/[0.08] px-2 py-0.5 text-[10px] font-mono text-slate-300">
                #RDR-108
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Rater khabar Courier · Bashundhara Fleet (Zone 1)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Shift Wallet Pill */}
          <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 backdrop-blur-xl">
            <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <Wallet className="size-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-none">
                Shift Wallet
              </p>
              <p className="font-mono text-sm font-black text-emerald-400 mt-1 leading-none">
                {formatCurrency(earnings)}
              </p>
            </div>
          </div>

          {/* Drops Pill */}
          <div className="hidden sm:flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 backdrop-blur-xl">
            <div className="flex size-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <PackageCheck className="size-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-none">
                Completed
              </p>
              <p className="font-mono text-sm font-bold text-white mt-1 leading-none">
                {completedCount} Drops
              </p>
            </div>
          </div>

          {/* Online/Offline Modern Switch */}
          <button
            type="button"
            onClick={() => {
              setOnline((v) => !v)
              setNotice(!online ? "You are now ONLINE. Orders incoming." : "You are now OFFLINE.")
              window.setTimeout(() => setNotice(""), 3000)
            }}
            className={`flex items-center gap-2.5 rounded-2xl px-5 py-2.5 text-xs font-bold transition-all duration-200 active:scale-95 ${
              online
                ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.35)]"
                : "border border-white/10 bg-white/[0.04] text-slate-400 hover:text-white"
            }`}
          >
            <span className={`size-2 rounded-full ${online ? "bg-white animate-pulse" : "bg-slate-500"}`} />
            <span>{online ? "ONLINE" : "OFFLINE"}</span>
          </button>
        </div>
      </div>

      {notice && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs font-semibold text-emerald-200 backdrop-blur-xl animate-in fade-in slide-in-from-top-1">
          <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
          <span>{notice}</span>
        </div>
      )}

      {/* CENTRAL COCKPIT: REALISTIC DARK MAP + ACTIVE TRIP CARD */}
      <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr] items-start">
        {/* MAP CONTAINER - HERO OF THE RIDER DASHBOARD */}
        <div className="rounded-[24px] border border-white/[0.08] bg-slate-900/60 p-2 sm:p-3 shadow-[0_8px_32px_rgba(0,0,0,0.36)] backdrop-blur-2xl">
          <RoutePreview
            moving={online && step !== "delivered"}
            destinationBlock="A"
            vendorName="Block G Charcoal Corner"
            riderName="Rafi Islam"
            orderId="NS-9057"
            mode="rider"
          />
        </div>

        {/* ACTIVE TRIP DETAILS & PROCUREMENT */}
        <div className="space-y-5">
          <div className="rounded-[24px] border border-white/[0.08] bg-slate-900/60 p-5 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.36)] backdrop-blur-2xl space-y-5">
            {/* Order Header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Active Mission
                </span>
                <p className="font-mono text-sm font-black text-white">#NS-9057</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Guaranteed Pay
                </span>
                <p className="font-mono text-base font-black text-emerald-400">৳180</p>
              </div>
            </div>

            {/* Stepper Status Pill */}
            <div className="flex items-center gap-2 rounded-xl bg-white/[0.03] border border-white/[0.06] p-2.5 text-xs">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-white">
                {step === "offered" && "New Offer: Tap Accept to Begin"}
                {step === "accepted" && "Step 1: Heading to Kitchen Pickup"}
                {step === "picked-up" && "Step 2: On Route to Customer Gate"}
                {step === "delivered" && "Step 3: Drop Completed"}
              </span>
            </div>

            {/* Pickup & Destination Timeline */}
            <div className="space-y-4 rounded-2xl border border-white/[0.06] bg-black/40 p-4">
              {/* Pickup Point */}
              <div className="flex items-start gap-3">
                <div className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 ring-2 ring-blue-500/30">
                  <Store className="size-3" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-white">Block G Charcoal Corner</p>
                    <span className="text-[10px] text-slate-400">Pickup</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Road 11, Block G, Bashundhara R/A</p>
                </div>
              </div>

              {/* Connecting line */}
              <div className="ml-2.5 -my-2 h-4 border-l border-dashed border-white/20" />

              {/* Drop Point */}
              <div className="flex items-start gap-3">
                <div className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500/30">
                  <MapPin className="size-3" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-white">Block A Gate 2 Checkpoint</p>
                    <span className="text-[10px] text-emerald-400 font-semibold">Dropoff</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Customer: Rafi H. · Security Checkpoint</p>
                </div>
              </div>
            </div>

            {/* Quick Call Customer Button */}
            <div className="flex items-center gap-2">
              <a
                href="tel:+8801712345678"
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] py-2.5 text-xs font-bold text-slate-200 hover:bg-white/[0.08] hover:text-white transition-all active:scale-95"
              >
                <Phone className="size-3.5 text-emerald-400" />
                Call Customer Gate
              </a>
            </div>

            {/* Order Items to Deliver */}
            <div className="rounded-2xl border border-white/[0.06] bg-black/40 p-3.5 text-xs space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Package Contents
              </span>
              <p className="text-slate-200 font-medium">1× Chicken Chaap + Porota 2 piece</p>
              <p className="text-amber-300 font-medium">1× Benson (Regular) Cigarette Pack</p>
            </div>

            {/* Benson Cigarette Procurement Card */}
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-amber-300">
                <AlertTriangle className="size-4 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Rider Item to Buy
                </span>
              </div>
              <p className="text-xs text-amber-100/90 leading-relaxed">
                Purchase 1 pack Benson (Regular) from nearest store on route.
              </p>
              <button
                type="button"
                onClick={() => setCigarettePurchased((v) => !v)}
                className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all duration-200 active:scale-95 ${
                  cigarettePurchased
                    ? "bg-amber-400 text-slate-950 shadow-md"
                    : "border border-amber-500/40 bg-amber-500/20 text-amber-200 hover:bg-amber-500/30"
                }`}
              >
                <Check className="size-3.5" />
                {cigarettePurchased ? "Benson Purchased ✓" : "Tap: Confirm Bought on Route"}
              </button>
            </div>

            {/* DESKTOP ACTION BUTTON */}
            <div className="hidden lg:block pt-1">
              {step === "offered" && (
                <Button
                  onClick={advanceDelivery}
                  className="h-14 w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-black text-sm tracking-wide shadow-[0_0_24px_rgba(16,185,129,0.4)] hover:brightness-110 active:scale-95 transition-all"
                >
                  ACCEPT DELIVERY OFFER · ৳180
                </Button>
              )}
              {step === "accepted" && (
                <Button
                  onClick={advanceDelivery}
                  className="h-14 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-black text-sm tracking-wide shadow-[0_0_24px_rgba(59,130,246,0.4)] hover:brightness-110 active:scale-95 transition-all"
                >
                  CONFIRM PICKUP AT RESTAURANT
                </Button>
              )}
              {step === "picked-up" && (
                <Button
                  onClick={advanceDelivery}
                  className="h-14 w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-black text-sm tracking-wide shadow-[0_0_24px_rgba(16,185,129,0.4)] hover:brightness-110 active:scale-95 transition-all"
                >
                  CONFIRM DELIVERED AT GATE
                </Button>
              )}
              {step === "delivered" && (
                <Button
                  onClick={resetToNewOffer}
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.08] hover:bg-white/[0.12] text-white font-bold text-sm tracking-wide active:scale-95 transition-all"
                >
                  READY FOR NEXT ORDER
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* COMPLETED DELIVERIES & SHIFT SUMMARY CARDS */}
      <div className="grid gap-6 md:grid-cols-[1fr_1.6fr]">
        {/* Shift Settlement Details */}
        <div className="rounded-[24px] border border-white/[0.08] bg-slate-900/60 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.36)] backdrop-blur-2xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Shift Settlement</h3>
            <p className="text-xs text-slate-400 mt-0.5">Night shift rates (10 PM – 4 AM)</p>
          </div>

          <div className="space-y-3 text-xs pt-1">
            <div className="flex justify-between text-slate-300">
              <span>Base Delivery Pay ({completedCount} drops)</span>
              <span className="font-mono font-bold text-white">{formatCurrency(completedCount * 100)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Night Shift Bonus</span>
              <span className="font-mono font-bold text-white">{formatCurrency(earnings - completedCount * 100)}</span>
            </div>
            <div className="flex justify-between border-t border-white/[0.08] pt-3 text-sm font-bold">
              <span className="text-white">Total Wallet Balance</span>
              <span className="font-mono text-emerald-400 text-lg font-black">{formatCurrency(earnings)}</span>
            </div>
          </div>

          <p className="rounded-xl border border-white/[0.06] bg-black/40 p-3 text-[11px] text-slate-400 leading-relaxed">
            Earnings settle automatically to your registered bKash/Nagad wallet at 4:30 AM after shift completion.
          </p>
        </div>

        {/* Completed Drops Log */}
        <div className="rounded-[24px] border border-white/[0.08] bg-slate-900/60 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.36)] backdrop-blur-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Completed Drops</h3>
              <p className="text-xs text-slate-400 mt-0.5">Recent drop-offs tonight</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadHandoffsCsv}
              className="h-8 rounded-xl border-white/10 bg-white/[0.04] text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/[0.08]"
            >
              <Download className="mr-1.5 size-3.5" />
              Export Pay Slip
            </Button>
          </div>

          <div className="divide-y divide-white/[0.06]">
            {handoffs.map((h) => (
              <div key={h.id} className="flex items-center justify-between py-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white">{h.id}</span>
                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-400">
                      Block {h.block}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{h.store} · {h.time}</p>
                </div>
                <span className="font-mono text-sm font-black text-emerald-400">
                  {formatCurrency(h.pay)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MOBILE FIXED BOTTOM ACTION BAR (UBER EATS / FOODPANDA STYLE) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-white/[0.1] bg-[#07090e]/95 p-3.5 backdrop-blur-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.6)]">
        <div className="mx-auto max-w-md">
          {step === "offered" && (
            <button
              type="button"
              onClick={advanceDelivery}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-black text-base shadow-[0_0_24px_rgba(16,185,129,0.5)] active:scale-95 transition-all"
            >
              <Check className="size-5" />
              <span>ACCEPT ORDER · ৳180</span>
            </button>
          )}

          {step === "accepted" && (
            <button
              type="button"
              onClick={advanceDelivery}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-black text-base shadow-[0_0_24px_rgba(59,130,246,0.5)] active:scale-95 transition-all"
            >
              <PackageCheck className="size-5" />
              <span>CONFIRM PICKUP AT RESTAURANT</span>
            </button>
          )}

          {step === "picked-up" && (
            <button
              type="button"
              onClick={advanceDelivery}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-black text-base shadow-[0_0_24px_rgba(16,185,129,0.5)] active:scale-95 transition-all"
            >
              <CheckCircle2 className="size-5" />
              <span>CONFIRM DELIVERED AT GATE</span>
            </button>
          )}

          {step === "delivered" && (
            <button
              type="button"
              onClick={resetToNewOffer}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.08] text-white font-black text-base active:scale-95 transition-all"
            >
              <span>READY FOR NEXT ORDER</span>
              <ArrowRight className="size-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
