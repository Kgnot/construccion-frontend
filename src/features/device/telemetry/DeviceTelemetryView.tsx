import { FeatureView } from '../../FeatureView';

export const DeviceTelemetryView = () => {
  return (
    <FeatureView
      title="Telemetría"
      description="Panel base para visualización de métricas emitidas por dispositivos."
      widgets={['Señales en vivo', 'Histórico', 'Alertas']}
    />
  );
};
