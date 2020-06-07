import React from 'react'
import { AlertsContextProvider } from './AlertsContext'
import { makeStyles } from '@material-ui/core/styles'
import Alerts from './Alerts'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
const useStyles = makeStyles(theme => ({
  alertsWrapper: {
    width: '100%',
    height:'100%'
  }
}))

export default function AlertsProvider(props) {
  let classes = useStyles()
  return (
    <AlertsContextProvider>
        <Alerts className={classes.alertsWrapper}>{props.children}</Alerts>
    </AlertsContextProvider>
  )
}