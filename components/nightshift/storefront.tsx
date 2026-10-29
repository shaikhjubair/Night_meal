"use client"

import Image from "next/image"
import { useMemo, useState } from "react"
import { ArrowRight, Clock3, MapPin, Search, ShieldCheck, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { HeroSlider } from "@/components/nightshift/hero-slider"
import { ProductCard } from "@/components/nightshift/product-card"
import {
  categoryThumbnails,
  deliveryBlocks,
  formatCurrency,
  productCategories,
  products,
  type Product,
} from "@/lib/nightshift-data"

export function Storefront({
  selectedBlock,
  onBlockChange,
  cart,
  onAdd,
  onRemove,
}: {
  selectedBlock: string
  onBlockChange: (block: string) => void
  cart: Record<string, number>
  onAdd: (productId: string) => void
  onRemove: (productId: string) => void
}) {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const currentBlock = deliveryBlocks.find((block) => block.code === selectedBlock) ?? deliveryBlocks[1]

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return products.filter((product) => {
      const matchesCategory = activeCategory === "All" || product.category === activeCategory
      const matchesSearch =
        !normalizedSearch ||
        `${product.name} ${product.vendor} ${product.category}`.toLowerCase().includes(normalizedSearch)

      return matchesCategory && matchesSearch
    })
  }, [activeCategory, search])

  return (
    <main className="mx-auto w-full max-w-[1440px] px-4 pb-28 pt-5 sm:px-6 lg:px-10 lg:pb-16 lg:pt-8">
      {/* Dynamic Hero Image Slider & Bashundhara Delivery Zone Selector */}
      <HeroSlider selectedBlock={selectedBlock} onBlockChange={onBlockChange} />

      <section id="categories" className="mt-9 scroll-mt-28" aria-labelledby="categories-heading">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">A little bit of everything</p>
            <h2 id="categories-heading" className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">What sounds good?</h2>
          </div>
          <p className="hidden text-xs text-muted-foreground sm:block">Explore visual night menus curated by neighborhood vendors.</p>
        </div>

        {/* Visual Category Thumbnails Carousel */}
        <div
          className="hide-scrollbar mt-5 flex gap-3 overflow-x-auto pb-2 pt-1"
          role="group"
          aria-label="Filter products by visual category"
        >
          {categoryThumbnails.map((cat) => {
            const isSelected = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`group relative h-36 w-44 shrink-0 overflow-hidden rounded-2xl border text-left transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isSelected
                    ? "border-primary shadow-[0_0_24px_rgba(255,255,255,0.15)] ring-2 ring-primary/50"
                    : "border-border/70 hover:border-primary/40 hover:shadow-md"
                }`}
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="180px"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                />
                <div
                  aria-hidden="true"
                  className={`absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-background/20 transition-opacity ${
                    isSelected ? "opacity-95" : "opacity-85 group-hover:opacity-75"
                  }`}
                />
                {cat.badge && (
                  <Badge
                    variant="outline"
                    className="absolute left-2.5 top-2.5 border-border/70 bg-background/80 text-[8px] font-semibold uppercase tracking-wider backdrop-blur-md"
                  >
                    {cat.badge}
                  </Badge>
                )}
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <p className="text-xs font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {cat.name}
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground truncate">
                    {cat.subtitle}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Quick Filter Pill Buttons */}
        <div className="hide-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Quick category pills">
          <Button
            variant={activeCategory === "All" ? "default" : "outline"}
            size="sm"
            className="shrink-0 rounded-full px-4 text-xs"
            onClick={() => setActiveCategory("All")}
            aria-pressed={activeCategory === "All"}
          >
            All picks
          </Button>
          {productCategories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              size="sm"
              className="shrink-0 rounded-full px-4 text-xs"
              onClick={() => setActiveCategory(category)}
              aria-pressed={activeCategory === category}
            >
              {category}
            </Button>
          ))}
        </div>
      </section>

      <section id="popular" className="mt-7 scroll-mt-28" aria-labelledby="products-heading">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles aria-hidden="true" className="size-4 text-primary" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Curated for after-hours</p>
            </div>
            <h2 id="products-heading" className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Tonight&apos;s top picks</h2>
            <p className="mt-2 text-sm text-muted-foreground">Independent neighborhood vendors, one late-night checkout.</p>
          </div>
          <div className="relative">
            <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="product-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search food, drinks, essentials…"
              aria-label="Search products and vendors"
              className="h-11 rounded-2xl border-border/80 bg-card/70 pl-11 pr-4"
            />
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {filteredProducts.map((product: Product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                quantity={cart[product.id] ?? 0}
                index={index}
                onAdd={() => onAdd(product.id)}
                onRemove={() => onRemove(product.id)}
              />
            ))}
          </div>
        ) : (
          <Card className="mt-5 rounded-3xl border-dashed bg-card/50 py-12 text-center">
            <CardContent>
              <p className="font-medium">No matches in this corner of the night.</p>
              <p className="mt-1 text-sm text-muted-foreground">Try another category or search for a different pick.</p>
              <Button variant="outline" size="sm" className="mt-4 rounded-full" onClick={() => { setSearch(""); setActiveCategory("All") }}>
                Clear filters
              </Button>
            </CardContent>
          </Card>
        )}
      </section>

      <section className="mt-10 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-hidden rounded-[26px] border-border/70 bg-primary/5 p-0">
          <CardContent className="flex h-full flex-col justify-between gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
            <div className="max-w-lg">
              <Badge variant="outline" className="border-primary/25 bg-primary/10 text-primary">For local businesses</Badge>
              <h2 className="mt-4 text-xl font-semibold tracking-tight sm:text-2xl">Your counter stays open after closing time.</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Join the neighborhood network and reach the people who are still up.</p>
            </div>
            <Button variant="outline" className="shrink-0 rounded-full" nativeButton={false} render={<a href="/portal/store" />}>
              Explore the store portal
              <ArrowRight data-icon="inline-end" aria-hidden="true" />
            </Button>
          </CardContent>
        </Card>
        <Card className="rounded-[26px] border-border/70 bg-card/60 p-0">
          <CardContent className="flex h-full items-start gap-4 p-6 sm:p-8">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
              <MapPin aria-hidden="true" className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">Made for your neighborhood</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Select an approved delivery block at checkout. Your fee is shown upfront — no surprises.</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <footer className="mt-12 flex flex-col gap-3 border-t border-border/70 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 Rater khabar · Bashundhara R/A. Prices shown in BDT (৳).</span>
        <span className="flex flex-wrap gap-x-4 gap-y-2">
          <a href="/login" className="transition-colors hover:text-foreground">Customer sign in</a>
          <a href="/portal/super-admin" className="transition-colors hover:text-foreground">Operations access</a>
          <a href="/dashboard/admin" className="transition-colors hover:text-foreground">Dashboard preview</a>
        </span>
      </footer>
    </main>
  )
}
