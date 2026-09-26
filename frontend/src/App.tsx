import React, { useState, useEffect } from 'react';
import { PhoneCall } from 'lucide-react';
import { Topbar } from './components/common/Topbar';
import { MainHeader } from './components/common/MainHeader';
import { EmergencyTicker } from './components/common/EmergencyTicker';
import { HeroSlider } from './components/home/HeroSlider';
import { StatsBar } from './components/home/StatsBar';
import { NewsSection } from './components/home/NewsSection';
import { SpecialtiesSection } from './components/home/SpecialtiesSection';
import { CompaniesSection } from './components/home/CompaniesSection';
import { BannerCoopera } from './components/home/BannerCoopera';
import { MapSection } from './components/home/MapSection';
import { HistoricalQuote } from './components/home/HistoricalQuote';
import { Footer } from './components/common/Footer';

// Modales
import { CompanyModal } from './components/companies/CompanyModal';
import { NewsDetailModal } from './components/common/NewsDetailModal';
import { InstitutionModal } from './components/common/InstitutionModal';
import { CooperarModal } from './components/common/CooperarModal';
import { AdminDashboard } from './components/admin/AdminDashboard';

// Datos de respaldo
import { 
  INITIAL_COMPANIES, 
  INITIAL_NEWS, 
  INITIAL_STATS, 
  INITIAL_ALERT 
} from './data/initialData';
import { Company, NewsItem, EmergencyAlert, StatsData, AdminUser } from './types';

