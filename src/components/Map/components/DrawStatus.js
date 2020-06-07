import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
const useStyles = makeStyles(theme => ({
  drawStatusBox: {
    padding: 3,
    backgroundColor: "white",
    margin: 0,
    fontSize: 18,
    left: "2vw",
    top: '80px',
    position: "absolute",
    border: '1px solid'
  }
}))


export default function DrawStatus(props) {
    const classes = useStyles();
    
    if (props.drawingStatus) {
      return (
        <div className={classes.drawStatusBox}>
            Drawing Mode Activated
        </div>
      )
    } else {
      return null
    } 
}