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
import { createBrowserRouter } from 'react-router'
import { Layout } from '../Layout'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomeModule /> },
      { path: 'procurement', element: <ProcurementModule /> },
      { path: 'procurement/orders', element: <ProcurementOrdersView /> },
      { path: 'procurement/suppliers', element: <ProcurementSuppliersView /> },
      { path: 'procurement/receive', element: <ProcurementReceiveView /> },
      { path: 'inventory', element: <InventoryModule /> },
      { path: 'inventory/raw-materials', element: <InventoryRawMaterialsView /> },
      { path: 'inventory/finished-goods', element: <InventoryFinishedGoodsView /> },
      { path: 'inventory/movements', element: <InventoryMovementsView /> },
      { path: 'production', element: <ProductionModule /> },
      { path: 'production/orders', element: <ProductionOrdersView /> },
      { path: 'production/queue', element: <ProductionQueueView /> },
      { path: 'sales', element: <SalesModule /> },
      { path: 'sales/orders', element: <SalesOrdersView /> },
      { path: 'sales/payments', element: <SalesPaymentsView /> },
      { path: 'customer', element: <CustomerModule /> },
      { path: 'customer/list', element: <CustomerListView /> },
      { path: 'customer/new', element: <CustomerNewView /> },
      { path: 'device', element: <DeviceModule /> },
      { path: 'device/active', element: <ActiveDevicesTable /> },
      { path: 'device/telemetry', element: <DeviceTelemetryView /> },
      { path: 'settings', element: <SettingsModule /> },
    ],
  },
]);

export { Layout };
