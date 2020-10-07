import React from 'react'
import { ProfileContextProvider } from './ProfileContext';
import { makeStyles } from '@material-ui/core/styles'
import Profile from './Profile'
import InitializeProfile from "./InitializeProfileContext";

const useStyles = makeStyles(theme => ({
  trackWrapper: {
    width: '100%',
    height:'100%'
  }
}))

export default function ProfileProvider(props) {
  let classes = useStyles()
  return (
    <ProfileContextProvider>
        <InitializeProfile />
        <Profile className={classes.trackWrapper}>{props.children}</Profile>
    </ProfileContextProvider>
  )
}