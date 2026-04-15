import { Children } from 'react';
import type { ClassNameProp } from '../../../../shared/ui/className/ClassNameProp';
import './SimpleMenu.css';

interface SimpleMenuProps extends ClassNameProp {
    active?: boolean;
    children?: React.ReactNode;
    collapsed?: boolean;
    icon?: string;
    isOpen?: boolean;
    onClick?: () => void;
    onToggle?: () => void;
    text: string;
}

export const SimpleMenu = ({
    active = false,
    text,
    className,
    children,
    collapsed = false,
    icon,
    isOpen = false,
    onClick,
    onToggle,
}: SimpleMenuProps) => {
    const hasChildren = Children.count(children) > 0;

    const handleClick = () => {
        if (hasChildren) {
            if (collapsed && onClick) {
                onClick();
                return;
            }

            if (onToggle) {
                onToggle();
            }
            return;
        }

        if (onClick) {
            onClick();
        }
    };

    return (
        <div className={["simple-menu", className].filter(Boolean).join(' ')}>
            <button
                aria-expanded={hasChildren && !collapsed ? isOpen : undefined}
                className={`simple-menu__trigger ${collapsed ? 'is-collapsed' : ''} ${active ? 'is-active' : ''}`}
                onClick={handleClick}
                type="button"
                title={collapsed ? text : undefined}
            >
                {icon && (
                    <img
                        alt={`${text} icon`}
                        className="simple-menu__icon"
                        src={`/icons/${icon}.svg`}
                    />
                )}
                <span className={`simple-menu__label ${collapsed ? 'is-collapsed' : ''}`}>{text}</span>
                {hasChildren && !collapsed && (
                    <span aria-hidden="true" className={`simple-menu__indicator ${isOpen ? 'is-open' : ''}`}>
                        ▸
                    </span>
                )}
            </button>

            {hasChildren && !collapsed && (
                <div className={`simple-menu__children ${isOpen ? 'is-open' : ''}`}>
                    <div className="simple-menu__children-inner">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};