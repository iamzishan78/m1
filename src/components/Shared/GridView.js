import React, { useEffect, useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, InputAdornment, IconButton, Accordion, AccordionSummary, AccordionDetails } from "@material-ui/core";
import moment from "moment";
import SearchIcon from "@material-ui/icons/Search";
import { useLazyQuery, useMutation } from "@apollo/client";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { AppContext } from "../../AppContext";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import LockIcon from "@material-ui/icons/Lock";
import StarIcon from "@material-ui/icons/Star";
import { Menu, MenuItem } from "@material-ui/core";
import { CircularProgress } from "@material-ui/core";

import LeftDialog from "components/Shared/LeftDialog";
import { UPDATE_GRID_VIEW } from "graphQL/useMutationUpdateGridView";
import { UPDATE_FAVOURITE_GRID_VIEW } from "graphQL/useMutationUpdateGridView";
import { ADD_GRID_VIEW } from "graphQL/useMutationAddGridView";
import { GET_GRID_VIEWS } from "graphQL/useQueryGetGridViews";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "0 !important",
    display: "flex",
    flexFlow: "column",
    // height: "85vh",
    "& .MuiPaper-elevation1": {
      boxShadow: "none !important",
    },
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
    width: "100% !important",
  },
  summary: {
    backgroundColor: "#F2F2F2",
    height: "50px !important",
    minHeight: "40px !important",
  },
  textField: {
    height: "100%",
    width: "100%",
    paddingTop: "15px",
    "& .MuiOutlinedInput-input": {
      padding: "5px",
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
  selectedType: {
    borderBottom: "4px solid #01B0F0",
    display: "inline",
    cursor: "pointer",
  },
  unSelectedType: {
    display: "inline",
    color: "#827F7F",
    cursor: "pointer",
  },
}));

const viewOptions = [
  {
    label: "Views",
    value: "views",
  },
  {
    label: "Favorites",
    value: "favorites",
  },
  {
    label: "System",
    value: "system",
  },
];

function GridView({
  selectedGridView,
  setSelectedGridView,
  setShowViewModal,
  showSaveAsNew,
  setShowSaveAsNew,
  selectedFilters,
  handleDefaultView,
  handleClose,
  columns,
  module,
}) {
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);

  const [selectedTab, setSelectedTab] = useState("views");
  const [allGridViews, setAllGridViews] = useState([]);
  const [filterGridView, setFilterGridView] = useState([]);
  const [search, setSearch] = useState("");
  const [editGridView, setEditGridView] = useState(null);
  const [viewName, setViewName] = useState(`${selectedGridView.name}-copy`);
  const [addGridView, { data: newGridView }] = useMutation(ADD_GRID_VIEW);
  const [getGridViews, { data: gridViews, loading }] = useLazyQuery(GET_GRID_VIEWS);
  const [updateGridView, { data: updatedGridView }] = useMutation(UPDATE_GRID_VIEW);
  const [updateFavouriteGridView, {}] = useMutation(UPDATE_FAVOURITE_GRID_VIEW);

  useEffect(() => {
    if (selectedTab === "views") {
      setFilterGridView(JSON.parse(JSON.stringify(allGridViews)));
    } else if (selectedTab === "favorites") {
      const data = allGridViews.filter((view) => view.favouriteBy?.includes(stateApp.user.mongoId));
      setFilterGridView(data);
    } else {
      setFilterGridView([]);
    }
  }, [selectedTab]);

  useEffect(() => {
    getGridViews({
      variables: {
        module: module,
        userId: stateApp.user.mongoId,
      },
    });
  }, [getGridViews]);

  useEffect(() => {
    if (newGridView?.addGridView?.success) {
      setShowSaveAsNew(false);
      setSelectedGridView(newGridView.addGridView.newGridView);
      setStateApp((state, props) => {
        return {
          ...state,
          selectedView: newGridView.addGridView.newGridView,
        };
      });
    }
  }, [newGridView]);

  useEffect(() => {
    if (updatedGridView?.updateGridView?.success) {
      setShowSaveAsNew(false);
      setEditGridView(null);
      setSelectedGridView(updatedGridView.updateGridView.updatedGridView);
      setStateApp((state, props) => {
        return {
          ...state,
          selectedView: updatedGridView.updateGridView.updatedGridView,
        };
      });
    }
  }, [updatedGridView]);

  useEffect(() => {
    if (gridViews?.getGridViews?.gridViews) {
      const data = JSON.parse(JSON.stringify(gridViews.getGridViews.gridViews));
      setAllGridViews(data);
      setFilterGridView(data);
    }
  }, [gridViews]);

  useEffect(() => {
    setTimeout(() => {
      if (document.getElementById("fieldContentInput")) document.getElementById("fieldContentInput").focus();
    }, 100);
  }, [showSaveAsNew]);

  useEffect(() => {
    if (allGridViews) {
      if (search) {
        setFilterGridView(allGridViews.filter((view) => view.name.toLowerCase().includes(search.toLowerCase())));
      } else {
        setFilterGridView(allGridViews);
      }
    }
  }, [search]);

  const handleClick = (view) => {
    let data = JSON.parse(JSON.stringify(view));
    if (data.type === "Default") {
      data = handleDefaultView(data, stateApp.user);
    }
    setSelectedGridView(data);
    setStateApp((state, props) => {
      return {
        ...state,
        selectedView: data,
      };
    });
    setShowViewModal(false);
  };
  return (
    <LeftDialog open width="325px" handleClickDialogClose={handleClose}>
      {!loading ? (
        <div className={classes.container}>
          <div style={{ flex: "0 1 auto" }}>
            <TextField
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
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
            <div style={{ marginTop: 10 }}>
              {viewOptions.map((option) => {
                return (
                  <h4
                    style={{ marginLeft: 13 }}
                    onClick={() => setSelectedTab(option.value)}
                    className={selectedTab === option.value ? classes.selectedType : classes.unSelectedType}
                  >
                    {option.label}
                  </h4>
                );
              })}
            </div>
            <Accordion defaultExpanded style={{ marginTop: 20 }}>
              <AccordionSummary
                expandIcon={<KeyboardArrowUpIcon></KeyboardArrowUpIcon>}
                aria-controls="panel1a-content"
                id="panel1a-header"
                className={classes.summary}
              >
                Default
              </AccordionSummary>
              <AccordionDetails className={classes.details}>
                {filterGridView.map((view) => {
                  return view.type === "Default" ? (
                    <>
                      <View
                        view={view}
                        setEditGridView={setEditGridView}
                        setViewName={setViewName}
                        updateGridView={updateGridView}
                        userId={stateApp.user.mongoId}
                        updateFavouriteGridView={updateFavouriteGridView}
                        onClick={handleClick}
                      />
                    </>
                  ) : (
                    <></>
                  );
                })}
              </AccordionDetails>
            </Accordion>
          </div>
          <div style={{ flex: "1 1 auto", overflow: "auto" }}>
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
                {filterGridView.map((view) => {
                  return view.type === "Custom" ? (
                    view._id === editGridView?._id ? (
                      <InputField
                        editGridViewId={editGridView._id}
                        setEditGridView={setEditGridView}
                        viewName={viewName}
                        setViewName={setViewName}
                        addGridView={addGridView}
                        selectedFilters={selectedFilters}
                        user={stateApp.user.mongoId}
                        setShowSaveAsNew={setShowSaveAsNew}
                        updateGridView={updateGridView}
                        module={module}
                        columns={columns}
                      />
                    ) : (
                      <View
                        view={view}
                        setEditGridView={setEditGridView}
                        setViewName={setViewName}
                        updateGridView={updateGridView}
                        userId={stateApp.user.mongoId}
                        onClick={handleClick}
                        updateFavouriteGridView={updateFavouriteGridView}
                      />
                    )
                  ) : (
                    <></>
                  );
                })}
                {showSaveAsNew && (
                  <InputField
                    setEditGridView={setEditGridView}
                    viewName={viewName}
                    setViewName={setViewName}
                    addGridView={addGridView}
                    selectedFilters={selectedFilters}
                    setShowSaveAsNew={setShowSaveAsNew}
                    user={stateApp.user.mongoId}
                    module={module}
                    columns={columns}
                  />
                )}
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
      ) : (
        <CircularProgress></CircularProgress>
      )}
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
  setShowSaveAsNew,
  setEditGridView,
  user,
  columns,
  module,
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
          if (editGridViewId) {
            updateGridView({
              variables: {
                gridView: {
                  _id: editGridViewId,
                  name: viewName,
                },
              },
              refetchQueries: ["getGridViews"],
            });
          } else {
            addGridView({
              variables: {
                gridView: {
                  name: viewName,
                  module: module,
                  type: "Custom",
                  user,
                  filters: selectedFilters,
                  columns: columns.map((col) => ({ name: col.name, display: col.options.display })),
                },
              },
              refetchQueries: ["getGridViews"],
            });
          }
        }
        if (event.key === "Escape") {
          setShowSaveAsNew(false);
          setEditGridView(null);
          setViewName("");
        }
      }}
      onBlur={() => {
        setShowSaveAsNew(false);
        setViewName("");
        setEditGridView(null);
      }}
    />
  );
};

