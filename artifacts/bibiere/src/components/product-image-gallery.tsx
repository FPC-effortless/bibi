
import { useState, useCallback, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ZoomIn, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductImage {
  id: string
  src: string
  alt: string
  priority?: boolean
}

interface ProductImageGalleryProps {
  images: ProductImage[]
  productName: string
  className?: string
}

export default function ProductImageGallery({ 
  images, 
  productName, 
  className 
}: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [imageLoaded, setImageLoaded] = useState<boolean[]>(new Array(images.length).fill(false))
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 })
  const mainImageRef = useRef<HTMLDivElement>(null)

  const handleImageLoad = useCallback((index: number) => {
    setImageLoaded(prev => {
      const newLoaded = [...prev]
      newLoaded[index] = true
      return newLoaded
    })
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || !mainImageRef.current) return
    
    const rect = mainImageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    setZoomPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) })
  }, [isZoomed])

  const navigateImage = useCallback((direction: 'prev' | 'next') => {
    setSelectedImage(prev => {
      if (direction === 'prev') {
        return prev === 0 ? images.length - 1 : prev - 1
      } else {
        return prev === images.length - 1 ? 0 : prev + 1
      }
    })
  }, [images.length])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isFullscreen) {
      if (e.key === 'Escape') {
        setIsFullscreen(false)
      } else if (e.key === 'ArrowLeft') {
        navigateImage('prev')
      } else if (e.key === 'ArrowRight') {
        navigateImage('next')
      }
    }
  }, [isFullscreen, navigateImage])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const currentImage = images[selectedImage]

  return (
    <>
      <div className={cn("space-y-6", className)}>
        {/* Main Image */}
        <div className="relative">
          <div 
            ref={mainImageRef}
            className="relative aspect-[4/5] bg-muted/30 rounded-2xl overflow-hidden group cursor-zoom-in"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
            onClick={() => setIsFullscreen(true)}
          >
            <img src={currentImage?.src || "/placeholder.svg?height=600&width=480"} alt={currentImage?.alt || productName} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
            
            {/* Loading State */}
            {!imageLoaded[selectedImage] && (
              <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted/80 to-muted animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </div>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Zoom Indicator */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <div className="bg-white/90 backdrop-blur-md rounded-full p-3 shadow-lg">
                <ZoomIn className="w-5 h-5 text-foreground" />
              </div>
            </div>

            {/* Fullscreen Button */}
            <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/90 backdrop-blur-md hover:bg-white shadow-lg"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsFullscreen(true)
                }}
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 backdrop-blur-md hover:bg-white shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigateImage('prev')
                  }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 backdrop-blur-md hover:bg-white shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigateImage('next')
                  }}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
              {selectedImage + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnail Images */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedImage(index)}
                className={cn(
                  "relative aspect-square bg-muted/30 rounded-xl overflow-hidden border-2 transition-all duration-300",
                  "hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-bibiere-burgundy focus:ring-offset-2",
                  selectedImage === index 
                    ? "border-bibiere-burgundy shadow-lg scale-105" 
                    : "border-transparent hover:border-border",
                )}
              >
                <img src={image.src || "/placeholder.svg"} alt={image.alt} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                
                {/* Loading State for Thumbnails */}
                {!imageLoaded[index] && (
                  <div className="absolute inset-0 bg-muted animate-pulse" />
                )}
                
                {/* Selected Indicator */}
                {selectedImage === index && (
                  <div className="absolute inset-0 bg-bibiere-burgundy/10 border-2 border-bibiere-burgundy rounded-xl" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center">
            <img src={currentImage?.src || "/placeholder.svg"} alt={currentImage?.alt || productName} className="max-w-full max-h-full object-contain" loading="lazy" />
            
            {/* Close Button */}
            <Button
              variant="secondary"
              className="absolute top-4 right-4 bg-white/90 hover:bg-white"
              onClick={() => setIsFullscreen(false)}
            >
              ✕
            </Button>

            {/* Navigation in Fullscreen */}
            {images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                  onClick={() => navigateImage('prev')}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                
                <Button
                  variant="secondary"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                  onClick={() => navigateImage('next')}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </>
            )}

            {/* Image Counter in Fullscreen */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 text-black px-4 py-2 rounded-full text-sm font-medium">
              {selectedImage + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
