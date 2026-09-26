import React, { useState } from 'react';
import { 
  X, Lock, LogOut, Plus, Trash2, Edit3, AlertTriangle, 
  FileText, Save, ShieldAlert 
} from 'lucide-react';
import { NewsItem, EmergencyAlert, AdminUser } from '../../types';

interface AdminDashboardProps {
  onClose: () => void;
  news: NewsItem[];
  alert: EmergencyAlert | null;
  currentUser: AdminUser | null;
  onLogin: (user: AdminUser) => void;
  onLogout: () => void;
  onSaveNews: (newsData: Partial<NewsItem>) => Promise<void>;
  onDeleteNews: (id: string) => Promise<void>;
  onUpdateAlert: (alertData: Partial<EmergencyAlert>) => Promise<void>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onClose,
  news,
  alert,
  currentUser,
  onLogin,
  onLogout,
  onSaveNews,
  onDeleteNews,
  onUpdateAlert
}) => {
  // Login State
  const [loginUsername, setLoginUsername] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('bomberosanfelipe2026');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tabs: 'news' | 'alert' | 'edit-news'
  const [activeTab, setActiveTab] = useState<'news' | 'alert' | 'edit-news'>('news');
  const [editingItem, setEditingItem] = useState<Partial<NewsItem> | null>(null);

  // Alert Form State
  const [alertActive, setAlertActive] = useState(alert?.active ?? true);
  const [alertTitle, setAlertTitle] = useState(alert?.title ?? 'ALERTA TEMPRANA PREVENTIVA');
  const [alertMessage, setAlertMessage] = useState(
    alert?.message ?? 'Condiciones propicias para incendios forestales en el Valle del Aconcagua. Ante humo llame al 132.'
  );

  // Handle Login seguro contra la API
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        onLogin({
          username: data.user.username,
          name: data.user.name,
          role: data.user.role,
          token: data.token
        });
      } else {
        setLoginError(data.message || 'Credenciales inválidas. Compruebe usuario y contraseña.');
      }
    } catch {
      setLoginError('Error de conexión con el servidor de autenticación.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Editor for New or Existing
  const handleOpenEditor = (item?: NewsItem) => {
    if (item) {
      setEditingItem({ ...item });
    } else {
      setEditingItem({
        title: '',
        category: 'ACTUALIDAD',
        author: currentUser?.name || 'Prensa CBSF',
        excerpt: '',
        content: '',
        imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1200&q=80',
        featured: false,
        status: 'PUBLICADO'
      });
    }
    setActiveTab('edit-news');
  };

  // Submit News
  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setIsSubmitting(true);

    try {
      await onSaveNews(editingItem);
      setActiveTab('news');
      setEditingItem(null);
    } catch (err) {
      console.error(err);
      window.alert('Error al guardar la noticia.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Alert
  const handleAlertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onUpdateAlert({
        active: alertActive,
        title: alertTitle,
        message: alertMessage
      });
      window.alert('Alerta actualizada exitosamente en portada.');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div 
        className="admin-modal-container" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: currentUser ? '980px' : '450px' }}
      >
        {/* Header del Modal */}
        <div className="admin-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Lock size={20} style={{ color: 'var(--cbs-red)' }} />
            <div>
              <h3 style={{ color: '#FFFFFF', margin: 0, fontSize: '1.15rem' }}>
                Panel de Prensa y Comunicaciones
              </h3>
              <span style={{ fontSize: '0.78rem', color: '#B0BEC5' }}>
                Cuerpo de Bomberos de San Felipe
              </span>
            </div>
          </div>

          <button onClick={onClose} style={{ color: '#FFFFFF' }} aria-label="Cerrar modal">
            <X size={24} />
          </button>
        </div>

        {/* Si NO está autenticado: Formulario de Login */}
        {!currentUser ? (
          <div className="admin-modal-body">
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <img 
                src="/logo-bomberos.svg" 
                alt="Logo" 
                style={{ width: '60px', height: '60px', margin: '0 auto 0.75rem auto' }} 
              />
              <h4 style={{ margin: 0 }}>Acceso de Oficial Encargado</h4>
              <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>
                Ingrese sus credenciales autorizadas para publicar noticias y emitir alertas
              </p>
            </div>

            {loginError && (
              <div style={{ 
                backgroundColor: '#FFEBEE', 
                color: '#C62828', 
                padding: '0.75rem', 
                borderRadius: '6px', 
                fontSize: '0.85rem', 
                marginBottom: '1rem',
                borderLeft: '4px solid #C62828'
              }}>
                {loginError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit}>
              <div className="admin-form-group">
                <label className="admin-label">Usuario</label>
                <input 
                  type="text" 
                  required
                  className="admin-input" 
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="admin"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Contraseña</label>
                <input 
                  type="password" 
                  required
                  className="admin-input" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                />
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{ width: '100%', justifyContent: 'center' }}
                  disabled={isSubmitting}
                >
                  <Lock size={16} />
                  <span>{isSubmitting ? 'Verificando...' : 'Iniciar Sesión'}</span>
                </button>
              </div>

              <p style={{ fontSize: '0.75rem', color: '#888', textAlign: 'center', marginTop: '1rem' }}>
                Credencial de demostración: <strong>admin</strong> / <strong>bomberosanfelipe2026</strong>
              </p>
            </form>
          </div>
        ) : (
          /* Si está autenticado: Panel de Administración */
          <div className="admin-modal-body">
            {/* Barra de usuario activo */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              background: '#F8F9FA', 
              padding: '0.75rem 1.25rem', 
              borderRadius: '8px',
              marginBottom: '1.5rem',
              border: '1px solid #ECECEC'
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#666' }}>Sesión activa como:</span>
                <div style={{ fontWeight: 800, color: 'var(--cbs-gray-dark)' }}>
                  {currentUser.name} ({currentUser.role})
                </div>
              </div>

              <button 
                onClick={onLogout}
                style={{ 
                  color: 'var(--cbs-red)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}
              >
                <LogOut size={16} />
                <span>Cerrar Sesión</span>
              </button>
            </div>

            {/* Pestañas de gestión */}
            <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #E5E7EB', marginBottom: '1.5rem' }}>
              <button
                className={`tab-btn ${activeTab === 'news' ? 'active' : ''}`}
                onClick={() => { setActiveTab('news'); setEditingItem(null); }}
              >
                <FileText size={16} style={{ display: 'inline', marginRight: '6px' }} />
                Noticias ({news.length})
              </button>

              <button
                className={`tab-btn ${activeTab === 'alert' ? 'active' : ''}`}
                onClick={() => { setActiveTab('alert'); setEditingItem(null); }}
              >
                <AlertTriangle size={16} style={{ display: 'inline', marginRight: '6px' }} />
                Alerta en Portada
              </button>

              {activeTab === 'edit-news' && (
                <button className="tab-btn active">
                  <Edit3 size={16} style={{ display: 'inline', marginRight: '6px' }} />
                  {editingItem?.id ? 'Editar Noticia' : 'Nueva Noticia'}
                </button>
              )}
            </div>

            {/* Tab 1: Lista de Noticias */}
            {activeTab === 'news' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ margin: 0 }}>Publicaciones Recientes</h4>
                  <button className="btn-primary" onClick={() => handleOpenEditor()}>
                    <Plus size={16} />
                    <span>Redactar Noticia</span>
                  </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Título</th>
                        <th>Categoría</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {news.map((item) => (
                        <tr key={item.id}>
                          <td style={{ whiteSpace: 'nowrap', fontSize: '0.82rem', color: '#666' }}>
                            {item.date}
                          </td>
                          <td style={{ fontWeight: 600, color: '#111' }}>
                            {item.title}
                          </td>
                          <td>
                            <span className="category-badge" style={{ margin: 0 }}>
                              {item.category}
                            </span>
                          </td>
                          <td>
                            <span style={{
                              backgroundColor: item.status === 'PUBLICADO' ? '#E8F5E9' : '#FFF3E0',
                              color: item.status === 'PUBLICADO' ? '#2E7D32' : '#E65100',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: 800
                            }}>
                              {item.status}
                            </span>
                          </td>
                          <td style={{ whiteSpace: 'nowrap' }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button 
                                onClick={() => handleOpenEditor(item)}
                                style={{ color: '#0288D1', padding: '4px' }}
                                title="Editar noticia"
                              >
                                <Edit3 size={16} />
                              </button>
                              <button 
                                onClick={() => {
                                  if (window.confirm(`¿Desea eliminar la noticia "${item.title}"?`)) {
                                    onDeleteNews(item.id);
                                  }
                                }}
                                style={{ color: '#D32F2F', padding: '4px' }}
                                title="Eliminar noticia"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 2: Editor de Noticia */}
            {activeTab === 'edit-news' && editingItem && (
              <form onSubmit={handleNewsSubmit}>
                <div className="admin-form-group">
                  <label className="admin-label">Título de la Noticia</label>
                  <input 
                    type="text" 
                    required
                    className="admin-input" 
                    value={editingItem.title || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    placeholder="Ej. Bomberos de San Felipe sofocan incendio estructural en sector céntrico"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Categoría</label>
                    <select 
                      className="admin-select"
                      value={editingItem.category || 'ACTUALIDAD'}
                      onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as any })}
                    >
                      <option value="ACTUALIDAD">ACTUALIDAD</option>
                      <option value="EMERGENCIAS">EMERGENCIAS</option>
                      <option value="CAPACITACIÓN">CAPACITACIÓN</option>
                      <option value="COMPAÑÍAS">COMPAÑÍAS</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Autor / Unidad</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      value={editingItem.author || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, author: e.target.value })}
                      placeholder="Superintendencia / Capitanía"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Estado de Publicación</label>
                    <select 
                      className="admin-select"
                      value={editingItem.status || 'PUBLICADO'}
                      onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value as any })}
                    >
                      <option value="PUBLICADO">PUBLICADO (Visible en portada)</option>
                      <option value="BORRADOR">BORRADOR (Oculto)</option>
                    </select>
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Imagen de Portada (URL)</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={editingItem.imageUrl || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                    placeholder="https://..."
                  />
                  {editingItem.imageUrl && (
                    <div style={{ marginTop: '0.5rem', maxHeight: '150px', overflow: 'hidden', borderRadius: '4px' }}>
                      <img 
                        src={editingItem.imageUrl} 
                        alt="Vista previa" 
                        style={{ height: '150px', width: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Bajada / Resumen Breve</label>
                  <textarea 
                    rows={2}
                    className="admin-textarea"
                    value={editingItem.excerpt || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, excerpt: e.target.value })}
                    placeholder="Resumen de dos líneas para la tarjeta de portada..."
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Cuerpo Completo de la Noticia</label>
                  <textarea 
                    rows={6}
                    required
                    className="admin-textarea"
                    value={editingItem.content || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                    placeholder="Detalle completo de la emergencia o comunicado institucional..."
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                  <button 
                    type="button" 
                    className="btn-outline"
                    onClick={() => { setActiveTab('news'); setEditingItem(null); }}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={isSubmitting}
                  >
                    <Save size={16} />
                    <span>{isSubmitting ? 'Guardando...' : 'Publicar Noticia'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Tab 3: Gestor de Alertas en Vivo */}
            {activeTab === 'alert' && (
              <form onSubmit={handleAlertSubmit} style={{ maxWidth: '650px' }}>
                <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldAlert size={20} style={{ color: 'var(--cbs-red)' }} />
                  Cintillo de Alertas de Emergencia en Portada
                </h4>

                <p style={{ fontSize: '0.88rem', color: '#555', marginBottom: '1.5rem' }}>
                  Este aviso aparece en la parte superior del portal para advertir inmediatamente a la ciudadanía sobre siniestros de gran magnitud, cortes en la Ruta 60 CH o alertas tempranas.
                </p>

                <div className="admin-form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 700 }}>
                    <input 
                      type="checkbox" 
                      checked={alertActive} 
                      onChange={(e) => setAlertActive(e.target.checked)}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span>Mostrar Alerta Activa en la Portada</span>
                  </label>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Encabezado de la Alerta</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={alertTitle}
                    onChange={(e) => setAlertTitle(e.target.value)}
                    placeholder="ALERTA TEMPRANA PREVENTIVA"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Mensaje para la Comunidad</label>
                  <textarea 
                    rows={3}
                    className="admin-textarea" 
                    value={alertMessage}
                    onChange={(e) => setAlertMessage(e.target.value)}
                    placeholder="Detalles de la emergencia o recomendación de seguridad..."
                  />
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                  <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={isSubmitting}
                  >
                    <Save size={16} />
                    <span>{isSubmitting ? 'Actualizando...' : 'Guardar y Publicar Alerta'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
