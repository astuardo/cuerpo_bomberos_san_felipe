import { X, Users, BookOpen, MapPin } from 'lucide-react';

interface InstitutionModalProps {
  onClose: () => void;
}

export const InstitutionModal: React.FC<InstitutionModalProps> = ({ onClose }) => {
  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
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
                <h5 style={{ fontSize: '1.15rem', margin: '4px 0', color: '#111' }}>David Nehemia Guajardo Sandoval</h5>
                <strong style={{ color: 'var(--cbs-red)', fontSize: '0.9rem' }}>Superintendente</strong>
                <p style={{ fontSize: '0.82rem', color: '#666', margin: '6px 0 0 0' }}>
                  Representante legal y máxima autoridad directiva del Cuerpo de Bomberos de San Felipe.
                </p>
              </div>

              <div style={{ background: '#F8F9FA', padding: '1.25rem', borderRadius: '8px', borderLeft: '4px solid #111' }}>
                <span style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', fontWeight: 800 }}>Mando Activo Operativo</span>
                <h5 style={{ fontSize: '1.15rem', margin: '4px 0', color: '#111' }}>Walter Román Staforelli Delgado</h5>
                <strong style={{ color: '#111', fontSize: '0.9rem' }}>Comandante</strong>
                <p style={{ fontSize: '0.82rem', color: '#666', margin: '6px 0 0 0' }}>
                  Jefe de las operaciones activas, despacho de unidades y disciplina de las 7 compañías.
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
                  El <strong>Cuerpo de Bomberos de San Felipe</strong> fue fundado el <strong>11 de marzo de 1883</strong> gracias al liderazgo del ciudadano y abogado don Moisés del Fierro y Arcaya, junto a vecinos progresistas que sintieron la imperiosa necesidad de dotar a la ciudad de una entidad organizada y voluntaria para proteger a las familias del Valle de Aconcagua.
                </p>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#333' }}>
                  A lo largo de las décadas, la institución se expandió desde su primera bomba hasta consolidar una fuerza de <strong>7 compañías</strong>, abarcando no solo la comuna de San Felipe, sino también Curimón, El Almendral y la vecina comuna de Panquehue, incorporando unidades especializadas en rescate subacuático (GERSA) y rescate agreste cordillerano.
                </p>
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
              Calle Merced N° 832, San Felipe, Región de Valparaíso, Chile.
            </p>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#555' }}>
              Teléfono Central: (34) 251 8817 · Central de Alarmas: 132
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
