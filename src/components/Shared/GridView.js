import React, { useEffect, useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  InputAdornment,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import moment from "moment";
import SearchIcon from "@material-ui/icons/Search";
import { useLazyQuery, useMutation } from "@apollo/client";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { AppContext } from "../../AppContext";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import LockIcon from "@material-ui/icons/Lock";
import { Menu, MenuItem } from "@material-ui/core";

import LeftDialog from "components/Shared/LeftDialog";
import { UPDATE_GRID_VIEW } from "graphQL/useMutationUpdateGridView";
import { ADD_GRID_VIEW } from "graphQL/useMutationAddGridView";
import { GET_GRID_VIEWS } from "graphQL/useQueryGetGridViews";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "0 !important",
  },
  details: {
    display: "block",
    "& div": {
      padding: "5px !important",
    },
  },
  searchField: {
    margin: "0 !important",
    padding: "10px !important",
  },
  summary: {
    backgroundColor: "#F2F2F2",
    height: "40px !important",
    minHeight: "40px !important",
  },
  textField: {
    height: "100%",
    width: "100%",
    paddingTop: "15px",
    "& .MuiFilledInput-input": {
      padding: "12px 12px 10px",
    },
    "& .MuiFormHelperText-contained": {
      justifyContent: "flex-end",
      display: "flex",
    },
  },
  actionIcons: {
    padding: "0px !important",
    "& svg": {
      fill: "rgba(0, 0, 0, 0.87) !important",
      fontSize: "20px",
    },
  },
}));

function GridView({
  selectedGridView,
  setSelectedGridView,
  setShowViewModal,
  showSaveAsNew,
  setShowSaveAsNew,
  selectedFilters,
}) {
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);

  const [allGridViews, setAllGridViews] = useState([]);
  const [editGridView, setEditGridView] = useState(null);
  const [viewName, setViewName] = useState(`${selectedGridView.name}-copy`);
  const [addGridView, { data: newGridView }] = useMutation(ADD_GRID_VIEW);
  const [getGridViews, { data: gridViews }] = useLazyQuery(GET_GRID_VIEWS);
  const [updateGridView, { data: updatedGridView }] = useMutation(UPDATE_GRID_VIEW);

  useEffect(() => {
    getGridViews({
      variables: {
        userId: stateApp.user.mongoId,
      },
    });
  }, [getGridViews]);

  useEffect(() => {
    if (newGridView?.addGridView?.success) {
      setShowSaveAsNew(false);
      setSelectedGridView(newGridView.addGridView.newGridView);
    }
  }, [newGridView]);

  useEffect(() => {
    if (updatedGridView?.updateGridView?.success) {
      setShowSaveAsNew(false);
      setEditGridView(null);
      setSelectedGridView(updatedGridView.updateGridView.updatedGridView);
    }
  },[updatedGridView]);

  useEffect(() => {
    if (gridViews?.getGridViews?.gridViews) {
      setAllGridViews(gridViews.getGridViews.gridViews);
    }
  }, [gridViews]);

  useEffect(() => {
    setTimeout(() => {
      if (document.getElementById("fieldContentInput"))
        document.getElementById("fieldContentInput").focus();
    }, 100);
  }, [showSaveAsNew]);

  return (
    <LeftDialog open width="325px">
      <TextField
        value={""}
        onChange={(e) => {}}
        className={classes.searchField}
        margin="dense"
        variant="outlined"
        placeholder="Search views"
        InputProps={{
          startAdornment: (
            <InputAdornment>
              <IconButton size="small">
                <SearchIcon htmlColor="#fff" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Accordion defaultExpanded style={{ margin: 0 }}>
        <AccordionSummary
          expandIcon={<KeyboardArrowUpIcon></KeyboardArrowUpIcon>}
          aria-controls="panel1a-content"
          id="panel1a-header"
          className={classes.summary}
        >
          Default
        </AccordionSummary>
        <AccordionDetails className={classes.details}>
          <div
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSelectedGridView({ name: "All Contacts" });
              setShowViewModal(false);
            }}
          >
            <div>All Contacts</div>
          </div>
          {allGridViews.map((view) => {
            return view.type === "Default" ? (
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  const data = JSON.parse(JSON.stringify(view));
                  if (data.name === "My Contacts") {
                    data.filters[0].value = stateApp.user.name;
                  }
                  if (
                    data.name === "Recently Modified" ||
                    data.name === "Recently Added"
                  ) {
                    data.filters[0].value.range[data.filters[0].field].gte =
                      moment().subtract(30, "days").toISOString();
                    data.filters[0].value.range[data.filters[0].field].lte =
                      moment().toISOString();
                  }
                  setSelectedGridView(data);
                  setShowViewModal(false);
                }}
              >
                <div>{view.name}</div>
              </div>
            ) : (
              <></>
            );
          })}
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded style={{ margin: 0 }}>
        <AccordionSummary
          expandIcon={<KeyboardArrowUpIcon></KeyboardArrowUpIcon>}
          aria-controls="panel1a-content"
          id="panel1a-header"
          className={classes.summary}
        >
          Custom
        </AccordionSummary>
        <AccordionDetails className={classes.details}>
          {allGridViews.map((view) => {
            return view.type === "Custom" ? (
              view._id === editGridView?._id ? (
                <InputField
                  editGridViewId={editGridView._id}
                  viewName={viewName}
                  setViewName={setViewName}
                  addGridView={addGridView}
                  selectedFilters={selectedFilters}
                  user={stateApp.user.mongoId}
                  updateGridView={updateGridView}
                />
              ) : (
                <CustomView
                  setSelectedGridView={setSelectedGridView}
                  setShowViewModal={setShowViewModal}
                  view={view}
                  setEditGridView={setEditGridView}
                  setViewName={setViewName}
                />
              )
            ) : (
              <></>
            );
          })}
          {showSaveAsNew && (
            <InputField
              viewName={viewName}
              setViewName={setViewName}
              addGridView={addGridView}
              selectedFilters={selectedFilters}
              user={stateApp.user.mongoId}
            />
          )}
        </AccordionDetails>
      </Accordion>
    </LeftDialog>
  );
}

