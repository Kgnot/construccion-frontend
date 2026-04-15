import type { ClassNameProp } from '../../../shared/ui/className/ClassNameProp'
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
import { DeviceActiveView } from '../../../features/device/active/DeviceActiveView'
import { DeviceTelemetryView } from '../../../features/device/telemetry/DeviceTelemetryView'
import { DeviceModule } from '../../../features/device/DeviceModule'
import { SettingsModule } from '../../../features/settings/SettingsModule'
import './MainBox.css'
// import { TelemetryWsMockPanel } from './mock/TelemetryWsMockPanel'

interface MainBoxProps extends ClassNameProp {
    activePath: string
    children?: React.ReactNode
}

const featureViewByPath: Record<string, React.ReactNode> = {
    '/home': <HomeModule />,
    '/procurement': <ProcurementModule />,
    '/procurement/orders': <ProcurementOrdersView />,
    '/procurement/suppliers': <ProcurementSuppliersView />,
    '/procurement/receive': <ProcurementReceiveView />,
    '/inventory': <InventoryModule />,
    '/inventory/raw-materials': <InventoryRawMaterialsView />,
    '/inventory/finished-goods': <InventoryFinishedGoodsView />,
    '/inventory/movements': <InventoryMovementsView />,
    '/production': <ProductionModule />,
    '/production/orders': <ProductionOrdersView />,
    '/production/queue': <ProductionQueueView />,
    '/sales': <SalesModule />,
    '/sales/orders': <SalesOrdersView />,
    '/sales/payments': <SalesPaymentsView />,
    '/customer': <CustomerModule />,
    '/customer/list': <CustomerListView />,
    '/customer/new': <CustomerNewView />,
    '/device': <DeviceModule />,
    '/device/active': <DeviceActiveView />,
    '/device/telemetry': <DeviceTelemetryView />,
    '/settings': <SettingsModule />,
}

export const MainBox = ({ className, children, activePath }: MainBoxProps) => {
    const activeView = featureViewByPath[activePath] ?? <HomeModule />

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