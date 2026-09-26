import React from 'react';

export const HistoricalQuote: React.FC = () => {
  return (
    <section className="historical-quote-section" id="historia">
      <div className="container">
        <blockquote className="quote-text">
          «Al noble vecindario de San Felipe: Con el propósito de salvaguardar las vidas y haciendas de nuestra comunidad, se convoca a los ciudadanos de buena voluntad a fundar una institución al servicio permanente del bien común y la abnegación».
        </blockquote>
        <div className="quote-author">
          MOISÉS DEL FIERRO Y ARCAYA · FUNDACIÓN DEL CUERPO DE BOMBEROS DE SAN FELIPE
        </div>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', opacity: 0.8 }}>
          San Felipe, 11 de Marzo de 1883 · Valle de Aconcagua
        </p>
      </div>
    </section>
  );
};
