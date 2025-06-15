
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface ImageCarouselProps {
  images: string[];
  alt: string;
  className?: string;
}

const ImageCarousel = ({ images, alt, className = "" }: ImageCarouselProps) => {
  console.log('ImageCarousel images:', images); // Debug log to see if all images are passed
  
  return (
    <Carousel className={`w-full ${className}`} opts={{ align: "start", loop: true }}>
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index} className="basis-full">
            <div className="relative">
              <img 
                src={image}
                alt={`${alt} - Image ${index + 1}`}
                className="rounded-lg shadow-lg w-full h-auto object-cover"
                onError={(e) => console.log('Image failed to load:', image)}
                onLoad={() => console.log('Image loaded:', image)}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  );
};

export default ImageCarousel;
