import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: React.ReactNode;
  onLoad?: () => void;
  onError?: (error: Event) => void;
  threshold?: number;
  rootMargin?: string;
}

/**
 * Advanced lazy loading image component using Intersection Observer
 * Only loads images when they enter the viewport, improving performance
 * Supports custom placeholders and smooth fade-in transitions
 */
export function LazyImage({
  src,
  alt,
  className,
  placeholder,
  onLoad,
  onError,
  threshold = 0.1,
  rootMargin = '50px',
  ...props
}: LazyImageProps & React.ImgHTMLAttributes<HTMLImageElement>) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Set up Intersection Observer for lazy loading
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observerRef.current.observe(img);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [threshold, rootMargin]);

  /**
   * Handles successful image loading
   */
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  /**
   * Handles image loading errors
   */
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setHasError(true);
    onError?.(e.nativeEvent);
  };

  return (
    <div className={cn('relative', className)}>
      {/* Show placeholder while loading */}
      {!isLoaded && !hasError && placeholder && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800/20">
          {placeholder}
        </div>
      )}
      
      {/* Render image when in viewport */}
      {isInView && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={cn(
            'transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
            className
          )}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}
      
      {/* Placeholder div for Intersection Observer when not in view */}
      {!isInView && (
        <div
          ref={imgRef}
          className={cn('bg-gray-800/20', className)}
          style={{ aspectRatio: '16/9' }}
        />
      )}
    </div>
  );
} 