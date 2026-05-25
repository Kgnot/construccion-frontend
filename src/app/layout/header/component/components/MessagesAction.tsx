import { ActionMenuPanel } from '../dropdown'

interface MessagesActionProps {
  hasMessages?: boolean
  isOpen: boolean
  onToggle: () => void
}

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

export const MessagesAction = ({
  hasMessages = false,
  isOpen,
  onToggle,
}: MessagesActionProps) => {
  return (
    <div className="header-actions-anchor">
      <button
        type="button"
        className="header-actions-btn"
        aria-label="Mensajería"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <MessageIcon />
        {hasMessages && <span className="header-actions-badge" aria-hidden="true" />}
      </button>

      <div
        className={`header-actions-popover ${isOpen ? 'is-open' : ''}`}
        aria-hidden={!isOpen}
      >
        <ActionMenuPanel
          title="Mensajes"
          emptyText="No tienes mensajes por ahora."
        />
      </div>
    </div>
  )
}
