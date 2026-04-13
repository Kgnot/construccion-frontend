import type { ClassNameProp } from '../../../shared/ui/className/ClassNameProp'
import './MainBox.css'
import { TelemetryWsMockPanel } from './mock/TelemetryWsMockPanel'

interface MainBoxProps extends ClassNameProp {
}

export const MainBox = ({ className }: MainBoxProps) => {
    return (
        <>
            <main className={`main-box ${className}`}>
                <TelemetryWsMockPanel />

            </main>
        </>
    )
}