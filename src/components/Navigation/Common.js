import React from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";

const drawerWidth = 477;

export const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    width: "100%",
    height: "100%",
  },
  appBar: {
    height: "64px",
    background: "transparent",
    zIndex: 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    paddingRight: "0 !important",
    boxShadow: "none",
    "& .MuiToolbar-root": {
      marginLeft: "60px",
    },
  },
  appBarWhite: {
    height: "64px",
    background: "#ffff",
    zIndex: 1000,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    paddingRight: "0 !important",
    boxShadow: "none",
    "& .MuiToolbar-root": {
      marginLeft: "60px",
    },
  },
  appBarShift: {
    marginLeft: `${drawerWidth}px`,
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
    width: `${drawerWidth}px`,
    flexShrink: 0,
    whiteSpace: "nowrap",
    zIndex: 1,
  },
  filterTabs: {
    paddingRight: "25px",
    position: "relative",
    left: 0,
  },
  drawerOpenLogo: {
    paddingTop: "10px",
    cursor: "pointer",
  },
  iconArrow: {
    color: "gray",
    textAlign: "right",
    padding: "4px 0",
    transition: "all 0.3s ease-in-out",
    margin: "5px 15px 0px auto",
    "&:hover": {
      background: "unset",
      color: "rgba(23, 170, 221, 1)",
    },
  },
  menuIcon: {
    position: "relative",
    left: "-8px",
    fontSize: "30px",
  },
  drawerOpen: {
    background: "#0e111a",
    width: `${drawerWidth}px`,
    height: "100%",
    top: "0",
    color: "#fff",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    zIndex: "1 !important",
    background: "#0e111a",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 4,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(7) + 4,
    },
    borderRight: "1px solid rgb(38 52 81) !important",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
  },
  content: (props) => ({
    flexGrow: 1,
    width: props.user ? "calc(100% - 60px)" : "calc(100% - 0px)",
    position: "absolute",
    left: props.user ? "60px" : "0px",
    height: "100%",
    overflow: props.isMap ? "hidden" : 'auto'
  }),
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
    // backgroundColor: "rgb(21 38 74)",
    marginRight: theme.spacing(2),
    marginLeft: "425px !important",
    width: "34%",
    height: "40px",
    transition: "width 0.5s",
    [theme.breakpoints.up("sm")]: {
      marginLeft: 5,
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
      "&:hover": {},
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
  betaSideNav5: {
    textTransform: "inherit",
    position: "relative",
    fontWeight: 900,
    fontSize: 10,
    color: "rgba(228, 167, 115, 0.25) !important ",
  },
  betaSideNav3: {
    textTransform: "inherit",
    fontSize: 10,
    fontWeight: 900,
    color: "rgba(228, 167, 115, 1) !important ",
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
    maxHeight: "650px",
    backgroundColor: "#fff",
    padding: "0px",
    overflow: "auto",
    "&::-webkit-scrollbar": {
      width: "0.75em",
      height: "0.75em",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#929292",
      borderRadius: 10,
    },
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
    paddingTop: "20px",
    paddingBottom: "10px",
    position: "relative",
  },
  menuListBottom: {
    paddingTop: "5%",
    position: "absolute",
    bottom: "0",
  },
  menuListBottomDivider: {
    position: "relative",
    bottom: "90%",
  },
  menuListItem: {
    paddingBottom: "10px",
    paddingLeft: "10px",
    width: `${drawerWidth - 1}px`,
    paddingTop: "10px",
    display: "flex",
    "&:hover": {
      backgroundColor: "Light Grey",
    },
    backgroundColor: theme.primary,
    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
      color: "#fff",
      "& svg": {
        fill: "#fff",
        padding: "4px",
        height: "1.3em",
        width: "1.3em",
      },
    },
  },
  menuListItemDisabled: {
    paddingBottom: "5%",
    paddingTop: "5%",
    marginTop: "0%",
    "&:hover": {
      backgroundColor: "Light Grey",
    },
    backgroundColor: theme.primary,
    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
      color: "rgba(128,136,153,0.4)",
    },
  },
  menuListItemSelected: {
    backgroundColor: "rgba(23, 170, 221, 0.08) !important",
    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
      // color: "rgba(21,93,123,1.0)",
      color: "#12abe0",
      fontWeight: "bold",
      "& svg": {
        fill: "#12abe0",
      },
    },
    display: "flex",
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
    left: `${drawerWidth}px`,
    bottom: "30px",
    zIndex: "9999999 !important",
    background: "rgba(255, 255, 255, 1.0)",
    "& .MuiListItem-gutters": {
      paddingRight: "30px",
    },
  },
  tabContent: {
    display: "flex",
    alignItems: "center",
  },
  sideNavIcon: {
    minWidth: 0,
    marginRight: 22,
    marginLeft: 3,
    border: "1px solid #263451",
    borderRadius: "5px",
    "& svg": {
      fontSize: "1.5rem",
    },
    "&:hover": {
      border: "1px solid #12abe0",
    },
  },
  sideNavText: {
    flex: 2,
    marginRight: -8,
  },
  sideNavAction: {
    top: "unset !important",
    right: "unset !important",
    position: "unset !important",
    transform: "unset !important",
    flex: 1,
  },
  activitySearchField: {
    color: "#fff",
    "& .MuiOutlinedInput-input": {
      color: "#ffffff",
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
  },
  iconTooltip: {
    // width: "120px",
    fontSize: "15px",
    padding: "10px",
  },
  editWorkspaceIcon: {
    textAlign: "right",
    margin: "5px 0px 0px 108px",
    "& svg": {
      color: "white",
      fill: "#ffff",
    },
  },
  workspaceIcon: {
    width: "260px",
    paddingLeft: "5px",
    paddingRight: "15px",
    display: "flex",
    alignItems: "center",
    "& img": {
      width: "50px",
      height: "52px",
    },
    "& .MuiTypography-root": {
      marginLeft: "10px",
      fontWeight: "bold",
      fontSize: "2.6rem !important",
    },
  },
}));

