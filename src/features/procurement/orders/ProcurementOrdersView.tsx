import { FeatureView } from '../../FeatureView';

export const ProcurementOrdersView = () => {
  return (
    <FeatureView
      title="Órdenes de compra"
      description="Gestión de creación, seguimiento y estado de órdenes de compra."
      widgets={['Listado de órdenes', 'Estado de aprobación', 'Filtro por fecha']}
    />
  );
};
