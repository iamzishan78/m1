import React, { useState, useContext, useEffect } from "react";
import { NavigationContext } from "./NavigationContext";
import { useDispatch } from 'react-redux'
// contexts
import { AppContext } from "AppContext";
import { MapGridContext } from "../../components/MapGridCard/MapGridContext.js";

import { useHistory, useLocation } from "react-router-dom";
import clsx from "clsx";

//3rd party packages
import PropTypes from "prop-types";

//@material-ui components
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import CardHeader from "@material-ui/core/CardHeader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import CssBaseline from "@material-ui/core/CssBaseline";

import SupportCenterModal from "./components/SupportCenter";
import { useStyles } from "./Common";

//icons
import HeadsetIcon from "@material-ui/icons/Headset";
import DesktopWindowsIcon from "@material-ui/icons/DesktopWindows";

import DealSearch from "./components/DealSearch";
import SearchBarWithToggleButton from "./components/SearchBarWithToggleButton";

import ContactFormModal from "./components/ContactFormModal";
import { useSelector } from "react-redux";

import Add from "@material-ui/icons/Add";

import ActivitySearch from "./components/ActivitySearch";
import DocumentSearch from "./components/DocumentSearch";
import ContactSearch from "./components/ContactSearch";
import ContactDetailsSearch from "../ExpandableCard/components/ContactSearch";
import SideNavigation from "./SideNavigation";
import ProfileMenu from "components/Profile/ProfileMenu";

