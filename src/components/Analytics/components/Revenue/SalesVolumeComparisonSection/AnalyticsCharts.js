import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { Grid } from "@material-ui/core";
import sortBy from "lodash/sortBy";

import { GET_ES_SIMPLE_SEARCH } from "graphQL/useQueryESSimpleSearch";
import { WellCardContextProvider } from "components/WellCard/WellCardContext";
import { WellProdChartContextProvider } from "components/WellProdChart/WellProdChartContext";
import OverShortComparison from "components/Revenue/components/Properties/DetailComponents/Validation/OverShortComparison";
import MonthlyProductionChart from "components/Revenue/components/Properties/DetailComponents/Validation/MonthlyProductionChart";

const AnalyticsCharts = ({ esFilters, propertiesIds, setStartDate, wellProductionData, setWellProductionData, setAssociatedWellIds }) => {
  const [checkDetailsData, setCheckDetailsData] = useState([]);

  const [getESSimpleSearch, { data: elasticData }] = useLazyQuery(GET_ES_SIMPLE_SEARCH, {
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    const dateFilter = esFilters.find((filter) => filter.type === "range");
    const formattedDateFilters = [];
    if (dateFilter) formattedDateFilters.push({ field: "date", type: "range", value: dateFilter?.value });
    getESSimpleSearch({
      variables: {
        index: "checkdetailsinterestscomparison_flat",
        pagination: {
          first: 2000,
          after: null,
        },
        search: {
          query: "",
          fields: [],
        },
        filters: formattedDateFilters,
      },
    });
  }, []);

  useEffect(() => {
    if (elasticData?.getESSimpleSearch?.hits?.length > 0) {
      let data = [];
      for (let i = 0; i < elasticData?.getESSimpleSearch?.hits?.length; i++) {
        const check = elasticData?.getESSimpleSearch?.hits[i];
        data.push({
          product: check.product,
          ReportDate: check.date,
          oil: check.product === "OIL" ? check.grossPropertyVolume : 0,
          gas: check.product === "GAS" ? check.grossPropertyVolume : 0,
          water: check.product === "WATER" ? check.grossPropertyVolume : 0,
        });
      }
      data = sortBy(data, ["ReportDate"]);
      setCheckDetailsData(data);
    }
  }, [elasticData]);

  return (
    <Grid container direction="row" display="flex" justify="space-between">
      <Grid style={{ marginTop: "30px" }} item xs={6}>
        <WellCardContextProvider>
          <WellProdChartContextProvider>
            <MonthlyProductionChart
              filter={esFilters}
              propertiesIds={propertiesIds}
              setStartDate={setStartDate}
              wellProductionData={wellProductionData}
              setWellProductionData={setWellProductionData}
              setAssociatedWellIds={setAssociatedWellIds}
            />
          </WellProdChartContextProvider>
        </WellCardContextProvider>
      </Grid>
      <Grid item xs={6}>
        <OverShortComparison productionData={wellProductionData} checkData={checkDetailsData} />
      </Grid>
    </Grid>
  );
};

export default AnalyticsCharts;
