import React from 'react';
import { Truck, Users, Award, Bell, HeartHandshake } from 'lucide-react';
import { StatsData } from '../../types';

interface StatsBarProps {
  stats: StatsData;
}

export const StatsBar: React.FC<StatsBarProps> = ({ stats }) => {
  return (
    <section className="stats-bar-section" aria-label="Estadísticas institucionales">
      <div className="container">
        <div className="stats-grid">
          <div className="stat-card">
            <Truck size={36} className="stat-icon" />
            <div className="stat-number">{stats.companies}</div>
            <div className="stat-label">Compañías</div>
          </div>

          <div className="stat-card">
            <Users size={36} className="stat-icon" />
            <div className="stat-number">+{stats.firefighters}</div>
            <div className="stat-label">Bomberas y Bomberos</div>
          </div>

          <div className="stat-card">
            <Award size={36} className="stat-icon" />
            <div className="stat-number">{stats.yearsOfHistory}</div>
            <div className="stat-label">Años de Historia (1883)</div>
          </div>

          <div className="stat-card">
            <Bell size={36} className="stat-icon" />
            <div className="stat-number">+{stats.annualEmergencies}</div>
            <div className="stat-label">Emergencias al Año</div>
          </div>

          <div className="stat-card">
            <HeartHandshake size={36} className="stat-icon" />
            <div className="stat-number">{stats.volunteerPercentage}%</div>
            <div className="stat-label">Voluntariado Puro</div>
          </div>
        </div>
      </div>
    </section>
  );
};
