import React, { useState, useEffect } from "react";
import clsx from "clsx";
import get from "lodash/get";
import { makeStyles } from "@material-ui/core/styles";
import { Menu, MenuItem, ListItemIcon, ListItemText } from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";
import RightActionsPanel from "./RightActionsPanel";
import CloseIcon from "components/Shared/svgIcons/KeyboardTabBlackIcon";

import { IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { useLazyQuery } from "@apollo/client";
import { GET_MY_WELL_BY_GLOBAL_ID } from "graphQL/useQueryMyWellByGlobalId";
import { TENANTWELL } from "graphQL/useQueryTenantWell";

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

export default function MyWellDialog(props) {
  const classes = useStyles();
  const [activePanel, setPanel] = useState("Add New Well");
  // const [state, setState] = useState({right: false});
  const [anchorEl, setAnchorEl] = useState();

  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
  const [platformWell, setPlatformWell] = useState();

  const [getMyWellByGlobalId, { data: myWellData }] = useLazyQuery(GET_MY_WELL_BY_GLOBAL_ID);

  const [getTenantWell, { data: dataTenantWell }] = useLazyQuery(TENANTWELL, {
    // must be network-only to trigger state change for field updates
    fetchPolicy: "network-only",
  });
  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
  };

  useEffect(() => {
    if (!dataTenantWell?.tenantWell) return;

    const { tenantWell } = dataTenantWell;
    setPlatformWell(tenantWell);
  }, dataTenantWell);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const DocumentDetail = (anchor) => {
    const getMyWell = (wellGlobalId) => {
      getMyWellByGlobalId({
        variables: {
          wellId: wellGlobalId,
        },
      });
    };

    const handleWellDetail = (well) => {
      if (well) {
        getTenantWell({
          variables: {
            globalWellId: well.Id,
          },
        });
        getMyWell(well.Id);
      }
    };

    return (
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
              <div>
                <h2>{activePanel}</h2>
              </div>
              <div style={{ cursor: "pointer" }}>
                {/* <IconButton
                  size="small"
                  component="span"
                  style={{
                    background: "transparent",
                    paddingLeft: "10px",
                    align: "center",
                  }}
                  onClick={handleMenuClick}
                >
                  <MoreHorizIcon id="fileDetailHorzIcon" size="medium" />
                </IconButton> */}
                <IconButton size="small" onClick={() => props.setDialog(false)}>
                  <CloseIcon />
                </IconButton>
                <Menu
                  id="dealMenu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  className={classes.menu}
                  getContentAnchorEl={null}
                  anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                  transformOrigin={{ vertical: "top", horizontal: "center" }}
                >
                  <MenuItem
                    onClick={() => {
                      setOpenDeleteConfirmDialog(true);
                      handleMenuClose();
                    }}
                  >
                    <ListItemIcon>
                      <DeleteIcon size="medium" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                  </MenuItem>
                </Menu>
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
                <AddMyWell handleWellDetail={handleWellDetail} platformWell={platformWell} />
              )}
              {activePanel === "Revenue Properties" && (
                // show revenue properties here
                <RevenueProperties
                  myWellId={get(myWellData, "myWellByGlobalId.myWell._id", [])}
                  properties={get(myWellData, "myWellByGlobalId.myWell.properties", [])}
                />
              )}
              {activePanel === "Agreements" && (
                // show agreements list here
                <Agreements agreements={get(myWellData, "myWellByGlobalId.myWell.shapes", [])} />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Drawer className={classes.drawer} anchor={"right"} open={props.open}>
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

        <>{DocumentDetail("right")}</>
      </Drawer>
    </div>
  );
}
