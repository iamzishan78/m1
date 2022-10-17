import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import get from "lodash/get";
import { Grid, ListItemText, makeStyles, Divider, List, ListItem, Typography, Tooltip, InputBase } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import Link from "@material-ui/core/Link";
import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import { agreementTypes } from "components/ShapeDetailCard/Common/SummaryTable/agreementDefaultData";

//Contexts
import { AppContext } from "AppContext";

//Components
import WellSearchApiFieldES from "components/Shared/Forms/Fields/WellSearchApiFieldES";
import SearchField from "./SearchField";

// Hooks
import { useMutation } from "@apollo/client";

// Mutations
import { ADD_WELL_TO_FILE_DESCRIPTOR } from "graphQL/useMutationAddWellToFileDescriptor";

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
  wellLink: {
    cursor: "pointer",
    fontSize: "16px",
    margin: 0,
    variant: "subtitle1",
    color: "primary",
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

const Agreements = ({ agreements }) => {
  // Initials
  let history = useHistory();
  const classes = useStyles();

  // States
  const [search, setSearch] = useState("");
  const [isSearchActive, setSearchState] = useState(false);
  const [addWell, setAddWell] = useState(false);
  const [stateApp, setStateApp] = useContext(AppContext);

  const [addWellToFileDescriptor, { loading: addWellLoading }] = useMutation(ADD_WELL_TO_FILE_DESCRIPTOR);

  // sending to wells page
  const goToWell = (well) => {
    history.push(`/map/wells/${well?.id.toUpperCase()}`, {
      showWellBreadcrumb: true,
      breadcrumbs: [{ title: "Documents", url: "/documents" }],
    });
    setStateApp({ ...stateApp, DocumentDrawer: false, selectedDocument: {} });
  };

  return (
    <div style={{ marginRight: "14px" }}>
      <Grid container direction="row" justify="space-between" alignItems="center" className={classes.rootPadding}>
        {!addWell && (
          <React.Fragment>
            {!isSearchActive && (
              <Grid item xs={10}>
                <Typography variant="h6" style={{ fontWeight: "bold" }}>
                  Related Agreements
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
                      document.getElementById("searchInputRelatedProperties").focus();
                    }
                  }}
                >
                  <SearchIcon />
                </Tooltip>
                <InputBase
                  id="searchInputRelatedProperties"
                  autoComplete="off"
                  placeholder="Search Wells"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  inputProps={{ "aria-label": "search" }}
                  onFocus={() => setSearchState(true)}
                  value={search}
                  onBlur={() =>
                    setTimeout(() => {
                      setSearchState(false);
                    }, 300)
                  }
                  onChange={(evt) => {}}
                />
              </div>
            </Grid>
          </React.Fragment>
        )}
        {addWell && (
          <Grid item xs={11}>
            {/* <WellSearchApiFieldES getSelectedWell={getSelectedWell} /> */}
            <SearchField
              esIndex="shapes_flat"
              fields={["name^4", "_all"]}
              optionsParams={["name", "internalID"]}
              targetLabel="properties"
            />
          </Grid>
        )}
        <Grid item xs={1}>
          <IconButton
            onClick={() => {
              setAddWell((addWell) => !addWell);
              setSearch("");
            }}
          >
            <AddIcon id="addIcon" size="large" />
          </IconButton>
        </Grid>
      </Grid>
      <Divider />
      <div className={classes.list}>
        <List id="wellsList" aria-label="wells list">
          {agreements.length > 0 ? (
            agreements.map((agreement, index) => (
              <div style={{ padding: "0px 0px 0px" }}>
                <ListItem key={index}>
                  <Link
                    className={classes.wellLink}
                    color="primary"
                    onClick={() => {
                      history.push(`/land/agreement/details/${agreement._id}`);
                    }}
                  >
                    {get(agreement, "shapeJson.properties.name")}
                  </Link>
                </ListItem>
                <p className={classes.secondaryText}>
                  {agreementTypes.find((at) => at.value === get(agreement, "shapeJson.properties.agreementType"))?.label || ""}
                </p>
                <Divider />
              </div>
            ))
          ) : (
            <ListItem>
              <ListItemText
                primary={"No ageement found."}
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
};

export default Agreements;
