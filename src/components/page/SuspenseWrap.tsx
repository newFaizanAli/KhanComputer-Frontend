import { Suspense, type ReactNode } from 'react'

const SuspenseWrap = ({ children }: {
    children: ReactNode
}) => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="p-6 fade-in">
                {children}
            </div>

        </Suspense>
    )
}

export default SuspenseWrap
