import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Add from "@material-ui/icons/Add";
import AnalyticsCards from "./AnalyticsCards";
import AgreementsTable from "../../../../Table/Agreement/AgreementsTable";

const useStyles = makeStyles((theme) => ({
}));

function Agreements(props) {
    let history = useHistory();

    const [agreementCount, setAgreementCount] = useState(0);
    const [activeCount, setActiveCount] = useState(0);
    const [inactiveCount, setInactiveCount] = useState(0);
    const [unapprovedCount, setUnapprovedCount] = useState(0);
    const [openDrawer, setOpenDrawer] = useState(false);

    const onAgreementCount = (count) => {
        setAgreementCount(count);
      }

    const onActiveCount = (count) => {
        setActiveCount(count);
        setInactiveCount(agreementCount - count);
      }

    const handleListItemClick = (path) => {
        history.push(path);
        handleDrawerClose();
      };

    const handleDrawerClose = () => {
    setOpenDrawer(false);
    };

    return (
        <div style={{ padding: "75px" }}>
            <AnalyticsCards agreementCount={agreementCount} activeCount={activeCount} inactiveCount={inactiveCount}> </AnalyticsCards>
            <div style={{ marginTop: 40 }}>
                <AgreementsTable header="Agreements" onAgreementCount={onAgreementCount} onActiveCount={onActiveCount} parent="AgreementsTable" />
            </div>
        </div>
    )
}

export default Agreements