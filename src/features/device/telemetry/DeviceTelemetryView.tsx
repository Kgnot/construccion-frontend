import { useEffect, useState } from 'react';
import { TelemetryWidgetPanel } from './components/TelemetryWidgetPanel';
import { LipidsPage } from './components/LipidsPage';
import { MetabolicPage } from './components/MetabolicPage';
import { HematologyPage } from './components/HematologyPage';
import { ElectrolytesPage } from './components/ElectrolytesPage';
import { useLocation } from 'react-router';
import { getCustomerById } from '../../../shared/lib/customerService';

const ALL_WIDGETS = [
  { key: 'lipids', value: 'Datos Lípidos' },
  { key: 'metabolic', value: 'Datos Metabólicos' },
  { key: 'electrolytes', value: 'Datos Electrolitos' },
  { key: 'hematology', value: 'Datos Hematológicos' },
] as const;

const DEVICE_TYPE_WIDGETS: Record<string, string[]> = {
  LIPID: ['lipids'],
  ELECTROLYTE: ['electrolytes'],
  METABOLIC: ['metabolic'],
  BLOOD_COUNT: ['hematology'],
  MEDICAL: ['metabolic', 'lipids', 'electrolytes', 'hematology'],
  CARDIOMETABOLIC: ['metabolic', 'lipids'],
  RENAL: ['metabolic', 'electrolytes'],
  HEMATOMETABOLIC: ['metabolic', 'hematology'],
  LIPID_ELECTROLYTE: ['lipids', 'electrolytes'],
  LIPID_HEMATOLOGY: ['lipids', 'hematology'],
  ELECTROLYTE_HEMATOLOGY: ['electrolytes', 'hematology'],
  METABOLIC_COMPREHENSIVE: ['metabolic', 'lipids', 'electrolytes'],
  CARDIO_HEMATOLOGY: ['metabolic', 'lipids', 'hematology'],
  RENAL_HEMATOLOGY: ['metabolic', 'electrolytes', 'hematology'],
  ELECTRO_LIPID_HEMATOLOGY: ['lipids', 'electrolytes', 'hematology'],
};

export const DeviceTelemetryView = () => {
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>([]);
  const [customerName, setCustomerName] = useState<string>('');
  const [deviceType, setDeviceType] = useState<string>('');

  const location = useLocation();
  const { userId, deviceType: dt } = location.state || {};
  const currentUserId = userId || 'user123';

  const relevantKeys = DEVICE_TYPE_WIDGETS[dt] || [];
  const widgets = ALL_WIDGETS.filter((w) => relevantKeys.includes(w.key));

  const fetchCustomerName = async (userId: string) => {
    try {
      const customer = await getCustomerById(userId);
      setCustomerName(
        customer?.firstName && customer?.lastName
          ? `${customer.firstName} ${customer.lastName}`
          : 'Desconocido'
      );
    } catch (error) {
      console.error('Error fetching customer name:', error);
      setCustomerName('Desconocido');
    }
  };

  useEffect(() => {
    fetchCustomerName(currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    if (dt) {
      setDeviceType(dt);
      setSelectedWidgets(relevantKeys);
    }
  }, [dt]);

  const toggleWidget = (widget: string) => {
    setSelectedWidgets((prev) =>
      prev.includes(widget)
        ? prev.filter((w) => w !== widget)
        : [...prev, widget]
    );
  };

  return (
    <TelemetryWidgetPanel
      title="Telemetría en tiempo real"
      description={deviceType ? `Tipo: ${deviceType}` : 'Visualización datos médicos en tiempo real desde dispositivo conectado'}
      backTo="/device/active"
      userId={customerName}
      widgets={widgets}
      toggleWidget={toggleWidget}
      selectedWidgets={selectedWidgets}
    >
      {selectedWidgets.includes('lipids') && <LipidsPage userId={currentUserId} />}
      {selectedWidgets.includes('metabolic') && <MetabolicPage userId={currentUserId} />}
      {selectedWidgets.includes('hematology') && <HematologyPage userId={currentUserId} />}
      {selectedWidgets.includes('electrolytes') && <ElectrolytesPage userId={currentUserId} />}
    </TelemetryWidgetPanel>
  );
};
