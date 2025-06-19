"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Heart,
  Download,
  Share2,
  Copy,
  Play,
  User,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit,
  SlidersHorizontal,
} from "lucide-react"
import ImageEditor from "@/components/editors/image-editor"
import VideoEditor from "@/components/editors/video-editor"

// Mock data for demonstration
const mockContent = [
  {
    id: 1,
    type: "image",
    thumbnail: "/placeholder.svg?height=400&width=300&text=Cyberpunk+City",
    prompt: "A futuristic cyberpunk cityscape at night with neon lights reflecting on wet streets",
    user: { name: "Alex Chen", avatar: "/placeholder.svg?height=32&width=32&text=AC" },
    model: "FLUX 1.1 Pro",
    style: "Realistic",
    aspectRatio: "Portrait",
    likes: 234,
    views: 1200,
    createdAt: "2024-01-15",
    tags: ["cyberpunk", "city", "neon", "futuristic"],
    settings: { steps: 28, guidance: 7.5, seed: "12345" },
  },
  {
    id: 2,
    type: "video",
    thumbnail: "/placeholder.svg?height=300&width=400&text=Ocean+Waves",
    prompt: "Peaceful ocean waves crashing on a sandy beach during golden hour",
    user: { name: "Sarah Kim", avatar: "/placeholder.svg?height=32&width=32&text=SK" },
    model: "Runway Gen-3",
    style: "Realistic",
    aspectRatio: "Landscape",
    likes: 156,
    views: 890,
    createdAt: "2024-01-14",
    tags: ["ocean", "beach", "waves", "sunset"],
    settings: { duration: 5, fps: 24, resolution: "1920x1080" },
  },
  {
    id: 3,
    type: "image",
    thumbnail: "/placeholder.svg?height=300&width=300&text=Anime+Character",
    prompt: "Anime character with flowing hair in a magical forest setting",
    user: { name: "Anonymous", avatar: null },
    model: "Stable Diffusion XL",
    style: "Anime",
    aspectRatio: "Square",
    likes: 89,
    views: 456,
    createdAt: "2024-01-13",
    tags: ["anime", "character", "forest", "magic"],
    settings: { steps: 35, guidance: 8.0, seed: "67890" },
  },
  {
    id: 4,
    type: "image",
    thumbnail: "/placeholder.svg?height=500&width=300&text=Abstract+Art",
    prompt: "Abstract geometric patterns with vibrant colors and flowing shapes",
    user: { name: "Mike Johnson", avatar: "/placeholder.svg?height=32&width=32&text=MJ" },
    model: "DALL-E 3",
    style: "Abstract",
    aspectRatio: "Portrait",
    likes: 312,
    views: 1500,
    createdAt: "2024-01-12",
    tags: ["abstract", "geometric", "colorful", "patterns"],
    settings: { steps: 20, guidance: 6.0, seed: "54321" },
  },
  {
    id: 5,
    type: "video",
    thumbnail: "/placeholder.svg?height=400&width=300&text=Space+Journey",
    prompt: "Journey through space with stars and galaxies passing by",
    user: { name: "Emma Davis", avatar: "/placeholder.svg?height=32&width=32&text=ED" },
    model: "Pika Labs",
    style: "Realistic",
    aspectRatio: "Portrait",
    likes: 445,
    views: 2100,
    createdAt: "2024-01-11",
    tags: ["space", "stars", "galaxy", "journey"],
    settings: { duration: 8, fps: 30, resolution: "1080x1920" },
  },
  {
    id: 6,
    type: "image",
    thumbnail: "/placeholder.svg?height=300&width=400&text=Fantasy+Landscape",
    prompt: "Mystical fantasy landscape with floating islands and waterfalls",
    user: { name: "David Wilson", avatar: "/placeholder.svg?height=32&width=32&text=DW" },
    model: "Midjourney",
    style: "Fantasy",
    aspectRatio: "Landscape",
    likes: 178,
    views: 723,
    createdAt: "2024-01-10",
    tags: ["fantasy", "landscape", "islands", "waterfalls"],
    settings: { steps: 25, guidance: 7.0, seed: "98765" },
  },
]

