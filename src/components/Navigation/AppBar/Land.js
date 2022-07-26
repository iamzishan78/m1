import React from "react";
import { useSelector } from "react-redux";

import { Grid, Typography, Button } from "@material-ui/core";
import hat from "hat";
import { Add } from "@material-ui/icons";
import { SIDE_PANEL_MENU_ITEMS_LIST } from "components/Land/index";
import LandSearch from "components/Navigation/components/LandSearch";
import { useHistory } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { UPSERTCUSTOMLAYER } from "graphQL/useMutationUpsertCustomLayer";

export default function LandAppBar(props) {
  const { classes, user } = props;
  let history = useHistory();
  const { activeModule, quickActionsPanelState } = useSelector(({ common }) => common);
  const [upsertCustomLayer] = useMutation(UPSERTCUSTOMLAYER, {
    onCompleted: (data) => {
      console.log(data)
      if (data?.upsertCustomLayer?.customLayer) history.push(`/land/agreement/details/${data.upsertCustomLayer.customLayer._id}`);
    },
  });

  const featureId = hat();

  const addEmptyAgreement = async () => {
    const newShapeFeature = {
      id: featureId,
      type: "Feature",
      geometry: {},
      properties: {
        originalProperties: {},
        shapeSubtitle: '',
        type: 'agreement',
        layerType: 'agreement',
        layerSubType: 'lease',
        shapeArea: 0,
        shapeCenter: [0, 0],
        id: featureId,
      },
    };
    const customLayerData = {
      shapeJson: newShapeFeature,
      shape: JSON.stringify(newShapeFeature),
      layer: 'lease',
      name: '',
      user: user.mongoId,
    };

    upsertCustomLayer({
      variables: { customLayer: customLayerData },
    });
  }

  return (
    <Grid
      container
      direction="row"
      display="flex"
      justify="space-between"
      alignItems="center"
      style={{ marginLeft: quickActionsPanelState ? "433px" : "7px" }}
    >
      <Grid item md={8}>
        <Grid container direction="row" display="flex" justify="flex-start" alignItems="center">
          <Grid item md={2.5}>
            <Typography variant="h5" style={{ color: "black", fontWeight: "bold" }}>
              {activeModule.title}
            </Typography>
          </Grid>

          {(
            activeModule.title !== SIDE_PANEL_MENU_ITEMS_LIST.REPORTING_GROUPS.title
          ) && (
              <Grid item md={5} style={{ marginLeft: "20px" }}>
                <LandSearch activeModule={activeModule} />
              </Grid>
            )}
        </Grid>
      </Grid>

      {activeModule.title === SIDE_PANEL_MENU_ITEMS_LIST.AGREEMENTS.title && (
        <Grid item>
          <div className={classes.filterTabs} style={{ paddingRight: "10px" }}>
            <Button
              color="primary"
              variant="contained"
              startIcon={<Add />}
              onClick={addEmptyAgreement}
            >
              Add New Agreement
            </Button>
          </div>
        </Grid>
      )}
    </Grid>
  );
}
