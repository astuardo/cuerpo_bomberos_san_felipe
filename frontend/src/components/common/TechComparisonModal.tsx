import React, { useState } from 'react';
import { 
  X, 
  Zap, 
  ShieldCheck, 
  DollarSign, 
  Cpu, 
  Layout, 
  Flame, 
  Printer, 
  TrendingUp, 
  Sparkles,
  BellRing,
  Smartphone
} from 'lucide-react';

interface TechComparisonModalProps {
  onClose: () => void;
}

export const TechComparisonModal: React.FC<TechComparisonModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'tabla' | 'funciones' | 'pilares'>('tabla');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="admin-modal-backdrop">
      <div 
        className="admin-modal-container" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '980px', width: '95%' }}
      >
        {/* Cabecera del Modal */}
        <div className="admin-modal-header" style={{ backgroundColor: 'var(--cbs-gray-dark)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              background: '#FFFFFF',
              borderRadius: '50%',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              flexShrink: 0
            }}>
              <img 
                src="/escudo_cbsf_transparente.png" 
                alt="Escudo Oficial CBSF" 
                style={{ width: '32px', height: '32px', objectFit: 'contain' }} 
              />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ 
                  backgroundColor: 'var(--cbs-red)', 
                  color: '#FFFFFF', 
                  fontSize: '0.65rem', 
                  fontWeight: 800, 
                  padding: '2px 8px', 
                  borderRadius: '3px',
                  letterSpacing: '0.5px'
                }}>
                  MEMORIA TÉCNICA INSTITUCIONAL
                </span>
                <span style={{ fontSize: '0.75rem', color: '#B0BEC5' }}>Portal Web Oficial</span>
              </div>
              <h3 style={{ color: '#FFFFFF', margin: '3px 0 0 0', fontSize: '1.2rem', fontWeight: 700 }}>
                Arquitectura Tecnológica: Vercel (Edge SPA) vs. WordPress Monolítico
              </h3>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button 
              onClick={handlePrint}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                color: '#FFFFFF',
                padding: '6px 12px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600
              }}
              title="Imprimir informe o guardar en PDF"
            >
              <Printer size={15} />
              <span>Imprimir / PDF</span>
            </button>
            <button 
              onClick={onClose} 
              style={{ color: '#FFFFFF', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }} 
              aria-label="Cerrar modal"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Barra de pestañas */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #E5E7EB',
          backgroundColor: '#F8FAFC',
          padding: '0 1.5rem',
          gap: '0.5rem',
          overflowX: 'auto'
        }}>
          <button
            onClick={() => setActiveTab('tabla')}
            style={{
              padding: '0.85rem 1.25rem',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'tabla' ? '3px solid var(--cbs-red)' : '3px solid transparent',
              color: activeTab === 'tabla' ? 'var(--cbs-red)' : '#64748B',
              fontWeight: activeTab === 'tabla' ? 700 : 500,
              cursor: 'pointer',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Layout size={16} />
            <span>Resumen Comparativo</span>
          </button>

          <button
            onClick={() => setActiveTab('funciones')}
            style={{
              padding: '0.85rem 1.25rem',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'funciones' ? '3px solid var(--cbs-red)' : '3px solid transparent',
              color: activeTab === 'funciones' ? 'var(--cbs-red)' : '#64748B',
              fontWeight: activeTab === 'funciones' ? 700 : 500,
              cursor: 'pointer',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Cpu size={16} />
            <span>Comparativa Función por Función</span>
          </button>

          <button
            onClick={() => setActiveTab('pilares')}
            style={{
              padding: '0.85rem 1.25rem',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'pilares' ? '3px solid var(--cbs-red)' : '3px solid transparent',
              color: activeTab === 'pilares' ? 'var(--cbs-red)' : '#64748B',
              fontWeight: activeTab === 'pilares' ? 700 : 500,
              cursor: 'pointer',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ShieldCheck size={16} />
            <span>Por qué Vercel para Bomberos</span>
          </button>
        </div>

        {/* Cuerpo del Modal */}
        <div className="admin-modal-body" style={{ padding: '1.75rem', backgroundColor: '#FFFFFF' }}>
          
          {/* PESTAÑA 1: RESUMEN COMPARATIVO */}
          {activeTab === 'tabla' && (
            <div>
              {/* Banner de Conclusión Rápida */}
              <div style={{
                background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
                color: '#FFFFFF',
                borderRadius: '8px',
                padding: '1.25rem 1.5rem',
                marginBottom: '1.75rem',
                borderLeft: '5px solid var(--cbs-red)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                  <Sparkles size={18} style={{ color: '#FFE600' }} />
                  <strong style={{ fontSize: '1rem', color: '#FFE600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Dictamen Técnico: Arquitectura Moderna Edge (Vercel + React)
                  </strong>
                </div>
                <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.6, color: '#E2E8F0' }}>
                  Para una institución de emergencia como el <strong>Cuerpo de Bomberos de San Felipe</strong>, la disponibilidad crítica ante catástrofes comunales, la velocidad en redes móviles y el ahorro del 100% en licencias y hosting hacen que el stack moderno implementado en <strong>Vercel</strong> sea técnicamente y financieramente muy superior a un WordPress monolítico en hosting compartido.
                </p>
              </div>

              {/* Tabla Comparativa General */}
              <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '1.5rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                      <th style={{ padding: '0.85rem 1rem', color: '#334155', fontWeight: 700, width: '25%' }}>Criterio</th>
                      <th style={{ padding: '0.85rem 1rem', color: '#0F766E', fontWeight: 700, width: '38%', backgroundColor: '#F0FDFA' }}>
                        Stack Actual (Vercel + React / SPA)
                      </th>
                      <th style={{ padding: '0.85rem 1rem', color: '#991B1B', fontWeight: 700, width: '37%', backgroundColor: '#FEF2F2' }}>
                        WordPress Tradicional (cPanel / PHP)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#1E293B' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Zap size={16} color="var(--cbs-red)" />
                          Velocidad & Rendimiento
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', backgroundColor: '#F0FDFA', color: '#0F766E' }}>
                        <strong>Instantánea (&lt; 0.5s):</strong> Servido desde el CDN Edge global de Vercel. Carga inmediata en celulares con señal 3G/4G débil.
                      </td>
                      <td style={{ padding: '0.85rem 1rem', backgroundColor: '#FEF2F2', color: '#991B1B' }}>
                        <strong>Variable (2s a 5s):</strong> Depende de la base de datos MySQL, procesamiento PHP y sobrecarga de plugins.
                      </td>
                    </tr>

                    <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#1E293B' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Flame size={16} color="var(--cbs-red)" />
                          Tolerancia a Emergencias
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', backgroundColor: '#F0FDFA', color: '#0F766E' }}>
                        <strong>Inmune a caídas:</strong> Soporta miles de consultas simultáneas durante incendios, sismos o alertas rojas sin colapsar.
                      </td>
                      <td style={{ padding: '0.85rem 1rem', backgroundColor: '#FEF2F2', color: '#991B1B' }}>
                        <strong>Riesgo de colapso:</strong> Un hosting compartido de $5 USD agota sus conexiones PHP/MySQL ante picos de tráfico repentinos.
                      </td>
                    </tr>

                    <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#1E293B' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <ShieldCheck size={16} color="var(--cbs-red)" />
                          Seguridad Institucional
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', backgroundColor: '#F0FDFA', color: '#0F766E' }}>
                        <strong>Blindaje total:</strong> Sin PHP ni puertos de BD expuestos a internet. Inmune a ataques típicos de inyección o bots masivos.
                      </td>
                      <td style={{ padding: '0.85rem 1rem', backgroundColor: '#FEF2F2', color: '#991B1B' }}>
                        <strong>Objetivo común de bots:</strong> Concentra &gt;60% de hackeos mundiales por fallos en plugins y temas desactualizados.
                      </td>
                    </tr>

                    <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#1E293B' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <DollarSign size={16} color="var(--cbs-red)" />
                          Costo de Infraestructura
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', backgroundColor: '#F0FDFA', color: '#0F766E' }}>
                        <strong>$0 USD/mes:</strong> Nivel gratuito de Vercel + bases de datos serverless cubren con creces la operación de Bomberos.
                      </td>
                      <td style={{ padding: '0.85rem 1rem', backgroundColor: '#FEF2F2', color: '#991B1B' }}>
                        <strong>$60 a $200 USD anuales:</strong> Pago recurrente de hosting cPanel, más costos de plugins premium de pago.
                      </td>
                    </tr>

                    <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#1E293B' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Layout size={16} color="var(--cbs-red)" />
                          Panel de Encargado de Prensa
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', backgroundColor: '#F0FDFA', color: '#0F766E' }}>
                        <strong>Hecho a medida:</strong> Panel limpio con solo lo necesario (Noticias, Alertas, Compañías, Slides). Imposible romper el diseño.
                      </td>
                      <td style={{ padding: '0.85rem 1rem', backgroundColor: '#FEF2F2', color: '#991B1B' }}>
                        <strong>Complejo y sobrecargado:</strong> Decenas de menús técnicos, avisos de actualizaciones que confunden al voluntario no técnico.
                      </td>
                    </tr>

                    <tr>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#1E293B' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <TrendingUp size={16} color="var(--cbs-red)" />
                          Mantenimiento Técnico
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', backgroundColor: '#F0FDFA', color: '#0F766E' }}>
                        <strong>Cero mantenimiento de servidor:</strong> No hay que parchar sistemas operativos, configurar Apache/Nginx ni limpiar caché.
                      </td>
                      <td style={{ padding: '0.85rem 1rem', backgroundColor: '#FEF2F2', color: '#991B1B' }}>
                        <strong>Monitoreo continuo:</strong> Requiere actualizar plugins cada mes; si un plugin se descontinúa puede romper el sitio.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PESTAÑA 2: COMPARATIVA FUNCIÓN POR FUNCIÓN */}
          {activeTab === 'funciones' && (
            <div>
              <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                Evaluación técnica de cada uno de los componentes ya programados en este portal web respecto a su equivalente en WordPress:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                
                {/* 1. Alertas */}
                <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1.25rem', backgroundColor: '#F8FAFC' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#B91C1C', fontWeight: 700, marginBottom: '0.5rem' }}>
                    <BellRing size={18} />
                    <span>Cintillo de Alertas en Vivo</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.5 }}>
                    <p style={{ margin: '0 0 0.5rem 0' }}>
                      <strong style={{ color: '#0F766E' }}>En Vercel:</strong> El encargado activa o apaga la alerta con un switch en <code>AdminDashboard</code>. Se refleja en tiempo real sin recargar la web.
                    </p>
                    <p style={{ margin: 0 }}>
                      <strong style={{ color: '#991B1B' }}>En WordPress:</strong> Requiere plugins de notificación que agregan scripts pesados o desarrollos personalizados en PHP.
                    </p>
                  </div>
                </div>

                {/* 2. Noticias y Modales */}
                <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1.25rem', backgroundColor: '#F8FAFC' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1E293B', fontWeight: 700, marginBottom: '0.5rem' }}>
                    <Layout size={18} />
                    <span>Noticias y Modales SPA</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.5 }}>
                    <p style={{ margin: '0 0 0.5rem 0' }}>
                      <strong style={{ color: '#0F766E' }}>En Vercel:</strong> La noticia se abre en una ventana modal instantánea. Filtros por categorías en milisegundos sin refrescar la página.
                    </p>
                    <p style={{ margin: 0 }}>
                      <strong style={{ color: '#991B1B' }}>En WordPress:</strong> Carga páginas completas con cada clic, consumiendo más megas de navegación a los usuarios en celular.
                    </p>
                  </div>
                </div>

                {/* 3. Las 7 Compañías */}
                <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1.25rem', backgroundColor: '#F8FAFC' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#B45309', fontWeight: 700, marginBottom: '0.5rem' }}>
                    <Flame size={18} />
                    <span>Módulo de las 7 Compañías</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.5 }}>
                    <p style={{ margin: '0 0 0.5rem 0' }}>
                      <strong style={{ color: '#0F766E' }}>En Vercel:</strong> Fichas individualizadas para 1ª a 7ª Compañía con lemas, historia, especialidades (GERSA, Agreste, Forestal) y colores oficiales.
                    </p>
                    <p style={{ margin: 0 }}>
                      <strong style={{ color: '#991B1B' }}>En WordPress:</strong> Requiere plugins de Custom Post Types (CPT) y maquetación manual con page builders propensos a desalinearse.
                    </p>
                  </div>
                </div>

                {/* 4. Métricas Institucionales */}
                <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1.25rem', backgroundColor: '#F8FAFC' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0369A1', fontWeight: 700, marginBottom: '0.5rem' }}>
                    <TrendingUp size={18} />
                    <span>Métricas (+450 Voluntarios)</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.5 }}>
                    <p style={{ margin: '0 0 0.5rem 0' }}>
                      <strong style={{ color: '#0F766E' }}>En Vercel:</strong> Contadores de emergencia anuales y dotación editables desde el panel de administración con actualización en vivo.
                    </p>
                    <p style={{ margin: 0 }}>
                      <strong style={{ color: '#991B1B' }}>En WordPress:</strong> Widgets de contadores que sobrecargan librerías JS como jQuery y bajan el puntaje de Google PageSpeed.
                    </p>
                  </div>
                </div>

                {/* 5. Mapa de Cuarteles */}
                <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1.25rem', backgroundColor: '#F8FAFC' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#15803D', fontWeight: 700, marginBottom: '0.5rem' }}>
                    <Smartphone size={18} />
                    <span>Mapa Interactivo de Cuarteles</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.5 }}>
                    <p style={{ margin: '0 0 0.5rem 0' }}>
                      <strong style={{ color: '#0F766E' }}>En Vercel:</strong> Integración liviana de mapas georreferenciados con geolocalización rápida en San Felipe y Aconcagua.
                    </p>
                    <p style={{ margin: 0 }}>
                      <strong style={{ color: '#991B1B' }}>En WordPress:</strong> Plugins de Google Maps que exigen tarjeta de crédito para API Keys o insertan iframes lentos.
                    </p>
                  </div>
                </div>

                {/* 6. Módulo "Quiero Cooperar" */}
                <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1.25rem', backgroundColor: '#F8FAFC' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#7E22CE', fontWeight: 700, marginBottom: '0.5rem' }}>
                    <DollarSign size={18} />
                    <span>Captación de Socios y Donaciones</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.5 }}>
                    <p style={{ margin: '0 0 0.5rem 0' }}>
                      <strong style={{ color: '#0F766E' }}>En Vercel:</strong> Modal directo con datos bancarios del CBSF y pasarela modular a costo $0 sin comisiones fijas de plugins.
                    </p>
                    <p style={{ margin: 0 }}>
                      <strong style={{ color: '#991B1B' }}>En WordPress:</strong> Plugins como WooCommerce o GiveWP que añaden tablas gigantes a la base de datos y cobran suscripciones por plugins de Transbank.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* PESTAÑA 3: PILARES ESTRATÉGICOS */}
          {activeTab === 'pilares' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', background: '#F8FAFC', padding: '1.25rem', borderRadius: '8px', borderLeft: '4px solid var(--cbs-red)' }}>
                <div style={{ backgroundColor: '#FEE2E2', padding: '10px', borderRadius: '50%', color: 'var(--cbs-red)', flexShrink: 0 }}>
                  <Flame size={24} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.4rem 0', color: '#1E293B', fontSize: '1.05rem' }}>
                    1. Resiliencia Crítica en Emergencias y Catástrofes
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: '#475569', lineHeight: 1.6 }}>
                    Durante un incendio forestal masivo, terremoto o corte de rutas en el Valle de Aconcagua, la población acude masivamente al sitio web institucional. En un hosting WordPress tradicional, el tráfico simultáneo agota el límite de memoria del servidor PHP y la web se "cae". En <strong>Vercel</strong>, cada página está distribuida en cientos de servidores perimetrales (Edge CDN), resistiendo millones de visitas sin inmutarse ni ralentizarse.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', background: '#F8FAFC', padding: '1.25rem', borderRadius: '8px', borderLeft: '4px solid #0F766E' }}>
                <div style={{ backgroundColor: '#CCFBF1', padding: '10px', borderRadius: '50%', color: '#0F766E', flexShrink: 0 }}>
                  <DollarSign size={24} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.4rem 0', color: '#1E293B', fontSize: '1.05rem' }}>
                    2. Cero Gasto Presupuestario en Hosting
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: '#475569', lineHeight: 1.6 }}>
                    Bomberos de Chile subsiste gracias al aporte voluntario y subvenciones fiscales que deben priorizar equipamiento de protección personal, combustible y material mayor (carros bomba). Adoptar esta arquitectura permite que el costo de alojamiento web sea <strong>$0 pesos mensuales</strong>, garantizando sustentabilidad a perpetuidad sin depender de renovaciones anuales de hosting.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', background: '#F8FAFC', padding: '1.25rem', borderRadius: '8px', borderLeft: '4px solid #2563EB' }}>
                <div style={{ backgroundColor: '#DBEAFE', padding: '10px', borderRadius: '50%', color: '#2563EB', flexShrink: 0 }}>
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.4rem 0', color: '#1E293B', fontSize: '1.05rem' }}>
                    3. Protección de la Identidad Institucional
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: '#475569', lineHeight: 1.6 }}>
                    Los gestores de contenido como WordPress sufren con frecuencia ataques de "defacement" (modificación no autorizada de la portada) ejecutados por bots que rastrean vulnerabilidades en plugins desactualizados. La arquitectura estática y serverless no expone archivos PHP ni bases de datos públicas, garantizando la seriedad e integridad de los comunicados oficiales del Cuerpo.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', background: '#F8FAFC', padding: '1.25rem', borderRadius: '8px', borderLeft: '4px solid #7C3AED' }}>
                <div style={{ backgroundColor: '#EDE9FE', padding: '10px', borderRadius: '50%', color: '#7C3AED', flexShrink: 0 }}>
                  <Layout size={24} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.4rem 0', color: '#1E293B', fontSize: '1.05rem' }}>
                    4. Simplicidad para el Encargado de Prensa
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: '#475569', lineHeight: 1.6 }}>
                    El panel de administración desarrollado internamente en este proyecto está diseñado exclusivamente para el bombero o secretaria a cargo: redactar noticia, adjuntar foto, activar alerta y guardar. No hay riesgo de desconfigurar fuentes, colores o márgenes, preservando la línea gráfica oficial inspirada en el estándar del Cuerpo de Bomberos de Santiago (CBS).
                  </p>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Pie del modal */}
        <div style={{
          padding: '1rem 1.75rem',
          backgroundColor: '#F8FAFC',
          borderTop: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
            Documento de memoria técnica y evaluación de arquitectura digital · CBSF 2026
          </span>
          <button 
            className="btn-primary"
            onClick={onClose}
            style={{ padding: '0.5rem 1.5rem', fontSize: '0.88rem' }}
          >
            Entendido / Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
