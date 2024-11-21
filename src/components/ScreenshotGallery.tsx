import { Gallery, Item } from 'react-photoswipe-gallery';
import 'photoswipe/style.css';

interface ScreenshotGalleryProps {
  screenshots: string[];
}

export function ScreenshotGallery({ screenshots }: ScreenshotGalleryProps) {
  return (
    <div className="space-y-3 sm:space-y-4">
      <h3 className="text-sm font-medium text-foreground">Screenshots</h3>
      
      <Gallery>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
          {screenshots.map((url, index) => (
            <Item
              key={index}
              original={url}
              thumbnail={url}
              width={1280}
              height={720}
            >
              {({ ref, open }) => (
                <div
                  ref={ref}
                  onClick={open}
                  className="aspect-video rounded-lg overflow-hidden bg-muted cursor-pointer group relative"
                >
                  <img
                    src={url}
                    alt={`Screenshot ${index + 1}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs sm:text-sm font-medium px-2 text-center">
                      Tap to View
                    </span>
                  </div>
                </div>
              )}
            </Item>
          ))}
        </div>
      </Gallery>
    </div>
  );
}