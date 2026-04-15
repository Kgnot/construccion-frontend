import './DeviceModule.css';

export const DeviceModule = () => {
  return (
    <section className="feature-module device-module">
      <header className="feature-module__header">
        <p className="feature-module__eyebrow">Modulo</p>
        <h2>Gestion de dispositivos</h2>
        <p>Vista principal para activos y telemetria de dispositivos.</p>
      </header>

      <div className="feature-module__grid">
        <article className="feature-module__card"><h3>Dispositivos activos</h3><p>Estado operativo de dispositivos.</p></article>
        <article className="feature-module__card"><h3>Telemetria</h3><p>Monitoreo de eventos y metricas.</p></article>
      </div>
    </section>
  );
};
