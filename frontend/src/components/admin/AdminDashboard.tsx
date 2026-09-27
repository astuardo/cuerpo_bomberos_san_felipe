import React, { useState, useRef } from 'react';
import { 
  X, Lock, LogOut, Plus, Trash2, Edit3, AlertTriangle, 
  FileText, Save, ShieldAlert, UploadCloud, Check, Loader2, Image as ImageIcon,
  Sliders, ArrowUp, ArrowDown
} from 'lucide-react';
import { NewsItem, EmergencyAlert, AdminUser, HeroSlide } from '../../types';

interface AdminDashboardProps {
  onClose: () => void;
  news: NewsItem[];
  alert: EmergencyAlert | null;
  slides?: HeroSlide[];
  currentUser: AdminUser | null;
  onLogin: (user: AdminUser) => void;
  onLogout: () => void;
  onSaveNews: (newsData: Partial<NewsItem>) => Promise<void>;
  onDeleteNews: (id: string) => Promise<void>;
  onUpdateAlert: (alertData: Partial<EmergencyAlert>) => Promise<void>;
  onSaveSlide?: (slideData: HeroSlide) => Promise<void>;
  onDeleteSlide?: (id: string) => Promise<void>;
  onReorderSlides?: (slides: HeroSlide[]) => Promise<void>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onClose,
  news,
  alert,
  slides = [],
  currentUser,
  onLogin,
  onLogout,
  onSaveNews,
  onDeleteNews,
  onUpdateAlert,
  onSaveSlide,
  onDeleteSlide,
  onReorderSlides
}) => {
  // Login State
  const [loginUsername, setLoginUsername] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('bomberosanfelipe2026');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tabs: 'news' | 'alert' | 'edit-news' | 'slides' | 'edit-slide'
  const [activeTab, setActiveTab] = useState<'news' | 'alert' | 'edit-news' | 'slides' | 'edit-slide'>('news');
  const [editingItem, setEditingItem] = useState<Partial<NewsItem> | null>(null);
  const [editingSlide, setEditingSlide] = useState<Partial<HeroSlide> | null>(null);
  const slideFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingSlideImg, setUploadingSlideImg] = useState(false);

  // Alert Form State
  const [alertActive, setAlertActive] = useState(alert?.active ?? true);
  const [alertTitle, setAlertTitle] = useState(alert?.title ?? 'ALERTA TEMPRANA PREVENTIVA');
  const [alertMessage, setAlertMessage] = useState(
    alert?.message ?? 'Condiciones propicias para incendios forestales en el Valle del Aconcagua. Ante humo llame al 132.'
  );

  // Blob Image Upload State
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    // Límite de 4.5 MB (límite server upload de Vercel)
    if (file.size > 4.5 * 1024 * 1024) {
      setUploadError('La imagen supera el límite de 4.5 MB. Por favor comprímela o selecciona una más liviana.');
      return;
    }

    setUploadingImage(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        headers: {
          'content-type': file.type || 'image/jpeg'
        },
        body: file
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Error al subir la imagen a Vercel Blob.');
      }

      if (data.url) {
        setEditingItem(prev => prev ? { ...prev, imageUrl: data.url } : null);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 4000);
      }
    } catch (err: any) {
      console.error('Error al subir imagen:', err);
      setUploadError(err.message || 'Error al conectar con el servicio de almacenamiento.');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

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
        imageUrl: '/placeholder-news.svg',
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

  // Manejo de diapositivas del slider
  const handleOpenSlideEditor = (slide?: HeroSlide) => {
    if (slide) {
      setEditingSlide({ ...slide });
    } else {
      setEditingSlide({
        id: 'slide-' + Date.now(),
        tag: 'DESTACADO CUERPO DE BOMBEROS',
        title: '',
        subtitle: '',
        bgImage: '',
        ctaPrimary: 'Conoce las 7 Compañías',
        action: 'companias',
        order: slides.length + 1
      });
    }
    setActiveTab('edit-slide');
  };

  const handleSlideImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    if (file.size > 4.5 * 1024 * 1024) {
      window.alert('La imagen supera el límite de 4.5 MB. Por favor comprímela o selecciona una más liviana.');
      return;
    }

    setUploadingSlideImg(true);

    try {
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        headers: { 'content-type': file.type || 'image/jpeg' },
        body: file
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Error al subir la imagen');
      }
      if (data.url) {
        setEditingSlide(prev => prev ? { ...prev, bgImage: data.url } : null);
      }
    } catch (err: any) {
      console.error(err);
      window.alert('Error al subir la imagen: ' + (err.message || 'Error de conexión'));
    } finally {
      setUploadingSlideImg(false);
      if (slideFileInputRef.current) {
        slideFileInputRef.current.value = '';
      }
    }
  };

  const handleSlideSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide || !editingSlide.title) {
      window.alert('Por favor ingrese el título de la diapositiva.');
      return;
    }
    if (!editingSlide.bgImage) {
      window.alert('Por favor proporcione una imagen de fondo (suba un archivo o pegue una URL).');
      return;
    }

    setIsSubmitting(true);
    try {
      if (onSaveSlide) {
        await onSaveSlide(editingSlide as HeroSlide);
      }
      setActiveTab('slides');
      setEditingSlide(null);
    } catch (err) {
      console.error(err);
      window.alert('Error al guardar la diapositiva.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMoveSlide = async (index: number, direction: 'up' | 'down') => {
    if (!onReorderSlides) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= slides.length) return;

    const newSlides = [...slides];
    const [moved] = newSlides.splice(index, 1);
    newSlides.splice(newIndex, 0, moved);

    // Actualizar orden numérico
    const reordered = newSlides.map((s, idx) => ({ ...s, order: idx + 1 }));
    await onReorderSlides(reordered);
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
            <div style={{
              background: '#FFFFFF',
              borderRadius: '50%',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              flexShrink: 0
            }}>
              <img 
                src="/escudo_cbsf_transparente.png" 
                alt="CBSF" 
                style={{ width: '26px', height: '26px', objectFit: 'contain' }} 
              />
            </div>
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
                src="/escudo_cbsf_transparente.png" 
                alt="Escudo Oficial Cuerpo de Bomberos San Felipe" 
                style={{ width: '75px', height: '75px', margin: '0 auto 0.75rem auto', objectFit: 'contain' }} 
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
                onClick={() => { setActiveTab('alert'); setEditingItem(null); setEditingSlide(null); }}
              >
                <AlertTriangle size={16} style={{ display: 'inline', marginRight: '6px' }} />
                Alerta en Portada
              </button>

              <button
                className={`tab-btn ${activeTab === 'slides' ? 'active' : ''}`}
                onClick={() => { setActiveTab('slides'); setEditingItem(null); setEditingSlide(null); }}
              >
                <Sliders size={16} style={{ display: 'inline', marginRight: '6px' }} />
                Slider Portada ({slides.length})
              </button>

              {activeTab === 'edit-news' && (
                <button className="tab-btn active">
                  <Edit3 size={16} style={{ display: 'inline', marginRight: '6px' }} />
                  {editingItem?.id ? 'Editar Noticia' : 'Nueva Noticia'}
                </button>
              )}

              {activeTab === 'edit-slide' && (
                <button className="tab-btn active">
                  <Edit3 size={16} style={{ display: 'inline', marginRight: '6px' }} />
                  {editingSlide?.id && slides.some(s => s.id === editingSlide.id) ? 'Editar Diapositiva' : 'Nueva Diapositiva'}
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
                  <label className="admin-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <ImageIcon size={16} /> Imagen de Portada (Vercel Blob Storage)
                  </label>
                  
                  {/* Selector / Subidor de archivo desde Celular o PC */}
                  <div style={{
                    border: '2px dashed #cbd5e1',
                    borderRadius: '8px',
                    padding: '1.25rem',
                    textAlign: 'center',
                    background: '#f8fafc',
                    marginBottom: '0.75rem',
                    transition: 'all 0.2s ease'
                  }}>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleImageFileSelect}
                      accept="image/jpeg, image/png, image/webp, image/gif"
                      style={{ display: 'none' }}
                      id="blob-file-upload-input"
                    />
                    
                    {uploadingImage ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: '#0284c7' }}>
                        <Loader2 className="animate-spin" size={28} />
                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Subiendo imagen a Vercel Blob...</span>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Guardando en la nube y optimizando entrega</span>
                      </div>
                    ) : (
                      <div>
                        <UploadCloud size={32} style={{ color: '#C40000', margin: '0 auto 0.5rem auto' }} />
                        <p style={{ margin: '0 0 0.35rem 0', fontWeight: 600, fontSize: '0.95rem', color: '#1e293b' }}>
                          Selecciona una foto desde tu dispositivo
                        </p>
                        <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.8rem', color: '#64748b' }}>
                          Formatos JPG, PNG o WebP desde tu celular o PC (Máx. 4.5 MB)
                        </p>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          style={{
                            background: '#C40000',
                            color: '#fff',
                            border: 'none',
                            padding: '0.55rem 1.25rem',
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            boxShadow: '0 2px 4px rgba(196, 0, 0, 0.2)'
                          }}
                        >
                          <UploadCloud size={16} /> Subir desde el Dispositivo
                        </button>
                      </div>
                    )}

                    {uploadSuccess && (
                      <div style={{ marginTop: '0.75rem', color: '#16a34a', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', fontWeight: 600 }}>
                        <Check size={16} /> ¡Imagen subida y enlazada exitosamente!
                      </div>
                    )}

                    {uploadError && (
                      <div style={{ marginTop: '0.75rem', padding: '0.6rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '4px', color: '#dc2626', fontSize: '0.85rem', textAlign: 'left' }}>
                        ⚠️ <strong>Atención:</strong> {uploadError}
                      </div>
                    )}
                  </div>

                  {/* Campo de texto alternativo para URL manual */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>O ingresa directamente una URL de imagen:</span>
                    {editingItem.imageUrl && (
                      <button
                        type="button"
                        onClick={() => setEditingItem({ ...editingItem, imageUrl: '' })}
                        style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        Quitar imagen
                      </button>
                    )}
                  </div>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={editingItem.imageUrl || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                    placeholder="https://... o sube una foto arriba"
                  />
                  {editingItem.imageUrl && (
                    <div style={{ marginTop: '0.5rem', maxHeight: '180px', overflow: 'hidden', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                      <img 
                        src={editingItem.imageUrl} 
                        alt="Vista previa" 
                        style={{ height: '180px', width: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = '/placeholder-news.svg';
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

            {/* Tab 3: Lista de Diapositivas del Slider */}
            {activeTab === 'slides' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <h4 style={{ margin: 0 }}>Diapositivas del Slider de Portada</h4>
                    <span style={{ fontSize: '0.8rem', color: '#666' }}>
                      Las diapositivas rotan en la portada del sitio. Puedes ordenarlas, editarlas o agregar nuevas.
                    </span>
                  </div>
                  <button className="btn-primary" onClick={() => handleOpenSlideEditor()}>
                    <Plus size={16} />
                    <span>Nueva Diapositiva</span>
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {slides.map((slide, idx) => (
                    <div 
                      key={slide.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        padding: '0.85rem 1rem',
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        flexWrap: 'wrap'
                      }}
                    >
                      {/* Miniatura y textos */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1', minWidth: '240px' }}>
                        <div style={{
                          width: '100px',
                          height: '60px',
                          borderRadius: '6px',
                          overflow: 'hidden',
                          background: '#1E293B',
                          flexShrink: 0
                        }}>
                          <img 
                            src={slide.bgImage} 
                            alt={slide.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>

                        <div style={{ minWidth: 0 }}>
                          <span style={{
                            display: 'inline-block',
                            background: 'var(--cbs-red)',
                            color: '#FFFFFF',
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            padding: '0.15rem 0.45rem',
                            borderRadius: '3px',
                            marginBottom: '3px'
                          }}>
                            {slide.tag}
                          </span>
                          <h5 style={{ margin: '0 0 3px 0', fontSize: '0.92rem', color: '#0F172A', lineHeight: 1.2 }}>
                            {slide.title}
                          </h5>
                          <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '420px' }}>
                            {slide.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Botón CTA info */}
                      <div style={{ fontSize: '0.78rem', color: '#475569', background: '#FFFFFF', padding: '0.3rem 0.6rem', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
                        Botón: <strong>{slide.ctaPrimary}</strong> &rarr; <code>#{slide.action}</code>
                      </div>

                      {/* Botones de acción */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <button 
                          onClick={() => handleMoveSlide(idx, 'up')}
                          disabled={idx === 0}
                          title="Subir posición"
                          style={{
                            padding: '0.4rem',
                            background: '#FFFFFF',
                            border: '1px solid #CBD5E1',
                            borderRadius: '4px',
                            cursor: idx === 0 ? 'not-allowed' : 'pointer',
                            opacity: idx === 0 ? 0.4 : 1
                          }}
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button 
                          onClick={() => handleMoveSlide(idx, 'down')}
                          disabled={idx === slides.length - 1}
                          title="Bajar posición"
                          style={{
                            padding: '0.4rem',
                            background: '#FFFFFF',
                            border: '1px solid #CBD5E1',
                            borderRadius: '4px',
                            cursor: idx === slides.length - 1 ? 'not-allowed' : 'pointer',
                            opacity: idx === slides.length - 1 ? 0.4 : 1
                          }}
                        >
                          <ArrowDown size={14} />
                        </button>
                        <button
                          onClick={() => handleOpenSlideEditor(slide)}
                          className="btn-action edit"
                          title="Editar diapositiva"
                          style={{ marginLeft: '0.25rem' }}
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`¿Seguro que deseas eliminar la diapositiva "${slide.title}"?`)) {
                              if (onDeleteSlide) onDeleteSlide(slide.id);
                            }
                          }}
                          className="btn-action delete"
                          title="Eliminar diapositiva"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Editor de Diapositiva */}
            {activeTab === 'edit-slide' && editingSlide && (
              <form onSubmit={handleSlideSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h4 style={{ margin: 0 }}>
                    {slides.some(s => s.id === editingSlide.id) ? 'Editar Diapositiva del Slider' : 'Crear Nueva Diapositiva'}
                  </h4>
                  <button 
                    type="button" 
                    onClick={() => { setActiveTab('slides'); setEditingSlide(null); }}
                    style={{ fontSize: '0.85rem', color: '#666', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Cancelar y Volver
                  </button>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Etiqueta Superior (Pastilla Roja)</label>
                  <input 
                    type="text" 
                    required
                    className="admin-input" 
                    value={editingSlide.tag || ''}
                    onChange={(e) => setEditingSlide({ ...editingSlide, tag: e.target.value })}
                    placeholder="Ej. DESDE EL 11 DE MARZO DE 1883 o FUERZA OPERATIVA"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Título Principal (En mayúsculas)</label>
                  <input 
                    type="text" 
                    required
                    className="admin-input" 
                    value={editingSlide.title || ''}
                    onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                    placeholder="Ej. CONSTANCIA Y DISCIPLINA AL SERVICIO DEL VALLE DE ACONCAGUA"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Descripción / Bajada</label>
                  <textarea 
                    rows={3}
                    className="admin-textarea" 
                    value={editingSlide.subtitle || ''}
                    onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                    placeholder="Texto explicativo breve que acompaña el título en el slider..."
                  />
                </div>

                {/* Imagen de Fondo */}
                <div className="admin-form-group">
                  <label className="admin-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <ImageIcon size={16} /> Foto de Fondo de la Diapositiva
                  </label>

                  {/* Vista previa si ya existe imagen */}
                  {editingSlide.bgImage && (
                    <div style={{ marginBottom: '0.75rem', position: 'relative', borderRadius: '8px', overflow: 'hidden', height: '140px', background: '#0F172A' }}>
                      <img 
                        src={editingSlide.bgImage} 
                        alt="Preview" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.6)', padding: '0.35rem 0.75rem', color: '#FFFFFF', fontSize: '0.75rem' }}>
                        Vista previa activa
                      </div>
                    </div>
                  )}

                  {/* Selector / Subidor de archivo desde Dispositivo */}
                  <div style={{
                    border: '2px dashed #cbd5e1',
                    borderRadius: '8px',
                    padding: '1rem',
                    textAlign: 'center',
                    background: '#f8fafc',
                    marginBottom: '0.75rem'
                  }}>
                    <input 
                      type="file" 
                      ref={slideFileInputRef}
                      onChange={handleSlideImageUpload}
                      accept="image/jpeg, image/png, image/webp, image/gif"
                      style={{ display: 'none' }}
                      id="slide-file-upload-input"
                    />

                    {uploadingSlideImg ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', color: '#0284c7' }}>
                        <Loader2 className="animate-spin" size={24} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Subiendo foto de fondo...</span>
                      </div>
                    ) : (
                      <div>
                        <button
                          type="button"
                          onClick={() => slideFileInputRef.current?.click()}
                          style={{
                            background: '#C40000',
                            color: '#fff',
                            border: 'none',
                            padding: '0.5rem 1.25rem',
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem'
                          }}
                        >
                          <UploadCloud size={16} /> Subir Foto desde Celular o PC
                        </button>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>
                          Sube fotos de carros, ejercicios o cuarteles (JPG, PNG, WebP)
                        </span>
                      </div>
                    )}
                  </div>

                  <input 
                    type="text" 
                    required
                    className="admin-input" 
                    value={editingSlide.bgImage || ''}
                    onChange={(e) => setEditingSlide({ ...editingSlide, bgImage: e.target.value })}
                    placeholder="O pega una URL directa de imagen (ej. https://...)"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Texto del Botón</label>
                    <input 
                      type="text" 
                      required
                      className="admin-input" 
                      value={editingSlide.ctaPrimary || ''}
                      onChange={(e) => setEditingSlide({ ...editingSlide, ctaPrimary: e.target.value })}
                      placeholder="Ej. Conoce las 7 Compañías"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Sección de Destino</label>
                    <select 
                      className="admin-select"
                      value={editingSlide.action || 'companias'}
                      onChange={(e) => setEditingSlide({ ...editingSlide, action: e.target.value })}
                    >
                      <option value="companias">Las 7 Compañías (#companias)</option>
                      <option value="especialidades">Especialidades GERSA/Agreste (#especialidades)</option>
                      <option value="noticias">Últimas Noticias (#noticias)</option>
                      <option value="cuarteles">Cuarteles y Mapa (#cuarteles)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={isSubmitting}
                  >
                    <Save size={16} />
                    <span>{isSubmitting ? 'Guardando...' : 'Guardar Diapositiva'}</span>
                  </button>
                  <button 
                    type="button" 
                    className="btn-outline"
                    onClick={() => { setActiveTab('slides'); setEditingSlide(null); }}
                  >
                    Cancelar
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
