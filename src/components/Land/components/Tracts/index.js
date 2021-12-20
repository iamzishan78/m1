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
  const [grossAcresSum, setGrossAcresSum] = useState(0);
  const [netAcresSum, setNetAcresSum] = useState(0);
  const [netRoyaltyAcresSum, setNetRoyaltyAcresSum] = useState(0);
  const [openDrawer, setOpenDrawer] = useState(false);

  const onTractCount = (count) => {
    setTractCount(count);
  }

  const onGrossAcresSum = (sum) => {
    setGrossAcresSum(sum);
  }

  const onNetAcresSum = (sum) => {
    setNetAcresSum(sum);
  }

  const onNetRoyaltyAcresSum = (sum) => {
    setNetRoyaltyAcresSum(sum);
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
      heading: "Gross Acres",
      points: (Math.round((grossAcresSum + Number.EPSILON) * 100) / 100000).toLocaleString(undefined, {maximumFractionDigits: 1}) + 'K',
    },
    {
      heading: "Net Acres",
      points: (Math.round((netAcresSum + Number.EPSILON) * 100) / 100000).toLocaleString(undefined, {maximumFractionDigits: 1}) + 'K',
    },
    {
      heading: "Net Royalty Acres",
      points: (Math.round((netRoyaltyAcresSum + Number.EPSILON) * 100) / 100000).toLocaleString(undefined, {maximumFractionDigits: 1}) + 'K',
    },
  ];

  return (
    <>
      <AnalyticsCards cards={cards} />
      <div style={{ padding: 30, paddingTop: 0, overflow: "auto" }}>
        <TractsTable
          header="Tracts"
          onTractCount={onTractCount}
          onGrossAcresSum={onGrossAcresSum}
          onNetAcresSum={onNetAcresSum}
          onNetRoyaltyAcresSum={onNetRoyaltyAcresSum}
          parent="TractsTable"
          targetLabel="tract"
          landSearchQuery={stateApp.landSearchQuery}
        />
      </div>
    </>
  )
}

export default Tracts