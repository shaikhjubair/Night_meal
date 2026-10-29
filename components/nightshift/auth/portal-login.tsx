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
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
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
import { BrandMark } from "@/components/nightshift/brand"
import { portalRoleKeys, portalRoles, type PortalRole, type RoleDetails } from "@/lib/nightshift-data"

const portalIcons: Record<PortalRole, typeof ClipboardList> = {
  staff: ClipboardList,
  store: Store,
  rider: Bike,
  "super-admin": UsersRound,
}

export function PortalLogin({ roleKey, role }: { roleKey: PortalRole; role: RoleDetails }) {
  const router = useRouter()
  const [identity, setIdentity] = useState(role.demoEmail)
  const [password, setPassword] = useState(role.demoPassword)
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [demoFilledNotice, setDemoFilledNotice] = useState(false)

  const Icon = portalIcons[roleKey]
  const dashboardHref = `/dashboard/${role.dashboardSlug}`

  function fillDemoCredentials() {
    setIdentity(role.demoEmail)
    setPassword(role.demoPassword)
    setDemoFilledNotice(true)
    setMessage("Filled verified demo credentials for testing.")
    window.setTimeout(() => setDemoFilledNotice(false), 2400)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!identity.trim() || !password) return
    setIsLoading(true)
    setMessage(`Verifying ${role.label} key...`)

    try {
      localStorage.setItem(
        "nightshift_portal_session",
        JSON.stringify({
          identity,
          roleKey,
          dashboardSlug: role.dashboardSlug,
          authenticatedAt: new Date().toISOString(),
        }),
      )
    } catch {
      // Ignore
    }

    window.setTimeout(() => {
      router.push(dashboardHref)
    }, 700)
  }

  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-8 sm:px-6 lg:px-8">
      {/* Dynamic Ambient Background Image with Dark Vignette */}
      <div className="absolute inset-0 -z-30 overflow-hidden">
        <Image
          src={role.backgroundImage}
          alt={`${role.label} workspace atmosphere`}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-25 filter blur-[2px] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/70" />
        <div className="absolute inset-0 bg-radial from-transparent via-background/60 to-background" />
      </div>

      {/* Role-specific Glowing Light Orbs */}
      <div
        aria-hidden="true"
        className={`absolute -top-32 -left-32 -z-10 size-[550px] rounded-full bg-gradient-to-br ${role.accentGlow} blur-3xl`}
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 -right-32 -z-10 size-[500px] rounded-full bg-primary/10 blur-3xl"
      />

      <div className="mx-auto w-full max-w-[1140px]">
        {/* Top Header Bar */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <BrandMark />
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full bg-background/50 backdrop-blur-md border border-border/60 hover:bg-background/80"
              nativeButton={false}
              render={<Link href="/" />}
            >
              <ArrowLeft data-icon="inline-start" aria-hidden="true" />
              <span className="hidden sm:inline">Storefront</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </div>
        </div>

        {/* Master Glassmorphic Portal Card */}
        <div className="grid overflow-hidden rounded-[32px] border border-white/10 bg-card/60 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] backdrop-blur-2xl lg:grid-cols-[1fr_1.1fr]">
          {/* Left Visual Column */}
          <section className="relative hidden min-h-[660px] flex-col justify-between overflow-hidden border-r border-white/10 bg-black/40 p-9 lg:flex xl:p-12">
            {/* Background Image Preview */}
            <div className="absolute inset-0 -z-10">
              <Image
                src={role.backgroundImage}
                alt=""
                fill
                className="object-cover opacity-35 filter brightness-75 contrast-125"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className="gap-2 border-primary/30 bg-primary/15 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-primary backdrop-blur-md"
                >
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-primary" />
                  </span>
                  {role.eyebrow}
                </Badge>
                <span className="rounded-full border border-white/10 bg-black/50 px-2.5 py-0.5 text-[10px] font-mono text-muted-foreground backdrop-blur-md">
                  v2.4 SECURE
                </span>
              </div>

              <div className="mt-8 flex items-center gap-3">
                <div className="grid size-14 place-items-center rounded-2xl border border-white/15 bg-white/5 text-primary shadow-inner backdrop-blur-md">
                  <Icon aria-hidden="true" className="size-7" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Internal Workspace</p>
                  <h2 className="text-xl font-bold tracking-tight text-foreground">{role.label}</h2>
                </div>
              </div>

              <h1 className="mt-6 max-w-md text-3xl font-extrabold leading-tight tracking-tight text-foreground xl:text-4xl">
                Precision logistics when the city goes quiet.
              </h1>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                {role.description}
              </p>

              {/* Real-time System Metrics */}
              <div className="mt-8 grid grid-cols-3 gap-2.5">
                {role.stats.map((stat, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-md shadow-sm"
                  >
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      {stat.label}
                    </p>
                    <p className="mt-1 text-sm font-bold text-foreground font-mono">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Security Notice */}
            <div className="relative z-10 rounded-2xl border border-white/10 bg-black/60 p-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
                  <ShieldCheck className="size-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-foreground">Operational Shift Guard</p>
                  <p className="text-[11px] text-muted-foreground">
                    Strict RBAC enforced. Active night window: 10 PM — 4 AM (Dhaka BST).
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Right Form Column */}
          <section className="flex flex-col justify-between p-6 sm:p-9 lg:p-11 xl:p-12">
            <div>
              {/* Role Switcher Tabs */}
              <div className="mb-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2.5">
                  Internal Portals Directory
                </p>
                <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                  {portalRoleKeys.map((key) => {
                    const item = portalRoles[key]
                    const isSelected = key === roleKey
                    const ItemIcon = portalIcons[key]
                    return (
                      <Link
                        key={key}
                        href={`/portal/${item.portalSlug}`}
                        className={`group flex items-center justify-center gap-1.5 rounded-xl border px-2.5 py-2 text-xs font-semibold transition-all ${
                          isSelected
                            ? "border-primary/50 bg-primary/20 text-primary shadow-sm ring-1 ring-primary/30"
                            : "border-border/60 bg-secondary/30 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                        }`}
                      >
                        <ItemIcon className="size-3.5 shrink-0" />
                        <span className="truncate">{item.label.split(" ")[0]}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>

              <Card className="border-0 bg-transparent p-0 shadow-none">
                <CardHeader className="px-0 pb-4 pt-0">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary text-[10px] font-bold">
                      {role.badgeText}
                    </Badge>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={fillDemoCredentials}
                      className="h-7 gap-1 rounded-full border border-border/80 bg-background/60 px-2.5 text-[11px] font-semibold text-primary hover:bg-primary/15"
                    >
                      <Sparkles className="size-3" />
                      Auto-fill Demo
                    </Button>
                  </div>
                  <CardTitle className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                    Sign in to {role.label}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    Authenticate your terminal to gain access to dispatch, inventory, and operations.
                  </CardDescription>
                </CardHeader>

                <CardContent className="px-0">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <FieldGroup>
                      <Field>
                        <FieldLabel htmlFor="portal-identity">Work Email or Terminal ID</FieldLabel>
                        <div className="relative">
                          <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="portal-identity"
                            type="text"
                            autoComplete="username"
                            value={identity}
                            onChange={(e) => setIdentity(e.target.value)}
                            placeholder={role.demoEmail}
                            required
                            className="h-11 rounded-xl border-border/80 bg-background/60 pl-10 pr-3 font-mono text-sm focus:border-primary/70 focus:bg-background/90"
                          />
                        </div>
                        <FieldDescription className="text-[11px]">
                          Issued by Rater khabar IT operations for this role.
                        </FieldDescription>
                      </Field>

                      <Field>
                        <div className="flex items-center justify-between">
                          <FieldLabel htmlFor="portal-password">Access Passphrase</FieldLabel>
                          <span className="text-[10px] text-muted-foreground">
                            Demo: <code className="font-mono text-foreground font-semibold">{role.demoPassword}</code>
                          </span>
                        </div>
                        <div className="relative">
                          <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="portal-password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••••••"
                            required
                            className="h-11 rounded-xl border-border/80 bg-background/60 pl-10 pr-10 font-mono text-sm focus:border-primary/70 focus:bg-background/90"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                          </button>
                        </div>
                      </Field>

                      <Button
                        type="submit"
                        className="h-12 w-full rounded-xl font-bold text-sm shadow-md transition-all"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 size-4 animate-spin" />
                            Authorizing {role.label}...
                          </>
                        ) : (
                          <>
                            Open {role.label} Workspace
                            <ArrowRight data-icon="inline-end" aria-hidden="true" />
                          </>
                        )}
                      </Button>
                    </FieldGroup>
                  </form>

                  {message && (
                    <div
                      role="status"
                      aria-live="polite"
                      className="mt-4 flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 p-3 text-xs font-medium text-foreground"
                    >
                      <CheckCircle2 className="size-4 shrink-0 text-primary" />
                      <span>{message}</span>
                    </div>
                  )}

                  {/* Direct Preview Link Card */}
                  <div className="mt-6 rounded-2xl border border-border/70 bg-background/40 p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-foreground">Design Review Mode</p>
                        <p className="text-[11px] text-muted-foreground">
                          Skip credential check to preview the live interactive dashboard UI.
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full text-xs shrink-0"
                        nativeButton={false}
                        render={<Link href={dashboardHref} />}
                      >
                        Preview
                        <ArrowRight className="ml-1 size-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Clear Customer Separation Footer */}
            <div className="mt-8 border-t border-border/60 pt-4 text-center">
              <p className="text-xs text-muted-foreground">
                Are you a customer tracking late-night food?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-primary underline underline-offset-4 hover:text-primary/90"
                >
                  Track with Mobile OTP (No password needed)
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
