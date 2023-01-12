import React, { useState, useEffect, useMemo } from "react";
import { useParams, useHistory } from "react-router-dom";
import clsx from "clsx";
import get from "lodash/get";
import { makeStyles } from "@material-ui/core/styles";
import { Menu, MenuItem, ListItemIcon, ListItemText, Typography, Dialog, DialogTitle, CircularProgress } from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import RightActionsPanel from "./RightActionsPanel";
import CloseIcon from "components/Shared/svgIcons/KeyboardTabBlackIcon";

import { IconButton } from "@material-ui/core";
// import DeleteIcon from "@material-ui/icons/Delete";
import { useApolloClient } from "@apollo/client";
import DeleteIcon from "@material-ui/icons/Delete";
import { useMutation } from "@apollo/client";
import { GET_MY_WELL_BY_GLOBAL_ID } from "graphQL/useQueryMyWellByGlobalId";
import { WELL_SUMMARY_WITH_HEADER } from "graphQL/useQueryWellWithHeader";
import { DELETE_MY_WELL } from "graphQL/useMutationDeleteMyWell";

// Components
import AddMyWell from "./AddMyWell";
import RevenueProperties from "./RevenueProperties";
import Agreements from "./Agreements";
import DeleteConfirmationDialogContent from "components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";

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
  const [myWellData, setMyWellData] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);

  const { id: globalWellId } = useParams();
  const history = useHistory();
  const client = useApolloClient();

  const [deleteMyWell, { loading }] = useMutation(DELETE_MY_WELL);

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
  };


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


  const handleWellDetail = async (well) => {
    if (well) {
      const wellHeader = client.query({
        query: WELL_SUMMARY_WITH_HEADER,
        variables: {
          globalWellId: well.Id,
        },
      });

      const myWell = client.query({
        query: GET_MY_WELL_BY_GLOBAL_ID,
        variables: {
          wellId: well.Id,
        },
      });

      const promises = await Promise.all([wellHeader, myWell])
      const { data: dataWell } = promises[0]
      let platformWellData = {}
      if (dataWell?.wellSummaryWithHeaderDetails)
        platformWellData = { ...dataWell.wellSummaryWithHeaderDetails }
      const { data: wellDataResp } = promises[1]
      platformWellData = { ...platformWellData, ...get(wellDataResp, "myWellByGlobalId.myWell.wellData", {}), ...well }

      platformWellData.permitApprovedDate = platformWellData.PermitDate
      platformWellData.spudDate = platformWellData.SpudDate
      platformWellData.firstProductionDate = platformWellData.FirstProdDate
      platformWellData.completionDate = platformWellData.CompletionDate

      setPlatformWell(platformWellData);
      return platformWellData
    }
  };

  const handleCloseDialog = () => {
    props.setDialog(false);
    history.push("/land/wells");
  };

  const handleDeleteAccept = () => {
    // Delete Document Logic goes here
    deleteMyWell({
      variables: {
        myWellId: get(myWellData, "myWellByGlobalId.myWell._id")
      },
      refetchQueries: ["getESSimpleSearch"],
      awaitRefetchQueries: true,
    });
    handleCloseDialog();
  };

  return (
    <div>
      <Drawer className={classes.drawer} anchor={"right"} open>
        <Dialog open={openDeleteConfirmDialog} onClose={() => setOpenDeleteConfirmDialog(false)} style={{ zIndex: 99999999999 }}>
          <DeleteConfirmationDialogContent
            header="Delete Document"
            onClose={() => setOpenDeleteConfirmDialog(false)}
            deleteFunc={handleDeleteAccept}
            m1nSelectedRowsIds={[document._id]}
            setM1nSelectedRowsIndexes={() => { }}
          >
            Do you want to delete the selected my well?
          </DeleteConfirmationDialogContent>
        </Dialog>
        <Dialog open={loading} style={{ zIndex: 99999999999 }}>
          <DialogTitle id="alert-dialog-title">
            <CircularProgress />
          </DialogTitle>
        </Dialog>
        <Menu
          id="dealMenu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          className={classes.menu}
          getContentAnchorEl={null}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <MenuItem onClick={() => setOpenDeleteConfirmDialog(true)}>
            <ListItemIcon>
              <DeleteIcon size="medium" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </Menu>

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
                  <IconButton
                    size="small"
                    component="span"
                    style={{
                      background: "transparent",
                      paddingLeft: "10px",
                      align: "center",
                    }}
                    onClick={(event) => setAnchorEl(event.currentTarget)}
                  >
                    <MoreHorizIcon size="medium" />
                  </IconButton>
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
                    platformWell={{ ...platformWell }}
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
