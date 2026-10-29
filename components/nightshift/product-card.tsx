"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  Bike,
  Cigarette,
  CupSoda,
  Flame,
  Minus,
  Plus,
  Star,
  Utensils,
  type LucideIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import type { Product, ProductCategory } from "@/lib/nightshift-data"
import { formatCurrency } from "@/lib/nightshift-data"

const categoryIcons: Record<ProductCategory, LucideIcon> = {
  "Rice Items": Utensils,
  "Grill Items": Flame,
  Beverages: CupSoda,
  Cigarettes: Cigarette,
}

const artworkThemes: Record<ProductCategory, string> = {
  "Rice Items": "from-primary/20 via-card to-secondary",
  "Grill Items": "from-amber-500/20 via-card to-secondary",
  Beverages: "from-blue-500/20 via-card to-secondary",
  Cigarettes: "from-amber-500/20 via-card to-secondary",
}

export function ProductCard({
  product,
  quantity,
  index,
  onAdd,
  onRemove,
}: {
  product: Product
  quantity: number
  index: number
  onAdd: () => void
  onRemove: () => void
}) {
  const [imageError, setImageError] = useState(false)
  const Icon = categoryIcons[product.category]

  // Clean brand name for fallback display (e.g., "Oris Silver (One pack)" -> "Oris Silver")
  const brandName = product.name.replace(/\(.*?\)/g, "").trim()
  const showImage = Boolean(product.image) && !imageError

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.32, delay: Math.min(index * 0.035, 0.14) }}
      className="h-full"
    >
      <Card className="group h-full rounded-[26px] border-border/70 bg-card/70 p-0 transition-colors hover:border-primary/35 hover:bg-card">
        <div className="relative m-3 flex aspect-[1.45/1] items-center justify-center overflow-hidden rounded-[20px] bg-secondary/60">
          {showImage ? (
            <Image
              src={product.image!}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            /* Sleek, dark placeholder div with Brand Name text in center when image fails or is missing */
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-slate-900 via-slate-950 to-[#07090e]">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-white/[0.05] border border-white/[0.1] shadow-inner mb-2 text-slate-300 group-hover:text-amber-400 group-hover:border-amber-500/30 group-hover:scale-105 transition-all duration-300">
                <Icon aria-hidden="true" className="size-6" strokeWidth={1.75} />
              </div>
              <p className="font-mono text-xs sm:text-sm font-black uppercase tracking-wider text-slate-100 group-hover:text-white transition-colors line-clamp-2 px-2">
                {brandName}
              </p>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                {product.category === "Cigarettes" ? "Pack of 20" : product.category}
              </span>
            </div>
          )}

          {/* Vignette & overlay accents */}
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/25 to-transparent pointer-events-none" />
          <div aria-hidden="true" className="absolute -right-8 -top-10 size-36 rounded-full border border-foreground/10 pointer-events-none" />

          {/* Badges */}
          <Badge variant="outline" className="absolute left-3 top-3 border-border/80 bg-background/80 text-[9px] uppercase tracking-[0.14em] backdrop-blur-md z-10">
            {product.category}
          </Badge>
          {product.ageRestricted && (
            <Badge variant="secondary" className="absolute right-3 top-3 text-[10px] shadow-sm backdrop-blur-md z-10 font-bold">18+</Badge>
          )}

          {product.category === "Cigarettes" ? (
            <span className="absolute bottom-3 left-3 rounded-full border border-amber-500/40 bg-black/85 px-2.5 py-0.5 text-[9px] font-bold text-amber-300 backdrop-blur-md shadow-sm flex items-center gap-1 z-10">
              <Bike className="size-3" />
              Rider Buys on Way
            </span>
          ) : product.badge && !product.ageRestricted ? (
            <span className="absolute bottom-3 right-3 rounded-full border border-border/70 bg-background/80 px-2.5 py-1 text-[10px] font-medium text-foreground/90 backdrop-blur-md shadow-sm z-10">
              {product.badge}
            </span>
          ) : null}
        </div>

        <CardHeader className="gap-2 px-4 pb-1 pt-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-[15px] font-semibold tracking-tight text-foreground">{product.name}</h3>
              <p className="mt-1 truncate text-xs text-muted-foreground">{product.vendor}</p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-secondary/80 px-2 py-1 text-[10px] font-medium text-foreground/85">
              <Star aria-hidden="true" className="size-3 fill-primary text-primary" />
              {product.rating}
            </span>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-3">
          <p className="min-h-9 text-xs leading-relaxed text-muted-foreground">{product.description}</p>
          {product.category === "Cigarettes" && (
            <div className="mt-1.5 flex items-center gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 px-2 py-1 text-[10px] font-medium text-amber-300">
              <Bike className="size-3 shrink-0 text-amber-400" />
              <span>Rider buys on way · Min 5 pcs</span>
            </div>
          )}
          <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">{product.eta} delivery</p>
        </CardContent>
        <CardFooter className="flex justify-between gap-3 border-0 bg-transparent px-4 pb-4 pt-0">
          <p className="text-base font-bold tracking-tight text-foreground">{formatCurrency(product.price)}</p>
          {quantity > 0 ? (
            <div className="flex items-center gap-1.5 rounded-full border border-border/80 bg-secondary/50 p-1" role="group" aria-label={`${product.name} quantity`}>
              <Button variant="ghost" size="icon-sm" className="rounded-full" onClick={onRemove} aria-label={`Remove one ${product.name}`}>
                <Minus aria-hidden="true" />
              </Button>
              <span className="min-w-5 text-center text-xs font-semibold tabular-nums" aria-live="polite">{quantity}</span>
              <Button variant="ghost" size="icon-sm" className="rounded-full" onClick={onAdd} aria-label={`Add one ${product.name}`}>
                <Plus aria-hidden="true" />
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" className="rounded-full px-3" onClick={onAdd} aria-label={`Add ${product.name} to bag`}>
              <Plus data-icon="inline-start" aria-hidden="true" />
              Add
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.article>
  )
}
