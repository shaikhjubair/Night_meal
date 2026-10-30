import type { LucideIcon } from "lucide-react"

export const productCategories = [
  "Rice Items",
  "Grill Items",
  "Beverages",
  "Cigarettes",
] as const

export type ProductCategory = (typeof productCategories)[number]

export type CategoryThumbnail = {
  id: ProductCategory | "All"
  name: string
  subtitle: string
  image: string
  badge?: string
}

export const categoryThumbnails: CategoryThumbnail[] = [
  {
    id: "All",
    name: "All Picks",
    subtitle: "Complete Bashundhara Menu",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80",
    badge: "Curated",
  },
  {
    id: "Rice Items",
    name: "Rice & Khichuri",
    subtitle: "Khichuri, Polao & Curries",
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80",
    badge: "Hot & Hearty",
  },
  {
    id: "Grill Items",
    name: "Midnight Grill",
    subtitle: "Chaap, Grilled & Porota",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
    badge: "Sizzling",
  },
  {
    id: "Beverages",
    name: "Chilled Drinks",
    subtitle: "Water, Soda & Mishti Doi",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80",
    badge: "Ice Cold",
  },
  {
    id: "Cigarettes",
    name: "Cigarettes & Smoke",
    subtitle: "Procured on the way · Min 5 pcs",
    image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=600&q=80",
    badge: "18+ Rider Action",
  },
]

export type Product = {
  id: string
  name: string
  vendor: string
  category: ProductCategory
  price: number
  description: string
  eta: string
  rating: string
  badge?: string
  ageRestricted?: boolean
  image: string
  minimumQuantity?: number
  isProcuredByRider?: boolean
  procurementNote?: string
}

