"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Flame,
  MapPin,
  Pause,
  Play,
  ShieldCheck,
  Sparkles,
  Tag,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { deliveryBlocks, formatCurrency } from "@/lib/nightshift-data"

export type HeroAdSlide = {
  id: string
  image: string
  overlayTag: string // e.g. "Tonight's Special Offer", "Late Night Deals"
  title: string
  highlightWord?: string
  subtitle: string
  offerPrice?: string
  badgeColor?: string
  ctaText?: string
  ctaHref?: string
}

export const defaultHeroAds: HeroAdSlide[] = [
  {
    id: "flame-grill",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1800&q=85",
    overlayTag: "Tonight's Special Offer",
    title: "Smoky Chicken Chaap &",
    highlightWord: "Crispy Porota",
    subtitle: "Slow-marinated chicken quarter flash-fried in aromatic spices, served with 2 hot flaky porotas.",
    offerPrice: "Combo ৳210",
    badgeColor: "border-amber-500/30 bg-amber-500/15 text-amber-400",
    ctaText: "Order Charcoal Grill",
    ctaHref: "#popular",
  },
  {
    id: "beef-khichuri",
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=1800&q=85",
    overlayTag: "Late Night Deals",
    title: "Authentic Beef Khichuri &",
    highlightWord: "Morog Polao",
    subtitle: "Aromatic chinigura rice slow-simmered with tender spiced beef and rich caramelized gravy.",
    offerPrice: "Special ৳280",
    badgeColor: "border-primary/30 bg-primary/15 text-primary",
    ctaText: "View Rice Specials",
    ctaHref: "#popular",
  },
  {
    id: "loaded-burger-shawarma",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1800&q=85",
    overlayTag: "Midnight Cravings",
    title: "Juicy Loaded Bites &",
    highlightWord: "Chicken Shawarma",
    subtitle: "Toasted pita rolls and thick gourmet patties layered with melted cheese, garlic mayo, and crisps.",
    offerPrice: "Shawarma ৳180",
    badgeColor: "border-orange-500/30 bg-orange-500/15 text-orange-400",
    ctaText: "Explore Midnight Bites",
    ctaHref: "#popular",
  },
  {
    id: "shada-bhat-beef-bhuna",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1800&q=85",
    overlayTag: "Chef's Night Recommendation",
    title: "Steaming Shada Bhat &",
    highlightWord: "Beef Bhuna",
    subtitle: "Homestyle comfort food: hot steamed rice paired with dark-braised beef bhuna or murgi curry.",
    offerPrice: "Complete Meal ৳255",
    badgeColor: "border-emerald-500/30 bg-emerald-500/15 text-emerald-400",
    ctaText: "Order Homestyle Curry",
    ctaHref: "#popular",
  },
]

