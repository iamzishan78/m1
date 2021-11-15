import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import clsx from "clsx";
import { TransitionGroup } from "react-transition-group";
import RootRef from "@material-ui/core/RootRef";
import { useMutation } from "@apollo/client";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { Tooltip, Tab, Tabs, InputBase, IconButton } from "@material-ui/core";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import { Divider, Grid, Typography, Drawer } from "@material-ui/core";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import MenuIcon from "@material-ui/icons/Menu";
import { RevenueContext } from "components/Revenue/RevenueContext";

import {
  useStyles,
  StyledMenu,
  StyledMenuItem,
  StyledListItem2,
  StyledListItemSecondaryAction,
  StyledMenuHeaderItem,
  StyledMenuHActionHeader,
} from "./styles";
import { SIDE_PANEL_MENU_ITEMS_LIST } from "components/Revenue/Revenue";

function Panel({ children }) {
  const classes = useStyles();
  const { stateRevenue, setStateRevenue } = useContext(RevenueContext);
  const history = useHistory();

  const closeAction = () => {
    setStateRevenue((prevState) => ({
      ...prevState,
      expandedPanel: false,
    }));
  };

  const handleMenuItemClick = (path) => {
    history.push(path);
  };
  return (
    <>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={true}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Grid container direction="row" justify="space-between" display="flex">
          <Grid item>
            <Typography variant="h6" style={{ fontWeight: "bold" }}>
              Revenue
            </Typography>
          </Grid>
          <Grid item>
            <IconButton className={classes.iconArrow} color="secondary" onClick={closeAction}>
              <>
                <ChevronLeftIcon />
                <MenuIcon className={classes.menuIcon} />
              </>
            </IconButton>
          </Grid>
        </Grid>
        <Divider />
        <div className={classes.quickActionText}>Quick Actions</div>
        <StyledMenu>
          {Object.keys(SIDE_PANEL_MENU_ITEMS_LIST).map((key, index) => (
            <StyledMenuItem onClick={() => handleMenuItemClick(SIDE_PANEL_MENU_ITEMS_LIST[key].link)} key={index}>
              <ListItemText>{SIDE_PANEL_MENU_ITEMS_LIST[key].text}</ListItemText>
            </StyledMenuItem>
          ))}
        </StyledMenu>
      </Drawer>
      <div className={classes.revenueRoot}>{children}</div>
    </>
  );
}

export default Panel;
