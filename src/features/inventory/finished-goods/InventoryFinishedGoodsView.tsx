import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import './InventoryFinishedGoodsView.css';
import { getAllProducts, activateProduct, deactivateProduct } from '../../../shared/lib/inventoryService';
import type { Product as ApiProduct } from '../../../shared/lib/inventoryService';

// ── Types ─────────────────────────────────────────────────────────────────────

type ViewMode = 'grid' | 'list';

// ── Hook: calcula columnas según el ancho real del contenedor ─────────────────

const CARD_MIN = 240; // ancho mínimo de card en px
const GRID_GAP = 16;  // gap en px (1rem)

function useGridColumns() {
  const ref = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(4);

  const calculate = useCallback(() => {
    if (!ref.current) return;
    const width = ref.current.clientWidth;
    const n = Math.max(1, Math.floor((width + GRID_GAP) / (CARD_MIN + GRID_GAP)));
    setCols(n);
  }, []);

  useEffect(() => {
    calculate();
    const ro = new ResizeObserver(calculate);
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, [calculate]);

  return { ref, cols };
}

// ── Toggle component ──────────────────────────────────────────────────────────

const DeviceToggle = ({ status, onToggle, disabled }: { status: string; onToggle: () => void; disabled?: boolean }) => {
  const isOn = status === 'ACTIVE';
  return (
    <button
      className={`fg__toggle${isOn ? ' fg__toggle--on' : ' fg__toggle--off'}`}
      onClick={onToggle}
      title={isOn ? 'Desactivar dispositivo' : 'Activar dispositivo'}
      aria-pressed={isOn}
      disabled={disabled}
    >
      <span className="fg__toggle-thumb" />
    </button>
  );
};

// ── Confirm Modal ─────────────────────────────────────────────────────────────

const ConfirmModal = ({ productName, onCancel, onConfirm, loading }: { productName: string; onCancel: () => void; onConfirm: () => void; loading?: boolean }) => (
  <div className="fg__modal-backdrop">
    <div className="fg__modal">
      <h3 className="fg__modal-title">¿Desactivar dispositivo?</h3>
      <p className="fg__modal-body">
        ¿Estás seguro que deseas desactivar <strong>{productName}</strong>?
        Esta acción detendrá su monitoreo activo.
      </p>
      <div className="fg__modal-actions">
        <button className="fg__modal-btn fg__modal-btn--cancel" onClick={onCancel} disabled={!!loading}>
          Cancelar
        </button>
        <button className="fg__modal-btn fg__modal-btn--confirm" onClick={onConfirm} disabled={!!loading}>
          {loading ? 'Desactivando…' : 'Sí, desactivar'}
        </button>
      </div>
    </div>
  </div>
);

interface Product extends ApiProduct {
  deviceType?: string;
  interval?: number;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Activo',
  INACTIVE: 'Inactivo',
  PENDING: 'Pendiente',
  RETIRED: 'Retirado',
  MAINTENANCE: 'Mantenimiento',
};

const PAGE_SIZE_OPTIONS = [6, 8, 10, 20];

// ── Icons ─────────────────────────────────────────────────────────────────────

const GridIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
  </svg>
);

const ListIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const SearchIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);

const ChevronLeft = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const ChevronRight = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

// ── Sub-components ────────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`fg__badge fg__badge--${status.toLowerCase()}`}>
    <span className="fg__badge-dot" />
    {STATUS_LABELS[status] || status}
  </span>
);

// ── Pagination ────────────────────────────────────────────────────────────────

interface PaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  filteredCount: number;
}

