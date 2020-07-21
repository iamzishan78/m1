import React, { useState, useContext, useEffect, useRef } from "react";
import { borders } from "@material-ui/system";
import { shadows } from "@material-ui/system";
import { Paper } from "@material-ui/core";
import { NavigationContext } from "./NavigationContext";
import { TransactContext } from "../Transact/TransactContext";
import { AppContext } from "../../AppContext";
import { useHistory, useLocation } from "react-router-dom";
import clsx from "clsx";
import { fade, makeStyles, useTheme } from "@material-ui/core/styles";
//3rd party packages
//import SwipeableViews from 'react-swipeable-views'
import PropTypes from "prop-types";
import styled from "styled-components";
//@material-ui components
import AppBar from "@material-ui/core/AppBar";
import DashboardIcon from "@material-ui/icons/Dashboard";
import LayersIcon from "@material-ui/icons/Layers";
//import Avatar from "@material-ui/core/Avatar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Tab from "@material-ui/core/Tab";
import Badge from "@material-ui/core/Badge";
import Tabs from "@material-ui/core/Tabs";
import Button from "@material-ui/core/Button";
import InputAdornment from "@material-ui/core/InputAdornment";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Input from "@material-ui/core/Input";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import { Link } from "react-router-dom";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import CircularProgress from "@material-ui/core/CircularProgress";
import { green } from "@material-ui/core/colors";
import SupportCenterModal from "./components/SupportCenter";
//icons
import CloseIcon from "@material-ui/icons/Close";
import SearchIcon from "@material-ui/icons/Search";
import HeadsetIcon from "@material-ui/icons/Headset";
import DesktopWindowsIcon from "@material-ui/icons/DesktopWindows";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
// import SettingsIcon from '@material-ui/icons/Settings';
import SettingsIcon from "./components/Utils/SettingsIcon";
import MyLocationIcon from "@material-ui/icons/MyLocation";
import SvgIcon from "@material-ui/core/SvgIcon";
import GeographicIcon from "../Shared/svgIcons/geographic";
import WellIcon from "../Shared/svgIcons/well";
import ProductionIcon from "../Shared/svgIcons/production";
import ValuationIcon from "../Shared/svgIcons/valuation";
import OwnershipIcon from "../Shared/svgIcons/ownership";
import PredictiveIcon from "../Shared/svgIcons/predictive";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import FilterListIcon from "@material-ui/icons/FilterList";
import DoneIcon from "@material-ui/icons/Done";
import SaveIcon from "@material-ui/icons/Save";
import MenuIcon from "@material-ui/icons/Menu";
import ToggleButton from "@material-ui/lab/ToggleButton";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import HeadsetMicIcon from "@material-ui/icons/HeadsetMic";
import DvrIcon from "@material-ui/icons/Dvr";
import TimelineIcon from "@material-ui/icons/Timeline";
import FolderSharedIcon from "@material-ui/icons/FolderShared";
import PeopleOutlineIcon from "@material-ui/icons/PeopleOutline";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import DescriptionIcon from "@material-ui/icons/Description";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

import FilterFormWell from "./components/FilterFormWell";
import FilterFromGeo from "./components/FilterFromGeo";
import FilterFormOwner from "./components/FilterFormOwner";
import FilterFormProduction from "./components/FilterFormProduction";
import FilterDefaults from "./components/FilterDefaults";
import M1neralLogoSvg from "../Shared/m1neralLogoSvg";
import FilterFormValue from "./components/FilterFormValue";
import FilterFormTags from "./components/FilterFormTags";
import FilterFormAI from "./components/FilterFormAI";

import InputBase from "@material-ui/core/InputBase";
import Search from "./components/Search";
import SearchBarWithToggleButton from "./components/SearchBarWithToggleButton";

import Avatar from "react-avatar";
import ContactFormModal from "./components/ContactFormModal";
import { GETPROFILEIMAGE } from "../../graphQL/useQueryGetProfile";
import { useLazyQuery } from "@apollo/react-hooks";


import {
  MuiThemeProvider,
  createMuiTheme,
  withStyles
} from "@material-ui/core/styles";

