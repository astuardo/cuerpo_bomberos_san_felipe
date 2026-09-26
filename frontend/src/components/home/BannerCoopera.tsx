import React from 'react';
import { HeartHandshake, PhoneCall } from 'lucide-react';

interface BannerCooperaProps {
  onOpenCooperar: () => void;
}

export const BannerCoopera: React.FC<BannerCooperaProps> = ({ onOpenCooperar }) => {
  return (
    <div className="container">
      <section className="banner-coopera" aria-label="Campaña de cooperación">
        <div className="container coopera-content">
          <div className="coopera-text">
            <h2>Hazte Socio de Bomberos San Felipe</h2>
            <p>
              Tu aporte voluntario mensual financia equipos de protección personal, combustible y mantención de nuestros carros bomba.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              className="btn-cooperar" 
              onClick={onOpenCooperar}
              style={{ padding: '1rem 2rem', fontSize: '1rem' }}
            >
              <HeartHandshake size={20} />
              <span>Quiero Cooperar Ahora</span>
            </button>
            <a 
              href="tel:132"
              className="btn-primary"
              style={{ backgroundColor: '#111111', borderColor: '#111111', padding: '1rem 1.6rem', fontSize: '1rem' }}
            >
              <PhoneCall size={18} />
              <span>Llamar al 132</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
