import { X, Users, BookOpen, MapPin } from 'lucide-react';
import { InstitutionData } from '../../types';
import { INITIAL_INSTITUTION } from '../../data/initialData';

interface InstitutionModalProps {
  onClose: () => void;
  data?: InstitutionData;
}

export const InstitutionModal: React.FC<InstitutionModalProps> = ({ onClose, data = INITIAL_INSTITUTION }) => {
  return (
    <div className="admin-modal-backdrop">
      <div 
        className="admin-modal-container" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '780px' }}
      >
        <div className="admin-modal-header" style={{ backgroundColor: 'var(--cbs-gray-dark)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: '#FFFFFF',
              borderRadius: '50%',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '38px',
              height: '38px',
              flexShrink: 0
            }}>
              <img 
                src="/escudo_cbsf_transparente.png" 
                alt="Escudo Oficial CBSF" 
                style={{ width: '32px', height: '32px', objectFit: 'contain' }} 
              />
            </div>
            <div>
              <h3 style={{ color: '#FFFFFF', margin: 0, fontSize: '1.15rem' }}>Institución y Directorio General</h3>
              <span style={{ fontSize: '0.75rem', color: '#B0BEC5' }}>Cuerpo de Bomberos de San Felipe · Fundado 1883</span>
            </div>
          </div>

          <button onClick={onClose} style={{ color: '#FFFFFF' }} aria-label="Cerrar modal">
            <X size={24} />
          </button>
        </div>

        <div className="admin-modal-body">
          {/* Autoridades Oficiales */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--cbs-red)', textTransform: 'uppercase', marginBottom: '1rem' }}>
              <Users size={18} />
              Mando Institucional y Operativo (Período Oficial)
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div style={{ background: '#F8F9FA', padding: '1.25rem', borderRadius: '8px', borderLeft: '4px solid var(--cbs-red)' }}>
                <span style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', fontWeight: 800 }}>Mando Administrativo</span>
                <h5 style={{ fontSize: '1.15rem', margin: '4px 0', color: '#111' }}>{data.superintendentName}</h5>
                <strong style={{ color: 'var(--cbs-red)', fontSize: '0.9rem' }}>{data.superintendentRole}</strong>
                <p style={{ fontSize: '0.82rem', color: '#666', margin: '6px 0 0 0' }}>
                  {data.superintendentBio}
                </p>
              </div>

              <div style={{ background: '#F8F9FA', padding: '1.25rem', borderRadius: '8px', borderLeft: '4px solid #111' }}>
                <span style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', fontWeight: 800 }}>Mando Activo Operativo</span>
                <h5 style={{ fontSize: '1.15rem', margin: '4px 0', color: '#111' }}>{data.commanderName}</h5>
                <strong style={{ color: '#111', fontSize: '0.9rem' }}>{data.commanderRole}</strong>
                <p style={{ fontSize: '0.82rem', color: '#666', margin: '6px 0 0 0' }}>
                  {data.commanderBio}
                </p>
              </div>
            </div>
          </div>

          {/* Reseña Histórica */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--cbs-red)', textTransform: 'uppercase', marginBottom: '1rem' }}>
              <BookOpen size={18} />
              Nuestra Historia (141+ Años de Servicio)
            </h4>
            
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center', flexShrink: 0, margin: '0 auto' }}>
                <img 
                  src="/escudo_cbsf_transparente.png" 
                  alt="Escudo Oficial CBSF" 
                  style={{ width: '110px', height: 'auto', display: 'block', margin: '0 auto 0.5rem auto' }} 
                />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--cbs-red)' }}>
                  Escudo Oficial CBSF
                </span>
              </div>
              <div style={{ flex: '1', minWidth: '260px' }}>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#333', marginTop: 0 }}>
                  {data.historyParagraph1}
                </p>
                {data.historyParagraph2 && (
                  <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#333' }}>
                    {data.historyParagraph2}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Cuartel General */}
          <div style={{ background: '#F8F9FA', padding: '1.25rem', borderRadius: '8px' }}>
            <h4 style={{ fontSize: '0.95rem', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={16} style={{ color: 'var(--cbs-red)' }} />
              Sede Cuartel General
            </h4>
            <p style={{ margin: '0 0 4px 0', fontSize: '0.9rem' }}>
              {data.headquartersAddress}
            </p>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#555' }}>
              Teléfono Central: {data.headquartersPhone} · Central de Alarmas: {data.headquartersEmergency}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
