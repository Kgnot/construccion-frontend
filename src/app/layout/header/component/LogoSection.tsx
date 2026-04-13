import type { ClassNameProp } from '../../../../shared/ui/className/ClassNameProp'
import './LogoSection.css'

interface HeaderProps extends ClassNameProp { }

export const LogoSection = ({ className = '' }: HeaderProps) => {
    return (
        <div className={'logo-section-root ' + className}>
            <span>MediBug</span>
            <img src="/medibug.svg" alt="MediBug logo" />
        </div>
    )
}