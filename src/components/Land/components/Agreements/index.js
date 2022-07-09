import React, { useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppContext } from "AppContext";
import AnalyticsCards from "components/Land/components/Common/AnalyticsCards";
import AgreementsTable from "../../../Table/Agreement/AgreementsTable";
import { setStateIfDeepEqual } from "components/Shared/functions";
import { setMapGridCardState } from "actions";
import { useDispatch } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "65px",
    "& div": {
      "&>.MuiPaper-root": {
        display: "flex",
        "flex-direction": "column",
        height: "calc(100vh - 65px)",
        position: "relative",
        "align-items": "stretch",
        "&>.MuiPaper-root": {
          display: "contents",
        },
        "&>:nth-child(3)": {
          height: "inherit !important",
        },
        "&> table": {
          bottom: 0,
        },
      },
    },

    '& .MuiDrawer-paperAnchorRight': {
      overflow: "hidden",
    }
  },
}));

function Agreements(props) {
  const classes = useStyles();
  const [stateApp] = useContext(AppContext);
  const dispatch = useDispatch()
  const [agreementCount, setAgreementCount] = useState(0);
  const [esFilters, ESFilters] = useState([]);

  // waypointKey should any key of tableHader which do not have customRender in schema file
  const loadMore = { type: 'infiniteScroll', waypointKey: 'agreementType' }

  const setESFilters = (newState) => {
    setStateIfDeepEqual(ESFilters, newState);
  };

  const onAgreementCount = (count) => {
    setAgreementCount(count);
  };

  useEffect(() => { dispatch(setMapGridCardState({ searchInputValue: '' })) }, [])

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
    <div className={classes.root}>
      {/* <AnalyticsCards
        parent={"Agreements"}
        esIndex={esIndex}
        esFilters={esFilters}
        cardsDefault={cardsDefault}
        totalCount={agreementCount}
        setESFilters={setESFilters}
        landSearchQuery={stateApp.landSearchQuery}
      /> */}
      <AgreementsTable
        esIndex={esIndex}
        isCheckboxSticky={true}
        header="Agreements"
        esFilters={esFilters}
        targetLabel="agreement"
        parent="AgreementsTable"
        setESFilters={setESFilters}
        onAgreementCount={onAgreementCount}
        landSearchQuery={stateApp.landSearchQuery}
        loadMore={loadMore}
      />
    </div>
  );
}

export default Agreements;
