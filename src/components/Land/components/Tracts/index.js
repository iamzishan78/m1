import React, { useState, useContext } from "react";
// import { useHistory } from "react-router-dom";
import { AppContext } from "AppContext";
import AnalyticsCards from "components/Land/components/Common/AnalyticsCards";
import TractsTable from "../../../Table/Tract/TractsTable";
import { setStateIfDeepEqual } from "components/Shared/functions";

function Tracts(props) {
  const [stateApp] = useContext(AppContext);
  // const history = useHistory();

  const [esFilters, ESFilters] = useState([]);
  const setESFilters = (newState) => {
    setStateIfDeepEqual(ESFilters, newState);
  };

  const [tractCount, setTractCount] = useState(0);
  // const [grossAcresSum, setGrossAcresSum] = useState(0);
  // const [netAcresSum, setNetAcresSum] = useState(0);
  // const [netRoyaltyAcresSum, setNetRoyaltyAcresSum] = useState(0);
  // const [openDrawer, setOpenDrawer] = useState(false);

  const onTractCount = (count) => {
    setTractCount(count);
  }

  // const onGrossAcresSum = (sum) => {
  //   setGrossAcresSum(sum);
  // }

  // const onNetAcresSum = (sum) => {
  //   setNetAcresSum(sum);
  // }

  // const onNetRoyaltyAcresSum = (sum) => {
  //   setNetRoyaltyAcresSum(sum);
  // }

  // const handleListItemClick = (path) => {
  //   history.push(path);
  //   handleDrawerClose();
  // };

  // const handleDrawerClose = () => {
  //   setOpenDrawer(false);
  // };

  // const cards = [
  //   {
  //     heading: "Total Tracts",
  //     points: tractCount,
  //   },
  //   {
  //     heading: "Gross Acres",
  //     points: (Math.round((grossAcresSum + Number.EPSILON) * 100) / 100000).toLocaleString(undefined, {maximumFractionDigits: 1}) + 'K',
  //   },
  //   {
  //     heading: "Net Acres",
  //     points: (Math.round((netAcresSum + Number.EPSILON) * 100) / 100000).toLocaleString(undefined, {maximumFractionDigits: 1}) + 'K',
  //   },
  //   {
  //     heading: "Net Royalty Acres",
  //     points: (Math.round((netRoyaltyAcresSum + Number.EPSILON) * 100) / 100000).toLocaleString(undefined, {maximumFractionDigits: 1}) + 'K',
  //   },
  // ];

  const cardsDefault = [
    {
      heading: "Total Tracts",
      points: 0,
    },
    {
      heading: "Gross Acres",
      points: 0,
    },
    {
      heading: "Net Acres",
      points: 0,
    },
    {
      heading: "Net Royalty Acres",
      points: 0,
    },
  ];

  const esIndex = "shapeowners_flat";

  return (
    <>
      <AnalyticsCards
        esIndex={esIndex}
        esFilters={esFilters}
        totalCount={tractCount}
        setESFilters={setESFilters}
        cardsDefault={cardsDefault}
        landSearchQuery={stateApp.landSearchQuery}
      />
      <div style={{ padding: 30, paddingTop: 0, overflow: "auto" }}>
        <TractsTable
          esIndex={esIndex}
          header="Tracts"
          esFilters={esFilters}
          parent="TractsTable"
          targetLabel="tract"
          setESFilters={setESFilters}
          onTractCount={onTractCount}
          landSearchQuery={stateApp.landSearchQuery}
        />
      </div>
    </>
  )
}

export default Tracts