const styles = ["All", "Realistic", "Anime", "3D", "Sketch", "Surreal", "Abstract", "Fantasy"]
const models = ["All", "FLUX 1.1 Pro", "Stable Diffusion XL", "DALL-E 3", "Runway Gen-3", "Pika Labs", "Midjourney"]
const aspectRatios = ["All", "Square", "Portrait", "Landscape"]

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [selectedContent, setSelectedContent] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    type: "all",
    style: "All",
    model: "All",
    aspectRatio: "All",
  })
  const [filteredContent, setFilteredContent] = useState(mockContent)
  const [showFilters, setShowFilters] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [editorType, setEditorType] = useState<"image" | "video" | null>(null)

  const itemsPerPage = 12

  // Filter and search logic
  useEffect(() => {
    const filtered = mockContent.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.user.name.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesType = filters.type === "all" || item.type === filters.type
      const matchesStyle = filters.style === "All" || item.style === filters.style
      const matchesModel = filters.model === "All" || item.model === filters.model
      const matchesAspectRatio = filters.aspectRatio === "All" || item.aspectRatio === filters.aspectRatio

      return matchesSearch && matchesType && matchesStyle && matchesModel && matchesAspectRatio
    })

    // Sort logic
    switch (sortBy) {
      case "recent":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "liked":
        filtered.sort((a, b) => b.likes - a.likes)
        break
      case "viewed":
        filtered.sort((a, b) => b.views - a.views)
        break
    }

    setFilteredContent(filtered)
    setCurrentPage(1)
  }, [searchQuery, sortBy, filters])

  const totalPages = Math.ceil(filteredContent.length / itemsPerPage)
  const currentItems = filteredContent.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleEdit = (item: any) => {
    setEditingItem(item)
    setEditorType(item.type)
  }

  const handleSaveEdit = (editedUrl: string, changes: any) => {
    console.log("Saved edited content:", { editedUrl, changes })
    setEditingItem(null)
    setEditorType(null)
  }

  return (
    <div className="h-full bg-white text-black overflow-hidden flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-black">Explore Gallery</h1>
              <p className="text-gray-600">Discover amazing AI-generated content from the community</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="border-gray-300 text-black hover:bg-gray-50"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 bg-white border-gray-300 text-black">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="liked">Most Liked</SelectItem>
                  <SelectItem value="viewed">Most Viewed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <Input
              placeholder="Search prompts, tags, users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-300 text-black placeholder:text-gray-500"
            />
          </div>

          {/* Top Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Content Type</label>
                  <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="image">Images</SelectItem>
                      <SelectItem value="video">Videos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Style</label>
                  <Select value={filters.style} onValueChange={(value) => setFilters({ ...filters, style: value })}>
                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {styles.map((style) => (
                        <SelectItem key={style} value={style}>
                          {style}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">AI Model</label>
                  <Select value={filters.model} onValueChange={(value) => setFilters({ ...filters, model: value })}>
                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {models.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Aspect Ratio</label>
                  <Select
                    value={filters.aspectRatio}
                    onValueChange={(value) => setFilters({ ...filters, aspectRatio: value })}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {aspectRatios.map((ratio) => (
                        <SelectItem key={ratio} value={ratio}>
                          {ratio}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Popular Tags</label>
                <div className="flex flex-wrap gap-2">
                  {["cyberpunk", "anime", "fantasy", "abstract", "realistic", "space", "nature"].map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="border-gray-400 text-gray-700 hover:bg-gray-100 hover:border-black cursor-pointer transition-colors"
                      onClick={() => setSearchQuery(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-gray-600">
              {filteredContent.length} {filteredContent.length === 1 ? "result" : "results"}
            </p>
          </div>
        </div>
      </header>

      {/* Gallery Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-8">
          {currentItems.map((item) => (
            <Card
              key={item.id}
              className="bg-white border-gray-200 overflow-hidden group cursor-pointer hover:border-black hover:shadow-lg transition-all duration-200"
              onClick={() => setSelectedContent(item)}
            >
              <div className="relative">
                <img
                  src={item.thumbnail || "/placeholder.svg"}
                  alt={item.prompt}
                  className="w-full h-48 object-cover"
                />
                {item.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Play className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-white/90 text-black border border-gray-200 shadow-sm">
                    {item.model}
                  </Badge>
                </div>
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/90 text-black border border-gray-200 hover:bg-white shadow-sm"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/90 text-black border border-gray-200 hover:bg-white shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/90 text-black border border-gray-200 hover:bg-white shadow-sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEdit(item)
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/90 text-black border border-gray-200 hover:bg-white shadow-sm"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <p className="text-sm text-gray-700 mb-3 line-clamp-2">{item.prompt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {item.user.avatar ? (
                      <img
                        src={item.user.avatar || "/placeholder.svg"}
                        alt={item.user.name}
                        className="w-6 h-6 rounded-full border border-gray-200"
                      />
                    ) : (
                      <User className="w-6 h-6 text-gray-500" />
                    )}
                    <span className="text-xs text-gray-600">{item.user.name}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Heart className="w-3 h-3 mr-1" />
                      {item.likes}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 pb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="border-gray-300 text-black hover:bg-gray-50 hover:border-black disabled:opacity-50"
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
              className="border-gray-300 text-black hover:bg-gray-50 hover:border-black disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Media Modal */}
      <Dialog open={!!selectedContent} onOpenChange={() => setSelectedContent(null)}>
        <DialogContent className="max-w-4xl bg-white border-gray-200 text-black shadow-xl">
          {selectedContent && (
            <>
              <DialogHeader>
                <DialogTitle className="text-left text-black">Generated {selectedContent.type}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="relative">
                  <img
                    src={selectedContent.thumbnail || "/placeholder.svg"}
                    alt={selectedContent.prompt}
                    className="w-full rounded-lg border border-gray-200"
                  />
                  {selectedContent.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                      <Button
                        size="lg"
                        variant="secondary"
                        className="bg-white/90 text-black border border-gray-200 hover:bg-white shadow-sm"
                      >
                        <Play className="w-6 h-6" />
                      </Button>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-black mb-2">Prompt</h3>
                    <p className="text-gray-700 text-sm">{selectedContent.prompt}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Model:</span>
                      <p className="text-black">{selectedContent.model}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Style:</span>
                      <p className="text-black">{selectedContent.style}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Aspect Ratio:</span>
                      <p className="text-black">{selectedContent.aspectRatio}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Created:</span>
                      <p className="text-black">{new Date(selectedContent.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-black mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedContent.tags.map((tag: string) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="border-gray-400 text-gray-700 hover:bg-gray-100 hover:border-black"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-2 pt-4">
                    <Button className="flex-1 bg-black text-white hover:bg-gray-800">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Prompt
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-gray-300 text-black hover:bg-gray-50 hover:border-black"
                      onClick={() => handleEdit(selectedContent)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      className="flex-1 border-gray-300 text-black hover:bg-gray-50 hover:border-black"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-gray-300 text-black hover:bg-gray-50 hover:border-black"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      className="border-gray-300 text-black hover:bg-gray-50 hover:border-black"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Editor Modal */}
      {editorType === "image" && editingItem && (
        <ImageEditor
          isOpen={true}
          onClose={() => {
            setEditingItem(null)
            setEditorType(null)
          }}
          imageUrl={editingItem.thumbnail}
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
          videoUrl={editingItem.thumbnail}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  )
}
