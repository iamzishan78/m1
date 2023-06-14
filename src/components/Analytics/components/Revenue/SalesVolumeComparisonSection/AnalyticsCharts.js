import { Grid } from "@material-ui/core";

import { WellCardContextProvider } from "components/WellCard/WellCardContext";
import { WellProdChartContextProvider } from "components/WellProdChart/WellProdChartContext";
import OverShortComparison from "components/Revenue/components/Properties/DetailComponents/Validation/OverShortComparison";
import MonthlyProductionChart from "components/Revenue/components/Properties/DetailComponents/Validation/MonthlyProductionChart";

const AnalyticsCharts = ({ esFilters, propertiesIds, setStartDate, wellProductionData, setWellProductionData, setAssociatedWellIds, checkDetailsData }) => {

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
