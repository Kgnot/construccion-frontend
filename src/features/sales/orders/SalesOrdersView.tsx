import { FeatureView } from '../../FeatureView';

export const SalesOrdersView = () => {
  return (
    <FeatureView
      title="Órdenes de venta"
      description="Registro y control de órdenes comerciales en proceso."
      widgets={['Órdenes abiertas', 'Estado de entrega', 'Canales']}
    />
  );
};
