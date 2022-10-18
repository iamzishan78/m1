import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import Link from "@material-ui/core/Link";
import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CircularProgress from "@material-ui/core/CircularProgress";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

//Contexts
import { AppContext } from "AppContext";

//Components
import SearchField from "./SearchField";

// Hooks
import { useMutation } from "@apollo/client";

// Mutations
import { ADD_WELL_TO_FILE_DESCRIPTOR } from "graphQL/useMutationAddWellToFileDescriptor";
import { DELETE_WELL_DESCRIPTOR, UPSERT_WELL_DESCRIPTOR } from "graphQL/useMutationWellDescriptor";

const propertyParams = [
  { type: "text", label: "Well NRI", key: "wellNRI" },
  { type: "text", label: "Pay Status", key: "payStatus" },
  { type: "text", label: "Cost Free", key: "costFree" },
  { type: "text", label: "Div Order Status", key: "divOrderStatus" },
  { type: "text", label: "Internal Company", key: "internalCompany" },
  { type: "text", label: "Acquisition ID", key: "acquisitionID" },
  { type: "text", label: "Prospect ID", key: "prospectID" },
  { type: "text", label: "Classification", key: "classification" },
];

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
    fontSize: "16px",
    margin: 0,
    padding: 0,
  },
  accordion: {
    "& .MuiIconButton-root": {
      padding: 0,
    },
  },
}));

const ReveueProperties = ({ platformWell, properties }) => {
  // Initials
  let history = useHistory();
  const classes = useStyles();

  // States
  const [search, setSearch] = useState("");
  const [isSearchActive, setSearchState] = useState(false);
  const [addWell, setAddWell] = useState(false);

  const [upsertWellDescriptor, { loading: upsertWellLoading }] = useMutation(UPSERT_WELL_DESCRIPTOR);

  const handleAddProperty = (propertyId) => {
    upsertWellDescriptor({
      variables: {
        well: { ...platformWell, Id: platformWell.id, isDeleted: false },
        relatedObject: propertyId,
        relatedObjectType: "Property",
      },
    });
  };

  return (
    <div style={{ marginRight: "14px" }}>
      <Grid container direction="row" justify="space-between" alignItems="center" className={classes.rootPadding}>
        {!addWell && (
          <React.Fragment>
            {!isSearchActive && (
              <Grid item xs={10}>
                <Typography variant="h6" style={{ fontWeight: "bold" }}>
                  Related Properties
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
              esIndex="properties_flat"
              fields={["name^4", "_all"]}
              optionsParams={["name", "internalID"]}
              targetLabel="properties"
              onSelectOption={(property) => handleAddProperty(property._id)}
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
          {properties.length > 0 ? (
            properties.map((property, index) => (
              <Accordion className={classes.accordion} key={index}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                  <div>
                    <Link
                      className={classes.wellLink}
                      color="primary"
                      onClick={(event) => {
                        event.stopPropagation();
                        history.push(`/revenue/property/details/${property._id}`);
                      }}
                    >
                      <Typography variant="h6">{property.name}</Typography>
                    </Link>
                    <p className={classes.secondaryText}>{property.internalID}</p>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <div>
                    {propertyParams.map((param, index) => (
                      <React.Fragment key={index}>
                        <TextField
                          margin="dense"
                          label={param.label}
                          value={property[param.key]}
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                          defaultValue=""
                          disabled
                        />
                      </React.Fragment>
                    ))}
                  </div>
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <ListItem>
              <ListItemText
                primary={"No property found."}
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

export default ReveueProperties;
