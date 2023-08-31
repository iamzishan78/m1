import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import Card from "@material-ui/core/Card";
import CampaignUnitsTable from "components/Table//Unit/CampaignUnitsTable";
import CampaignContactsTable from "components/Table/Contact/CampaignContactsTable";
import UnitInterestOwnersTable from "components/Table/Unit/UnitInterestOwnersTable";

import { Grid, List, ListItem, ListItemIcon, ListItemText, Typography } from "@material-ui/core";
import { campaignInitialData } from "./data";

const useStyles = makeStyles((theme) => ({
  card: {
    width: "100%",
    "& .MuiInput-inputTypeSearch": {
      width: "96%",
    },
  },
  dockMenu: {
    width: "100%",
  },
  mainPanelsDiv: {
    height: "100%",
    maxHeight: "calc(100vh - 493px)",
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
          [theme.breakpoints.up('xl')]: {
            height: "calc(50vh + 50px) !important",
          },
          [theme.breakpoints.down('xl')]: {
            height: "calc(35vh) !important",
          },
        },
      },
    },
  },
  selectorOptions: {
    backgroundColor: "#F2F2F2",
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
          <Grid container direction="row" style={{ height: "100%" }}>
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
                      <ListItemText id={row.label} primary={row.label} />
                    </ListItem>
                  );
                })}
              </List>
            </Grid>

            <Grid item md={10} style={{ padding: "0px 0px", overflow: "overlay" }}>
              <div style={{ position: "relative" }} classes={classes.gridTables}>
                {searchTapValue.value === "contacts" && <CampaignContactsTable campaign={campaign} />}
                {searchTapValue.value === "units" && <CampaignUnitsTable campaign={campaign} header="Units" />}
                {searchTapValue.value === "unitInterests" &&
                  <UnitInterestOwnersTable
                    esIndex={'shapeowners_flat'}
                    campaignName={campaign?.name}
                  />}
              </div>
            </Grid>
          </Grid>
        </div>
      </Card>
    </div>
  );
};

export default CamapignRelatedGrids;
