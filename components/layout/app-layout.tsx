"use client"

import type React from "react"

import { useState } from "react"
import SideNavigation from "./side-navigation"
import { cn } from "@/lib/utils"

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [sideNavCollapsed, setSideNavCollapsed] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Side Navigation */}
      <SideNavigation isCollapsed={sideNavCollapsed} onToggle={() => setSideNavCollapsed(!sideNavCollapsed)} />

      {/* Main Content */}
      <div className={cn("flex-1 overflow-hidden transition-all duration-300", sideNavCollapsed ? "ml-0" : "ml-0")}>
        {children}
      </div>
    </div>
  )
}
