import type { ClassNameProp } from '../../../../../shared/ui/className/ClassNameProp'
import './ActionMenuPanel.css'

export interface ActionMenuItem {
  label: string
  onClick?: () => void
}

interface ActionMenuPanelProps extends ClassNameProp {
  title: string
  emptyText?: string
  items?: ActionMenuItem[]
}

export const ActionMenuPanel = ({
  className = '',
  title,
  emptyText = 'Sin elementos por ahora.',
  items = [],
}: ActionMenuPanelProps) => {
  return (
    <div className={`action-menu-panel ${className}`} role="menu" aria-label={title}>
      <p className="action-menu-panel__title">{title}</p>

      {items.length === 0 ? (
        <p className="action-menu-panel__empty">{emptyText}</p>
      ) : (
        <ul className="action-menu-panel__list">
          {items.map((item) => (
            <li key={item.label}>
              <button
                type="button"
                className="action-menu-panel__item"
                onClick={item.onClick}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
