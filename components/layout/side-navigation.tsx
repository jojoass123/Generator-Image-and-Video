"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ImageIcon,
  Video,
  Compass,
  History,
  Heart,
  User,
  HelpCircle,
  Crown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SideNavigationProps {
  isCollapsed?: boolean
  onToggle?: () => void
}

export default function SideNavigation({ isCollapsed = false, onToggle }: SideNavigationProps) {
  const pathname = usePathname()

  const navigationItems = [
    {
      title: "Image Generator",
      href: "/playground/image",
      icon: ImageIcon,
      badge: null,
      section: "create",
    },
    {
      title: "Video Generator",
      href: "/playground/video",
      icon: Video,
      badge: "New",
      section: "create",
    },
    {
      title: "Explore Page",
      href: "/explore",
      icon: Compass,
      badge: null,
      section: "discover",
    },
    {
      title: "My History",
      href: "/history",
      icon: History,
      badge: null,
      section: "library",
    },
    {
      title: "Favorites",
      href: "/favorites",
      icon: Heart,
      badge: null,
      section: "library",
    },
    {
      title: "Profile",
      href: "/profile",
      icon: User,
      badge: null,
      section: "account",
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
      badge: null,
      section: "account",
    },
    {
      title: "Help & Support",
      href: "/help",
      icon: HelpCircle,
      badge: null,
      section: "support",
    },
  ]

  const sections = {
    create: "Create",
    discover: "Discover",
    library: "Library",
    account: "Account",
    support: "Support",
  }

  const NavItem = ({ item, isActive }: { item: any; isActive: boolean }) => (
    <Link href={item.href}>
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start h-10 px-3 text-left",
          isCollapsed && "px-2 justify-center",
          isActive && "bg-blue-50 text-blue-700 border-r-2 border-blue-600",
        )}
      >
        <item.icon className={cn("h-4 w-4 flex-shrink-0", !isCollapsed && "mr-3")} />
        {!isCollapsed && (
          <>
            <span className="flex-1 truncate">{item.title}</span>
            {item.badge && (
              <Badge variant={item.badge === "New" ? "default" : "secondary"} className="ml-2 text-xs">
                {item.badge}
              </Badge>
            )}
          </>
        )}
      </Button>
    </Link>
  )

  const renderSection = (sectionKey: string) => {
    const sectionItems = navigationItems.filter((item) => item.section === sectionKey)
    if (sectionItems.length === 0) return null

    return (
      <div key={sectionKey} className="space-y-1">
        {!isCollapsed && (
          <div className="px-2 py-2">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {sections[sectionKey as keyof typeof sections]}
            </h2>
          </div>
        )}
        {sectionItems.map((item) => (
          <NavItem key={item.href} item={item} isActive={pathname === item.href} />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300 relative z-50",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg">AI Studio</h1>
                <p className="text-xs text-gray-500">Creative Platform</p>
              </div>
            </div>
          )}
          {onToggle && (
            <Button variant="ghost" size="sm" onClick={onToggle} className="h-8 w-8 p-0">
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-4">
          {renderSection("create")}
          <Separator />
          {renderSection("discover")}
          <Separator />
          {renderSection("library")}
          <Separator />
          {renderSection("account")}
          <Separator />
          {renderSection("support")}
        </div>
      </div>

      {/* Upgrade Section */}
      <div className="p-2 border-t border-gray-200">
        {!isCollapsed ? (
          <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
            <div className="flex items-center space-x-2 mb-2">
              <Crown className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">Upgrade to Pro</span>
            </div>
            <p className="text-xs text-gray-600 mb-3">Unlock unlimited generations and premium features</p>
            <Button
              size="sm"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Zap className="w-3 h-3 mr-1" />
              Upgrade Now
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="w-full h-10 p-0 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100"
          >
            <Crown className="w-4 h-4 text-blue-600" />
          </Button>
        )}
      </div>
    </div>
  )
}
