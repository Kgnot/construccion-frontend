import { ActionMenuPanel } from '../dropdown'

interface ProfileActionProps {
  initials: string
  isOpen: boolean
  onToggle: () => void
}

export const ProfileAction = ({ initials, isOpen, onToggle }: ProfileActionProps) => {
  return (
    <div className="header-actions-anchor">
      <button
        type="button"
        className="header-actions-avatar-btn"
        aria-label={`Perfil de ${initials}`}
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <div className="header-actions-avatar">{initials}</div>
      </button>

      <div
        className={`header-actions-popover header-actions-popover--profile ${isOpen ? 'is-open' : ''}`}
        aria-hidden={!isOpen}
      >
        <ActionMenuPanel
          title="Tu cuenta"
          items={[
            { label: 'Perfil' },
            { label: 'Configuración' },
            { label: 'Cerrar sesión' },
          ]}
        />
      </div>
    </div>
  )
}
