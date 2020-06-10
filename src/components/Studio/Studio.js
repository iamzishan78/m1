import React, { useContext } from 'react';
import { AppContext } from '../../AppContext'
import { StudioContext } from './StudioContext'
import { MapContext } from '../Map/MapContext'
import { Container } from '@material-ui/core';
import Iframe from 'react-iframe';

export default function Studio() {

    return (

    /// TODO : check for configuration to host url, check if customer width & height is needed.
      <Container >
         <Iframe url="https://studio.m1neral.com" /> 
      </Container>


    );
  }

