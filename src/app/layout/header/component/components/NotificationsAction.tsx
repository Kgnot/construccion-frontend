import { ActionMenuPanel } from '../dropdown'

interface NotificationsActionProps {
  hasNotifications?: boolean
  isOpen: boolean
  onToggle: () => void
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

export const NotificationsAction = ({
  hasNotifications = false,
  isOpen,
  onToggle,
}: NotificationsActionProps) => {
  return (
    <div className="header-actions-anchor">
      <button
        type="button"
        className="header-actions-btn"
        aria-label="Notificaciones"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <BellIcon />
        {hasNotifications && <span className="header-actions-badge" aria-hidden="true" />}
      </button>

      <div
        className={`header-actions-popover ${isOpen ? 'is-open' : ''}`}
        aria-hidden={!isOpen}
      >
        <ActionMenuPanel
          title="Notificaciones"
          emptyText="No tienes notificaciones por ahora."
        />
      </div>
    </div>
  )
}
