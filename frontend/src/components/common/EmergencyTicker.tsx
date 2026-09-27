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
      <div className="container ticker-inner">
        <div className="ticker-content">
          <span className="ticker-badge">
            <AlertTriangle size={13} style={{ flexShrink: 0 }} />
            <span>{alert.title}</span>
          </span>
          <span className="ticker-text">{alert.message}</span>
        </div>
        <button 
          onClick={onOpenAlertModal}
          className="ticker-btn"
          aria-label="Ver detalles de la alerta"
        >
          <span>SABER MÁS</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </aside>
  );
};
