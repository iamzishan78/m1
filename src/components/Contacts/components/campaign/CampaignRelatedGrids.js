import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import Card from "@material-ui/core/Card";
import CampaignUnitsTable from "components/Table//Unit/CampaignUnitsTable";
import CampaignContactsTable from "components/Table/Contact/CampaignContactsTable";

import { Grid, List, ListItem, ListItemIcon, ListItemText, Typography } from "@material-ui/core";
import { campaignInitialData } from "./data";

const useStyles = makeStyles((theme) => ({
  card: {
    width: "100%",
    "& .MuiInput-inputTypeSearch": {
      width: "96%",
    },
  },
  rootList: {
    width: ({ mapGridCardActivated }) => (mapGridCardActivated === "min" ? "57vw" : mapGridCardActivated === "exp" ? "96vw" : "57vw"),
    height: ({ mapGridCardActivated }) => (mapGridCardActivated === "min" ? "60vh" : mapGridCardActivated === "exp" ? "91vh" : "60vh"),
    left: ({ mapGridCardActivated, expandGrid }) => (mapGridCardActivated === "exp" ? "2vw" : "2vw"),
    top: ({ mapGridCardActivated }) => (mapGridCardActivated === "exp" ? "5vh" : "12vh"),
    zIndex: "1300",
    position: "fixed",
  },
  dockMenu: {
    width: "100%",
    height: "50vh",
  },
  tapsRoot: {
    // flexGrow: 1,
    "& .MuiTab-root": {
      textTransform: "none",
    },
  },
  appBar: {
    backgroundColor: "#F2F2F2",
    borderBottom: "1px solid rgba(224, 224, 224, 1)",
    boxShadow: "none",
    color: "#757575",
    cursor: "context-menu",
    "& .MuiIconButton-root:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.08)",
    },
    "& button": {
      cursor: "pointer",
    },
  },
  tapsPanels: {
    "& .MuiBox-root": { padding: "0" },
  },
  tapsPanelsPadding: {
    "& .MuiBox-root": { padding: "0", height: "100%" },
  },
  mainPanelsDiv: {
    height: "100%",
    maxHeight: "100vh",
    position: "relative",
    "&::-webkit-scrollbar": {
      width: "0.75em",
      height: "0.75em",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#929292",
      borderRadius: 10,
    },
    "& div": {
      "&>.MuiPaper-root": {
        "&>:nth-child(3)": {
          height: "calc(50vh - 128px) !important",
        },
      },
    },
  },
  tapsLabelsButtons: {
    boxShadow: "none",
    backgroundColor: "#fff",
    color: "#757575",
    "&:hover": { boxShadow: "none !important" },
  },
  tapsLabelsButtonsSelected: {
    boxShadow: "none",
    color: "#fff",
    backgroundColor: theme.palette.secondary.main,
    "&:hover": { color: "#757575", boxShadow: "none !important" },
  },
  viewportWells: {
    textAlign: ({ viewportWells }) => (viewportWells ? "inherit" : "center"),
    "& #minimumZoomRequired": {
      margin: "30px",
      fontSize: "1.25rem",
      fontFamily: "Poppins",
      fontWeight: "500",
      lineHeight: "1.6",
      display: ({ viewportWells }) => (viewportWells ? "none" : "block"),
    },
    "& #viewportWellsTable": {
      display: ({ viewportWells }) => (viewportWells ? "block" : "none"),
    },
  },
  selectBoundary: {
    background: "white",
    width: "180px",
    height: "35px",
    marginTop: "6px",
    marginBottom: "6px",
    marginLeft: "10px",
    "& .MuiSelect-select.MuiSelect-select": {
      paddingLeft: "10px",
    },
  },
  selectorOptions: {
    backgroundColor: "#F2F2F2",
    maxHeight: "49.25vh",
    overflow: "overlay",
  },
}));

const CamapignRelatedGrids = ({ campaign }) => {
  const classes = useStyles();
  const [searchTapValue, SearchTapValue] = useState(campaignInitialData[0]);

  const setSearchTapValue = (state) => {
    if (searchTapValue !== state) {
      SearchTapValue(state);
    }
  };

  return (
    <div className={classes.card}>
      <Card className={classes.dockMenu}>
        <div className={`cancelDraggableEffect ${classes.mainPanelsDiv}`} style={{ position: "relative" }}>
          {/* //// search panel //// */}
          {/* <TabPanel value={""} index={0} className={classes.tapsPanelsPadding} style={{ width: "100%", height: "100%" }}> */}
          <Grid container direction="row" style={{ height: "100%", marginBottom: "20px" }}>
            <Grid item md={2} className={classes.selectorOptions}>
              <Typography variant="h6" component="h1" style={{ fontWeight: "bold", padding: "10px 0px 0px 20px" }}>
                Campaign Details
              </Typography>

              <List component="nav" aria-label="main mailbox folders">
                {campaignInitialData.map((row) => {
                  const Icon = row.Icon;
                  return (
                    <ListItem button selected={row.value === searchTapValue.value} onClick={() => setSearchTapValue(row)}>
                      <ListItemIcon style={{ minWidth: "40px" }}>
                        <Icon />
                      </ListItemIcon>
                      <ListItemText primary={row.label} />
                    </ListItem>
                  );
                })}
              </List>
            </Grid>

            <Grid item md={10} style={{ padding: "0px 0px", maxHeight: "49.25vh", overflow: "overlay" }}>
              <div style={{ position: "relative" }} classes={classes.gridTables}>
                {searchTapValue.value === "contacts" && <CampaignContactsTable campaign={campaign} />}
                {searchTapValue.value === "units" && <CampaignUnitsTable campaign={campaign} />}
              </div>
            </Grid>
          </Grid>
          {/* </TabPanel> */}
        </div>
      </Card>
    </div>
  );
};

export default CamapignRelatedGrids;
