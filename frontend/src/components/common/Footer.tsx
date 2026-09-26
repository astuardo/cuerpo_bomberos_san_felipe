import React from 'react';
import { MapPin, Phone, Mail, Instagram, Facebook, HeartHandshake } from 'lucide-react';
import { Company } from '../../types';

interface FooterProps {
  companies: Company[];
  onSelectCompany: (company: Company) => void;
  onOpenCooperar: () => void;
}

export const Footer: React.FC<FooterProps> = ({ companies, onSelectCompany, onOpenCooperar }) => {
  return (
    <footer className="cbs-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Columna 1: Identidad Institucional */}
          <div>
            <div className="footer-brand">
              <img 
                src="/logo-bomberos.svg" 
                alt="Escudo Bomberos San Felipe" 
                width="48"
                height="48"
                style={{ width: '48px', height: '48px', filter: 'brightness(0) invert(1)' }} 
              />
              <div>
                <h3 style={{ color: '#FFFFFF', fontSize: '1.15rem', margin: 0, textTransform: 'uppercase' }}>
                  Cuerpo de Bomberos
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#FFE600', fontWeight: 700, letterSpacing: '0.5px' }}>
                  SAN FELIPE · VALLE DE ACONCAGUA
                </span>
              </div>
            </div>

            <p className="footer-desc">
              Institución voluntaria fundada el 11 de marzo de 1883. Integrada por 7 compañías altamente especializadas en incendios, rescate vehicular, operaciones subacuáticas GERSA y rescate agreste.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <a
                href="https://www.instagram.com/bomberos_san_felipe/?hl=es"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Instagram Oficial"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://www.facebook.com/p/Cuerpo-de-Bomberos-San-Felipe-100069827245670/?locale=es_LA"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Facebook Oficial"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Columna 2: Cuartel General y Contacto */}
          <div>
            <h4 className="footer-col-title">CUARTEL GENERAL</h4>
            <div className="footer-contact-item">
              <MapPin size={17} style={{ color: '#FFE600', flexShrink: 0 }} />
              <span>Calle Merced N° 832, San Felipe, Región de Valparaíso</span>
            </div>
            <div className="footer-contact-item">
              <Phone size={17} style={{ color: '#FFE600', flexShrink: 0 }} />
              <span>Teléfono Central: (34) 251 8817</span>
            </div>
            <div className="footer-contact-item">
              <Phone size={17} style={{ color: '#FFE600', flexShrink: 0 }} />
              <strong style={{ color: '#FFE600' }}>Central de Emergencias: 132</strong>
            </div>
            <div className="footer-contact-item">
              <Mail size={17} style={{ color: '#FFE600', flexShrink: 0 }} />
              <span>contacto@bomberossanfelipe.cl</span>
            </div>

            <div style={{ marginTop: '1.25rem' }}>
              <button 
                className="btn-cooperar" 
                onClick={onOpenCooperar}
                style={{ backgroundColor: '#111111' }}
              >
                <HeartHandshake size={16} />
                <span>Hazte Socio Colaborador</span>
              </button>
            </div>
          </div>

          {/* Columna 3: Las 7 Compañías de San Felipe */}
          <div>
            <h4 className="footer-col-title">LAS 7 COMPAÑÍAS</h4>
            <ul className="footer-links-list">
              {companies.map((comp) => (
                <li key={comp.id}>
                  <button 
                    onClick={() => onSelectCompany(comp)}
                    style={{ color: '#FFFFFF', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.86rem' }}
                  >
                    • {comp.shortName}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-base">
        <div className="container footer-base-inner">
          <p style={{ margin: 0 }}>
            © 2026 Cuerpo de Bomberos de San Felipe - Valle de Aconcagua. Todos los derechos reservados.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="https://www.bomberos.cl" target="_blank" rel="noopener noreferrer" style={{ color: '#FEE2E2' }}>
              Bomberos de Chile
            </a>
            <span style={{ opacity: 0.7 }}>Emergencias: 132</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
