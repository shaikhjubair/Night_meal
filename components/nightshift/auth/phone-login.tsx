"use client"

import { useState, type FormEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Bike,
  CheckCircle2,
  ClipboardList,
  Compass,
  Loader2,
  LockKeyhole,
  MapPin,
  MessageSquareText,
  Phone,
  ShieldCheck,
  Sparkles,
  Store,
  UsersRound,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { BrandMark } from "@/components/nightshift/brand"
import { getOrdersByPhone, setActiveCustomerPhone } from "@/lib/nightshift-data"
import { requestMobileOtp, verifyMobileOtp } from "@/lib/nightshift-service"

export function PhoneLogin() {
  const router = useRouter()
  const [phone, setPhone] = useState("1711000005")
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [otp, setOtp] = useState("")
  const [simulatedCode, setSimulatedCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  function fillSamplePhone(sampleNum: string) {
    setPhone(sampleNum)
    setError("")
    setMessage("")
    if (step === "otp") {
      setStep("phone")
      setOtp("")
    }
  }

  async function requestCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage("")
    setError("")

    const normalizedPhone = phone.replace(/[\s-]/g, "")
    const cleanPhone = normalizedPhone.startsWith("0") ? normalizedPhone.slice(1) : normalizedPhone

    if (!/^1[3-9]\d{8}$/.test(cleanPhone)) {
      setError("Please enter a valid 10-digit mobile number (+880 1XXXXXXXXX).")
      return
    }

    setIsLoading(true)
    try {
      const res = await requestMobileOtp(cleanPhone)
      if (res.simulatedCode) {
        setSimulatedCode(res.simulatedCode)
      }
      setStep("otp")
      setMessage(res.message || `Dispatched verification code to +880 ${cleanPhone}.`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to dispatch mobile OTP.")
    } finally {
      setIsLoading(false)
    }
  }

  function autoFillOtp() {
    if (simulatedCode) {
      setOtp(simulatedCode)
      setError("")
      handleVerify(simulatedCode)
    }
  }

  async function handleVerify(enteredCode = otp) {
    if (enteredCode.length !== 6) {
      setError("Please enter the complete 6-digit verification code.")
      return
    }

    setIsLoading(true)
    setError("")
    setMessage("Verifying code & retrieving your active orders...")

    const cleanPhone = phone.replace(/[\s-]/g, "").replace(/^0/, "")

    try {
      await verifyMobileOtp(cleanPhone, enteredCode)

      // Set active customer phone session
      setActiveCustomerPhone(cleanPhone)

      try {
        localStorage.setItem(
          "nightshift_user_session",
          JSON.stringify({
            phone: cleanPhone,
            role: "customer",
            authenticatedAt: new Date().toISOString(),
          }),
        )
      } catch {
        // Ignore
      }

      window.setTimeout(() => {
        router.push(`/account?phone=${cleanPhone}`)
      }, 600)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Verification failed. Check the code and try again.")
      setIsLoading(false)
    }
  }

  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-8 sm:px-6 lg:px-8">
      {/* Late-night Atmospheric City Imagery */}
      <div className="absolute inset-0 -z-30 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1600&q=80"
          alt="Late night city atmosphere"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-20 filter blur-[1px] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/70" />
      </div>

      {/* Ambient Radial Glowing Orbs */}
      <div
        aria-hidden="true"
        className="absolute -top-32 -left-32 -z-10 size-[500px] rounded-full bg-primary/12 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 -right-32 -z-10 size-[500px] rounded-full bg-accent/20 blur-3xl"
      />

      <div className="mx-auto w-full max-w-[1100px]">
        {/* Navigation Bar */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <BrandMark />
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full bg-background/50 backdrop-blur-md border border-border/60 hover:bg-background/80"
            nativeButton={false}
            render={<Link href="/" />}
          >
            <ArrowLeft data-icon="inline-start" aria-hidden="true" />
            Back to store
          </Button>
        </div>

        {/* Master Glassmorphic Card */}
        <div className="grid overflow-hidden rounded-[32px] border border-white/10 bg-card/65 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] backdrop-blur-2xl lg:grid-cols-[1fr_1.1fr]">
          {/* Left Column: Customer Tracking Highlights */}
          <section className="relative hidden min-h-[640px] flex-col justify-between overflow-hidden border-r border-white/10 bg-black/40 p-9 lg:flex xl:p-12">
            <div className="absolute inset-0 -z-10">
              <Image
                src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80"
                alt=""
                fill
                className="object-cover opacity-25 filter brightness-90 contrast-125"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90" />
            </div>

            <div className="relative z-10">
              <Badge
                variant="outline"
                className="gap-2 border-primary/30 bg-primary/15 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-primary backdrop-blur-md"
              >
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-primary" />
                </span>
                CUSTOMER TRACKING & ACCESS
              </Badge>

              <h1 className="mt-8 max-w-sm text-3xl font-extrabold leading-tight tracking-tight text-foreground xl:text-4xl">
                Track your late-night drop with live GPS.
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
                No passwords required. Your entire order history and live rider telemetry are keyed directly to your mobile number.
              </p>

              {/* Service Features Callout */}
              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
                    <Compass className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Live Telemetry Map</p>
                    <p className="text-[11px] text-muted-foreground">Real-time rider coordinates updating every 5s.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
                    <MapPin className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Designated Delivery Blocks</p>
                    <p className="text-[11px] text-muted-foreground">Approved zones: Block A, G, H, I, J, K, L & M.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Window Indicator */}
            <div className="relative z-10 rounded-2xl border border-white/10 bg-black/60 p-4 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Operations Window</p>
                  <p className="mt-0.5 text-base font-bold text-foreground">10 PM — 4 AM BST</p>
                </div>
                <Badge variant="outline" className="border-border/80 text-[10px] font-mono">
                  Nightly Service
                </Badge>
              </div>
            </div>
          </section>

          {/* Right Column: Mobile OTP Form */}
          <section className="flex flex-col justify-between p-6 sm:p-9 lg:p-11 xl:p-12">
            <div>
              <div className="mb-2 flex items-center gap-2 text-primary lg:hidden">
                <LockKeyhole aria-hidden="true" className="size-4" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Customer Sign In</span>
              </div>

              <Card className="border-0 bg-transparent p-0 shadow-none">
                <CardHeader className="px-0 pb-4 pt-0">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="font-semibold text-xs">
                      Customer Space
                    </Badge>
                    <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
                      SMS / WhatsApp OTP
                    </Badge>
                  </div>
                  <CardTitle className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                    Track Orders & Sign In
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    Enter your mobile number to view active deliveries, rider GPS location, and past order receipts.
                  </CardDescription>

                  {/* Sample test numbers */}
                  <div className="mt-4 pt-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Quick Test Accounts:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => fillSamplePhone("1711000005")}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                          phone === "1711000005"
                            ? "bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/40"
                            : "border border-border/80 bg-background/60 text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                        }`}
                      >
                        <Sparkles className="size-3" />
                        <span>Ayesha R. (Live Order NS-9058)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => fillSamplePhone("1799887766")}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                          phone === "1799887766"
                            ? "bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/40"
                            : "border border-border/80 bg-background/60 text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                        }`}
                      >
                        <span>New Customer Test</span>
                      </button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="px-0">
                  <form onSubmit={requestCode} noValidate>
                    <FieldGroup>
                      <Field data-invalid={Boolean(error && step === "phone")}>
                        <FieldLabel htmlFor="customer-phone">Mobile number</FieldLabel>
                        <div className="flex gap-2">
                          <span className="inline-flex h-11 shrink-0 items-center rounded-xl border border-input bg-secondary/50 px-3.5 text-sm font-semibold text-muted-foreground">
                            +880
                          </span>
                          <Input
                            id="customer-phone"
                            type="tel"
                            inputMode="numeric"
                            autoComplete="tel-national"
                            placeholder="1 7XX XXX XXX"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            aria-invalid={Boolean(error && step === "phone")}
                            maxLength={14}
                            disabled={isLoading}
                            className="h-11 rounded-xl border-border/80 bg-background/60 px-3 font-mono text-sm focus:border-primary/70 focus:bg-background/90"
                          />
                        </div>
                        {error && step === "phone" ? (
                          <FieldDescription className="text-destructive font-medium">{error}</FieldDescription>
                        ) : (
                          <FieldDescription className="text-[11px]">
                            Enter the mobile number used when placing your order.
                          </FieldDescription>
                        )}
                      </Field>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="h-12 w-full rounded-xl font-bold shadow-md transition-all"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 size-4 animate-spin" />
                            Dispatching Code...
                          </>
                        ) : step === "phone" ? (
                          <>
                            Request 6-digit Code
                            <ArrowRight data-icon="inline-end" aria-hidden="true" />
                          </>
                        ) : (
                          "Resend Verification Code"
                        )}
                      </Button>
                    </FieldGroup>
                  </form>

                  {message && (
                    <div
                      role="status"
                      aria-live="polite"
                      className="mt-4 flex items-center justify-between gap-2 rounded-xl border border-primary/30 bg-primary/10 p-3 text-xs leading-relaxed text-foreground"
                    >
                      <p className="font-medium flex items-center gap-1.5 text-primary">
                        <CheckCircle2 className="size-4 shrink-0" />
                        {message}
                      </p>
                      {simulatedCode && step === "otp" && (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="h-6 rounded-lg px-2 text-[10px] font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                          onClick={autoFillOtp}
                        >
                          Auto-fill ({simulatedCode})
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Step 2: 6-digit OTP Entry Box */}
                  <div className="mt-6 rounded-2xl border border-border/70 bg-background/40 p-4 sm:p-5 backdrop-blur-sm">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-foreground">One-Time Verification Code</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {step === "otp"
                            ? `Enter the 6 digits sent to +880 ${phone.replace(/^0/, "")}`
                            : "Request code above to activate verification."}
                        </p>
                      </div>
                      <Badge
                        variant={step === "otp" ? "secondary" : "outline"}
                        className="shrink-0 text-[10px] font-mono"
                      >
                        {step === "otp" ? "Awaiting Code" : "Standby"}
                      </Badge>
                    </div>

                    <Field data-invalid={Boolean(error && step === "otp")}>
                      <InputOTP
                        id="otp-input"
                        maxLength={6}
                        value={otp}
                        onChange={(val) => {
                          setOtp(val)
                          if (val.length === 6) {
                            handleVerify(val)
                          }
                        }}
                        disabled={step !== "otp" || isLoading}
                        containerClassName="justify-between"
                      >
                        <InputOTPGroup className="w-full justify-between gap-2 border-0">
                          {Array.from({ length: 6 }, (_, index) => (
                            <InputOTPSlot
                              key={index}
                              index={index}
                              className={`size-11 flex-1 rounded-xl border bg-secondary/40 text-base font-bold ${
                                step === "otp" ? "border-primary/60 focus:border-primary shadow-sm" : ""
                              }`}
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>

                      {error && step === "otp" && (
                        <FieldDescription className="text-destructive font-medium mt-2">{error}</FieldDescription>
                      )}
                    </Field>

                    {step === "otp" && (
                      <Button
                        type="button"
                        disabled={otp.length !== 6 || isLoading}
                        onClick={() => handleVerify()}
                        className="mt-4 h-11 w-full rounded-xl font-bold"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 size-4 animate-spin" />
                            Unlocking Customer Dashboard...
                          </>
                        ) : (
                          "Verify & Open Live Tracker"
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Clear Separation: Internal Portals Directory for Staff/Vendors */}
            <div className="mt-8 border-t border-border/70 pt-5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
                Internal Ops & Vendor Access:
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Link
                  href="/portal/staff"
                  className="flex items-center gap-1.5 rounded-xl border border-border/70 bg-secondary/30 p-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/50 hover:bg-secondary/60 hover:text-foreground"
                >
                  <ClipboardList className="size-3.5 text-sky-400" />
                  <span>Staff Desk</span>
                </Link>
                <Link
                  href="/portal/store"
                  className="flex items-center gap-1.5 rounded-xl border border-border/70 bg-secondary/30 p-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/50 hover:bg-secondary/60 hover:text-foreground"
                >
                  <Store className="size-3.5 text-amber-400" />
                  <span>Store Portal</span>
                </Link>
                <Link
                  href="/portal/rider"
                  className="flex items-center gap-1.5 rounded-xl border border-border/70 bg-secondary/30 p-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/50 hover:bg-secondary/60 hover:text-foreground"
                >
                  <Bike className="size-3.5 text-purple-400" />
                  <span>Rider GPS</span>
                </Link>
                <Link
                  href="/portal/super-admin"
                  className="flex items-center gap-1.5 rounded-xl border border-border/70 bg-secondary/30 p-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/50 hover:bg-secondary/60 hover:text-foreground"
                >
                  <UsersRound className="size-3.5 text-emerald-400" />
                  <span>Admin Root</span>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
