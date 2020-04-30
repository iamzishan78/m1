import React, { useContext } from "react";
import { AppContext } from "../../AppContext";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CircularProgress from "@material-ui/core/CircularProgress";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Taps from "./components/Taps";
import OwnerDetailsCardMap from "./components/OwnerDetailsCardMap";
import M1nTable from "../Shared/M1nTable/M1nTable";

const useStyles = makeStyles((theme) => ({
  gridWidthScroll: {
    overflow: "auto",
  },
}));

export default function WellCard() {
  const [stateApp] = useContext(AppContext);
  const classes = useStyles();

  return stateApp.selectedOwner ? (
    <Grid container className={classes.gridWidthScroll} spacing={0}>
      <Grid item sm={12}>
        <OwnerDetailsCardMap />
      </Grid>

      <Grid item sm={12}>
        <Taps
          tabLabels={["Wells", "Contacts"]}
          tabPanels={[
            <div> wells </div>,
            <M1nTable
              parent="ownerContacts"
              ownerId={stateApp.selectedOwner.id}
            />,
          ]}
        />
      </Grid>
    </Grid>
  ) : (
    <CircularProgress color="secondary" />
  );
}
