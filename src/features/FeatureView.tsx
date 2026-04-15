interface FeatureViewProps {
  title: string;
  description: string;
  widgets: string[];
}

export const FeatureView = ({ title, description, widgets }: FeatureViewProps) => {
  return (
    <section className="main-box__template">
      <header className="main-box__header">
        <p className="main-box__eyebrow">Vista activa</p>
        <h2>{title}</h2>
        <p>{description}</p>
      </header>

      <div className="main-box__grid">
        {widgets.map((widget) => (
          <article className="main-box__card" key={widget}>
            <h3>{widget}</h3>
            <p>Componente base de la vista, listo para integrar lógica real.</p>
          </article>
        ))}
      </div>
    </section>
  );
};
