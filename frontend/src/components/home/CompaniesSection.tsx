import React from 'react';
import { MapPin, Phone, ShieldCheck, ExternalLink } from 'lucide-react';
import { Company } from '../../types';

interface CompaniesSectionProps {
  companies: Company[];
  onSelectCompany: (company: Company) => void;
}

export const CompaniesSection: React.FC<CompaniesSectionProps> = ({
  companies,
  onSelectCompany
}) => {
  return (
    <section className="section-padding" id="companias">
      <div className="container">
        <div className="cbs-blockquote-title">
          <h2>LAS 7 COMPAÑÍAS DEL CUERPO DE BOMBEROS</h2>
          <p style={{ margin: 0, color: '#666', fontSize: '0.95rem' }}>
            Unidades operativas distribuidas estratégicamente en San Felipe, Curimón, El Almendral y Panquehue
          </p>
        </div>

        <div className="companies-grid">
          {companies.map((comp) => (
            <div key={comp.id} className="company-card">
              {/* Franja de color distintivo de compañía */}
              <div 
                className="company-card-stripe" 
                style={{ backgroundColor: comp.color }} 
              />

              <div className="company-card-header">
                <div 
                  className="company-number-badge" 
                  style={{ backgroundColor: comp.color }}
                >
                  {comp.number}ª
                </div>
                <span className="company-founding">F. {comp.foundingDate}</span>
              </div>

              <h3 className="company-name">{comp.name}</h3>
              <p className="company-motto">«{comp.motto}»</p>

              <div className="company-meta-item">
                <MapPin size={16} style={{ color: comp.color, flexShrink: 0, marginTop: '2px' }} />
                <span>{comp.address}</span>
              </div>

              <div className="company-meta-item">
                <Phone size={15} style={{ color: comp.color, flexShrink: 0, marginTop: '2px' }} />
                <span>{comp.phone}</span>
              </div>

              <div className="company-meta-item">
                <ShieldCheck size={16} style={{ color: comp.color, flexShrink: 0, marginTop: '2px' }} />
                <strong>{comp.specialty}</strong>
              </div>

              {/* Unidades de Material Mayor */}
              <div className="company-units-chips">
                {comp.units.map((unit, idx) => (
                  <span key={idx} className="unit-chip">{unit}</span>
                ))}
              </div>

              <div style={{ marginTop: '1.25rem' }}>
                <button
                  className="btn-outline"
                  style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
                  onClick={() => onSelectCompany(comp)}
                >
                  <span>Ver Cuartel y Dotación</span>
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
