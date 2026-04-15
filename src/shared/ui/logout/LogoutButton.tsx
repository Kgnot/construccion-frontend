import type { ClassNameProp } from '../className/ClassNameProp';
import './LogoutButton.css';

interface LogoutButtonProps extends ClassNameProp {
    label?: string;
    onLogout?: () => void;
}

const defaultLogout = () => {
    const shouldLogout = window.confirm('Deseas cerrar sesion?');

    if (!shouldLogout) {
        return;
    }

    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
};

export const LogoutButton = ({ className = '', label = 'Salir', onLogout }: LogoutButtonProps) => {
    const handleLogout = () => {
        if (onLogout) {
            onLogout();
            return;
        }

        defaultLogout();
    };

    return (
        <button className={['logout-button', className].filter(Boolean).join(' ')} onClick={handleLogout} type="button">
            {label}
        </button>
    );
};
