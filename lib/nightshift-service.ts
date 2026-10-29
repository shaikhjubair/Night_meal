import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"
import {
  previewOrders,
  type OrderStatus,
  type PreviewOrder,
  type UserRole,
} from "@/lib/nightshift-data"

export type DeliveryGpsUpdate = {
  orderId: string
  latitude: number
  longitude: number
  speedKmh: number
  bearing: number
  distanceRemainingKm: number
  etaMinutes: number
}

// -----------------------------------------------------------------------------
// 1. AUTHENTICATION (Mobile SMS OTP with Supabase Auth)
// -----------------------------------------------------------------------------

export async function requestMobileOtp(rawPhone: string) {
  const cleanPhone = rawPhone.replace(/[\s-]/g, "").replace(/^0/, "")
  const fullPhone = `+880${cleanPhone}`

  if (!isSupabaseConfigured()) {
    // Graceful simulation fallback when credentials are not yet entered
    return {
      success: true,
      simulated: true,
      message: `Code sent (Simulated Mode). Code is 839201.`,
      simulatedCode: "839201",
    }
  }

  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithOtp({
    phone: fullPhone,
  })

  if (error) {
    throw new Error(error.message)
  }

  return {
    success: true,
    simulated: false,
    message: `Verification code sent via SMS to ${fullPhone}.`,
    data,
  }
}

export async function verifyMobileOtp(rawPhone: string, token: string) {
  const cleanPhone = rawPhone.replace(/[\s-]/g, "").replace(/^0/, "")
  const fullPhone = `+880${cleanPhone}`

  if (!isSupabaseConfigured()) {
    return {
      success: true,
      simulated: true,
      role: "customer" as UserRole,
    }
  }

  const supabase = createClient()
  const { data, error } = await supabase.auth.verifyOtp({
    phone: fullPhone,
    token,
    type: "sms",
  })

  if (error || !data.user) {
    throw new Error(error?.message || "Verification code is invalid or expired.")
  }

  // Fetch verified user profile role from database
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, preferred_block")
    .eq("id", data.user.id)
    .single()

  const role: UserRole = (profile?.role as UserRole) || "customer"

  return {
    success: true,
    simulated: false,
    user: data.user,
    profile,
    role,
  }
}

// -----------------------------------------------------------------------------
// 2. ORDERS CRUD
// -----------------------------------------------------------------------------

export async function fetchLiveOrders(): Promise<PreviewOrder[]> {
  if (!isSupabaseConfigured()) {
    return previewOrders
  }

  const supabase = createClient()
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("placed_at", { ascending: false })

  if (error || !data || data.length === 0) {
    return previewOrders
  }

  return data.map((row) => ({
    id: row.id,
    customer: row.customer_name,
    block: row.delivery_block,
    vendor: row.vendor_name,
    items: row.items_summary,
    amount: Number(row.total_amount),
    status: row.status as OrderStatus,
    placed: new Date(row.placed_at).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "Asia/Dhaka",
    }),
    eta: row.eta,
  }))
}

