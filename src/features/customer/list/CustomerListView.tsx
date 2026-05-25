import { useState, useMemo, useEffect } from 'react';
import './CustomerListView.css';
import { getAllCustomers } from '../../../shared/lib/customerService';
import type { Customer } from '../../../shared/lib/customerService';
import { createProduct, generateSerialNumber, getDescriptionByDeviceType, getActiveProductByUserId } from '../../../shared/lib/inventoryService';

const DEVICE_TYPES = [
  'MEDICAL',
  'METABOLIC',
  'LIPID',
  'ELECTROLYTE',
  'BLOOD_COUNT',
  'CARDIOMETABOLIC',
  'RENAL',
  'HEMATOMETABOLIC',
  'LIPID_ELECTROLYTE',
  'LIPID_HEMATOLOGY',
  'ELECTROLYTE_HEMATOLOGY',
  'METABOLIC_COMPREHENSIVE',
  'CARDIO_HEMATOLOGY',
  'RENAL_HEMATOLOGY',
  'ELECTRO_LIPID_HEMATOLOGY',
] as const;

const PAGE_SIZE = 6;

const DOC_TYPE_CLASS: Record<string, string> = {
  CC:  'clv-badge--cc',
  NIT: 'clv-badge--nit',
  CE:  'clv-badge--ce',
};

const getInitials = (firstName: string, lastName: string) =>
  `${firstName[0]}${lastName[0]}`.toUpperCase();

