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
    backgroundColor:'#011133',
    color: 'white'
  },
  frame: {
    padding: "8px",
  },
}));

const DragHandle = sortableHandle(() => (
  <IconButton aria-label="drag">
    <DragIndicatorOutlinedIcon fontSize="default" htmlColor="#fff" />
  </IconButton>
));



const RigsCard = ({ title }) => {


  const classes = useStyles();
  
  return (
    <div>
    <CardHeader
      action={<DragHandle />}
      title={'Rigs by State/County'}
      className={classes.header}
    />

    <div className={classes.frame}>
    <Iframe 
      width="100%"
      height="700px"
      paddintTop="10px"
      url="https://app.powerbi.com/view?r=eyJrIjoiMzA0MzgzZGMtYmZjZi00OWRjLWIzMmItOTg0MmVlNDVkMzU5IiwidCI6IjA5YzE2ZGM1LTMxMjQtNGVjNi1hMzFhLTEyNWIzMjVmNWRlMiIsImMiOjJ9" 
      /> 
    </div>

    </div>



  );
};
export default RigsCard;
