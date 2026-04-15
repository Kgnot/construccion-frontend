import { FeatureView } from '../../FeatureView';

export const DeviceActiveView = () => {
  return (
    <FeatureView
      title="Dispositivos activos"
      description="Listado de dispositivos operativos y su estado en tiempo real."
      widgets={['Estado actual', 'Última conexión', 'Asignación']}
    />
  );
};
