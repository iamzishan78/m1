import React, { useContext, useEffect } from 'react';
import TabPanels from 'components/Shared/TabPanels';
import { AppContext } from 'AppContext';
import MRTTable from 'components/MRTTable';
import { tableController } from 'hookstate/tableController';
import { simpleTableGlobalController } from 'hookstate/simpleTableController';

function Units() {
  const [stateApp] = useContext(AppContext);

  const {
    stateValues: { tabKey: selectedTab },
  } = simpleTableGlobalController.useState(['tabKey']);

  const tableKey = ['UnitTable', 'UnitInterestTable'];

  useEffect(() => {
    tableController(tableKey[selectedTab]).setGlobalFilter(stateApp.landSearchQuery);
  }, [stateApp.landSearchQuery]);

  return (
    <div
      style={{
        marginTop: '65px',
        // marginLeft: '-10px'
      }}
    >
      <TabPanels
        value={selectedTab}
        panels={[
          <div style={{ padding: '0rem 1.5rem 0rem 1.5rem' }}>
            <MRTTable
              name="UnitTable"
              overrideMeta={{
                tabLabels: ['Units', 'Unit Interests'],
              }}
            />
          </div>,
          <div style={{ padding: '0rem 1.5rem 0rem 1.5rem' }}>
            <MRTTable
              name="UnitInterestTable"
              overrideMeta={{
                tabLabels: ['Units', 'Unit Interests'],
              }}
            />
          </div>,
        ]}
      />
    </div>
  );
}

export default Units;
