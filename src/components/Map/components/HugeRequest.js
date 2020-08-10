import React from 'react'
import { Modal } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
const useStyles = makeStyles(theme => ({
  hugeRequestBox: {
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
    borderRadius: '4px',
    color: '#ff7b08'
  }
}))


export default function HugeRequest(props) {
    const classes = useStyles();
    
    if (props.hugeRequestStatus) {
      return (
        <div className={classes.hugeRequestBox}>
          You've select too many wells to track.
        </div>
      )
    } else {
      return null
    } 
}