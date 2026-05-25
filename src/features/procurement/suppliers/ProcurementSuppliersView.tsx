import { FeatureView } from '../../FeatureView';

export const ProcurementSuppliersView = () => {
  return (
    <FeatureView
      title="Proveedores"
      description="Administración de proveedores, contactos y condiciones comerciales."
      widgets={['Directorio', 'Estado de proveedor', 'Rendimiento']}
    />
  );
};
