import React, { useState, useContext } from "react";
import { AppContext } from "AppContext";
import AnalyticsCards from "components/Land/components/Common/AnalyticsCards";
import AgreementsTable from "../../../Table/Agreement/AgreementsTable";
import { setStateIfDeepEqual } from "components/Shared/functions";

function Agreements(props) {
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
      {/* <AnalyticsCards
        parent={"Agreements"}
        esIndex={esIndex}
        esFilters={esFilters}
        cardsDefault={cardsDefault}
        totalCount={agreementCount}
        setESFilters={setESFilters}
        landSearchQuery={stateApp.landSearchQuery}
      /> */}
      <div style={{ marginTop: "0px" }}>
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
    </div>
  );
}

export default Agreements;
