import { useState } from 'react';
import type { ClassNameProp } from '../../../shared/ui/className/ClassNameProp'
import { LogoutButton } from '../../../shared/ui/logout/LogoutButton'
import { SimpleMenu } from './components/SimpleMenu'
import './Sidebar.css'

interface SidebarProps extends ClassNameProp {
}
export const Sidebar = ({ className }: SidebarProps) => {
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
        appointments: false,
        patients: false,
    });

    const toggleMenu = (menuKey: 'appointments' | 'patients') => {
        setOpenMenus((prev) => ({
            ...prev,
            [menuKey]: !prev[menuKey],
        }));
    };

    const handleMenuAction = (label: string) => {
        console.log(`Selected menu item: ${label}`);
    };

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/';
    };

    return (
        <aside className={`sidebar ${className}`}>
            <nav aria-label="Sidebar menu" className="sidebar__menu-list">
                <SimpleMenu onClick={() => handleMenuAction('Dashboard')} text="Dashboard" />

                <SimpleMenu
                    isOpen={openMenus.patients}
                    onToggle={() => toggleMenu('patients')}
                    text="Patients"
                >
                    <SimpleMenu onClick={() => handleMenuAction('Patients List')} text="List" />
                    <SimpleMenu onClick={() => handleMenuAction('Patients Add New')} text="Add New" />
                </SimpleMenu>

                <SimpleMenu
                    isOpen={openMenus.appointments}
                    onToggle={() => toggleMenu('appointments')}
                    text="Appointments"
                >
                    <SimpleMenu onClick={() => handleMenuAction('Appointments Upcoming')} text="Upcoming" />
                    <SimpleMenu onClick={() => handleMenuAction('Appointments Past')} text="Past" />
                </SimpleMenu>

                <SimpleMenu onClick={() => handleMenuAction('Settings')} text="Settings" />
            </nav>

            <div className="sidebar__footer">
                <LogoutButton onLogout={handleLogout} />
            </div>
        </aside>
    )
}