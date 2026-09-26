import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, PhoneCall, ShieldAlert } from 'lucide-react';

interface HeroSliderProps {
  onNavigateSection: (sectionId: string) => void;
  onOpenCooperar: () => void;
}

const SLIDES = [
  {
    id: 1,
    tag: 'DESDE EL 11 DE MARZO DE 1883',
    title: 'CONSTANCIA Y DISCIPLINA AL SERVICIO DEL VALLE DE ACONCAGUA',
    subtitle: 'Más de 141 años protegiendo vidas y bienes en San Felipe, Curimón, Panquehue y sectores rurales con vocación 100% voluntaria.',
    bgImage: 'https://images.unsplash.com/photo-1527525443983-6e60c75fff46?auto=format&fit=crop&w=1920&q=85',
    ctaPrimary: 'Conoce las 7 Compañías',
    action: 'companias'
  },
  {
    id: 2,
    tag: 'FUERZA OPERATIVA MULTIDISCIPLINARIA',
    title: 'ESPECIALISTAS EN RESCATE SUBACUÁTICO Y AGRESTE',
    subtitle: 'Dotados de grupos de rescate técnico: unidad GERSA en el río Aconcagua, brigada forestal GTO y rescate agreste de montaña.',
    bgImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=85',
    ctaPrimary: 'Nuestras Especialidades',
    action: 'especialidades'
  },
  {
    id: 3,
    tag: 'CENTRAL DE ALARMAS Y DESPACHO 132',
    title: 'HASTA DAR LA VIDA SI FUERE NECESARIO',
    subtitle: 'Guardianes las 24 horas del día ante incendios estructurales, rescates en autopista CH-60 e incidentes con materiales peligrosos.',
    bgImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1920&q=85',
    ctaPrimary: 'Últimas Noticias',
    action: 'noticias'
  }
];

export const HeroSlider: React.FC<HeroSliderProps> = ({ onNavigateSection, onOpenCooperar }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  return (
    <div className="hero-slider" id="inicio">
      {SLIDES.map((slide, index) => (
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
        {SLIDES.map((slide, index) => (
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
