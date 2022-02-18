import React from "react";
import clsx from "clsx";
import { useHistory } from "react-router-dom";
import { IconButton } from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";
import { Divider, Grid, Typography, Drawer } from "@material-ui/core";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import MenuIcon from "@material-ui/icons/Menu";

import { useStyles, StyledMenu, StyledMenuItem } from "components/Land/style";
import { SIDE_PANEL_MENU_ITEMS_LIST } from "components/Land";

import FeatureFlag from "components/Shared/FeatureFlag/FeatureFlagComponent";
import { FEATURES } from "components/Shared/FeatureFlag/common";

export default function QuickActionsPanel({
  children,
  handlePanelStateChange,
  quickActionsPanelState,
  activeModule,
}) {
  const classes = useStyles();
  const history = useHistory();

  const handleMenuItemClick = (path) => {
    history.push(path);
  };
  return (
    <>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={quickActionsPanelState}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Grid
          container
          direction="row"
          justify="space-between"
          display="flex"
          className={classes.header}
        >
          <Grid item style={{ alignItems: "center" }}>
            <Typography variant="h5" style={{ fontWeight: "normal" }}>
              Land Management
            </Typography>
          </Grid>
          <Grid item>
            <IconButton
              className={classes.iconArrow}
              color="secondary"
              onClick={() => handlePanelStateChange(false)}
            >
              <>
                <ChevronLeftIcon />
                <MenuIcon className={classes.menuIcon} />
              </>
            </IconButton>
          </Grid>
        </Grid>
        <Divider />
        <Typography variant="body2" className={classes.quickActionText}>
          Quick Actions
        </Typography>
        <StyledMenu>
          {Object.keys(SIDE_PANEL_MENU_ITEMS_LIST)
            .filter((key) => !SIDE_PANEL_MENU_ITEMS_LIST[key].isExcluded)
            .map((key, index) => (
              SIDE_PANEL_MENU_ITEMS_LIST[key].featureFlag && <FeatureFlag feature={FEATURES[SIDE_PANEL_MENU_ITEMS_LIST[key].featureFlag]}>
              <StyledMenuItem
                onClick={() =>
                  handleMenuItemClick(SIDE_PANEL_MENU_ITEMS_LIST[key].link)
                }
                key={index}
                isSelected
                style={{
                  backgroundColor:
                    activeModule.title === SIDE_PANEL_MENU_ITEMS_LIST[key].title
                      ? "#4B618F"
                      : "",
                }}
              >
                <ListItemText>
                  {SIDE_PANEL_MENU_ITEMS_LIST[key].title}
                </ListItemText>
              </StyledMenuItem>
              </FeatureFlag>
            ))}
        </StyledMenu>
      </Drawer>
      <div
        className={clsx({
          [classes.landRootExpanded]: quickActionsPanelState,
          [classes.landRootCollapsed]: !quickActionsPanelState,
        })}
        style={{
          position: "relative",
          top: "65px",
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 65px)",
          alignItems: "stretch",
        }}
      >
        {children}
      </div>
      <div
        className={classes.pulloutBox}
        onClick={() => handlePanelStateChange(!quickActionsPanelState)}
      >
        {quickActionsPanelState ? (
          <ArrowBackIosIcon />
        ) : (
          <ArrowForwardIosIcon />
        )}
      </div>
    </>
  );
}
