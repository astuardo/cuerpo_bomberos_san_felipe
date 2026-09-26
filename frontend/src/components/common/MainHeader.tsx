import React, { useState } from 'react';
import { ChevronDown, Lock, Menu, X, Shield, Users, Award, BookOpen, Flame } from 'lucide-react';
import { Company } from '../../types';

interface MainHeaderProps {
  companies: Company[];
  onSelectCompany: (company: Company) => void;
  onNavigateSection: (sectionId: string) => void;
  onOpenAdmin: () => void;
  onOpenInstitutionModal: () => void;
}

export const MainHeader: React.FC<MainHeaderProps> = ({
  companies,
  onSelectCompany,
  onNavigateSection,
  onOpenAdmin,
  onOpenInstitutionModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    onNavigateSection(sectionId);
    setMobileMenuOpen(false);
  };

  const handleCompanySelect = (comp: Company) => {
    onSelectCompany(comp);
    setMobileMenuOpen(false);
  };

  return (
    <header className="main-header">
      <div className="container header-content">
        {/* Logotipo y Título */}
        <div className="brand-wrap" onClick={() => handleNavClick('inicio')}>
          <img 
            src="/escudo_cbsf_transparente.png" 
            alt="Escudo Oficial Cuerpo de Bomberos San Felipe" 
            className="brand-logo-img" 
            width="55"
            height="55"
          />
          <div className="brand-text">
            <span className="brand-title">Cuerpo de Bomberos</span>
            <span className="brand-subtitle">SAN FELIPE · 1883</span>
          </div>
        </div>

        {/* Navegación Desktop */}
        <nav>
          <ul className="nav-desktop">
            <li className="nav-item">
              <button 
                className="nav-link"
                onClick={() => handleNavClick('inicio')}
              >
                Inicio
              </button>
            </li>

            <li className="nav-item">
              <button 
                className="nav-link"
                onClick={onOpenInstitutionModal}
              >
                Institución <ChevronDown size={14} />
              </button>
              <ul className="dropdown-menu">
                <li className="dropdown-item">
                  <button onClick={onOpenInstitutionModal}>
                    <span>Autoridades y Directorio</span>
                    <Users size={14} />
                  </button>
                </li>
                <li className="dropdown-item">
                  <button onClick={() => handleNavClick('historia')}>
                    <span>Historia (Fundado en 1883)</span>
                    <BookOpen size={14} />
                  </button>
                </li>
                <li className="dropdown-item">
                  <button onClick={onOpenInstitutionModal}>
                    <span>Misión y Mártires</span>
                    <Award size={14} />
                  </button>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <button 
                className="nav-link"
                onClick={() => handleNavClick('companias')}
              >
                7 Compañías <ChevronDown size={14} />
              </button>
              <ul className="dropdown-menu">
                {companies.map(comp => (
                  <li key={comp.id} className="dropdown-item">
                    <button onClick={() => handleCompanySelect(comp)}>
                      <span>{comp.shortName}</span>
                      <span 
                        style={{ 
                          width: '10px', 
                          height: '10px', 
                          borderRadius: '50%', 
                          backgroundColor: comp.color 
                        }} 
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </li>

            <li className="nav-item">
              <button 
                className="nav-link"
                onClick={() => handleNavClick('especialidades')}
              >
                Especialidades <ChevronDown size={14} />
              </button>
              <ul className="dropdown-menu">
                <li className="dropdown-item">
                  <button onClick={() => handleNavClick('especialidades')}>
                    <span>Rescate Subacuático (GERSA)</span>
                    <Shield size={14} />
                  </button>
                </li>
                <li className="dropdown-item">
                  <button onClick={() => handleNavClick('especialidades')}>
                    <span>Rescate Agreste y Montaña</span>
                    <Shield size={14} />
                  </button>
                </li>
                <li className="dropdown-item">
                  <button onClick={() => handleNavClick('especialidades')}>
                    <span>Incendios Forestales e Interfaz</span>
                    <Flame size={14} />
                  </button>
                </li>
                <li className="dropdown-item">
                  <button onClick={() => handleNavClick('especialidades')}>
                    <span>Rescate Vehicular en Rutas</span>
                    <Flame size={14} />
                  </button>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <button 
                className="nav-link"
                onClick={() => handleNavClick('noticias')}
              >
                Noticias
              </button>
            </li>

            <li className="nav-item">
              <button 
                className="nav-link"
                onClick={() => handleNavClick('cuarteles')}
              >
                Cuarteles
              </button>
            </li>
          </ul>
        </nav>

        {/* Acciones del Header */}
        <div className="header-actions">
          <button 
            className="admin-badge-btn" 
            onClick={onOpenAdmin}
            title="Panel de publicación para el encargado de prensa"
          >
            <Lock size={13} />
            <span>Acceso Encargado</span>
          </button>

          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Menú Móvil */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #ECECEC',
          padding: '1rem 1.5rem',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button 
              style={{ textAlign: 'left', padding: '0.6rem 0', fontWeight: 700 }}
              onClick={() => handleNavClick('inicio')}
            >
              INICIO
            </button>
            <button 
              style={{ textAlign: 'left', padding: '0.6rem 0', fontWeight: 700 }}
              onClick={onOpenInstitutionModal}
            >
              INSTITUCIÓN Y AUTORIDADES
            </button>
            <button 
              style={{ textAlign: 'left', padding: '0.6rem 0', fontWeight: 700 }}
              onClick={() => handleNavClick('companias')}
            >
              LAS 7 COMPAÑÍAS
            </button>
            <button 
              style={{ textAlign: 'left', padding: '0.6rem 0', fontWeight: 700 }}
              onClick={() => handleNavClick('especialidades')}
            >
              ESPECIALIDADES (GERSA / AGRESTE)
            </button>
            <button 
              style={{ textAlign: 'left', padding: '0.6rem 0', fontWeight: 700 }}
              onClick={() => handleNavClick('noticias')}
            >
              NOTICIAS
            </button>
            <button 
              style={{ textAlign: 'left', padding: '0.6rem 0', fontWeight: 700 }}
              onClick={() => handleNavClick('cuarteles')}
            >
              CUARTELES Y CONTACTO
            </button>
            <button 
              className="btn-primary"
              style={{ marginTop: '0.5rem', justifyContent: 'center' }}
              onClick={onOpenAdmin}
            >
              <Lock size={15} /> Panel Encargado de Prensa
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
