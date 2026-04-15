import type { ClassNameProp } from '../className/ClassNameProp';
import './Modal.css';

type ModalState = 'hidden' | 'enter' | 'open' | 'closing';

interface ModalProps extends ClassNameProp {
    ariaLabel: string;
    children: React.ReactNode;
    phase?: ModalState;
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export const Modal = ({ ariaLabel, children, className = '', phase = 'open', onClick }: ModalProps) => {
    return (
        <div
            aria-label={ariaLabel}
            aria-modal="true"
            className={['ui-modal', `is-${phase}`, className].filter(Boolean).join(' ')}
            onClick={onClick}
            role="dialog"
        >
            {children}
        </div>
    );
};
