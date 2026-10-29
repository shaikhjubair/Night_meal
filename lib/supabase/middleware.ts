import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import type { Database, UserRole } from "@/lib/supabase/types"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase is not configured yet, allow preview navigation to keep frontend functional
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("placeholder-project")) {
    return supabaseResponse
  }

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        )
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Check if accessing protected dashboard routes
  if (pathname.startsWith("/dashboard/")) {
    const requiredRole = pathname.split("/")[2] as UserRole

    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      url.searchParams.set("redirectTo", pathname)
      return NextResponse.redirect(url)
    }

    // Fetch user profile role from database
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    const userRole = profile?.role

    // Super Admin has access to all dashboards
    if (userRole === "admin") {
      return supabaseResponse
    }

    // Role-specific enforcement
    if (userRole !== requiredRole) {
      const url = request.nextUrl.clone()
      // Redirect to their actual role dashboard or customer space
      url.pathname = userRole === "customer" ? "/account" : `/dashboard/${userRole}`
      return NextResponse.redirect(url)
    }
  }

  // Protect /account route for authenticated customers
  if (pathname === "/account" && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("redirectTo", "/account")
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
