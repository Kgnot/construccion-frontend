
import { useState } from 'react';
import { TelemetryWidgetPanel } from './components/TelemetryWidgetPanel';
import { LipidsPage } from './components/LipidsPage';
import { MetabolicPage } from './components/MetabolicPage';
import { HematologyPage } from './components/HematologyPage';
import { ElectrolytesPage } from './components/ElectrolytesPage';
import { useLocation } from 'react-router';

export const DeviceTelemetryView = () => {
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>([]);

  // Se utiliza useLocation para obtener el userId pasado desde ActiveDevicesTable 
  // al navegar a esta vista. Si no se encuentra, se asigna un valor por defecto "user123".
  //Se utiliza el state para no mostrar el dato en la URL, por seguridad y limpieza.
  const location = useLocation();
  const {userId} = location.state || {};
  const currentUserId = userId || "user123";


  const toggleWidget = (widget: string) => {
    console.log('Toggling widget:', widget);

    if(!selectedWidgets.includes(widget)) 
      setSelectedWidgets((prev) => [...prev, widget]);
    else
      setSelectedWidgets((prev) => prev.filter((w) => w !== widget));

    console.log('Selected widgets after toggle:', selectedWidgets);
  }


  return (
    <TelemetryWidgetPanel
      title="Telemetría en tiempo real"
      description="Visualización datos médicos en tiempo real desde dispositivo conectado"
      backTo="/device/active"
      widgets={[
        { key: 'lipids', value: 'Datos Lipidos' },
        { key: 'metabolic', value: 'Datos Metabolicos' },
        { key: 'electrolytes', value: 'Datos Electrolitos' },
        { key: 'hematology', value: 'Datos Hematologicos' }
      ]}
      toggleWidget={toggleWidget}
      selectedWidgets={selectedWidgets}
    >
      {
        selectedWidgets.includes('lipids') && <LipidsPage userId={currentUserId} />
      }
      {
        selectedWidgets.includes('metabolic') && <MetabolicPage userId={currentUserId} />
      }
      {
        selectedWidgets.includes('hematology') && <HematologyPage userId={currentUserId} />
      }
      {
        selectedWidgets.includes('electrolytes') && <ElectrolytesPage userId={currentUserId} />
      }
    </TelemetryWidgetPanel>
  );


};