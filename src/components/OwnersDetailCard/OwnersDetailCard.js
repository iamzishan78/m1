import React, { useContext } from "react";
import { AppContext } from "../../AppContext";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Taps from "../Shared/Taps";
import OwnerDetailsCardMap from "./components/OwnerDetailsCardMap";
import M1nTable from "../Shared/M1nTable/M1nTable";

const useStyles = makeStyles((theme) => ({
  gridWidthScroll: {
    //overflow: "auto",
    backgroundColor: "#efefef",
    //height: "100%"
  },
}));

export default function OwnersDetailCard(props) {
  const [stateApp] = useContext(AppContext);
  const classes = useStyles();

  return stateApp.selectedOwner ? (
    <Grid container className={classes.gridWidthScroll} spacing={0}>
      <Grid item sm={12}>
        <OwnerDetailsCardMap wellsIdsArray={props.wellsIdsArray} />
      </Grid>

      <Grid item sm={12}>
        <Taps
          tabLabels={["Wells", "Contacts"]}
          tabPanels={[
            <M1nTable
              parent="WellsPerOwner"
              wellsIdsArray={props.wellsIdsArray}
            />,
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
