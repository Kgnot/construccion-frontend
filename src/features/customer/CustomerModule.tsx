import './CustomerModule.css';

export const CustomerModule = () => {
  return (
    <section className="feature-module customer-module">
      <header className="feature-module__header">
        <p className="feature-module__eyebrow">Modulo</p>
        <h2>Clientes</h2>
        <p>Vista principal para navegar entre listado y registro de clientes.</p>
      </header>

      <div className="feature-module__grid">
        <article className="feature-module__card"><h3>Lista de clientes</h3><p>Consulta de clientes registrados.</p></article>
        <article className="feature-module__card"><h3>Agregar cliente</h3><p>Alta de nuevos clientes.</p></article>
      </div>
    </section>
  );
};
