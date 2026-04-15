import './HomeModule.css';

export const HomeModule = () => {
  return (
    <section className="feature-module home-module">
      <header className="feature-module__header">
        <p className="feature-module__eyebrow">Modulo</p>
        <h2>Inicio</h2>
        <p>Vista principal del sistema con acceso rapido a los modulos.</p>
      </header>

      <div className="feature-module__grid">
        <article className="feature-module__card">
          <h3>Resumen</h3>
          <p>KPIs y estado general del sistema.</p>
        </article>
        <article className="feature-module__card">
          <h3>Actividad reciente</h3>
          <p>Ultimas acciones realizadas en plataforma.</p>
        </article>
      </div>
    </section>
  );
};
