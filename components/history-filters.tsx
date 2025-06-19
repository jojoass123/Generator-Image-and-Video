"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface FilterState {
  type: "all" | "image" | "video"
  search: string
  dateRange: string
  model: string
  style: string
  sortBy: string
}

interface HistoryFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  totalCount: number
  filteredCount: number
}

const MODELS = ["All Models", "DALL-E 3", "Stable Diffusion XL", "FLUX Pro", "Runway ML", "Pika Labs"]
const STYLES = ["All Styles", "Realistic", "Anime", "Cinematic", "Abstract", "3D Render", "Watercolor"]
const DATE_RANGES = ["All Time", "Today", "This Week", "This Month", "Last 3 Months"]
const SORT_OPTIONS = ["Newest First", "Oldest First", "Most Used Prompts", "By Model"]

export default function HistoryFilters({ filters, onFiltersChange, totalCount, filteredCount }: HistoryFiltersProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const updateFilter = (key: keyof FilterState, value: string) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onFiltersChange({
      type: "all",
      search: "",
      dateRange: "All Time",
      model: "All Models",
      style: "All Styles",
      sortBy: "Newest First",
    })
  }

  const hasActiveFilters =
    filters.type !== "all" ||
    filters.search !== "" ||
    filters.dateRange !== "All Time" ||
    filters.model !== "All Models" ||
    filters.style !== "All Styles"

  return (
    <div className="space-y-4">
      {/* Main Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Type Filter Pills */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            <Button
              variant={filters.type === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => updateFilter("type", "all")}
              className={cn("h-8 px-3 text-sm", filters.type === "all" ? "bg-white shadow-sm" : "hover:bg-white/50")}
            >
              All ({totalCount})
            </Button>
            <Button
              variant={filters.type === "image" ? "default" : "ghost"}
              size="sm"
              onClick={() => updateFilter("type", "image")}
              className={cn("h-8 px-3 text-sm", filters.type === "image" ? "bg-white shadow-sm" : "hover:bg-white/50")}
            >
              🖼️ Images
            </Button>
            <Button
              variant={filters.type === "video" ? "default" : "ghost"}
              size="sm"
              onClick={() => updateFilter("type", "video")}
              className={cn("h-8 px-3 text-sm", filters.type === "video" ? "bg-white shadow-sm" : "hover:bg-white/50")}
            >
              🎬 Videos
            </Button>
          </div>

          {/* Advanced Filters Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="h-8"
          >
            <Filter className="w-4 h-4 mr-1" />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 text-xs">
                !
              </Badge>
            )}
          </Button>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-gray-500">
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by prompt, style, or tag…"
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-10 bg-white border-gray-300 focus:border-gray-400"
          />
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Date Range</label>
            <Select value={filters.dateRange} onValueChange={(value) => updateFilter("dateRange", value)}>
              <SelectTrigger className="bg-white border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DATE_RANGES.map((range) => (
                  <SelectItem key={range} value={range}>
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Model</label>
            <Select value={filters.model} onValueChange={(value) => updateFilter("model", value)}>
              <SelectTrigger className="bg-white border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MODELS.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Style</label>
            <Select value={filters.style} onValueChange={(value) => updateFilter("style", value)}>
              <SelectTrigger className="bg-white border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STYLES.map((style) => (
                  <SelectItem key={style} value={style}>
                    {style}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Sort By</label>
            <Select value={filters.sortBy} onValueChange={(value) => updateFilter("sortBy", value)}>
              <SelectTrigger className="bg-white border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Showing {filteredCount} of {totalCount} generations
        </span>
        {hasActiveFilters && <span className="text-blue-600">Filters applied</span>}
      </div>
    </div>
  )
}