export const products: Product[] = [
  // --- 1. RICE ITEMS ---
  {
    id: "beef-khichuri",
    name: "Beef Khichuri",
    vendor: "Dhaba Night Outpost",
    category: "Rice Items",
    price: 280,
    description: "Aromatic chinigura rice slow-simmered with tender beef chunks, spiced dal & rich bhuna gravy.",
    eta: "20–28 min",
    rating: "4.9",
    badge: "Chef's Special",
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "morog-polao",
    name: "Morog Polao",
    vendor: "Dhaba Night Outpost",
    category: "Rice Items",
    price: 235,
    description: "Traditional fragrant polao rice served with slow-roasted quarter chicken, boiled egg & caramelized onions.",
    eta: "20–28 min",
    rating: "4.8",
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "chicken-khichuri-boiler",
    name: "Chicken Khichuri Boiler Murgi",
    vendor: "Dhaba Night Outpost",
    category: "Rice Items",
    price: 199,
    description: "Classic yellow lentil khichuri served with juicy chicken curry piece and green chilli fry.",
    eta: "18–25 min",
    rating: "4.7",
    badge: "Value Pick",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "chicken-khichuri-desi",
    name: "Chicken Khichuri Desi Murgi",
    vendor: "Dhaba Night Outpost",
    category: "Rice Items",
    price: 220,
    description: "Slow-simmered khichuri with authentic country chicken (desi murgi) cooked in pure mustard oil & ghee.",
    eta: "22–30 min",
    rating: "4.9",
    badge: "Desi Taste",
    image: "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "shada-bhat-murgi-curry",
    name: "Shada bhat & Murgi curry",
    vendor: "Bashundhara Kitchen",
    category: "Rice Items",
    price: 255,
    description: "Steaming hot white rice accompanied by home-style spiced chicken curry with potato chunks.",
    eta: "18–26 min",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "shada-bhat-murgi-jhal-fry",
    name: "Shada bhat & Murgi jhal fry",
    vendor: "Bashundhara Kitchen",
    category: "Rice Items",
    price: 240,
    description: "Fresh white rice served with hot and spicy dry-braised chicken jhal fry with onions and capsicum.",
    eta: "18–26 min",
    rating: "4.8",
    badge: "Spicy",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "shada-bhat-rui-mach",
    name: "Shada bhat & Rui mach",
    vendor: "Bashundhara Kitchen",
    category: "Rice Items",
    price: 245,
    description: "Steamed white rice paired with fresh Rui fish steak simmered in traditional cumin and tomato gravy.",
    eta: "20–28 min",
    rating: "4.7",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "shada-bhat-katol-mach",
    name: "Shada bhat & Katol mach",
    vendor: "Bashundhara Kitchen",
    category: "Rice Items",
    price: 250,
    description: "Fresh white rice with premium Katol fish peti/gadha piece in a thick caramelized onion sauce.",
    eta: "20–28 min",
    rating: "4.7",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "shada-bhat-beef-bhuna",
    name: "Shada bhat & Beef Bhuna",
    vendor: "Bashundhara Kitchen",
    category: "Rice Items",
    price: 350,
    description: "Plate of steaming hot rice with rich dark-roasted beef bhuna, caramelized gravy & green chillies.",
    eta: "20–30 min",
    rating: "4.9",
    badge: "Customer Favourite",
    image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80",
  },

  // --- 2. GRILL ITEMS ---
  {
    id: "chicken-chaap-porota",
    name: "Chicken Chaap + Porota 2 piece",
    vendor: "Block G Charcoal Corner",
    category: "Grill Items",
    price: 210,
    description: "Shallow-fried crispy marinated chicken leg chaap served piping hot with 2 flaky layered porotas.",
    eta: "18–25 min",
    rating: "4.9",
    badge: "Midnight Sizzle",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "grilled-chicken-porota",
    name: "Grilled Chicken + Porota 2 piece",
    vendor: "Block G Charcoal Corner",
    category: "Grill Items",
    price: 199,
    description: "Smoky charcoal grilled chicken quarter served with tangy garlic sauce, salad and 2 fresh porotas.",
    eta: "18–25 min",
    rating: "4.8",
    badge: "Flame Grilled",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "chicken-shawarma",
    name: "Chicken Shawarma",
    vendor: "Block G Charcoal Corner",
    category: "Grill Items",
    price: 180,
    description: "Toasted pita roll packed with tender roasted chicken cuts, garlic tahini dressing, crisps and pickles.",
    eta: "15–22 min",
    rating: "4.7",
    image: "https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "porota-mix-sabji",
    name: "Porota 2 piece + Mix sabji",
    vendor: "Bashundhara Kitchen",
    category: "Grill Items",
    price: 80,
    description: "Two crispy golden-fried layered porotas served with fresh homestyle mixed seasonal vegetable curry.",
    eta: "14–20 min",
    rating: "4.6",
    image: "https://images.unsplash.com/photo-1505253758473-96b3d5ebcd96?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "porota-egg",
    name: "Porota 2 piece + Egg",
    vendor: "Bashundhara Kitchen",
    category: "Grill Items",
    price: 60,
    description: "Two hot layered porotas accompanied by a freshly prepared onion-chilli fried egg omlette.",
    eta: "12–18 min",
    rating: "4.7",
    badge: "Quick Bite",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
  },

  // --- 3. BEVERAGES ---
  {
    id: "mineral-water-2l",
    name: "Mineral Water 2 litre",
    vendor: "Corner Stop Hub",
    category: "Beverages",
    price: 80,
    description: "Sealed 2-litre bottle of chilled purified mineral water delivered fresh to your door.",
    eta: "12–18 min",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1559839914-17aae19cec71?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "coca-cola",
    name: "Coca-cola",
    vendor: "Corner Stop Hub",
    category: "Beverages",
    price: 70,
    description: "Chilled 500ml Coca-Cola bottle / can, served crisp and cold for your late-night meal.",
    eta: "12–18 min",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "sprite",
    name: "Sprite",
    vendor: "Corner Stop Hub",
    category: "Beverages",
    price: 70,
    description: "Chilled 500ml refreshing lemon-lime sparkling drink delivered ice-cold.",
    eta: "12–18 min",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "mishti-doi",
    name: "Mishti Doi",
    vendor: "Dhaba Night Outpost",
    category: "Beverages",
    price: 90,
    description: "Traditional sweet curd fermented in a natural earthen clay pot with rich caramelized cream layer.",
    eta: "15–20 min",
    rating: "4.9",
    badge: "Sweet Ending",
    image: "https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=800&q=80",
  },

  // --- 4. CIGARETTES (Minimum order 5 pieces / 1 pack, Rider procurement workflow) ---
  {
    id: "oris-silver",
    name: "Oris Silver (One pack)",
    vendor: "Night Kiosk Partner",
    category: "Cigarettes",
    price: 320,
    description: "Sealed 20 sticks pack (Min order 5 pcs for loose). Rider purchases externally on the way.",
    eta: "15–22 min",
    rating: "4.7",
    ageRestricted: true,
    minimumQuantity: 1,
    isProcuredByRider: true,
    procurementNote: "Rider Action Required: Rider must purchase this item on the way to the customer.",
    badge: "Rider Buys on Way",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Marlboro_Silver_Pack.jpg",
  },
  {
    id: "marlboro",
    name: "Marlboro (Advance/Gold/Red)",
    vendor: "Night Kiosk Partner",
    category: "Cigarettes",
    price: 360,
    description: "Sealed 20 sticks pack (Advance, Gold, or Red). Procured by rider on the way.",
    eta: "15–22 min",
    rating: "4.8",
    ageRestricted: true,
    minimumQuantity: 1,
    isProcuredByRider: true,
    procurementNote: "Rider Action Required: Rider must purchase this item on the way to the customer.",
    badge: "Rider Buys on Way",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Marlboro_Logo.svg/1024px-Marlboro_Logo.svg.png",
  },
  {
    id: "benson",
    name: "Benson (Regular/Light)",
    vendor: "Night Kiosk Partner",
    category: "Cigarettes",
    price: 360,
    description: "Sealed 20 sticks pack (Regular or Light). Rider purchases on the way from kiosk.",
    eta: "15–22 min",
    rating: "4.8",
    ageRestricted: true,
    minimumQuantity: 1,
    isProcuredByRider: true,
    procurementNote: "Rider Action Required: Rider must purchase this item on the way to the customer.",
    badge: "Rider Buys on Way",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Benson_%26_Hedges_Gold_Pack.jpg",
  },
  {
    id: "goldleaf-switch",
    name: "Goldleaf Switch",
    vendor: "Night Kiosk Partner",
    category: "Cigarettes",
    price: 260,
    description: "Sealed 20 sticks capsule crush menthol pack. Rider purchases on the way to customer.",
    eta: "15–22 min",
    rating: "4.7",
    ageRestricted: true,
    minimumQuantity: 1,
    isProcuredByRider: true,
    procurementNote: "Rider Action Required: Rider must purchase this item on the way to the customer.",
    badge: "Rider Buys on Way",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Gold_Leaf_pack.jpg",
  },
  {
    id: "lucky-strike",
    name: "Lucky Strike",
    vendor: "Night Kiosk Partner",
    category: "Cigarettes",
    price: 280,
    description: "Sealed 20 sticks authentic toasted blend. Rider purchases on the way to customer.",
    eta: "15–22 min",
    rating: "4.6",
    ageRestricted: true,
    minimumQuantity: 1,
    isProcuredByRider: true,
    procurementNote: "Rider Action Required: Rider must purchase this item on the way to the customer.",
    badge: "Rider Buys on Way",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Lucky_Strike_logo.svg/1024px-Lucky_Strike_logo.svg.png",
  },
  {
    id: "camel-blue",
    name: "Camel Blue",
    vendor: "Night Kiosk Partner",
    category: "Cigarettes",
    price: 300,
    description: "Sealed 20 sticks smooth blend pack. Rider purchases on the way to customer.",
    eta: "15–22 min",
    rating: "4.7",
    ageRestricted: true,
    minimumQuantity: 1,
    isProcuredByRider: true,
    procurementNote: "Rider Action Required: Rider must purchase this item on the way to the customer.",
    badge: "Rider Buys on Way",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Camel_logo.svg/1024px-Camel_logo.svg.png",
  },
]

