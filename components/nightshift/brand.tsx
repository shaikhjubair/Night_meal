import Link from "next/link"
import { Moon } from "lucide-react"

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="Rater khabar home"
      className="group inline-flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-95"
    >
      <span className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-primary to-emerald-600 text-primary-foreground shadow-[0_0_24px_rgba(16,185,129,0.3)] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
        <Moon aria-hidden="true" className="size-5 fill-current" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[16px] font-black tracking-[0.08em] text-white">
          RATER <span className="text-primary font-black">KHABAR</span>
        </span>
        {!compact && (
          <span className="mt-1 text-[9px] font-bold tracking-[0.28em] text-muted-foreground uppercase">
            Night Delivery · 10PM–4AM
          </span>
        )}
      </span>
    </Link>
  )
}
