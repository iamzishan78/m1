import React from 'react'
import { NavigationContextProvider } from './NavigationContext'
import { makeStyles } from '@material-ui/core/styles'
import Navigation from './Navigation'
const useStyles = makeStyles(theme => ({
  mapWrapper: {
    width: '100%',
    height:'100%'
  }
}))

export default function NavigationProvider(props) {
  let classes = useStyles()

  const routes = props.children.map(child => child.props)

  return (
    <NavigationContextProvider>
      <Navigation>
        {/* {props.children} */}
        {React.Children.map(props.children, child => {
          return React.cloneElement(child, { routes: routes })
        })}
      </Navigation>
    </NavigationContextProvider>
  )
}