export type DeliveryBlock = {
  code: string
  fee: number
  zone: string
}

export const deliveryBlocks: DeliveryBlock[] = [
  { code: "A", fee: 50, zone: "Bashundhara Zone 1" },
  { code: "G", fee: 50, zone: "Bashundhara Zone 1" },
  { code: "H", fee: 60, zone: "Bashundhara Zone 2" },
  { code: "I", fee: 60, zone: "Bashundhara Zone 2" },
  { code: "J", fee: 70, zone: "Bashundhara Zone 3" },
  { code: "K", fee: 70, zone: "Bashundhara Zone 3" },
  { code: "L", fee: 80, zone: "Bashundhara Zone 4" },
  { code: "M", fee: 80, zone: "Bashundhara Zone 4" },
]

export const defaultBlock = "G"

export function formatCurrency(value: number) {
  return `৳${new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 0,
  }).format(Math.round(value))}`
}

export function getDeliveryBlock(code: string) {
  return deliveryBlocks.find((block) => block.code === code) ?? deliveryBlocks[1]
}

export function isServiceWindowOpen(now = new Date()) {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Dhaka",
      hour: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(now)
      .find((part) => part.type === "hour")?.value ?? "0",
  )

  return hour >= 22 || hour < 4
}

export type DashboardRole = "admin" | "store" | "rider" | "staff"

