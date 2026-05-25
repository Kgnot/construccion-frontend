import { FeatureView } from '../../FeatureView';

export const ProductionQueueView = () => {
  return (
    <FeatureView
      title="Cola de ensamblaje"
      description="Vista de cola de trabajo para estaciones de producción."
      widgets={['Trabajo pendiente', 'Secuencia', 'Cuellos de botella']}
    />
  );
};
