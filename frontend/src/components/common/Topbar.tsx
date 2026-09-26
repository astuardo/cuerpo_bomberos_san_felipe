import React from 'react';
import { Phone, Instagram, Facebook, HeartHandshake } from 'lucide-react';

interface TopbarProps {
  onOpenCooperar: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenCooperar, onNavigateSection }) => {
  return (
    <div className="topbar">
      <div className="container topbar-content">
        <div className="topbar-left">
          <div className="topbar-emergency-pill">
            <Phone size={14} />
            <span>EMERGENCIAS: 132</span>
          </div>
          <ul className="topbar-links">
            <li>
              <button 
                className="topbar-link"
                onClick={() => onNavigateSection('historia')}
              >
                Historia
              </button>
            </li>
            <li>
              <button 
                className="topbar-link"
                onClick={() => onNavigateSection('companias')}
              >
                7 Compañías
              </button>
            </li>
            <li>
              <button 
                className="topbar-link"
                onClick={() => onNavigateSection('cuarteles')}
              >
                Cuarteles
              </button>
            </li>
            <li>
              <button 
                className="topbar-link"
                onClick={() => onNavigateSection('noticias')}
              >
                Noticias
              </button>
            </li>
            <li>
              <a 
                href="https://www.bomberos.cl/cuerpo-de-bomberos-de-san-felipe" 
                target="_blank" 
                rel="noopener noreferrer"
                className="topbar-link"
              >
                Bomberos.cl
              </a>
            </li>
          </ul>
        </div>

        <div className="topbar-right">
          <div className="topbar-socials">
            <a
              href="https://www.instagram.com/bomberos_san_felipe/?hl=es"
              target="_blank"
              rel="noopener noreferrer"
              className="topbar-social-btn"
              title="Instagram Oficial @bomberos_san_felipe"
              aria-label="Instagram"
            >
              <Instagram size={17} />
            </a>
            <a
              href="https://www.facebook.com/p/Cuerpo-de-Bomberos-San-Felipe-100069827245670/?locale=es_LA"
              target="_blank"
              rel="noopener noreferrer"
              className="topbar-social-btn"
              title="Facebook Oficial Bomberos San Felipe"
              aria-label="Facebook"
            >
              <Facebook size={17} />
            </a>
          </div>

          <button 
            className="btn-cooperar" 
            onClick={onOpenCooperar}
            title="Aporta como socio colaborador al Cuerpo de Bomberos de San Felipe"
          >
            <HeartHandshake size={15} />
            <span>Quiero Cooperar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
