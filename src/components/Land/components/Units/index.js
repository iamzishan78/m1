import React, { useContext, useState } from "react";
// import AnalyticsCards from "components/Land/components/Common/AnalyticsCards";
import LandUnitsTable from "components/Table/Unit/MapGridUnitTable";
import TabPanels from "components/Shared/TabPanels";
import TabButtons from "components/Shared/TabPanels/TabButtons";
import { setStateIfDeepEqual } from "components/Shared/functions";
import UnitInterestOwnersTable from "components/Table/Unit/UnitInterestOwnersTable";
import { AppContext } from "AppContext";

function Units(props) {
  const [stateApp] = useContext(AppContext)

  // waypointKey should any key of Table Header which do not have customRender in schema file
  const loadMore = { type: 'infiniteScroll', height: "calc(100vh - 66px)" }

  const [selectedUnitTab, setUnitSelectedTab] = useState(0);

  const esIndex = ["shapes_flat", "shapeowners_flat"];
  const tabLabels = ["Units", "Unit Interests"]

  const UnitHeader = ({ selectedUnitTab, setUnitSelectedTab }) => (
    <TabButtons
      labels={tabLabels}
      value={selectedUnitTab}
      setValue={(n) => {
        setUnitSelectedTab(n);
      }}
    />
  );

  const [esFilters, ESFilters] = useState([]);
  const setESFilters = (newState) => {
    setStateIfDeepEqual(ESFilters, newState);
  };

  return (
    <div style={{
      marginTop: "65px",
      // marginLeft: '-10px'
    }}>
      <TabPanels
        value={selectedUnitTab}
        panels={[
          <div>
            <LandUnitsTable
              parent="UnitsTable"
              targetLabel="unit"
              header={<UnitHeader selectedUnitTab={selectedUnitTab} setUnitSelectedTab={setUnitSelectedTab} />}
              loadMore={loadMore}
              esIndex={esIndex[selectedUnitTab]}
            />
          </div>,
          <div>
            <UnitInterestOwnersTable
              esIndex={esIndex[selectedUnitTab]}
              header={<UnitHeader selectedUnitTab={selectedUnitTab} setUnitSelectedTab={setUnitSelectedTab} />}
              esFilters={esFilters}
              parent="UnitsTable"
              targetLabel="unit"
              setESFilters={setESFilters}
              landSearchQuery={stateApp.landSearchQuery}
              loadMore={loadMore}
            />
          </div>
        ]}
      />
    </div>
  );
}

export default Units;
