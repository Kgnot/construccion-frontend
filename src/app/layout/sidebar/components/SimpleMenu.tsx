import { Children } from 'react';
import type { ClassNameProp } from '../../../../shared/ui/className/ClassNameProp';
import './SimpleMenu.css';

interface SimpleMenuProps extends ClassNameProp {
    children?: React.ReactNode;
    isOpen?: boolean;
    onClick?: () => void;
    onToggle?: () => void;
    text: string;
}

export const SimpleMenu = ({
    text,
    className,
    children,
    isOpen = false,
    onClick,
    onToggle,
}: SimpleMenuProps) => {
    const hasChildren = Children.count(children) > 0;

    const handleClick = () => {
        if (hasChildren) {
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
                aria-expanded={hasChildren ? isOpen : undefined}
                className="simple-menu__trigger"
                onClick={handleClick}
                type="button"
            >
                <span className="simple-menu__label">{text}</span>
                {hasChildren && (
                    <span aria-hidden="true" className={`simple-menu__indicator ${isOpen ? 'is-open' : ''}`}>
                        ▸
                    </span>
                )}
            </button>

            {hasChildren && (
                <div className={`simple-menu__children ${isOpen ? 'is-open' : ''}`}>
                    <div className="simple-menu__children-inner">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};