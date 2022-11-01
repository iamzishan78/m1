import React, { useState, useEffect, useMemo } from "react";
import { useParams, useHistory } from "react-router-dom";
import clsx from "clsx";
import get from "lodash/get";
import { makeStyles } from "@material-ui/core/styles";
import { /*Menu, MenuItem, ListItemIcon, ListItemText,*/ Typography } from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";
import RightActionsPanel from "./RightActionsPanel";
import CloseIcon from "components/Shared/svgIcons/KeyboardTabBlackIcon";

import { IconButton } from "@material-ui/core";
// import DeleteIcon from "@material-ui/icons/Delete";
import { useLazyQuery } from "@apollo/client";
import { GET_MY_WELL_BY_GLOBAL_ID } from "graphQL/useQueryMyWellByGlobalId";
import { WELL_SUMMARY_WITH_HEADER } from "graphQL/useQueryWellWithHeader";

// Components
import AddMyWell from "./AddMyWell";
import RevenueProperties from "./RevenueProperties";
import Agreements from "./Agreements";

const useStyles = makeStyles({
  drawer: {
    "& .MuiDrawer-paper": {
      overflowY: "inherit",
    },
  },
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
  maxWidth: {
    width: "100%",
  },
  titleSection: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    padding: "10px 16px",
    "& svg": {
      fill: "#757575 !important",
    },
  },
  fileUploadSection: {
    minHeight: "50px",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
    width: "100%",
  },
  fileUploadTopSection: {
    minHeight: "50px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: "23px",
  },
  uploadTitle: {
    margin: "0",
    color: "#757575",
    fontWeight: "normal",
    marginBottom: "8px",
  },
  uploadSubtext: {
    color: "rgb(176, 176, 176)",
    margin: "0",
    fontWeight: "normal",
  },
  IconSection: {
    minHeight: "35px",
    display: "flex",
    justifyContent: "center",
    width: "fit-content",
  },
  fileDrop: {
    minHeight: "125px",
    width: "100%",
    padding: "10px 40px",
    color: "#757575",
    fontWeight: "normal",
    backgroundColor: "#eee",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px dashed rgb(176, 176, 176)",
    marginBottom: "30px",
  },
  imageSubText: {
    letterSpacing: "0.5px",
    textAlign: "center",
  },
  fileDropError: {
    color: "red",
  },
  forImage: {
    width: "100px !important",
    height: "100px !important",
    backgroundColor: "transparent !important",
    borderRadius: "10px !important",
  },
  forImageContainer: {
    width: "100px !important",
    height: "100px !important",
    borderRadius: "10px !important",
    backgroundColor: "#eeeeee !important",
    textAlign: "center",
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#555",
    textTransform: "uppercase",
    paddingTop: "30px",
    cursor: "pointer",
    marginBottom: "5px",
  },
  dialogFooter: {
    display: "flex",
    justifyContent: "flex-end",
    paddingTop: "10px",
    paddingRight: "19px",
    paddingBottom: "40px",
  },
  footerButton: {
    letterSpacing: "1px",
    textTransform: "capitalize",
    fontWeight: "bold",
    padding: "8px 20px",
  },
  menu: {
    "& .MuiListItem-root": {
      "& .MuiListItemIcon-root": {
        minWidth: "30px",
        "& .MuiSvgIcon-root": {
          fill: "red !important",
        },
      },
    },
  },
  contentRoot: {
    maxHeight: "calc(100vh - 310px)",
  },
});

const anchor = "right";

