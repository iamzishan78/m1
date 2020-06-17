import React from 'react'
// import { MapContextProvider } from './MapContext'
import { makeStyles } from '@material-ui/core/styles'
import Map from './Map'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
const useStyles = makeStyles(theme => ({
  mapWrapper: {
    width: '100%',
    height:'100%'
  }
}))

export default function MapProvider(props) {
  let classes = useStyles()
  return (
    // <MapContextProvider>
        <Map>{props.children}</Map>
    // </MapContextProvider>
  )
}