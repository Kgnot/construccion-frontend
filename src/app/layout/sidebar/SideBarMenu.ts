export const sidebarMenu = [
  {
    label: "Inicio",
    icon: "home",
    path: "/home"
  },
  {
    label: "Compras",
    icon: "shopping-cart",
    path: "/procurement",
    children: [
      { label: "Órdenes de compra", path: "/procurement/orders" },
      { label: "Proveedores", path: "/procurement/suppliers" },
      { label: "Recepción de materiales", path: "/procurement/receive" }
    ]
  },
  {
    label: "Inventario",
    icon: "package",
    path: "/inventory",
    children: [
      { label: "Materias primas", path: "/inventory/raw-materials" },
      { label: "Productos terminados", path: "/inventory/finished-goods" },
      { label: "Movimientos de stock", path: "/inventory/movements" }
    ]
  },
  {
    label: "Producción",
    icon: "settings",
    path: "/production",
    children: [
      { label: "Órdenes de producción", path: "/production/orders" },
      { label: "Cola de ensamblaje", path: "/production/queue" }
    ]
  },
  {
    label: "Ventas",
    icon: "trending-up",
    path: "/sales",
    children: [
      { label: "Órdenes", path: "/sales/orders" },
      { label: "Pagos", path: "/sales/payments" }
    ]
  },
  {
    label: "Clientes",
    icon: "users",
    path: "/customer",
    children: [
      { label: "Lista de clientes", path: "/customer/list" },
      { label: "Agregar cliente", path: "/customer/new" }
    ]
  },
  {
    label: "Gestión de dispositivos",
    icon: "zap",
    path: "/device",
    children: [
      { label: "Dispositivos activos", path: "/device/active" },
      { label: "Telemetría", path: "/device/telemetry" }
    ]
  },
  {
    label: "Configuración",
    icon: "sliders",
    path: "/settings"
  }
];