const Pagination = ({ current, total, pageSize, onPageChange }: PaginationProps) => {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const start = (current - 1) * pageSize + 1;
  const end   = Math.min(current * pageSize, total);

  const getPageNums = (): (number | '…')[] => {
    if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
    const nums: (number | '…')[] = [1];
    if (current > 3) nums.push('…');
    for (let i = Math.max(2, current - 1); i <= Math.min(pages - 1, current + 1); i++) nums.push(i);
    if (current < pages - 2) nums.push('…');
    nums.push(pages);
    return nums;
  };

  return (
    <div className="fg__pagination">
      <span className="fg__pg-info">
        {total > 0 ? `${start}–${end} de ${total} productos` : 'Sin resultados'}
      </span>
      <div className="fg__pagination-right">
        <div className="fg__pg-buttons">
          <button className="fg__pg-btn" onClick={() => onPageChange(current - 1)} disabled={current === 1}>
            <ChevronLeft />
          </button>
          {getPageNums().map((n, i) =>
            n === '…'
              ? <span key={`e${i}`} className="fg__pg-ellipsis">…</span>
              : <button
                  key={n}
                  className={`fg__pg-btn${n === current ? ' fg__pg-btn--active' : ''}`}
                  onClick={() => onPageChange(n as number)}
                >{n}</button>
          )}
          <button className="fg__pg-btn" onClick={() => onPageChange(current + 1)} disabled={current === pages}>
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

export const InventoryFinishedGoodsView = () => {
  const [products, setProducts]       = useState<Product[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [search, setSearch]           = useState('');
  const [viewMode, setViewMode]       = useState<ViewMode>('grid');
  const [page, setPage]               = useState(1);
  const [confirmProduct, setConfirm]  = useState<{ id: string; name: string } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const { ref: gridRef, cols }        = useGridColumns();

  // Cargar productos del API
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError('No se pudieron cargar los productos. Verifica que el servidor esté corriendo.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const PAGE_SIZE = cols * 2;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter(p => {
      return !q
        || p.name.toLowerCase().includes(q)
        || p.serialNumber.toLowerCase().includes(q)
        || p.model.toLowerCase().includes(q)
        || p.manufacturer.toLowerCase().includes(q);
    });
  }, [search, products]);

  const paged = useMemo(() => {
    const s = (page - 1) * PAGE_SIZE;
    return filtered.slice(s, s + PAGE_SIZE);
  }, [filtered, page]);

  const handleSearch = (v: string) => { setSearch(v); setPage(1); };

  const handleToggle = async (p: { id: string; name: string; status: string }) => {
    const isOn = p.status === 'ACTIVE';
    if (isOn) {
      setConfirm({ id: p.id, name: p.name });
      return;
    }

    // Activar
    try {
      setActionLoading(true);
      setError(null);
      await activateProduct(p.id);
      // Refrescar lista
      await loadProducts();
    } catch (err) {
      console.error('Failed to activate product:', err);
      setError('No se pudo activar el producto. Intenta nuevamente.');
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDeactivate = async () => {
    if (!confirmProduct) return;
    try {
      setActionLoading(true);
      setError(null);
      await deactivateProduct(confirmProduct.id);
      setConfirm(null);
      await loadProducts();
    } catch (err) {
      console.error('Failed to deactivate product:', err);
      setError('No se pudo desactivar el producto. Intenta nuevamente.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <section className="fg">

      {/* ── Confirm Modal ── */}
      {confirmProduct && (
        <ConfirmModal
          productName={confirmProduct.name}
          onCancel={() => setConfirm(null)}
          onConfirm={confirmDeactivate}
          loading={actionLoading}
        />
      )}

      {/* ── Header ── */}
      <header className="fg__header">
        <p className="fg__eyebrow">Inventario</p>
        <h2>Productos terminados</h2>
        <p>Seguimiento de inventario final disponible para despacho y venta.</p>
      </header>

      {/* ── Controls (search only) ── */}
      <div className="fg__controls">
        <div className="fg__toolbar">
          <div className="fg__search-wrap">
            <SearchIcon />
            <input
              className="fg__search"
              type="search"
              placeholder="Nombre, serial, modelo…"
              value={search}
              onChange={e => handleSearch(e.target.value)}
              disabled={loading}
            />
          </div>
          <span className="fg__count">{filtered.length} producto{filtered.length !== 1 ? 's' : ''}</span>
          <div className="fg__view-toggle">
            <button
              className={`fg__vbtn${viewMode === 'grid' ? ' active' : ''}`}
              title="Cuadrícula"
              onClick={() => { setViewMode('grid'); setPage(1); }}
              disabled={loading}
            >
              <GridIcon />
            </button>
            <button
              className={`fg__vbtn${viewMode === 'list' ? ' active' : ''}`}
              title="Lista"
              onClick={() => { setViewMode('list'); setPage(1); }}
              disabled={loading}
            >
              <ListIcon />
            </button>
          </div>
        </div>
      </div>

      {/* ── Error message ── */}
      {error && (
        <div style={{
          padding: '12px 16px',
          backgroundColor: '#fee2e2',
          border: '1px solid #fca5a5',
          borderRadius: '6px',
          color: '#991b1b',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {/* ── Scrollable body ── */}
      <div className="fg__body">

        {/* Loading state */}
        {loading && (
          <p className="fg__empty">Cargando productos...</p>
        )}

        {/* Grid view */}
        {!loading && viewMode === 'grid' && (
          <div className="fg__grid-wrap" ref={gridRef}>
            {paged.length === 0
              ? <p className="fg__empty">No se encontraron productos con los filtros actuales.</p>
              : (
                <div className="fg__grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
                  {paged.map(p => (
                    <article key={p.id} className="fg__card" data-status={p.status?.toLowerCase()}>
                      <div className="fg__card-top">
                        <h3 className="fg__card-name">{p.name}</h3>
                        <DeviceToggle status={p.status} onToggle={() => handleToggle(p)} disabled={actionLoading} />
                      </div>
                      <StatusBadge status={p.status} />
                      <p className="fg__card-desc">{p.description}</p>
                      <dl className="fg__card-meta">
                        <div className="fg__meta-item">
                          <span className="fg__ml">Serial</span>
                          <span className="fg__mv">{p.serialNumber}</span>
                        </div>
                        <div className="fg__meta-item">
                          <span className="fg__ml">Modelo</span>
                          <span className="fg__mv">{p.model}</span>
                        </div>
                        <div className="fg__meta-item">
                          <span className="fg__ml">Fabricante</span>
                          <span className="fg__mv">{p.manufacturer}</span>
                        </div>
                        <div className="fg__meta-item">
                          <span className="fg__ml">Intervalo</span>
                          <span className="fg__mv">{p.interval ? `${p.interval} ms` : '—'}</span>
                        </div>
                      </dl>
                    </article>
                  ))}
                </div>
              )
            }
          </div>
        )}

        {/* List view */}
        {!loading && viewMode === 'list' && (
          <div className="fg__table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Tipo</th>
                  <th>Serial</th>
                  <th>Modelo</th>
                  <th>Fabricante</th>
                  <th>Intervalo</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {paged.length === 0
                  ? <tr><td colSpan={7} className="fg__empty">No se encontraron productos.</td></tr>
                  : paged.map(p => (
                      <tr key={p.id}>
                        <td>
                          <div className="fg__td-name">{p.name}</div>
                          <div className="fg__td-sub">{p.description}</div>
                        </td>
                        <td><span className="fg__chip">{p.deviceType || '—'}</span></td>
                        <td className="fg__td-mono">{p.serialNumber}</td>
                        <td className="fg__td-mono">{p.model}</td>
                        <td>{p.manufacturer}</td>
                        <td className="fg__td-num">{p.interval ? `${p.interval} ms` : '—'}</td>
                        <td><DeviceToggle status={p.status} onToggle={() => handleToggle(p)} disabled={actionLoading} /></td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* ── Pagination (always at bottom) ── */}
      {filtered.length > 0 && (
        <Pagination
          current={page}
          total={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          filteredCount={filtered.length}
        />
      )}

    </section>
  );
};