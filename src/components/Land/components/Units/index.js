import React, { useState, useContext, useEffect } from 'react';
// import AnalyticsCards from "components/Land/components/Common/AnalyticsCards";
// import LandUnitsTable from 'components/Table/Unit/MapGridUnitTable';
import TabPanels from 'components/Shared/TabPanels';
import TabButtons from 'components/Shared/TabPanels/TabButtons';
// import { setStateIfDeepEqual } from 'components/Shared/functions';
// import UnitInterestOwnersTable from 'components/Table/Unit/UnitInterestOwnersTable';
import { AppContext } from 'AppContext';
import MRTTable from 'components/MRTTable';
import { tableController } from 'hookstate/tableController';

function Units() {
  const [stateApp] = useContext(AppContext);

  // waypointKey should any key of Table Header which do not have customRender in schema file
  // const loadMore = { type: 'infiniteScroll', height: 'calc(100vh - 66px)' };

  const [selectedUnitTab, setUnitSelectedTab] = useState(0);

  const tableKey = ['UnitTable', 'UnitInterestTable'];
  const tabLabels = ['Units', 'Unit Interests'];

  function UnitHeader({ selectedUnitTab, setUnitSelectedTab }) {
    return (
      <TabButtons
        labels={tabLabels}
        value={selectedUnitTab}
        setValue={n => {
          setUnitSelectedTab(n);
        }}
      />
    );
  }

  // const [esFilters, ESFilters] = useState([]);
  // const setESFilters = newState => {
  // 	setStateIfDeepEqual(ESFilters, newState);
  // };

  useEffect(() => {
    tableController(tableKey[selectedUnitTab]).setGlobalFilter(stateApp.landSearchQuery)
  }, [stateApp.landSearchQuery])

  return (
    <div
      style={{
        marginTop: '65px',
        // marginLeft: '-10px'
      }}
    >
      <TabPanels
        value={selectedUnitTab}
        panels={[
          <div>
            {/* <LandUnitsTable
							parent="UnitsTable"
							targetLabel="unit"
							header={<UnitHeader selectedUnitTab={selectedUnitTab} setUnitSelectedTab={setUnitSelectedTab} />}
							loadMore={loadMore}
							esIndex={esIndex[selectedUnitTab]}
						/> */}
            <div style={{ zIndex: '9999', padding: '0rem 0.75rem 0.5rem 1.25rem' }}>
              <UnitHeader selectedUnitTab={selectedUnitTab} setUnitSelectedTab={setUnitSelectedTab} />
            </div>
            <MRTTable name="UnitTable" />
          </div>,
          <div>
            {/* <UnitInterestOwnersTable
							esIndex={esIndex[selectedUnitTab]}
							header={<UnitHeader selectedUnitTab={selectedUnitTab} setUnitSelectedTab={setUnitSelectedTab} />}
							esFilters={esFilters}
							parent="UnitsTable"
							targetLabel="unit"
							setESFilters={setESFilters}
							landSearchQuery={stateApp.landSearchQuery}
							loadMore={loadMore}
						/> */}

            <div style={{ zIndex: '9999', padding: '0rem 0.75rem 0.5rem 1.25rem' }}>
              <UnitHeader selectedUnitTab={selectedUnitTab} setUnitSelectedTab={setUnitSelectedTab} />
            </div>
            <MRTTable name="UnitInterestTable" />
          </div>,
        ]}
      />
    </div>
  );
}

export default Units;
