import React, { useContext } from 'react';
import { AppContext } from '../../AppContext'
import { StudioContext } from './StudioContext'
import { MapContext } from '../Map/MapContext'
import { Container } from '@material-ui/core';
import Iframe from 'react-iframe';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: "10px",
    paddingBottom: "10px",
    maxHeight: "100%",
    height:"100%"
  },
  iframe: {
    width: "100%",
    height: "100%",
    overflow:"hidden"
  },
}));

export default function Studio() {
  const classes = useStyles();
    return (

    /// TODO : check for configuration to host url, check if customer width & height is needed.
      <Container maxWidth="xl" className={classes.container}  >
         <Iframe className={classes.iframe} url="https://studio.m1neral.com"  frameBorder="0" scrolling="no"/> 
      </Container>


    );
  }

