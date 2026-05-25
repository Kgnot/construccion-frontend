import { FeatureView } from '../../FeatureView';

export const ProcurementReceiveView = () => {
  return (
    <FeatureView
      title="Recepción de materiales"
      description="Registro y validación de materiales recibidos por orden."
      widgets={['Entradas recientes', 'Control de calidad', 'Diferencias detectadas']}
    />
  );
};
