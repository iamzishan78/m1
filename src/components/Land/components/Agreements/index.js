import React, { useState, useContext } from "react";
import { AppContext } from "AppContext";
import AnalyticsCards from "../Common/AnalyticsCards";
import AgreementsTable from "components/Table/Agreement/AgreementsTable";

function Agreements(props) {
  const [stateApp] = useContext(AppContext);

  const [agreementCount, setAgreementCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [unapprovedCount, setUnapprovedCount] = useState(0);

  const onAgreementCount = (count) => {
    setAgreementCount(count);
  }

  const onActiveCount = (count) => {
    setActiveCount(count);
    setInactiveCount(agreementCount - count);
  }

  const onApprovedCount = (count) => {
    setApprovedCount(count);
    setUnapprovedCount(agreementCount - count);
  }

  const cards = [
    {
      heading: "Total Agreements",
      points: agreementCount,
    },
    {
      heading: "Active",
      points: activeCount,
    },
    {
      heading: "Inactive",
      points: inactiveCount,
    },
    {
      heading: "Unapproved",
      points: unapprovedCount,
      type: "warning",
    },
  ];

  return (
    <>
      <AnalyticsCards cards={cards} />
      <div style={{ padding: 30, paddingTop: 0, overflow: "auto" }}>
        <AgreementsTable
          header="Agreements"
          onAgreementCount={onAgreementCount}
          onActiveCount={onActiveCount}
          onApprovedCount={onApprovedCount}
          parent="AgreementsTable"
          targetLabel="agreement"
          landSearchQuery={stateApp.landSearchQuery}
        />
      </div>
    </>
  )
}

export default Agreements