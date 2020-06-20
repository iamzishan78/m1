import React, { useContext } from 'react';
import { AppContext } from '../../AppContext'
import { StudioContext } from './StudioContext'
import { Container } from '@material-ui/core';
import Iframe from 'react-iframe';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    //paddingTop: "10px",
    //paddingBottom: "10px",
    //maxHeight: "100%",
    //height:"100%"
  },
  iframe: {
    overflow:"hidden",
    floatLeft: 'left',
    paddingTop: '0px',
    marginTop: '-10px',
    marginLeft: '-10px',
    width: "calc(100vw + 10px)",
    height: "calc(100% + 10px)",
    },
}));

export default function Studio() {
  const classes = useStyles();
    return (

    /// TODO : check for configuration to host url, check if customer width & height is needed.
      // <Container 
      //     //maxWidth="xl" 
      //     width="100%"
      //     className={classes.container}
      //       >
         
         <Iframe 
              className={classes.iframe} 
              url="https://studio.m1neral.com"  
              // url="https://m1studio-dev.azurewebsites.net/"
              frameBorder="0" 
              scrolling="no"
              /> 

      // </Container>


    );
  }

