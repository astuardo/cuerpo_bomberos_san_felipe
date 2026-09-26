import React, { useState } from 'react';
import { MapPin, Phone, Navigation } from 'lucide-react';
import { Company } from '../../types';

interface MapSectionProps {
  companies: Company[];
}

export const MapSection: React.FC<MapSectionProps> = ({ companies }) => {
  const [activeCuartel, setActiveCuartel] = useState<string>('general');

  // Coordenadas aproximadas de San Felipe Centro
  const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3345.9897931649363!2d-70.7288673!3d-32.7485741!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x968817a02798e983%3A0xe54e6fe842345e5!2sMerced%20832%2C%20San%20Felipe%2C%20Valpara%C3%ADso!5e0!3m2!1ses!2scl!4v1700000000000!5m2!1ses!2scl";

  return (
    <section className="section-padding map-section" id="cuarteles">
      <div className="container">
        <div className="cbs-blockquote-title">
          <h2>TU CUARTEL MÁS CERCANO</h2>
          <p style={{ margin: 0, color: '#666', fontSize: '0.95rem' }}>
            Despliegue operativo y cobertura territorial del Cuerpo de Bomberos de San Felipe
          </p>
        </div>

        <div className="map-container">
          {/* Iframe del Mapa */}
          <div className="map-frame-wrap">
            <iframe
              src={mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de Cuarteles Bomberos San Felipe"
            />
          </div>

          {/* Lista de Cuarteles */}
          <div className="map-companies-list">
            {/* Cuartel General */}
            <div
              className={`map-cuartel-item ${activeCuartel === 'general' ? 'active' : ''}`}
              onClick={() => setActiveCuartel('general')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 className="map-cuartel-title">CUARTEL GENERAL & COMANDANCIA</h4>
                <Navigation size={15} style={{ color: 'var(--cbs-red)' }} />
              </div>
              <p className="map-cuartel-address">
                <MapPin size={13} style={{ display: 'inline', marginRight: '4px' }} />
                Calle Merced N° 832, San Felipe
              </p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#B71C1C', fontWeight: 700 }}>
                <Phone size={12} style={{ display: 'inline', marginRight: '4px' }} />
                (34) 251 8817 · Emergencias 132
              </p>
            </div>

            {/* Las 7 Compañías */}
            {companies.map((comp) => (
              <div
                key={comp.id}
                className={`map-cuartel-item ${activeCuartel === comp.id ? 'active' : ''}`}
                onClick={() => setActiveCuartel(comp.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 className="map-cuartel-title">
                    <span 
                      style={{ 
                        display: 'inline-block', 
                        width: '8px', 
                        height: '8px', 
                        borderRadius: '50%', 
                        backgroundColor: comp.color, 
                        marginRight: '6px' 
                      }} 
                    />
                    {comp.shortName}
                  </h4>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: comp.color }}>
                    {comp.number}ª Cía.
                  </span>
                </div>
                <p className="map-cuartel-address">
                  <MapPin size={13} style={{ display: 'inline', marginRight: '4px' }} />
                  {comp.address}
                </p>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#555' }}>
                  <Phone size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  {comp.phone} · Especialidad: {comp.specialty}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
