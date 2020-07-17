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



const ProdCard = ({ title }) => {


  const classes = useStyles();
  
  return (
    <div>
    <CardHeader
      action={<DragHandle />}
      title={'Production by State/County'}
      className={classes.header}
    />

    <div className={classes.frame}>
    <Iframe 
      width="100%"
      height="700px"
      //height="10000px"
      position='relative'
      display='initial'
      paddingTop="10px"
      frameBorder="0"
      scrolling="yes"
      allowFullScreen="true"
      url="https://app.powerbi.com/view?r=eyJrIjoiNDVlNmExN2MtYTlmOC00NTQ5LWFmYmEtZDQ1MThmNWUxNzA5IiwidCI6IjA5YzE2ZGM1LTMxMjQtNGVjNi1hMzFhLTEyNWIzMjVmNWRlMiIsImMiOjJ9" 
      /> 
    </div>

    </div>



  );
};
export default ProdCard;
