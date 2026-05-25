import './SettingsModule.css';

export const SettingsModule = () => {
  return (
    <section className="feature-module settings-module">
      <header className="feature-module__header">
        <p className="feature-module__eyebrow">Modulo</p>
        <h2>Configuracion</h2>
        <p>Vista principal para ajustes de cuenta y preferencias del sistema.</p>
      </header>

      <div className="feature-module__grid">
        <article className="feature-module__card"><h3>Perfil</h3><p>Datos de usuario y seguridad.</p></article>
        <article className="feature-module__card"><h3>Preferencias</h3><p>Ajustes de interfaz y uso.</p></article>
      </div>
    </section>
  );
};
