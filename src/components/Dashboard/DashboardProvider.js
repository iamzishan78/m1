import React from 'react'
import { DashboardContextProvider } from './DashboardContext'
import { makeStyles } from '@material-ui/core/styles'
import Dashboard from './Dashboard'
const useStyles = makeStyles(theme => ({
  dashboardWrapper: {
    width: '100%',
    height: '100%',
  }
}))

export default function DashboardProvider(props) {
  let classes = useStyles()
  return (
    <DashboardContextProvider>
      <Dashboard className={classes.dashboardWrapper}>{props.children}</Dashboard>
    </DashboardContextProvider>
  )
}
