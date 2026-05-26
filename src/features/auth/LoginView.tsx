import { useState } from 'react';
import { login } from '../../shared/lib/customerService';
import './LoginView.css';
import { useNavigate } from 'react-router';
import { useApp } from '../../app/providers/AuthProvider';

export function LoginView() {
  const [email, setEmail] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showDocument, setShowDocument] = useState(false);
  const navigate = useNavigate();
  const { setUser, setIsAdmin, setIsAuthenticated } = useApp();
  
  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    (window as any).showToast?.(message, type, 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !documentNumber.trim()) {
      showToast('Por favor completa todos los campos', 'warning');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login({
        email: email.trim(),
        documentNumber: documentNumber.trim(),
      });

      if (result) {
        setUser(result);
        setIsAdmin(result.email === 'admin@gmail.com');
        setIsAuthenticated(true);
        console.log(result.email === 'admin@gmail.com');
        showToast(`¡Bienvenido ${result.firstName}!`, 'success');
        navigate('/home');
        // Aquí puedes redirigir al usuario o guardar los datos de sesión
        console.log('Login exitoso:', result);
        // localStorage.setItem('user', JSON.stringify(result));
        // Redirigir al dashboard u otra página
      } else {
        showToast('Email o documento incorrecto', 'error');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      showToast('Error al iniciar sesión. Intenta de nuevo.', 'error');
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
                />
              </div>
            </div>

            {/* Número de documento */}
            <div className={`login-form__field ${focusedField === 'documentNumber' ? 'is-focused' : ''}`}>
              <label htmlFor="login-document" className="login-form__label">
                Número de documento
              </label>
              <div className="login-form__input-wrap">
                <span className="login-form__icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="16" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </span>
                <input
                  id="login-document"
                  type={showDocument ? "text" : "password"}
                  className="login-form__input"
                  placeholder="Contraseña"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  onFocus={() => setFocusedField('documentNumber')}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="off"
                  required
                />
                <button
                  type="button"
                  className="login-form__eye-toggle"
                  onClick={() => setShowDocument(!showDocument)}
                  aria-label={showDocument ? "Ocultar documento" : "Mostrar documento"}
                  title={showDocument ? "Ocultar documento" : "Mostrar documento"}
                >
                  {showDocument ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Opciones */}
            <div className="login-form__options">
              <label className="login-form__remember">
                <input type="checkbox" />
                <span className="login-form__checkbox" />
                <span>Recordarme</span>
              </label>
              <a href="#" className="login-form__forgot">¿Olvidaste tu contraseña?</a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={`login-form__submit ${isLoading ? 'is-loading' : ''}`}
              disabled={isLoading}
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