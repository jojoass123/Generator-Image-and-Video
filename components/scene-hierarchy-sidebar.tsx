"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  ImageIcon,
  Video,
  Folder,
  Star,
  Clock,
  Palette,
  Camera,
  Lightbulb,
  Layers,
  Plus,
  MoreHorizontal,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SceneItem {
  id: string
  name: string
  type: "camera" | "light" | "object" | "background" | "character" | "generation"
  icon: React.ReactNode
  visible: boolean
  children?: SceneItem[]
  metadata?: {
    model?: string
    style?: string
    timestamp?: Date
    prompt?: string
  }
}

interface SceneHierarchySidebarProps {
  activeTab: "scene" | "assets" | "history"
  onTabChange: (tab: "scene" | "assets" | "history") => void
  sceneItems: SceneItem[]
  onItemSelect: (item: SceneItem) => void
  onItemToggle: (itemId: string) => void
  selectedItemId?: string
}

const MOCK_SCENE_ITEMS: SceneItem[] = [
  {
    id: "camera-1",
    name: "Main Camera",
    type: "camera",
    icon: <Camera className="w-4 h-4" />,
    visible: true,
  },
  {
    id: "lighting",
    name: "Lighting Setup",
    type: "light",
    icon: <Lightbulb className="w-4 h-4" />,
    visible: true,
    children: [
      {
        id: "dome-light",
        name: "Dome Light",
        type: "light",
        icon: <Lightbulb className="w-4 h-4" />,
        visible: true,
      },
      {
        id: "key-light",
        name: "Key Light",
        type: "light",
        icon: <Lightbulb className="w-4 h-4" />,
        visible: true,
      },
      {
        id: "area-light",
        name: "Area Light",
        type: "light",
        icon: <Lightbulb className="w-4 h-4" />,
        visible: false,
      },
    ],
  },
  {
    id: "generations",
    name: "Generated Content",
    type: "object",
    icon: <Layers className="w-4 h-4" />,
    visible: true,
    children: [
      {
        id: "gen-1",
        name: "Cyberpunk City",
        type: "generation",
        icon: <ImageIcon className="w-4 h-4" />,
        visible: true,
        metadata: {
          model: "DALL-E 3",
          style: "Realistic",
          timestamp: new Date(2024, 0, 15),
          prompt: "A futuristic cyberpunk cityscape at night",
        },
      },
      {
        id: "gen-2",
        name: "Ocean Waves",
        type: "generation",
        icon: <Video className="w-4 h-4" />,
        visible: true,
        metadata: {
          model: "Runway ML",
          style: "Cinematic",
          timestamp: new Date(2024, 0, 14),
          prompt: "Peaceful ocean waves at sunset",
        },
      },
    ],
  },
  {
    id: "background-1",
    name: "Background 1",
    type: "background",
    icon: <Palette className="w-4 h-4" />,
    visible: true,
  },
  {
    id: "background-2",
    name: "Background 2",
    type: "background",
    icon: <Palette className="w-4 h-4" />,
    visible: false,
  },
]

const MOCK_HISTORY_ITEMS: SceneItem[] = [
  {
    id: "hist-1",
    name: "Anime Character",
    type: "generation",
    icon: <ImageIcon className="w-4 h-4" />,
    visible: true,
    metadata: {
      model: "Stable Diffusion XL",
      style: "Anime",
      timestamp: new Date(2024, 0, 13),
      prompt: "Anime character with flowing hair in magical forest",
    },
  },
  {
    id: "hist-2",
    name: "Abstract Art",
    type: "generation",
    icon: <ImageIcon className="w-4 h-4" />,
    visible: true,
    metadata: {
      model: "FLUX Pro",
      style: "Abstract",
      timestamp: new Date(2024, 0, 12),
      prompt: "Abstract geometric patterns with vibrant colors",
    },
  },
  {
    id: "hist-3",
    name: "Space Journey",
    type: "generation",
    icon: <Video className="w-4 h-4" />,
    visible: true,
    metadata: {
      model: "Pika Labs",
      style: "Cinematic",
      timestamp: new Date(2024, 0, 11),
      prompt: "Journey through space with stars and galaxies",
    },
  },
]

