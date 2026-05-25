import { useNavigate } from 'react-router';

interface TelemetryWidgetPanelProps {
  title: string;
  description: string;
  selectedWidgets: string[];
  widgets: { key: string; value: string }[];
  toggleWidget?: (widget: string) => void;
  backTo?: string;
  userId?: string;
  children?: React.ReactNode;
}

export const TelemetryWidgetPanel = ({
  title,
  description,
  selectedWidgets = [],
  widgets,
  toggleWidget,
  backTo,
  userId,
  children,
}: TelemetryWidgetPanelProps) => {
  const navigate = useNavigate();
  const handleWidgetClick = (widgetKey: string) => {
    if (toggleWidget) toggleWidget(widgetKey);
  };

  return (
    <section className="main-box__template">
      <header className="main-box__header">
        <p className="main-box__eyebrow">Vista activa</p>
        <h2>{title}</h2>
        <p>{description}</p>
        {userId && (
          <span className="telemetry_user_badge">
            Dispositivo: {userId}
          </span>
        )}
        {backTo && (
          <button className="btn_back_active" onClick={() => navigate(backTo)}>
            ← Dispositivos activos
          </button>
        )}
      </header>
      <div className="main-box__content">
        <aside className="main-box__widgets">
          <div className="feature_module__widgets">
            {widgets.map((widget) => (
              <article
                className={`main-box__card ${selectedWidgets.includes(widget.key) ? 'selected' : ''}`}
                key={widget.key}
                onClick={() => handleWidgetClick(widget.key)}
              >
                <h3>{widget.value}</h3>
              </article>
            ))}
          </div>
        </aside>

        <div className="main-box__panel">{children}</div>
      </div>
    </section>
  );
};
