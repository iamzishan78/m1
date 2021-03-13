import React from "react";
import FilterDatePickerPermit from "./FilterDatePickerPermit";
import FilterDatePickerCompletetion from "./FilterDatePickerCompletetion";
import FilterDatePickerSpud from "./FilterDatePickerSpud";
import FilterDatePickerFirstProd from "./FilterDatePickerFirstProd";
import FilterWellTypeJ from "./FilterWellTypeJ";
import FilterTVD from "./FilterTVD";
import FilterLateralLength from "./FilterLateralLength";
import FilterMeasuredDistance from "./FilterMeasuredDistance";
import FilterWellProfileJ from "./FilterWellProfileJ";
import FilterWellStatusJ from "./FilterWellStatusJ";
import FilterPlay from "./FilterGeoPlay";
import FilterPrimaryFormation from "./FilterGeoPrimaryFormation";
import FilterField from "./FilterGeoField";
import OperatorsFilter from "./OperatorFilterJ";
import Grid from "@material-ui/core/Grid";

export default function FilterFormWell() {
  return (
    <Grid
      container
      item
      spacing={2}
      style={{ padding: "8px", width: "100%", margin: "0" }}
    >
      <Grid item sm={12}>
        <OperatorsFilter />
      </Grid>
      <Grid item sm={12}>
        <FilterWellTypeJ />
      </Grid>
      <Grid item sm={12}>
        <FilterWellProfileJ />
      </Grid>
      <Grid item sm={12}>
        <FilterWellStatusJ />
      </Grid>
      <Grid item sm={12} >
        <FilterPrimaryFormation />
      </Grid>
      <Grid item sm={12}>
        <FilterPlay />
      </Grid>
      <Grid item sm={12} >
        <FilterField />
      </Grid>
      <Grid item sm={12}>
        <FilterTVD />
      </Grid>
      <Grid item sm={12}>
        <FilterMeasuredDistance />
      </Grid>
      <Grid item sm={12}>
        <FilterLateralLength />
      </Grid>
      <Grid item sm={12}>
        <FilterDatePickerPermit labelDates={"Permit"} />
        <FilterDatePickerSpud labelDates={"Spud"} />
        <FilterDatePickerCompletetion labelDates={"Completion"} />
        <FilterDatePickerFirstProd labelDates={"First Production"} />
      </Grid>
    </Grid>
  );
}
