import { FeatureView } from '../../FeatureView';

export const InventoryMovementsView = () => {
  return (
    <FeatureView
      title="Movimientos de stock"
      description="Historial de entradas, salidas y ajustes de inventario."
      widgets={['Últimos movimientos', 'Tipos de movimiento', 'Trazabilidad']}
    />
  );
};
