import { FeatureView } from '../FeatureView';

export const SettingsView = () => {
  return (
    <FeatureView
      title="Configuración"
      description="Preferencias globales, parámetros operativos y ajustes de cuenta."
      widgets={['Perfil', 'Preferencias', 'Seguridad']}
    />
  );
};
