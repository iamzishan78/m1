import React, { useState, useContext, useEffect, Fragment } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { MapControlsContext } from "../MapControlsContext";
import { AppContext } from "../../../AppContext";
import { Grid, Typography, Divider, Button } from "@material-ui/core";
import { Close as CloseButton } from "@material-ui/icons";
import Checkbox from "@material-ui/core/Checkbox";
import { Collapse } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { deepEqual } from "../../Shared/functions";
import { IconButton } from "@material-ui/core";
import { truncate } from "components/Shared/functions";

import { snapGridSideBarData } from "components/MapGridCard/components/data";
import { history } from "store";
import { useApolloClient } from "@apollo/client";
import { GET_ES_SIMPLE_SEARCH } from "graphQL/useQueryESSimpleSearch";
import M1neral_headers from "components/BulkUpload/jobHeaders";

const useStyles = makeStyles((theme) => ({
  list: {
    border: "2px solid #A9A9A9",
    padding: "0px",
    margin: "8px 0px",
    borderRadius: "8px",
  },
  contentRoot: {
    padding: "15px",
    height: "calc(100% - 65px)",
    position: "absolute",
    overflow: "overlay",
  },
  dialogFooter: {
    padding: '10px',
    justifyContent: 'end',
    display: 'flex'
  }
}));

const StyledListItem2 = withStyles((theme) => ({
  root: {
    fontFamily: "Poppins",
    backgroundColor: theme.palette.common.white,
    color: "#263451",
    border: "2px solid #263451",
    borderRadius: "5px",
    marginTop: "15px",
    marginBottom: "5px",
    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
      color: "#263451",
    },
  },
}))(ListItem);

const StyledListItem = withStyles((theme) => ({
  root: {
    fontFamily: "Poppins",
    backgroundColor: theme.palette.common.white,
    borderBottom: "2px solid #ccc",
    padding: "0px",
    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
      color: "dark gray",
    },
    "&:first-child": {
      borderTopLeftRadius: "5px",
      borderTopRightRadius: "5px",
    },
    "&:last-child": {
      borderBottomLeftRadius: "5px",
      borderBottomRightRadius: "5px",
      borderBottom: "0px",
    },
  },
}))(ListItem);

