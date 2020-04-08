import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
const useStyles = makeStyles(theme => ({
  coordinates: {
    padding: "0 5px",
    backgroundColor: "hsla(0,0%,100%,.5)",
    margin: 0,
    fontSize: 12,
    // width: 150,
    left: "15vw",
    bottom: 0,
    position: "absolute",
  },
  insideCoor:{
    display: "inline-block",
    padding: 3,
    // justifyContent: "space-around",
  }
}))


export default function Cordinates(props) {
    const classes = useStyles();
    const [lng, setLng] = useState();
    const [lat, setLat] = useState()
    console.log("test")
    useEffect(() => {
        if (props.long && props.lat) {
            let length = 12;
            let latToString = props.lat.toString();
            let longToString = props.long.toString();
            let trimmedLat = latToString.length > length ? 
            latToString.substring(0, length - 3) : latToString
            let trimmedLong = longToString.length > length ? 
            longToString.substring(0, length - 3) : longToString
            setLng(trimmedLong)
            setLat(trimmedLat)
        } 
    },[props])
    
  return (
    <div className={classes.coordinates}>
        <div className={classes.insideCoor}>Lng:{lng}</div>
        <div className={classes.insideCoor}>Lat:{lat}</div>
    </div>
  )
}