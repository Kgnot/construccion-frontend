import { useEffect, useState } from 'react';
import { TelemetryWidgetPanel } from './components/TelemetryWidgetPanel';
import { LipidsPage } from './components/LipidsPage';
import { MetabolicPage } from './components/MetabolicPage';
import { HematologyPage } from './components/HematologyPage';
import { ElectrolytesPage } from './components/ElectrolytesPage';
import { useParams } from 'react-router';
import { getCustomerById } from '../../../shared/lib/customerService';
import { useApp } from '../../../app/providers/AuthProvider';
import type { Product } from '../../../shared/lib/inventoryService';
import { GetProductByUserIdUseCase } from './GetProductByUserIdUseCase';
import './telemetry.css';

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
  const [product, setProduct] = useState<Product | null>(null);
  const [deviceTypeFromProduct, setDeviceTypeFromProduct] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [productNotFound, setProductNotFound] = useState(false);

  const { userId: paramUserId } = useParams();
  const { user, isAdmin } = useApp();
  const currentUserId = paramUserId || user?.id || 'user123';

  const relevantKeys = DEVICE_TYPE_WIDGETS[deviceTypeFromProduct] || DEVICE_TYPE_WIDGETS.MEDICAL;
  const widgets = ALL_WIDGETS.filter((w) => relevantKeys.includes(w.key));
  const isDeactivated = product?.status?.toUpperCase() === 'DEACTIVATE';

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setProductNotFound(false);
      try {
        const [customer] = await Promise.allSettled([
          getCustomerById(currentUserId),
        ]);
        if (customer.status === 'fulfilled' && customer.value) {
          const c = customer.value;
          setCustomerName(
            c.firstName && c.lastName
              ? `${c.firstName} ${c.lastName}`
              : 'Desconocido'
          );
        }
        const prod = await GetProductByUserIdUseCase(currentUserId);
        if (!prod) {
          setProductNotFound(true);
        } else {
          setProduct(prod);
        }
      } catch (error) {
        console.error('Error loading:', error);
        setProductNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [currentUserId]);

  useEffect(() => {
    if (product?.deviceType) {
      setDeviceTypeFromProduct(product.deviceType);
      setSelectedWidgets(
        DEVICE_TYPE_WIDGETS[product.deviceType] || DEVICE_TYPE_WIDGETS.MEDICAL
      );
    }
  }, [product]);

  const toggleWidget = (widget: string) => {
    setSelectedWidgets((prev) =>
      prev.includes(widget)
        ? prev.filter((w) => w !== widget)
        : [...prev, widget]
    );
  };

  if (loading) {
    return (
      <div className="telemetry_placeholder">
        <span className="telemetry_spinner" />
        <p>Cargando telemetría...</p>
      </div>
    );
  }

  if (productNotFound) {
    return (
      <div className="telemetry_placeholder">
        <h3>Sin dispositivo asociado</h3>
        <p>No se encontró un producto médico vinculado a este usuario.</p>
      </div>
    );
  }

  return (
    <TelemetryWidgetPanel
      title="Telemetría en tiempo real"
      description={
        deviceTypeFromProduct
          ? `Tipo: ${deviceTypeFromProduct}`
          : 'Visualización datos médicos en tiempo real desde dispositivo conectado'
      }
      backTo={isAdmin && deviceTypeFromProduct ? '/device/active' : undefined}
      userId={customerName}
      widgets={widgets}
      toggleWidget={toggleWidget}
      selectedWidgets={selectedWidgets}
      disabled={isDeactivated}
    >
      {!isDeactivated && selectedWidgets.includes('lipids') && <LipidsPage userId={currentUserId} />}
      {!isDeactivated && selectedWidgets.includes('metabolic') && <MetabolicPage userId={currentUserId} />}
      {!isDeactivated && selectedWidgets.includes('hematology') && <HematologyPage userId={currentUserId} />}
      {!isDeactivated && selectedWidgets.includes('electrolytes') && <ElectrolytesPage userId={currentUserId} />}
    </TelemetryWidgetPanel>
  );
};
