import React, {useState, useEffect } from "react";
import { makeStyles,useTheme } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography'
import ProductionIcon from './components/svgIcons/ProductionIcon'

// value formatters 
import formatBOE from "../Shared/valueformatters/format_boe.js"


const useStyles = makeStyles(theme => ({
    iconContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',

    },
    tex1: {
      colorPrimary: 'white'
    }
  }))


export default function Last12StatusCard(props) {
    let classes = useStyles();
    const [summary, setSummary] = useState(null);

    
    useEffect(() => {
      if (props.summary) {
        setSummary(props.summary);
        ;
      }
    }, [props.summary, setSummary]);


    return (

      <div >
    
      {summary && 


      <div className={classes.iconContainer}>

      <ProductionIcon htmlColor='black' viewBox="0 0 32 31" fontSize="large" />

      <Typography
        //classes={classes.text1}
        align="center"
        variant="subtitle2"
      >
        Last 12Mo.
      </Typography>
      <Typography
        align="center"
        //className={classes.text2}
        variant="caption"
      >
        {`${formatBOE(summary.LastTwelveMonthBOE)} BOE`}

      </Typography>
      </div>
    }

    </div>
    

    );
  };