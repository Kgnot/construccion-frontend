import type { ClassNameProp } from '../../../shared/ui/className/ClassNameProp'
import { HomeView } from '../../../features/home/HomeView'
import { ProcurementOrdersView } from '../../../features/procurement/orders/ProcurementOrdersView'
import { ProcurementSuppliersView } from '../../../features/procurement/suppliers/ProcurementSuppliersView'
import { ProcurementReceiveView } from '../../../features/procurement/receive/ProcurementReceiveView'
import { InventoryRawMaterialsView } from '../../../features/inventory/raw-materials/InventoryRawMaterialsView'
import { InventoryFinishedGoodsView } from '../../../features/inventory/finished-goods/InventoryFinishedGoodsView'
import { InventoryMovementsView } from '../../../features/inventory/movements/InventoryMovementsView'
import { ProductionOrdersView } from '../../../features/production/orders/ProductionOrdersView'
import { ProductionQueueView } from '../../../features/production/queue/ProductionQueueView'
import { SalesOrdersView } from '../../../features/sales/orders/SalesOrdersView'
import { SalesPaymentsView } from '../../../features/sales/payments/SalesPaymentsView'
import { CustomerListView } from '../../../features/customer/list/CustomerListView'
import { CustomerNewView } from '../../../features/customer/new/CustomerNewView'
import { DeviceActiveView } from '../../../features/device/active/DeviceActiveView'
import { DeviceTelemetryView } from '../../../features/device/telemetry/DeviceTelemetryView'
import { SettingsView } from '../../../features/settings/SettingsView'
import './MainBox.css'
// import { TelemetryWsMockPanel } from './mock/TelemetryWsMockPanel'

interface MainBoxProps extends ClassNameProp {
    activePath: string
    children?: React.ReactNode
}

const featureViewByPath: Record<string, React.ReactNode> = {
    '/home': <HomeView />,
    '/procurement/orders': <ProcurementOrdersView />,
    '/procurement/suppliers': <ProcurementSuppliersView />,
    '/procurement/receive': <ProcurementReceiveView />,
    '/inventory/raw-materials': <InventoryRawMaterialsView />,
    '/inventory/finished-goods': <InventoryFinishedGoodsView />,
    '/inventory/movements': <InventoryMovementsView />,
    '/production/orders': <ProductionOrdersView />,
    '/production/queue': <ProductionQueueView />,
    '/sales/orders': <SalesOrdersView />,
    '/sales/payments': <SalesPaymentsView />,
    '/customer/list': <CustomerListView />,
    '/customer/new': <CustomerNewView />,
    '/device/active': <DeviceActiveView />,
    '/device/telemetry': <DeviceTelemetryView />,
    '/settings': <SettingsView />,
}

export const MainBox = ({ className, children, activePath }: MainBoxProps) => {
    const activeView = featureViewByPath[activePath] ?? <HomeView />

    return (
        <>
            <main className={`main-box ${className}`}>
                {/* <TelemetryWsMockPanel /> */}
                {activeView}

                {children}

            </main>
        </>
    )
}