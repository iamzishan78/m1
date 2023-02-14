import React, { useState, useContext } from "react";
// import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { AppContext } from "AppContext";
import AnalyticsCards from "components/Land/components/Common/AnalyticsCards";
import TractsTable from "../../../Table/Tract/TractsTable";
import TractInterestsTable from "../../../Table/Tract/TractInterestsTable";
import { setStateIfDeepEqual } from "components/Shared/functions";
import TabPanels from "components/Shared/TabPanels";
import TabButtons from "components/Shared/TabPanels/TabButtons";
import TractsFilters from "components/Land/components/Tracts/TractsFilters";

const useStyles = makeStyles((theme) => ({
  gridRoot: {
    marginTop: "65px",
    "& div": {
      "&>.MuiPaper-root": {
        display: "flex",
        "flex-direction": "column",
        height: "calc(100vh - 375px)",
        position: "relative",
        boxShadow: "none",
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
  },
}));

function Tracts(props) {
  const [stateApp] = useContext(AppContext);

  // waypointKey should any key of Table Header which do not have customRender in schema file
  const loadMore = { type: 'infiniteScroll', height: 'calc(100vh - 445px)' }



  const [esFilters, ESFilters] = useState([]);
  const setESFilters = (newState) => {
    setStateIfDeepEqual(ESFilters, newState);
  };

  const [selectedTractTab, setTractSelectedTab] = useState(0);
  const [tractCount, setTractCount] = useState(0);
  const onTractCount = (count) => {
    setTractCount(count);
  }

  const esIndex = ["shapes_flat", "shapeowners_flat"];
  const tabLabels = ["Tracts", "Tract Interests"]

  let cardsDefault = [
    {
      heading: `Total ${tabLabels[selectedTractTab]}`,
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

  const TractHeader = ({ selectedTractTab, setTractSelectedTab }) => (
    <TabButtons
      labels={tabLabels}
      value={selectedTractTab}
      setValue={(n) => {
        setTractSelectedTab(n);
      }}
    />
  );

  return (
    <>

      <div
        style={{
          marginTop: '65px',
          padding: "20px 26px 0px 33px"
        }}
      >
        <TractsFilters selectedTractTab={selectedTractTab} />
        <AnalyticsCards
          parent={"Tracts"}
          esIndex={esIndex[selectedTractTab]}
          esFilters={esFilters}
          totalCount={tractCount}
          setESFilters={setESFilters}
          cardsDefault={cardsDefault}
          landSearchQuery={stateApp.landSearchQuery}
        />
      </div>

      <div
        // className={classes.gridRoot}
        style={{
          marginTop: "40px",
          // marginLeft: "-10px",
        }}
      >
        <TabPanels
          value={selectedTractTab}
          panels={[
            <div>
              <TractsTable
                esIndex={esIndex[selectedTractTab]}
                header={<TractHeader selectedTractTab={selectedTractTab} setTractSelectedTab={setTractSelectedTab} />}
                esFilters={esFilters}
                parent="TractTable"
                targetLabel="parcel"
                setESFilters={setESFilters}
                onTractCount={onTractCount}
                landSearchQuery={stateApp.landSearchQuery}
                loadMore={loadMore}
              />
            </div>,
            <div>
              <TractInterestsTable
                esIndex={esIndex[selectedTractTab]}
                header={<TractHeader selectedTractTab={selectedTractTab} setTractSelectedTab={setTractSelectedTab} />}
                esFilters={esFilters}
                parent="TractInterestsTable"
                targetLabel="parcel"
                setESFilters={setESFilters}
                onTractCount={onTractCount}
                landSearchQuery={stateApp.landSearchQuery}
                loadMore={loadMore}
              />

            </div>
          ]}
        />

      </div>
    </>
  )
}

export default Tracts
