import { useEffect, useMemo, useState, type FormEvent } from 'react';
import './ProcurementSuppliersView.css';
import { Modal, ModalBackdrop } from '../../../shared/ui/modal';
import { createSupplier, getAllSuppliers, type CreateSupplierRequest, type Supplier } from '../../../shared/lib/supplierService';

type SupplierFormState = {
  businessName: string;
  tradeName: string;
  taxId: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  status: string;
  notes: string;
};

const PAGE_SIZE = 8;

const INITIAL_FORM: SupplierFormState = {
  businessName: '',
  tradeName: '',
  taxId: '',
  contactName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  country: 'Colombia',
  status: 'Activo',
  notes: '',
};

const STATUS_OPTIONS = ['Activo', 'Pendiente', 'Inactivo', 'Bloqueado'] as const;

const getSupplierName = (supplier: Supplier) => supplier.displayName || supplier.companyName || supplier.legalName || 'Proveedor';

const getInitials = (name: string) => {
  const parts = name.split(' ').filter(Boolean);
  if (parts.length === 0) return 'PR';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const formatValue = (value?: string | null) => value?.trim() || '—';

const formatDate = (value?: string | null) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });
};

const getStatusClass = (status?: string) => {
  const normalized = (status || '').toLowerCase();
  if (normalized.includes('activo')) return 'psv__badge--success';
  if (normalized.includes('pend')) return 'psv__badge--warning';
  if (normalized.includes('bloq')) return 'psv__badge--danger';
  return 'psv__badge--neutral';
};

