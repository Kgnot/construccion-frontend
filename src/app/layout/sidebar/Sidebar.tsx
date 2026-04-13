import type { ClassNameProp } from '../../../shared/ui/className/ClassNameProp'
import './Sidebar.css'

interface SidebarProps extends ClassNameProp {
}
export const Sidebar = ({ className }: SidebarProps) => {

    return (
        <>
            <aside className={`sidebar ${className}`}>

            </aside>

        </>
    )
}