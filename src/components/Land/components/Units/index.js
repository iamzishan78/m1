import React, { useState, useContext } from "react";
import { AppContext } from "AppContext";
import { makeStyles } from "@material-ui/core/styles";
// import AnalyticsCards from "components/Land/components/Common/AnalyticsCards";
import MapGridUnitTable from "components/Table/Unit/MapGridUnitTable";
import { setStateIfDeepEqual } from "components/Shared/functions";

const useStyles = makeStyles((theme) => ({
  // custom: {
  //   padding: 0,
  //   "& ::-webkit-scrollbar": {
  //     height: "0.7em !important",
  //   },
  //   "& div": {
  //     "&>.MuiPaper-root": {
  //       "&>:nth-child(3)": {
  //         maxHeight: "72vh",
  //         "@media (max-height:900px)": {
  //           maxHeight: "72vh",
  //         },
  //         "@media (max-height:800px)": {
  //           maxHeight: "70vh",
  //         },
  //         "@media (max-height:768px)": {
  //           maxHeight: "65vh",
  //         },
  //       },
  //     },
  //   },
  // },
}));

function Units(props) {
  const classes = useStyles();
  const [stateApp] = useContext(AppContext);

  const [agreementCount, setAgreementCount] = useState(0);
  const [esFilters, ESFilters] = useState([]);
  const setESFilters = (newState) => {
    setStateIfDeepEqual(ESFilters, newState);
  };

  const onAgreementCount = (count) => {
    setAgreementCount(count);
  };

  // waypointKey should any key of Table Header which do not have customRender in schema file
  const loadMore = { type: 'infiniteScroll', height: "calc(100vh - 66px)" }

  const esIndex = "shapes_flat";

  const cardsDefault = [
    {
      heading: "Total Agreements",
      points: 0,
    },
    {
      heading: "Active",
      points: 0,
    },
    {
      heading: "Inactive",
      points: 0,
    },
    {
      heading: "Unapproved",
      points: 0,
      type: "warning",
    },
  ];

  return (
    <div style={{
      // marginTop: 20, 
      // padding: "75px 20px" 
      marginTop: "65px",
      marginLeft: '-10px'

    }}>

      {/* <AnalyticsCards
        parent={"Agreements"}
        esIndex={esIndex}
        esFilters={esFilters}
        cardsDefault={cardsDefault}
        totalCount={agreementCount}
        setESFilters={setESFilters}
        landSearchQuery={stateApp.landSearchQuery}
      /> */}

      <div
      // className={classes.custom} 
      >
        <MapGridUnitTable
          parent="UnitsTable"
          targetLabel="unit"
          header="Units"
          loadMore={loadMore}
        />
      </div>
    </div>
  );
}

export default Units;
