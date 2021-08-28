import React, { useContext,useState,useEffect} from 'react';
import { makeStyles,useTheme } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography'
import RigIcon from './components/svgIcons/RigIcon'
import moment from 'moment'

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

  
export default function SpudDateCard(props) {
    let classes = useStyles();
    const [summary, setSummary] = useState(null);

    useEffect(() => {
      if (props.summary) {
        setSummary(props.summary);
        ;
      }
    }, [props.summary, setSummary]);
  

    return (

      <div>

      {summary && 

      <div className={classes.iconContainer}>

      <RigIcon htmlColor='black' viewBox="65.8 0 481.7 792" fontSize="large" />

      <Typography
        align="center"
        variant="subtitle2"
      >
        Spud Date
      </Typography>
      <Typography
        align="center"
        variant="caption"
      >
      {convert_date(summary.SpudDate)}

      </Typography>
      </div>
      }
      
      </div>


    );
  };