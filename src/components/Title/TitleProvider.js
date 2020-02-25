import React from 'react'
import { TitleContextProvider } from './TitleContext'
import { makeStyles } from '@material-ui/core/styles'
import Title from './Title'
const useStyles = makeStyles(theme => ({
  titleWrapper: {
    width: '100%',
    height:'100%'
  }
}))

export default function TitleProvider(props) {
  let classes = useStyles()
  return (
    <TitleContextProvider>
        <Title className={classes.titleWrapper}>{props.children}</Title>
    </TitleContextProvider>
  )
}