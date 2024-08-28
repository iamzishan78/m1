import React, { useContext, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { AppContext } from "AppContext";
import AnalyticsCards from "components/Land/components/Common/AnalyticsCards";
import MRTTable from "components/MRTTable";
import TabPanels from 'components/Shared/TabPanels';
import { tableController } from "hookstate/tableController";
import { simpleTableGlobalController } from 'hookstate/simpleTableController';

const Tracts = () => {
  const [stateApp] = useContext(AppContext); // Accessing global state from AppContext
  const userGridViewSettings = useSelector(({ session }) => session.userGridViewSettings); // Fetching user-specific grid view settings from Redux

  // Static data for table keys, Elasticsearch indices, and tab labels
  const tableKeys = useMemo(() => ['TractsTable', 'TractInterestsTable'], []);
  const esIndex = useMemo(() => ["shapes_flat", "shapeowners_flat"], []);
  const tabLabels = useMemo(() => ["Tracts", "Tract Interests"], []);
  const gridModules = useMemo(() => ["Tracts", "TractInterest"], []);

  // Get the currently selected tab, defaulting to the first tab if not defined
  const selectedTab = simpleTableGlobalController?.useState(['tabKey'])?.stateValues?.tabKey || 0;
  const currentTableKey = tableKeys[selectedTab] || tableKeys[0]; // Ensure fallback to first table key

  // Retrieve grid view settings for the selected tab
  const TableGridViewModule = userGridViewSettings?.[gridModules[selectedTab]];

  // Retrieve the current state of the table data and filters for each table
  const tractTableState = tableController('TractsTable')?.useState(['filters', 'data'])?.stateValues || {};
  const tractInterestsTableState = tableController('TractInterestsTable')?.useState(['filters', 'data'])?.stateValues || {};
  const tableState = selectedTab ? tractInterestsTableState : tractTableState; // Use the correct table state based on the selected tab

  // Default card data to display in the AnalyticsCards component
  const cardsDefault = useMemo(() => [
    {
      heading: `Total ${tabLabels[selectedTab]}`, // Dynamic heading based on selected tab
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
  ], [selectedTab, tabLabels]);

  // Apply global filter from the land search query in the stateApp context
  useEffect(() => {
    if (stateApp?.landSearchQuery) {
      tableController(currentTableKey)?.setGlobalFilter(stateApp.landSearchQuery);
    }
  }, [stateApp?.landSearchQuery, selectedTab, currentTableKey]);

  return (
    <>
      {/* Analytics cards section */}
      <div style={{ marginTop: '65px', padding: "20px 26px 0px 33px" }}>
        <AnalyticsCards
          parent="Tracts"
          esIndex={esIndex[selectedTab]}
          esFilters={tableState?.filters || []}
          totalCount={tableState?.data?.total || 0}
          cardsDefault={cardsDefault}
          landSearchQuery={stateApp.landSearchQuery}
        />
      </div>

      {/* Tab panels section with tables */}
      <div style={{ marginTop: "40px" }}>
        <TabPanels
          value={selectedTab} // Current active tab
          panels={[
            <div key="tracts" style={{ padding: '0rem 1.5rem' }}>
              <MRTTable 
                name="TractsTable" 
                overrideMeta={{ tabLabels }} // Passing tab labels for display
              />
            </div>,
            <div key="tract-interests" style={{ padding: '0rem 1.5rem' }}>
              <MRTTable
                name="TractInterestsTable"
                overrideMeta={{ tabLabels }} // Passing tab labels for display
              />
            </div>,
          ]}
        />
      </div>
    </>
  );
};

export default Tracts;
