import { useState } from 'react';
import './CustomerNewView.css';
import { createCustomer } from '../../../shared/lib/customerService';

type DocumentType = 'CC' | 'NIT' | 'CE' | '';

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  documentType: DocumentType;
  documentNumber: string;
  birthDate: string;
}

const INITIAL: FormState = {
  firstName: '', lastName: '', email: '',
  documentType: '', documentNumber: '', birthDate: '',
};

const DOC_TYPES: Exclude<DocumentType, ''>[] = ['CC', 'NIT', 'CE'];

export const CustomerNewView = () => {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (field: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setSubmitted(false);
    setError(null);
  };

  const isPersonalComplete  = form.firstName.trim() && form.lastName.trim();
  const isContactComplete   = form.email.trim();
  const isDocumentComplete  = form.documentType && form.documentNumber.trim();
  const allComplete = isPersonalComplete && isContactComplete && isDocumentComplete;

  const handleSubmit = async () => {
    if (!allComplete) return;

    try {
      setLoading(true);
      setError(null);

      // Enviar datos al backend
      await createCustomer({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        documentType: form.documentType,
        document: form.documentNumber,
        birthDay: form.birthDate,
      });

      setSubmitted(true);
      setForm(INITIAL);

      // Limpiar el mensaje de éxito después de 3 segundos
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error('Error creating customer:', err);
      setError('Error al registrar el cliente. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="main-box__template cnv">

      {/* Header */}
      <header className="main-box__header">
        <p className="main-box__eyebrow">Clientes</p>
        <h2>Agregar cliente</h2>
        <p>Completa los datos para registrar un nuevo cliente en el sistema.</p>
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

      {/* Éxito */}
      {submitted && (
        <div className="cnv__success">
          <span className="cnv__success-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </span>
          <span>Cliente registrado correctamente.</span>
        </div>
      )}

      {/* Pasos */}
      <div className="cnv__steps">
        {[
          { n: 1, label: 'Datos personales', done: !!isPersonalComplete },
          { n: 2, label: 'Contacto',          done: !!isContactComplete },
          { n: 3, label: 'Documento',          done: !!isDocumentComplete },
        ].map(({ n, label, done }) => (
          <div key={n} className={`cnv__step ${done ? 'is-done' : ''}`}>
            <span className="cnv__step-num">{done ? '✓' : n}</span>
            <span className="cnv__step-label">{label}</span>
            {n < 3 && <span className="cnv__step-connector" />}
          </div>
        ))}
      </div>

      {/* Secciones */}
      <div className="cnv__sections">

        {/* ── 1. Datos personales ── */}
        <div className="cnv__section">
          <div className="cnv__section-header">
            <div className="cnv__section-icon cnv__section-icon--1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div>
              <h3 className="cnv__section-title">Datos personales</h3>
              <p className="cnv__section-sub">Nombre completo y fecha de nacimiento.</p>
            </div>
            {isPersonalComplete && <span className="cnv__check">✓</span>}
          </div>

          <div className="cnv__fields">
            <div className="cnv__field">
              <label className="cnv__label">Nombre <span className="cnv__req">*</span></label>
              <input
                className="cnv__input"
                placeholder="Ej. Carlos"
                value={form.firstName}
                onChange={e => set('firstName', e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="cnv__field">
              <label className="cnv__label">Apellido <span className="cnv__req">*</span></label>
              <input
                className="cnv__input"
                placeholder="Ej. Ramírez"
                value={form.lastName}
                onChange={e => set('lastName', e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="cnv__field">
              <label className="cnv__label">Fecha de nacimiento</label>
              <input
                className="cnv__input"
                type="date"
                value={form.birthDate}
                onChange={e => set('birthDate', e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* ── 2. Contacto ── */}
        <div className="cnv__section">
          <div className="cnv__section-header">
            <div className="cnv__section-icon cnv__section-icon--2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <div>
              <h3 className="cnv__section-title">Contacto</h3>
              <p className="cnv__section-sub">Correo electrónico para comunicaciones.</p>
            </div>
            {isContactComplete && <span className="cnv__check">✓</span>}
          </div>

          <div className="cnv__fields">
            <div className="cnv__field cnv__field--wide">
              <label className="cnv__label">Correo electrónico <span className="cnv__req">*</span></label>
              <input
                className="cnv__input"
                type="email"
                placeholder="Ej. carlos.ramirez@gmail.com"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* ── 3. Documento ── */}
        <div className="cnv__section">
          <div className="cnv__section-header">
            <div className="cnv__section-icon cnv__section-icon--3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
              </svg>
            </div>
            <div>
              <h3 className="cnv__section-title">Documento</h3>
              <p className="cnv__section-sub">Tipo y número de identificación.</p>
            </div>
            {isDocumentComplete && <span className="cnv__check">✓</span>}
          </div>

          <div className="cnv__fields">
            <div className="cnv__field">
              <label className="cnv__label">Tipo de documento <span className="cnv__req">*</span></label>
              <div className="cnv__segment-group">
                {DOC_TYPES.map(d => (
                  <button
                    key={d}
                    type="button"
                    className={`cnv__segment-btn ${form.documentType === d ? 'is-active' : ''}`}
                    onClick={() => set('documentType', d)}
                    disabled={loading}
                  >
                    <span className="cnv__doc-badge-label">{d}</span>
                    <span className="cnv__doc-badge-desc">
                      {d === 'CC' ? 'Cédula' : d === 'NIT' ? 'NIT empresa' : 'Cédula extranjería'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="cnv__field">
              <label className="cnv__label">Número de documento <span className="cnv__req">*</span></label>
              <input
                className="cnv__input"
                placeholder="Ej. 1020304050"
                value={form.documentNumber}
                onChange={e => set('documentNumber', e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
        </div>

      </div>{/* fin cnv__sections */}

      {/* Acciones */}
      <div className="cnv__actions">
        <button
          type="button"
          className="cnv__btn cnv__btn--ghost"
          onClick={() => { setForm(INITIAL); setSubmitted(false); setError(null); }}
          disabled={loading}
        >Limpiar</button>
        <button
          type="button"
          className={`cnv__btn cnv__btn--primary ${!allComplete ? 'is-disabled' : ''}`}
          onClick={handleSubmit}
          disabled={!allComplete || loading}
        >{loading ? 'Registrando...' : 'Registrar cliente'}</button>
      </div>

    </section>
  );
};

