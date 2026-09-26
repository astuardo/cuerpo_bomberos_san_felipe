import React, { useState } from 'react';
import { X, HeartHandshake, CheckCircle2, ShieldCheck } from 'lucide-react';

interface CooperarModalProps {
  onClose: () => void;
}

export const CooperarModal: React.FC<CooperarModalProps> = ({ onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    rut: '',
    email: '',
    phone: '',
    amount: '5000',
    companyTarget: 'todas'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div 
        className="admin-modal-container" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '600px' }}
      >
        <div className="admin-modal-header" style={{ backgroundColor: '#111111', borderBottom: '3px solid var(--cbs-red)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <HeartHandshake size={22} style={{ color: 'var(--cbs-red)' }} />
            <h3 style={{ color: '#FFFFFF', margin: 0 }}>Campaña Hazte Socio Colaborador</h3>
          </div>

          <button onClick={onClose} style={{ color: '#FFFFFF' }} aria-label="Cerrar modal">
            <X size={24} />
          </button>
        </div>

        <div className="admin-modal-body">
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <CheckCircle2 size={56} style={{ color: '#2E7D32', margin: '0 auto 1rem auto' }} />
              <h3 style={{ marginBottom: '0.5rem' }}>¡Muchas gracias por su compromiso!</h3>
              <p style={{ color: '#555', lineHeight: 1.6, maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
                Hemos recibido su intención de aporte para el <strong>Cuerpo de Bomberos de San Felipe</strong>. Un encargado de nuestra Tesorería General se contactará con usted para formalizar su mandato voluntario.
              </p>
              <button className="btn-primary" onClick={onClose}>
                Entendido y Cerrar
              </button>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: '0.95rem', color: '#444', marginBottom: '1.25rem' }}>
                El 100% de los bomberos de San Felipe son voluntarios. Su aporte mensual nos permite adquirir uniformes normados contra el fuego, combustible para los carros de las 7 compañías y equipamiento de rescate médico.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="admin-form-group">
                  <label className="admin-label">Nombre Completo</label>
                  <input 
                    type="text" 
                    required 
                    className="admin-input" 
                    placeholder="Ej. Juan Pérez González"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="admin-form-group">
                    <label className="admin-label">RUT</label>
                    <input 
                      type="text" 
                      required 
                      className="admin-input" 
                      placeholder="12.345.678-9"
                      value={formData.rut}
                      onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Teléfono Móvil</label>
                    <input 
                      type="tel" 
                      required 
                      className="admin-input" 
                      placeholder="+56 9 1234 5678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Correo Electrónico</label>
                  <input 
                    type="email" 
                    required 
                    className="admin-input" 
                    placeholder="nombre@correo.cl"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Aporte Mensual Voluntario</label>
                    <select 
                      className="admin-select"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    >
                      <option value="3000">$3.000 mensuales</option>
                      <option value="5000">$5.000 mensuales</option>
                      <option value="10000">$10.000 mensuales</option>
                      <option value="20000">$20.000 mensuales</option>
                      <option value="otro">Otro monto</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Destino del Aporte</label>
                    <select 
                      className="admin-select"
                      value={formData.companyTarget}
                      onChange={(e) => setFormData({ ...formData, companyTarget: e.target.value })}
                    >
                      <option value="todas">Cuerpo General (Las 7 Compañías)</option>
                      <option value="1">1ª Cía. Bomba Aconcagua</option>
                      <option value="2">2ª Cía. La Internacional</option>
                      <option value="3">3ª Cía. San Felipe</option>
                      <option value="4">4ª Cía. Bomba Almendral</option>
                      <option value="5">5ª Cía. Bomba Curimón</option>
                      <option value="6">6ª Cía. Bomba Panquehue (GERSA)</option>
                      <option value="7">7ª Cía. Rescate Agreste</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                  <button type="button" className="btn-outline" onClick={onClose}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary" style={{ backgroundColor: '#111111', borderColor: '#111111' }}>
                    <ShieldCheck size={18} />
                    <span>Inscribir Aporte Voluntario</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
