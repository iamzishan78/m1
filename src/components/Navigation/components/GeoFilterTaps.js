import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Taps from "../../Shared/Taps";
import FilterFromGeo from "./FilterFromGeo";

const useStyles = makeStyles((theme) => ({}));

export default function GeoFilterTaps() {
  return (
    <Taps
      white
      tabLabels={["TRS", "Basins/Plays", "Area of Interest"]}
      tabPanels={[<FilterFromGeo />, <p>2</p>, <p>3</p>]}
    />
  );
}
