import { useState } from 'react';
import { loginCustomer } from '../../shared/services/authService';
import './LoginView.css';

export function LoginView() {
  const [email, setEmail] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!email || !documentNumber) {
      setError('Por favor completa todos los campos');
      setIsLoading(false);
      return;
    }

    try {
      const response = await loginCustomer({
        email,
        documentNumber,
      });

      if (response.success && response.data) {
        // Mostrar mensaje de éxito
        (window as any).showToast?.(`¡Bienvenido ${response.data.firstName}! Cliente autenticado correctamente`, 'success', 3000);

        // Guardar datos del usuario en localStorage
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('isAuthenticated', 'true');

        // Aquí puedes redirigir o hacer algo más
        console.log('Cliente autenticado:', response.data);

        // Limpiar formulario
        setEmail('');
        setDocumentNumber('');
      } else {
        setError(response.message || 'Correo o documento inválido');
        (window as any).showToast?.(response.message || 'Correo o documento inválido', 'error', 4000);
      }
    } catch (err) {
      const errorMessage = 'Error al conectar con el servidor';
      setError(errorMessage);
      (window as any).showToast?.(errorMessage, 'error', 4000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-root">
      <div className="login-bg" />

      <div className="login-wrapper">
        {/* Logo / marca */}
        <div className="login-brand">
          <img src="/medibug.svg" alt="MediBug logo" className="login-brand__logo" />
          <span className="login-brand__name">MediBug</span>
        </div>

        {/* Tarjeta */}
        <div className="login-card">
          <div className="login-card__header">
            <h1 className="login-card__title">Iniciar sesión</h1>
            <p className="login-card__subtitle">Ingresa tus credenciales para acceder al sistema</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {/* Error message */}
            {error && (
              <div className="login-form__error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Email */}
            <div className={`login-form__field ${focusedField === 'email' ? 'is-focused' : ''}`}>
              <label htmlFor="login-email" className="login-form__label">
                Correo electrónico
              </label>
              <div className="login-form__input-wrap">
                <span className="login-form__icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                <input
                  id="login-email"
                  type="email"
                  className="login-form__input"
                  placeholder="usuario@medibug.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="email"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Documento */}
            <div className={`login-form__field ${focusedField === 'documentNumber' ? 'is-focused' : ''}`}>
              <label htmlFor="login-document" className="login-form__label">
                Número de documento
              </label>
              <div className="login-form__input-wrap">
                <span className="login-form__icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="login-document"
                  type="text"
                  className="login-form__input"
                  placeholder="Ej: 1234567890"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  onFocus={() => setFocusedField('documentNumber')}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="off"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Opciones */}
            <div className="login-form__options">
              <label className="login-form__remember">
                <input type="checkbox" disabled={isLoading} />
                <span className="login-form__checkbox" />
                <span>Recordarme</span>
              </label>
              <a href="#" className="login-form__forgot">¿Olvidaste tu contraseña?</a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={`login-form__submit ${isLoading ? 'is-loading' : ''}`}
              disabled={isLoading || !email || !documentNumber}
            >
              {isLoading
                ? <span className="login-form__spinner" />
                : 'Iniciar sesión'
              }
            </button>
          </form>

          <p className="login-card__footer">
            ¿Necesitas acceso?{' '}
            <a href="#">Contacta al administrador</a>
          </p>
        </div>

        <p className="login-legal">© 2026 MediBug · Todos los derechos reservados</p>
      </div>
    </div>
  );
}