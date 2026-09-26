import React from 'react';
import { Flame, Car, Waves, Mountain, Trees, ShieldAlert } from 'lucide-react';

const SPECIALTIES = [
  {
    id: 1,
    icon: Flame,
    title: 'Incendios',
    desc: 'Combate y extinción de incendios estructurales, comerciales e industriales en el radio urbano y rural.'
  },
  {
    id: 2,
    icon: Car,
    title: 'Rescate Vehicular',
    desc: 'Extricación con equipos hidráulicos pesados en choques sobre la Autopista CH-60 y vías del valle.'
  },
  {
    id: 3,
    icon: Waves,
    title: 'GERSA Subacuático',
    desc: 'Buzos tácticos certificados (6ª Cía) para rescate y rastreo en el río Aconcagua, canales y tranques.'
  },
  {
    id: 4,
    icon: Mountain,
    title: 'Rescate Agreste',
    desc: 'Técnicas de cuerdas, anclajes y camilla canasta (7ª Cía) en laderas escarpadas y senderos montañosos.'
  },
  {
    id: 5,
    icon: Trees,
    title: 'Incendios Forestales',
    desc: 'Grupo Técnico Operativo (4ª Cía) para defensa de interfaz y control de fuego en pastizales y cerros.'
  },
  {
    id: 6,
    icon: ShieldAlert,
    title: 'HazMat y Químicos',
    desc: 'Protocolos de contención y neutralización de sustancias peligrosas en faenas agroindustriales y transporte.'
  }
];

export const SpecialtiesSection: React.FC = () => {
  return (
    <section className="section-padding specialties-section" id="especialidades">
      <div className="container">
        <div className="cbs-blockquote-title">
          <h2>¿QUÉ HACEMOS? ESPECIALIDADES OPERATIVAS</h2>
          <p style={{ margin: 0, color: '#666', fontSize: '0.95rem' }}>
            Capacidades técnicas desplegadas en beneficio de la comunidad del Valle de Aconcagua
          </p>
        </div>

        <div className="specialties-grid">
          {SPECIALTIES.map((spec) => {
            const Icon = spec.icon;
            return (
              <div key={spec.id} className="specialty-card">
                <div className="specialty-icon-circle">
                  <Icon size={28} />
                </div>
                <h3 className="specialty-title">{spec.title}</h3>
                <p className="specialty-desc">{spec.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
