import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";

import AnalyticsCharts from "./AnalyticsCharts";
import SalesVolumeComparisonTable from "./SalesVolumeComparisonTable";
import MRTTable from 'components/MRTTable';
import { GET_ES_SIMPLE_FILTER } from "graphQL/useQueryESSimpleFilter";

export default function SalesVolumeComparisonSection({ checkDetailsData, esFilters, loadMore }) {
  const [propertiesIds, setPropertiesIds] = useState([]);
  const [associatedWellIds, setAssociatedWellIds] = useState([]);

  const [recordCount, setRecordCount] = useState(0);

  const [getESSimpleFilter] = useLazyQuery(GET_ES_SIMPLE_FILTER, { fetchPolicy: "no-cache" });

  useEffect(() => {
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
            filterAggs: { query: "", field: "property._id.keyword", size: recordCount },
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
  }, [recordCount]);

  return (
    <>
      <AnalyticsCharts
        esFilters={esFilters}
        propertiesIds={propertiesIds}
        checkDetailsData={checkDetailsData}
        setAssociatedWellIds={setAssociatedWellIds}
      />
      
      {/* <SalesVolumeComparisonTable
        targetLabel="propertyInterest"
        parent="PropertyAssociatedWell"
        setPropertiesIds={setPropertiesIds}
        loadMore={{ ...loadMore, height: "calc(100vh - 710px)" }}
        esFilters={esFilters}
        recordCount={recordCount}
        setRecordCount={setRecordCount}
      /> */}
      <MRTTable name="SalesVolumeComparisonTable" 
      // overrideMeta={overrideMeta} 
      hideSharedCommentCheck />
    </>
  );
}
