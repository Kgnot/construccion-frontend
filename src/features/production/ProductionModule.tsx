import './ProductionModule.css';

export const ProductionModule = () => {
  return (
    <section className="feature-module production-module">
      <header className="feature-module__header">
        <p className="feature-module__eyebrow">Modulo</p>
        <h2>Produccion</h2>
        <p>Vista principal para ordenes de produccion y cola de ensamblaje.</p>
      </header>

      <div className="feature-module__grid">
        <article className="feature-module__card"><h3>Ordenes de produccion</h3><p>Seguimiento de avance y estado.</p></article>
        <article className="feature-module__card"><h3>Cola de ensamblaje</h3><p>Priorizacion de tareas en planta.</p></article>
      </div>
    </section>
  );
};
