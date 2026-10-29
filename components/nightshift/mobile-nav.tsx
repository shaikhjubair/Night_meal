"use client"

import Link from "next/link"
import { useState } from "react"
import { Home, Search, ShoppingBag, UserRound } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function MobileNav({
  itemCount,
  onSearch,
  onOpenCart,
}: {
  itemCount: number
  onSearch: () => void
  onOpenCart: () => void
}) {
  const [activeItem, setActiveItem] = useState("home")

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/92 px-3 pt-2 backdrop-blur-xl md:hidden"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0.5rem)" }}
    >
      <div className="mx-auto grid max-w-xl grid-cols-4 gap-1">
        <Button
          variant={activeItem === "home" ? "secondary" : "ghost"}
          className="h-12 flex-col gap-1 rounded-2xl px-2 text-[10px]"
          nativeButton={false} render={<Link href="/" aria-label="Home" onClick={() => setActiveItem("home")} />}
        >
          <Home aria-hidden="true" />
          Home
        </Button>
        <Button
          variant={activeItem === "search" ? "secondary" : "ghost"}
          className="h-12 flex-col gap-1 rounded-2xl px-2 text-[10px]"
          onClick={() => {
            setActiveItem("search")
            onSearch()
          }}
          aria-label="Search products"
        >
          <Search aria-hidden="true" />
          Search
        </Button>
        <Button
          variant={activeItem === "cart" ? "secondary" : "ghost"}
          className="relative h-12 flex-col gap-1 rounded-2xl px-2 text-[10px]"
          onClick={() => {
            setActiveItem("cart")
            onOpenCart()
          }}
          aria-label={`Open bag${itemCount ? `, ${itemCount} items` : ""}`}
        >
          <ShoppingBag aria-hidden="true" />
          Bag
          {itemCount > 0 && (
            <Badge className="absolute right-4 top-0 grid size-5 min-w-5 place-items-center border-2 border-background px-0 text-[9px] tabular-nums">
              {itemCount}
            </Badge>
          )}
        </Button>
        <Button
          variant={activeItem === "profile" ? "secondary" : "ghost"}
          className="h-12 flex-col gap-1 rounded-2xl px-2 text-[10px]"
          nativeButton={false} render={<Link href="/account" aria-label="Account" onClick={() => setActiveItem("profile")} />}
        >
          <UserRound aria-hidden="true" />
          Account
        </Button>
      </div>
    </nav>
  )
}
