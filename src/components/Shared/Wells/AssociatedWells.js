import React, { useEffect, useState, useContext, useMemo } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { get, isEmpty } from "lodash";
import { Grid, ListItemText, makeStyles, Divider, List, ListItem, Typography, Tooltip, InputBase } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import Link from "@material-ui/core/Link";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

//Contexts
import { AppContext } from "AppContext";
import { DocumentContextProvider } from "components/Document/DocumentContext";

//Components
import WellSearchApiFieldES from "components/Shared/Forms/Fields/WellSearchApiFieldES";

// Hooks
import { useMutation, useLazyQuery } from "@apollo/client";

import { GET_WELL_DESCRIPTORS } from "graphQL/useQueryWellDescriptors";
// Mutations
import { DELETE_WELL_DESCRIPTOR, UPSERT_WELL_DESCRIPTOR } from "graphQL/useMutationWellDescriptor";

const useStyles = makeStyles((theme) => ({
  rootPadding: {
    padding: "6px 30px 6px 15px",
  },
  list: {
    overflowX: "hidden",
    overflowY: "auto",
    height: '100%',
    maxHeight: 465,
    flex: '1 1 auto',
    // maxHeight: "79vh",
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
  wellList: {
    height: '100%',
    width: '100%',
    overflowY: 'auto',
    overflowX: 'hidden'
  }
}));

const AssociatedWellsList = ({
  title,
  relatedObject,
  relatedObjectType,
  details
}) => {
  // Initials
  let history = useHistory();
  const location = useLocation();
  const classes = useStyles();

  const moduleName = useMemo(() => {
    if (!isEmpty(details)) {
      return `${details.number}-${details.name}`;
    }
    return "";
  }, [details]);

  // States
  const [search, setSearch] = useState("");
  const [isSearchActive, setSearchState] = useState(false);
  const [addWell, setAddWell] = useState(false);
  const [deletedRow, setDeletedRow] = useState("");
  const [wells, setWells] = useState([]);
  const [stateApp, setStateApp] = useContext(AppContext);

  const [getWellsDescriptors, { data: associatedWells, loading: getWellsLoading }] = useLazyQuery(GET_WELL_DESCRIPTORS);

  // Mutattions
  const [deleteWellDescriptor] = useMutation(DELETE_WELL_DESCRIPTOR);
  const [upsertWellDescriptor, { loading: upsertWellLoading }] = useMutation(UPSERT_WELL_DESCRIPTOR);

  useEffect(() => {
    const wells = get(associatedWells, "getWellsDescriptors.wellDescriptors");
    if (wells) {
      setWells(wells);
    }
  }, [associatedWells]);

  // Fetching wells from descriptor
  useEffect(() => {
    getWellsDescriptors({
      variables: {
        relatedObject,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (location.state?.focusOnWellSearch) {
      setAddWell(true);
    }
  }, [location.state]);

  // delete well from File Descriptor
  const deleteWell = async (well) => {
    deleteWellDescriptor({
      variables: {
        descriptorObject: well._id,
        relatedObject,
      },
      refetchQueries: ["getWellsDescriptors"],
    });
  };

  // fetching well from autocomplete
  const getSelectedWell = async (well) => {
    let wellData = {
      ...well,
      createdBy: stateApp?.user?._id,
    };
    setAddWell(false);
    upsertWellDescriptor({
      variables: {
        well: { ...wellData, isDeleted: false },
        relatedObject,
        relatedObjectType,
      },
      refetchQueries: ["getWellsDescriptors"],
    });
  };

  // sending to wells page
  const goToWell = (well) => {
    const id = well?.id ?? well.globalWell;
    history.push(`/map/wells/${id.toUpperCase()}`, {
      showWellBreadcrumb: true,
      breadcrumbs: [
        { title: "Properties", url: "/revenue/properties" },
        { title: moduleName, url: `/revenue/property/details/${relatedObject}` },
      ],
    });
    setStateApp({ ...stateApp, DocumentDrawer: false, selectedDocument: {} });
  };

  // searching existing well
  const searchExistingWell = (value) => {
    setSearch(value);
    let existingWells = wells;
    if (value !== "") {
      const searchedWells = existingWells.filter((well) => well?.descriptorObject.wellName.toLowerCase().includes(value));
      setWells(searchedWells);
    } else {
      const wells = get(associatedWells, "getWellsDescriptors.wellDescriptors");
      setWells(wells);
    }
  };

  return (
    <>
      <Grid container direction="row" justify="space-between" alignItems="center" className={classes.rootPadding}>
        {!addWell && (
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
                  onChange={(evt) => searchExistingWell(evt.target.value)}
                />
              </div>
            </Grid>
          </React.Fragment>
        )}
        {addWell && (
          <Grid item xs={11}>
            <WellSearchApiFieldES getSelectedWell={getSelectedWell} />
          </Grid>
        )}
        <Grid item xs={1}>
          <IconButton
            onClick={() => {
              setAddWell((addWell) => !addWell);
              setSearch("");
            }}
          >
            <AddIcon size="large" />
          </IconButton>
        </Grid>
      </Grid>
      <Divider />
      <div className={classes.list}>
        {(getWellsLoading || upsertWellLoading) && (
          <Grid container className={classes.actionGrid}>
            <Grid item xs={12}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress size="20px" />
              </div>
            </Grid>
          </Grid>
        )}

        <List aria-label="wells list" className={classes.wellList}>
          {wells && wells.length > 0 ? (
            wells.map((well, index) => (
              <div style={{ padding: "0px 0px 0px" }}>
                <ListItem key={index}>
                  <Link className={classes.wellLink} color="primary" onClick={() => goToWell(well.descriptorObject)}>
                    {well.descriptorObject.wellName}
                  </Link>

                  {deletedRow === well.descriptorObject._id ? (
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="delete">
                        <CircularProgress size="20px" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  ) : (
                    <ListItemSecondaryAction
                      onClick={() => {
                        setDeletedRow(well.descriptorObject._id);
                        deleteWell(well.descriptorObject);
                      }}
                    >
                      <IconButton edge="end" aria-label="delete" className={classes.deleteIcon}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
                <p className={classes.secondaryText}>{well.descriptorObject?.apiNumber}</p>
                <Divider />
              </div>
            ))
          ) : (
            <ListItem>
              <ListItemText
                primary={"No wells found."}
                primaryTypographyProps={{
                  color: "primary",
                }}
              />
            </ListItem>
          )}
        </List>
      </div>
    </>
  );
};

export default function AssociatedWellsProvider(props) {
  return (
    <DocumentContextProvider>
      <AssociatedWellsList {...props} />
    </DocumentContextProvider>
  );
}

AssociatedWellsList.defaultProps = {
  title: "Wells",
  details: {}
};
