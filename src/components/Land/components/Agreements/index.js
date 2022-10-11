import React, { useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppContext } from "AppContext";
import AnalyticsCards from "components/Land/components/Common/AnalyticsCards";
import AgreementsTable from "../../../Table/Agreement/AgreementsTable";
import { setStateIfDeepEqual } from "components/Shared/functions";
import { setMapGridCardState } from "actions";
import { useDispatch } from "react-redux";



function Agreements(props) {
  const [stateApp] = useContext(AppContext);
  const dispatch = useDispatch()
  const [agreementCount, setAgreementCount] = useState(0);
  const [esFilters, ESFilters] = useState([]);

  // waypointKey should any key of Table Header which do not have customRender in schema file
  const loadMore = { type: 'infiniteScroll', height: "calc(100vh - 66px)" }

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
    <div
      // className={classes.root}
      style={{
        marginTop: "65px",
        marginLeft: "-10px"
      }}
    >
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
