import React, { useState } from "react";
import {
  Grid,
  ListItemText,
  makeStyles,
  Divider,
  List,
  ListItem,
  Typography,
  Tooltip,
  InputBase,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

//Query
import ESSearchField from "components/Shared/Forms/Fields/ESSearchField";

const useStyles = makeStyles((theme) => ({
  rootPadding: {
    padding: "6px 15px",
  },
  list: {
    overflowY: "auto",
    maxHeight: "79vh",
    "& .MuiList-padding": {
      padding: "23px 0px !important",
    },
  },
  button: {
    width: "100%",
  },
  actionGrid: {
    margin: "0px 0px 10px 0px",
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    marginLeft: 0,
    marginTop: 5,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "auto",
    },
  },
  iconSearch: {
    height: "100%",
    display: "flex",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    color: "rgba(121, 121, 121, 0.85)",
    zIndex: 1,
    "&:hover": {
      color: "#fff",
      cursor: "pointer",
    },
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    paddingLeft: `calc(1em + ${theme.spacing(2)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",

    [theme.breakpoints.up("sm")]: {
      width: "0ch",
      "&:focus": {
        width: "30ch",
        height: "2ch",
      },
    },
  },
  deleteIcon: {
    "& svg": {
      fill: "#c1c5ca",
    },
    "&:hover": {
      "& svg": {
        fill: "#929aa3",
      },
    },
  },
  Link: {
    textDecoration: "none",
    cursor: "pointer",
    fontSize: "16px",
    margin: 0,
    variant: "subtitle1",
    color: "primary !important",
    "&:hover": {
      fontWeight: "700",
    },
  },
  secondaryText: {
    color: "grey",
    fontSize: "14px",
    margin: 0,
    paddingLeft: 16,
    paddingBottom: 4,
    marginTop: -8,
  },
}));

export default function DocumentAssociation({
  title,
  items,
  navigateTo,
  esFilter,
  esIndex,
  esFields,
  searchExistingItems,
  onSearchBlur,
  setSearchState,
  isSearchActive,
  search,
  setSearch,
  relatedObjectType,
  deleteDescriptorFile,
  getSelectedItem,
  addFileLoading,
  deleteFileLoading,
  updateDocumentLoading,
  sort = {},
}) {
  // Initials
  const classes = useStyles();
  const tenantName = window.sessionStorage.getItem("tenantName")

  // States
  const [addSelection, setAddSelection] = useState(false);
  const [deletedRow, setDeletedRow] = useState("");

  return (
    <div style={{ marginRight: "14px" }}>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
        className={classes.rootPadding}
      >
        {!addSelection && (
          <React.Fragment>
            {!isSearchActive && (
              <Grid item xs={10}>
                <Typography variant="h6" style={{ fontWeight: "bold" }}>
                  {title}
                </Typography>
              </Grid>
            )}
            <Grid item xs={1}>
              <div className={classes.search}>
                <Tooltip
                  title="Search"
                  className={classes.iconSearch}
                  onClick={() => {
                    if (!isSearchActive) {
                      document.getElementById("searchInputDocuments").focus();
                    }
                  }}
                >
                  <SearchIcon />
                </Tooltip>
                <InputBase
                  id="searchInputDocuments"
                  autoComplete="off"
                  placeholder={`Search ${title}`}
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  inputProps={{ "aria-label": "search" }}
                  onFocus={() => setSearchState(true)}
                  value={search}
                  onBlur={onSearchBlur}
                  onChange={(evt) => searchExistingItems(evt.target.value)}
                />
              </div>
            </Grid>
          </React.Fragment>
        )}
        {addSelection && (
          <Grid item xs={11}>
            <ESSearchField
              filters={esFilter}
              index={esIndex}
              pagination={{
                first: 50,
                after: null,
              }}
              fields={esFields}
              onSelect={(selection) => {
                setAddSelection(false);
                getSelectedItem(selection, relatedObjectType);
              }}
              fieldName={title}
              sort={sort}
            />
          </Grid>
        )}
        <Grid item xs={1}>
          <IconButton
            onClick={() => {
              setAddSelection((addSelection) => !addSelection);
              setSearch("");
            }}
          >
            <AddIcon id="addIcon" size="large" />
          </IconButton>
        </Grid>
      </Grid>
      <Divider />
      <div className={classes.list}>
        {(updateDocumentLoading === true || addFileLoading === true) && (
          <Grid container className={classes.actionGrid}>
            <Grid item xs={12}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress size="20px" />
              </div>
            </Grid>
          </Grid>
        )}

        <List id={`${title}List`} aria-label={`${title} list`}>
          {items && items.length ? (
            items.map((shape, index) => (
              <div style={{ padding: "0px 0px 0px", overflow: "hidden" }}>
                <ListItem key={index}>
                  <a
                    style={{ color: "inherit" }}
                    className={classes.Link}
                    href={`${href ? href.replace("{ID}",shape._id.toLowerCase()).replace("{TENANT}", tenantName) : "_blank"}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo(shape);
                    }}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {shape?.name ||
                      shape?.entityDetail?.name ||
                      shape?.checkNumber ||
                      ""}
                  </a>

                  {deleteFileLoading && deletedRow === shape._id ? (
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="delete">
                        <CircularProgress size="20px" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  ) : (
                    <ListItemSecondaryAction
                      onClick={() => {
                        setDeletedRow(shape._id);
                        deleteDescriptorFile(shape._id);
                      }}
                    >
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        className={classes.deleteIcon}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
                <Divider />
              </div>
            ))
          ) : (
            <ListItem>
              <ListItemText
                primary={`No ${title} found.`}
                primaryTypographyProps={{
                  color: "primary",
                }}
              />
            </ListItem>
          )}
        </List>
      </div>
    </div>
  );
}
