import { useState, useEffect, useCallback, useRef } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut, RotateCw, Maximize, Minimize } from 'lucide-react';

interface ScreenshotGalleryProps {
  screenshots: string[];
}

export function ScreenshotGallery({ screenshots }: ScreenshotGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<{ [key: number]: boolean }>({});
  const [loadError, setLoadError] = useState<{ [key: number]: boolean }>({});
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [autoplayActive, setAutoplayActive] = useState(false);
  const autoplayTimeoutRef = useRef<number>();
  const dragStartRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const validScreenshots = screenshots.filter((_, index) => !loadError[index]);

  const handleImageLoad = (index: number) => {
    setIsLoading(prev => ({ ...prev, [index]: false }));
  };

  const handleImageError = (index: number) => {
    setLoadError(prev => ({ ...prev, [index]: true }));
    setIsLoading(prev => ({ ...prev, [index]: false }));
  };

  const resetImageState = () => {
    setRotation(0);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handlePrevious = useCallback(() => {
    if (selectedIndex === null) return;
    const newIndex = selectedIndex === 0 ? validScreenshots.length - 1 : selectedIndex - 1;
    setSelectedIndex(newIndex);
    resetImageState();
  }, [selectedIndex, validScreenshots.length]);

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return;
    const newIndex = selectedIndex === validScreenshots.length - 1 ? 0 : selectedIndex + 1;
    setSelectedIndex(newIndex);
    resetImageState();
  }, [selectedIndex, validScreenshots.length]);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleAutoplay = () => {
    setAutoplayActive(prev => !prev);
  };

  useEffect(() => {
    if (autoplayActive && selectedIndex !== null) {
      autoplayTimeoutRef.current = window.setTimeout(handleNext, 3000);
      return () => {
        if (autoplayTimeoutRef.current) {
          clearTimeout(autoplayTimeoutRef.current);
        }
      };
    }
  }, [autoplayActive, selectedIndex, handleNext]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (selectedIndex === null) return;

    switch (e.key) {
      case 'ArrowLeft':
        handlePrevious();
        break;
      case 'ArrowRight':
        handleNext();
        break;
      case 'Escape':
        if (isFullscreen) {
          document.exitFullscreen();
        } else {
          setSelectedIndex(null);
        }
        break;
      case 'r':
        setRotation(prev => (prev + 90) % 360);
        break;
      case '+':
        setZoom(prev => Math.min(prev + 0.25, 3));
        break;
      case '-':
        setZoom(prev => Math.max(prev - 0.25, 0.5));
        break;
      case 'f':
        toggleFullscreen();
        break;
      case ' ':
        toggleAutoplay();
        break;
    }
  }, [selectedIndex, handlePrevious, handleNext, isFullscreen]);

  useEffect(() => {
    if (selectedIndex !== null) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedIndex, handleKeyDown]);

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `screenshot-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  };

  useEffect(() => {
    let timeout: number;
    if (selectedIndex !== null) {
      timeout = window.setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [selectedIndex, position, zoom, rotation]);

  const handleMouseMove2 = useCallback(() => {
    setShowControls(true);
  }, []);

  if (validScreenshots.length === 0) return null;

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Screenshots</h3>
        <div className="text-xs text-muted-foreground">
          {validScreenshots.length} available
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
        {screenshots.map((url, index) => !loadError[index] && (
          <div
            key={index}
            onClick={() => {
              setSelectedIndex(index);
              resetImageState();
            }}
            className="relative aspect-video rounded-lg overflow-hidden bg-muted cursor-pointer group"
            onMouseEnter={() => {
              if (!isLoading[index]) return;
              setIsLoading(prev => ({ ...prev, [index]: true }));
            }}
          >
            {isLoading[index] && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <img
              src={url}
              alt={`Screenshot ${index + 1}`}
              className={`
                w-full h-full object-cover transition-all duration-300
                ${isLoading[index] ? 'opacity-0' : 'opacity-100'}
                group-hover:scale-105
              `}
              onLoad={() => handleImageLoad(index)}
              onError={() => handleImageError(index)}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="flex flex-col items-center space-y-2">
                <Maximize2 className="w-5 h-5 text-white" />
                <span className="text-white text-xs sm:text-sm font-medium px-2 text-center">
                  View Fullscreen
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedIndex !== null && (
        <div 
          ref={containerRef}
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedIndex(null);
              setAutoplayActive(false);
            }
          }}
          onMouseMove={handleMouseMove2}
        >
          {/* Top toolbar */}
          <div className={`
            absolute top-0 left-0 right-0 flex items-center justify-between p-4 
            bg-gradient-to-b from-black/50 to-transparent
            transition-opacity duration-300
            ${showControls ? 'opacity-100' : 'opacity-0'}
          `}>
            <div className="text-white/80 text-sm flex items-center space-x-4">
              <span>Screenshot {selectedIndex + 1} of {validScreenshots.length}</span>
              <div className="hidden sm:flex items-center space-x-2 text-xs">
                <span>Zoom: {Math.round(zoom * 100)}%</span>
                <span>Rotation: {rotation}°</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleDownload(validScreenshots[selectedIndex])}
                className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                title="Download"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={toggleAutoplay}
                className={`p-2 rounded-full transition-colors ${
                  autoplayActive 
                    ? 'text-primary bg-white/10' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                title={autoplayActive ? 'Stop Slideshow' : 'Start Slideshow'}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {autoplayActive ? (
                    <rect x="6" y="4" width="4" height="16" />
                  ) : (
                    <polygon points="5 3 19 12 5 21" />
                  )}
                </svg>
              </button>
              <button
                onClick={() => setRotation(prev => (prev + 90) % 360)}
                className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                title="Rotate (R)"
              >
                <RotateCw className="w-5 h-5" />
              </button>
              <button
                onClick={() => setZoom(prev => Math.max(prev - 0.25, 0.5))}
                className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                title="Zoom Out (-)"
                disabled={zoom <= 0.5}
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <button
                onClick={() => setZoom(prev => Math.min(prev + 0.25, 3))}
                className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                title="Zoom In (+)"
                disabled={zoom >= 3}
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                title="Toggle Fullscreen (F)"
              >
                {isFullscreen ? (
                  <Minimize className="w-5 h-5" />
                ) : (
                  <Maximize className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={() => {
                  setSelectedIndex(null);
                  setAutoplayActive(false);
                }}
                className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                title="Close (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className={`
            transition-opacity duration-300
            ${showControls ? 'opacity-100' : 'opacity-0'}
          `}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Image container */}
          <div 
            className="w-full h-full flex items-center justify-center overflow-hidden cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            <img
              src={validScreenshots[selectedIndex]}
              alt={`Screenshot ${selectedIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain transition-transform duration-200 select-none"
              style={{
                transform: `rotate(${rotation}deg) scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
                cursor: isDragging ? 'grabbing' : 'grab'
              }}
              draggable={false}
            />
          </div>

          {/* Bottom info */}
          <div className={`
            absolute bottom-4 left-0 right-0 flex justify-center
            transition-opacity duration-300
            ${showControls ? 'opacity-100' : 'opacity-0'}
          `}>
            <div className="bg-black/50 text-white/80 text-xs rounded-full px-4 py-2">
              <span className="hidden sm:inline">
                Arrow keys to navigate • R to rotate • +/- to zoom • Space for slideshow • F for fullscreen • ESC to close
              </span>
              <span className="sm:hidden">
                Tap edges to navigate • Pinch to zoom
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}