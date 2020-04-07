import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
const useStyles = makeStyles(theme => ({
  coordinates: {
    padding: "0 5px",
    backgroundColor: "hsla(0,0%,100%,.5)",
    margin: 0,
    fontSize: 12,
    width: 150,
    left: "35vw",
    bottom: 0,
    position: "absolute",
  },
  insideCoor:{
    display: "flex",
    // justifyContent: "space-around",
  }
}))


export default function Cordinates(props) {
    const classes = useStyles();
    const [lng, setLng] = useState();
    const [lat, setLat] = useState()

    useEffect(() => {
        if (!props) {
            console.log('undefiend')
        } else {
            setLng(props.long)
            setLat(props.lat)
        }
    },[props])
    
  return (
    <div className={classes.coordinates}>
        <div className={classes.insideCoor}>Lng:{lng}</div>
        <div className={classes.insideCoor}>Lat:{lat}</div>
    </div>
  )
}