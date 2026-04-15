import { FeatureView } from '../../FeatureView';

export const ProductionOrdersView = () => {
  return (
    <FeatureView
      title="Órdenes de producción"
      description="Seguimiento de órdenes activas y su progreso en planta."
      widgets={['Órdenes activas', 'Prioridades', 'Tiempos estimados']}
    />
  );
};
