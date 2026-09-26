import React from 'react';
import { X, MapPin, Phone, ShieldCheck, Calendar, Truck } from 'lucide-react';
import { Company } from '../../types';

interface CompanyModalProps {
  company: Company | null;
  onClose: () => void;
}

export const CompanyModal: React.FC<CompanyModalProps> = ({ company, onClose }) => {
  if (!company) return null;

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div 
        className="admin-modal-container" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '720px' }}
      >
        <div 
          className="admin-modal-header" 
          style={{ 
            backgroundColor: company.color, 
            borderBottom: '3px solid #111111' 
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{
              background: '#FFFFFF',
              color: company.color,
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '1.1rem'
            }}>
              {company.number}ª
            </span>
            <h3 style={{ color: '#FFFFFF', margin: 0, fontSize: '1.25rem' }}>
              {company.name}
            </h3>
          </div>

          <button 
            onClick={onClose} 
            style={{ color: '#FFFFFF', opacity: 0.9 }}
            aria-label="Cerrar modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="admin-modal-body">
          <p style={{ fontStyle: 'italic', fontSize: '1.05rem', color: company.color, fontWeight: 700, marginBottom: '1.25rem' }}>
            «{company.motto}»
          </p>

          <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: '#333333', marginBottom: '1.5rem' }}>
            {company.description}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem', background: '#F8F9FA', padding: '1.25rem', borderRadius: '8px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#666', marginBottom: '4px' }}>
                <Calendar size={14} />
                <span>Fecha de Fundación</span>
              </div>
              <strong style={{ fontSize: '0.95rem' }}>{company.foundingDate}</strong>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#666', marginBottom: '4px' }}>
                <ShieldCheck size={14} />
                <span>Especialidad</span>
              </div>
              <strong style={{ fontSize: '0.95rem' }}>{company.specialty}</strong>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#666', marginBottom: '4px' }}>
                <MapPin size={14} />
                <span>Cuartel</span>
              </div>
              <strong style={{ fontSize: '0.95rem' }}>{company.address}</strong>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#666', marginBottom: '4px' }}>
                <Phone size={14} />
                <span>Teléfono de Guardia</span>
              </div>
              <strong style={{ fontSize: '0.95rem' }}>{company.phone}</strong>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Truck size={18} style={{ color: company.color }} />
              Material Mayor / Unidades Asignadas
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {company.units.map((unit, idx) => (
                <div 
                  key={idx}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #D1D5DB',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    color: '#111'
                  }}
                >
                  {unit}
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid #ECECEC', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#666' }}>
            <span>Director de Compañía: <strong>{company.director}</strong></span>
            <span>Capitán de Compañía: <strong>{company.captain}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