export default GridView;

const InputField = ({
  editGridViewId,
  viewName,
  setViewName,
  addGridView,
  selectedFilters,
  updateGridView,
  user,
}) => {
  const classes = useStyles();
  return (
    <TextField
      key={"fieldContentInput"}
      id={"fieldContentInput"}
      className={classes.textField}
      variant="outlined"
      size="small"
      autoComplete="nope"
      fullWidth
      label={null}
      multiline
      value={viewName}
      helperText={"Return to save"}
      onChange={(e) => {
        e.persist();
        setViewName(e.target.value);
      }}
      onKeyDown={(event) => {
        event.stopPropagation();
        if (event.key === "Enter") {
          event.preventDefault();
          if(editGridViewId){
            updateGridView({
              variables: {
                gridView: {
                  _id: editGridViewId,
                  name: viewName
                },
              },
              refetchQueries: ["getGridViews"],
            });
          }else{
            addGridView({
              variables: {
                gridView: {
                  name: viewName,
                  module: "Contacts",
                  type: "Custom",
                  user,
                  filters: selectedFilters,
                },
              },
              refetchQueries: ["getGridViews"],
            });
          }
        }
      }}
    />
  );
};
const CustomView = ({
  setSelectedGridView,
  setShowViewModal,
  view,
  setEditGridView,
  setViewName,
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [showActions, setShowActions] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div
      style={{ display: "flex", justifyContent: "space-between" }}
      onMouseOver={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div
        style={{ cursor: "pointer" }}
        onClick={() => {
          setSelectedGridView(view);
          setShowViewModal(false);
        }}
      >
        {view.name}
      </div>
      {showActions && (
        <span className={classes.actionIcons}>
          {view.isPrivate ? <LockIcon /> : <LockOpenIcon />}
          <MoreVertIcon onClick={handleClick} />
        </span>
      )}
      <Menu
        style={{ zIndex: "1305" }}
        id="menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MenuItem
          style={{ width: "250px" }}
          onClick={() => {
            handleClose();
            setEditGridView(view);
            setViewName(view.name);
          }}
        >
          Rename view
        </MenuItem>
        <MenuItem
          style={{ width: "250px" }}
          onClick={() => {
            handleClose();
          }}
        >
          Set as favorite
        </MenuItem>
        <MenuItem
          style={{ width: "250px" }}
          onClick={() => {
            handleClose();
          }}
        >
          Share with others
        </MenuItem>

        <MenuItem
          style={{ width: "250px" }}
          onClick={() => {
            handleClose();
          }}
        >
          Delete view
        </MenuItem>
      </Menu>
    </div>
  );
};