export const App: React.FC = () => {
  // Datos principales con persistencia en localStorage para Vercel
  const [companies, setCompanies] = useState<Company[]>(() => {
    const saved = localStorage.getItem('cbsf_companies');
    return saved ? JSON.parse(saved) : INITIAL_COMPANIES;
  });

  const [news, setNews] = useState<NewsItem[]>(() => {
    const saved = localStorage.getItem('cbsf_news');
    return saved ? JSON.parse(saved) : INITIAL_NEWS;
  });

  const [alert, setAlert] = useState<EmergencyAlert | null>(() => {
    const saved = localStorage.getItem('cbsf_alert');
    return saved ? JSON.parse(saved) : INITIAL_ALERT;
  });

  const [stats, setStats] = useState<StatsData>(INITIAL_STATS);

  // Estados de Modales
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [institutionOpen, setInstitutionOpen] = useState(false);
  const [cooperarOpen, setCooperarOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  // Estado del Administrador / Encargado de Prensa
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  // Fetch de datos desde el backend al cargar
  useEffect(() => {
    // Cargar noticias
    fetch('/api/news')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          setNews(data);
        }
      })
      .catch((err) => console.log('Usando noticias locales:', err));

    // Cargar compañías
    fetch('/api/companies')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          setCompanies(data);
        }
      })
      .catch((err) => console.log('Usando compañías locales:', err));

    // Cargar alerta
    fetch('/api/alerts')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          setAlert(data[0]);
        }
      })
      .catch((err) => console.log('Usando alerta local:', err));

    // Cargar estadísticas
    fetch('/api/stats')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.companies) {
          setStats(data);
        }
      })
      .catch((err) => console.log('Usando stats locales:', err));
  }, []);

  // Navegación entre secciones
  const handleNavigateSection = (sectionId: string) => {
    if (sectionId === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Guardar noticia (Crear o Editar)
  const handleSaveNews = async (newsData: Partial<NewsItem>) => {
    const isEdit = !!newsData.id;
    let updatedList: NewsItem[];

    if (isEdit) {
      updatedList = news.map((n) => (n.id === newsData.id ? { ...n, ...newsData } as NewsItem : n));
    } else {
      const newItem: NewsItem = {
        id: 'noticia-' + Date.now(),
        title: newsData.title || 'Nueva Noticia',
        category: newsData.category || 'ACTUALIDAD',
        date: new Date().toISOString().split('T')[0],
        author: newsData.author || 'Prensa CBSF',
        excerpt: newsData.excerpt || '',
        content: newsData.content || '',
        imageUrl: newsData.imageUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1200&q=80',
        featured: newsData.featured || false,
        status: newsData.status || 'PUBLICADO'
      };
      updatedList = [newItem, ...news];
    }

    setNews(updatedList);
    localStorage.setItem('cbsf_news', JSON.stringify(updatedList));

    // Intentar también en backend si está disponible
    try {
      const url = isEdit ? `/api/news/${newsData.id}` : '/api/news';
      const method = isEdit ? 'PUT' : 'POST';
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newsData)
      });
    } catch {
      // Modo offline/Vercel silencioso
    }
  };

  // Eliminar noticia
  const handleDeleteNews = async (id: string) => {
    const filtered = news.filter((n) => n.id !== id);
    setNews(filtered);
    localStorage.setItem('cbsf_news', JSON.stringify(filtered));

    try {
      await fetch(`/api/news/${id}`, { method: 'DELETE' });
    } catch {
      // Modo offline/Vercel silencioso
    }
  };

  // Actualizar alerta en vivo
  const handleUpdateAlert = async (alertData: Partial<EmergencyAlert>) => {
    const updated: EmergencyAlert = {
      id: alert?.id || 'alert-1',
      active: alertData.active ?? true,
      title: alertData.title || 'ALERTA DE EMERGENCIA',
      message: alertData.message || '',
      type: alertData.type || 'warning',
      updatedAt: new Date().toISOString()
    };

    setAlert(updated);
    localStorage.setItem('cbsf_alert', JSON.stringify(updated));

    try {
      await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertData)
      });
    } catch {
      // Modo offline/Vercel silencioso
    }
  };

  return (
    <div className="site-wrapper">
      {/* 1. Topbar Superior Oficial */}
      <Topbar 
        onOpenCooperar={() => setCooperarOpen(true)}
        onNavigateSection={handleNavigateSection}
      />

      {/* 2. Header Principal con Logo y Menú */}
      <MainHeader 
        companies={companies}
        onSelectCompany={(comp) => setSelectedCompany(comp)}
        onNavigateSection={handleNavigateSection}
        onOpenAdmin={() => setAdminOpen(true)}
        onOpenInstitutionModal={() => setInstitutionOpen(true)}
      />

      {/* 3. Ticker de Alerta Activa en Vivo */}
      <EmergencyTicker 
        alert={alert}
        onOpenAlertModal={() => {
          if (alert) {
            window.alert(`${alert.title}\n\n${alert.message}`);
          }
        }}
      />

      {/* 4. Hero Slider Panorámico */}
      <HeroSlider 
        onNavigateSection={handleNavigateSection}
        onOpenCooperar={() => setCooperarOpen(true)}
      />

      {/* 5. Barra de Estadísticas Institucionales */}
      <StatsBar stats={stats} />

      {/* 6. Bloque de Noticias y Actualidad (Estilo CBS) */}
      <NewsSection 
        news={news}
        onSelectNews={(item) => setSelectedNews(item)}
        onOpenCreateNews={() => setAdminOpen(true)}
        isAdmin={!!currentUser}
      />

      {/* 7. Banner "Hazte Socio / Cooperar" */}
      <BannerCoopera 
        onOpenCooperar={() => setCooperarOpen(true)}
      />

      {/* 8. Especialidades Operativas "¿Qué Hacemos?" */}
      <SpecialtiesSection />

      {/* 9. Módulo de las 7 Compañías */}
      <CompaniesSection 
        companies={companies}
        onSelectCompany={(comp) => setSelectedCompany(comp)}
      />

      {/* 10. Mapa Interactivo "Tu Cuartel Más Cercano" */}
      <MapSection companies={companies} />

      {/* 11. Cita Histórica de Fundación (1883) */}
      <HistoricalQuote />

      {/* 12. Footer Corporativo Rojo Oficial */}
      <Footer 
        companies={companies}
        onSelectCompany={(comp) => setSelectedCompany(comp)}
        onOpenCooperar={() => setCooperarOpen(true)}
      />

      {/* 13. Botón Flotante Móvil de Emergencia (132) */}
      <a href="tel:132" className="mobile-fab-emergency" title="Llamar a Emergencias 132">
        <PhoneCall size={18} />
        <span>132</span>
      </a>

      {/* Modales Interactivos */}
      <CompanyModal 
        company={selectedCompany} 
        onClose={() => setSelectedCompany(null)} 
      />

      <NewsDetailModal 
        newsItem={selectedNews} 
        onClose={() => setSelectedNews(null)} 
      />

      {institutionOpen && (
        <InstitutionModal onClose={() => setInstitutionOpen(false)} />
      )}

      {cooperarOpen && (
        <CooperarModal onClose={() => setCooperarOpen(false)} />
      )}

      {adminOpen && (
        <AdminDashboard 
          onClose={() => setAdminOpen(false)}
          news={news}
          alert={alert}
          currentUser={currentUser}
          onLogin={(user) => setCurrentUser(user)}
          onLogout={() => setCurrentUser(null)}
          onSaveNews={handleSaveNews}
          onDeleteNews={handleDeleteNews}
          onUpdateAlert={handleUpdateAlert}
        />
      )}
    </div>
  );
};

export default App;
