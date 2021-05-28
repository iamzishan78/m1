import React from 'react'
import { MapGridContextProvider } from './MapGridContext'
import MapGridCard from './MapGridCard'

export default function MapGridProvider(props) {
  return (
    <MapGridContextProvider>
        <MapGridCard>{props.children}</MapGridCard>
    </MapGridContextProvider>
  )
}