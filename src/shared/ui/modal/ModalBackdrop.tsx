import type { ClassNameProp } from '../className/ClassNameProp';
import './Modal.css';

type ModalState = 'hidden' | 'enter' | 'open' | 'closing';

interface ModalBackdropProps extends ClassNameProp {
    children?: React.ReactNode;
    phase?: ModalState;
    onClick?: () => void;
}

export const ModalBackdrop = ({ children, className = '', phase = 'open', onClick }: ModalBackdropProps) => {
    return (
        <div
            className={['ui-modal-backdrop', `is-${phase}`, className].filter(Boolean).join(' ')}
            onClick={onClick}
        >
            {children}
        </div>
    );
};
