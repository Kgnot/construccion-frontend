import type { ClassNameProp } from '../../../../shared/ui/className/ClassNameProp'
import './HeaderActions.css'

interface HeaderActionsProps extends ClassNameProp {
  hasNotifications?: boolean
  hasMessages?: boolean
  initials?: string
}

const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M6 10a6 6 0 1 1 12 0v4l1.5 2H4.5L6 14v-4Zm4.5 8a1.5 1.5 0 0 0 3 0"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const MessageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M7 8h10M7 12h7m7-1a8 8 0 0 1-8 8H7l-4 3v-7a8 8 0 1 1 18-4Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const HeaderActions = ({
  className = '',
  hasNotifications = false,
  hasMessages = false,
  initials = 'KG',
}: HeaderActionsProps) => {
  return (
    <div className={`header-actions-root ${className}`}>
      <button type="button" className="header-actions-btn" aria-label="Notificaciones">
        <BellIcon />
        {hasNotifications && <span className="header-actions-badge" aria-hidden="true" />}
      </button>

      <button type="button" className="header-actions-btn" aria-label="Mensajería">
        <MessageIcon />
        {hasMessages && <span className="header-actions-badge" aria-hidden="true" />}
      </button>

      <div className="header-actions-divider" />

      <button type="button" className="header-actions-avatar-btn" aria-label={`Perfil de ${initials}`}>
        <div className="header-actions-avatar">{initials}</div>
      </button>
    </div>
  )
}