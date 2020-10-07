import React from 'react'
import { ProfileContextProvider } from './ProfileContext';
import { makeStyles } from '@material-ui/core/styles'
import ProfileDetails from './ProfileDetails'
import InitializeProfile from "./InitializeProfileContext";

const useStyles = makeStyles(theme => ({
  trackWrapper: {
    width: '100%',
    height:'100%'
  }
}))

export default function ProfileDetailsProvider(props) {
  let classes = useStyles()
  return (
    <ProfileContextProvider>
        <InitializeProfile />
        <ProfileDetails className={classes.trackWrapper}>{props.children}</ProfileDetails>
    </ProfileContextProvider>
  )
}