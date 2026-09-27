import React, { useState, useEffect } from 'react';
import { PhoneCall, AlertTriangle, X } from 'lucide-react';
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
  INITIAL_ALERT,
  INITIAL_SLIDES,
  INITIAL_INSTITUTION
} from './data/initialData';
import { Company, NewsItem, EmergencyAlert, StatsData, AdminUser, HeroSlide, InstitutionData } from './types';

export const App: React.FC = () => {
  // Datos principales cargados desde la base de datos (PostgreSQL / Backend)
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES);
  const [news, setNews] = useState<NewsItem[]>(INITIAL_NEWS);
  const [alert, setAlert] = useState<EmergencyAlert | null>(INITIAL_ALERT);
  const [slides, setSlides] = useState<HeroSlide[]>(INITIAL_SLIDES);
  const [stats, setStats] = useState<StatsData>(INITIAL_STATS);
  const [institution, setInstitution] = useState<InstitutionData>(INITIAL_INSTITUTION);

  // Estados de Modales
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [institutionOpen, setInstitutionOpen] = useState(false);
  const [cooperarOpen, setCooperarOpen] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  // Estado del Administrador / Encargado de Prensa
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  // Fetch de datos desde la base de datos al cargar
  useEffect(() => {
    // Limpieza de claves previas de localStorage para garantizar lectura 100% desde BD
    ['cbsf_companies', 'cbsf_news', 'cbsf_alert', 'cbsf_slides', 'cbsf_stats', 'cbsf_institution'].forEach(k => {
      try { localStorage.removeItem(k); } catch (_) {}
    });

    const fetchJson = async (url: string) => {
      try {
        const res = await fetch(url);
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          return await res.json();
        }
      } catch {
        // En caso de modo offline o sin conexión
      }
      return null;
    };

    // Cargar noticias
    fetchJson('/api/news').then((data) => {
      if (data && Array.isArray(data) && data.length > 0) {
        const sanitized = data.map((item: NewsItem) => ({
          ...item,
          imageUrl: item.imageUrl?.includes('photo-1541888946425') ? '/placeholder-news.svg' : (item.imageUrl || '/placeholder-news.svg')
        }));
        setNews(sanitized);
      }
    });

    // Cargar compañías
    fetchJson('/api/companies').then((data) => {
      if (data && Array.isArray(data) && data.length > 0) {
        setCompanies(data);
      }
    });

    // Cargar alerta
    fetchJson('/api/alerts').then((data) => {
      if (data && Array.isArray(data) && data.length > 0) {
        setAlert(data[0]);
      }
    });

    // Cargar estadísticas
    fetchJson('/api/stats').then((data) => {
      if (data && data.companies) {
        setStats(data);
      }
    });

    // Cargar diapositivas del slider
    fetchJson('/api/slides').then((data) => {
      if (data && Array.isArray(data) && data.length > 0) {
        setSlides(data);
      }
    });

    // Cargar información institucional y mando
    fetchJson('/api/institution').then((data) => {
      if (data && data.superintendentName) {
        setInstitution(data);
      }
    });

    // Refrescar al volver a la app o pestaña
    const handleSync = () => {
      if (document.visibilityState === 'visible') {
        fetchJson('/api/news').then((data) => {
          if (data && Array.isArray(data) && data.length > 0) {
            setNews(data);
          }
        });
        fetchJson('/api/alerts').then((data) => {
          if (data && Array.isArray(data) && data.length > 0) {
            setAlert(data[0]);
          }
        });
        fetchJson('/api/slides').then((data) => {
          if (data && Array.isArray(data) && data.length > 0) {
            setSlides(data);
          }
        });
        fetchJson('/api/companies').then((data) => {
          if (data && Array.isArray(data) && data.length > 0) {
            setCompanies(data);
          }
        });
        fetchJson('/api/institution').then((data) => {
          if (data && data.superintendentName) {
            setInstitution(data);
          }
        });
        fetchJson('/api/stats').then((data) => {
          if (data && data.companies) {
            setStats(data);
          }
        });
      }
    };

    document.addEventListener('visibilitychange', handleSync);
    window.addEventListener('focus', handleSync);

    return () => {
      document.removeEventListener('visibilitychange', handleSync);
      window.removeEventListener('focus', handleSync);
    };
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

  // Guardar noticia (Crear o Editar en Base de Datos)
  const handleSaveNews = async (newsData: Partial<NewsItem>) => {
    const isEdit = !!newsData.id;
    const payload = isEdit 
      ? newsData 
      : {
          id: 'noticia-' + Date.now(),
          title: newsData.title || 'Nueva Noticia',
          category: newsData.category || 'ACTUALIDAD',
          date: new Date().toISOString().split('T')[0],
          author: newsData.author || 'Prensa CBSF',
          excerpt: newsData.excerpt || '',
          content: newsData.content || '',
          imageUrl: newsData.imageUrl || '/placeholder-news.svg',
          featured: newsData.featured || false,
          status: newsData.status || 'PUBLICADO'
        };

    // Guardar en la base de datos PostgreSQL / Backend
    try {
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const saved = await res.json();
        if (saved && saved.id) {
          setNews((prev) => {
            const exists = prev.some(n => n.id === saved.id);
            if (exists) {
              return prev.map(n => n.id === saved.id ? saved : n);
            }
            return [saved, ...prev];
          });
        }
      } else {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Error en el servidor de base de datos');
      }
    } catch (err: any) {
      console.error('Error guardando noticia en BD:', err);
      window.alert('No se pudo guardar la noticia en la base de datos: ' + (err.message || 'Error de conexión'));
      throw err;
    }
  };

  // Eliminar noticia en Base de Datos
  const handleDeleteNews = async (id: string) => {
    try {
      const res = await fetch(`/api/news?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setNews((prev) => prev.filter((n) => n.id !== id));
      } else {
        throw new Error('Error al eliminar la noticia en la base de datos');
      }
    } catch (err: any) {
      console.error('Error eliminando noticia en BD:', err);
      window.alert('Error al eliminar en la base de datos: ' + (err.message || 'Error de conexión'));
    }
  };

  // Actualizar alerta en Base de Datos
  const handleUpdateAlert = async (alertData: Partial<EmergencyAlert>) => {
    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertData)
      });
      if (res.ok) {
        const saved = await res.json();
        setAlert(saved);
      } else {
        throw new Error('Error al guardar la alerta en la base de datos');
      }
    } catch (err: any) {
      console.error('Error actualizando alerta en BD:', err);
      window.alert('No se pudo guardar la alerta en la base de datos: ' + (err.message || 'Error de conexión'));
      throw err;
    }
  };

  // Guardar diapositiva en Base de Datos
  const handleSaveSlide = async (slide: HeroSlide) => {
    try {
      const res = await fetch('/api/slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slide)
      });
      if (res.ok) {
        setSlides((prev) => {
          const exists = prev.some(s => s.id === slide.id);
          if (exists) {
            return prev.map(s => s.id === slide.id ? slide : s);
          }
          return [...prev, slide];
        });
      } else {
        throw new Error('Error al guardar la diapositiva en la base de datos');
      }
    } catch (err: any) {
      console.error('Error guardando diapositiva en BD:', err);
      window.alert('No se pudo guardar la diapositiva en la base de datos: ' + (err.message || 'Error de conexión'));
      throw err;
    }
  };

  // Eliminar diapositiva en Base de Datos
  const handleDeleteSlide = async (id: string) => {
    if (slides.length <= 1) {
      window.alert('Debe mantenerse al menos una diapositiva en el slider.');
      return;
    }

    try {
      const res = await fetch(`/api/slides?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSlides((prev) => prev.filter(s => s.id !== id));
      } else {
        throw new Error('Error al eliminar la diapositiva en la base de datos');
      }
    } catch (err: any) {
      console.error('Error eliminando diapositiva en BD:', err);
      window.alert('Error al eliminar en la base de datos: ' + (err.message || 'Error de conexión'));
    }
  };

  // Reordenar diapositivas en Base de Datos
  const handleReorderSlides = async (newSlides: HeroSlide[]) => {
    try {
      const res = await fetch('/api/slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSlides)
      });
      if (res.ok) {
        setSlides(newSlides);
      } else {
        throw new Error('Error al actualizar el orden de diapositivas en la base de datos');
      }
    } catch (err: any) {
      console.error('Error reordenando diapositivas en BD:', err);
      window.alert('No se pudo guardar el orden en la base de datos: ' + (err.message || 'Error de conexión'));
    }
  };

  // Guardar datos de compañía en Base de Datos
  const handleSaveCompany = async (company: Company) => {
    try {
      const res = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(company)
      });
      if (res.ok) {
        setCompanies((prev) => prev.map(c => c.id === company.id ? company : c));
      } else {
        throw new Error('Error al guardar la compañía en la base de datos');
      }
    } catch (err: any) {
      console.error('Error guardando compañía en BD:', err);
      window.alert('No se pudo guardar la compañía en la base de datos: ' + (err.message || 'Error de conexión'));
      throw err;
    }
  };

  // Guardar directorio institucional en Base de Datos
  const handleSaveInstitution = async (data: InstitutionData) => {
    try {
      const res = await fetch('/api/institution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setInstitution(data);
      } else {
        throw new Error('Error al guardar datos institucionales en la base de datos');
      }
    } catch (err: any) {
      console.error('Error guardando institución en BD:', err);
      window.alert('No se pudo guardar en la base de datos: ' + (err.message || 'Error de conexión'));
      throw err;
    }
  };

  // Guardar estadísticas en Base de Datos
  const handleSaveStats = async (newStats: StatsData) => {
    try {
      const res = await fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStats)
      });
      if (res.ok) {
        setStats(newStats);
      } else {
        throw new Error('Error al guardar estadísticas en la base de datos');
      }
    } catch (err: any) {
      console.error('Error guardando estadísticas en BD:', err);
      window.alert('No se pudo guardar en la base de datos: ' + (err.message || 'Error de conexión'));
      throw err;
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
        onOpenAlertModal={() => setAlertModalOpen(true)}
      />

      {/* 4. Hero Slider Panorámico */}
      <HeroSlider 
        slides={slides}
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
        <InstitutionModal onClose={() => setInstitutionOpen(false)} data={institution} />
      )}

      {cooperarOpen && (
        <CooperarModal onClose={() => setCooperarOpen(false)} />
      )}

      {/* Modal Oficial de Alerta de Emergencia */}
      {alertModalOpen && alert && (
        <div className="admin-modal-backdrop" onClick={() => setAlertModalOpen(false)}>
          <div 
            className="admin-modal-container" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '560px' }}
          >
            <div className="admin-modal-header" style={{ backgroundColor: '#B71C1C' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <AlertTriangle size={22} style={{ color: '#FFE600' }} />
                <h3 style={{ color: '#FFFFFF', margin: 0, fontSize: '1.15rem' }}>
                  Alerta Oficial de Emergencia
                </h3>
              </div>
              <button 
                onClick={() => setAlertModalOpen(false)}
                style={{ color: '#FFFFFF', background: 'none', border: 'none', cursor: 'pointer' }}
                aria-label="Cerrar modal"
              >
                <X size={24} />
              </button>
            </div>

            <div className="admin-modal-body" style={{ padding: '1.75rem' }}>
              <div style={{
                display: 'inline-block',
                background: '#FFE600',
                color: '#8A0000',
                fontWeight: 800,
                fontSize: '0.82rem',
                padding: '0.25rem 0.75rem',
                borderRadius: '4px',
                marginBottom: '1rem',
                letterSpacing: '0.5px'
              }}>
                {alert.title}
              </div>

              <p style={{
                fontSize: '1.05rem',
                lineHeight: 1.6,
                color: '#1E293B',
                fontWeight: 500,
                marginBottom: '1.5rem'
              }}>
                {alert.message}
              </p>

              <div style={{
                background: '#FEF2F2',
                borderLeft: '4px solid #B71C1C',
                padding: '0.85rem 1rem',
                borderRadius: '0 8px 8px 0',
                marginBottom: '1.5rem'
              }}>
                <span style={{ fontSize: '0.82rem', color: '#991B1B', fontWeight: 600 }}>
                  Central de Alarmas y Despacho CBSF · Emergencias 132
                </span>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: '#7F1D1D' }}>
                  Ante columnas de humo, corte de calzada o personas atrapadas, llame de inmediato a nuestra central de guardia permanente.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <a 
                  href="tel:132"
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center', textDecoration: 'none' }}
                >
                  <PhoneCall size={18} />
                  <span>Llamar al 132</span>
                </a>
                <button 
                  className="btn-outline"
                  onClick={() => setAlertModalOpen(false)}
                  style={{ padding: '0.65rem 1.25rem' }}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {adminOpen && (
        <AdminDashboard 
          onClose={() => setAdminOpen(false)}
          news={news}
          alert={alert}
          slides={slides}
          companies={companies}
          institution={institution}
          stats={stats}
          currentUser={currentUser}
          onLogin={(user) => setCurrentUser(user)}
          onLogout={() => setCurrentUser(null)}
          onSaveNews={handleSaveNews}
          onDeleteNews={handleDeleteNews}
          onUpdateAlert={handleUpdateAlert}
          onSaveSlide={handleSaveSlide}
          onDeleteSlide={handleDeleteSlide}
          onReorderSlides={handleReorderSlides}
          onSaveCompany={handleSaveCompany}
          onSaveInstitution={handleSaveInstitution}
          onSaveStats={handleSaveStats}
        />
      )}
    </div>
  );
};

export default App;
