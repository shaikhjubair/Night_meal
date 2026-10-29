"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  Compass,
  Crosshair,
  MapPin,
  Minus,
  Navigation,
  Navigation2,
  Plus,
  Radio,
  Store,
  Volume2,
  VolumeX,
} from "lucide-react"

export type RoutePreviewProps = {
  compact?: boolean
  moving?: boolean
  destinationBlock?: string
  vendorName?: string
  riderName?: string
  orderId?: string
  mode?: "customer" | "rider"
  onProgressChange?: (percent: number, etaText: string) => void
}

// Bashundhara R/A real road coordinates from Block G Charcoal Corner to Block A Gate 2 Checkpoint
const BASHUNDHARA_ROUTE = [
  { x: 180, y: 390, instruction: "Pick up hot order at Dhaba Outpost (Block G)", road: "Road 11, Block G", speed: 0, distKm: 1.8, etaMin: 12 },
  { x: 230, y: 350, instruction: "Head north on Road 11 toward Main Boulevard", road: "Road 11", speed: 24, distKm: 1.6, etaMin: 10 },
  { x: 310, y: 300, instruction: "Turn left onto Bashundhara Main Boulevard", road: "Bashundhara Main Blvd", speed: 34, distKm: 1.3, etaMin: 8 },
  { x: 410, y: 240, instruction: "Continue past Evercare Hospital intersection", road: "Bashundhara Main Blvd", speed: 38, distKm: 0.9, etaMin: 6 },
  { x: 500, y: 190, instruction: "Turn right onto Avenue 2 toward Block A", road: "Avenue 2", speed: 28, distKm: 0.5, etaMin: 4 },
  { x: 570, y: 140, instruction: "Approach Block A Security Gate 2 Checkpoint", road: "Avenue 2, Block A", speed: 18, distKm: 0.2, etaMin: 2 },
  { x: 630, y: 100, instruction: "Arrived at customer handoff: Block A Gate 2", road: "Block A Gate 2", speed: 0, distKm: 0.0, etaMin: 0 },
]

