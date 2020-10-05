import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
const useStyles = makeStyles(theme => ({
  coordinates: {
    padding: "0 5px",
    backgroundColor: "hsla(0,0%,100%,.5)",
    margin: 0,
    fontSize: 10,
    right: "9vw",
    bottom: '12px',
    position: "absolute",
  },
  insideCoor:{
    display: "inline-block",
    padding: 3,
  }
}))


export default function Coordinates(props) {
    const classes = useStyles();
    const [lng, setLng] = useState();
    const [lat, setLat] = useState()
    const [zoom, setZoom] = useState()

    useEffect(() => {
        if (props.long && props.lat) {
            let trimmedLat = props.lat.toFixed(6)
            let trimmedLong = props.long.toFixed(6)
            setLng(trimmedLong)
            setLat(trimmedLat)

            if(props.zoom){
              let trimmedZoom = props.zoom.toFixed(6)
              setZoom(trimmedZoom)
            }

        } 
    },[props])
    
  return (
    <div className={classes.coordinates}>
        <div className={classes.insideCoor}>Lng: {lng}</div>
        <div className={classes.insideCoor}>Lat: {lat}</div>
        <div className={classes.insideCoor}>Zoom: {zoom}</div>
    </div>
  )
}