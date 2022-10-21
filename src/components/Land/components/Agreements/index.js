import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "AppContext";
import AgreementsTable from "../../../Table/Agreement/AgreementsTable";
import { setStateIfDeepEqual } from "components/Shared/functions";
import { setMapGridCardState } from "actions";
import { useDispatch } from "react-redux";

function Agreements(props) {
  const [stateApp] = useContext(AppContext);
  const dispatch = useDispatch();
  const [esFilters, ESFilters] = useState([]);

  // waypointKey should any key of Table Header which do not have customRender in schema file
  const loadMore = { type: "infiniteScroll", height: "calc(100vh - 66px)" };

  const setESFilters = (newState) => {
    setStateIfDeepEqual(ESFilters, newState);
  };

  useEffect(() => {
    dispatch(setMapGridCardState({ searchInputValue: "" }));
  }, []);

  const esIndex = "shapes_flat";
  return (
    <div
      style={{
        marginTop: "65px",
        marginLeft: "-10px",
      }}
    >
      <AgreementsTable
        esIndex={esIndex}
        isCheckboxSticky={true}
        header="Agreements"
        esFilters={esFilters}
        targetLabel="agreement"
        parent="AgreementsTable"
        setESFilters={setESFilters}
        landSearchQuery={stateApp.landSearchQuery}
        loadMore={loadMore}
      />
    </div>
  );
}

export default Agreements;
