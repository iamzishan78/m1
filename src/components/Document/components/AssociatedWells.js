import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
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
import { DocumentContextProvider, DocumentContext } from "components/Document/DocumentContext";

//Components
import WellSearchApiFieldES from "components/Shared/Forms/Fields/WellSearchApiFieldES";

// Hooks
import { useMutation } from "@apollo/client";

// Mutations
import { DELETEWELLFROMFILEDESCRIPTOR } from "graphQL/useMutationDeleteWellFromFileDescriptor";
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

const AssociatedWellsList = ({ title }) => {
  // Initials
  let history = useHistory();
  const classes = useStyles();

  // States
  const [search, setSearch] = useState("");
  const [isSearchActive, setSearchState] = useState(false);
  const [addWell, setAddWell] = useState(false);
  const [deletedRow, setDeletedRow] = useState("");
  const [stateApp, setStateApp] = useContext(AppContext);

  const { getWellsFromDocument, wells, wellsFromDocument, getWellsLoading, setWells } = React.useContext(DocumentContext);

  // Mutattions
  const [deleteWellFromDescriptor, { loading: deleteWellLoading }] = useMutation(DELETEWELLFROMFILEDESCRIPTOR, {
    onCompleted: () =>
      getWellsFromDocument({
        variables: {
          descriptorObject: stateApp.selectedDocument._id,
        },
      }),
  });

  const [addWellToFileDescriptor, { loading: addWellLoading }] = useMutation(ADD_WELL_TO_FILE_DESCRIPTOR);

  // Fetching wells from descriptor
  useEffect(() => {
    getWellsFromDocument({
      variables: {
        descriptorObject: stateApp.selectedDocument._id,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // delete well from File Descriptor
  const deleteWell = async (wellId) => {
    await deleteWellFromDescriptor({
      variables: { descriptorId: stateApp?.selectedDocument?._id, wellGlobalId: wellId },
    });
  };

  // fetching well from autocomplete
  const getSelectedWell = async (well) => {
    let wellData = {
      ...well,
      createdBy: stateApp?.user?._id,
    };
    setAddWell(false);
    addWellToFileDescriptor({
      variables: { descriptorId: stateApp?.selectedDocument?._id, wellData: wellData },
    }).then(({ data }) => {
      const descriptorId = data.addWellToFileDescriptor._id;
      const selectedDocument = stateApp.selectedDocument ?? {};
      setStateApp((stateApp) => ({
        ...stateApp,
        selectedDocument: { ...selectedDocument, _id: descriptorId },
      }));
      getWellsFromDocument({
        variables: {
          descriptorObject: descriptorId,
        },
      });
    });
  };

  // sending to wells page
  const goToWell = (e, well) => {
    e.preventDefault()
    history.push(`/map/wells/${well?.id.toUpperCase()}`, {
      showWellBreadcrumb: true, breadcrumbs: [
        { title: "Documents", url: "/documents" },
      ],
    });
    setStateApp({ ...stateApp, DocumentDrawer: false, selectedDocument: {} });
  };

  // searching existing well
  const searchExistingWell = (value) => {
    setSearch(value);
    let existingWells = wells;
    if (value !== "") {
      const searchedWells = existingWells.filter((well) => well.wellName.toLowerCase().includes(value));
      setWells(searchedWells);
    } else {
      const wellDescriptor = wellsFromDocument?.getWellDescriptors[0];
      setWells(wellDescriptor?.wells);
    }
  };
  return (
    <div style={{ marginRight: "14px" }}>
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
            <AddIcon id="addIcon" size="large" />
          </IconButton>
        </Grid>
      </Grid>
      <Divider />
      <div className={classes.list}>
        {(getWellsLoading === true || addWellLoading === true) && (
          <Grid container className={classes.actionGrid}>
            <Grid item xs={12}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress size="20px" />
              </div>
            </Grid>
          </Grid>
        )}

        <List id="wellsList" aria-label="wells list">
          {wells && wells.length > 0 ? (
            wells.map((well, index) => (
              <div style={{ padding: "0px 0px 0px" }}>
                <ListItem key={index}>
                  <a className={classes.wellLink} href={`/map/wells/${well?.id.toUpperCase()}?title="Documents"&url="/documents"`} onClick={(e) => goToWell(e, well)} target="_blank" rel="noreferrer">
                    {well.wellName}
                  </a>

                  {deleteWellLoading && deletedRow === well.id ? (
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="delete">
                        <CircularProgress size="20px" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  ) : (
                    <ListItemSecondaryAction
                      onClick={() => {
                        setDeletedRow(well.id);
                        deleteWell(well.id);
                      }}
                    >
                      <IconButton edge="end" aria-label="delete" className={classes.deleteIcon}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
                <p className={classes.secondaryText}>{well?.apiNumber}</p>
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
    </div>
  );
};

export default function AssociatedWellsProvider({ title }) {
  return (
    <DocumentContextProvider>
      <AssociatedWellsList title={title} />
    </DocumentContextProvider>
  );
}

AssociatedWellsProvider.defaultProps = {
  title: "Wells",
};
