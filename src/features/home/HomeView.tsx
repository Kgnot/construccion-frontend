import { FeatureView } from '../FeatureView';

export const HomeView = () => {
  return (
    <FeatureView
      title="Inicio"
      description="Resumen general del sistema y acceso rápido a los módulos principales."
      widgets={['Resumen', 'Actividad reciente', 'Pendientes']}
    />
  );
};
