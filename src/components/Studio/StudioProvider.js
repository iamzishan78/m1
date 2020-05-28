import React from 'react'
import { StudioContextProvider } from './StudioContext'
import { makeStyles } from '@material-ui/core/styles'
import Studio from './Studio'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
const useStyles = makeStyles(theme => ({
  studioWrapper: {
    width: '100%',
    height:'100%'
  }
}))

export default function StudioProvider(props) {
  let classes = useStyles()
  return (
    <StudioContextProvider>
        <Studio className={classes.studioWrapper}>{props.children}</Studio>
    </StudioContextProvider>
  )
}