export function RoutePreview({
  compact = false,
  moving = true,
  destinationBlock = "A",
  vendorName = "Block G Charcoal Corner",
  riderName = "Rafi Islam",
  orderId = "NS-9057",
  mode = "customer",
  onProgressChange,
}: RoutePreviewProps) {
  const [routeIndex, setRouteIndex] = useState(mode === "rider" ? 2 : 3)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [isMuted, setIsMuted] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const activePoint = BASHUNDHARA_ROUTE[routeIndex] ?? BASHUNDHARA_ROUTE[0]
  const isArrived = routeIndex === BASHUNDHARA_ROUTE.length - 1

  // Calculate heading between consecutive route waypoints
  const headingAngle = useMemo(() => {
    const curr = activePoint
    const next = BASHUNDHARA_ROUTE[Math.min(routeIndex + 1, BASHUNDHARA_ROUTE.length - 1)]
    if (!curr || !next || curr === next) return 45
    const dx = next.x - curr.x
    const dy = next.y - curr.y
    return (Math.atan2(dy, dx) * 180) / Math.PI + 90
  }, [activePoint, routeIndex])

  // Periodic courier movement simulation along Bashundhara streets
  useEffect(() => {
    if (!moving) return

    const interval = setInterval(() => {
      setRouteIndex((prev) => {
        const next = prev >= BASHUNDHARA_ROUTE.length - 1 ? 0 : prev + 1
        return next
      })
    }, 4500)

    return () => clearInterval(interval)
  }, [moving])

  // Sync progress & ETA with parent
  useEffect(() => {
    if (!onProgressChange) return
    const pct = Math.round((routeIndex / (BASHUNDHARA_ROUTE.length - 1)) * 100)
    const etaText = isArrived ? "Arrived" : `${activePoint.etaMin} mins (${activePoint.distKm} km)`
    onProgressChange(pct, etaText)
  }, [routeIndex, isArrived, activePoint, onProgressChange])

  function handleZoomIn() {
    setZoomLevel((prev) => Math.min(prev + 0.25, 2.0))
  }

  function handleZoomOut() {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.8))
  }

  function handleRecenter() {
    setZoomLevel(1)
    setPanOffset({ x: 0, y: 0 })
  }

  function handleMouseDown(e: React.MouseEvent) {
    setIsDragging(true)
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y })
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!isDragging) return
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    })
  }

  function handleMouseUp() {
    setIsDragging(false)
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden select-none rounded-[22px] border border-white/[0.08] bg-[#0c1017] shadow-[0_12px_40px_rgba(0,0,0,0.5)] ${
        compact ? "h-[300px]" : "h-[380px] sm:h-[460px] lg:h-[500px]"
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* REALISTIC DARK CITY MAP BACKGROUND LAYER */}
      {/* High-fidelity dark cartography texture representing satellite/road grid */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-300 ease-out"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0.85) 0%, rgba(3, 7, 18, 0.98) 100%), url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=80')",
          backgroundBlendMode: "multiply",
          transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
          transformOrigin: "center center",
        }}
      >
        {/* REAL ROAD CARTOGRAPHY SVG OVERLAY */}
        <svg
          className="absolute inset-0 size-full pointer-events-none"
          viewBox="0 0 800 550"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Route glow gradient */}
            <linearGradient id="routeGlowGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="1" />
            </linearGradient>

            {/* Courier pulse filter */}
            <filter id="puckGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Water pattern */}
            <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#082f49" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0.6" />
            </linearGradient>
          </defs>

          {/* Central Lake Canal (Bashundhara Lake) */}
          <path
            d="M 50,480 Q 200,430 350,470 T 700,430"
            fill="none"
            stroke="url(#waterGrad)"
            strokeWidth="28"
            strokeLinecap="round"
          />
          <text x="210" y="465" fill="#38bdf8" fillOpacity="0.35" fontSize="10" fontStyle="italic" fontWeight="600" letterSpacing="2">
            BASHUNDHARA CENTRAL LAKE
          </text>

          {/* MAJOR THOROUGHFARES (Bashundhara R/A Dhaka Grid) */}
          {/* Pragati Sarani Arterial */}
          <line x1="40" y1="520" x2="140" y2="40" stroke="#1e293b" strokeWidth="18" strokeLinecap="round" />
          <line x1="40" y1="520" x2="140" y2="40" stroke="#334155" strokeWidth="10" strokeLinecap="round" />
          <text x="65" y="280" fill="#64748b" fontSize="9" fontWeight="700" letterSpacing="1" transform="rotate(-78, 65, 280)">
            PRAGATI SARANI
          </text>

          {/* Purbachal 300 Ft Expressway */}
          <line x1="80" y1="50" x2="760" y2="70" stroke="#1e293b" strokeWidth="22" strokeLinecap="round" />
          <line x1="80" y1="50" x2="760" y2="70" stroke="#334155" strokeWidth="12" strokeLinecap="round" />
          <text x="320" y="44" fill="#94a3b8" fontSize="10" fontWeight="700" letterSpacing="2">
            PURBACHAL 300 FT EXPRESSWAY
          </text>

          {/* Bashundhara Main Boulevard */}
          <path
            d="M 120,410 L 260,340 L 460,240 L 680,150"
            fill="none"
            stroke="#1e293b"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <path
            d="M 120,410 L 260,340 L 460,240 L 680,150"
            fill="none"
            stroke="#475569"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <text x="280" y="305" fill="#cbd5e1" fontSize="10" fontWeight="700" letterSpacing="1" transform="rotate(-26, 280, 305)">
            BASHUNDHARA MAIN BOULEVARD
          </text>

          {/* Avenue 2 (Route to Block A) */}
          <path
            d="M 460,240 L 530,170 L 650,90"
            fill="none"
            stroke="#1e293b"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M 460,240 L 530,170 L 650,90"
            fill="none"
            stroke="#475569"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <text x="515" y="180" fill="#94a3b8" fontSize="9" fontWeight="700" letterSpacing="1" transform="rotate(-33, 515, 180)">
            AVENUE 2 (BLOCK A)
          </text>

          {/* Secondary Sector Roads */}
          <line x1="180" y1="460" x2="260" y2="340" stroke="#334155" strokeWidth="5" strokeLinecap="round" />
          <text x="185" y="415" fill="#64748b" fontSize="8" fontWeight="600" transform="rotate(-56, 185, 415)">
            ROAD 11 (BLOCK G)
          </text>

          <line x1="300" y1="480" x2="380" y2="350" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
          <line x1="420" y1="450" x2="520" y2="310" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
          <line x1="220" y1="200" x2="380" y2="280" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
          <line x1="360" y1="140" x2="510" y2="220" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />

          {/* KEY LANDMARKS WITH CLEAN LABELS */}
          {/* North South University (NSU) */}
          <rect x="230" y="220" width="85" height="50" rx="8" fill="#1e293b" fillOpacity="0.75" stroke="#334155" strokeWidth="1" />
          <text x="242" y="245" fill="#f8fafc" fontSize="9" fontWeight="800">NSU CAMPUS</text>
          <text x="245" y="258" fill="#94a3b8" fontSize="7">Plot 15, Block B</text>

          {/* Evercare Hospital */}
          <rect x="420" y="260" width="95" height="52" rx="8" fill="#1e293b" fillOpacity="0.75" stroke="#334155" strokeWidth="1" />
          <text x="432" y="285" fill="#f8fafc" fontSize="9" fontWeight="800">EVERCARE HOSP.</text>
          <text x="435" y="298" fill="#ef4444" fontSize="7" fontWeight="600">+ Emergency 24/7</text>

          {/* Jamuna Future Park */}
          <rect x="60" y="100" width="70" height="70" rx="10" fill="#1e293b" fillOpacity="0.75" stroke="#334155" strokeWidth="1" />
          <text x="70" y="135" fill="#f8fafc" fontSize="8" fontWeight="800">JAMUNA</text>
          <text x="70" y="147" fill="#94a3b8" fontSize="7">Future Park</text>

          {/* Block Sector Boundary Outlines */}
          <text x="140" y="470" fill="#475569" fontSize="18" fontWeight="900" opacity="0.4">BLOCK G</text>
          <text x="340" y="400" fill="#475569" fontSize="18" fontWeight="900" opacity="0.4">BLOCK D</text>
          <text x="470" y="360" fill="#475569" fontSize="18" fontWeight="900" opacity="0.4">BLOCK C</text>
          <text x="590" y="240" fill="#475569" fontSize="18" fontWeight="900" opacity="0.4">BLOCK B</text>
          <text x="640" y="160" fill="#10b981" fontSize="18" fontWeight="900" opacity="0.3">BLOCK A</text>

          {/* THE ACTIVE GPS DELIVERY ROUTE PATH */}
          {/* Base route underglow */}
          <polyline
            points={BASHUNDHARA_ROUTE.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="#10b981"
            strokeWidth="10"
            strokeOpacity="0.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Completed route section */}
          <polyline
            points={BASHUNDHARA_ROUTE.slice(0, routeIndex + 1).map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="url(#routeGlowGrad)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Remaining route section (dashed) */}
          <polyline
            points={BASHUNDHARA_ROUTE.slice(routeIndex).map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="#64748b"
            strokeWidth="4"
            strokeDasharray="6 6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* STORE PICKUP PIN (Block G Charcoal Corner) */}
          <g transform={`translate(${BASHUNDHARA_ROUTE[0].x}, ${BASHUNDHARA_ROUTE[0].y})`}>
            {/* Outer ring */}
            <circle r="14" fill="#3b82f6" fillOpacity="0.2" stroke="#3b82f6" strokeWidth="1" />
            <circle r="8" fill="#2563eb" />
            <circle r="3" fill="#ffffff" />
            {/* Callout Tag */}
            <g transform="translate(18, -12)">
              <rect width="135" height="24" rx="6" fill="#0f172a" fillOpacity="0.9" stroke="#3b82f6" strokeWidth="1" />
              <text x="8" y="16" fill="#93c5fd" fontSize="9.5" fontWeight="700">
                🏪 Store: Charcoal Corner
              </text>
            </g>
          </g>

          {/* CUSTOMER DROPOFF PIN (Block A Gate 2) */}
          <g transform={`translate(${BASHUNDHARA_ROUTE[BASHUNDHARA_ROUTE.length - 1].x}, ${BASHUNDHARA_ROUTE[BASHUNDHARA_ROUTE.length - 1].y})`}>
            {/* Pulsing ring */}
            <circle r="18" fill="#10b981" fillOpacity="0.2" className="animate-ping" />
            <circle r="12" fill="#10b981" fillOpacity="0.3" stroke="#10b981" strokeWidth="1.5" />
            <circle r="7" fill="#10b981" />
            <circle r="3" fill="#ffffff" />
            {/* Callout Tag */}
            <g transform="translate(-160, -12)">
              <rect width="150" height="24" rx="6" fill="#0f172a" fillOpacity="0.9" stroke="#10b981" strokeWidth="1" />
              <text x="8" y="16" fill="#6ee7b7" fontSize="9.5" fontWeight="700">
                📍 Drop: Block A Gate 2 Checkpoint
              </text>
            </g>
          </g>

          {/* LIVE COURIER VEHICLE PUCK (Moves along waypoints) */}
          <g
            transform={`translate(${activePoint.x}, ${activePoint.y})`}
            className="transition-all duration-700 ease-out"
          >
            {/* Pulse aura */}
            <circle r="22" fill="#06b6d4" fillOpacity="0.2" className="animate-pulse" />
            <circle r="14" fill="#0891b2" fillOpacity="0.4" stroke="#06b6d4" strokeWidth="2" filter="url(#puckGlow)" />
            {/* Core puck */}
            <circle r="9" fill="#06b6d4" stroke="#ffffff" strokeWidth="2" />
            {/* Directional heading arrowhead */}
            <g transform={`rotate(${headingAngle})`}>
              <polygon points="0,-14 -4,-7 4,-7" fill="#ffffff" />
            </g>
          </g>
        </svg>
      </div>

      {/* TOP TURN-BY-TURN NAVIGATION BANNER (UBER / APPLE MAPS STYLE) */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between gap-3 rounded-2xl border border-white/[0.12] bg-[#0b0f17]/90 px-4 py-3 shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-inner">
            <Navigation className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs sm:text-sm font-bold text-white tracking-tight">
              {activePoint.instruction}
            </p>
            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
              <span className="font-medium text-emerald-400">{activePoint.road}</span>
              <span>·</span>
              <span className="font-mono">{activePoint.distKm} km remaining</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex flex-col items-end text-right">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">ETA</span>
            <span className="font-mono text-sm font-black text-white">
              {isArrived ? "Arrived" : `${activePoint.etaMin} min`}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsMuted((v) => !v)}
            className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 hover:text-white transition-colors"
            title={isMuted ? "Unmute Voice Guidance" : "Mute Voice Guidance"}
          >
            {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* BOTTOM LEFT: LIVE TELEMETRY & SPEEDOMETER */}
      <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2">
        <div className="flex items-center gap-2 rounded-xl border border-white/[0.12] bg-[#0b0f17]/90 px-3 py-2 shadow-lg backdrop-blur-xl">
          <span className="flex size-2 rounded-full bg-emerald-400 animate-ping" />
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black text-white">{activePoint.speed} km/h</span>
            <span className="text-slate-600">|</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {riderName}
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-[#0b0f17]/80 px-2.5 py-2 text-[10px] font-semibold text-slate-400 backdrop-blur-md">
          <Radio className="size-3 text-emerald-400 animate-pulse" />
          <span>GPS LIVE · 4G LTE</span>
        </div>
      </div>

      {/* BOTTOM RIGHT: FLOATING MAP CONTROLS */}
      <div className="absolute bottom-3 right-3 z-20 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={handleRecenter}
          className="flex size-9 items-center justify-center rounded-xl border border-white/[0.12] bg-[#0b0f17]/90 text-slate-200 shadow-md backdrop-blur-xl hover:bg-white/[0.08] hover:text-white transition-all active:scale-95"
          title="Recenter Courier"
        >
          <Crosshair className="size-4" />
        </button>

        <button
          type="button"
          onClick={handleZoomIn}
          className="flex size-9 items-center justify-center rounded-xl border border-white/[0.12] bg-[#0b0f17]/90 text-slate-200 shadow-md backdrop-blur-xl hover:bg-white/[0.08] hover:text-white transition-all active:scale-95"
          title="Zoom In"
        >
          <Plus className="size-4" />
        </button>

        <button
          type="button"
          onClick={handleZoomOut}
          className="flex size-9 items-center justify-center rounded-xl border border-white/[0.12] bg-[#0b0f17]/90 text-slate-200 shadow-md backdrop-blur-xl hover:bg-white/[0.08] hover:text-white transition-all active:scale-95"
          title="Zoom Out"
        >
          <Minus className="size-4" />
        </button>
      </div>
    </div>
  )
}
