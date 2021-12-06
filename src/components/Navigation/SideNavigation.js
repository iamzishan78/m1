import React from "react";
import styled from "styled-components";
import clsx from "clsx";
import { useSelector } from "react-redux";

import { IconButton, List, ListItem, ListItemIcon, ListItemText, Button, Tooltip } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import PersonIcon from "@material-ui/icons/Person";
import DescriptionIcon from "@material-ui/icons/Description";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import MenuIcon from "@material-ui/icons/Menu";
import FlowIcon from "@material-ui/icons/Repeat";
import ActivityIcon from "@material-ui/icons/Event";
import SearchIcon from "@material-ui/icons/Search";
import LandScapeIcon from "components/Shared/svgIcons/LandscapeBlackIcon";

import { M1neralLogoNavNoAuth, useStyles } from "./Common";

const M1neralLogoWhiteLetters = styled(M1neralLogoNavNoAuth)`
  width: 200px;
  padding-left: 10px;
  padding-right: 15px;
`;

const SideNavigation = ({ openDrawer, stateNav, setStateNav, setStateApp, handleListItemClick, handleDrawerClose, handleDrawerOpen }) => {
  const mapGridCardActivated = useSelector(({ MapGridCard }) => MapGridCard.mapGridCardActivated);
  const classes = useStyles({ mapGridCardActivated });
  const theme = useTheme();

  return (
    <div>
      <Drawer
        variant="permanent"
        anchor="left"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: openDrawer,
          [classes.drawerClose]: !openDrawer,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: openDrawer,
            [classes.drawerClose]: !openDrawer,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <div className={classes.drawerOpenLogo} onClick={handleDrawerOpen}>
            <M1neralLogoWhiteLetters />
          </div>

          <IconButton className={classes.iconArrow} color="secondary" onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <>
                <ChevronLeftIcon />
                <MenuIcon className={classes.menuIcon} />
              </>
            )}
          </IconButton>
        </div>
        <List className={classes.menuList}>
          <ListItem
            classes={{
              root: classes.menuListItem,
              selected: classes.menuListItemSelected,
            }}
            button
            selected={stateNav.selectedMenuIndexDashboard === 1}
            onClick={(event) => handleListItemClick("/dashboard")}
            key="dashboard"
          >
            <div className={classes.tabContent}>
              <Tooltip title="Dashboard" placement="right" classes={{ tooltip: classes.iconTooltip }}>
                <ListItemIcon className={classes.sideNavIcon}>
                  <DashboardIcon />
                </ListItemIcon>
              </Tooltip>
              <ListItemText className={`${classes.sideNavText} uppercase`} primary="Dashboard" />
            </div>
          </ListItem>

          <ListItem
            classes={{
              root: classes.menuListItem,
              selected: classes.menuListItemSelected,
            }}
            button
            selected={stateNav.selectedMenuIndexFind === 1}
            onClick={(event) => handleListItemClick("/")}
            key="home"
          >
            <div className={classes.tabContent}>
              <Tooltip title="Find" placement="right" classes={{ tooltip: classes.iconTooltip }}>
                <ListItemIcon className={classes.sideNavIcon}>
                  <SearchIcon />
                </ListItemIcon>
              </Tooltip>
              <ListItemText className={`${classes.sideNavText} uppercase`} primary="Find" />
            </div>
          </ListItem>

          <ListItem
            classes={{
              root: classes.menuListItem,
              selected: classes.menuListItemSelected,
            }}
            button
            selected={stateNav.selectedMenuIndexContacts === 1}
            onClick={(event) => {
              setStateApp((stateApp) => ({
                ...stateApp,
                selectedContact: null,
                contactSearchQuery: null,
              }));
              setStateNav((stateApp) => ({
                ...stateApp,
                contactFromMap: false,
              }));
              handleListItemClick("/contacts");
            }}
            key="contacts"
          >
            <div className={classes.tabContent}>
              <Tooltip title="Contacts" placement="right" classes={{ tooltip: classes.iconTooltip }}>
                <ListItemIcon className={classes.sideNavIcon}>
                  <PersonIcon />
                </ListItemIcon>
              </Tooltip>
              <ListItemText className={`${classes.sideNavText} uppercase`} primary="Contacts" />
            </div>
          </ListItem>

          <ListItem
            classes={{
              root: classes.menuListItem,
              selected: classes.menuListItemSelected,
            }}
            button
            selected={stateNav.selectedMenuIndexLand === 1}
            onClick={(event) => {
              handleListItemClick("/land/agreements");
            }}
            key="land"
          >
            <div className={classes.tabContent}>
              <Tooltip title="Land" placement="right" classes={{ tooltip: classes.iconTooltip }}>
                <ListItemIcon className={classes.sideNavIcon}>
                  <LandScapeIcon />
                </ListItemIcon>
              </Tooltip>
              <ListItemText className={`${classes.sideNavText} uppercase`} primary="Land" />
            </div>
          </ListItem>

          <ListItem
            classes={{
              root: classes.menuListItem,
              selected: classes.menuListItemSelected,
            }}
            button
            selected={stateNav.selectedMenuIndexTransact === 1}
            onClick={(event) => handleListItemClick("/flow")}
            key="flow"
          >
            <div className={classes.tabContent}>
              <Tooltip title="Flow" placement="right" classes={{ tooltip: classes.iconTooltip }}>
                <ListItemIcon className={classes.sideNavIcon}>
                  <FlowIcon />
                </ListItemIcon>
              </Tooltip>
              <ListItemText className={`${classes.sideNavText} uppercase`} primary="Flow" />
              <ListItemSecondaryAction className={classes.sideNavAction}>
                <Button disabled className={`${classes.betaSideNav3} uppercase`} edge="start" aria-label="beta">
                  beta
                </Button>
              </ListItemSecondaryAction>
            </div>
          </ListItem>
          <ListItem
            classes={{
              root: classes.menuListItem,
              selected: classes.menuListItemSelected,
            }}
            button
            selected={stateNav.selectedMenuIndexDocuments === 1}
            onClick={(event) => {
              setStateApp((stateApp) => ({
                ...stateApp,
                selectedContact: null,
              }));
              handleListItemClick("/documents");
            }}
            key="documents"
          >
            <div className={classes.tabContent}>
              <Tooltip title="Documents" placement="right" classes={{ tooltip: classes.iconTooltip }}>
                <ListItemIcon className={classes.sideNavIcon}>
                  <DescriptionIcon />
                </ListItemIcon>
              </Tooltip>
              <ListItemText className={`${classes.sideNavText} uppercase`} primary="Documents" />
              <ListItemSecondaryAction className={classes.sideNavAction}>
                <Button disabled className={`${classes.betaSideNav3} uppercase`} edge="start" aria-label="beta">
                  beta
                </Button>
              </ListItemSecondaryAction>
            </div>
          </ListItem>
          <ListItem
            classes={{
              root: classes.menuListItem,
              selected: classes.menuListItemSelected,
            }}
            button
            selected={stateNav.selectedMenuIndexActivities === 1}
            onClick={(event) => handleListItemClick("/activities")}
            key="activities"
          >
            <div className={classes.tabContent}>
              <Tooltip title="Activities" placement="right" classes={{ tooltip: classes.iconTooltip }}>
                <ListItemIcon className={classes.sideNavIcon}>
                  <ActivityIcon />
                </ListItemIcon>
              </Tooltip>
              <ListItemText className={`${classes.sideNavText} uppercase`} primary="Activities" />
              <ListItemSecondaryAction className={classes.sideNavAction}>
                <Button disabled className={`${classes.betaSideNav3} uppercase`} edge="start" aria-label="beta">
                  beta
                </Button>
              </ListItemSecondaryAction>
            </div>
          </ListItem>

          {/* TEMP REMOVAL */}
          {/* <ListItem
            classes={{
              root: classes.menuListItem,
              selected: classes.menuListItemSelected,
            }}
            button
            selected={stateNav.selectedMenuIndexStudio === 1}
            onClick={(event) => handleListItemClick("/studio")}
            key="studio"
          >
            <div className={classes.tabContent}>
              <ListItemIcon className={classes.sideNavIcon}>
                <LayersIcon />
              </ListItemIcon>
              <ListItemText
                className={`${classes.sideNavText} uppercase`}
                primary="Studio"
              />
              <ListItemSecondaryAction className={classes.sideNavAction}>
                <Button
                  disabled
                  className={`${classes.betaSideNav3} uppercase`}
                  edge="end"
                  aria-label="beta"
                >
                  beta
                </Button>
              </ListItemSecondaryAction>
            </div>
          </ListItem> */}
        </List>
      </Drawer>
    </div>
  );
};

export default SideNavigation;
