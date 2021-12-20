import React, { useState, createContext } from "react";
import { GET_ES_PAGINATED_LIST } from "graphQL/useQueryESPaginatedList";
import { useLazyQuery } from "@apollo/client";

const RevenueContext = createContext([{}, () => { }]);
createContext([{}, () => { }]);

const RevenueContextProvider = (props) => {
  const [stateRevenue, setStateRevenue] = useState({
    expandedPanel: true,
  });
  // query for Properties Table
  const [getESPaginatedList, { data: elasticData, loading }] = useLazyQuery(
    GET_ES_PAGINATED_LIST,
    {
      fetchPolicy: "no-cache",
      onCompleted: () => {
        console.log("compeleted");
      },
    }
  );
  return <RevenueContext.Provider value={[stateRevenue, setStateRevenue, getESPaginatedList, elasticData, loading]}>{props.children}</RevenueContext.Provider>;
};

export { RevenueContext, RevenueContextProvider };
