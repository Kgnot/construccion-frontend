export const sidebarMenu = [
  {
    label: "Inicio",
    icon: "home",
    path: "/dashboard"
  },
  {
    label: "Compras",
    icon: "shopping-cart",
    children: [
      { label: "Órdenes de compra", path: "/procurement/orders" },
      { label: "Proveedores", path: "/procurement/suppliers" },
      { label: "Recepción de materiales", path: "/procurement/receive" }
    ]
  },
  {
    label: "Inventario",
    icon: "package",
    children: [
      { label: "Materias primas", path: "/inventory/raw-materials" },
      { label: "Productos terminados", path: "/inventory/finished-goods" },
      { label: "Movimientos de stock", path: "/inventory/movements" }
    ]
  },
  {
    label: "Producción",
    icon: "settings",
    children: [
      { label: "Órdenes de producción", path: "/production/orders" },
      { label: "Cola de ensamblaje", path: "/production/queue" }
    ]
  },
  {
    label: "Ventas",
    icon: "trending-up",
    children: [
      { label: "Órdenes", path: "/sales/orders" },
      { label: "Pagos", path: "/sales/payments" }
    ]
  },
  {
    label: "Clientes",
    icon: "users",
    children: [
      { label: "Lista de clientes", path: "/customers/list" },
      { label: "Agregar cliente", path: "/customers/new" }
    ]
  },
  {
    label: "Gestión de dispositivos",
    icon: "zap",
    children: [
      { label: "Dispositivos activos", path: "/devices/active" },
      { label: "Telemetría", path: "/devices/telemetry" }
    ]
  },
  {
    label: "Configuración",
    icon: "sliders",
    path: "/settings"
  }
];