import { useState } from 'react';
import type { ClassNameProp } from '../../../shared/ui/className/ClassNameProp';
import { SimpleMenu } from './components/SimpleMenu';
import { LogoutButton } from '../../../shared/ui/logout/LogoutButton';
import { sidebarMenu } from './SideBarMenu';
import './Sidebar.css';

interface SidebarProps extends ClassNameProp {
    activePath: string;
    onNavigate: (path: string) => void;
}

export const Sidebar = ({ className, activePath, onNavigate }: SidebarProps) => {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleMenu = (label: string) => {
        setActiveMenu((prev) => (prev === label ? null : label));
    };

    const handleMenuAction = (path: string) => {
        onNavigate(path);
    };

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/';
    };

    const toggleSidebar = () => {
        setIsCollapsed((prev) => {
            const next = !prev;

            if (next) {
                setActiveMenu(null);
            }

            return next;
        });
    };

    return (
        <aside
            className={`sidebar ${isCollapsed ? 'is-collapsed' : ''} ${className || ''}`}
            style={{
                width: isCollapsed ? '4.4rem' : '14rem',
                flexBasis: isCollapsed ? '4.4rem' : '14rem',
            }}
        >
            <div className="sidebar__top">
                <button
                    aria-label={isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
                    className="sidebar__toggle-btn"
                    onClick={toggleSidebar}
                    type="button"
                >
                    {isCollapsed ? '▸' : '◂'}
                </button>
            </div>

            <nav aria-label="Sidebar menu" className="sidebar__menu-list">
                {sidebarMenu.map((item) => {
                    const hasActiveChild =
                        item.children?.some((child) => child.path === activePath) ?? false;

                    if (!item.children) {
                        return (
                            <SimpleMenu
                                active={item.path === activePath}
                                collapsed={isCollapsed}
                                icon={item.icon}
                                key={item.label}
                                onClick={() => handleMenuAction(item.path!)}
                                text={item.label}
                            />
                        );
                    }

                    return (
                        <SimpleMenu
                            active={hasActiveChild}
                            collapsed={isCollapsed}
                            icon={item.icon}
                            isOpen={!isCollapsed && activeMenu === item.label}
                            key={item.label}
                            onToggle={isCollapsed ? undefined : () => toggleMenu(item.label)}
                            text={item.label}
                        >
                            {item.children.map((child) => (
                                <SimpleMenu
                                    active={child.path === activePath}
                                    collapsed={isCollapsed}
                                    key={child.label}
                                    onClick={() => handleMenuAction(child.path)}
                                    text={child.label}
                                />
                            ))}
                        </SimpleMenu>
                    );
                })}
            </nav>

            <div className={`sidebar__footer ${isCollapsed ? 'is-collapsed' : ''}`}>
                <LogoutButton
                    className={isCollapsed ? 'sidebar__logout-compact' : ''}
                    label={isCollapsed ? '⎋' : 'Salir'}
                    onLogout={handleLogout}
                />
            </div>
        </aside>
    );
};