import { useState, useEffect, ReactNode } from 'react';

interface CarouselProps {
  items: ReactNode[];
  autoPlay?: boolean;
  interval?: number;
  className?: string;
}

const Carousel = ({
  items,
  autoPlay = true,
  interval = 5000,
  className = '',
}: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Autoplay
  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      nextSlide();
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, items.length]);

  return (
    <div
      className={`relative w-full max-w-4xl mx-auto group text-black ${className}`}
      aria-roledescription="carousel"
    >
      {/* Contenedor del carrusel: fondo blanco, bordes suaves */}
      <div className="relative h-80 md:h-96 overflow-hidden rounded-2xl bg-white shadow-sm">
        {items.map((item, index) => (
          <div
            key={index}
            aria-hidden={index !== currentIndex}
            className={`absolute top-0 left-0 w-full h-full transition-transform duration-500 ease-in-out transform ${
              index === currentIndex
                ? 'translate-x-0 opacity-100'
                : index < currentIndex
                ? '-translate-x-full opacity-0'
                : 'translate-x-full opacity-0'
            } flex items-center justify-center p-6`}
          >
            {/* Forzamos que el contenido se adapte y el texto sea negro por defecto */}
            <div className="w-full h-full flex items-center justify-center text-black">
              {item}
            </div>
          </div>
        ))}
      </div>

      {/* Botones de navegación (discretos, fondo blanco, íconos negros) */}
      <button
        onClick={prevSlide}
        aria-label="Anterior"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white border border-gray-200 text-black rounded-full p-2 shadow transition-transform duration-200 transform opacity-0 group-hover:opacity-100 hover:scale-105"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        aria-label="Siguiente"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white border border-gray-200 text-black rounded-full p-2 shadow transition-transform duration-200 transform opacity-0 group-hover:opacity-100 hover:scale-105"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicadores: minimalistas, negro cuando activo */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            aria-label={`Ir a la diapositiva ${index + 1}`}
            className={`w-3 h-3 rounded-full transition-all duration-200 focus:outline-none ${
              index === currentIndex
                ? 'bg-black scale-110'
                : 'bg-black/30 hover:bg-black/60'
            }`}
          />
        ))}
      </div>

      {/* Small keyboard support hint (visually hidden but accessible) */}
      <div className="sr-only" aria-hidden>
        Use left and right arrows to navigate.
      </div>
    </div>
  );
};

export default Carousel;
