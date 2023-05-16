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



const ProdCard = ({ title }) => {
  const classes = useStyles();

  const location = useLocation();
  const { pathname } = location;

  const isPermitsAnalytics = pathname.includes('analytics');
  const frameClassNames = [classes.frame];
  if (isPermitsAnalytics)
    frameClassNames.push(classes.analyticsBody);

  return (
    <div className="prodContainer">
      <CardHeader
        // action={<DragHandle />}
        title={'Production by State/County'}
        className={classes.header}
      />

      <div className={frameClassNames.join(' ')}>
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
