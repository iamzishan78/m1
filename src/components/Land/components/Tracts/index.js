import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "AppContext";
import AnalyticsCards from "components/Land/components/Common/AnalyticsCards";
import MRTTable from "components/MRTTable";
import { tableController } from "hookstate/tableController";
import { useSelector } from "react-redux";

function Tracts(props) {
  const [stateApp] = useContext(AppContext);
  const tractTableState = tableController("TractsTable").useState(['filters', 'data']).stateValues;
  const userGridViewSettings = useSelector(({ session }) => session.userGridViewSettings);
  const TractGridViewModule = userGridViewSettings?.Tracts;


  const [selectedTractTab, setTractSelectedTab] = useState(0);

  let cardsDefault = [
    {
      heading: 'Total Tracts',
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

  // Set tract table filters
  useEffect(() => {
    if (tractTableState.data)
      TractGridViewModule?.filters?.forEach(filter => {
        const { field, value } = filter;
        tableController("TractsTable").setFilter({ field, value });
      });
  }, [TractGridViewModule]);

  // set tract table search query
  useEffect(() => {
    tableController("TractsTable")?.setGlobalFilter(stateApp?.landSearchQuery);
  }, [stateApp.landSearchQuery]);

  return (
    <>

      <div
        style={{
          marginTop: '65px',
          padding: "20px 26px 0px 33px"
        }}
      >
        <AnalyticsCards
          parent={"Tracts"}
          esIndex={"shapes_flat"}
          esFilters={tractTableState?.filters || []}
          totalCount={tractTableState?.data?.total}
          cardsDefault={cardsDefault}
          landSearchQuery={stateApp.landSearchQuery}
        />
      </div>

      <div
        style={{
          marginTop: "40px",
        }}
      >
        <div style={{ padding: '0rem 1.5rem 0rem 1.5rem' }}>
          <MRTTable name="TractsTable" />
        </div>

      </div>
    </>
  )
}

export default Tracts
