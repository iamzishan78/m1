import { NavigationContext } from 'components/Navigation/NavigationContext';
import * as React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import ErrorFallback from './ErrorFallback'

function ErrorBoundaryComponent({ children }) {
    // const [_, __, navResetAll] = React.useContext(NavigationContext);
    return (
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => {
            // navResetAll()
        }}>
            {children}
        </ErrorBoundary>
    )
}

export default ErrorBoundaryComponent