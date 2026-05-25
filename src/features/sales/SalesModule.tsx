import './SalesModule.css';

export const SalesModule = () => {
  return (
    <section className="feature-module sales-module">
      <header className="feature-module__header">
        <p className="feature-module__eyebrow">Modulo</p>
        <h2>Ventas</h2>
        <p>Vista principal para ordenes comerciales y seguimiento de pagos.</p>
      </header>

      <div className="feature-module__grid">
        <article className="feature-module__card"><h3>Ordenes</h3><p>Control de ordenes en proceso.</p></article>
        <article className="feature-module__card"><h3>Pagos</h3><p>Estado y conciliacion de cobros.</p></article>
      </div>
    </section>
  );
};
