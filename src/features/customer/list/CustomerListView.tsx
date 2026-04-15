import { FeatureView } from '../../FeatureView';

export const CustomerListView = () => {
  return (
    <FeatureView
      title="Lista de clientes"
      description="Vista principal de clientes registrados y su estado comercial."
      widgets={['Tabla de clientes', 'Segmentos', 'Búsqueda']}
    />
  );
};
