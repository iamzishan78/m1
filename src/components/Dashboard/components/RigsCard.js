import { useLocation } from 'react-router-dom';
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
    backgroundColor: '#FFFFF',
    color: 'black'
  },
  frame: {
    padding: "8px",
  },
  analyticsBody: {
    position: 'relative', top: "20px"
  }
}));

const DragHandle = sortableHandle(() => (
  <IconButton aria-label="drag">
    <DragIndicatorOutlinedIcon fontSize="default" htmlColor="#808080" />
  </IconButton>
));



const RigsCard = ({ title }) => {
  const classes = useStyles();

  const location = useLocation();
  const { pathname } = location;

  const isPermitsAnalytics = pathname.includes('analytics');
  const frameClassNames = [classes.frame];
  if (isPermitsAnalytics)
    frameClassNames.push(classes.analyticsBody);

  return (
    <div style={{ overflow: "hidden" }}>
      <CardHeader
        //action={<DragHandle />}
        title={'Rigs by Region'}
        className={classes.header}
      />

      <div style={{ height: isPermitsAnalytics && "97vh" }} className={frameClassNames.join(' ')}>
        <Iframe
          width="100%"
          height={isPermitsAnalytics ? "98%" : "700px"}
          paddintTop="10px"
          url="https://app.powerbi.com/view?r=eyJrIjoiMzA0MzgzZGMtYmZjZi00OWRjLWIzMmItOTg0MmVlNDVkMzU5IiwidCI6IjA5YzE2ZGM1LTMxMjQtNGVjNi1hMzFhLTEyNWIzMjVmNWRlMiIsImMiOjJ9"
        />
      </div>

    </div>



  );
};
export default RigsCard;
