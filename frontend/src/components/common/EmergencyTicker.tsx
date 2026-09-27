import React from 'react';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import { EmergencyAlert } from '../../types';

interface EmergencyTickerProps {
  alert: EmergencyAlert | null;
  onOpenAlertModal: () => void;
}

export const EmergencyTicker: React.FC<EmergencyTickerProps> = ({ alert, onOpenAlertModal }) => {
  if (!alert || !alert.active) return null;

  return (
    <aside className="emergency-ticker" aria-label="Alerta de emergencia en vivo">
      <div className="ticker-wrapper">
        {/* Pista de marquesina continua con bucle infinito sin cortes */}
        <div className="ticker-marquee-track">
          <div className="ticker-item">
            <span className="ticker-badge">
              <AlertTriangle size={14} style={{ flexShrink: 0 }} />
              <span>{alert.title}</span>
            </span>
            <span className="ticker-text">{alert.message}</span>
          </div>

          <div className="ticker-item" aria-hidden="true">
            <span className="ticker-badge">
              <AlertTriangle size={14} style={{ flexShrink: 0 }} />
              <span>{alert.title}</span>
            </span>
            <span className="ticker-text">{alert.message}</span>
          </div>
        </div>

        {/* Botón flotante siempre visible para abrir modal */}
        <div className="ticker-action">
          <button 
            onClick={onOpenAlertModal}
            className="ticker-btn"
            aria-label="Ver detalles de la alerta"
            title="Ver detalles de la alerta"
          >
            <span>SABER MÁS</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
};
