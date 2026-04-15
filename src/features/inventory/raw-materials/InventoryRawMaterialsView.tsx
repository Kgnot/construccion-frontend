import { FeatureView } from '../../FeatureView';

export const InventoryRawMaterialsView = () => {
  return (
    <FeatureView
      title="Materias primas"
      description="Control de existencia, consumo y reposición de materias primas."
      widgets={['Stock actual', 'Alertas de mínimos', 'Rotación']}
    />
  );
};
