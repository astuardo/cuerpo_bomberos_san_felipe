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
          <div className="ticker-badge">
            <AlertTriangle size={13} style={{ display: 'inline', marginRight: '4px' }} />
            {alert.title}
          </div>
          <p className="ticker-text">{alert.message}</p>
        </div>
        <button 
          onClick={onOpenAlertModal}
          style={{ 
            color: '#FFE600', 
            fontWeight: 800, 
            fontSize: '0.8rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '2px',
            whiteSpace: 'nowrap'
          }}
        >
          <span>SABER MÁS</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </aside>
  );
};
