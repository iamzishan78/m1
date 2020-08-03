import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import DragIndicatorOutlinedIcon from "@material-ui/icons/DragIndicatorOutlined";
import { sortableHandle } from "react-sortable-hoc";
import React, {
  useContext,
  useState,
  useLayoutEffect,
  useRef,
  useEffect,
  useCallback,
} from "react";
import Iframe from 'react-iframe';


const useStyles = makeStyles((theme) => ({
  header: {
    padding: "8px 8px 0 8px",
    backgroundColor:'#FFFFFF',
    color: 'black'
  },
  frame: {
    padding: "8px",
  },
}));

const DragHandle = sortableHandle(() => (
  <IconButton aria-label="drag">
    <DragIndicatorOutlinedIcon fontSize="default" htmlColor="#808080" />
  </IconButton>
));



const PermitsCard = ({ title }) => {


  const classes = useStyles();
  
  return (
    <div>
    <CardHeader
      action={<DragHandle />}
      title={'Permits by State/County'}
      className={classes.header}
    />

    <div className={classes.frame}>
    <Iframe 
      width="100%"
      height="700px"
      paddintTop="10px"
      url="https://app.powerbi.com/view?r=eyJrIjoiY2ExMzQ4Y2ItYzlkMy00NThkLTkxMGMtNTQ3ZjY0YzZjZTc1IiwidCI6IjA5YzE2ZGM1LTMxMjQtNGVjNi1hMzFhLTEyNWIzMjVmNWRlMiIsImMiOjJ9" 
      /> 
    </div>

    </div>



  );
};
export default PermitsCard;
