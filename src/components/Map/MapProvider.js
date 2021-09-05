import React from 'react'
import Map from './Map'
import ErrorBoundaryComponent from 'components/Shared/ErrorBoundary/ErrorBoundary'

export default function MapProvider(props) {
  return (
    <ErrorBoundaryComponent>
      <Map>{props.children}</Map>
    </ErrorBoundaryComponent>
  )
}