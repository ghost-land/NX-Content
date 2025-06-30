import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ImageWithFallbackProps {
  src: string;
  fallbackSrc?: string;
  fallbackSrcs?: string[];
  alt: string;
  className?: string;
  fallbackClassName?: string;
  onError?: (error: Event) => void;
  onLoad?: () => void;
  loading?: 'lazy' | 'eager';
}

/**
 * Image component with intelligent fallback handling
 * Prevents infinite loops by tracking fallback attempts
 * Supports multiple fallback sources and different styling for fallback state
 */
export function ImageWithFallback({
  src,
  fallbackSrc,
  fallbackSrcs = [],
  alt,
  className,
  fallbackClassName,
  onError,
  onLoad,
  loading = 'eager',
  ...props
}: ImageWithFallbackProps & React.ImgHTMLAttributes<HTMLImageElement>) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isFallback, setIsFallback] = useState(false);
  const [fallbackIndex, setFallbackIndex] = useState(-1);
  const imgRef = useRef<HTMLImageElement>(null);

  // Combine all fallback sources into a single array
  const allFallbacks = fallbackSrc ? [fallbackSrc, ...fallbackSrcs] : fallbackSrcs;

  /**
   * Handles image loading errors and attempts fallback sources
   */
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Stop if we've exhausted all fallbacks or already have an error
    if (fallbackIndex >= allFallbacks.length - 1) {
      setHasError(true);
      onError?.(e.nativeEvent);
      return;
    }

    // Try the next fallback source
    const nextIndex = fallbackIndex + 1;
    setFallbackIndex(nextIndex);
    setIsFallback(true);
    setCurrentSrc(allFallbacks[nextIndex]);
  };

  /**
   * Handles successful image loading
   */
  const handleLoad = () => {
    setHasError(false);
    onLoad?.();
  };

  // Reset state when source changes
  React.useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
    setIsFallback(false);
    setFallbackIndex(-1);
  }, [src]);

  return (
    <img
      ref={imgRef}
      src={currentSrc}
      alt={alt}
      loading={loading}
      className={cn(
        isFallback ? fallbackClassName : className
      )}
      onError={handleError}
      onLoad={handleLoad}
      {...props}
    />
  );
} 