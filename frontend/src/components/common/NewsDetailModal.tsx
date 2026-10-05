import React from 'react';
import { X, Calendar, User, Tag, Share2 } from 'lucide-react';
import { NewsItem } from '../../types';

interface NewsDetailModalProps {
  newsItem: NewsItem | null;
  onClose: () => void;
}

export const NewsDetailModal: React.FC<NewsDetailModalProps> = ({ newsItem, onClose }) => {
  if (!newsItem) return null;

  // Permitir cerrar cómodamente con tecla Escape
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="admin-modal-backdrop">
      <div 
        className="admin-modal-container" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '820px' }}
      >
        <div className="admin-modal-header" style={{ backgroundColor: 'var(--cbs-red)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Tag size={16} />
            <span style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', fontSize: '0.85rem' }}>
              {newsItem.category}
            </span>
          </div>

          <button 
            onClick={onClose} 
            style={{ color: '#FFFFFF', opacity: 0.9, background: 'none', border: 'none', cursor: 'pointer' }}
            aria-label="Cerrar noticia"
          >
            <X size={24} />
          </button>
        </div>

        <div className="admin-modal-body">
          <h2 style={{ fontSize: '1.75rem', lineHeight: 1.3, marginBottom: '1rem', color: '#111' }}>
            {newsItem.title}
          </h2>

          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: '#777', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Calendar size={14} />
              {new Date(newsItem.date).toLocaleDateString('es-CL', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <User size={14} />
              Por {newsItem.author}
            </span>
          </div>

          <div style={{ marginBottom: '1.75rem', borderRadius: '8px', overflow: 'hidden', maxHeight: '420px', backgroundColor: '#222' }}>
            <img 
              src={newsItem.imageUrl?.includes('photo-1541888946425') ? '/placeholder-news.svg' : (newsItem.imageUrl || '/placeholder-news.svg')} 
              alt={newsItem.title} 
              width="800"
              height="420"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = '/placeholder-news.svg';
              }}
            />
          </div>

          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#333', lineHeight: 1.6, marginBottom: '1.25rem', borderLeft: '4px solid var(--cbs-red)', paddingLeft: '1rem' }}>
            {newsItem.excerpt}
          </div>

          <div style={{ fontSize: '1rem', lineHeight: 1.8, color: '#444', whiteSpace: 'pre-line' }}>
            {newsItem.content}
          </div>

          <div style={{ marginTop: '2.5rem', paddingTop: '1.25rem', borderTop: '1px solid #ECECEC', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#888' }}>
              Cuerpo de Bomberos de San Felipe · Oficialía de Comunicaciones
            </span>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                className="btn-outline" 
                style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: newsItem.title, text: newsItem.excerpt, url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Enlace copiado al portapapeles');
                  }
                }}
              >
                <Share2 size={14} />
                <span>Compartir</span>
              </button>
              <button 
                className="btn-primary" 
                style={{ padding: '0.45rem 1.25rem', fontSize: '0.82rem' }}
                onClick={onClose}
              >
                <span>Cerrar Noticia</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
