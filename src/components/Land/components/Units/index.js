import React from "react";
// import AnalyticsCards from "components/Land/components/Common/AnalyticsCards";
import LandUnitsTable from "components/Table/Unit/MapGridUnitTable";

function Units(props) {

  // waypointKey should any key of Table Header which do not have customRender in schema file
  const loadMore = { type: 'infiniteScroll', height: "calc(100vh - 66px)" }

  return (
    <div style={{
      marginTop: "65px",
      // marginLeft: '-10px'
    }}>
      <LandUnitsTable
        parent="UnitsTable"
        targetLabel="unit"
        header="Units"
        loadMore={loadMore}
      />
    </div>
  );
}

export default Units;
