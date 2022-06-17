import React, { useState, useContext, useEffect } from "react";
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
    <div style={{
      padding: "0px 30px 30px",
      marginTop: "90px",
      height: "calc(100vh - 90px)"
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
      />
    </div>
  );
}

export default Agreements;
