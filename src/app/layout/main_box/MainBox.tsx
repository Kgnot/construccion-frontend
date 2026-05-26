import { HomeModule } from '../../../features/home/HomeModule'
import { ProcurementOrdersView } from '../../../features/procurement/orders/ProcurementOrdersView'
import { ProcurementSuppliersView } from '../../../features/procurement/suppliers/ProcurementSuppliersView'
import { ProcurementReceiveView } from '../../../features/procurement/receive/ProcurementReceiveView'
import { ProcurementModule } from '../../../features/procurement/ProcurementModule'
import { InventoryRawMaterialsView } from '../../../features/inventory/raw-materials/InventoryRawMaterialsView'
import { InventoryFinishedGoodsView } from '../../../features/inventory/finished-goods/InventoryFinishedGoodsView'
import { InventoryMovementsView } from '../../../features/inventory/movements/InventoryMovementsView'
import { InventoryModule } from '../../../features/inventory/InventoryModule'
import { ProductionOrdersView } from '../../../features/production/orders/ProductionOrdersView'
import { ProductionQueueView } from '../../../features/production/queue/ProductionQueueView'
import { ProductionModule } from '../../../features/production/ProductionModule'
import { SalesOrdersView } from '../../../features/sales/orders/SalesOrdersView'
import { SalesPaymentsView } from '../../../features/sales/payments/SalesPaymentsView'
import { SalesModule } from '../../../features/sales/SalesModule'
import { CustomerListView } from '../../../features/customer/list/CustomerListView'
import { CustomerNewView } from '../../../features/customer/new/CustomerNewView'
import { CustomerModule } from '../../../features/customer/CustomerModule'
import { DeviceTelemetryView } from '../../../features/device/telemetry/DeviceTelemetryView'
import { DeviceModule } from '../../../features/device/DeviceModule'
import { SettingsModule } from '../../../features/settings/SettingsModule'
import { ActiveDevicesTable } from '../../../features/device/active/ActiveDevicesTable'
import { LoginView } from '../../../features/auth/LoginView'
import { createBrowserRouter, useNavigate, Navigate } from 'react-router'
import { Layout } from '../Layout'
import { useApp } from '../../providers/AuthProvider'
import { useEffect } from 'react'


// Layout wrapper for authenticated pages
function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading || !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate("/dashboard");
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginView />,
  },
  {
    path: '/',
    element: <AuthLayout><Layout /></AuthLayout>,
    children: [
      { index: true, element: <Navigate to="home" replace /> },
      { path: 'home', element: <HomeModule /> },
      { path: 'procurement', element:<AdminLayout><ProcurementModule /></AdminLayout> },
      { path: 'procurement/orders', element: <AdminLayout><ProcurementOrdersView /></AdminLayout> },
      { path: 'procurement/suppliers', element: <AdminLayout><ProcurementSuppliersView /></AdminLayout> },
      { path: 'procurement/receive', element: <AdminLayout><ProcurementReceiveView /></AdminLayout> },
      { path: 'inventory', element: <AdminLayout><InventoryModule /></AdminLayout> },
      { path: 'inventory/raw-materials', element: <AdminLayout><InventoryRawMaterialsView /></AdminLayout> },
      { path: 'inventory/finished-goods', element: <AdminLayout><InventoryFinishedGoodsView /></AdminLayout> },
      { path: 'inventory/movements', element: <AdminLayout><InventoryMovementsView /></AdminLayout> },
      { path: 'production', element: <AdminLayout><ProductionModule /></AdminLayout> },
      { path: 'production/orders', element: <AdminLayout><ProductionOrdersView /></AdminLayout> },
      { path: 'production/queue', element: <AdminLayout><ProductionQueueView /></AdminLayout> },
      { path: 'sales', element: <AdminLayout><SalesModule /></AdminLayout> },
      { path: 'sales/orders', element: <AdminLayout><SalesOrdersView /></AdminLayout> },
      { path: 'sales/payments', element: <AdminLayout><SalesPaymentsView /></AdminLayout> },
      { path: 'customer', element: <AdminLayout><CustomerModule /></AdminLayout> },
      { path: 'customer/list', element: <AdminLayout><CustomerListView /></AdminLayout> },
      { path: 'customer/new', element: <AdminLayout><CustomerNewView /></AdminLayout> },
      { path: 'device', element: <AdminLayout><DeviceModule /></AdminLayout> },
      { path: 'device/active', element: <AdminLayout><ActiveDevicesTable /></AdminLayout> },
      { path: 'device/telemetry/:userId', element: <DeviceTelemetryView /> },
      { path: 'settings', element: <SettingsModule /> },
    ],
  },
]);

export { Layout };
