import React, { useState, useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Add from "@material-ui/icons/Add";
import { AppContext } from "AppContext";
import AnalyticsCards from "../Common/AnalyticsCards";
import TractsTable from "../../../Table/Tract/TractsTable";

const useStyles = makeStyles((theme) => ({
}));

function Tracts(props) {
    const [stateApp] = useContext(AppContext);
    const history = useHistory();

    const [tractCount, setTractCount] = useState(0);
    const [activeCount, setActiveCount] = useState(0);
    const [inactiveCount, setInactiveCount] = useState(0);
    const [approvedCount, setApprovedCount] = useState(0);
    const [unapprovedCount, setUnapprovedCount] = useState(0);
    const [openDrawer, setOpenDrawer] = useState(false);

    const onTractCount = (count) => {
        setTractCount(count);
      }

    const onActiveCount = (count) => {
        setActiveCount(count);
        setInactiveCount(tractCount - count);
      }

      const onApprovedCount = (count) => {
        setApprovedCount(count);
        setUnapprovedCount(tractCount - count);
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
        heading: "Total Tracts",
        points: tractCount,
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
                <TractsTable 
                  header="Tracts"
                  onTractCount={onTractCount}
                  onActiveCount={onActiveCount}
                  onApprovedCount={onApprovedCount}
                  parent="TractsTable"
                  targetLabel="tract"
                  landSearchQuery={stateApp.landSearchQuery}
                />
            </div>
        </>
    )
}

export default Tracts