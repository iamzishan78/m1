import React from 'react'
import { Modal } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
const useStyles = makeStyles(theme => ({
  drawStatusBox: {
    padding: '0px 15px',
    backgroundColor: "white",
    margin: 0,
    fontSize: 15,
    display: 'flex',
    alignItems: 'center',
    fontWeight: 'bold',
    left: "2vw",
    top: '80px',
    height: '29px',
    position: "absolute",
    borderRadius: '4px'
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