export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = "customer" | "admin" | "staff" | "rider" | "store"
export type OrderStatus = "Preparing" | "Ready for pickup" | "On the way" | "Delivered" | "Cancelled"
export type DeliveryStatus = "offered" | "accepted" | "picked-up" | "delivered"

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          phone: string
          full_name: string
          role: UserRole
          preferred_block: string
          is_active: boolean
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          phone: string
          full_name?: string
          role?: UserRole
          preferred_block?: string
          is_active?: boolean
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          phone?: string
          full_name?: string
          role?: UserRole
          preferred_block?: string
          is_active?: boolean
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      stores: {
        Row: {
          id: string
          owner_id: string | null
          name: string
          slug: string
          category: string
          description: string | null
          commission_rate: number
          payout_balance: number
          is_open: boolean
          rating: number
          eta_range: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id?: string | null
          name: string
          slug: string
          category: string
          description?: string | null
          commission_rate?: number
          payout_balance?: number
          is_open?: boolean
          rating?: number
          eta_range?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string | null
          name?: string
          slug?: string
          category?: string
          description?: string | null
          commission_rate?: number
          payout_balance?: number
          is_open?: boolean
          rating?: number
          eta_range?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          id: string
          store_id: string
          name: string
          description: string | null
          category: string
          price: number
          stock: number
          eta: string
          rating: number
          badge: string | null
          age_restricted: boolean
          is_available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          store_id: string
          name: string
          description?: string | null
          category: string
          price: number
          stock?: number
          eta?: string
          rating?: number
          badge?: string | null
          age_restricted?: boolean
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          store_id?: string
          name?: string
          description?: string | null
          category?: string
          price?: number
          stock?: number
          eta?: string
          rating?: number
          badge?: string | null
          age_restricted?: boolean
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          customer_id: string | null
          customer_name: string
          customer_phone: string
          store_id: string
          vendor_name: string
          delivery_block: string
          status: OrderStatus
          items_summary: string
          subtotal: number
          delivery_fee: number
          platform_fee_rate: number
          platform_fee_amount: number
          vendor_payout_amount: number
          total_amount: number
          currency: string
          placed_at: string
          eta: string
          delivered_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          customer_id?: string | null
          customer_name: string
          customer_phone: string
          store_id: string
          vendor_name: string
          delivery_block: string
          status?: OrderStatus
          items_summary: string
          subtotal: number
          delivery_fee: number
          platform_fee_rate?: number
          platform_fee_amount?: number
          vendor_payout_amount?: number
          total_amount?: number
          currency?: string
          placed_at?: string
          eta?: string
          delivered_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string
          store_id?: string
          vendor_name?: string
          delivery_block?: string
          status?: OrderStatus
          items_summary?: string
          subtotal?: number
          delivery_fee?: number
          platform_fee_rate?: number
          platform_fee_amount?: number
          vendor_payout_amount?: number
          total_amount?: number
          currency?: string
          placed_at?: string
          eta?: string
          delivered_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      deliveries: {
        Row: {
          id: string
          order_id: string
          rider_id: string | null
          rider_name: string
          status: DeliveryStatus
          rider_pay: number
          current_latitude: number
          current_longitude: number
          current_speed_kmh: number
          current_bearing: number
          distance_remaining_km: number
          eta_minutes: number
          last_gps_update: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          rider_id?: string | null
          rider_name?: string
          status?: DeliveryStatus
          rider_pay?: number
          current_latitude?: number
          current_longitude?: number
          current_speed_kmh?: number
          current_bearing?: number
          distance_remaining_km?: number
          eta_minutes?: number
          last_gps_update?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          rider_id?: string | null
          rider_name?: string
          status?: DeliveryStatus
          rider_pay?: number
          current_latitude?: number
          current_longitude?: number
          current_speed_kmh?: number
          current_bearing?: number
          distance_remaining_km?: number
          eta_minutes?: number
          last_gps_update?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_block_fee: {
        Args: { block_code: string }
        Returns: number
      }
      is_night_window_open: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      user_role: UserRole
      order_status: OrderStatus
      delivery_status: DeliveryStatus
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
