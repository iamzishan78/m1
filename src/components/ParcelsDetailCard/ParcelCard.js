import React, { useContext } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

import { AppContext } from "../../AppContext";
import { ExpandableCardContext } from "../ExpandableCard/ExpandableCardContext";
import { ParcelCardContext } from "./ParcelCardContext";

export default function ParcelCard(props) {

  const [stateApp, setStateApp] = useContext(AppContext);
  const [parcelContext, setParcelContext] = useContext(ParcelCardContext);
  const [stateExpandableCard, setStateExpandableCard] = useContext(ExpandableCardContext);

  return stateApp.selectedParcel ? (
    !stateExpandableCard.expanded ? (
      <div style={{ height: "100%", padding: "9px" }}>
        <h4>Coming soon</h4>
      </div>
    ) : (
        <div style={{ height: "100%" }}>
          <h4>Coming soon again</h4>
        </div>
      )
  ) : (
      <CircularProgress color="secondary" />
    )
}