const formatDate = (iso: string | null) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const CustomerListView = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [docTypeFilter, setDocTypeFilter] = useState('Todos');
  const [page, setPage] = useState(1);
  const [modalCustomer, setModalCustomer] = useState<Customer | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [associatingDevice, setAssociatingDevice] = useState(false);
  const [associationError, setAssociationError] = useState<string | null>(null);
  const [customersWithDevices, setCustomersWithDevices] = useState<Set<string>>(new Set());

  // Cargar clientes del backend
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllCustomers();
        setCustomers(data);

        // Verificar productos activos para cada cliente
        const withDevices = new Set<string>();
        for (const customer of data) {
          const product = await getActiveProductByUserId(customer.id);
          if (product) {
            withDevices.add(customer.id);
          }
        }
        setCustomersWithDevices(withDevices);
      } catch (err) {
        console.error('Failed to load customers:', err);
        setError('No se pudieron cargar los clientes. Verifica que el servidor esté corriendo.');
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  const filtered = useMemo(() => {
    return customers.filter(c => {
      const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
      const matchSearch =
        fullName.includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.documentNumber.includes(search);
      const matchDoc = docTypeFilter === 'Todos' || c.documentType === docTypeFilter;
      return matchSearch && matchDoc;
    });
  }, [search, docTypeFilter, customers]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paginated  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const setFilter = (value: string) => { setDocTypeFilter(value); setPage(1); };

  const openModal = (customer: Customer) => {
    setModalCustomer(customer);
    setSelectedDevice(null);
    setAssociationError(null);
  };
  const closeModal = () => {
    setModalCustomer(null);
    setSelectedDevice(null);
    setAssociationError(null);
  };
  const handleAssociate = async () => {
    if (!selectedDevice || !modalCustomer) return;

    try {
      setAssociatingDevice(true);
      setAssociationError(null);

      const deviceName = `${modalCustomer.firstName} ${modalCustomer.lastName} ${selectedDevice}`;
      const serialNumber = generateSerialNumber();
      const description = getDescriptionByDeviceType(selectedDevice);

      await createProduct({
        name: deviceName,
        description: description,
        serialNumber: serialNumber,
        model: '1.0',
        manufacturer: 'Medibug',
        status: '',
        userId: modalCustomer.id,
        deviceType: selectedDevice,
        interval: 10,
      });

      console.log('Dispositivo asociado exitosamente', selectedDevice, 'al cliente', modalCustomer.id);

      // Actualizar el estado para indicar que este cliente ahora tiene un dispositivo
      setCustomersWithDevices(prev => new Set([...prev, modalCustomer.id]));

      closeModal();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al asociar el dispositivo';
      setAssociationError(errorMessage);
      console.error('Error asociando dispositivo:', err);
    } finally {
      setAssociatingDevice(false);
    }
  };

  return (
    <section className="main-box__template clv">
      {/* Header */}
      <header className="main-box__header">
        <p className="main-box__eyebrow">Clientes</p>
        <h2>Lista de clientes</h2>
        <p>Consulta y gestiona los clientes registrados en el sistema.</p>
      </header>

      {/* Error */}
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

      {/* Toolbar */}
      <div className="clv__toolbar">
        <div className="clv__search-wrap">
          <span className="clv__search-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </span>
          <input
            className="clv__search"
            placeholder="Buscar por nombre, correo o documento…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            disabled={loading}
          />
        </div>
        <div className="clv__filters">
          {['Todos', 'CC', 'NIT', 'CE'].map(d => (
            <button
              key={d}
              className={`clv__filter-btn ${docTypeFilter === d ? 'is-active' : ''}`}
              onClick={() => setFilter(d)}
              disabled={loading}
            >{d === 'Todos' ? 'Todos' : `Doc. ${d}`}</button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="clv__stats">
        <div className="clv__stat">
          <span className="clv__stat-value">{loading ? '...' : customers.length}</span>
          <span className="clv__stat-label">Total</span>
        </div>
        <div className="clv__stat">
          <span className="clv__stat-value">{loading ? '...' : filtered.length}</span>
          <span className="clv__stat-label">Resultados</span>
        </div>
      </div>

      {/* Table */}
      <div className="clv__table-wrap">
        {loading ? (
          <div className="clv__empty">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <p>Cargando clientes...</p>
          </div>
        ) : paginated.length === 0 ? (
          <div className="clv__empty">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <p>Sin resultados para los filtros aplicados.</p>
          </div>
        ) : (
          <table className="clv__table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Correo</th>
                <th>Documento</th>
                <th>Fecha de nacimiento</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(c => (
                <tr key={c.id} className="clv__row">
                  <td>
                    <div className="clv__name-cell">
                      <div className="clv__avatar">{getInitials(c.firstName, c.lastName)}</div>
                      <span className="clv__name">{c.firstName} {c.lastName}</span>
                    </div>
                  </td>
                  <td className="clv__email">{c.email}</td>
                  <td>
                    <div className="clv__doc">
                      <span className={`clv__badge ${DOC_TYPE_CLASS[c.documentType] ?? 'clv-badge--cc'}`}>
                        {c.documentType}
                      </span>
                      <span className="clv__doc-number">{c.documentNumber}</span>
                    </div>
                  </td>
                  <td className="clv__since">{formatDate(c.birthDate)}</td>
                  <td className="clv__actions-cell">
                    <button
                      className="clv__action-btn"
                      title={customersWithDevices.has(c.id) ? "Ver dispositivo" : "Asociar dispositivo"}
                      onClick={() => openModal(c)}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="8" width="18" height="13" rx="2"/>
                        <path d="M9 8V6a3 3 0 0 1 6 0v2"/>
                        <circle cx="9" cy="14" r="1.2" fill="currentColor" stroke="none"/>
                        <circle cx="15" cy="14" r="1.2" fill="currentColor" stroke="none"/>
                        <line x1="9" y1="18" x2="15" y2="18"/>
                        <line x1="12" y1="3" x2="12" y2="4"/>
                      </svg>
                      <span>{customersWithDevices.has(c.id) ? 'Ver dispositivo' : 'Asociar dispositivo'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="clv__pagination">
          <span className="clv__pagination-info">
            Página {safePage} de {totalPages} · {filtered.length} registros
          </span>
          <div className="clv__pagination-controls">
            <button className="clv__page-btn" disabled={safePage === 1} onClick={() => setPage(1)} aria-label="Primera página">«</button>
            <button className="clv__page-btn" disabled={safePage === 1} onClick={() => setPage(p => p - 1)} aria-label="Página anterior">‹</button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(n => Math.abs(n - safePage) <= 1 || n === 1 || n === totalPages)
              .reduce<(number | '…')[]>((acc, n, idx, arr) => {
                if (idx > 0 && n - Number(arr[idx - 1]) > 1) acc.push('…');
                acc.push(n);
                return acc;
              }, [])
              .map((n) =>
                n === '…'
                  ? <span key={`ellipsis-${totalPages}`} className="clv__page-ellipsis">…</span>
                  : <button key={n} className={`clv__page-btn ${n === safePage ? 'is-current' : ''}`} onClick={() => setPage(Number(n))}>{n}</button>
              )
            }

            <button className="clv__page-btn" disabled={safePage === totalPages} onClick={() => setPage(p => p + 1)} aria-label="Página siguiente">›</button>
            <button className="clv__page-btn" disabled={safePage === totalPages} onClick={() => setPage(totalPages)} aria-label="Última página">»</button>
          </div>
        </div>
      )}
      {/* Modal asociar dispositivo */}
      {modalCustomer && (
        <div className="clv__modal-overlay" onClick={closeModal}>
          <div className="clv__modal" onClick={e => e.stopPropagation()}>
            <div className="clv__modal-header">
              <div>
                <p className="clv__modal-eyebrow">Asociar dispositivo</p>
                <h3 className="clv__modal-title">{modalCustomer.firstName} {modalCustomer.lastName}</h3>
              </div>
              <button className="clv__modal-close" onClick={closeModal} aria-label="Cerrar" disabled={associatingDevice}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <p className="clv__modal-subtitle">Selecciona el tipo de dispositivo a asociar</p>
            {associationError && (
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#fee2e2',
                border: '1px solid #fca5a5',
                borderRadius: '6px',
                color: '#991b1b',
                marginBottom: '16px',
                fontSize: '14px'
              }}>
                {associationError}
              </div>
            )}
            <div className="clv__device-grid">
              {DEVICE_TYPES.map(type => (
                <button
                  key={type}
                  className={`clv__device-option ${selectedDevice === type ? 'is-selected' : ''}`}
                  onClick={() => setSelectedDevice(type)}
                  disabled={associatingDevice}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="clv__modal-footer">
              <button className="clv__modal-cancel" onClick={closeModal} disabled={associatingDevice}>Cancelar</button>
              <button
                className="clv__modal-confirm"
                disabled={!selectedDevice || associatingDevice}
                onClick={handleAssociate}
              >
                {associatingDevice ? 'Asociando...' : 'Asociar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};