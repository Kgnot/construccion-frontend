import { useEffect, useMemo, useState, type FormEvent } from 'react';
import './ProcurementOrdersView.css';
import { Modal, ModalBackdrop } from '../../../shared/ui/modal';
import { getAllSuppliers, type Supplier } from '../../../shared/lib/supplierService';
import { createPurchaseOrder, getAllPurchaseOrders, type CreatePurchaseOrderRequest, type PurchaseOrder } from '../../../shared/lib/purchaseOrderService';

const PAGE_SIZE = 8;
const STATUS_OPTIONS = ['Todos', 'PENDING', 'APPROVED', 'RECEIVED', 'CANCELLED'] as const;

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobada',
  RECEIVED: 'Recibida',
  CANCELLED: 'Cancelada',
};

const getSupplierName = (supplier: Supplier | undefined, supplierId: string) =>
  supplier ? (supplier.displayName || supplier.companyName || supplier.legalName || supplierId) : supplierId;

const formatDate = (value?: string | null) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value || 0);

const getStatusClass = (status?: string) => {
  const normalized = (status || '').toUpperCase();
  if (normalized === 'APPROVED' || normalized === 'RECEIVED') return 'pov__badge--success';
  if (normalized === 'PENDING') return 'pov__badge--warning';
  if (normalized === 'CANCELLED') return 'pov__badge--danger';
  return 'pov__badge--neutral';
};

const getStatusLabel = (status?: string) => STATUS_LABELS[(status || '').toUpperCase()] || (status || '—');

type PurchaseOrderFormState = {
  orderNumber: string;
  supplierId: string;
  orderDate: string;
  expectedDeliveryDate: string;
  totalAmount: string;
  status: string;
  notes: string;
};

const INITIAL_FORM: PurchaseOrderFormState = {
  orderNumber: '',
  supplierId: '',
  orderDate: '',
  expectedDeliveryDate: '',
  totalAmount: '',
  status: 'PENDING',
  notes: '',
};