// App Bars
import LandAppBar from "./AppBar/Land";
import RevenueAppBar from "components/Navigation/AppBar/Revenue";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      color="secondary"
      component="div"
      role="tabpanel"
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export default function Navigation(props) {
  const mapGridCardActivated = useSelector(({ MapGridCard }) => MapGridCard.mapGridCardActivated);

  // contexts
  const [stateApp, setStateApp] = useContext(AppContext);
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [, setStateGrid] = useContext(MapGridContext);

  const [openSupportCenter, setOpenSupportCenter] = useState(false);
  const [openContactForm, setOpenContactForm] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [supportDrawer, setSupportDrawer] = useState(false);
  const [matchLocation, setMatchLocation] = useState(false);
  const [matchTrack, setMatchTrack] = useState(false);
  const [matchActivities, setMatchActivities] = useState(false);
  const [matchFind, setMatchFind] = useState(false);
  const [matchDocument] = useState(false);

  const classes = useStyles({ mapGridCardActivated, user: stateApp.user });

  let history = useHistory();
  let location = useLocation();

  useEffect(() => {
    if (location.pathname === "/" || location.pathname.startsWith("/map/")) {
      setStateNav((state) => ({
        ...state,
        selectedMenuIndexFind: 1,
        selectedMenuIndexTrack: 0,
        selectedMenuIndexTransact: 0,
        selectedMenuIndexTitle: 0,
        selectedMenuIndexAlerts: 0,
        selectedMenuIndexContacts: 0,
        selectedMenuIndexDashboard: 0,
        selectedMenuIndexStudio: 0,
        selectedMenuIndexActivities: 0,
        selectedMenuIndexDocuments: 0,
        selectedMenuIndexRevenue: 0,
        selectedMenuIndexLand: 0,
      }));
    } else if (location.pathname === "/track") {
      setStateNav((state) => ({
        ...state,
        selectedMenuIndexFind: 0,
        selectedMenuIndexTrack: 1,
        selectedMenuIndexTransact: 0,
        selectedMenuIndexTitle: 0,
        selectedMenuIndexAlerts: 0,
        selectedMenuIndexContacts: 0,
        selectedMenuIndexDashboard: 0,
        selectedMenuIndexStudio: 0,
        selectedMenuIndexActivities: 0,
        selectedMenuIndexDocuments: 0,
        selectedMenuIndexRevenue: 0,
        selectedMenuIndexLand: 0,
      }));
    } else if (location.pathname.startsWith("/flow")) {
      setStateNav((state) => ({
        ...state,
        selectedMenuIndexFind: 0,
        selectedMenuIndexTrack: 0,
        selectedMenuIndexTransact: 1,
        selectedMenuIndexTitle: 0,
        selectedMenuIndexAlerts: 0,
        selectedMenuIndexContacts: 0,
        selectedMenuIndexDashboard: 0,
        selectedMenuIndexStudio: 0,
        selectedMenuIndexActivities: 0,
        selectedMenuIndexDocuments: 0,
        selectedMenuIndexRevenue: 0,
        selectedMenuIndexLand: 0,
      }));
    } else if (location.pathname === "/title") {
      setStateNav((state) => ({
        ...state,
        selectedMenuIndexFind: 0,
        selectedMenuIndexTrack: 0,
        selectedMenuIndexTransact: 0,
        selectedMenuIndexTitle: 1,
        selectedMenuIndexAlerts: 0,
        selectedMenuIndexContacts: 0,
        selectedMenuIndexDashboard: 0,
        selectedMenuIndexM1Studio: 0,
        selectedMenuIndexStudio: 0,
        selectedMenuIndexActivities: 0,
        selectedMenuIndexDocuments: 0,
        selectedMenuIndexRevenue: 0,
        selectedMenuIndexLand: 0,
      }));
    } else if (location.pathname === "/contacts") {
      setStateGrid((state) => ({
        ...state,
        gridSearchTarget: null,
      }));
      setStateNav((state) => ({
        ...state,
        selectedMenuIndexFind: 0,
        selectedMenuIndexTrack: 0,
        selectedMenuIndexTransact: 0,
        selectedMenuIndexTitle: 0,
        selectedMenuIndexAlerts: 0,
        selectedMenuIndexContacts: 1,
        selectedMenuIndexDashboard: 0,
        selectedMenuIndexStudio: 0,
        selectedMenuIndexActivities: 0,
        selectedMenuIndexDocuments: 0,
        selectedMenuIndexRevenue: 0,
        selectedMenuIndexLand: 0,
      }));
    } else if (location.pathname === "/alerts") {
      setStateNav((state) => ({
        ...state,
        selectedMenuIndexFind: 0,
        selectedMenuIndexTrack: 0,
        selectedMenuIndexTransact: 0,
        selectedMenuIndexTitle: 0,
        selectedMenuIndexAlerts: 1,
        selectedMenuIndexContacts: 0,
        selectedMenuIndexDashboard: 0,
        selectedMenuIndexStudio: 0,
        selectedMenuIndexActivities: 0,
        selectedMenuIndexDocuments: 0,
        selectedMenuIndexRevenue: 0,
        selectedMenuIndexLand: 0,
      }));
    } else if (location.pathname === "/dashboard") {
      setStateNav((state) => ({
        ...state,
        selectedMenuIndexFind: 0,
        selectedMenuIndexTrack: 0,
        selectedMenuIndexTransact: 0,
        selectedMenuIndexTitle: 0,
        selectedMenuIndexAlerts: 0,
        selectedMenuIndexContacts: 0,
        selectedMenuIndexDashboard: 1,
        selectedMenuIndexStudio: 0,
        selectedMenuIndexActivities: 0,
        selectedMenuIndexDocuments: 0,
        selectedMenuIndexRevenue: 0,
        selectedMenuIndexLand: 0,
      }));
    } else if (location.pathname === "/studio") {
      setStateNav((state) => ({
        ...state,
        selectedMenuIndexFind: 0,
        selectedMenuIndexTrack: 0,
        selectedMenuIndexTransact: 0,
        selectedMenuIndexTitle: 0,
        selectedMenuIndexAlerts: 0,
        selectedMenuIndexContacts: 0,
        selectedMenuIndexDashboard: 0,
        selectedMenuIndexStudio: 1,
        selectedMenuIndexActivities: 0,
        selectedMenuIndexDocuments: 0,
        selectedMenuIndexRevenue: 0,
        selectedMenuIndexLand: 0,
      }));
    } else if (location.pathname === "/activities") {
      setStateNav((state) => ({
        ...state,
        selectedMenuIndexFind: 0,
        selectedMenuIndexTrack: 0,
        selectedMenuIndexTransact: 0,
        selectedMenuIndexTitle: 0,
        selectedMenuIndexAlerts: 0,
        selectedMenuIndexContacts: 0,
        selectedMenuIndexDashboard: 0,
        selectedMenuIndexStudio: 0,
        selectedMenuIndexActivities: 1,
        selectedMenuIndexDocuments: 0,
        selectedMenuIndexRevenue: 0,
        selectedMenuIndexLand: 0,
      }));
    } else if (location.pathname === "/documents") {
      setStateNav((state) => ({
        ...state,
        selectedMenuIndexFind: 0,
        selectedMenuIndexTrack: 0,
        selectedMenuIndexTransact: 0,
        selectedMenuIndexTitle: 0,
        selectedMenuIndexAlerts: 0,
        selectedMenuIndexContacts: 0,
        selectedMenuIndexDashboard: 0,
        selectedMenuIndexStudio: 0,
        selectedMenuIndexActivities: 0,
        selectedMenuIndexDocuments: 1,
        selectedMenuIndexRevenue: 0,
        selectedMenuIndexLand: 0,
      }));
    } else if (location.pathname.startsWith("/revenue")) {
      setStateNav((state) => ({
        ...state,
        selectedMenuIndexFind: 0,
        selectedMenuIndexTrack: 0,
        selectedMenuIndexTransact: 0,
        selectedMenuIndexTitle: 0,
        selectedMenuIndexAlerts: 0,
        selectedMenuIndexContacts: 0,
        selectedMenuIndexDashboard: 0,
        selectedMenuIndexStudio: 0,
        selectedMenuIndexActivities: 0,
        selectedMenuIndexDocuments: 0,
        selectedMenuIndexRevenue: 1,
        selectedMenuIndexLand: 0,
      }));
    } else if (location.pathname.startsWith("/land")) {
      setStateNav((state) => ({
        ...state,
        selectedMenuIndexFind: 0,
        selectedMenuIndexTrack: 0,
        selectedMenuIndexTransact: 0,
        selectedMenuIndexTitle: 0,
        selectedMenuIndexAlerts: 0,
        selectedMenuIndexContacts: 0,
        selectedMenuIndexDashboard: 0,
        selectedMenuIndexStudio: 0,
        selectedMenuIndexActivities: 0,
        selectedMenuIndexDocuments: 0,
        selectedMenuIndexRevenue: 0,
        selectedMenuIndexLand: 1,
      }));
    }
  }, [location, setStateNav]);

  useEffect(() => {
    if (location.pathname === "/track") {
      setMatchTrack(true);
    } else {
      setMatchTrack(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === "/activities") {
      setMatchActivities(true);
    } else {
      setMatchActivities(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === "/" || location.pathname.startsWith("/map/")) {
      setMatchLocation(true);
      setMatchFind(true);
    } else {
      setMatchLocation(false);
      setMatchFind(false);
    }
  }, [location.pathname]);

  const handleListItemClick = (path) => {
    history.push(path);
    handleDrawerClose();
  };

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleSupportOpen = () => {
    setOpenDrawer(false);
    setSupportDrawer(false);
    setOpenSupportCenter(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  const handleOpenContactForm = () => {
    setOpenSupportCenter(false);
    setOpenContactForm(true);
  };

  const requestDemo = () => {
    window.open("mailto:sales@m1neral.com?subject=Request for demo of premium features", "_blank");
  };

  const handleClickAddActivity = () => {
    setStateApp((stateApp) => ({
      ...stateApp,
      activityDialog: true,
    }));
  };

  const checkIfIgnoreHeader = () => {
    if (location.pathname.startsWith("/revenue/statement/details") || location.pathname.startsWith("/revenue/property/details")) {
      return true;
    }
    return false;
  };
  const matchAgreements = () => {
    return location.pathname === "/landmanagement/agreements";
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: openDrawer,
        })}
      >
        {stateApp.user && (
          <Toolbar>
            {location.pathname === "/activities" && (
              <>
                <ActivitySearch />
              </>
            )}
            {location.pathname === "/documents" && (
              <>
                <DocumentSearch />
              </>
            )}
           {(location.pathname === "/contacts" ||location.pathname === "/contacts/") && <ContactSearch />}
            {location.pathname.includes("/contact/details") && <ContactDetailsSearch showLinkIcon={true} />}

            {location.pathname.startsWith("/flow") && <DealSearch />}
            {location.pathname === "/dashboard" && (
              <Typography variant="h4" style={{ color: "black", fontWeight: "bold", marginLeft: 15 }}>
                Dashboard
              </Typography>
            )}

            {matchTrack ? <CardHeader className={classes.trackHeader} /> : null}

            {(matchFind || matchDocument) && (
              <div 
              className={classes.search} id="searchBarDivParent"
              >
                <SearchBarWithToggleButton />
              </div>
            )}

              <div className={classes.grow1} />

              {matchActivities ? (
                <div>
                  <div className={classes.filterTabs} style={{ paddingRight: "10px" }}>
                    <Button onClick={handleClickAddActivity} color="secondary" variant="contained" startIcon={<Add />}>
                      Add Activity
                    </Button>
                  </div>
                </div>
              ) : (
                <div style={{ display: "none" }}></div>
              )}
              {/* {matchAgreements() && (
              <div ref={anchorEl} className={classes.filterTabs} style={{ paddingRight: "10px" }}>
                <Button onClick={() => handleListItemClick("/agreement/details")} color="primary" variant="contained" startIcon={<Add />}>
                  Add Agreement
                </Button>
              </div>
            )} */}

              <ProfileMenu />
            </Toolbar>
          )}
        </AppBar>
      {stateApp.user && (
        <SideNavigation
          openDrawer={openDrawer}
          stateNav={stateNav}
          setStateNav={setStateNav}
          setStateApp={setStateApp}
          handleListItemClick={handleListItemClick}
          handleDrawerClose={handleDrawerClose}
          handleDrawerOpen={handleDrawerOpen}
        />
      )}

      {supportDrawer && (
        <ClickAwayListener onClickAway={() => setSupportDrawer(false)}>
          <div className={classes.supportDrawer}>
            <List component="div">
              <ListItem button onClick={() => handleSupportOpen()}>
                <ListItemIcon>
                  <HeadsetIcon />
                </ListItemIcon>
                <ListItemText primary="Support Center" />
              </ListItem>
              <ListItem button onClick={requestDemo}>
                <ListItemIcon>
                  <DesktopWindowsIcon />
                </ListItemIcon>
                <ListItemText primary="Request Demo" />
              </ListItem>
            </List>
          </div>
        </ClickAwayListener>
      )}

      <ClickAwayListener onClickAway={() => setOpenSupportCenter(false)}>
        <SupportCenterModal open={openSupportCenter} openContactForm={handleOpenContactForm} onClose={() => setOpenSupportCenter(false)} />
      </ClickAwayListener>

      <ContactFormModal open={openContactForm} onClose={() => setOpenContactForm(false)} />

      <main className={classes.content}>
        <div className={classes.toolbar} />
        {props.children}
      </main>
    </div>
  );
}
