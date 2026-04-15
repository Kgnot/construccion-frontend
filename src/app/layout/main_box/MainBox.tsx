import type { ClassNameProp } from '../../../shared/ui/className/ClassNameProp'
import './MainBox.css'
// import { TelemetryWsMockPanel } from './mock/TelemetryWsMockPanel'

interface MainBoxProps extends ClassNameProp {
    children?: React.ReactNode
}

export const MainBox = ({ className, children }: MainBoxProps) => {
    return (
        <>
            <main className={`main-box ${className}`}>
                {/* <TelemetryWsMockPanel /> */}
                {children}

            </main>
        </>
    )
}