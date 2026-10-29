import { Suspense } from "react"
import { AccountExperience } from "@/components/nightshift/account-experience"

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <AccountExperience />
    </Suspense>
  )
}