export type RoleStat = {
  label: string
  value: string
}

export type RoleDetails = {
  label: string
  portalSlug: string
  dashboardSlug: DashboardRole
  description: string
  eyebrow: string
  badgeText: string
  backgroundImage: string
  demoEmail: string
  demoPassword: string
  accentGlow: string
  stats: RoleStat[]
}

export const portalRoleKeys = ["staff", "store", "rider", "super-admin"] as const
export type PortalRole = (typeof portalRoleKeys)[number]

export const portalRoles: Record<PortalRole, RoleDetails> = {
  staff: {
    label: "Staff Operations",
    portalSlug: "staff",
    dashboardSlug: "staff",
    description: "Manage incoming ticket dispatch, coordinate block gate access, and monitor live rider allocation across Dhaka.",
    eyebrow: "ORDER DISPATCH & OPS",
    badgeText: "Shift Operations Desk",
    backgroundImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
    demoEmail: "ops.mina@raterkhabar.internal",
    demoPassword: "NightOps#2026",
    accentGlow: "from-blue-500/20 via-primary/10 to-transparent",
    stats: [
      { label: "Active Queue", value: "24 Orders" },
      { label: "Dispatch Avg", value: "3.2 min" },
      { label: "Gate Clearance", value: "99.4%" },
    ],
  },
  store: {
    label: "Store Merchant",
    portalSlug: "store",
    dashboardSlug: "store",
    description: "Accept late-night orders, update live inventory stock, and track nightly earnings with automated payout reconciliation.",
    eyebrow: "VENDOR PARTNER DESK",
    badgeText: "Kitchen Terminal",
    backgroundImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=80",
    demoEmail: "partner.tiger@raterkhabar.store",
    demoPassword: "KitchenFire#2026",
    accentGlow: "from-amber-500/20 via-primary/10 to-transparent",
    stats: [
      { label: "Avg Prep Time", value: "8 min" },
      { label: "Tonight's Payout", value: "৳42,850" },
      { label: "Kitchen Status", value: "Cooking" },
    ],
  },
  rider: {
    label: "Courier Fleet",
    portalSlug: "rider",
    dashboardSlug: "rider",
    description: "Review block drop-offs, broadcast live GPS telemetry coordinates to customers, and track completed shift tips.",
    eyebrow: "RIDER & GPS NETWORK",
    badgeText: "Courier Telemetry",
    backgroundImage: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1600&q=80",
    demoEmail: "fleet.rafi@raterkhabar.rider",
    demoPassword: "RiderSpeed#2026",
    accentGlow: "from-purple-500/20 via-primary/10 to-transparent",
    stats: [
      { label: "GPS Telemetry", value: "Active 5s" },
      { label: "Shift Earnings", value: "৳2,480" },
      { label: "Drop Accuracy", value: "100%" },
    ],
  },
  "super-admin": {
    label: "Super Admin",
    portalSlug: "super-admin",
    dashboardSlug: "admin",
    description: "Platform oversight, gross merchandise volume (GMV), vendor margin split governance, and cross-block network security.",
    eyebrow: "ENTERPRISE PLATFORM ROOT",
    badgeText: "Platform Governance",
    backgroundImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80",
    demoEmail: "kazi.admin@raterkhabar.admin",
    demoPassword: "SuperKey#2026",
    accentGlow: "from-emerald-500/20 via-primary/10 to-transparent",
    stats: [
      { label: "Shift GMV", value: "৳184,200" },
      { label: "Platform Uptime", value: "99.98%" },
      { label: "Active Hubs", value: "8 Blocks" },
    ],
  },
}

