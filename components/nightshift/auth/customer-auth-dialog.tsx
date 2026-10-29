"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Loader2,
  MessageSquare,
  Navigation,
  Phone,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import {
  getActiveCustomerPhone,
  getOrdersByPhone,
  setActiveCustomerPhone,
} from "@/lib/nightshift-data"

export function CustomerAuthDialog({
  open,
  onOpenChange,
  initialPhone = "",
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialPhone?: string
}) {
  const router = useRouter()
  const [phone, setPhone] = useState(initialPhone || getActiveCustomerPhone() || "1711000005")
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [otp, setOtp] = useState("")
  const [simulatedCode, setSimulatedCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  function handleRequestCode(e?: React.FormEvent) {
    if (e) e.preventDefault()
    setError("")
    setMessage("")

    const clean = phone.replace(/[\s-]/g, "").replace(/^0/, "")
    if (!/^1[3-9]\d{8}$/.test(clean)) {
      setError("Please enter a valid 10-digit mobile number beginning with 1.")
      return
    }

    setIsLoading(true)

    // Check if user has orders
    const matchedOrders = getOrdersByPhone(clean)
    const hasExistingOrders = matchedOrders.length > 0

    window.setTimeout(() => {
      const code = "839201"
      setSimulatedCode(code)
      setStep("otp")
      setIsLoading(false)
      setMessage(
        hasExistingOrders
          ? `Found ${matchedOrders.length} order(s). Simulated code sent: ${code}`
          : `Simulated code sent via WhatsApp/SMS: ${code}`,
      )
    }, 500)
  }

  function handleVerify(codeToVerify = otp) {
    if (codeToVerify.length !== 6) {
      setError("Please enter the complete 6-digit code.")
      return
    }

    setIsLoading(true)
    setError("")

    window.setTimeout(() => {
      const clean = phone.replace(/[\s-]/g, "").replace(/^0/, "")
      setActiveCustomerPhone(clean)
      setIsLoading(false)
      onOpenChange(false)
      router.push(`/account?phone=${clean}`)
    }, 600)
  }

  function handleAutoFill() {
    if (simulatedCode) {
      setOtp(simulatedCode)
      setError("")
      handleVerify(simulatedCode)
    }
  }

  function handleReset() {
    setStep("phone")
    setOtp("")
    setError("")
    setMessage("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden border border-border/80 bg-card/95 p-0 shadow-2xl backdrop-blur-2xl sm:max-w-[460px] rounded-3xl">
        <div className="relative isolate overflow-hidden border-b border-border/70 bg-gradient-to-br from-primary/15 via-secondary/40 to-background p-6">
          <div
            aria-hidden="true"
            className="absolute -right-16 -top-16 size-44 rounded-full bg-primary/20 blur-2xl"
          />
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary text-[10px] tracking-wider uppercase font-semibold">
              <Navigation className="mr-1 size-3" />
              CUSTOMER ORDER TRACKING
            </Badge>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
              <Clock3 className="size-3 text-primary" />
              10 PM – 4 AM
            </span>
          </div>

          <DialogTitle className="mt-4 text-2xl font-bold tracking-tight text-foreground">
            {step === "phone" ? "Track your night order" : "Enter verification code"}
          </DialogTitle>
          <DialogDescription className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {step === "phone"
              ? "No password needed. Enter the phone number used at checkout to see real-time rider GPS and past orders."
              : `We sent a one-time code to +880 ${phone.replace(/[\s-]/g, "").replace(/^0/, "")}.`}
          </DialogDescription>
        </div>

        <div className="p-6">
          {step === "phone" ? (
            <form onSubmit={handleRequestCode} className="flex flex-col gap-4">
              <Field data-invalid={Boolean(error)}>
                <FieldLabel htmlFor="track-phone" className="text-xs font-semibold">
                  Bangladesh Mobile Number
                </FieldLabel>
                <div className="flex gap-2">
                  <span className="inline-flex h-11 shrink-0 items-center rounded-xl border border-border/80 bg-secondary/50 px-3.5 text-sm font-semibold text-muted-foreground">
                    +880
                  </span>
                  <Input
                    id="track-phone"
                    type="tel"
                    inputMode="numeric"
                    placeholder="1 7XX XXX XXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={14}
                    autoFocus
                    className="h-11 rounded-xl border-border/80 bg-background/80 px-3.5 text-base font-medium"
                  />
                </div>
                {error ? (
                  <FieldDescription className="text-destructive font-medium">{error}</FieldDescription>
                ) : (
                  <FieldDescription className="text-[11px] text-muted-foreground">
                    Guest orders are strictly linked to your mobile number.
                  </FieldDescription>
                )}
              </Field>

              <Button
                type="submit"
                disabled={isLoading}
                className="h-11 w-full rounded-xl font-semibold shadow-md"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Sending One-Time Code...
                  </>
                ) : (
                  <>
                    Send WhatsApp / SMS Code
                    <ArrowRight data-icon="inline-end" aria-hidden="true" />
                  </>
                )}
              </Button>

              <div className="rounded-2xl border border-border/70 bg-secondary/30 p-3.5 text-[11px] text-muted-foreground flex items-start gap-2.5">
                <ShieldCheck className="mt-0.5 size-4 text-primary shrink-0" />
                <span>
                  Instant lookup: View past orders, driver contact, and live GPS map without creating an account.
                </span>
              </div>
            </form>
          ) : (
            <div className="flex flex-col gap-5">
              {message && (
                <div className="flex items-center justify-between rounded-xl border border-primary/25 bg-primary/10 p-3 text-xs text-primary font-medium">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="size-4 shrink-0" />
                    {message}
                  </span>
                  {simulatedCode && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleAutoFill}
                      className="h-6 rounded-lg px-2 text-[10px] font-bold"
                    >
                      Auto-fill
                    </Button>
                  )}
                </div>
              )}

              <Field data-invalid={Boolean(error)}>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="modal-otp" className="text-xs font-semibold">
                    6-Digit Verification Code
                  </FieldLabel>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-[11px] text-primary underline underline-offset-4 hover:opacity-80"
                  >
                    Change phone
                  </button>
                </div>
                <InputOTP
                  id="modal-otp"
                  maxLength={6}
                  value={otp}
                  onChange={(val) => {
                    setOtp(val)
                    if (val.length === 6) handleVerify(val)
                  }}
                  autoFocus
                  containerClassName="justify-between mt-2"
                >
                  <InputOTPGroup className="w-full justify-between gap-2 border-0">
                    {Array.from({ length: 6 }, (_, index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className="size-11 flex-1 rounded-xl border border-border/80 bg-secondary/30 text-lg font-bold"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
                {error && <FieldDescription className="text-destructive font-medium">{error}</FieldDescription>}
              </Field>

              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  disabled={otp.length !== 6 || isLoading}
                  onClick={() => handleVerify()}
                  className="h-11 w-full rounded-xl font-semibold"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Unlocking Dashboard...
                    </>
                  ) : (
                    <>
                      Verify & Open Tracking
                      <ArrowRight data-icon="inline-end" aria-hidden="true" />
                    </>
                  )}
                </Button>
                <button
                  type="button"
                  onClick={() => handleRequestCode()}
                  className="text-center text-xs text-muted-foreground hover:text-foreground pt-1"
                >
                  Didn&apos;t receive code? Resend SMS/WhatsApp
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
