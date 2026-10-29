"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  AlertTriangle,
  ArrowRight,
  Bike,
  CheckCircle2,
  Clock3,
  Loader2,
  MapPin,
  Minus,
  Navigation,
  Phone,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  User,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  deliveryBlocks,
  formatCurrency,
  getActiveCustomerPhone,
  getDeliveryBlock,
  isServiceWindowOpen,
  products,
  saveCustomerOrder,
  setActiveCustomerPhone,
  type PreviewOrder,
} from "@/lib/nightshift-data"
import { placeLiveOrder } from "@/lib/nightshift-service"

export function CartSheet({
  open,
  onOpenChange,
  cart,
  onAdd,
  onRemove,
  onClear,
  selectedBlock,
  onBlockChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  cart: Record<string, number>
  onAdd: (productId: string) => void
  onRemove: (productId: string) => void
  onClear?: () => void
  selectedBlock: string
  onBlockChange: (block: string) => void
}) {
  const router = useRouter()
  const [notice, setNotice] = useState("")
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [confirmedOrder, setConfirmedOrder] = useState<PreviewOrder | null>(null)

  // Frictionless Guest Checkout fields (No account required)
  const [guestName, setGuestName] = useState("Ayesha Rahman")
  const [guestPhone, setGuestPhone] = useState(getActiveCustomerPhone() || "1711000005")
  const [guestAddress, setGuestAddress] = useState("Road 11, Gate 2")
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; phone?: string }>({})

  // Real-time Service Window calculation (10 PM to 4 AM Bangladesh Time)
  const [actualServiceOpen, setActualServiceOpen] = useState(false)
  const [simulatedWindowOverride, setSimulatedWindowOverride] = useState<boolean | null>(null)

  useEffect(() => {
    const refreshServiceWindow = () => setActualServiceOpen(isServiceWindowOpen())
    refreshServiceWindow()
    const interval = window.setInterval(refreshServiceWindow, 30_000)
    return () => window.clearInterval(interval)
  }, [])

  const serviceOpen = simulatedWindowOverride !== null ? simulatedWindowOverride : actualServiceOpen

  const lines = useMemo(
    () => products.filter((product) => (cart[product.id] ?? 0) > 0),
    [cart],
  )
  const itemCount = Object.values(cart).reduce((total, quantity) => total + quantity, 0)
  const subtotal = lines.reduce((total, product) => total + product.price * (cart[product.id] ?? 0), 0)
  const currentBlock = getDeliveryBlock(selectedBlock)
  const deliveryFee = itemCount > 0 ? currentBlock.fee : 0
  const total = subtotal + deliveryFee
  const hasRestrictedItem = lines.some((product) => product.ageRestricted)
  const hasCigaretteItem = lines.some((product) => product.category === "Cigarettes" || product.isProcuredByRider)

  async function handleGuestCheckout(e: React.FormEvent) {
    e.preventDefault()
    if (!itemCount) return

    // Strict validation: Service window must be open
    if (!serviceOpen) {
      setNotice("Checkout is strictly disabled. Ordering is only available nightly from 10 PM to 4 AM, Bangladesh time.")
      return
    }

    // Validate guest fields
    const errors: { name?: string; phone?: string } = {}
    if (!guestName.trim()) {
      errors.name = "Enter your name for the rider handoff."
    }
    const cleanPhone = guestPhone.replace(/[\s-]/g, "").replace(/^0/, "")
    if (!/^1[3-9]\d{8}$/.test(cleanPhone)) {
      errors.phone = "Enter a valid 10-digit mobile number (+880 1XXXXXXXXX)."
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})
    setIsCheckingOut(true)
    setNotice("")

    // Generate Order ID & Timestamp
    const newOrderId = `NS-${Math.floor(9060 + Math.random() * 800)}`
    const now = new Date()
    const placedTime = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Dhaka",
    })

    const orderRecord: PreviewOrder = {
      id: newOrderId,
      customer: guestName.trim(),
      phone: cleanPhone,
      address: guestAddress.trim() || `Block ${currentBlock.code}`,
      block: currentBlock.code,
      vendor: lines[0]?.vendor ?? "Dhaba Night Outpost",
      items: lines.map((p) => `${p.name} × ${cart[p.id]}`).join(", "),
      amount: total,
      status: "Preparing",
      placed: placedTime,
      eta: "18–25 min",
      hasCigarettes: hasCigaretteItem,
      procurementNote: hasCigaretteItem
        ? "Rider Action Required: Rider must purchase this item on the way to the customer."
        : undefined,
    }

    // Persist to Supabase Database (if configured)
    try {
      await placeLiveOrder({
        orderId: newOrderId,
        customerName: orderRecord.customer,
        customerPhone: `+880${cleanPhone}`,
        vendorName: orderRecord.vendor,
        deliveryBlock: currentBlock.code,
        items: lines.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          quantity: cart[p.id] || 1,
        })),
        subtotal,
        deliveryFee,
        total,
      })
    } catch (err) {
      console.warn("Backend order placement notice:", err)
    }

    // Crucial: Save order strictly linked to this phone number
    saveCustomerOrder(orderRecord)
    setActiveCustomerPhone(cleanPhone)
    setConfirmedOrder(orderRecord)
    setIsCheckingOut(false)

    // Clear cart state
    onClear?.()
  }

  function handleResetConfirmed() {
    setConfirmedOrder(null)
    setNotice("")
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 p-0 sm:w-[500px] sm:max-w-[500px]">
        <SheetHeader className="border-b border-border/70 px-5 py-4 pr-14">
          <div className="flex items-center gap-2">
            <SheetTitle className="text-lg font-bold tracking-tight">
              {confirmedOrder ? "Order Confirmed" : "Your Night Bag"}
            </SheetTitle>
            {itemCount > 0 && !confirmedOrder && (
              <Badge variant="secondary" className="font-semibold">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </Badge>
            )}
          </div>
          <SheetDescription className="text-xs">
            {confirmedOrder
              ? "Live tracking and order receipt linked to your mobile."
              : "Guest checkout · No account or password required."}
          </SheetDescription>
        </SheetHeader>

        {confirmedOrder ? (
          /* Order Confirmation View (Linked strictly to phone) */
          <div className="flex flex-1 flex-col justify-between overflow-y-auto p-6">
            <div className="rounded-3xl border border-primary/30 bg-gradient-to-b from-primary/10 via-secondary/20 to-background p-6 text-center shadow-lg">
              <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-primary/15 text-primary shadow-sm">
                <CheckCircle2 aria-hidden="true" className="size-9" />
              </span>
              <h3 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
                Order Placed Successfully!
              </h3>
              <p className="mt-1 font-mono text-base font-bold text-primary">
                {confirmedOrder.id}
              </p>

              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/80 px-3 py-1 text-xs font-semibold text-muted-foreground">
                <Phone className="size-3 text-primary" />
                Linked to: <span className="text-foreground">+880 {confirmedOrder.phone}</span>
              </div>

              <div className="mt-5 rounded-2xl border border-border/70 bg-card/60 p-4 text-left text-xs space-y-2">
                <div className="flex justify-between text-muted-foreground">
                  <span>Customer Name</span>
                  <span className="font-semibold text-foreground">{confirmedOrder.customer}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery Address</span>
                  <span className="font-semibold text-foreground">
                    Block {confirmedOrder.block} · {confirmedOrder.address}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Vendor Outpost</span>
                  <span className="font-semibold text-foreground">{confirmedOrder.vendor}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Items</span>
                  <span className="font-semibold text-foreground max-w-[220px] truncate">
                    {confirmedOrder.items}
                  </span>
                </div>
                {confirmedOrder.hasCigarettes && (
                  <div className="rounded-xl border border-amber-500/40 bg-amber-500/15 p-2.5 text-xs text-amber-200">
                    <div className="flex items-center gap-1.5 font-bold text-amber-300">
                      <Bike className="size-3.5" />
                      Rider Action Required:
                    </div>
                    <p className="mt-0.5 text-[11px] text-amber-100">
                      Rider must purchase this item on the way to the customer.
                    </p>
                  </div>
                )}
                <Separator className="my-1" />
                <div className="flex justify-between text-sm font-bold text-foreground pt-1">
                  <span>Total Due at Door</span>
                  <span className="font-mono text-primary text-base font-bold">
                    {formatCurrency(confirmedOrder.amount)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Button
                className="h-12 w-full rounded-xl font-bold shadow-md"
                onClick={() => {
                  onOpenChange(false)
                  router.push(`/account?phone=${confirmedOrder.phone}`)
                }}
              >
                <Navigation className="mr-2 size-4" />
                Track Live Order & Rider GPS
                <ArrowRight data-icon="inline-end" aria-hidden="true" />
              </Button>
              <Button
                variant="outline"
                className="h-11 w-full rounded-xl"
                onClick={handleResetConfirmed}
              >
                Order Something Else
              </Button>
            </div>
          </div>
        ) : (
          /* Frictionless Guest Checkout Form */
          <form onSubmit={handleGuestCheckout} className="flex min-h-0 flex-1 flex-col">
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-3">
              {lines.length ? (
                <div className="flex flex-col divide-y divide-border/70">
                  {lines.map((product) => (
                    <div key={product.id} className="flex items-center gap-3 py-3.5">
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-border/80 bg-secondary/60">
                        {product.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.image}
                            alt={product.name}
                            className="size-full object-cover"
                          />
                        ) : (
                          <div className="grid size-full place-items-center text-primary">
                            <ShoppingBag className="size-5" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">{product.name}</p>
                        <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                          <p className="truncate text-[11px] text-muted-foreground">{product.vendor}</p>
                          {product.category === "Cigarettes" && (
                            <Badge variant="outline" className="border-amber-500/40 bg-amber-500/15 text-amber-300 text-[9px] px-1.5 py-0 font-medium">
                              Rider buys on way
                            </Badge>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs font-semibold text-primary">{formatCurrency(product.price)}</p>
                      </div>
                      <div
                        className="flex items-center gap-1 rounded-full border border-border/80 bg-secondary/35 p-1"
                        role="group"
                        aria-label={`${product.name} quantity`}
                      >
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="rounded-full"
                          onClick={() => onRemove(product.id)}
                          aria-label={`Remove one ${product.name}`}
                        >
                          {cart[product.id] === 1 ? <Trash2 aria-hidden="true" /> : <Minus aria-hidden="true" />}
                        </Button>
                        <span className="min-w-5 text-center text-xs font-semibold tabular-nums" aria-live="polite">
                          {cart[product.id]}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="rounded-full"
                          onClick={() => onAdd(product.id)}
                          aria-label={`Add one ${product.name}`}
                        >
                          <Plus aria-hidden="true" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
                  <span className="grid size-16 place-items-center rounded-2xl border border-border/70 bg-secondary/60 text-primary">
                    <ShoppingBag aria-hidden="true" className="size-7" />
                  </span>
                  <p className="mt-5 text-base font-semibold">Your bag is empty.</p>
                  <p className="mt-2 max-w-[240px] text-xs leading-relaxed text-muted-foreground">
                    Add a late-night favourite from local vendors and we&apos;ll bring it to your block.
                  </p>
                  <Button variant="outline" className="mt-5 rounded-full" onClick={() => onOpenChange(false)}>
                    Keep browsing
                    <ArrowRight data-icon="inline-end" aria-hidden="true" />
                  </Button>
                </div>
              )}

              {/* Rider Action Required Notice for Cigarettes */}
              {lines.length > 0 && hasCigaretteItem && (
                <div className="mt-4 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-3.5 backdrop-blur-md">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                    <Bike className="size-4 shrink-0" />
                    <span>Rider Action Required</span>
                  </div>
                  <p className="mt-1 text-xs text-amber-100 font-medium leading-relaxed">
                    Rider must purchase this item on the way to the customer.
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                    Cigarette items are procured externally from verified neighborhood kiosks during the rider route. Minimum 5 pcs / 1 pack.
                  </p>
                </div>
              )}

              {/* Guest Delivery Contact Details */}
              {lines.length > 0 && (
                <div className="mt-4 rounded-2xl border border-border/80 bg-secondary/25 p-4 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-primary">
                      1. Guest Delivery Details
                    </p>
                    <Badge variant="outline" className="text-[9px]">
                      No signup required
                    </Badge>
                  </div>

                  <Field data-invalid={Boolean(fieldErrors.name)}>
                    <FieldLabel htmlFor="guest-name" className="text-xs font-semibold">
                      Your Full Name
                    </FieldLabel>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="guest-name"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="e.g. Ayesha Rahman"
                        required
                        className="h-9 rounded-xl pl-9 text-xs"
                      />
                    </div>
                    {fieldErrors.name && (
                      <FieldDescription className="text-destructive font-medium">{fieldErrors.name}</FieldDescription>
                    )}
                  </Field>

                  <Field data-invalid={Boolean(fieldErrors.phone)}>
                    <FieldLabel htmlFor="guest-phone" className="text-xs font-semibold">
                      Mobile Number (For order lookup & tracking)
                    </FieldLabel>
                    <div className="flex gap-2">
                      <span className="inline-flex h-9 shrink-0 items-center rounded-xl border border-border/80 bg-secondary/50 px-2.5 text-xs font-semibold text-muted-foreground">
                        +880
                      </span>
                      <Input
                        id="guest-phone"
                        type="tel"
                        inputMode="numeric"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder="1 7XX XXX XXX"
                        required
                        className="h-9 rounded-xl text-xs font-medium"
                      />
                    </div>
                    {fieldErrors.phone ? (
                      <FieldDescription className="text-destructive font-medium">{fieldErrors.phone}</FieldDescription>
                    ) : (
                      <FieldDescription className="text-[10px] text-muted-foreground">
                        Enter 10 digits. We strictly tie your Order ID and Live Map to this number.
                      </FieldDescription>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="guest-address" className="text-xs font-semibold">
                      Delivery Address / House / Gate Note
                    </FieldLabel>
                    <div className="relative">
                      <MapPin className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="guest-address"
                        value={guestAddress}
                        onChange={(e) => setGuestAddress(e.target.value)}
                        placeholder="e.g. Road 11, Gate 2, Apt 4B"
                        className="h-9 rounded-xl pl-9 text-xs"
                      />
                    </div>
                  </Field>
                </div>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-border/70 bg-background/95 px-5 py-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-primary">
                      2. Delivery Block & Fee
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      Rater khabar serves approved blocks A–M.
                    </p>
                  </div>
                  <ShieldCheck aria-hidden="true" className="size-4 shrink-0 text-primary" />
                </div>

                {/* Delivery Block Selector */}
                <Select value={selectedBlock} onValueChange={(value) => value && onBlockChange(value)}>
                  <SelectTrigger className="h-10 w-full rounded-xl border-border/80 bg-card/70 px-3">
                    <SelectValue>{`Block ${currentBlock.code} (${currentBlock.zone})`}</SelectValue>
                  </SelectTrigger>
                  <SelectContent align="end">
                    {deliveryBlocks.map((block) => (
                      <SelectItem key={block.code} value={block.code}>
                        <span>Block {block.code}</span>
                        <span className="font-mono text-xs text-muted-foreground">{formatCurrency(block.fee)} fee</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Price Calculation in TK */}
                <div className="mt-3.5 flex flex-col gap-2 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Items Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Block {currentBlock.code} Delivery Fee</span>
                    <span>{formatCurrency(deliveryFee)}</span>
                  </div>
                  <Separator className="my-0.5" />
                  <div className="flex items-center justify-between text-sm font-bold text-foreground">
                    <span>Total Due at Door</span>
                    <span className="font-mono text-base font-bold text-primary">{formatCurrency(total)}</span>
                  </div>
                </div>

                {hasRestrictedItem && (
                  <p className="mt-2.5 rounded-xl border border-border/70 bg-secondary/50 px-3 py-1.5 text-[11px] leading-relaxed text-muted-foreground">
                    18+ age verification required by rider at delivery.
                  </p>
                )}

                {notice && (
                  <p role="status" className="mt-2.5 rounded-xl border border-border/70 bg-secondary/70 px-3 py-2 text-xs text-foreground/90 font-medium">
                    {notice}
                  </p>
                )}

                {/* Strict Service Window Notice */}
                {!serviceOpen && (
                  <div className="mt-2.5 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                    <p className="font-semibold flex items-center gap-1.5">
                      <Clock3 className="size-3.5" />
                      Checkout Disabled (10 PM–4 AM Window)
                    </p>
                    <p className="mt-0.5 text-[11px] text-destructive/90">
                      Orders can only be placed between 10:00 PM and 4:00 AM (Bangladesh Time).
                    </p>
                  </div>
                )}

                {/* Convenience toggle to test open/closed window */}
                <div className="mt-2.5 flex items-center justify-between rounded-lg border border-border/60 bg-secondary/25 px-2.5 py-1 text-[10px] text-muted-foreground">
                  <span>Window: {serviceOpen ? "Open (10 PM–4 AM)" : "Closed (Daytime)"}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setSimulatedWindowOverride((curr) => (curr === null ? !actualServiceOpen : !curr))
                    }
                    className="underline text-primary"
                  >
                    {simulatedWindowOverride === null ? "Test Closed/Open" : "Reset Window"}
                  </button>
                </div>

                <SheetFooter className="mt-3.5 p-0">
                  <Button
                    type="submit"
                    className="h-11 w-full rounded-xl font-bold shadow-md"
                    disabled={!itemCount || !serviceOpen || isCheckingOut}
                  >
                    {isCheckingOut ? (
                      <>
                        <Loader2 className="size-4 animate-spin mr-2" />
                        Confirming Guest Order in TK...
                      </>
                    ) : serviceOpen ? (
                      `Confirm Order · ${formatCurrency(total)}`
                    ) : (
                      "Ordering Opens at 10 PM"
                    )}
                    {itemCount > 0 && serviceOpen && !isCheckingOut && (
                      <ArrowRight data-icon="inline-end" aria-hidden="true" />
                    )}
                  </Button>
                  <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
                    Cash / bKash on Delivery · Order tracked via your mobile number
                  </p>
                </SheetFooter>
              </div>
            )}
          </form>
        )}
      </SheetContent>
    </Sheet>
  )
}
