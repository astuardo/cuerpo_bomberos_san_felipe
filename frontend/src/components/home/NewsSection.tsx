import React, { useState } from 'react';
import { Calendar, User, ArrowRight, PlusCircle } from 'lucide-react';
import { NewsItem } from '../../types';

interface NewsSectionProps {
  news: NewsItem[];
  onSelectNews: (item: NewsItem) => void;
  onOpenCreateNews: () => void;
  isAdmin: boolean;
}

const CATEGORIES = ['TODAS', 'EMERGENCIAS', 'ACTUALIDAD', 'CAPACITACIÓN', 'COMPAÑÍAS'];

export const NewsSection: React.FC<NewsSectionProps> = ({
  news,
  onSelectNews,
  onOpenCreateNews,
  isAdmin
}) => {
  const [selectedCategory, setSelectedCategory] = useState('TODAS');

  const filteredNews = news.filter((item) => {
    if (item.status === 'BORRADOR' && !isAdmin) return false;
    if (selectedCategory === 'TODAS') return true;
    return item.category.toUpperCase() === selectedCategory;
  });

  return (
    <section className="section-padding" id="noticias">
      <div className="container">
        {/* Encabezado con estilo blockquote rojo como en CBS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div className="cbs-blockquote-title" style={{ marginBottom: 0 }}>
            <h2>NOTICIAS Y ACTUALIDAD</h2>
            <p style={{ margin: 0, color: '#666', fontSize: '0.95rem' }}>
              Infórmese de las intervenciones, comunicados oficiales y actividades del Cuerpo de Bomberos de San Felipe
            </p>
          </div>

          {isAdmin && (
            <button className="btn-primary" onClick={onOpenCreateNews}>
              <PlusCircle size={18} />
              <span>Publicar Nueva Noticia</span>
            </button>
          )}
        </div>

        {/* Filtro de Categorías */}
        <div className="news-filter-tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`tab-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grilla de Noticias */}
        {filteredNews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#888' }}>
            <p>No se encontraron noticias en esta categoría.</p>
          </div>
        ) : (
          <div className="news-grid">
            {filteredNews.map((item) => (
              <article key={item.id} className="news-card">
                <div className="news-card-img-wrap" onClick={() => onSelectNews(item)} style={{ cursor: 'pointer' }}>
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="news-card-img"
                    width="600"
                    height="340"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback si la imagen no carga
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <span className="news-card-badge">{item.category}</span>
                </div>

                <div className="news-card-body">
                  <div className="news-card-meta">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={13} />
                      {new Date(item.date).toLocaleDateString('es-CL', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <User size={13} />
                      {item.author}
                    </span>
                  </div>

                  <h3
                    className="news-card-title"
                    onClick={() => onSelectNews(item)}
                    style={{ cursor: 'pointer' }}
                  >
                    {item.title}
                  </h3>

                  <p className="news-card-excerpt">{item.excerpt}</p>

                  <div className="news-card-footer">
                    <button
                      className="read-more-btn"
                      onClick={() => onSelectNews(item)}
                    >
                      <span>Leer Noticia Completa</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
