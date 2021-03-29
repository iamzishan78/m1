import React from 'react'
import { MapGridContextProvider } from './MapGridContext'
import { makeStyles } from '@material-ui/core/styles'
import MapGridCard from './MapGridCard'
const useStyles = makeStyles(theme => ({
  mapWrapper: {
    width: '100%',
    height:'100%'
  }
}))

export default function MapGridProvider(props) {
  let classes = useStyles()
  return (
    <MapGridContextProvider>
        <MapGridCard>{props.children}</MapGridCard>
    </MapGridContextProvider>
  )
}