import { useEffect, useRef, useState } from 'react'
import type { ClassNameProp } from '../../../../shared/ui/className/ClassNameProp'
import { MessagesAction, NotificationsAction, ProfileAction } from './components'
import './HeaderActions.css'

interface HeaderActionsProps extends ClassNameProp {
  hasNotifications?: boolean
  hasMessages?: boolean
  initials?: string
}

type ActionPanelKey = 'notifications' | 'messages' | 'profile' | null

export const HeaderActions = ({
  className = '',
  hasNotifications = false,
  hasMessages = false,
  initials = 'KG',
}: HeaderActionsProps) => {
  const [activePanel, setActivePanel] = useState<ActionPanelKey>(null)
  const rootRef = useRef<HTMLDivElement | null>(null)

  const togglePanel = (panel: Exclude<ActionPanelKey, null>) => {
    setActivePanel((prev) => (prev === panel ? null : panel))
  }

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setActivePanel(null)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActivePanel(null)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    window.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      window.removeEventListener('keydown', handleEscape)
    }
  }, [])

  return (
    <div ref={rootRef} className={`header-actions-root ${className}`}>
      <NotificationsAction
        hasNotifications={hasNotifications}
        isOpen={activePanel === 'notifications'}
        onToggle={() => togglePanel('notifications')}
      />

      <MessagesAction
        hasMessages={hasMessages}
        isOpen={activePanel === 'messages'}
        onToggle={() => togglePanel('messages')}
      />

      <div className="header-actions-divider" />

      <ProfileAction
        initials={initials}
        isOpen={activePanel === 'profile'}
        onToggle={() => togglePanel('profile')}
      />
    </div>
  )
}