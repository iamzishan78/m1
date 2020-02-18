import React from 'react'
import { TrackContextProvider } from './TrackContext'
import { makeStyles } from '@material-ui/core/styles'
import Track from './Track'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
const useStyles = makeStyles(theme => ({
  trackWrapper: {
    width: '100%',
    height:'100%'
  }
}))

export default function TrackProvider(props) {
  let classes = useStyles()
  return (
    <TrackContextProvider>
        <Track className={classes.trackWrapper}>{props.children}</Track>
    </TrackContextProvider>
  )
}