export function HeroSlider({
  selectedBlock,
  onBlockChange,
  slides = defaultHeroAds,
  autoPlayIntervalMs = 4500,
}: {
  selectedBlock: string
  onBlockChange: (block: string) => void
  slides?: HeroAdSlide[]
  autoPlayIntervalMs?: number
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const currentBlock = deliveryBlocks.find((block) => block.code === selectedBlock) ?? deliveryBlocks[1]

  const activeSlide = slides[currentIndex] ?? slides[0]

  useEffect(() => {
    if (isPaused || slides.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length)
    }, autoPlayIntervalMs)

    return () => clearInterval(timer)
  }, [currentIndex, isPaused, slides.length, autoPlayIntervalMs])

  function handlePrev() {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }

  function handleNext() {
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }

  return (
    <motion.section
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative isolate min-h-[460px] overflow-hidden rounded-[32px] border border-border/80 bg-card shadow-2xl sm:min-h-[500px] lg:min-h-[520px]"
      aria-labelledby="hero-slider-heading"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image Carousel with Smooth Framer Motion Cross-fade */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.75, ease: "easeInOut" }}
            className="absolute inset-0 size-full"
          >
            <Image
              src={activeSlide.image}
              alt={activeSlide.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1440px"
              className="object-cover object-center brightness-75 contrast-110"
            />
          </motion.div>
        </AnimatePresence>

        {/* Ambient Dark Gradients & Vignette for Ultra-Legibility */}
        <div aria-hidden="true" className="absolute inset-0 z-10 bg-gradient-to-r from-background via-background/90 to-background/30" />
        <div aria-hidden="true" className="absolute inset-0 z-10 bg-gradient-to-t from-background via-transparent to-background/30" />
        <div aria-hidden="true" className="absolute -top-24 -left-24 z-10 size-96 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div aria-hidden="true" className="absolute -bottom-24 -right-24 z-10 size-96 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
      </div>

      {/* Main Hero Content Grid */}
      <div className="relative z-20 grid min-h-[460px] grid-cols-1 items-center gap-8 p-6 sm:min-h-[500px] sm:p-9 lg:min-h-[520px] lg:grid-cols-[minmax(0,1.2fr)_320px] lg:p-12">
        <div className="max-w-[700px]">
          {/* Prominent Operational Badges & Delivery Area Rules */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="gap-2 border-primary/30 bg-primary/15 px-3 py-1.5 text-[10px] font-bold tracking-[0.16em] text-primary backdrop-blur-md shadow-sm"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              DELIVERY ONLY IN BASHUNDHARA R/A
            </Badge>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[10px] font-semibold text-muted-foreground backdrop-blur-md">
              <Clock3 className="size-3 text-primary" />
              10 PM — 4 AM BST
            </span>

            {/* Dynamic Offer Tag */}
            <Badge
              variant="outline"
              className={`gap-1 px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase backdrop-blur-md ${activeSlide.badgeColor || "border-amber-500/30 bg-amber-500/15 text-amber-400"}`}
            >
              <Tag className="size-3" />
              {activeSlide.overlayTag}
            </Badge>
          </div>

          {/* Animated Slide Headline & Description */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="mt-6"
            >
              <h1
                id="hero-slider-heading"
                className="max-w-[660px] text-balance text-[clamp(2.3rem,6.5vw,4.5rem)] font-extrabold leading-[1.02] tracking-[-0.055em] text-foreground"
              >
                {activeSlide.title} <br className="hidden sm:inline" />
                <span className="text-primary">{activeSlide.highlightWord}</span>
              </h1>

              <p className="mt-4 max-w-[500px] text-sm leading-6 text-foreground/80 sm:text-base sm:leading-7">
                {activeSlide.subtitle}
              </p>

              {activeSlide.offerPrice && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-primary/30 bg-primary/10 px-3.5 py-1.5 backdrop-blur-md">
                  <Flame className="size-4 text-primary animate-pulse" />
                  <span className="font-mono text-sm font-bold text-foreground">
                    {activeSlide.offerPrice}
                  </span>
                  <span className="text-[11px] text-muted-foreground">· Hot off the stove</span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Call to Actions & Slider Controls */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              className="h-11 rounded-full px-5 text-sm font-bold shadow-lg"
              nativeButton={false}
              render={<a href="#popular" />}
            >
              {activeSlide.ctaText || "Explore Tonight's Picks"}
              <ArrowRight data-icon="inline-end" aria-hidden="true" />
            </Button>

            {/* Slider Navigation Arrows & Dot Indicators */}
            <div className="flex items-center gap-1.5 rounded-full border border-border/80 bg-background/60 p-1 backdrop-blur-md">
              <Button
                variant="ghost"
                size="icon-sm"
                className="size-8 rounded-full hover:bg-secondary"
                aria-label="Previous advertisement"
                onClick={handlePrev}
              >
                <ChevronLeft className="size-4" />
              </Button>

              {/* Slide indicators with live active pill */}
              <div className="flex items-center gap-1 px-1">
                {slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Go to slide ${index + 1}: ${slide.title}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "w-6 bg-primary shadow-sm"
                        : "w-2 bg-muted-foreground/40 hover:bg-muted-foreground"
                    }`}
                  />
                ))}
              </div>

              <Button
                variant="ghost"
                size="icon-sm"
                className="size-8 rounded-full hover:bg-secondary"
                aria-label="Next advertisement"
                onClick={handleNext}
              >
                <ChevronRight className="size-4" />
              </Button>

              <button
                type="button"
                onClick={() => setIsPaused((prev) => !prev)}
                className="ml-1 grid size-7 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
                aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
              >
                {isPaused ? <Play className="size-3" /> : <Pause className="size-3" />}
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Bashundhara R/A Drop Zone Selector Card */}
        <Card className="hidden rounded-[26px] border-border/80 bg-background/80 p-0 shadow-2xl backdrop-blur-xl lg:block">
          <CardContent className="flex flex-col gap-4 p-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                  Bashundhara R/A
                </span>
                <p className="text-xs font-semibold text-foreground">Select Your Delivery Block</p>
              </div>
              <MapPin aria-hidden="true" className="size-5 text-primary" />
            </div>

            <Select value={selectedBlock} onValueChange={(value) => value && onBlockChange(value)}>
              <SelectTrigger className="h-11 w-full rounded-xl border-border/80 bg-secondary/50 px-3 font-medium">
                <SelectValue>{`Bashundhara Block ${currentBlock.code}`}</SelectValue>
              </SelectTrigger>
              <SelectContent align="end" className="w-[280px]">
                {deliveryBlocks.map((block) => (
                  <SelectItem key={block.code} value={block.code}>
                    <span>Block {block.code} ({block.zone})</span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {formatCurrency(block.fee)} flat
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center justify-between border-t border-border/70 pt-3.5">
              <div>
                <p className="text-xs text-muted-foreground">Block {currentBlock.code} Delivery Fee</p>
                <p className="mt-0.5 text-base font-bold text-foreground">
                  {formatCurrency(currentBlock.fee)} <span className="text-xs font-normal text-muted-foreground">flat rate</span>
                </p>
              </div>
              <span className="grid size-10 place-items-center rounded-2xl bg-primary/10 text-primary">
                <ShieldCheck aria-hidden="true" className="size-5" />
              </span>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-2.5 text-[11px] leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">Bashundhara R/A Exclusive:</span>{" "}
              We deliver strictly to Blocks A, G, H, I, J, K, L and M every night from 10 PM to 4 AM.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Bottom Strip */}
      <div className="absolute bottom-0 left-0 right-0 z-30 grid grid-cols-3 border-t border-border/40 bg-background/70 backdrop-blur-md lg:hidden">
        <div className="p-2 text-center">
          <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Drop zone</p>
          <Select value={selectedBlock} onValueChange={(value) => value && onBlockChange(value)}>
            <SelectTrigger
              aria-label="Choose delivery block"
              className="mx-auto h-6 w-full justify-center border-0 bg-transparent px-0 py-0 text-xs font-bold text-primary shadow-none"
            >
              <SelectValue>{`Block ${currentBlock.code}`}</SelectValue>
            </SelectTrigger>
            <SelectContent align="center">
              {deliveryBlocks.map((block) => (
                <SelectItem key={block.code} value={block.code}>
                  <span>Block {block.code}</span>
                  <span className="font-mono text-xs text-muted-foreground">{formatCurrency(block.fee)}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="border-x border-border/40 p-2 text-center">
          <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Delivery</p>
          <p className="mt-0.5 text-xs font-bold">{formatCurrency(currentBlock.fee)}</p>
        </div>
        <div className="p-2 text-center">
          <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Area</p>
          <p className="mt-0.5 text-xs font-bold text-primary truncate px-1">Bashundhara</p>
        </div>
      </div>
    </motion.section>
  )
}
