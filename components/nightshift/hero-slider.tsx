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

        {/* Desktop Bashundhara R/A Drop Zone Selector - Borderless & Integrated */}
        <div className="hidden lg:flex flex-col justify-center space-y-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-xl bg-primary/20 text-primary backdrop-blur-md">
                <MapPin aria-hidden="true" className="size-4" />
              </span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary block leading-none">
                  Delivery Zone
                </span>
                <p className="text-xs font-bold text-white/90 mt-1">Bashundhara R/A</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 backdrop-blur-md">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              10 PM — 4 AM
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-slate-300">
              Select Your Residential Block
            </label>
            <Select value={selectedBlock} onValueChange={(value) => value && onBlockChange(value)}>
              <SelectTrigger className="h-12 w-full rounded-2xl border border-white/15 bg-black/40 px-3.5 text-xs sm:text-sm font-semibold text-white shadow-lg backdrop-blur-md hover:border-primary/50 hover:bg-black/60 transition-all focus:ring-1 focus:ring-primary/40">
                <SelectValue>{`Bashundhara Block ${currentBlock.code} (${currentBlock.zone})`}</SelectValue>
              </SelectTrigger>
              <SelectContent align="end" className="w-[300px] rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-2xl p-1.5 text-white shadow-2xl">
                {deliveryBlocks.map((block) => (
                  <SelectItem key={block.code} value={block.code} className="rounded-xl py-2 px-3 focus:bg-white/10 focus:text-white cursor-pointer">
                    <div className="flex items-center justify-between w-full gap-3">
                      <span className="font-semibold">Block {block.code} <span className="text-xs text-slate-400">({block.zone})</span></span>
                      <span className="font-mono text-xs font-bold text-emerald-400">
                        {formatCurrency(block.fee)} flat
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-white/10">
            <div>
              <p className="text-[11px] font-medium text-slate-400">Block {currentBlock.code} Delivery Fee</p>
              <p className="font-mono text-lg font-black text-white mt-0.5">
                {formatCurrency(currentBlock.fee)} <span className="text-[11px] font-normal text-slate-400">flat rate</span>
              </p>
            </div>
            <div className="flex items-center gap-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 backdrop-blur-md">
              <ShieldCheck aria-hidden="true" className="size-4 text-emerald-400" />
              <span className="text-[11px] font-bold text-slate-300">Gate Handoff</span>
            </div>
          </div>

          <p className="text-[11px] leading-relaxed text-slate-400/90">
            <span className="font-bold text-slate-200">Late Night Direct Delivery:</span> Serving Bashundhara Blocks A–M every night until 4 AM.
          </p>
        </div>
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
