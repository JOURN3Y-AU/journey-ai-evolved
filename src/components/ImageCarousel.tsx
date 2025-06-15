
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useEffect } from 'react';
import type { CarouselApi } from '@/components/ui/carousel';

interface ImageCarouselProps {
  images: string[];
  alt: string;
  className?: string;
}

const ImageCarousel = ({ images, alt, className = "" }: ImageCarouselProps) => {
  console.log('ImageCarousel images:', images); // Debug log to see if all images are passed
  
  return (
    <div className="relative">
      <Carousel 
        className={`w-full ${className}`} 
        opts={{ 
          align: "start", 
          loop: true,
          slidesToScroll: 1,
          startIndex: 0,
          skipSnaps: false
        }}
        setApi={(api: CarouselApi) => {
          if (api) {
            console.log('Embla API initialized:', api);
            console.log('Total slides:', api.slideNodes().length);
            console.log('Initial slide index:', api.selectedScrollSnap());
            console.log('Can scroll prev:', api.canScrollPrev());
            console.log('Can scroll next:', api.canScrollNext());
            console.log('Scroll snap list:', api.scrollSnapList());
            
            api.on('select', () => {
              console.log('=== SLIDE CHANGED ===');
              console.log('New slide index:', api.selectedScrollSnap());
              console.log('Previous slide index:', api.previousScrollSnap());
              console.log('Can scroll prev:', api.canScrollPrev());
              console.log('Can scroll next:', api.canScrollNext());
              console.log('Scroll progress:', api.scrollProgress());
            });
            
            api.on('pointerDown', () => {
              console.log('Pointer down event - slide:', api.selectedScrollSnap());
            });
            
            api.on('pointerUp', () => {
              console.log('Pointer up event - slide:', api.selectedScrollSnap());
            });
          }
        }}
      >
        <CarouselContent className="-ml-1">
          {images.map((image, index) => (
            <CarouselItem key={index} className="pl-1 basis-full">
              <div className="relative aspect-video w-full">
                <img 
                  src={image}
                  alt={`${alt} - Image ${index + 1}`}
                  className="rounded-lg shadow-xl w-full h-full object-cover"
                  onError={(e) => console.log('Image failed to load:', image)}
                  onLoad={() => console.log('Image loaded successfully:', image)}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious 
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10" 
          onClick={() => {
            console.log('Previous button clicked - current slide before action:', document.querySelector('[data-embla-index]')?.getAttribute('data-embla-index'));
          }}
        />
        <CarouselNext 
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10"
          onClick={() => {
            console.log('Next button clicked - current slide before action:', document.querySelector('[data-embla-index]')?.getAttribute('data-embla-index'));
          }}
        />
      </Carousel>
    </div>
  );
};

export default ImageCarousel;
