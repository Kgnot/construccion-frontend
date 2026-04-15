export const sidebarMenu = [
  {
    label: "Inicio",
    path: "/dashboard"
  },
  {
    label: "Compras",
    children: [
      { label: "Órdenes de compra", path: "/procurement/orders" },
      { label: "Proveedores", path: "/procurement/suppliers" },
      { label: "Recepción de materiales", path: "/procurement/receive" }
    ]
  },
  {
    label: "Inventario",
    children: [
      { label: "Materias primas", path: "/inventory/raw-materials" },
      { label: "Productos terminados", path: "/inventory/finished-goods" },
      { label: "Movimientos de stock", path: "/inventory/movements" }
    ]
  },
  {
    label: "Producción",
    children: [
      { label: "Órdenes de producción", path: "/production/orders" },
      { label: "Cola de ensamblaje", path: "/production/queue" }
    ]
  },
  {
    label: "Ventas",
    children: [
      { label: "Órdenes", path: "/sales/orders" },
      { label: "Pagos", path: "/sales/payments" }
    ]
  },
  {
    label: "Clientes",
    children: [
      { label: "Lista de clientes", path: "/customers/list" },
      { label: "Agregar cliente", path: "/customers/new" }
    ]
  },
  {
    label: "Gestión de dispositivos",
    children: [
      { label: "Dispositivos activos", path: "/devices/active" },
      { label: "Telemetría", path: "/devices/telemetry" }
    ]
  },
  {
    label: "Configuración",
    path: "/settings"
  }
];