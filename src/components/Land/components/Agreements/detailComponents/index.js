import React, { useState, useRef, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { debounce } from "lodash";
import { makeStyles, withStyles } from "@material-ui/styles";
import { Typography, IconButton, Tabs, Tab, Button, Menu, MenuItem, ListItemIcon, ListItemText } from "@material-ui/core";
import {
  DescriptionOutlined as DocumentIcon,
  InfoOutlined as InfoOutlinedIcon,
  Delete as DeleteIcon,
  MoreHoriz as MoreHorizIcon,
  Repeat as FlowIcon,
} from "@material-ui/icons";
import RuleIcon from "components/Shared/components/svgIcons/RuleIcon";
import Tags from "components/Shared/Tagger";
import { useLazyQuery } from "@apollo/client";
import { GETMONGOUSERS } from "graphQL/useQueryGetUsers";

// Components
import NavHeader from "components/Land/components/Common/NavHeader";

const useStyles = makeStyles((theme) => ({
  detailHeader: {
    backgroundColor: "#fff",
    padding: "20px 27px 0px 45px",
    marginTop: "7px",
  },
  title: {
    display: "flex",
    alignItems: "center",
  },
  titleText: {
    marginLeft: 16,
  },
  highlighter: {
    background: "#263451",
    padding: "5px 16px",
    borderRadius: 16,
    width: "max-content",
    transform: "translateX(5px) translateY(11px)",
    height: "32px",
  },
  highlight: {
    color: "#ffffff",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  icon: {
    height: 80,
    width: 80,
    backgroundColor: "#d5f4ff",
    borderRadius: 12,
    "& svg": {
      fontSize: "3.1875rem",
      fill: "#263451",
    },
  },
  tabsHeader: {
    background: "#ffffff",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tabsSection: {},
  headerSection: {
    padding: "20px 30px",
    background: "#ffffff",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  summarySection: {
    padding: 20,
    background: "#ffffff",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  tagsContainer: {
    display: "flex",
    flexDirection: "row",
  },
  tags: {
    "& fieldset": {
      border: "none",
    },
  },
  tabsSectionDetails: {
    maxHeight: "calc(100vh - 280px)",
    overflow: "overlay",
    backgroundColor: "#f3f3f3",
  },
  actionsContainer: {
    display: "flex",
    direction: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  metaActions: ({ collapse }) => ({
    marginTop: "2px",
    "& button": {
      margin: "0px 5px",
      backgroundColor: !collapse ? "#eceded" : "#fff",
      color: "grey",
      fontWeight: "bold",
      textTransform: "capitalize",
      padding: "6px 12px",
      "&:hover": {
        backgroundColor: !collapse ? "#eceded" : "#fff",
      },
    },
  }),
  menu: {
    "& .MuiListItem-gutters": {
      paddingLeft: "10px !important",
      paddingRight: "10px !important",
    },
    "& .MuiListItem-root": {
      "& .MuiListItemIcon-root": {
        minWidth: "25px",
        "& .MuiSvgIcon-root": {
          fill: "red !important",
        },
      },
    },
  },
  tabsDetailContainer: ({ collapse }) => ({
    padding: 20,
    maxWidth: !collapse ? "calc(100% - 380px)" : "100%",
  }),
  menuIcon: {
    marginLeft: 10,
    background: "transparent",
    align: "center",
    "& svg": {
      fill: "#808080 !important",
    },
  },
}));

const StyledTabs = withStyles({
  root: {
    textTransform: "capitalize",
  },
  indicator: {
    backgroundColor: "#12abe0",
    height: "5px",
  },
})(Tabs);

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: "uppercase",
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(4),
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:hover": {
      color: "black",
      opacity: 1,
    },
    "&$selected": {
      color: "black",
      fontWeight: theme.typography.fontWeightMedium,
    },
    "&:focus": {
      color: "black",
    },
  },
  selected: {},
}))((props) => <Tab disableRipple {...props} />);

export default function DetailComponents(props) {
  const { id: agreementId } = useParams();
  const { activeAgreement: agreementDetails } = useSelector(({ Land }) => Land.agreement);

  const [tab, setTab] = useState(0);
  const selectedTabRef = useRef(null);
  const [isButtonScroll, setButtonScroll] = useState(false);
  const [collapse, setCollapse] = useState(true);
  const [users, setUsers] = useState([]);
  const [anchorEl, setAnchorEl] = useState();

  const classes = useStyles({ ...props, collapse });
  // queries

  const [getAllMongoUsers, { data: userLists }] = useLazyQuery(GETMONGOUSERS, {
    fetchPolicy: "no-cache",
  });

  //   useEffect(() => {
  //     if (getCheckResult?.getCheck?.check)
  //       dispatch(setRevenueKey("statements", { ...statements, activeStatement: getCheckResult?.getCheck?.check }));
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [getCheckResult, dispatch]);

  useEffect(() => {
    if (selectedTabRef?.current) {
      selectedTabRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start",
      });
    }
  }, [tab]);

  useEffect(() => {
    if (agreementId) {
      // setCheckId(checkId);
      // getCheck({
      //   variables: { id: checkId },
      // });
      getAllMongoUsers();
    }
  }, [agreementId]);

  useEffect(() => {
    if (userLists && userLists.allMongoUsers) {
      setUsers(
        userLists.allMongoUsers.map((user) => ({
          value: user._id,
          text: user.name,
          email: user.email,
        }))
      );
    }
  }, [userLists]);

  const handleScroll = (e) => {
    if (!isButtonScroll) {
      const { scrollTop } = e.target;
      if (scrollTop <= 270 && tab !== 0) setTab(0);
      else if (scrollTop > 270 && scrollTop <= 470 && tab !== 1) setTab(1);
      else if (scrollTop > 470 && tab !== 2) setTab(2);
    }
    handleEndScroll();
  };

  const handleEndScroll = useMemo(() => debounce(() => setButtonScroll(false), 1000), []);

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);

  return (
    <NavHeader title={`${agreementDetails?.agreementNumber} - ${agreementDetails?.agreementName}`}>
      {/**
       * Detail title section
       */}
      <div className={`${classes.detailHeader} flex justifyBetween alignStart w-100`}>
        <div className="flex column alignStart justifyStart w-100">
          <div className={classes.title}>
            <IconButton className={classes.icon}>
              <DocumentIcon />
            </IconButton>
            <div className={classes.titleText}>
              {agreementDetails && (
                <Typography
                  style={{ fontWeight: "bold", fontSize: "large", marginLeft: 8 }}
                >{`${agreementDetails?.agreementNumber} - ${agreementDetails?.agreementName}`}</Typography>
              )}
              <div className={classes.tagsContainer}>
                <div className={classes.highlighter}>
                  <Typography className={classes.highlight} variant="highlight">
                    {agreementDetails.agreementType}
                  </Typography>
                </div>
                <div className={classes.tags}>
                  <Tags width="100%" targetSourceId={agreementId} targetLabel="agreement" publicLeftBottom onlyTags />
                </div>
              </div>
            </div>
          </div>

          <div className={classes.actionsContainer}>
            <div className={classes.tabsHeader}>
              <StyledTabs
                value={tab}
                onChange={(event, tab) => {
                  setButtonScroll(true);
                  setTab(tab);
                }}
                aria-label="ant example"
              >
                <StyledTab label="Summary" />
                <StyledTab label="Parties" />
                <StyledTab label="Provisions" />
                <StyledTab label="Legal Description" />
                <StyledTab label="Wells" />
                <StyledTab label="Documents" />
                <StyledTab label="Related Info" />
              </StyledTabs>
            </div>
            <div className={classes.metaActions}>
              <Button startIcon={<RuleIcon />} onClick={() => setCollapse(!collapse)}>
                Validations
              </Button>
              <Button startIcon={<FlowIcon />} onClick={() => setCollapse(!collapse)}>
                Flowlines
              </Button>
              <Button startIcon={<InfoOutlinedIcon />} onClick={() => setCollapse(!collapse)}>
                Metadata
              </Button>
              <IconButton size="small" component="span" className={classes.menuIcon} onClick={handleMenuClick}>
                <MoreHorizIcon size="medium" />
              </IconButton>
            </div>
          </div>
        </div>
      </div>

      {/**
       * Menu for meta data
       */}
      <Menu
        id="revStatementMenu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        className={classes.menu}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MenuItem>
          <ListItemIcon>
            <DeleteIcon size="medium" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </NavHeader>
  );
}
