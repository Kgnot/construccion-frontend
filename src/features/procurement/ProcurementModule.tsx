import './ProcurementModule.css';

export const ProcurementModule = () => {
  return (
    <section className="feature-module procurement-module">
      <header className="feature-module__header">
        <p className="feature-module__eyebrow">Modulo</p>
        <h2>Compras</h2>
        <p>Vista principal para navegar entre ordenes, proveedores y recepcion.</p>
      </header>

      <div className="feature-module__grid">
        <article className="feature-module__card"><h3>Ordenes de compra</h3><p>Control de ciclo de compra.</p></article>
        <article className="feature-module__card"><h3>Proveedores</h3><p>Gestion de proveedores y contacto.</p></article>
        <article className="feature-module__card"><h3>Recepcion</h3><p>Registro de ingresos de materiales.</p></article>
      </div>
    </section>
  );
};
