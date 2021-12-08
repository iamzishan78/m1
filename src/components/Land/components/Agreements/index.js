import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Add from "@material-ui/icons/Add";
import AnalyticsCards from "../Common/AnalyticsCards";
import AgreementsTable from "../../../Table/Agreement/AgreementsTable";

const useStyles = makeStyles((theme) => ({
}));

function Agreements(props) {
    let history = useHistory();

    const [agreementCount, setAgreementCount] = useState(0);
    const [activeCount, setActiveCount] = useState(0);
    const [inactiveCount, setInactiveCount] = useState(0);
    const [approvedCount, setApprovedCount] = useState(0);
    const [unapprovedCount, setUnapprovedCount] = useState(0);
    const [openDrawer, setOpenDrawer] = useState(false);

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

    const handleListItemClick = (path) => {
        history.push(path);
        handleDrawerClose();
      };

    const handleDrawerClose = () => {
    setOpenDrawer(false);
    };

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
                <AgreementsTable header="Agreements" onAgreementCount={onAgreementCount} onActiveCount={onActiveCount} onApprovedCount={onApprovedCount} parent="AgreementsTable" targetLabel="agreement" />
            </div>
        </>
    )
}

export default Agreements