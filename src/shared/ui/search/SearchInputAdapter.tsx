import { useEffect, useRef, useState } from 'react'
import type { ClassNameProp } from '../className/ClassNameProp'
import { Modal } from '../modal'
import { ModalBackdrop } from '../modal'
import './SearchInputAdapter.css'

export interface SearchItem {
  id: string
  label: string
  meta?: string
}

interface SearchInputAdapterProps extends ClassNameProp {
  title?: string
  placeholder?: string
  emptyText?: string
  triggerLabel?: string
  shortcutHint?: string
  open: boolean
  query: string
  items: SearchItem[]
  onOpen: () => void
  onClose: () => void
  onQueryChange: (value: string) => void
  onSelectItem?: (item: SearchItem) => void
}

type AnimationPhase = 'hidden' | 'enter' | 'open' | 'closing'

const ANIMATION_MS = 180

export const SearchInputAdapter = ({
  className = '',
  title = 'Buscar',
  placeholder = 'Buscar...',
  emptyText = 'Sin resultados',
  triggerLabel = 'Buscar',
  shortcutHint = 'Ctrl+K',
  open,
  query,
  items,
  onOpen,
  onClose,
  onQueryChange,
  onSelectItem,
}: SearchInputAdapterProps) => {
  const [isRendered, setIsRendered] = useState(false)
  const [phase, setPhase] = useState<AnimationPhase>('hidden')

  const raf1Ref = useRef<number | null>(null)
  const raf2Ref = useRef<number | null>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (open) {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current)
        closeTimerRef.current = null
      }

      setIsRendered(true)
      setPhase('enter')

      raf1Ref.current = requestAnimationFrame(() => {
        raf2Ref.current = requestAnimationFrame(() => {
          setPhase('open')
        })
      })
      return
    }

    if (isRendered) {
      setPhase('closing')
      closeTimerRef.current = setTimeout(() => {
        setIsRendered(false)
        setPhase('hidden')
      }, ANIMATION_MS)
    }
  }, [open, isRendered])

  useEffect(() => {
    if (!isRendered) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isRendered, onClose])

  useEffect(() => {
    return () => {
      if (raf1Ref.current) cancelAnimationFrame(raf1Ref.current)
      if (raf2Ref.current) cancelAnimationFrame(raf2Ref.current)
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    }
  }, [])

  return (
    <div className={'search-adapter ' + className}>
      <button
        type="button"
        className="search-trigger"
        aria-label={triggerLabel}
        onClick={onOpen}
      >
        <span className="search-trigger__icon" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="m21 21-4.3-4.3m1.3-5.2a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <span className="search-trigger__text">{triggerLabel}</span>
        <kbd className="search-trigger__kbd">{shortcutHint}</kbd>
      </button>

      {isRendered && (
        <ModalBackdrop phase={phase} onClick={onClose}>
          <Modal ariaLabel={title} className="search-adapter-panel" phase={phase} onClick={(e) => e.stopPropagation()}>
            <div className="search-adapter-top">
              <input
                type="search"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder={placeholder}
                autoFocus
              />
              <button type="button" onClick={onClose} aria-label="Cerrar busqueda">
                Cerrar
              </button>
            </div>

            <ul className="search-adapter-results">
              {items.length === 0 && <li className="search-adapter-empty">{emptyText}</li>}

              {items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className="search-adapter-item"
                    onClick={() => {
                      onSelectItem?.(item)
                      onClose()
                    }}
                  >
                    <span>{item.label}</span>
                    {item.meta && <small>{item.meta}</small>}
                  </button>
                </li>
              ))}
            </ul>
          </Modal>
        </ModalBackdrop>
      )}
    </div>
  )
}