export const ProcurementSuppliersView = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<SupplierFormState>(INITIAL_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllSuppliers();
      setSuppliers(data.sort((a, b) => getSupplierName(a).localeCompare(getSupplierName(b), 'es')));
    } catch (err) {
      console.error('Failed to load suppliers:', err);
      setError('No se pudieron cargar los proveedores. Verifica que el servidor esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setCreateOpen(false);
        setSelectedSupplier(null);
        setFormError(null);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();
    return suppliers.filter((supplier) => {
      if (!query) return true;

      const haystack = [
        getSupplierName(supplier),
        supplier.taxId,
        supplier.contactName,
        supplier.email,
        supplier.phone,
        supplier.address,
        supplier.city,
        supplier.status,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [search, suppliers]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const setSearchValue = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const openCreateModal = () => {
    setCreateOpen(true);
    setFormError(null);
    setMessage(null);
  };

  const closeCreateModal = () => {
    setCreateOpen(false);
    setFormError(null);
    setForm(INITIAL_FORM);
  };

  const closeDetailModal = () => setSelectedSupplier(null);

  const updateForm = (field: keyof SupplierFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormError(null);
  };

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.businessName.trim() || !form.tradeName.trim() || !form.taxId.trim() || !form.contactName.trim() || !form.email.trim()) {
      setFormError('Completa los campos mínimos: razón social, nombre comercial, NIT, contacto y correo.');
      return;
    }

    const payload: CreateSupplierRequest = {
      businessName: form.businessName.trim(),
      tradeName: form.tradeName.trim(),
      taxId: form.taxId.trim(),
      contactName: form.contactName.trim(),
      contactPerson: form.contactName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      country: form.country.trim(),
      status: form.status.trim(),
      notes: form.notes.trim(),
    };

    try {
      setSaving(true);
      setFormError(null);
      await createSupplier(payload);
      await loadSuppliers();
      setMessage('Proveedor registrado correctamente.');
      closeCreateModal();
      window.setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al registrar el proveedor';
      setFormError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const activeCount = suppliers.filter((supplier) => (supplier.status || '').toLowerCase().includes('activo')).length;

  return (
    <section className="main-box__template psv">
      <header className="main-box__header">
        <p className="main-box__eyebrow">Compras</p>
        <h2>Proveedores</h2>
        <p>Tabla de proveedores conectada al endpoint <code>/api/v1/suppliers</code>, con alta y ficha detallada.</p>
      </header>

      {error && (
        <div className="psv__banner psv__banner--error" role="alert">
          {error}
        </div>
      )}

      {message && (
        <div className="psv__banner psv__banner--success" role="status">
          {message}
        </div>
      )}

      <div className="psv__toolbar">
        <div className="psv__search-wrap">
          <span className="psv__search-icon" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            className="psv__search"
            placeholder="Buscar por nombre, NIT, contacto, correo o ciudad…"
            value={search}
            onChange={(e) => setSearchValue(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="psv__actions">
          <button className="psv__ghost-btn" type="button" onClick={loadSuppliers} disabled={loading || saving}>
            {loading ? 'Cargando…' : 'Actualizar'}
          </button>
          <button className="psv__primary-btn" type="button" onClick={openCreateModal}>
            + Agregar proveedor
          </button>
        </div>
      </div>

      <div className="psv__stats">
        <div className="psv__stat">
          <span className="psv__stat-value">{loading ? '...' : suppliers.length}</span>
          <span className="psv__stat-label">Total</span>
        </div>
        <div className="psv__stat">
          <span className="psv__stat-value">{loading ? '...' : filtered.length}</span>
          <span className="psv__stat-label">Resultados</span>
        </div>
        <div className="psv__stat">
          <span className="psv__stat-value">{loading ? '...' : activeCount}</span>
          <span className="psv__stat-label">Activos</span>
        </div>
      </div>

      <div className="psv__table-wrap">
        {loading ? (
          <div className="psv__empty">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <p>Cargando proveedores...</p>
          </div>
        ) : paginated.length === 0 ? (
          <div className="psv__empty">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <p>No hay proveedores para mostrar con esos filtros.</p>
          </div>
        ) : (
          <table className="psv__table">
            <thead>
              <tr>
                <th>Proveedor</th>
                <th>NIT</th>
                <th>Contacto</th>
                <th>Correo</th>
                <th>Ciudad</th>
                <th>Estado</th>
                <th>Creado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((supplier) => {
                const name = getSupplierName(supplier);

                return (
                  <tr
                    key={supplier.id}
                    className="psv__row"
                    onClick={() => setSelectedSupplier(supplier)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setSelectedSupplier(supplier);
                      }
                    }}
                  >
                    <td>
                      <div className="psv__name-cell">
                        <div className="psv__avatar">{getInitials(name)}</div>
                        <div className="psv__name-copy">
                          <span className="psv__name">{name}</span>
                          <span className="psv__subname">{formatValue(supplier.contactName)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="psv__muted">{formatValue(supplier.taxId)}</td>
                    <td>
                      <div className="psv__stacked">
                        <span className="psv__contact-name">{formatValue(supplier.contactName)}</span>
                        <span className="psv__muted">{formatValue(supplier.phone)}</span>
                      </div>
                    </td>
                    <td className="psv__muted">{formatValue(supplier.email)}</td>
                    <td className="psv__muted">{formatValue(supplier.city)}</td>
                    <td>
                      <span className={`psv__badge ${getStatusClass(supplier.status)}`}>
                        {formatValue(supplier.status)}
                      </span>
                    </td>
                    <td className="psv__muted">{formatDate(supplier.createdAt)}</td>
                    <td className="psv__actions-cell">
                      <button
                        className="psv__row-btn"
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedSupplier(supplier);
                        }}
                      >
                        Ver ficha
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
        <div className="psv__pagination">
          <span className="psv__pagination-info">
            Página {safePage} de {totalPages} · {filtered.length} registros
          </span>
          <div className="psv__pagination-controls">
            <button className="psv__page-btn" type="button" disabled={safePage === 1} onClick={() => setPage(1)}>
              «
            </button>
            <button className="psv__page-btn" type="button" disabled={safePage === 1} onClick={() => setPage((current) => current - 1)}>
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1)
              .filter((n) => Math.abs(n - safePage) <= 1 || n === 1 || n === totalPages)
              .reduce<(number | '…')[]>((acc, n, index, arr) => {
                if (index > 0 && n - Number(arr[index - 1]) > 1) acc.push('…');
                acc.push(n);
                return acc;
              }, [])
              .map((n) =>
                n === '…' ? (
                  <span key={`ellipsis-${safePage}-${totalPages}`} className="psv__page-ellipsis">…</span>
                ) : (
                  <button
                    key={n}
                    className={`psv__page-btn ${n === safePage ? 'is-current' : ''}`}
                    type="button"
                    onClick={() => setPage(Number(n))}
                  >
                    {n}
                  </button>
                )
              )}
            <button className="psv__page-btn" type="button" disabled={safePage === totalPages} onClick={() => setPage((current) => current + 1)}>
              ›
            </button>
            <button className="psv__page-btn" type="button" disabled={safePage === totalPages} onClick={() => setPage(totalPages)}>
              »
            </button>
          </div>
        </div>
      )}

      {createOpen && (
        <ModalBackdrop phase="open" onClick={closeCreateModal}>
          <Modal ariaLabel="Agregar proveedor" className="psv__modal" phase="open" onClick={(event) => event.stopPropagation()}>
            <div className="psv__modal-shell">
              <div className="psv__modal-header">
                <div>
                  <p className="psv__modal-eyebrow">Nuevo proveedor</p>
                  <h3 className="psv__modal-title">Agregar proveedor</h3>
                  <p className="psv__modal-subtitle">Captura la información principal y luego podrás seleccionarlo en la tabla.</p>
                </div>
                <button className="psv__modal-close" type="button" onClick={closeCreateModal} aria-label="Cerrar">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {formError && (
                <div className="psv__banner psv__banner--error" role="alert">
                  {formError}
                </div>
              )}

              <form className="psv__form" onSubmit={handleCreate}>
                <div className="psv__form-grid">
                  <div className="psv__field psv__field--wide">
                    <label className="psv__label">Razón social <span className="psv__req">*</span></label>
                    <input className="psv__input" value={form.businessName} onChange={(event) => updateForm('businessName', event.target.value)} placeholder="Ej. Distribuidora Médica SAS" disabled={saving} />
                  </div>

                  <div className="psv__field psv__field--wide">
                    <label className="psv__label">Nombre comercial <span className="psv__req">*</span></label>
                    <input className="psv__input" value={form.tradeName} onChange={(event) => updateForm('tradeName', event.target.value)} placeholder="Ej. MediSupply" disabled={saving} />
                  </div>

                  <div className="psv__field">
                    <label className="psv__label">NIT <span className="psv__req">*</span></label>
                    <input className="psv__input" value={form.taxId} onChange={(event) => updateForm('taxId', event.target.value)} placeholder="Ej. 900123456-1" disabled={saving} />
                  </div>

                  <div className="psv__field">
                    <label className="psv__label">Contacto principal <span className="psv__req">*</span></label>
                    <input className="psv__input" value={form.contactName} onChange={(event) => updateForm('contactName', event.target.value)} placeholder="Ej. Laura Gómez" disabled={saving} />
                  </div>

                  <div className="psv__field">
                    <label className="psv__label">Correo electrónico <span className="psv__req">*</span></label>
                    <input className="psv__input" type="email" value={form.email} onChange={(event) => updateForm('email', event.target.value)} placeholder="Ej. compras@proveedor.com" disabled={saving} />
                  </div>

                  <div className="psv__field">
                    <label className="psv__label">Teléfono</label>
                    <input className="psv__input" value={form.phone} onChange={(event) => updateForm('phone', event.target.value)} placeholder="Ej. +57 300 123 4567" disabled={saving} />
                  </div>

                  <div className="psv__field">
                    <label className="psv__label">Ciudad</label>
                    <input className="psv__input" value={form.city} onChange={(event) => updateForm('city', event.target.value)} placeholder="Ej. Bogotá" disabled={saving} />
                  </div>

                  <div className="psv__field">
                    <label className="psv__label">País</label>
                    <input className="psv__input" value={form.country} onChange={(event) => updateForm('country', event.target.value)} placeholder="Ej. Colombia" disabled={saving} />
                  </div>

                  <div className="psv__field psv__field--wide">
                    <label className="psv__label">Dirección</label>
                    <input className="psv__input" value={form.address} onChange={(event) => updateForm('address', event.target.value)} placeholder="Ej. Calle 123 #45-67" disabled={saving} />
                  </div>

                  <div className="psv__field">
                    <label className="psv__label">Estado</label>
                    <select className="psv__input" value={form.status} onChange={(event) => updateForm('status', event.target.value)} disabled={saving}>
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>

                  <div className="psv__field psv__field--wide">
                    <label className="psv__label">Observaciones</label>
                    <textarea className="psv__input psv__textarea" value={form.notes} onChange={(event) => updateForm('notes', event.target.value)} placeholder="Notas comerciales, condiciones de pago, etc." disabled={saving} rows={4} />
                  </div>
                </div>

                <div className="psv__modal-actions">
                  <button className="psv__ghost-btn" type="button" onClick={closeCreateModal} disabled={saving}>
                    Cancelar
                  </button>
                  <button className="psv__primary-btn" type="submit" disabled={saving}>
                    {saving ? 'Guardando…' : 'Guardar proveedor'}
                  </button>
                </div>
              </form>
            </div>
          </Modal>
        </ModalBackdrop>
      )}

      {selectedSupplier && (
        <ModalBackdrop phase="open" onClick={closeDetailModal}>
          <Modal ariaLabel="Detalle del proveedor" className="psv__modal psv__modal--detail" phase="open" onClick={(event) => event.stopPropagation()}>
            <div className="psv__modal-shell psv__modal-shell--detail">
              <div className="psv__detail-hero">
                <div className="psv__detail-brand">
                  <div className="psv__avatar psv__avatar--large">{getInitials(getSupplierName(selectedSupplier))}</div>
                  <div>
                    <p className="psv__modal-eyebrow">Proveedor seleccionado</p>
                    <h3 className="psv__modal-title">{getSupplierName(selectedSupplier)}</h3>
                    <p className="psv__modal-subtitle">NIT {formatValue(selectedSupplier.taxId)}</p>
                  </div>
                </div>
                <span className={`psv__badge ${getStatusClass(selectedSupplier.status)}`}>
                  {formatValue(selectedSupplier.status)}
                </span>
              </div>

              <div className="psv__detail-grid">
                <article className="psv__detail-card">
                  <span className="psv__detail-label">Contacto</span>
                  <strong>{formatValue(selectedSupplier.contactName)}</strong>
                  <p>{formatValue(selectedSupplier.email)}</p>
                  <p>{formatValue(selectedSupplier.phone)}</p>
                </article>

                <article className="psv__detail-card">
                  <span className="psv__detail-label">Ubicación</span>
                  <strong>{formatValue(selectedSupplier.city)}</strong>
                  <p>{formatValue(selectedSupplier.address)}</p>
                </article>

                <article className="psv__detail-card">
                  <span className="psv__detail-label">Fechas</span>
                  <strong>Creado: {formatDate(selectedSupplier.createdAt)}</strong>
                  <p>Actualizado: {formatDate(selectedSupplier.updatedAt)}</p>
                </article>

                <article className="psv__detail-card psv__detail-card--wide">
                  <span className="psv__detail-label">Observaciones</span>
                  <p>{formatValue(selectedSupplier.notes)}</p>
                </article>
              </div>

              <div className="psv__modal-actions psv__modal-actions--detail">
                <button className="psv__primary-btn" type="button" onClick={closeDetailModal}>
                  Cerrar
                </button>
              </div>
            </div>
          </Modal>
        </ModalBackdrop>
      )}
    </section>
  );
};
