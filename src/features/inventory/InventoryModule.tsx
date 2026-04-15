import './InventoryModule.css';

export const InventoryModule = () => {
  return (
    <section className="feature-module inventory-module">
      <header className="feature-module__header">
        <p className="feature-module__eyebrow">Modulo</p>
        <h2>Inventario</h2>
        <p>Vista principal para materias primas, terminados y movimientos.</p>
      </header>

      <div className="feature-module__grid">
        <article className="feature-module__card"><h3>Materias primas</h3><p>Control de stock base.</p></article>
        <article className="feature-module__card"><h3>Productos terminados</h3><p>Disponibilidad para despacho.</p></article>
        <article className="feature-module__card"><h3>Movimientos</h3><p>Entradas, salidas y ajustes.</p></article>
      </div>
    </section>
  );
};