export type OrderStatus = "Preparing" | "Ready for pickup" | "On the way" | "Delivered"

export type PreviewOrder = {
  id: string
  customer: string
  phone?: string
  address?: string
  block: string
  vendor: string
  items: string
  amount: number
  status: OrderStatus
  placed: string
  eta: string
  hasCigarettes?: boolean
  procurementNote?: string
}

export const previewOrders: PreviewOrder[] = [
  {
    id: "NS-9058",
    customer: "Ayesha R.",
    phone: "1711000005",
    address: "Road 11, Block G, Gate 2",
    block: "G",
    vendor: "Dhaba Night Outpost",
    items: "Beef Khichuri × 1, Coca-cola × 1",
    amount: 400,
    status: "Preparing",
    placed: "12:14 AM",
    eta: "16 min",
  },
  {
    id: "NS-9057",
    customer: "Rafi H.",
    phone: "1711000003",
    address: "Avenue 2, Block A",
    block: "A",
    vendor: "Block G Charcoal Corner",
    items: "Chicken Chaap + Porota 2 piece × 1, Benson (Regular) × 1",
    amount: 620,
    status: "Ready for pickup",
    placed: "12:08 AM",
    eta: "8 min",
    hasCigarettes: true,
    procurementNote: "Rider Action Required: Rider must purchase this item on the way to the customer.",
  },
  {
    id: "NS-9056",
    customer: "Nadia S.",
    phone: "1711000005",
    address: "Block J, Building 4B",
    block: "J",
    vendor: "Dhaba Night Outpost",
    items: "Morog Polao × 1, Mishti Doi × 1",
    amount: 395,
    status: "On the way",
    placed: "11:59 PM",
    eta: "4 min",
  },
  {
    id: "NS-9055",
    customer: "Imran K.",
    phone: "1711000002",
    address: "Block L, Gate 1",
    block: "L",
    vendor: "Block G Charcoal Corner",
    items: "Grilled Chicken + Porota 2 piece × 1",
    amount: 279,
    status: "Delivered",
    placed: "11:42 PM",
    eta: "Delivered",
  },
  {
    id: "NS-9054",
    customer: "Tanvir A.",
    block: "G",
    vendor: "Bashundhara Kitchen",
    items: "Shada bhat & Beef Bhuna × 1",
    amount: 400,
    status: "On the way",
    placed: "11:38 PM",
    eta: "6 min",
  },
  {
    id: "NS-9053",
    customer: "Sabrina M.",
    block: "H",
    vendor: "Night Kiosk Partner",
    items: "Marlboro (Advance/Gold/Red) × 1",
    amount: 420,
    status: "Preparing",
    placed: "11:35 PM",
    eta: "22 min",
    hasCigarettes: true,
    procurementNote: "Rider Action Required: Rider must purchase this item on the way to the customer.",
  },
  {
    id: "NS-9052",
    customer: "Farhan T.",
    block: "I",
    vendor: "Bashundhara Kitchen",
    items: "Shada bhat & Murgi jhal fry × 1, Sprite × 1",
    amount: 370,
    status: "Ready for pickup",
    placed: "11:28 PM",
    eta: "12 min",
  },
  {
    id: "NS-9051",
    customer: "Maya N.",
    block: "K",
    vendor: "Block G Charcoal Corner",
    items: "Chicken Shawarma × 2",
    amount: 430,
    status: "Delivered",
    placed: "11:15 PM",
    eta: "Delivered",
  },
  {
    id: "NS-9050",
    customer: "Zahid Q.",
    block: "M",
    vendor: "Night Kiosk Partner",
    items: "Goldleaf Switch × 1",
    amount: 340,
    status: "Delivered",
    placed: "11:05 PM",
    eta: "Delivered",
    hasCigarettes: true,
    procurementNote: "Rider Action Required: Rider must purchase this item on the way to the customer.",
  },
  {
    id: "NS-9049",
    customer: "Nusrat B.",
    block: "A",
    vendor: "Care & Co. Pharmacy",
    items: "Late-night relief kit × 2",
    amount: 430,
    status: "Delivered",
    placed: "10:52 PM",
    eta: "Delivered",
  },
  {
    id: "NS-9048",
    customer: "Fahim C.",
    block: "G",
    vendor: "Trackside Fuel",
    items: "After-hours hydration × 2",
    amount: 370,
    status: "Delivered",
    placed: "10:44 PM",
    eta: "Delivered",
  },
  {
    id: "NS-9047",
    customer: "Sadia K.",
    block: "H",
    vendor: "Tiger Noodle Club",
    items: "Spicy miso ramen × 1",
    amount: 480,
    status: "Delivered",
    placed: "10:30 PM",
    eta: "Delivered",
  },
]

