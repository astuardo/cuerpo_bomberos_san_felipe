import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, PhoneCall, ShieldAlert } from 'lucide-react';
import { HeroSlide } from '../../types';
import { INITIAL_SLIDES } from '../../data/initialData';

interface HeroSliderProps {
  slides?: HeroSlide[];
  onNavigateSection: (sectionId: string) => void;
  onOpenCooperar: () => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ 
  slides = INITIAL_SLIDES,
  onNavigateSection, 
  onOpenCooperar 
}) => {
  const activeSlides = (slides && slides.length > 0) ? slides : INITIAL_SLIDES;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchDeltaX, setTouchDeltaX] = useState<number>(0);
  const [mouseDownX, setMouseDownX] = useState<number | null>(null);

  // Asegurar que currentSlide esté en rango si la cantidad de slides cambia
  useEffect(() => {
    if (currentSlide >= activeSlides.length) {
      setCurrentSlide(0);
    }
  }, [activeSlides.length, currentSlide]);

  // Auto-play que se reinicia al cambiar manualmente de diapositiva
  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [currentSlide, activeSlides.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? activeSlides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
  };

  // Soporte de gestos táctiles (Swipe en celulares y tablets)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
    setTouchDeltaX(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const diffX = e.touches[0].clientX - touchStart.x;
    const diffY = e.touches[0].clientY - touchStart.y;
    // Si el movimiento es vertical para hacer scroll en la página, no interferir
    if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffX) < 15) {
      return;
    }
    setTouchDeltaX(diffX);
  };

  const handleTouchEnd = () => {
    if (!touchStart) return;
    const minSwipeDistance = 45; // Distancia mínima en píxeles para reconocer swipe
    if (touchDeltaX > minSwipeDistance) {
      handlePrev(); // Deslizar a la derecha -> diapositiva anterior
    } else if (touchDeltaX < -minSwipeDistance) {
      handleNext(); // Deslizar a la izquierda -> siguiente diapositiva
    }
    setTouchStart(null);
    setTouchDeltaX(0);
  };

  // Soporte de arrastre con mouse para PC
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest('button, a')) return;
    setMouseDownX(e.clientX);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (mouseDownX === null) return;
    const diffX = e.clientX - mouseDownX;
    if (diffX > 50) {
      handlePrev();
    } else if (diffX < -50) {
      handleNext();
    }
    setMouseDownX(null);
  };

  return (
    <div 
      className="hero-slider" 
      id="inicio"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{ touchAction: 'pan-y' }}
    >
      {activeSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.bgImage})` }}
        >
          <div className="hero-overlay" />
          <div className="container" style={{ position: 'relative', zIndex: 2 }}>
            <div className="hero-caption">
              <span className="hero-tag">{slide.tag}</span>
              <h1 className="hero-title">{slide.title}</h1>
              <p className="hero-subtitle">{slide.subtitle}</p>
              <div className="hero-buttons">
                <button
                  className="btn-primary"
                  onClick={() => onNavigateSection(slide.action)}
                >
                  <ShieldAlert size={18} />
                  <span>{slide.ctaPrimary}</span>
                </button>
                <button
                  className="btn-cooperar"
                  onClick={onOpenCooperar}
                  style={{ padding: '0.85rem 1.6rem', fontSize: '0.95rem' }}
                >
                  <PhoneCall size={18} />
                  <span>Hazte Socio / Aportar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Flechas de navegación */}
      <button 
        className="hero-arrow prev" 
        onClick={handlePrev}
        aria-label="Diapositiva anterior"
      >
        <ChevronLeft size={28} />
      </button>
      <button 
        className="hero-arrow next" 
        onClick={handleNext}
        aria-label="Siguiente diapositiva"
      >
        <ChevronRight size={28} />
      </button>

      {/* Paginación con dots */}
      <div className="hero-dots">
        {activeSlides.map((slide, index) => (
          <button
            key={slide.id}
            className={`hero-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Ir a diapositiva ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
