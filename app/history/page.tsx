"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Calendar, Download, Heart, Edit, Trash2, Grid3X3, List, ChevronLeft, ChevronRight } from "lucide-react"
import ImageEditor from "@/components/editors/image-editor"
import VideoEditor from "@/components/editors/video-editor"

// Mock history data
const mockHistory = [
  {
    id: 1,
    type: "image",
    url: "/placeholder.svg?height=300&width=300&text=My+Creation+1",
    prompt: "A beautiful sunset over mountains with vibrant colors",
    model: "FLUX 1.1 Pro",
    style: "Realistic",
    createdAt: new Date("2024-01-15"),
    isFavorite: true,
  },
  {
    id: 2,
    type: "video",
    url: "/placeholder.svg?height=300&width=400&text=My+Video+1",
    prompt: "Animated clouds moving across a blue sky",
    model: "Runway Gen-3",
    style: "Realistic",
    createdAt: new Date("2024-01-14"),
    isFavorite: false,
  },
  {
    id: 3,
    type: "image",
    url: "/placeholder.svg?height=400&width=300&text=My+Creation+2",
    prompt: "Abstract art with flowing geometric patterns",
    model: "Stable Diffusion XL",
    style: "Abstract",
    createdAt: new Date("2024-01-13"),
    isFavorite: false,
  },
]

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [filterBy, setFilterBy] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [editorType, setEditorType] = useState<"image" | "video" | null>(null)

  const itemsPerPage = 12

  const filteredHistory = mockHistory.filter((item) => {
    const matchesSearch = searchQuery === "" || item.prompt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterBy === "all" || item.type === filterBy
    return matchesSearch && matchesFilter
  })

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage)
  const currentItems = filteredHistory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleEdit = (item: any) => {
    setEditingItem(item)
    setEditorType(item.type)
  }

  const handleSaveEdit = (editedUrl: string, changes: any) => {
    console.log("Saved edited content:", { editedUrl, changes })
    setEditingItem(null)
    setEditorType(null)
  }

  const handleDelete = (id: number) => {
    console.log("Delete item:", id)
  }

  const toggleFavorite = (id: number) => {
    console.log("Toggle favorite:", id)
  }

  return (
    <div className="h-full bg-white text-black overflow-hidden flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-black">My History</h1>
              <p className="text-gray-600">View and manage your generated content</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-32 bg-white border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 bg-white border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="favorites">Favorites</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <Input
              placeholder="Search your creations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-300 text-black placeholder:text-gray-500"
            />
          </div>

          {/* Results Count */}
          <div className="mt-4">
            <p className="text-gray-600">
              {filteredHistory.length} {filteredHistory.length === 1 ? "item" : "items"}
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-8">
            {currentItems.map((item) => (
              <Card
                key={item.id}
                className="bg-white border-gray-200 overflow-hidden group hover:shadow-lg transition-all"
              >
                <div className="relative">
                  <img src={item.url || "/placeholder.svg"} alt={item.prompt} className="w-full h-48 object-cover" />
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="bg-white/90 text-gray-700 text-xs">
                      {item.type === "image" ? "🖼️" : "🎬"}
                    </Badge>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                      onClick={() => toggleFavorite(item.id)}
                    >
                      <Heart className={`w-4 h-4 ${item.isFavorite ? "text-red-500 fill-current" : "text-gray-500"}`} />
                    </Button>
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/90 text-gray-900"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="secondary" className="bg-white/90 text-gray-900">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/90 text-red-600"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-700 mb-2 line-clamp-2">{item.prompt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{item.model}</span>
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {item.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            {currentItems.map((item) => (
              <Card key={item.id} className="bg-white border-gray-200 hover:shadow-lg transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.url || "/placeholder.svg"}
                      alt={item.prompt}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">{item.prompt}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{item.model}</span>
                        <span>{item.style}</span>
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {item.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(item.id)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <Heart className={`w-4 h-4 ${item.isFavorite ? "text-red-500 fill-current" : ""}`} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 pb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Image Editor Modal */}
      {editorType === "image" && editingItem && (
        <ImageEditor
          isOpen={true}
          onClose={() => {
            setEditingItem(null)
            setEditorType(null)
          }}
          imageUrl={editingItem.url}
          originalPrompt={editingItem.prompt}
          onSave={handleSaveEdit}
        />
      )}

      {/* Video Editor Modal */}
      {editorType === "video" && editingItem && (
        <VideoEditor
          isOpen={true}
          onClose={() => {
            setEditingItem(null)
            setEditorType(null)
          }}
          videoUrl={editingItem.url}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  )
}
