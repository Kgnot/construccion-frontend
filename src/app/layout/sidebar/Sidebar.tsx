import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import type { ClassNameProp } from '../../../shared/ui/className/ClassNameProp';
import { SimpleMenu } from './components/SimpleMenu';
import { LogoutButton } from '../../../shared/ui/logout/LogoutButton';
import { sidebarMenu } from './SideBarMenu';
import './Sidebar.css';

interface SidebarProps extends ClassNameProp {}

export const Sidebar = ({ className }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleMenu = (label: string) => {
    setActiveMenu((prev) => (prev === label ? null : label));
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  };

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      if (next) setActiveMenu(null);
      return next;
    });
  };

  const isActive = (path: string) => location.pathname === path;

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
          {isCollapsed ? '\u25b8' : '\u25c2'}
        </button>
      </div>

      <nav aria-label="Sidebar menu" className="sidebar__menu-list">
        {sidebarMenu.map((item) => {
          const hasActiveChild =
            item.children?.some((child) => isActive(child.path)) ?? false;
          const isItemActive = isActive(item.path);

          if (!item.children) {
            return (
              <SimpleMenu
                active={isItemActive}
                collapsed={isCollapsed}
                icon={item.icon}
                key={item.label}
                to={item.path}
                text={item.label}
              />
            );
          }

          return (
            <SimpleMenu
              active={hasActiveChild || isItemActive}
              collapsed={isCollapsed}
              icon={item.icon}
              isOpen={!isCollapsed && activeMenu === item.label}
              key={item.label}
              onClick={isCollapsed && item.path ? () => navigate(item.path) : undefined}
              onToggle={isCollapsed ? undefined : () => toggleMenu(item.label)}
              text={item.label}
            >
              {item.children.map((child) => (
                <SimpleMenu
                  active={isActive(child.path)}
                  collapsed={isCollapsed}
                  key={child.label}
                  to={child.path}
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
          label={isCollapsed ? '\u238b' : 'Salir'}
          onLogout={handleLogout}
        />
      </div>
    </aside>
  );
};
