import React, {useState, useEffect } from "react";
import { makeStyles,useTheme } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography'
import PermitIcon from './components/svgIcons/PermitIcon'

// value formatters 
import convert_date from "../Shared/valueformatters/convert_date.js";


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


    
export default function PermitDateCard(props) {
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

      <PermitIcon  viewBox="0 0 256 256" fontSize="large" />

      <Typography
        //classes={classes.text1}
        align="center"
        color = 'textPrimary'
        variant="subtitle2"
      >
        Permit Date
      </Typography>
      <Typography
        align="center"
        htmlColor='white'
        //className={classes.text2}
        variant="caption"
      >
      {convert_date(summary.PermitApprovedDate)}

      </Typography>
      </div>

}

</div>


    );
  };