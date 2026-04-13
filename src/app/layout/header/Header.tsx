import type { ClassNameProp } from '../../../shared/ui/className/ClassNameProp'
import { HeaderActions } from './component/HeaderActions'
import { HeaderSearch } from './component/HeaderSearch'
import { LogoSection } from './component/LogoSection'
import './Header.css'

interface HeaderProps extends ClassNameProp {}

export const Header = ({ className = '' }: HeaderProps) => {
  return (
    <header className={'header ' + className}>
      <LogoSection className="logo-section" />
      <HeaderSearch className="header-search" />
      <HeaderActions className="header-actions" />
    </header>
  )
}