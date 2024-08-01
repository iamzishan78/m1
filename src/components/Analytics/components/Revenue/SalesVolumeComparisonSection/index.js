import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";

import AnalyticsCharts from "./AnalyticsCharts";
import MRTTable from 'components/MRTTable';
import { GET_ES_SIMPLE_FILTER } from "graphQL/useQueryESSimpleFilter";
import { tableController } from 'hookstate/tableController';

export default function SalesVolumeComparisonSection({ checkDetailsData, esFilters, loadMore }) {
  const [propertiesIds, setPropertiesIds] = useState([]);
  const [associatedWellIds, setAssociatedWellIds] = useState([]);
  const tableState = tableController("SalesVolumeComparisonTable").useState(['filters', 'data']);
  const tableStateValues = tableState.stateValues;

  const [getESSimpleFilter] = useLazyQuery(GET_ES_SIMPLE_FILTER, { fetchPolicy: "no-cache" });

  useEffect(() => {
    if (!tableStateValues?.data?.total) return;
    (async () => {
      const formattedFilters = esFilters.map((filter) => {
        return filter.field === "check.checkDate" ? { ...filter, field: "date" } : filter;
      });
      await new Promise((resolve, reject) => {
        getESSimpleFilter({
          variables: {
            index: "checkdetailsinterestscomparison_flat",
            filters: [...formattedFilters, { field: "property.IsDeleted", value: false, type: "term" }],
            filterKey: "property._id.keyword",
            filterAggs: { query: "", field: "property._id.keyword", size: tableStateValues?.data?.total },
          },
          onCompleted: (res) => {
            if (res) {
              const propertiesIds = res?.getESSimpleFilter?.hits?.map((obj) => obj.key);
              setPropertiesIds(propertiesIds);
            }
          },
          onError: (error) => reject(error),
        });
      });
    })();
  }, [tableState?.data?.total, tableState?.filters,]);

  return (
    <>
      <AnalyticsCharts
        esFilters={esFilters}
        propertiesIds={propertiesIds}
        checkDetailsData={checkDetailsData}
        setAssociatedWellIds={setAssociatedWellIds}
      />
      
      <MRTTable name="SalesVolumeComparisonTable" 
      hideSharedCommentCheck />
    </>
  );
}