const theme = createMuiTheme({
  overrides: {
    MuiButton: {
      root: {
        '&:hover': {
          backgroundColor: "#fff"
        }
      }
    }
  }
})

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    width: "100%",
    height: "100%",
    paddingTop: "64px",
  },
  appBar: {
    height: "64px",
    background: "rgba(1, 17, 51, 1.0)",
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    paddingRight: "0 !important",
  },
  appBarShift: {
    marginLeft: drawerWidth,
    /* width: `calc(100% - ${drawerWidth}px)`, */
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    background: "rgba(1, 17, 51, 1.0)",
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },

  filterTabs: {
    paddingRight: "25px",
    position: "relative",
    left: 0,
  },
  drawerOpenLogo: {
    paddingLeft: "50px",
    paddingTop: "10px",
  },
  drawerOpen: {
    // background: "rgba(255, 255, 255, 1.0)",
    background: "rgba(250, 250, 250, 1.0)",
    width: drawerWidth,
    height: "100vh",
    top: "0",
    //boxShadow: "1px 0px 100vw black",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    background: "rgba(1, 17, 51, 1.0)",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    /*width: theme.spacing(8) + 1,*/
    width: "0%",
    /*[theme.breakpoints.up('sm')]: {
      width: theme.spacing(8) + 1
    }*/
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    // justifyContent: "flex-end",
    // padding: theme.spacing(0, 1),
    // ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
  },
  grow1: {
    flexGrow: 1,
  },
  grow2: {
    flexGrow: 2,
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    // "&:hover": {
    //   backgroundColor: fade(theme.palette.common.white, 0.25),
    // },
    marginRight: theme.spacing(2),
    marginLeft: 5,
    width: "34%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: 5,
      width: "34%",
    },
  },
  searchInput: {
    width: "100%",
    height: "100%",
    "& .mapboxgl-ctrl-geocoder": {
      backgroundColor: fade(theme.palette.common.white, 0),
      borderRadius: theme.shape.borderRadius,
      height: "100%",
      width: "100%",
      maxWidth: "100%",
      "&:hover": {
        // backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      "& .mapboxgl-ctrl-geocoder--input": {
        borderRadius: theme.shape.borderRadius,
        width: "100%",
        color: "#ffffff",
        height: "35px",
        fontSize: "17px",
        "&::placeholder": {
          color: "#788092",
          textDecoration: "bold",
        },
        "&:-ms-input-placeholder": {
          color: "#788092",
        },
        "&::-ms-input-placeholder": {
          color: "#788092",
        },
      },
      "& .mapboxgl-ctrl-geocoder--icon-search": {
        fill: "#ffffff",
        width: "23px",
        height: "23px",
        top: "5px",
      },
      "& .mapboxgl-ctrl-geocoder--button": {
        background: "#ffffff00",
        "&:hover": {
          background: "#ffffff00",
        },
      },
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: 200,
    },
  },
  tab: {
    minWidth: "62px",
    "& span": {
      color: "#FFFF",
    },
  },
  tabPanelWrapper: {
    padding: "0px",
    margin: "0px",
    background: "rgba(1, 17, 51, 0)",
    // height: "750px",
    minWidth: "750px",
    position: "absolute",
    top: "45px",
    right: "0",
    zIndex: 9,
  },
  card: {
    background: "#011133",
    borderStyle: "solid",
    borderWidth: "thin",
    borderColor: "#011133",
    maxWidth: 650,
    minWidth: 620,
  },
  cardTitle: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "22px",
    lineHeight: "20px",
    color: "#FFFFFF",
    textTransform: "uppercase",
    position: "relative",
    height: "23px",
    left: "0.46%",
    right: "39.32%",
    top: "calc(50% - 23px/2 - 140px)",
  },
  subheader: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: 300,
    fontSize: "18px",
    lineHeight: "20px",
    color: "#FFFFFF",
    position: "relative",
    height: "17px",
    left: "0.46%",
    right: "58.31%",
    top: "calc(50% - 17px/2 - 120px)",
  },
  betaSideNav: {
    textTransform: "inherit",
    right: 10,
    fontSize: 12,
    color: "rgba(0, 0, 0, 0.52) !important ",
  },
  betaSideNav2: {
    textTransform: "inherit",
    position: "relative",
    fontWeight: 900,
    left: -13,
    fontSize: 12,
    color: "rgba(228, 167, 115, 1) !important ",
  },
  betaSideNav5: {
    textTransform: "inherit",
    position: "relative",
    fontWeight: 900,
    left: -50,
    fontSize: 12,
    color: "rgba(228, 167, 115, 0.25) !important ",
  },
  betaSideNav3: {
    textTransform: "inherit",
    left: -10,
    fontSize: 12,
    fontWeight: 900,
    color: "rgba(228, 167, 115, 1) !important ",
  },
  betaSideNav6: {
    textTransform: "inherit",
    position: "relative",
    fontWeight: 900,
    left: -13,
    fontSize: 12,
    color: "rgba(228, 167, 115, 1) !important ",
  },
  betaSideNav7: {
    textTransform: "inherit",
    position: "relative",
    fontWeight: 900,
    left: -34,
    fontSize: 12,
    color: "rgba(228, 167, 115, 1) !important ",
  },
  betaSideNav4: {
    textTransform: "inherit",
    position: "relative",
    left: -40,
    fontSize: 12,
    color: "rgba(0, 0, 0, 0.52) !important ",
  },
  betaText: {
    fontSize: 10,
    top: 0,
    right: 0,
    left: 15,
    paddingLeft: 6,
  },
  avatar: {
    backgroundColor: "black",
    color: "white",
    width: "38px",
    height: "38px",
    margin: "0px",
  },
  cardContent: {
    maxHeight: "400px",
    backgroundColor: "#fff",
    padding: "0px",
    overflow: "auto",
    "&:last-child": {
      paddingBottom: "0",
    },
  },
  cardAction: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "space-evenly",
    backgroundColor: "#fff",
  },
  indicator: {
    backgroundColor: "rgba(23, 170, 221, 1) !important",
  },
  menuList: {
    paddingTop: "5%",
    paddingBottom: "5%",
    position: "relative",
    //width: drawerWidth - 1,

    top: "0%",
  },
  menuListBottom: {
    paddingTop: "5%",
    paddingBottom: "15%",
    position: "absolute",
    //width: drawerWidth - 1,
    bottom: "0",
  },
  menuListBottomDivider: {
    position: "relative",
    bottom: "90%",
  },
  menuListItem: {
    paddingBottom: "5%",
    width: drawerWidth,
    paddingTop: "5%",
    marginTop: "0%",
    paddingLeft: "17%",
    "&:hover": {
      backgroundColor: "Light Grey",
    },
    backgroundColor: theme.primary,
    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
      color: "rgba(35,55,77,1)",
    },
  },

  menuListItemDisabled: {
    paddingBottom: "5%",
    //width: drawerWidth - 1,
    paddingTop: "5%",
    marginTop: "0%",
    paddingLeft: "17%",
    "&:hover": {
      backgroundColor: "Light Grey",
    },
    backgroundColor: theme.primary,
    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
      color: "rgba(128,136,153,0.4)",
    },
  },

  menuListItemSelected: {
    backgroundColor: "rgba(198, 210, 225, 0) !important",
    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
      color: "rgba(23,170,221,1.0)",
      fontWeight: "bold",
    },
  },
  avatarUser: {
    fontFamily: "Poppins",
    fontSize: "12px",
    width: "28px",
    height: "28px",
    color: "#fff",
    backgroundColor: "rgba(23, 170, 221, 1)",
  },
  badge: {
    backgroundColor: "red",
  },
  userMenuItem: {
    color: "black",
  },
  actionWrapper: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "space-evenly",
  },
  applyWrapper: {
    margin: theme.spacing(1),

    position: "relative",
  },
  applySuccess: {
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700],
    },
  },

  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
  },

  applyProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  trackHeader: {
    "& span": {
      fontSize: 20,
    },
  },
  homeButton: {
    backgroundColor: theme.palette.secondary.main,
    position: "absolute",
    top: "0px",
    height: "35px",
    right: "0px",
    marginRight: "15px",
    marginTop: "15px",
    color: theme.palette.secondary.contrastText,
    alignItems: "center",
    justifyItems: "center",
  },
  trackButton: {
    backgroundColor: theme.palette.secondary.main,
    position: "relative",
    top: "0px",
    height: "35px",
    marginRight: "15px",
    marginTop: "6px",
    color: theme.palette.secondary.contrastText,
  },

  supportDrawer: {
    position: "fixed",
    left: drawerWidth,
    bottom: "30px",
    background: "rgba(255, 255, 255, 1.0)",
    "& .MuiListItem-gutters": {
      paddingRight: "30px",
    },
  },
}));

