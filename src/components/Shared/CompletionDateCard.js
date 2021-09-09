import React, {useState, useEffect } from "react";
import { makeStyles,useTheme } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography'
import CompletionIcon from './components/svgIcons/CompletionIcon'

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



  
export default function CompletionDateCard(props) {
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

      <CompletionIcon  viewBox="0 0 77.5 60.5" fontSize="large" />

      <Typography
        //classes={classes.text1}
        align="center"
        color = 'textPrimary'
        variant="subtitle2"
      >
        Comp Date
      </Typography>
      <Typography
        align="center"
        htmlColor='white'
        //className={classes.text2}
        variant="caption"
      >
      {convert_date(summary.CompletionDate)}
      </Typography>
      </div>

}

</div>


    );
  };