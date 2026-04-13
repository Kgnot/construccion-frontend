import { useMemo, useState } from 'react'
import type { ClassNameProp } from '../../../../shared/ui/className/ClassNameProp'
import { SearchInputAdapter, type SearchItem } from '../../../../shared/ui/search/SearchInputAdapter'
import './HeaderSearch.css'

interface HeaderSearchProps extends ClassNameProp {}

export const HeaderSearch = ({ className = '' }: HeaderSearchProps) => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const sourceItems = useMemo<SearchItem[]>(
    () => [
      { id: 'p-001', label: 'Ana Lopez', meta: 'Paciente' },
      { id: 't-014', label: 'Error monitor de signos', meta: 'Ticket' },
      { id: 'd-102', label: 'Bomba de infusion BX-102', meta: 'Equipo' },
    ],
    []
  )

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return sourceItems
    return sourceItems.filter((item) => item.label.toLowerCase().includes(q))
  }, [sourceItems, query])

  return (
    <div className={'header-search-root ' + className}>
      <SearchInputAdapter
        title="Busqueda global"
        triggerLabel="Buscar pacientes, tickets, equipos..."
        placeholder="Escribe para buscar"
        emptyText="No encontramos coincidencias"
        shortcutHint="Ctrl+K"
        open={open}
        query={query}
        items={filteredItems}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        onQueryChange={setQuery}
        onSelectItem={(item) => {
          console.log('Header selected:', item)
          setOpen(false)
        }}
      />
    </div>
  )
}