const M1neralLogoDrawer = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 11320 2490"
    className={props.className}
  >
    <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
      <path
        fill="#12ABE0"
        d="M1396 1823c-201 202-528 202-729 0-15-15-30-31-43-48l-366 366c14 16 29 31 44 47 403 402 1056 402 1459 0 356-356 397-908 124-1309l-379 378c80 188 43 413-110 566zm-839-163c-80-188-43-413 110-566 201-201 528-201 729 0 16 15 30 32 43 48l366-366c-14-16-29-31-44-47L1032 0 302 729c-356 356-397 908-124 1309l379-378zm292-384c101-100 264-100 365 0 101 101 101 264 0 365s-264 101-365 0c-100-101-100-264 0-365z"
      ></path>
      <g transform="translate(2687 379)">
        <path
          fill="#12ABE0"
          d="M2703 1686L2703 64 2703 0 2505 64 2072 202 2132 432 2422 351 2422 1686z"
        ></path>
        <path fill="black" d="M8354 6L8354 1686 8633 1686 8633 6z"></path>
        <path
          fill="black"
          d="M1324 699c156 0 246 103 246 297v690h279V911c0-297-161-465-426-465-184 0-313 85-412 214-65-129-187-214-362-214-186 0-292 101-370 209V471H0v1215h279v-683c0-189 106-304 260-304s246 106 246 295v692h279v-686c0-195 108-301 260-301zM3099 471v1215h278v-686c0-188 113-301 274-301 166 0 260 108 260 297v690h279V913c0-283-159-467-433-467-189 0-301 99-380 214V471h-278zM5053 446c-347 0-594 285-594 633v4c0 376 272 631 624 631 223 0 382-90 497-228l-163-145c-97 95-194 145-329 145-180 0-320-110-350-308h893c2-28 5-53 5-79 0-349-196-653-583-653zm306 548h-624c26-189 145-320 316-320 184 0 290 140 308 320zM5916 471v1215h279v-462c0-323 170-481 414-481h16V448c-214-9-354 115-430 297V471h-279zM6759 1086c0 345 274 628 644 628 142 0 269-41 373-110v110h279V446h-279v107c-102-68-228-107-368-107-373 0-649 287-649 635v5zm649 386c-216 0-371-179-371-391v-5c0-211 143-386 366-386 219 0 373 177 373 391v5c0 209-142 386-368 386z"
        ></path>
      </g>
    </g>
  </svg>
);

const M1neralLogo = styled(M1neralLogoDrawer)`
  width: 130px;
`;

const M1neralLogoNavNoAuth = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 11320 2490"
    className={props.className}
  >
    <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
      <path
        fill="#12ABE0"
        d="M1396 1823c-201 202-528 202-729 0-15-15-30-31-43-48l-366 366c14 16 29 31 44 47 403 402 1056 402 1459 0 356-356 397-908 124-1309l-379 378c80 188 43 413-110 566zm-839-163c-80-188-43-413 110-566 201-201 528-201 729 0 16 15 30 32 43 48l366-366c-14-16-29-31-44-47L1032 0 302 729c-356 356-397 908-124 1309l379-378zm292-384c101-100 264-100 365 0 101 101 101 264 0 365s-264 101-365 0c-100-101-100-264 0-365z"
      ></path>
      <g transform="translate(2687 379)">
        <path
          fill="#12ABE0"
          d="M2703 1686L2703 64 2703 0 2505 64 2072 202 2132 432 2422 351 2422 1686z"
        ></path>
        <path fill="white" d="M8354 6L8354 1686 8633 1686 8633 6z"></path>
        <path
          fill="white"
          d="M1324 699c156 0 246 103 246 297v690h279V911c0-297-161-465-426-465-184 0-313 85-412 214-65-129-187-214-362-214-186 0-292 101-370 209V471H0v1215h279v-683c0-189 106-304 260-304s246 106 246 295v692h279v-686c0-195 108-301 260-301zM3099 471v1215h278v-686c0-188 113-301 274-301 166 0 260 108 260 297v690h279V913c0-283-159-467-433-467-189 0-301 99-380 214V471h-278zM5053 446c-347 0-594 285-594 633v4c0 376 272 631 624 631 223 0 382-90 497-228l-163-145c-97 95-194 145-329 145-180 0-320-110-350-308h893c2-28 5-53 5-79 0-349-196-653-583-653zm306 548h-624c26-189 145-320 316-320 184 0 290 140 308 320zM5916 471v1215h279v-462c0-323 170-481 414-481h16V448c-214-9-354 115-430 297V471h-279zM6759 1086c0 345 274 628 644 628 142 0 269-41 373-110v110h279V446h-279v107c-102-68-228-107-368-107-373 0-649 287-649 635v5zm649 386c-216 0-371-179-371-391v-5c0-211 143-386 366-386 219 0 373 177 373 391v5c0 209-142 386-368 386z"
        ></path>
      </g>
    </g>
  </svg>
);
const M1neralLogoWhiteLetters = styled(M1neralLogoNavNoAuth)`
  width: 200px;
  padding-left: 10px;
  padding-right: 15px;
`;