export const M1neralLogoNavNoAuth = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11320 2490" className={props.className}>
    <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
      <path
        fill="#12ABE0"
        d="M1396 1823c-201 202-528 202-729 0-15-15-30-31-43-48l-366 366c14 16 29 31 44 47 403 402 1056 402 1459 0 356-356 397-908 124-1309l-379 378c80 188 43 413-110 566zm-839-163c-80-188-43-413 110-566 201-201 528-201 729 0 16 15 30 32 43 48l366-366c-14-16-29-31-44-47L1032 0 302 729c-356 356-397 908-124 1309l379-378zm292-384c101-100 264-100 365 0 101 101 101 264 0 365s-264 101-365 0c-100-101-100-264 0-365z"
      ></path>
      <g transform="translate(2687 379)">
        <path fill="#12ABE0" d="M2703 1686L2703 64 2703 0 2505 64 2072 202 2132 432 2422 351 2422 1686z"></path>
        <path fill="white" d="M8354 6L8354 1686 8633 1686 8633 6z"></path>
        <path
          fill="white"
          d="M1324 699c156 0 246 103 246 297v690h279V911c0-297-161-465-426-465-184 0-313 85-412 214-65-129-187-214-362-214-186 0-292 101-370 209V471H0v1215h279v-683c0-189 106-304 260-304s246 106 246 295v692h279v-686c0-195 108-301 260-301zM3099 471v1215h278v-686c0-188 113-301 274-301 166 0 260 108 260 297v690h279V913c0-283-159-467-433-467-189 0-301 99-380 214V471h-278zM5053 446c-347 0-594 285-594 633v4c0 376 272 631 624 631 223 0 382-90 497-228l-163-145c-97 95-194 145-329 145-180 0-320-110-350-308h893c2-28 5-53 5-79 0-349-196-653-583-653zm306 548h-624c26-189 145-320 316-320 184 0 290 140 308 320zM5916 471v1215h279v-462c0-323 170-481 414-481h16V448c-214-9-354 115-430 297V471h-279zM6759 1086c0 345 274 628 644 628 142 0 269-41 373-110v110h279V446h-279v107c-102-68-228-107-368-107-373 0-649 287-649 635v5zm649 386c-216 0-371-179-371-391v-5c0-211 143-386 366-386 219 0 373 177 373 391v5c0 209-142 386-368 386z"
        ></path>
      </g>
    </g>
  </svg>
);
