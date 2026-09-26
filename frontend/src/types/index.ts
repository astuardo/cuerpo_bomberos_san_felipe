export interface NewsItem {
  id: string;
  title: string;
  category: 'ACTUALIDAD' | 'EMERGENCIAS' | 'CAPACITACIÓN' | 'COMPAÑÍAS';
  date: string;
  author: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  featured: boolean;
  status: 'PUBLICADO' | 'BORRADOR';
}

export interface Company {
  id: string;
  number: number;
  name: string;
  shortName: string;
  foundingDate: string;
  motto: string;
  address: string;
  phone: string;
  specialty: string;
  description: string;
  units: string[];
  captain: string;
  director: string;
  color: string;
}

export interface EmergencyAlert {
  id: string;
  active: boolean;
  type: 'warning' | 'danger' | 'info';
  title: string;
  message: string;
  updatedAt: string;
}

export interface StatsData {
  companies: number;
  firefighters: number;
  yearsOfHistory: number;
  annualEmergencies: number;
  volunteerPercentage: number;
}

export interface AdminUser {
  username: string;
  name: string;
  role: string;
  token?: string;
}
