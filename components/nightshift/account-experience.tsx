"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Bike,
  Clock3,
  MapPin,
  Navigation,
  PackageCheck,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BrandMark } from "@/components/nightshift/brand"
import { CustomerAuthDialog } from "@/components/nightshift/auth/customer-auth-dialog"
import { RoutePreview } from "@/components/nightshift/route-preview"
import {
  clearActiveCustomerPhone,
  formatCurrency,
  getActiveCustomerPhone,
  getDeliveryBlock,
  getOrdersByPhone,
  setActiveCustomerPhone,
  type PreviewOrder,
} from "@/lib/nightshift-data"

export function AccountExperience() {
  const searchParams = useSearchParams()
  const phoneParam = searchParams.get("phone")

  const [activePhone, setActivePhone] = useState<string | null>(null)
  const [orders, setOrders] = useState<PreviewOrder[]>([])
  const [progress, setProgress] = useState(62)
  const [liveEta, setLiveEta] = useState("14 min")
  const [authModalOpen, setAuthModalOpen] = useState(false)

  useEffect(() => {
    // Resolve active customer phone number
    const resolvedPhone = phoneParam || getActiveCustomerPhone() || "1711000005"
    setActivePhone(resolvedPhone)
    if (resolvedPhone) {
      setActiveCustomerPhone(resolvedPhone)
      const userOrders = getOrdersByPhone(resolvedPhone)
      setOrders(userOrders)
    }
  }, [phoneParam])

  const currentOrder = orders[0] ?? {
    id: "NS-9058",
    customer: "Ayesha R.",
    phone: activePhone || "1711000005",
    address: "Road 11, Block G, Gate 2",
    block: "G",
    vendor: "Dhaba Night Outpost",
    items: "Beef Khichuri × 1, Coca-cola × 1",
    amount: 400,
    status: "Preparing",
    placed: "12:14 AM",
    eta: "14 min",
  }
  const orderHistory = orders.slice(1)
  const blockFee = getDeliveryBlock(currentOrder.block).fee

  function handleSignOutPhone() {
    clearActiveCustomerPhone()
    setActivePhone(null)
    setOrders([])
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/70 bg-background/85">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-10">
          <BrandMark />
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="hidden rounded-full sm:inline-flex"
              nativeButton={false}
              render={<Link href="/" />}
            >
              <ArrowLeft data-icon="inline-start" aria-hidden="true" />
              Back to store
            </Button>
            {activePhone ? (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary font-mono text-xs">
                  <Phone className="mr-1 size-3" />
                  +880 {activePhone}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 rounded-full text-xs text-muted-foreground hover:text-foreground"
                  onClick={handleSignOutPhone}
                >
                  Change number
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                className="rounded-full font-semibold"
                onClick={() => setAuthModalOpen(true)}
              >
                <UserRound data-icon="inline-start" aria-hidden="true" />
                Track with mobile OTP
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-10 lg:pt-11">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-primary">
              <Navigation aria-hidden="true" className="size-4" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">Customer Space</span>
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Live Order & GPS Tracking
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Real-time rider position, delivery updates, and order history linked to your mobile number.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-primary/25 bg-primary/5 text-primary">
              Serving Block {currentOrder.block}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full text-xs"
              onClick={() => setAuthModalOpen(true)}
            >
              <Phone className="mr-1.5 size-3 text-primary" />
              Lookup Another Order
            </Button>
          </div>
        </div>

        <div className="mt-7 grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)]">
          {/* Active Live Order & GPS Tracking Card */}
          <Card className="rounded-[26px] border-border/70 bg-card/65 p-0 shadow-xl">
            <CardHeader className="flex flex-row items-start justify-between gap-3 px-5 pb-3 pt-5 sm:px-6 sm:pt-6">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg font-bold">On Its Way</CardTitle>
                  <Badge variant="secondary" className="gap-1.5 font-semibold">
                    <span className="size-1.5 rounded-full bg-primary animate-pulse" aria-hidden="true" />
                    Live Rider GPS
                  </Badge>
                </div>
                <CardDescription className="mt-1 font-medium">
                  Order <span className="font-mono text-primary font-bold">{currentOrder.id}</span> · {currentOrder.vendor}
                </CardDescription>
              </div>
              <span className="hidden rounded-2xl border border-border/70 bg-secondary/50 px-3.5 py-2 text-right sm:block">
                <span className="block text-[9px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  ETA
                </span>
                <span className="mt-0.5 block text-base font-bold text-primary font-mono">{liveEta}</span>
              </span>
            </CardHeader>
            <CardContent className="px-5 pb-5 sm:px-6 sm:pb-6">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(220px,0.75fr)]">
                {/* Real-time Interactive Map Simulation / Live WebSocket Stream */}
                <RoutePreview
                  destinationBlock={currentOrder.block}
                  vendorName={currentOrder.vendor}
                  orderId={currentOrder.id}
                  mode="customer"
                  onProgressChange={(pct, eta) => {
                    setProgress(pct)
                    setLiveEta(eta)
                  }}
                />
                <div className="flex flex-col justify-between gap-5 rounded-2xl border border-border/70 bg-background/55 p-4">
                  <div>
                    <div className="flex items-center gap-2 text-primary">
                      <Clock3 aria-hidden="true" className="size-4" />
                      <span className="text-xs font-semibold">Estimated Arrival</span>
                    </div>
                    <p className="mt-2 text-3xl font-bold tracking-tight font-mono text-foreground">{liveEta}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Rider heading towards Block {currentOrder.block} Gate.
                    </p>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground">Order Progress</span>
                      <span className="text-primary font-bold">
                        {progress >= 95 ? "Arrived" : progress >= 40 ? "On the way" : "Preparing"}
                      </span>
                    </div>
                    <Progress value={progress} className="h-1.5" aria-label="Order progress preview" />
                  </div>
                  <div className="rounded-xl border border-border/70 bg-secondary/45 p-3 text-[11px] leading-relaxed text-muted-foreground space-y-1">
                    <p>
                      <span className="font-semibold text-foreground">Items:</span> {currentOrder.items}
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Total:</span>{" "}
                      <span className="font-mono text-primary font-bold">{formatCurrency(currentOrder.amount)}</span>
                    </p>
                    {(currentOrder.hasCigarettes || /marlboro|benson|goldleaf|oris|lucky strike|camel|cigarette/i.test(currentOrder.items)) && (
                      <div className="mt-2 flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/15 p-2 text-[10px] text-amber-200 font-semibold">
                        <Bike className="size-3.5 text-amber-400 shrink-0" />
                        <span>Rider Action Required: Rider must purchase this item on the way to the customer.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Profile & Mobile Lookup Card */}
          <Card className="rounded-[26px] border-border/70 bg-card/65 p-0">
            <CardHeader className="px-5 pb-3 pt-5 sm:px-6 sm:pt-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-lg font-bold">Customer Session</CardTitle>
                  <CardDescription className="mt-1 text-xs">
                    {activePhone
                      ? `Verified with mobile number +880 ${activePhone}`
                      : "Look up orders with your mobile number"}
                  </CardDescription>
                </div>
                <span className="grid size-11 place-items-center rounded-2xl bg-secondary text-primary">
                  <UserRound aria-hidden="true" className="size-5" />
                </span>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5 sm:px-6 sm:pb-6 space-y-3.5">
              <div className="rounded-2xl border border-border/70 bg-background/45 p-4 space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Active Drop Zone
                </p>
                <p className="text-sm font-semibold text-foreground">
                  Block {currentOrder.block} · Standard Fee {formatCurrency(blockFee)}
                </p>
                {currentOrder.address && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 pt-1">
                    <MapPin className="size-3 text-primary shrink-0" />
                    {currentOrder.address}
                  </p>
                )}
              </div>

              <div className="flex items-start gap-2.5 rounded-2xl border border-border/70 bg-background/45 p-4">
                <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Frictionless access: Rater khabar uses one-time mobile OTP only. No passwords required.
                </p>
              </div>

              <Button
                variant="outline"
                className="w-full rounded-xl font-semibold"
                onClick={() => setAuthModalOpen(true)}
              >
                <Phone className="mr-2 size-4 text-primary" />
                Track Another Mobile Number
                <ArrowRight data-icon="inline-end" aria-hidden="true" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Order History Table Linked to Phone */}
        <Card className="mt-5 rounded-[26px] border-border/70 bg-card/65 p-0">
          <CardHeader className="flex flex-row items-center justify-between gap-3 px-5 pb-3 pt-5 sm:px-6 sm:pt-6">
            <div>
              <CardTitle className="text-lg font-bold">Past Orders for this Number</CardTitle>
              <CardDescription className="mt-1 text-xs">
                All guest and verified orders associated with +880 {activePhone || "1711000005"}.
              </CardDescription>
            </div>
            <PackageCheck aria-hidden="true" className="size-5 text-primary" />
          </CardHeader>
          <CardContent className="px-5 pb-5 sm:px-6 sm:pb-6">
            {orderHistory.length > 0 ? (
              <div className="divide-y divide-border/70">
                {orderHistory.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">{order.vendor}</p>
                        <Badge variant="outline" className="text-[10px]">
                          {order.status}
                        </Badge>
                        <span className="font-mono text-xs text-primary font-bold">{order.id}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {order.items} · {order.placed} · Block {order.block}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-foreground font-mono sm:text-right">
                      {formatCurrency(order.amount)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-6 text-center text-xs text-muted-foreground">
                No previous orders found for this number. Place an order on the storefront and it will appear here immediately.
              </p>
            )}
          </CardContent>
        </Card>
      </main>

      <CustomerAuthDialog open={authModalOpen} onOpenChange={setAuthModalOpen} initialPhone={activePhone || ""} />
    </div>
  )
}