export async function updateOrderStatusInDb(orderId: string, status: OrderStatus) {
  if (!isSupabaseConfigured()) {
    return { success: true }
  }

  const supabase = createClient()
  const { error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", orderId)

  if (error) {
    console.error("Failed to update order status:", error)
    throw new Error(error.message)
  }

  return { success: true }
}

export async function placeLiveOrder({
  orderId,
  customerName,
  customerPhone,
  vendorName,
  deliveryBlock,
  items,
  subtotal,
  deliveryFee,
  total,
}: {
  orderId: string
  customerName: string
  customerPhone: string
  vendorName: string
  deliveryBlock: string
  items: { id: string; name: string; price: number; quantity: number }[]
  subtotal: number
  deliveryFee: number
  total: number
}) {
  if (!isSupabaseConfigured()) {
    return { success: true, orderId }
  }

  const supabase = createClient()
  const { data: userAuth } = await supabase.auth.getUser()

  const storeId = "c0a80121-0000-0000-0000-000000000001" // Tiger Noodle Club default
  const itemsSummary = items.map((i) => `${i.name} × ${i.quantity}`).join(", ")

  const { error: orderError } = await supabase.from("orders").insert({
    id: orderId,
    customer_id: userAuth.user?.id || null,
    customer_name: customerName,
    customer_phone: customerPhone,
    store_id: storeId,
    vendor_name: vendorName,
    delivery_block: deliveryBlock,
    status: "Preparing",
    items_summary: itemsSummary,
    subtotal,
    delivery_fee: deliveryFee,
    platform_fee_rate: 8.0,
    platform_fee_amount: Math.round(subtotal * 0.08),
    vendor_payout_amount: subtotal - Math.round(subtotal * 0.08),
    total_amount: total,
    currency: "BDT",
    eta: "20–28 min",
  })

  if (orderError) {
    throw new Error(orderError.message)
  }

  // Auto-create initial delivery record for tracking
  await supabase.from("deliveries").insert({
    order_id: orderId,
    rider_name: "Unassigned",
    status: "offered",
    rider_pay: 150.0,
    current_latitude: 23.7925,
    current_longitude: 90.4078,
    distance_remaining_km: 1.8,
    eta_minutes: 18,
  })

  return { success: true, orderId }
}

// -----------------------------------------------------------------------------
// 3. STORE MENU CRUD
// -----------------------------------------------------------------------------

export async function fetchStoreProducts(storeId?: string) {
  if (!isSupabaseConfigured()) {
    return null
  }

  const supabase = createClient()
  let query = supabase.from("products").select("*").order("created_at", { ascending: false })

  if (storeId) {
    query = query.eq("store_id", storeId)
  }

  const { data, error } = await query
  if (error || !data) return null
  return data
}

export async function insertStoreProduct(product: {
  storeId?: string
  name: string
  category: string
  price: number
  stock: number
}) {
  if (!isSupabaseConfigured()) {
    return { success: true }
  }

  const supabase = createClient()
  const { data, error } = await supabase
    .from("products")
    .insert({
      store_id: product.storeId || "c0a80121-0000-0000-0000-000000000001",
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      eta: "20–30 min",
      rating: 4.8,
      is_available: true,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

// -----------------------------------------------------------------------------
// 4. REAL-TIME WEBSOCKET GPS TRACKING
// -----------------------------------------------------------------------------

/**
 * Rider App: Broadcasts device GPS coordinates via WebSockets + updates PostgreSQL
 */
export async function broadcastRiderGps(update: DeliveryGpsUpdate) {
  if (!isSupabaseConfigured()) return

  const supabase = createClient()

  // 1. Broadcast over Realtime WebSocket Channel for instant 60fps rendering
  const channel = supabase.channel(`tracking:${update.orderId}`)
  await channel.send({
    type: "broadcast",
    event: "gps_tick",
    payload: update,
  })

  // 2. Persist to deliveries table for state recovery
  await supabase
    .from("deliveries")
    .update({
      current_latitude: update.latitude,
      current_longitude: update.longitude,
      current_speed_kmh: update.speedKmh,
      current_bearing: update.bearing,
      distance_remaining_km: update.distanceRemainingKm,
      eta_minutes: update.etaMinutes,
      last_gps_update: new Date().toISOString(),
    })
    .eq("order_id", update.orderId)
}

/**
 * Customer & Operations: Listens to live WebSocket GPS stream
 */
export function subscribeToDeliveryGps(
  orderId: string,
  onGpsUpdate: (update: DeliveryGpsUpdate) => void,
) {
  if (!isSupabaseConfigured()) {
    return () => {}
  }

  const supabase = createClient()

  // Listen to both Realtime WebSocket Broadcast and Postgres Database Changes
  const channel = supabase
    .channel(`tracking:${orderId}`)
    .on("broadcast", { event: "gps_tick" }, ({ payload }) => {
      onGpsUpdate(payload as DeliveryGpsUpdate)
    })
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "deliveries",
        filter: `order_id=eq.${orderId}`,
      },
      (payload) => {
        const row = payload.new as Record<string, unknown>
        onGpsUpdate({
          orderId,
          latitude: Number(row.current_latitude),
          longitude: Number(row.current_longitude),
          speedKmh: Number(row.current_speed_kmh),
          bearing: Number(row.current_bearing),
          distanceRemainingKm: Number(row.distance_remaining_km),
          etaMinutes: Number(row.eta_minutes),
        })
      },
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