export const ProcurementOrdersView = () => {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_OPTIONS)[number]>('Todos');
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<PurchaseOrderFormState>(INITIAL_FORM);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [ordersResult, suppliersResult] = await Promise.allSettled([
        getAllPurchaseOrders(),
        getAllSuppliers(),
      ]);

      if (ordersResult.status === 'rejected') {
        console.error('Failed to load purchase orders:', ordersResult.reason);
        setOrders([]);
        setError('No se pudieron cargar las órdenes de compra. Verifica que el servidor esté corriendo.');
        return;
      }

      const sortedOrders = [...ordersResult.value].sort((a, b) => {
        const aDate = a.orderDate || a.createdAt || '';
        const bDate = b.orderDate || b.createdAt || '';
        return String(bDate).localeCompare(String(aDate));
      });
      setOrders(sortedOrders);

      if (suppliersResult.status === 'fulfilled') {
        setSuppliers(suppliersResult.value);
      }
    } catch (err) {
      console.error('Failed to load purchase orders:', err);
      setError('No se pudieron cargar las órdenes de compra. Verifica que el servidor esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedOrder(null);
        setCreateOpen(false);
        setFormError(null);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const supplierById = useMemo(
    () => new Map(suppliers.map((supplier) => [supplier.id, supplier])),
    [suppliers],
  );

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();

    return orders.filter((order) => {
      const supplierName = getSupplierName(supplierById.get(order.supplierId), order.supplierId);
      const matchesSearch = !query || [
        order.orderNumber,
        order.status,
        order.supplierId,
        supplierName,
        order.notes,
        String(order.totalAmount),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query);

      const matchesStatus = statusFilter === 'Todos' || order.status.toUpperCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter, supplierById]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const activeCount = orders.filter((order) => order.status.toUpperCase() !== 'CANCELLED').length;
  const approvedCount = orders.filter((order) => order.status.toUpperCase() === 'APPROVED').length;

  const openCreateModal = () => {
    setCreateOpen(true);
    setFormError(null);
  };

  const closeCreateModal = () => {
    setCreateOpen(false);
    setFormError(null);
    setForm(INITIAL_FORM);
  };

  const updateForm = (field: keyof PurchaseOrderFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormError(null);
  };

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.orderNumber.trim() || !form.supplierId.trim() || !form.orderDate.trim() || !form.expectedDeliveryDate.trim() || !form.totalAmount.trim()) {
      setFormError('Completa los campos mínimos: número, proveedor, fechas y valor total.');
      return;
    }

    const payload: CreatePurchaseOrderRequest = {
      orderNumber: form.orderNumber.trim(),
      supplierId: form.supplierId.trim(),
      orderDate: form.orderDate.trim(),
      expectedDeliveryDate: form.expectedDeliveryDate.trim(),
      totalAmount: Number(form.totalAmount),
      status: form.status.trim(),
      notes: form.notes.trim(),
    };

    if (Number.isNaN(payload.totalAmount)) {
      setFormError('El valor total debe ser numérico.');
      return;
    }

    try {
      setSaving(true);
      setFormError(null);
      await createPurchaseOrder(payload);
      await loadData();
      closeCreateModal();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al registrar la orden de compra';
      setFormError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="main-box__template pov">
      <header className="main-box__header">
        <p className="main-box__eyebrow">Compras</p>
        <h2>Órdenes de compra</h2>
        <p>Listado de órdenes conectado a <code>/api/v1/purchase-orders</code>, con detalle por proveedor y estado.</p>
      </header>

      {error && (
        <div className="pov__banner pov__banner--error" role="alert">
          {error}
        </div>
      )}

      <div className="pov__toolbar">
        <div className="pov__search-wrap">
          <span className="pov__search-icon" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            className="pov__search"
            placeholder="Buscar por orden, proveedor, estado o nota…"
            value={search}
            onChange={(event) => { setSearch(event.target.value); setPage(1); }}
            disabled={loading}
          />
        </div>

        <div className="pov__filters">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              type="button"
              className={`pov__filter-btn ${statusFilter === status ? 'is-active' : ''}`}
              onClick={() => { setStatusFilter(status); setPage(1); }}
              disabled={loading}
            >
              {status === 'Todos' ? 'Todos' : getStatusLabel(status)}
            </button>
          ))}
        </div>

        <div className="pov__actions">
          <button className="pov__primary-btn" type="button" onClick={openCreateModal} disabled={loading || saving}>
            + Agregar orden
          </button>
        </div>
      </div>

      <div className="pov__stats">
        <div className="pov__stat">
          <span className="pov__stat-value">{loading ? '...' : orders.length}</span>
          <span className="pov__stat-label">Total</span>
        </div>
        <div className="pov__stat">
          <span className="pov__stat-value">{loading ? '...' : filtered.length}</span>
          <span className="pov__stat-label">Resultados</span>
        </div>
        <div className="pov__stat">
          <span className="pov__stat-value">{loading ? '...' : activeCount}</span>
          <span className="pov__stat-label">Activas</span>
        </div>
        <div className="pov__stat">
          <span className="pov__stat-value">{loading ? '...' : approvedCount}</span>
          <span className="pov__stat-label">Aprobadas</span>
        </div>
      </div>

      <div className="pov__table-wrap">
        {loading ? (
          <div className="pov__empty">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <p>Cargando órdenes de compra...</p>
          </div>
        ) : paginated.length === 0 ? (
          <div className="pov__empty">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <p>No hay órdenes para mostrar con esos filtros.</p>
          </div>
        ) : (
          <table className="pov__table">
            <thead>
              <tr>
                <th>Orden</th>
                <th>Proveedor</th>
                <th>Fecha orden</th>
                <th>Entrega esperada</th>
                <th>Valor</th>
                <th>Estado</th>
                <th>Notas</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((order) => {
                const supplier = supplierById.get(order.supplierId);
                const supplierName = getSupplierName(supplier, order.supplierId);

                return (
                  <tr
                    key={order.id}
                    className="pov__row"
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedOrder(order)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setSelectedOrder(order);
                      }
                    }}
                  >
                    <td>
                      <div className="pov__order-cell">
                        <span className="pov__order-number">{order.orderNumber}</span>
                        <span className="pov__order-id">{order.purchaseOrderId}</span>
                      </div>
                    </td>
                    <td>
                      <div className="pov__supplier-cell">
                        <span className="pov__supplier-name">{supplierName}</span>
                        <span className="pov__supplier-id">{order.supplierId}</span>
                      </div>
                    </td>
                    <td className="pov__muted">{formatDate(order.orderDate)}</td>
                    <td className="pov__muted">{formatDate(order.expectedDeliveryDate)}</td>
                    <td className="pov__amount">{formatCurrency(order.totalAmount)}</td>
                    <td>
                      <span className={`pov__badge ${getStatusClass(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="pov__notes">{order.notes ? order.notes : '—'}</td>
                    <td className="pov__actions-cell">
                      <button
                        className="pov__row-btn"
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedOrder(order);
                        }}
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {!loading && totalPages > 1 && (
        <div className="pov__pagination">
          <span className="pov__pagination-info">
            Página {safePage} de {totalPages} · {filtered.length} registros
          </span>
          <div className="pov__pagination-controls">
            <button className="pov__page-btn" type="button" disabled={safePage === 1} onClick={() => setPage(1)}>«</button>
            <button className="pov__page-btn" type="button" disabled={safePage === 1} onClick={() => setPage((current) => current - 1)}>‹</button>
            {Array.from({ length: totalPages }, (_, index) => index + 1)
              .filter((n) => Math.abs(n - safePage) <= 1 || n === 1 || n === totalPages)
              .reduce<(number | '…')[]>((acc, n, index, arr) => {
                if (index > 0 && n - Number(arr[index - 1]) > 1) acc.push('…');
                acc.push(n);
                return acc;
              }, [])
              .map((n) => (
                n === '…' ? (
                  <span key={`ellipsis-${safePage}-${totalPages}`} className="pov__page-ellipsis">…</span>
                ) : (
                  <button
                    key={n}
                    className={`pov__page-btn ${n === safePage ? 'is-current' : ''}`}
                    type="button"
                    onClick={() => setPage(Number(n))}
                  >
                    {n}
                  </button>
                )
              ))}
            <button className="pov__page-btn" type="button" disabled={safePage === totalPages} onClick={() => setPage((current) => current + 1)}>›</button>
            <button className="pov__page-btn" type="button" disabled={safePage === totalPages} onClick={() => setPage(totalPages)}>»</button>
          </div>
        </div>
      )}

      {selectedOrder && (
        <ModalBackdrop phase="open" onClick={() => setSelectedOrder(null)}>
          <Modal ariaLabel="Detalle de orden de compra" className="pov__modal" phase="open" onClick={(event) => event.stopPropagation()}>
            <div className="pov__modal-shell">
              <div className="pov__modal-header">
                <div>
                  <p className="pov__modal-eyebrow">Orden seleccionada</p>
                  <h3 className="pov__modal-title">{selectedOrder.orderNumber}</h3>
                  <p className="pov__modal-subtitle">ID {selectedOrder.purchaseOrderId}</p>
                </div>
                <button className="pov__modal-close" type="button" onClick={() => setSelectedOrder(null)} aria-label="Cerrar">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="pov__detail-hero">
                <div className="pov__detail-brand">
                  <div className="pov__detail-badge">PO</div>
                  <div>
                    <span className={`pov__badge ${getStatusClass(selectedOrder.status)}`}>
                      {getStatusLabel(selectedOrder.status)}
                    </span>
                    <p className="pov__detail-supplier">{getSupplierName(supplierById.get(selectedOrder.supplierId), selectedOrder.supplierId)}</p>
                  </div>
                </div>
                <div className="pov__detail-total">
                  <span>Total</span>
                  <strong>{formatCurrency(selectedOrder.totalAmount)}</strong>
                </div>
              </div>

              <div className="pov__detail-grid">
                <article className="pov__detail-card">
                  <span className="pov__detail-label">Proveedor</span>
                  <strong>{getSupplierName(supplierById.get(selectedOrder.supplierId), selectedOrder.supplierId)}</strong>
                  <p>ID: {selectedOrder.supplierId}</p>
                </article>

                <article className="pov__detail-card">
                  <span className="pov__detail-label">Fechas</span>
                  <strong>Orden: {formatDate(selectedOrder.orderDate)}</strong>
                  <p>Entrega esperada: {formatDate(selectedOrder.expectedDeliveryDate)}</p>
                  <p>Actualizada: {formatDate(selectedOrder.updatedAt)}</p>
                </article>

                <article className="pov__detail-card">
                  <span className="pov__detail-label">Creación</span>
                  <strong>{formatDate(selectedOrder.createdAt)}</strong>
                  <p>Número interno: {selectedOrder.purchaseOrderId}</p>
                </article>

                <article className="pov__detail-card pov__detail-card--wide">
                  <span className="pov__detail-label">Notas</span>
                  <p>{selectedOrder.notes || 'Sin observaciones registradas.'}</p>
                </article>
              </div>

              <div className="pov__modal-actions pov__modal-actions--detail">
                <button className="pov__primary-btn" type="button" onClick={() => setSelectedOrder(null)}>
                  Cerrar
                </button>
              </div>
            </div>
          </Modal>
        </ModalBackdrop>
      )}

      {createOpen && (
        <ModalBackdrop phase="open" onClick={closeCreateModal}>
          <Modal ariaLabel="Agregar orden de compra" className="pov__modal pov__modal--create" phase="open" onClick={(event) => event.stopPropagation()}>
            <div className="pov__modal-shell">
              <div className="pov__modal-header">
                <div>
                  <p className="pov__modal-eyebrow">Nueva orden</p>
                  <h3 className="pov__modal-title">Agregar orden de compra</h3>
                  <p className="pov__modal-subtitle">Selecciona el proveedor y completa los datos requeridos por el backend.</p>
                </div>
                <button className="pov__modal-close" type="button" onClick={closeCreateModal} aria-label="Cerrar">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {formError && (
                <div className="pov__banner pov__banner--error" role="alert">
                  {formError}
                </div>
              )}

              <form className="pov__form" onSubmit={handleCreate}>
                <div className="pov__form-grid">
                  <div className="pov__field pov__field--wide">
                    <label className="pov__label">Número de orden <span className="pov__req">*</span></label>
                    <input className="pov__input" value={form.orderNumber} onChange={(event) => updateForm('orderNumber', event.target.value)} placeholder="Ej. PO-2026-0005" disabled={saving} />
                  </div>

                  <div className="pov__field pov__field--wide">
                    <label className="pov__label">Proveedor <span className="pov__req">*</span></label>
                    <select className="pov__input" value={form.supplierId} onChange={(event) => updateForm('supplierId', event.target.value)} disabled={saving}>
                      <option value="">Selecciona un proveedor</option>
                      {suppliers.map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>{supplier.displayName || supplier.companyName || supplier.legalName || supplier.id}</option>
                      ))}
                    </select>
                  </div>

                  <div className="pov__field">
                    <label className="pov__label">Fecha de orden <span className="pov__req">*</span></label>
                    <input className="pov__input" type="date" value={form.orderDate} onChange={(event) => updateForm('orderDate', event.target.value)} disabled={saving} />
                  </div>

                  <div className="pov__field">
                    <label className="pov__label">Fecha estimada de entrega <span className="pov__req">*</span></label>
                    <input className="pov__input" type="date" value={form.expectedDeliveryDate} onChange={(event) => updateForm('expectedDeliveryDate', event.target.value)} disabled={saving} />
                  </div>

                  <div className="pov__field">
                    <label className="pov__label">Valor total <span className="pov__req">*</span></label>
                    <input className="pov__input" type="number" min="0" step="1" value={form.totalAmount} onChange={(event) => updateForm('totalAmount', event.target.value)} placeholder="Ej. 18500000" disabled={saving} />
                  </div>

                  <div className="pov__field">
                    <label className="pov__label">Estado</label>
                    <select className="pov__input" value={form.status} onChange={(event) => updateForm('status', event.target.value)} disabled={saving}>
                      {STATUS_OPTIONS.filter((status) => status !== 'Todos').map((status) => (
                        <option key={status} value={status}>{getStatusLabel(status)}</option>
                      ))}
                    </select>
                  </div>

                  <div className="pov__field pov__field--wide">
                    <label className="pov__label">Notas</label>
                    <textarea className="pov__input pov__textarea" rows={4} value={form.notes} onChange={(event) => updateForm('notes', event.target.value)} placeholder="Ej. Compra inicial de equipos médicos" disabled={saving} />
                  </div>
                </div>

                <div className="pov__modal-actions">
                  <button className="pov__ghost-btn" type="button" onClick={closeCreateModal} disabled={saving}>Cancelar</button>
                  <button className="pov__primary-btn" type="submit" disabled={saving}>{saving ? 'Guardando…' : 'Guardar orden'}</button>
                </div>
              </form>
            </div>
          </Modal>
        </ModalBackdrop>
      )}
    </section>
  );
};