const View = ({ onClick, view, setEditGridView, setViewName, updateFavouriteGridView, updateGridView, userId }) => {
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
      <span style={{ display: "flex" }} className={classes.actionIcons}>
        <div style={{ cursor: "pointer" }} onClick={() => onClick(view)}>
          {view.name}
        </div>
        {view.favouriteBy?.includes(userId) && (
          <StarIcon
            onClick={() => {
              updateFavouriteGridView({
                variables: {
                  id: view._id,
                  userId,
                },
                refetchQueries: ["getGridViews"],
              });
            }}
            style={{ marginTop: "5px" }}
          />
        )}
      </span>
      {showActions && (
        <span className={classes.actionIcons}>
          {view.type === "Custom" ? view.isPrivate ? <LockIcon /> : <LockOpenIcon /> : <></>}
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
        {view.type !== "Default" && (
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
        )}
        <MenuItem
          style={{ width: "250px" }}
          onClick={() => {
            handleClose();
            updateFavouriteGridView({
              variables: {
                id: view._id,
                userId,
              },
              refetchQueries: ["getGridViews"],
            });
          }}
        >
          {view.favouriteBy?.includes(userId) ? "Remove as favorite" : "Set as favorite"}
        </MenuItem>
        {view.type !== "Default" && (
          <MenuItem
            style={{ width: "250px" }}
            onClick={() => {
              handleClose();
              updateGridView({
                variables: {
                  gridView: {
                    _id: view._id,
                    isPrivate: false,
                  },
                },
                refetchQueries: ["getGridViews"],
              });
            }}
          >
            Share with others
          </MenuItem>
        )}
        {view.type !== "Default" && (
          <MenuItem
            style={{ width: "250px" }}
            onClick={() => {
              handleClose();
              updateGridView({
                variables: {
                  gridView: {
                    _id: view._id,
                    isDeleted: true,
                  },
                },
                refetchQueries: ["getGridViews"],
              });
            }}
          >
            Delete view
          </MenuItem>
        )}
      </Menu>
    </div>
  );
};