export default function TransferDataManager(props) {
  const classes = useStyles();

  const [, setStateMapControls] = useContext(MapControlsContext);
  const [stateApp, setStateApp] = useContext(AppContext);
  const client = useApolloClient();
  const [openSourcePanel, setOpenSourcePanel] = useState(true);
  const [openPlatformPanel, setOpenPlatformPanel] = useState(true);

  const [selectedSourceCategory, setSelectedSourceCategory] = useState(null);
  const [selectedPlatformCategory, setSelectedPlatformCategory] = useState(null);
  const [currentLayers, setCurrentLayers] = React.useState(stateApp.layers);

  useEffect(() => {
    if (!deepEqual(currentLayers, stateApp.layers)) {
      setCurrentLayers(stateApp.layers);
    }
  }, [currentLayers, stateApp.layers]);

  const handleClose = () => {
    setStateMapControls((stateMapControls) => ({
      ...stateMapControls,
      addLayer: false,
      manageTransferData: false,
      manageSourceLayer: false,
      manageLayer: false,
    }));
  };

  const handleContinue = async () => {
    const sourceData = await client.query({
      query: GET_ES_SIMPLE_SEARCH,
      variables: {
        index: "shapefile_flat",
        search: {
          query: "",
          fields: ['*'],
          advanceSearch: selectedSourceCategory.layerGeometry === 'Polygon' ? [{
            "bool": {
              "should": [
                {
                  "term": { "properties.layerGeometry": "Polygon" }
                },
                {
                  "term": { "properties.layerGeometry": "MultiPolygon" }
                }
              ]
            }
          }] : [{
            "bool": {
              "should": [
                {
                  "term": { "properties.layerGeometry": selectedSourceCategory.layerGeometry }
                }
              ]
            }
          }],
        },
        filters: [{ field: "file._id", value: selectedSourceCategory?.file }],
        pagination: {
          first: 5,
          after: null,
        },
      },
    });
    let columns = []
    sourceData.data.getESSimpleSearch.hits.forEach((hit) => {
      const currentColumns = Object.keys(hit.properties)
      if (currentColumns.length > columns.length) columns = currentColumns
    })
    selectedSourceCategory.columns = columns

    const m1neralHeaders = M1neral_headers[selectedPlatformCategory.value.toUpperCase() + '_SHAPE'];
    let matchedKeys = [...m1neralHeaders]
    for (let index in columns) {
      const matchedKey = matchedKeys.find(el => el?.label === columns[index])

      columns[index] = {
        mapped_key: columns[index],
        required: !!matchedKey?.actual_key,
        actual_key: matchedKey?.actual_key || "",
        label: matchedKey?.label || "",
      };

      if (columns[index]?.actual_key === matchedKey?.actual_key) {
        matchedKey.mapped_key = columns[index].mapped_key;
        matchedKey.required = columns[index].required;
      }
    }
    selectedSourceCategory.m1neralHeaders = matchedKeys
    selectedSourceCategory.mappedHeadersFromCSV = columns

    setStateApp({
      ...stateApp,
      transferData: { selectedSourceCategory, selectedPlatformCategory }
    })
    history.push(`/bulkupload/shape_to_m1_layer`)
  }

  const dataset = stateApp?.selectedDataset
  return (
    <div style={{ width: '100%' }}>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
        style={{ padding: "15px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <Grid item>
          <Typography variant="h5">Transfer Data</Typography>
        </Grid>
        <Grid item>
          <IconButton size="small" onClick={handleClose}>
            <CloseButton />
          </IconButton>
        </Grid>
      </Grid>
      <Divider />
      <div className={classes.contentRoot}>
        <Typography variant="h6" style={{ textAlign: "start", paddingBottom: "5px", fontWeight: "bolder", fontFamily: 'sans-serif' }} onClick={(e) => e.stopPropagation()}>
          Select Datasource to Transfer
        </Typography>
        <Typography varient="h6" style={{ textAlign: "start", marginBottom: "10px" }} onClick={(e) => e.stopPropagation()}>
          Transfer rows from one source category into a M1 platform dataset. Results will represent a copy of the source at the point in time when the transfer occurs.
        </Typography>
        <Divider style={{ height: '2px', marginTop: "15px" }} />
        <Typography varient="h5" style={{ textAlign: "start", marginTop: "5px", fontWeight: "bolder", fontFamily: 'sans-serif' }} onClick={(e) => e.stopPropagation()}>
          Transfer source category from:
        </Typography>
        <Typography varient="h6" style={{ textAlign: "start", marginBottom: "10px" }} onClick={(e) => e.stopPropagation()}>
          <span style={{ textDecoration: "underline" }}>Please select only one category</span> The category type needs to align to create a match (ex. polygon to polygon)
        </Typography>
        <div onClick={(e) => e.stopPropagation()}>

          <Fragment key={dataset.sourceName}>
            {
              dataset.sourceName !== 'M1 Platform' ? <> <StyledListItem2 button onClick={() => setOpenSourcePanel(!openSourcePanel)}>
                <ListItemText primary={dataset.sourceName} />
                {openSourcePanel ? <ExpandLess /> : <ExpandMore />}
              </StyledListItem2>
                <Collapse in={openSourcePanel} timeout="auto" unmountOnExit>
                  <List className={classes.list}>
                    {dataset.categories.map((layer, index) => {
                      const labelId = `m1layer-list-label-${index}`;
                      return (
                        <StyledListItem key={index} ContainerComponent="li">
                          <Checkbox
                            checked={selectedSourceCategory?.layerName === layer.layerName}
                            color="dark gray"
                            onClick={(e) => e.stopPropagation()}
                            onChange={() => { setSelectedSourceCategory(selectedSourceCategory?.layerName !== layer.layerName ? layer : null) }}
                            inputProps={{ "aria-label": "primary checkbox" }}
                          />
                          <ListItemText style={{ padding: '5px 0px 5px 0px' }} id={labelId} primary={truncate(layer.layerName || layer.name, 30)} />
                        </StyledListItem>
                      );
                    })}
                  </List>
                </Collapse></> : <></>
            }
          </Fragment>

          <Divider style={{ height: '2px', marginTop: "15px" }} />
          <Typography varient="h5" style={{ textAlign: "start", marginTop: "5px", fontWeight: "bolder", fontFamily: 'sans-serif' }} onClick={(e) => e.stopPropagation()}>
            To the Following Platform Source Category:
          </Typography>
          <Typography varient="h6" style={{ textAlign: "start", marginBottom: "10px" }} onClick={(e) => e.stopPropagation()}>
            <span style={{ textDecoration: "underline" }}>Please select only one category</span> The category type needs to align to create a match (ex. polygon to polygon)
          </Typography>

          <Fragment key={dataset.sourceName}>
            {
              <>
                <StyledListItem2 button onClick={() => setOpenPlatformPanel(!openPlatformPanel)}>
                  <ListItemText primary={'M1 Platform'} />
                  {openPlatformPanel ? <ExpandLess /> : <ExpandMore />}
                </StyledListItem2>
                <Collapse in={openPlatformPanel} timeout="auto" unmountOnExit>
                  <List className={classes.list}>
                    {snapGridSideBarData.map((row, index) => {
                      const labelId = `m1layer-list-label-${index}`;
                      return (
                        <StyledListItem key={index} ContainerComponent="li">
                          <Checkbox
                            checked={selectedPlatformCategory?.label === row.label}
                            color="dark gray"
                            onClick={(e) => e.stopPropagation()}
                            onChange={() => { setSelectedPlatformCategory(selectedPlatformCategory?.label !== row.label ? row : null) }}
                            inputProps={{ "aria-label": "primary checkbox" }}
                          />
                          <ListItemText style={{ padding: '5px 0px 5px 0px' }} id={labelId} primary={row.label} />
                        </StyledListItem>
                      );
                    })}
                  </List>
                </Collapse></>
            }
          </Fragment>

          <div className={classes.dialogFooter}>
            <Button
              variant="contained"
              color="default"
              size="medium"
              className={classes.footerButton}
              style={{ margin: "0px 15px 0px 0px" }}
              onClick={handleClose}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              color="primary"
              size="medium"
              disableElevation
              onClick={handleContinue}
              className={classes.footerButton}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
