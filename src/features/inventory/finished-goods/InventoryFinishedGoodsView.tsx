import { FeatureView } from '../../FeatureView';

export const InventoryFinishedGoodsView = () => {
  return (
    <FeatureView
      title="Productos terminados"
      description="Seguimiento de inventario final disponible para despacho y venta."
      widgets={['Disponibilidad', 'Lotes recientes', 'Proyección de salida']}
    />
  );
};
