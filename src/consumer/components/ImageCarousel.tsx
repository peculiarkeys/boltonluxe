import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageCarouselProps {
  images: string[];
  alt?: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, alt = "Property Image" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentIndex((curr) => (curr === 0 ? images.length - 1 : curr - 1));
  };

  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentIndex((curr) => (curr === images.length - 1 ? 0 : curr + 1));
  };

  if (!images || images.length === 0) {
    return <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">No Image</div>;
  }

  return (
    <div className="relative w-full h-full group overflow-hidden rounded-t-xl">
      <img
        src={images[currentIndex]}
        alt={`${alt} - ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-transform duration-500 ease-in-out"
      />
      
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50"
          >
            <ChevronRight size={14} />
          </button>
          
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageCarousel;