function SceneItemComponent({
  item,
  level = 0,
  onSelect,
  onToggle,
  isSelected,
}: {
  item: SceneItem
  level?: number
  onSelect: (item: SceneItem) => void
  onToggle: (itemId: string) => void
  isSelected: boolean
}) {
  const [isExpanded, setIsExpanded] = useState(true)
  const hasChildren = item.children && item.children.length > 0

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    if (diffInHours < 24) return `${diffInHours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="select-none">
      <div
        className={cn(
          "flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-gray-100 cursor-pointer group",
          isSelected && "bg-blue-50 border border-blue-200",
        )}
        style={{ paddingLeft: `${8 + level * 16}px` }}
        onClick={() => onSelect(item)}
      >
        {hasChildren && (
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 hover:bg-gray-200"
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
          >
            {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </Button>
        )}
        {!hasChildren && <div className="w-4" />}

        <div className="text-gray-600">{item.icon}</div>

        <span className="flex-1 text-sm text-gray-900 truncate">{item.name}</span>

        {item.metadata && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Badge variant="outline" className="text-xs px-1 py-0">
              {item.metadata.model}
            </Badge>
            {item.metadata.timestamp && (
              <span className="text-xs text-gray-500">{formatTime(item.metadata.timestamp)}</span>
            )}
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation()
            onToggle(item.id)
          }}
        >
          {item.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3 text-gray-400" />}
        </Button>
      </div>

      {hasChildren && isExpanded && (
        <div>
          {item.children?.map((child) => (
            <SceneItemComponent
              key={child.id}
              item={child}
              level={level + 1}
              onSelect={onSelect}
              onToggle={onToggle}
              isSelected={child.id === isSelected}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function SceneHierarchySidebar({
  activeTab,
  onTabChange,
  sceneItems,
  onItemSelect,
  onItemToggle,
  selectedItemId,
}: SceneHierarchySidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredItems = (items: SceneItem[]) => {
    if (!searchQuery) return items
    return items.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">AI Playground</h2>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm text-gray-600">AI Generation Project</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={onTabChange} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 mx-4 mt-4">
          <TabsTrigger value="scene" className="text-xs">
            Scene
          </TabsTrigger>
          <TabsTrigger value="assets" className="text-xs">
            Assets
          </TabsTrigger>
          <TabsTrigger value="history" className="text-xs">
            History
          </TabsTrigger>
        </TabsList>

        {/* Search */}
        <div className="p-4 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-8 text-sm bg-gray-50 border-gray-200"
            />
          </div>
        </div>

        <TabsContent value="scene" className="flex-1 mt-0">
          <ScrollArea className="h-full px-4">
            <div className="space-y-1 pb-4">
              {filteredItems(sceneItems).map((item) => (
                <SceneItemComponent
                  key={item.id}
                  item={item}
                  onSelect={onItemSelect}
                  onToggle={onItemToggle}
                  isSelected={selectedItemId === item.id}
                />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="assets" className="flex-1 mt-0">
          <ScrollArea className="h-full px-4">
            <div className="space-y-3 pb-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <Folder className="w-4 h-4" />
                  Collections
                </h3>
                <div className="space-y-1 ml-6">
                  <div className="flex items-center gap-2 py-1 text-sm text-gray-700 hover:text-gray-900 cursor-pointer">
                    <Star className="w-3 h-3" />
                    Favorites (12)
                  </div>
                  <div className="flex items-center gap-2 py-1 text-sm text-gray-700 hover:text-gray-900 cursor-pointer">
                    <Clock className="w-3 h-3" />
                    Recent (8)
                  </div>
                  <div className="flex items-center gap-2 py-1 text-sm text-gray-700 hover:text-gray-900 cursor-pointer">
                    <ImageIcon className="w-3 h-3" />
                    Images (24)
                  </div>
                  <div className="flex items-center gap-2 py-1 text-sm text-gray-700 hover:text-gray-900 cursor-pointer">
                    <Video className="w-3 h-3" />
                    Videos (6)
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="history" className="flex-1 mt-0">
          <ScrollArea className="h-full px-4">
            <div className="space-y-1 pb-4">
              {filteredItems(MOCK_HISTORY_ITEMS).map((item) => (
                <SceneItemComponent
                  key={item.id}
                  item={item}
                  onSelect={onItemSelect}
                  onToggle={onItemToggle}
                  isSelected={selectedItemId === item.id}
                />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Add Button */}
      <div className="p-4 border-t border-gray-200">
        <Button variant="outline" size="sm" className="w-full justify-start">
          <Plus className="w-4 h-4 mr-2" />
          Add New Generation
        </Button>
      </div>
    </div>
  )
}
