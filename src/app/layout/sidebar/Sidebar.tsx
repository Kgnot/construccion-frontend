import { useState } from 'react';
import type { ClassNameProp } from '../../../shared/ui/className/ClassNameProp';
import { SimpleMenu } from './components/SimpleMenu';
import { LogoutButton } from '../../../shared/ui/logout/LogoutButton';
import { sidebarMenu } from './SideBarMenu';
import './Sidebar.css';

interface SidebarProps extends ClassNameProp {}

export const Sidebar = ({ className }: SidebarProps) => {
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

    const toggleMenu = (label: string) => {
        setOpenMenus((prev) => ({
            ...prev,
            [label]: !prev[label],
        }));
    };

    const handleMenuAction = (path: string) => {
        console.log(path);
    };

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/';
    };

    return (
        <aside className={`sidebar ${className || ''}`}>
            <nav aria-label="Sidebar menu" className="sidebar__menu-list">
                {sidebarMenu.map((item) => {
                    if (!item.children) {
                        return (
                            <SimpleMenu
                                icon={item.icon}
                                key={item.label}
                                onClick={() => handleMenuAction(item.path!)}
                                text={item.label}
                            />
                        );
                    }

                    return (
                        <SimpleMenu
                            icon={item.icon}
                            isOpen={openMenus[item.label] || false}
                            key={item.label}
                            onToggle={() => toggleMenu(item.label)}
                            text={item.label}
                        >
                            {item.children.map((child) => (
                                <SimpleMenu
                                    key={child.label}
                                    onClick={() => handleMenuAction(child.path)}
                                    text={child.label}
                                />
                            ))}
                        </SimpleMenu>
                    );
                })}
            </nav>

            <div className="sidebar__footer">
                <LogoutButton onLogout={handleLogout} />
            </div>
        </aside>
    );
};