export type UserRole = "admin" | "staff" | "rider" | "store" | "customer"

export type DemoUser = {
  phone: string
  name: string
  role: UserRole
  roleLabel: string
  targetUrl: string
  description: string
}

export const demoUsers: DemoUser[] = [
  {
    phone: "1711000001",
    name: "Farhan Admin",
    role: "admin",
    roleLabel: "Super Admin",
    targetUrl: "/dashboard/admin",
    description: "Platform oversight, finances & marketplace control",
  },
  {
    phone: "1711000002",
    name: "Mina Operations",
    role: "staff",
    roleLabel: "Staff Desk",
    targetUrl: "/dashboard/staff",
    description: "Order dispatch, queue coordination & rider assign",
  },
  {
    phone: "1711000003",
    name: "Rafi Rider",
    role: "rider",
    roleLabel: "Rider Portal",
    targetUrl: "/dashboard/rider",
    description: "Live pickups, GPS routing & delivery payouts",
  },
  {
    phone: "1711000004",
    name: "Tiger Noodle Mgr",
    role: "store",
    roleLabel: "Store Vendor",
    targetUrl: "/dashboard/store",
    description: "Menu inventory, nightly receipts & vendor payout",
  },
  {
    phone: "1711000005",
    name: "Ayesha Customer",
    role: "customer",
    roleLabel: "Customer",
    targetUrl: "/account",
    description: "Live order tracking, order history & block delivery",
  },
]

export type CategoryWithIcon = {
  title: ProductCategory
  description: string
  icon: LucideIcon
  count: string
}

export function getSavedCustomerOrders(): PreviewOrder[] {
  if (typeof window === "undefined") return previewOrders
  try {
    const raw = localStorage.getItem("nightshift_customer_orders")
    if (raw) return JSON.parse(raw)
  } catch {
    // fallback
  }
  return previewOrders
}

export function saveCustomerOrder(order: PreviewOrder): PreviewOrder[] {
  if (typeof window === "undefined") return [order, ...previewOrders]
  try {
    const existing = getSavedCustomerOrders()
    const updated = [order, ...existing.filter((o) => o.id !== order.id)]
    localStorage.setItem("nightshift_customer_orders", JSON.stringify(updated))
    return updated
  } catch {
    return [order, ...previewOrders]
  }
}

export function getOrdersByPhone(phone: string): PreviewOrder[] {
  if (typeof window === "undefined") return previewOrders
  try {
    const clean = phone.replace(/[\s-]/g, "").replace(/^0/, "")
    const all = getSavedCustomerOrders()
    if (!clean) return all
    const filtered = all.filter(
      (o) =>
        o.phone &&
        (o.phone.includes(clean) || clean.includes(o.phone.replace(/[\s-]/g, "").replace(/^0/, ""))),
    )
    return filtered.length > 0 ? filtered : all
  } catch {
    return previewOrders
  }
}

export function getActiveCustomerPhone(): string | null {
  if (typeof window === "undefined") return null
  try {
    return localStorage.getItem("nightshift_active_customer_phone")
  } catch {
    return null
  }
}

export function setActiveCustomerPhone(phone: string) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(
      "nightshift_active_customer_phone",
      phone.replace(/[\s-]/g, "").replace(/^0/, ""),
    )
  } catch {
    // Ignore
  }
}

export function clearActiveCustomerPhone() {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem("nightshift_active_customer_phone")
    localStorage.removeItem("nightshift_user_session")
  } catch {
    // Ignore
  }
}

