import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Rater khabar — Late-Night Food Delivery in Bashundhara (10 PM–4 AM)",
  description: "Hot meals, late-night snacks, grill, and essentials delivered across Bashundhara R/A blocks every night from 10 PM to 4 AM.",
  applicationName: "Rater khabar",
  keywords: ["Rater khabar", "late-night delivery", "Bashundhara food delivery", "night food Dhaka", "Bangladesh"],
  openGraph: {
    title: "Rater khabar — Late-Night Delivery Across Bashundhara",
    description: "The city sleeps. We deliver hot food & essentials right to your block gate.",
    type: "website",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b0e12",
  colorScheme: "dark",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">{children}</body>
    </html>
  )
}
