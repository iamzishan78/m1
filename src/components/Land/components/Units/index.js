import React, { useState, useContext } from "react";
import { AppContext } from "AppContext";
import { makeStyles } from "@material-ui/core/styles";
import AnalyticsCards from "components/Land/components/Common/AnalyticsCards";
import MapGridUnitTable from "components/Table/Unit/MapGridUnitTable";
import { setStateIfDeepEqual } from "components/Shared/functions";

const useStyles = makeStyles((theme) => ({
  custom: {
    padding: 0,
    "& ::-webkit-scrollbar": {
      height: "0.7em !important",
    },
    "& div": {
      "&>.MuiPaper-root": {
        "&>:nth-child(3)": {
          maxHeight: "48vh",
          "@media (max-height:900px)": {
            maxHeight: "45vh",
          },
          "@media (max-height:800px)": {
            maxHeight: "41vh",
          },
          "@media (max-height:768px)": {
            maxHeight: "38vh",
          },
        },
      },
    },
  },
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
    <div style={{ marginTop: 56, padding: "75px 56px" }}>
      <AnalyticsCards
        parent={"Agreements"}
        esIndex={esIndex}
        esFilters={esFilters}
        cardsDefault={cardsDefault}
        totalCount={agreementCount}
        setESFilters={setESFilters}
        landSearchQuery={stateApp.landSearchQuery}
      />
      <div className={classes.custom} style={{ marginTop: "40px" }}>
        <MapGridUnitTable
          dense
          parent="search"
          targetLabel="unit"
          header="Units"
        />
      </div>
    </div>
  );
}

export default Units;