const M1neralLogoLogin = styled(M1neralLogoNavNoAuth)`
  width: 190px;
  padding-top: 15px;
  padding-left: 35px;
`;

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

const drawerWidth = "250px";

export default function Navigation(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [openSupportCenter, setOpenSupportCenter] = useState(false);
  const [openContactForm, setOpenContactForm] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [supportDrawer, setSupportDrawer] = useState(false);
  const [openFilterCard, setOpenFilterCard] = useState(false);
  const [value, setValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const [loadingApply, setLoadingApply] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [disableApply, setDisableApply] = useState(true);
  const [matchLocation, setMatchLocation] = useState(false);
  const [matchTrack, setMatchTrack] = useState(false);
  const [matchTransact, setMatchTransact] = useState(false);
  const [matchFind, setMatchFind] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [getProfileImage, profiledata] = useLazyQuery(GETPROFILEIMAGE);
  useEffect(() => {
    if (stateApp?.user?.email) {
      getProfileImage({
        variables: { email: stateApp.user.email },
        fetchPolicy: "network-only",
      });
    }
  }, [stateApp.user]);

  useEffect(() => {
    if (
      profiledata &&
      profiledata.data &&
      profiledata.data.profileByEmail &&
      profiledata.data.profileByEmail.profile
    ) {
      const {
        data: {
          profileByEmail: {
            profile: { profileImage },
          },
        },
      } = profiledata;
      setProfileImage(profileImage);
    }
  }, [profiledata]);

  let history = useHistory();
  let location = useLocation();

  const applyButtonClass = clsx({
    [classes.applySuccess]: applySuccess,
  });

  const [valueTabsTrack, setValueTabsTrack] = useState(0);
  const handleTabChange = (event, newValue) => {
    setValueTabsTrack(newValue);
    setStateNav((stateNav) => ({
      trackTabsValue: newValue,
    }));
  };

  useEffect(() => {
    if (location.pathname === "/") {
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
      }));
    } else if (location.pathname === "/transact") {
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
      }));
    } else if (location.pathname === "/contacts") {
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
      }));
    }
  }, [location, setStateNav]);

  /* old filter counter moved to map.js 
  useEffect(() => {
    let operatorCount = stateNav.operatorName ? 1:0;
    let wellFilterCount = stateNav.statusName.length + stateNav.typeName.length + stateNav.profileName.length + operatorCount;
      setStateNav(state => ({ ...state, wellFilterCount: wellFilterCount }))
    
  }, [stateNav.statusName,
    stateNav.typeName,
    stateNav.profileName,
    stateNav.operatorName
  ])  */

  useEffect(() => {
    if (location.pathname === "/track") {
      setMatchTrack(true);
    } else {
      setMatchTrack(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === "/transact") {
      setMatchTransact(true);
    } else {
      setMatchTransact(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === "/") {
      setMatchLocation(true);
      setMatchFind(true);
    } else {
      setMatchLocation(false);
      setMatchFind(false);
    }
  }, [location.pathname]);

  const handleSearchInputChange = (event) => {
    console.log("input", event.currentTarget.value);
    setStateNav((state) => ({
      ...state,
      searchInputValue: event.currentTarget.value,
    }));
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = async () => {
    setAnchorEl(null);
    sessionStorage.clear();
    window.location.replace(window.location.origin);

    // setStateApp((stateApp) => ({ ...stateApp, user: null }));
    // setStateNav((stateNav) => ({ ...stateNav, defaultOn: false }));
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const openProfile = (event) => {
    event.preventDefault();
    handleMenuClose();
    setStateNav({ ...stateNav, isProfileOpen: true });
  };
  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "bottom", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem className={classes.userMenuItem} onClick={handleLogout}>
        Logout
      </MenuItem>
      <MenuItem
        className={classes.userMenuItem}
        onClick={(e) => openProfile(e)}
      >
        <Link to="/profile" style={{ textDecoration: "none", color: "black" }}>
          Profile
        </Link>
      </MenuItem>
    </Menu>
  );

  const handleListItemClick = (event, index, path) => {
    handleRouteChange(path);
    handleDrawerClose();
  };

  const handleListItemClickStudio = (event, index, path) => {
    // handleRouteChange(path);
    // handleDrawerClose();
    window.open("https://m1studio-dev.azurewebsites.net/", "_blank");
  };

  const handleRouteChange = (path) => {
    history.push(path);
  };

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleClickLogo = () => {
    setStateApp((stateApp) => ({ ...stateApp, toggleZoomOut: true }));
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  const handleFilterCardOpen = () => {
    setOpenFilterCard(true);
    // setAnchorEl(event.currentTarget)
  };
  const handleFilterCardClose = () => {
    setOpenFilterCard(false);
    setValue(0);
  };

  const handleClickAway = () => {
    setOpenFilterCard(false);
    setValue(0);
  };

  const sendHome = () => {
    history.push("/");
  };

  const toggleSupportDrawer = () => {
    setSupportDrawer(!supportDrawer);
  };

  /* const handleFilterCardApply = () => {
    setDisableApply(false)
  }

  const onFiltersChanged = filterModel => {
    setApplySuccess(false)
    setDisableApply(false)
  
  } */
  const handleFilterTabChange = (event, newValue) => {
    if (!openFilterCard) {
      setOpenFilterCard(true);
    }
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const handleOpenContactForm = () => {
    setOpenSupportCenter(false);
    setOpenContactForm(true);
  };

  const requestDemo = () => {
    window.open(
      "mailto:sales@m1neral.com?subject=Request for demo of premium features",
      "_blank"
    );
  };

  const handleClickAddDeal = () => {
    setStateApp((stateApp) => ({
      ...stateApp,
      dealDialog: true,
      activeDeal: { cardId: null, laneId: null },
    }));
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
        {stateApp.user ? (
          <Toolbar>
            {!openDrawer ? (
              <div className={classes.toolbar}>
                <IconButton color="secondary" onClick={handleDrawerOpen}>
                  {theme.direction === "rtl" ? <MenuIcon /> : <MenuIcon />}
                </IconButton>

                <div style={{marginRight: '35px'}}>
                <Button color='secondary' size="large" onClick={handleClickLogo} className={classes.margin}>
                <M1neralLogoWhiteLetters />
                </Button>
                </div>

              </div>
            ) : null}

            {openDrawer ? (
              <div className={classes.toolbar}>
                <M1neralLogo />
                <IconButton color="secondary" onClick={handleDrawerClose}>
                  {theme.direction === "rtl" ? (
                    <ChevronRightIcon />
                  ) : (
                    <ChevronLeftIcon />
                  )}
                </IconButton>
              </div>
            ) : null}

            {matchTrack ? (
              <CardHeader
                className={classes.trackHeader}
                //title="Track"
              />
            ) : null}

            {matchFind ? (
              <div className={classes.search} id="searchBarDivParent">
                <SearchBarWithToggleButton />
              </div>
            ) : null}

            <div className={classes.grow1} />
            {matchTransact ? (
              <div>
                <div ref={anchorEl} className={classes.filterTabs}>
                  <Button
                    onClick={handleClickAddDeal}
                    color="secondary"
                    variant="contained"
                  >
                    Add Deal
                  </Button>
                </div>
              </div>
            ) : (
              <div style={{ display: "none" }}></div>
            )}

            {matchTrack ? (
              <div
                styles={
                  {
                    // display: "flex",
                    // flexDirection: "column",
                    // justifyContent: "center",
                  }
                }
              >
                <div ref={anchorEl} className={classes.filterTabs}>
                  <Tabs
                    value={valueTabsTrack}
                    onChange={handleTabChange}
                    variant="standard"
                    textColor="primary"
                    aria-label="tabs"
                    classes={{ indicator: classes.indicator }}
                  >
                    {/*  TEMPORARY COMMENT OUT OF FEATURE IN PROGRESS
                    <Button
                      variant="contained"
                      disableElevation
                      type="submit"
                      className={classes.trackButton}
                      color="primary"
                      // onClick={signIn}
                      // onKeyDown={e => onEnterKey(e)}
                    >
                      EXPORT REPORT
                    </Button>

                    <Button
                      variant="contained"
                      disableElevation
                      type="submit"
                      style={{ marginRight: "40px" }}
                      className={classes.trackButton}
                      color="primary"
                      // onClick={signIn}
                      // onKeyDown={e => onEnterKey(e)}
                    >
                      SEND MAILERS
                    </Button> */}

                    <Tab
                      //onClick={handleFilterCardOpen}
                      value={0}
                      className={classes.tab}
                      icon={
                        <Badge
                          badgeContent={
                            stateApp.owners ? stateApp.owners.length : 0
                          }
                          color="secondary"
                        >
                          <OwnershipIcon color="#fff" opacity="1.0" />
                        </Badge>
                      }
                      aria-label="well"
                    />
                    <Tab
                      // disabled
                      //onClick={handleFilterCardOpen}
                      value={1}
                      className={classes.tab}
                      icon={
                        <Badge
                          badgeContent={
                            stateApp.trackedwells
                              ? stateApp.trackedwells.length
                              : 0
                          }
                          color="secondary"
                        >
                          <WellIcon color="#fff" opacity="1.0" />
                        </Badge>
                      }
                      aria-label="geography"
                    />
                  </Tabs>
                </div>
              </div>
            ) : (
              <div style={{ display: "none" }}></div>
            )}
            {matchLocation ? (
              <div ref={anchorEl} className={classes.filterTabs}>
                <Tabs
                  value={value}
                  onChange={handleFilterTabChange}
                  variant="standard"
                  textColor="primary"
                  aria-label="tabs"
                  classes={{ indicator: classes.indicator }}
                >
                  <Tab
                    // disabled
                    //onClick={handleFilterCardOpen}
                    value={0}
                    className={classes.tab}
                    icon={
                      <Badge
                        badgeContent={stateNav.geographyFilterCount}
                        color="secondary"
                      >
                        <GeographicIcon color="#fff" opacity="1.0" />
                      </Badge>
                    }
                    aria-label="geography"
                  />

                  <Tab
                    //onClick={handleFilterCardOpen}
                    value={1}
                    className={classes.tab}
                    icon={
                      <Badge
                        badgeContent={stateNav.wellFilterCount}
                        color="secondary"
                      >
                        <WellIcon color="#fff" opacity="1.0" />
                      </Badge>
                    }
                    aria-label="well"
                  />

                  <Tab
                    value={2}
                    classes={{ root: classes.tab }}
                    icon={
                      <Badge
                        badgeContent={stateNav.ownershipFilterCount}
                        color="secondary"
                      >
                        <OwnershipIcon color="#fff" opacity="1.0" />
                      </Badge>
                    }
                    aria-label="ownership"
                  />
                  <Tab
                    value={3}
                    classes={{ root: classes.tab }}
                    icon={
                      <Badge
                        badgeContent={stateNav.productionFilterCount}
                        color="secondary"
                      >
                        <ProductionIcon color="#fff" opacity="1.0" />
                      </Badge>
                    }
                    aria-label="production"
                  />
                  <Tab
                    // disabled={true}
                    value={4}
                    classes={{ root: classes.tab }}
                    aria-label="Value"
                    icon={
                      <Badge
                        badgeContent={stateNav.valuationFilterCount}
                        color="secondary"
                      >
                        <ValuationIcon color="#fff" opacity="1" />
                      </Badge>
                    }
                    aria-label="value"
                  />

                  <Tab
                    //disabled={true}
                    value={5}
                    classes={{ root: classes.tab }}
                    icon={
                      <Badge
                        badgeContent={stateNav.tagFilterCount}
                        color="secondary"
                      >
                        <LocalOfferIcon htmlColor="#fff" opacity="1" />
                      </Badge>
                    }
                    aria-label="tags and Tracks"
                  />
                  <Tab
                    //disabled={true}
                    value={6}
                    classes={{ root: classes.tab }}
                    icon={
                      <Badge
                        badgeContent={stateNav.aiFilterCount}
                        color="secondary"
                      >
                        <PredictiveIcon color="#fff" opacity="1" />
                      </Badge>
                    }
                    aria-label="ai"
                  />

                  <Tab
                    value={7}
                    classes={{ root: classes.tab }}
                    style={{ paddingTop: 10 }}
                    icon={
                      <Badge
                        badgeContent={stateNav.totalFilterCount}
                        color="secondary"
                      >
                        <SettingsIcon />
                      </Badge>
                    }
                    aria-label="filter settings"
                  />
                </Tabs>
              </div>
            ) : (
              <div style={{ display: "none" }}></div>
            )}
            <Divider style={{ margin: 1 }} orientation="vertical" />
            <IconButton
              style={{ left: "8.5px" }}
              onClick={handleProfileMenuOpen}
            >
              {profileImage ? (
                <Avatar src={profileImage} size="38" round />
              ) : (
                <Avatar name={stateApp.user.name} size="38" round />
              )}
            </IconButton>
          </Toolbar>
        ) : (
          <div
          //className={classes.goHome} onClick={sendHome}
          >
            {location.pathname !== "/" ? (
              <Link to="/">
                <M1neralLogoLogin />
              </Link>
            ) : (
              <M1neralLogoLogin />
            )}

            <div
            //className={classes.homeButton}
            >
              {/* <Button
                variant="contained"
                disableElevation
                type="submit"
                className={classes.homeButton}
                color="primary"
                // onClick={signIn}
                // onKeyDown={e => onEnterKey(e)}
              >
                Help?
              </Button> */}
              {/* <Link
                to={location.pathname !== "/" ? "/" : "/signup"}
                onClick={() => {
                  setStateApp((stateApp) => ({
                    ...stateApp,
                    signUpUserType: null,
                  }));
                }}
              >
                <Button
                  variant="contained"
                  disableElevation
                  type="submit"
                  className={classes.homeButton}
                  color="primary"
                >
                  {location.pathname !== "/" ? "SIGN IN" : "SIGN UP"}
                </Button>

                
              </Link> */}
            </div>
          </div>
        )}
      </AppBar>

      <Drawer
        variant="temporary"
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
        open={openDrawer}
      >
        <div className={classes.toolbar}>
          <div className={classes.drawerOpenLogo}>
            <M1neralLogo />
          </div>

          <IconButton color="secondary" onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>
        <Divider variant="middle" light="true" />
        <List className={classes.menuList}>
          <ListItem
            classes={{
              root: classes.menuListItem,
              selected: classes.menuListItemSelected,
            }}
            button
            selected={stateNav.selectedMenuIndexDashboard === 1}
            onClick={(event) => handleListItemClick(event, 0, "/dashboard")}
            key="dashboard"
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>

          <ListItem
            classes={{
              root: classes.menuListItem,
              selected: classes.menuListItemSelected,
            }}
            button
            selected={stateNav.selectedMenuIndexFind === 1}
            onClick={(event) => handleListItemClick(event, 0, "/")}
            key="home"
          >
            <ListItemIcon>
              <SearchIcon />
            </ListItemIcon>
            <ListItemText primary="Find" />
          </ListItem>

          {/* <ListItem
            classes={{
              root: classes.menuListItem,
              selected: classes.menuListItemSelected,
            }}
            button
            selected={stateNav.selectedMenuIndexTrack === 1}
            onClick={(event) => handleListItemClick(event, 0, "/track")}
            key="track"
          >
            <ListItemIcon>
              <MyLocationIcon />
            </ListItemIcon>
            <ListItemText primary="Track" />
          </ListItem> */}

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
              }));
              handleListItemClick(event, 0, "/contacts");
            }}
            key="contacts"
          >
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Contacts" />
            <ListItemSecondaryAction>
              <Button
                disabled
                className={classes.betaSideNav3}
                edge="end"
                aria-label="beta"
              >
                beta
              </Button>
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem
            classes={{
              root: classes.menuListItem,
              selected: classes.menuListItemSelected,
            }}
            button
            selected={stateNav.selectedMenuIndexTransact === 1}
            onClick={(event) => handleListItemClick(event, 0, "/transact")}
            key="transact"
          >
            <ListItemIcon>
              <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText primary="Transact" />
            <ListItemSecondaryAction>
              <Button
                disabled
                className={classes.betaSideNav2}
                edge="end"
                aria-label="beta"
              >
                beta
              </Button>
            </ListItemSecondaryAction>
          </ListItem>

          {/* <ListItem
            classes={{
              root: classes.menuListItem,
              selected: classes.menuListItemSelected,
            }}
            button
            selected={stateNav.selectedMenuIndexTitle === 1}
            onClick={(event) => handleListItemClickStudio(event, 0, "/studio")}
            key="studio"
          >
            <ListItemIcon>
              <LayersIcon />
            </ListItemIcon>
            <ListItemText primary="M1Studio" />
          </ListItem> */}

          <ListItem
            classes={{
              root: classes.menuListItem,
              selected: classes.menuListItemSelected,
            }}
            button
            selected={stateNav.selectedMenuIndexStudio === 1}
            onClick={(event) => handleListItemClick(event, 0, "/studio")}
            key="studio"
          >
            <ListItemIcon>
              <LayersIcon />
            </ListItemIcon>
            <ListItemText primary="Studio" />

            <ListItemSecondaryAction>
              <Button
                disabled
                className={classes.betaSideNav7}
                edge="end"
                aria-label="beta"
              >
                beta
              </Button>
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem
            classes={{
              root: classes.menuListItemDisabled,
              selected: classes.menuListItemSelected,
            }}
            button
            selected={stateNav.selectedMenuIndexTitle === 1}
            onClick={(event) => handleListItemClick(event, 0, "/title")}
            key="title"
          >
            <ListItemIcon>
              <DescriptionIcon />
            </ListItemIcon>
            <ListItemText primary="Title" />
            <ListItemSecondaryAction>
              <Button
                disabled
                className={classes.betaSideNav5}
                edge="end"
                aria-label="beta"
              >
                beta
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
        <Divider variant="middle" className={classes.menuListBottomDivider} />
        <List className={classes.menuListBottom}>

          {/* <ListItem
            classes={{
              root: classes.menuListItemDisabled,
              selected: classes.menuListItemSelected,
            }}
            button
            selected={stateNav.selectedMenuIndexAlerts === 1}
            //onClick={(event) => handleListItemClick(event, 0, "/alerts")}
            key="alerts"
          >
            <ListItemIcon>
              <NotificationsActiveIcon />
            </ListItemIcon>
            <ListItemText primary="Alerts" />
          </ListItem> */}

          {/* support menu */}
          <ListItem
            classes={{
              root: classes.menuListItem,
              selected: classes.menuListItemSelected,
            }}
            button
            selected={stateNav.selectedMenuIndex === 1}
            //onClick={event => handleListItemClick(event, 1, '/track')}
            onClick={() => toggleSupportDrawer()}
            key="support"
          >
            <ListItemIcon>
              <HeadsetMicIcon />
            </ListItemIcon>
            <ListItemText primary="Support" />

            {/* <ListItemSecondaryAction>
              <Button disabled className={classes.betaSideNav2} edge="end" aria-label="BETA">
                BETA
              </Button>
            </ListItemSecondaryAction> */}
          </ListItem>
          {supportDrawer && (
            <ClickAwayListener onClickAway={() => setSupportDrawer(false)}>
              <div className={classes.supportDrawer}>
                <List component="div">
                  <ListItem button onClick={() => setOpenSupportCenter(true)}>
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

          <SupportCenterModal
            open={openSupportCenter}
            openContactForm={handleOpenContactForm}
            onClose={() => setOpenSupportCenter(false)}
          />
          <ContactFormModal
            open={openContactForm}
            onClose={() => setOpenContactForm(false)}
          />

          {/* <ListItem
            classes={{
              //root: classes.menuListItemDisabled,
              //selected: classes.menuListItemDisabled,
            }}
            button
            //selected={stateNav.selectedMenuIndex === 0}
            //onClick={event => handleListItemClick(event, 0, '/find')}
            key="pulse"
          >
            <ListItemIcon>
              <TimelineIcon />
            </ListItemIcon>
            <ListItemText primary="Pulse" />
          </ListItem> */}

          {/* <ListItem
            classes={{
              //root: classes.menuListItemDisabled,
              //selected: classes.menuListItemSelected,
            }}
            button
            //selected={stateNav.selectedMenuIndex === 1}
            //onClick={event => handleListItemClick(event, 1, '/track')}
            key="presss"
          >
            <ListItemIcon>
              <DvrIcon />
            </ListItemIcon>
            <ListItemText primary="Press" />
          </ListItem> */}
        </List>
      </Drawer>

      {openFilterCard ? (
        <div ref={anchorEl} className={classes.tabPanelWrapper}>
          <TabPanel value={value} index={0} dir={theme.direction}>
            <ClickAwayListener onClickAway={(e) => handleClickAway(e)}>
              <Card className={classes.card}>
                <CardHeader
                  classes={{
                    title: classes.cardTitle,
                    subheader: classes.subheader,
                  }}
                  action={
                    <div className={classes.actionWrapper}>
                      <IconButton
                        color="secondary"
                        onClick={handleFilterCardClose}
                      >
                        <CloseIcon />
                      </IconButton>
                    </div>
                  }
                  title="Filter"
                  subheader="Geographical"
                />

                <CardContent className={classes.cardContent}>
                  <FilterFromGeo />
                </CardContent>
              </Card>
            </ClickAwayListener>
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <ClickAwayListener onClickAway={handleClickAway}>
              <Card className={classes.card}>
                <CardHeader
                  classes={{
                    title: classes.cardTitle,
                    subheader: classes.subheader,
                  }}
                  action={
                    <div className={classes.actionWrapper}>
                      <IconButton
                        color="secondary"
                        onClick={handleFilterCardClose}
                      >
                        <CloseIcon />
                      </IconButton>
                    </div>
                  }
                  title="Filter"
                  subheader="Well"
                />
                {/* <CardActions
                  classes={{
                    root: classes.cardAction,
                  }}
                ></CardActions> */}
                <CardContent className={classes.cardContent}>
                  <FilterFormWell />
                </CardContent>
              </Card>
            </ClickAwayListener>
          </TabPanel>
          <TabPanel value={value} index={2} dir={theme.direction}>
            <ClickAwayListener onClickAway={handleClickAway}>
              <Card className={classes.card}>
                <CardHeader
                  classes={{
                    title: classes.cardTitle,
                    subheader: classes.subheader,
                  }}
                  action={
                    <div>
                      <IconButton
                        color="secondary"
                        onClick={handleFilterCardClose}
                      >
                        <CloseIcon />
                      </IconButton>
                    </div>
                  }
                  title="Filter"
                  subheader="Ownership"
                />
                {/* <CardActions
                  classes={{
                    root: classes.cardAction,
                  }}
                ></CardActions> */}
                <CardContent className={classes.cardContent}>
                  <FilterFormOwner />
                </CardContent>
              </Card>
            </ClickAwayListener>
          </TabPanel>
          <TabPanel value={value} index={3} dir={theme.direction}>
            <ClickAwayListener onClickAway={handleClickAway}>
              <Card className={classes.card}>
                <CardHeader
                  classes={{
                    title: classes.cardTitle,
                    subheader: classes.subheader,
                  }}
                  action={
                    <div>
                      <IconButton
                        color="secondary"
                        onClick={handleFilterCardClose}
                      >
                        <CloseIcon />
                      </IconButton>
                    </div>
                  }
                  title="Filter"
                  subheader="Production"
                />
                {/* <CardActions
                  classes={{
                    root: classes.cardAction,
                  }}
                ></CardActions> */}
                <CardContent className={classes.cardContent}>
                  <FilterFormProduction />
                </CardContent>
              </Card>
            </ClickAwayListener>
          </TabPanel>

          <TabPanel value={value} index={4} dir={theme.direction}>
            <ClickAwayListener onClickAway={handleClickAway}>
              <Card className={classes.card}>
                <CardHeader
                  classes={{
                    title: classes.cardTitle,
                    subheader: classes.subheader,
                  }}
                  action={
                    <div>
                      <IconButton
                        color="secondary"
                        onClick={handleFilterCardClose}
                      >
                        <CloseIcon />
                      </IconButton>
                    </div>
                  }
                  title="Filter"
                  subheader="Value"
                />
                {/* <CardActions
                  classes={{
                    root: classes.cardAction,
                  }}
                ></CardActions> */}
                <CardContent className={classes.cardContent}>
                  <FilterFormValue />
                </CardContent>
              </Card>
            </ClickAwayListener>
          </TabPanel>
          <TabPanel value={value} index={5} dir={theme.direction}>
            <ClickAwayListener onClickAway={handleClickAway}>
              <Card className={classes.card}>
                <CardHeader
                  classes={{
                    title: classes.cardTitle,
                    subheader: classes.subheader,
                  }}
                  action={
                    <div>
                      <IconButton
                        color="secondary"
                        onClick={handleFilterCardClose}
                      >
                        <CloseIcon />
                      </IconButton>
                    </div>
                  }
                  title="Filter"
                  subheader="Tags and Tracks"
                />
                {/* <CardActions
                  classes={{
                    root: classes.cardAction,
                  }}
                ></CardActions> */}
                <CardContent className={classes.cardContent}>
                  <FilterFormTags />
                </CardContent>
              </Card>
            </ClickAwayListener>
          </TabPanel>
          <TabPanel value={value} index={6} dir={theme.direction}>
            <ClickAwayListener onClickAway={handleClickAway}>
              <Card className={classes.card}>
                <CardHeader
                  classes={{
                    title: classes.cardTitle,
                    subheader: classes.subheader,
                  }}
                  action={
                    <div>
                      <IconButton
                        color="secondary"
                        onClick={handleFilterCardClose}
                      >
                        <CloseIcon />
                      </IconButton>
                    </div>
                  }
                  title="Filter"
                  subheader="Artificial Intelligence"
                />
                {/* <CardActions
                  classes={{
                    root: classes.cardAction,
                  }}
                ></CardActions> */}
                <CardContent className={classes.cardContent}>
                  <FilterFormAI />
                </CardContent>
              </Card>
            </ClickAwayListener>
          </TabPanel>
          <TabPanel value={value} index={7} dir={theme.direction}>
            <ClickAwayListener onClickAway={handleClickAway}>
              <Card className={classes.card}>
                <CardHeader
                  classes={{
                    title: classes.cardTitle,
                    subheader: classes.subheader,
                  }}
                  action={
                    <div>
                      <IconButton
                        color="secondary"
                        onClick={handleFilterCardClose}
                      >
                        <CloseIcon />
                      </IconButton>
                    </div>
                  }
                  title="Filter"
                  subheader="Advanced Search"
                />
                {/* <CardActions
                  classes={{
                    root: classes.cardAction,
                  }}
                ></CardActions> */}
                <CardContent className={classes.cardContent}>
                  <FilterDefaults />
                </CardContent>
              </Card>
            </ClickAwayListener>
          </TabPanel>
        </div>
      ) : null}
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {props.children}
      </main>
      {renderMenu}
    </div>
  );
}