export default function MyWellDialog(props) {
  const classes = useStyles();
  const [activePanel, setPanel] = useState("Add New Well");
  const [platformWell, setPlatformWell] = useState();

  const { id: globalWellId } = useParams();
  const history = useHistory();

  const [getMyWellByGlobalId, { data: myWellData }] = useLazyQuery(GET_MY_WELL_BY_GLOBAL_ID);
  const [getWellSummaryWithHeader, { data: dataWell }] = useLazyQuery(WELL_SUMMARY_WITH_HEADER, {
    // must be network-only to trigger state change for field updates
    fetchPolicy: "network-only",
  });
  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
  };

  useEffect(() => {
    if (!dataWell?.tenantWell) return;

    const { tenantWell } = dataWell;
    setPlatformWell(tenantWell);
  }, [dataWell]);

  useEffect(() => {
    if (globalWellId) {
      handleWellDetail({ Id: globalWellId });
      props.setDialog(true);
    }
  }, [globalWellId]);

  const dialogTitle = useMemo(() => {
    if (activePanel === "Add New Well") {
      if (globalWellId) return "Update Well Details";
      return activePanel;
    } else return "Well Details";
  }, [activePanel, globalWellId]);

  const getMyWell = (wellGlobalId) => {
    getMyWellByGlobalId({
      variables: {
        wellId: wellGlobalId,
      },
    });
  };

  const handleWellDetail = (well) => {
    if (well) {
      getWellSummaryWithHeader({
        variables: {
          globalWellId: well.Id,
        },
      });
      getMyWell(well.Id);
    }
  };

  const handleCloseDialog = () => {
    props.setDialog(false);
    history.push("/land/wells");
  };

  return (
    <div>
      <Drawer className={classes.drawer} anchor={"right"} open>
        {/* <Dialog open={openDeleteConfirmDialog} onClose={handleDeleteCancel} style={{ zIndex: 99999999999 }}>
          <DeleteConfirmationDialogContent
            header="Delete Document"
            onClose={handleDeleteCancel}
            deleteFunc={handleDeleteAccept}
            m1nSelectedRowsIds={[document._id]}
            setM1nSelectedRowsIndexes={() => {}}
          >
            Do you want to delete the selected documents?
          </DeleteConfirmationDialogContent>
        </Dialog>
        <Dialog open={loader} style={{ zIndex: 99999999999 }}>
          <DialogTitle id="alert-dialog-title">
            <CircularProgress />
          </DialogTitle>
        </Dialog> */}

        <div
          style={{ width: "500px" }}
          className={clsx(classes.list, {
            [classes.fullList]: anchor === "top" || anchor === "bottom",
          })}
          role="presentation"
          onClick={toggleDrawer(anchor, false)}
          onKeyDown={toggleDrawer(anchor, false)}
        >
          <div
            style={{
              width: "100%",
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              flexWrap: "nowrap",
            }}
          >
            <div style={{ flexShrink: 0 }}>
              <div className={classes.titleSection}>
                <div style={{ margin: "20px 0px" }}>
                  <Typography variant="h5" style={{ fontWeight: "bold" }}>
                    {dialogTitle}
                  </Typography>
                </div>
                <div style={{ cursor: "pointer" }}>
                  <IconButton size="small" onClick={handleCloseDialog}>
                    <CloseIcon />
                  </IconButton>
                </div>
              </div>
            </div>
            <div className={classes.contentRoot}>
              <RightActionsPanel
                activePanel={activePanel}
                setPanel={setPanel}
                propertiesCount={get(myWellData, "myWellByGlobalId.myWell.properties", []).length}
                agreementsCount={get(myWellData, "myWellByGlobalId.myWell.shapes", []).length}
              />
              <div style={{ paddingRight: "60px", height: "93vh", overflow: "auto" }}>
                {activePanel === "Add New Well" && (
                  // Add My Well fields component here
                  <AddMyWell
                    handleWellDetail={handleWellDetail}
                    platformWell={{ ...platformWell, ...get(myWellData, "myWellByGlobalId.myWell.wellData", {}) }}
                    showSearch={!globalWellId}
                  />
                )}
                {activePanel === "Revenue Properties" && (
                  // show revenue properties here
                  <RevenueProperties platformWell={platformWell} properties={get(myWellData, "myWellByGlobalId.myWell.properties", [])} />
                )}
                {activePanel === "Agreements" && (
                  // show agreements list here
                  <Agreements platformWell={platformWell} agreements={get(myWellData, "myWellByGlobalId.myWell.shapes", [])} />
                )}
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
