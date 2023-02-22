import React, { useState, useRef, useEffect, useContext, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import { makeStyles, withStyles } from "@material-ui/styles";
import {
  CircularProgress,
  Dialog,
  DialogTitle,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import {
  LocalAtm as CurrencyIcon,
  InfoOutlined as InfoOutlinedIcon,
  Delete as DeleteIcon,
  MoreHoriz as MoreHorizIcon,
} from "@material-ui/icons";
import DeleteConfirmationDialogContent from "components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";
import Tags from "components/Shared/Tagger";
import MetaField from "components/Table/helpers/MetaField";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GETCHECK } from "graphQL/useQueryCheck";
import { REMOVE_CHECKS } from "graphQL/useMutationRemoveChecks";
import { UPSERT_USER_DESCRIPTOR } from "graphQL/useMutationUserDescriptor";
import { UPDATE_CHECK_DATA } from "graphQL/useMutationUpdateCheck";
import { AppContext } from "AppContext";

// Components
import HeaderSection from "./HeaderSection";
import SummarySection from "./SummarySection";
import CheckDetailsSection from "./CheckDetailsSection";
import NavHeader from "components/Revenue/components/Common/NavHeader";
import DocViewer from "components/Shared/DocViewer";
import LineItem from ".//LineItem";
import MetadataDrawer from "components/Revenue/components/Common/MetadataDrawer";

import { setRevenueKey } from "actions";

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
    width: "calc(65vw - 10px)",
  },
  highlighter: {
    background: "#263451",
    padding: "5px 16px",
    borderRadius: 16,
    width: "160px",
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
    width: "100%",
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
    maxWidth: !collapse ? "calc(100% - 644px)" : "100%",
  }),
  menuIcon: {
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
  const dispatch = useDispatch();
  const { statements } = useSelector(({ Revenue }) => Revenue);

  const [tab, setTab] = useState(0);
  const [checksFlatData, setChecksFlatData] = useState({});
  const selectedTabRef = useRef(null);
  const [isButtonScroll, setButtonScroll] = useState(false);
  const [collapse, setCollapse] = useState(true);
  const [stateApp, setStateApp] = useContext(AppContext);
  const [anchorEl, setAnchorEl] = useState();
  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
  const [loader, setLoader] = useState(false);
  const [checkIdToDelete, setCheckIdToDelete] = useState(null);

  const history = useHistory();
  const previousRoute = history.pathHistory[1];
  const isLineItem = history.location.pathname.includes("/line-item");
  const checkId = getIdFromPath()

  const classes = useStyles({ ...props, collapse });
  // queries
  const [updateOwner] = useMutation(UPSERT_USER_DESCRIPTOR);
  const [updateCheck] = useMutation(UPDATE_CHECK_DATA);

  const [getCheck, { data: getCheckResult }] = useLazyQuery(GETCHECK, {
    fetchPolicy: "no-cache",
  });

  // mutations
  const [removeChecks] = useMutation(REMOVE_CHECKS, {
    refetchQueries: ["getESPaginatedList"],
    awaitRefetchQueries: true,
  });

  useEffect(() => {
    if (getCheckResult?.getCheck?.check) setChecksFlatData(getCheckResult.getCheck.check);
  }, [getCheckResult]);

  const handleDeleteCancel = () => {
    setCheckIdToDelete(null);
    setOpenDeleteConfirmDialog(false);
    setAnchorEl(false);
  };

  function getIdFromPath() {
    let pathname = history.location.pathname;
    if (pathname.slice(-1) === '/')
      pathname = pathname.substring(0, pathname.length - 1);

    return pathname.replace("/line-item", "").split("/")[
      pathname.replace("/line-item", "").split("/").length - 1
    ];
  }

  const handleDeleteAccept = () => {
    // Check Document Logic goes here
    if (checkIdToDelete) {
      setLoader(true);
      removeChecks({
        variables: {
          checkIds: [checkIdToDelete],
        },
      }).then(() => {
        setLoader(false);
        history.push(previousRoute || "/revenue/statements");
      });
    }
  };

  useEffect(() => {
    if (getCheckResult?.getCheck?.check)
      dispatch(setRevenueKey("statements", { ...statements, activeStatement: getCheckResult?.getCheck?.check }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getCheckResult, dispatch]);

  useEffect(() => {
    if (selectedTabRef?.current?.scrollIntoView) {
      selectedTabRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start",
      });
    }
  }, [tab]);

  useEffect(() => {
    if (checkId) {
      getCheck({
        variables: { id: checkId },
      });
    }
  }, []);

  useEffect(() => {
    return () => {
      setStateApp({ ...stateApp, viewDoc: null });
    };
  }, []);

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

  const onUpdateMetaData = (data) => {
    if (data.owner)
      updateOwner({
        variables: {
          descriptorObject: data.owner,
          userId: stateApp.user.mongoId,
          relatedObject: checksFlatData._id,
          relatedObjectType: "Check",
        },
      });
    else {
      updateCheck({
        variables: {
          check: { _id: checksFlatData._id, ...data },
        },
        refetchQueries: ["getCheck"],
        awaitRefetchQueries: true,
      });
    }
  };

  return (
    <>
      <Dialog open={openDeleteConfirmDialog} onClose={handleDeleteCancel} style={{ zIndex: 99999999999 }}>
        <DeleteConfirmationDialogContent
          header="Delete Statement"
          onClose={handleDeleteCancel}
          deleteFunc={handleDeleteAccept}
          m1nSelectedRowsIds={[document._id]}
          setM1nSelectedRowsIndexes={() => { }}
        >
          Do you want to delete the selected statement?
        </DeleteConfirmationDialogContent>
      </Dialog>
      <Dialog open={loader} style={{ zIndex: 99999999999 }}>
        <DialogTitle id="alert-dialog-title">
          <CircularProgress />
        </DialogTitle>
      </Dialog>

      <NavHeader title={`${checksFlatData?.checkNumber} - ${checksFlatData?.payor?.["name"]}`}>
        {isLineItem ? (
          <LineItem checkId={checkId} />
        ) : (
          <>
            <div className={`${classes.detailHeader} flex justifyBetween alignStart w-100`}>
              <div className="flex column alignStart justifyStart w-100">
                <div className={classes.title}>
                  <IconButton className={classes.icon}>
                    <CurrencyIcon />
                  </IconButton>
                  <div className={classes.titleText}>
                    {checksFlatData && (
                      <Typography style={{ fontWeight: "bold", fontSize: "large", marginLeft: 8 }}>{`${checksFlatData?.checkNumber || ""
                        } - ${checksFlatData?.payor?.name || ""}`}</Typography>
                    )}
                    <div className={classes.tagsContainer}>
                      <div className={classes.highlighter}>
                        <Typography className={classes.highlight} variant="highlight">
                          Revenue Check
                        </Typography>
                      </div>
                      <div className={classes.tags}>
                        <Tags width="100%" targetSourceId={checkId} targetLabel="check" publicLeftBottom onlyTags />
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
                      <StyledTab label="Header" />
                      <StyledTab label="Summary" />
                      <StyledTab label="Check Details" />
                    </StyledTabs>
                  </div>
                  <div className={classes.metaActions}>
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

            <div className="flex justifyBetween alignStart w-100">
              <div className={`w-100 ${classes.tabsDetailContainer}`}>
                {/*** Component for viewing selected pdf file*/}

                {/**
                 * Detail tabs section
                 */}
                <div className={classes.tabsSection} style={{ display: stateApp.viewDoc ? "none" : "" }}>
                  <div className={classes.tabsSectionDetails} onScroll={handleScroll}>
                    <div className={classes.headerSection} ref={tab === 0 ? selectedTabRef : null}>
                      <HeaderSection check={checksFlatData} setCheck={setChecksFlatData} />
                    </div>
                    <div style={{ backgroundColor: "#f3f3f3", height: 24 }} />
                    <div className={classes.summarySection} ref={tab === 1 ? selectedTabRef : null}>
                      <SummarySection checkId={checkId} />
                    </div>
                    <div style={{ backgroundColor: "#f3f3f3", height: 24 }} />
                    <div className={classes.checkDetailsSection} ref={tab === 2 ? selectedTabRef : null}>
                      <CheckDetailsSection checkId={checkId} />
                    </div>
                  </div>
                </div>

                <DocViewer divCondition={true} DocStyle={{ height: "calc(100vh - 280px)" }} />
              </div>

              {!collapse && (
                <div
                  style={{
                    marginTop: 20,
                    marginRight: 24,
                    height: "calc(100vh - 270px)",
                    width: "620px",
                    maxWidth: "620px",
                  }}
                >
                  <MetadataDrawer
                    data={checksFlatData}
                    onUpdate={onUpdateMetaData}
                    targetLabel="Check"
                    setCollapse={setCollapse}
                    targetSourceId={checkId}
                    setStateApp={setStateApp}
                    descriptionKey="description"
                    isApproval={true}
                    ownerTitle="Approver"
                    ownerPlaceHolder="Assign Approver"
                  />
                </div>
              )}
            </div>

            {stateApp.showFieldModal && <MetaField columns={[]} category="Check" />}

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
              <MenuItem
                onClick={() => {
                  setOpenDeleteConfirmDialog(true);
                  setCheckIdToDelete(checkId);
                }}
              >
                <ListItemIcon>
                  <DeleteIcon size="medium" />
                </ListItemIcon>
                <ListItemText>Delete</ListItemText>
              </MenuItem>
            </Menu>
          </>
        )}
      </NavHeader>
    </>
  );
}
