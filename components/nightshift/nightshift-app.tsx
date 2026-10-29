"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { BarChart3, Search, ShoppingBag, UserRound } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BrandMark } from "@/components/nightshift/brand"
import { CartSheet } from "@/components/nightshift/cart-sheet"
import { CustomerAuthDialog } from "@/components/nightshift/auth/customer-auth-dialog"
import { MobileNav } from "@/components/nightshift/mobile-nav"
import { Storefront } from "@/components/nightshift/storefront"
import { defaultBlock } from "@/lib/nightshift-data"

export function NightshiftApp() {
  const [cart, setCart] = useState<Record<string, number>>({})
  const [cartOpen, setCartOpen] = useState(false)
  const [selectedBlock, setSelectedBlock] = useState(defaultBlock)
  const [authModalOpen, setAuthModalOpen] = useState(false)

  // Restore saved cart and selected block
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("nightshift_cart")
      if (savedCart) setCart(JSON.parse(savedCart))
      const savedBlock = localStorage.getItem("nightshift_selected_block")
      if (savedBlock) setSelectedBlock(savedBlock)
    } catch {
      // Ignore local storage error
    }
  }, [])

  function handleBlockChange(block: string) {
    setSelectedBlock(block)
    try {
      localStorage.setItem("nightshift_selected_block", block)
    } catch {
      // Ignore
    }
  }

  const itemCount = useMemo(() => Object.values(cart).reduce((total, quantity) => total + quantity, 0), [cart])

  function updateCart(productId: string, change: number) {
    setCart((current) => {
      const nextQuantity = (current[productId] ?? 0) + change
      const next = { ...current }

      if (nextQuantity <= 0) {
        delete next[productId]
      } else {
        next[productId] = nextQuantity
      }

      try {
        localStorage.setItem("nightshift_cart", JSON.stringify(next))
      } catch {
        // Ignore
      }

      return next
    })
  }

  function clearCart() {
    setCart({})
    try {
      localStorage.removeItem("nightshift_cart")
    } catch {
      // Ignore
    }
  }

  function focusSearch() {
    const searchInput = document.getElementById("product-search") as HTMLInputElement | null
    searchInput?.scrollIntoView({ behavior: "smooth", block: "center" })
    window.setTimeout(() => searchInput?.focus(), 180)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="border-b border-border/50 bg-secondary/30">
          <div className="mx-auto flex h-8 max-w-[1440px] items-center justify-between px-4 text-[9px] font-bold uppercase tracking-[0.16em] text-muted-foreground sm:px-6 lg:px-10">
            <span className="inline-flex items-center gap-2">
              <span className="relative flex size-1.5" aria-hidden="true"><span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" /><span className="relative inline-flex size-1.5 rounded-full bg-primary" /></span>
              <span className="text-primary font-bold">DELIVERY ONLY IN BASHUNDHARA R/A</span>
              <span className="text-foreground">· 10 PM — 4 AM</span>
            </span>
            <span className="hidden sm:inline text-foreground/80">Approved Blocks: A · G · H · I · J · K · L · M</span>
            <span className="sm:hidden font-mono text-primary">Bashundhara R/A</span>
          </div>
        </div>
        <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-10">
          <BrandMark />
          <nav aria-label="Main navigation" className="hidden items-center gap-7 text-xs font-medium text-muted-foreground lg:flex">
            <a href="#categories" className="transition-colors hover:text-foreground">Categories</a>
            <a href="#popular" className="transition-colors hover:text-foreground">Tonight&apos;s picks</a>
            <Link href="/portal/store" className="transition-colors hover:text-foreground">For local businesses</Link>
          </nav>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="Focus product search" onClick={focusSearch}>
              <Search aria-hidden="true" />
            </Button>
            <Button variant="ghost" size="icon" className="relative rounded-full" aria-label={`Open bag${itemCount ? `, ${itemCount} items` : ""}`} onClick={() => setCartOpen(true)}>
              <ShoppingBag aria-hidden="true" />
              {itemCount > 0 && <Badge className="absolute -right-1 -top-1 grid size-5 min-w-5 place-items-center border-2 border-background px-0 text-[9px] tabular-nums">{itemCount}</Badge>}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="hidden rounded-full px-4 sm:inline-flex"
              onClick={() => setAuthModalOpen(true)}
            >
              Track order / Sign in
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full sm:hidden"
              aria-label="Track order"
              onClick={() => setAuthModalOpen(true)}
            >
              <UserRound aria-hidden="true" />
            </Button>
            <Button variant="secondary" size="sm" className="hidden rounded-full px-4 xl:inline-flex" nativeButton={false} render={<Link href="/dashboard/admin" />}>
              <BarChart3 data-icon="inline-start" aria-hidden="true" />
              Preview console
            </Button>
          </div>
        </div>
      </header>

      <Storefront
        selectedBlock={selectedBlock}
        onBlockChange={handleBlockChange}
        cart={cart}
        onAdd={(productId) => updateCart(productId, 1)}
        onRemove={(productId) => updateCart(productId, -1)}
      />

      <MobileNav itemCount={itemCount} onSearch={focusSearch} onOpenCart={() => setCartOpen(true)} />
      <CartSheet
        open={cartOpen}
        onOpenChange={setCartOpen}
        cart={cart}
        selectedBlock={selectedBlock}
        onBlockChange={handleBlockChange}
        onAdd={(productId) => updateCart(productId, 1)}
        onRemove={(productId) => updateCart(productId, -1)}
        onClear={clearCart}
      />
      <CustomerAuthDialog open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  )
}
