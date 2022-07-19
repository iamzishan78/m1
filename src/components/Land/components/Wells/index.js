import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import MyGridWellsTable from "components/Table/Wells/MyGridWellsTable";
import WellIcon from "components/Shared/svgIcons/well";
import { Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  custom: {
    padding: 0,
    "& ::-webkit-scrollbar": {
      height: "0.7em !important",
    },
    "& div": {
      "&>.MuiPaper-root": {
        "&>:nth-child(3)": {
          maxHeight: "72vh",
          "@media (max-height:900px)": {
            maxHeight: "72vh",
          },
          "@media (max-height:800px)": {
            maxHeight: "70vh",
          },
          "@media (max-height:768px)": {
            maxHeight: "65vh",
          },
        },
      },
    },
  },
}));

const Header = () => {
  return (
    <div style={{
      width: "fit-content",
      display: "flex",
      alignItems: "center"
    }}>
      <WellIcon opacity={1} />
      <span style={{
        marginLeft: '10px',
        fontSize: "16px",
        fontWeight: "bold"
      }}>
        Wells
      </span>
    </div>
  )
}

function Units(props) {
  const classes = useStyles();

  return (
    <div style={{ 
      marginTop: "65px",
      marginLeft: '-10px'

      }}>

      <div className={classes.custom} >
        <MyGridWellsTable
          dense
          parent="WellsTable"
          targetLabel="wells"
          header={<Header />}
          uploadIcon
          showTags
          showComments
          showTracks
        />
      </div>
    </div>
  );
}

export default Units;
