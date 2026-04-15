import { FeatureView } from '../../FeatureView';

export const CustomerNewView = () => {
  return (
    <FeatureView
      title="Agregar cliente"
      description="Formulario base para creación de nuevos clientes en el sistema."
      widgets={['Datos generales', 'Contacto', 'Condiciones comerciales']}
    />
  );
};
