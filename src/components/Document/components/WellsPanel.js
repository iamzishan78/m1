import React, { useEffect, useState, useContext, useCallback } from "react";
import { Grid, ListItemText, makeStyles, Divider, List, ListItem, Typography, Tooltip, InputBase } from "@material-ui/core";
import get from "lodash/get";
import SearchIcon from "@material-ui/icons/Search";
import AddIcon from "@material-ui/icons/Add";
import { useHistory } from "react-router-dom";
import AutocompEntityNamesVirtualizeList from "components/Shared/M1nTable/components/SubComponents/AutocompEntityNamesVirtualizeList";
import { PAGINATEDCONTACTSQUERY } from "graphQL/useQueryPaginatedContacts";
import { ADDCONTACT } from "graphQL/useMutationAddContact";
import { AppContext } from "AppContext";
import { useLazyQuery, useMutation } from "@apollo/client";
import DeleteIcon from "@material-ui/icons/Delete";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import { REMOVEDEALDESCRIPTOR } from "graphQL/useMutationRemoveDealDescriptor";
import Link from "@material-ui/core/Link";

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
}));

export default function Contacts(props) {
  let history = useHistory();
  const classes = useStyles();
  const [search, setSearch] = useState("");
  const [wells, setWells] = useState([
    {
      _id: "1",
      name: "Sample Well 1",
    },
    {
      _id: "2",
      name: "Sample Well 2",
    },
    {
      _id: "3",
      name: "Sample Well 3",
    },
    {
      _id: "4",
      name: "Sample Well 4",
    },
  ]);
  const [isSearchActive, setSearchState] = useState(false);
  const [filteredWells, setFilteredWells] = useState(wells);
  const [mongoEntitiesArray, setMongoEntitiesArray] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);
  const [nameAutValue, setNameAutValue] = useState("");
  const [nameAutInputValue, setNameAutInputValue] = useState("");
  const [addWell, setAddWell] = useState(false);
  const [stateApp, setStateApp] = useContext(AppContext);
  const [mutationLoading, setMutationLoading] = useState(false);
  const [getPaginatedContacts, { data: allContacts, fetchMore: fetchMorePaginatedContacts }] = useLazyQuery(PAGINATEDCONTACTSQUERY, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });
  // const [addNewContact, { data: addWellData }] = useMutation(ADDCONTACT);
  const [removeDealDescriptor] = useMutation(REMOVEDEALDESCRIPTOR);

  useEffect(() => {
    //will also run during initial mount
    setIsNextPageLoading(true);
    getPaginatedContacts({
      variables: {
        search: nameAutInputValue,
      },
    });
  }, [getPaginatedContacts, nameAutInputValue]);

  useEffect(() => {
    if (nameAutValue) {
      props.addSelectedContact(nameAutValue);
      // GettingContacts();
      // setMutationLoading(true);
      setAddWell(false);
      setNameAutValue("");
    }
  }, [nameAutValue]);

  // useEffect(() => {
  //   if (get(addWellData, "addWell.well")) {
  //     setNameAutValue({ name: addWellData.addWell.well.name, _id: addWellData.addWell.well._id });
  //   }
  // }, [addWellData]);

  useEffect(() => {
    if (allContacts?.paginatedContacts) {
      setMongoEntitiesArray(allContacts?.paginatedContacts?.edges?.map((el) => el.node));
      setHasNextPage(allContacts?.paginatedContacts?.pageInfo?.hasNextPage);
      setIsNextPageLoading(false);
    }
  }, [allContacts]);

  const loadNextPage = async (pageVariables) => {
    setIsNextPageLoading(true);
    fetchMorePaginatedContacts(pageVariables);
  };

  useEffect(() => {
    let filteredWells = wells.filter((w) => w.name.toLowerCase().includes(search.toLowerCase()));
    setFilteredWells(filteredWells);
  }, [search, wells]);

  // const GettingWells = useCallback(() => {
  //   let contactnames = stateApp.activeDeal?.contacts?.map((value) => {
  //     if (get(value, "relatedObject.entityDetail.name")) {
  //       return value.relatedObject.entityDetail.name;
  //     } else if (get(value, "name")) {
  //       return value.name;
  //     } else {
  //       return "Empty";
  //     }
  //   });
  //   setWells(contactnames);
  // }, [stateApp.activeDeal?.contacts]);

  // useEffect(() => {
  //   GettingWells();
  // }, [search, props, GettingWells]);

  useEffect(() => {
    setMutationLoading(props.loading);
  }, [props.loading]);

  const deleteWell = async (wellId) => {
    let filteredWells = wells.filter((w) => w._id !== wellId);
    setWells(filteredWells);
    // const descriptorId = get(stateApp, `activeDeal.contacts[${index}].descriptorId`) || get(stateApp, `activeDeal.contacts[${index}]._id`);
    // let result = await removeDealDescriptor({
    //   variables: { id: descriptorId, relatedObjectType: "Contact" },
    //   refetchQueries: ["getPipeline", "getContactDeals"],
    //   awaitRefetchQueries: true,
    // });
    // let response = await result.data.removeDealDescriptor.success;
    // if (response) {
    //   props.getDeal();
    // } else {
    //   setMutationLoading(false);
    // }
  };

  const gotoContact = (index) => {
    setStateApp((stateApp) => ({
      ...stateApp,
      selectedContact: stateApp.activeDeal?.contacts[index]?._id,
      dealDialog: false,
      transactBarView: "Deal",
    }));
    history.push(`/map/wells/7013D1FC-F2F1-478A-A790-0858509489F4/39.1058388/-98.998703`);
  };

  return (
    <div style={{ marginRight: "14px" }}>
      <Grid container direction="row" justify="space-between" alignItems="center" className={classes.rootPadding}>
        {!addWell && (
          <React.Fragment>
            {!isSearchActive && (
              <Grid item xs={10}>
                <Typography variant="h6">Wells</Typography>
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
                  onChange={(evt) => setSearch(evt.target.value)}
                />
              </div>
            </Grid>
          </React.Fragment>
        )}
        {addWell && (
          <Grid item xs={11}>
            <AutocompEntityNamesVirtualizeList
              mongoEntitiesArray={mongoEntitiesArray}
              setMongoEntitiesArray={setMongoEntitiesArray}
              nameAutValue={nameAutValue}
              setNameAutValue={setNameAutValue}
              nameAutInputValue={nameAutInputValue}
              setNameAutInputValue={setNameAutInputValue}
              variant="outlined"
              label="Well Name"
              hasNextPage={hasNextPage}
              isNextPageLoading={isNextPageLoading}
              loadNextPage={loadNextPage}
              disabled={props.loading}
              addNew={true}
              addNewOnClick={(value) => {
                const well = { name: value };
                // addNewContact({
                //   variables: {
                //     well: {
                //       ...well,
                //       createBy: stateApp.user.mongoId,
                //       lastUpdateBy: stateApp.user.mongoId,
                //     },
                //   },
                //   refetchQueries: ["getPaginatedContacts", "getContact"],
                //   awaitRefetchQueries: true,
                // });
                console.log("Contact is", well);
              }}
              onBlur={() => setAddWell((addWell) => !addWell)}
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
            <AddIcon size="large" />
          </IconButton>
        </Grid>
      </Grid>
      <Divider />
      <div className={classes.list}>
        {mutationLoading === true && (
          <Grid container className={classes.actionGrid}>
            <Grid item xs={12}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress size="20px" />
              </div>
            </Grid>
          </Grid>
        )}

        <List aria-label="wells list">
          {filteredWells && filteredWells.length > 0 ? (
            filteredWells.map((well, index) => (
              <div style={{ padding: "10px 0px 0px" }}>
                <ListItem key={index}>
                  <Link
                    style={{
                      cursor: "pointer",
                    }}
                    color="primary"
                    onClick={() => gotoContact(index)}
                  >
                    {well.name}
                  </Link>

                  {/* {mutationLoading === stateApp.activeDeal?.contacts[index]?._id ? (
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="delete">
                        <CircularProgress />
                      </IconButton>
                    </ListItemSecondaryAction>
                  ) : ( */}
                  <ListItemSecondaryAction
                    onClick={() => {
                      deleteWell(well._id);
                      // setMutationLoading(stateApp.activeDeal?.contacts[index]?._id);
                    }}
                  >
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                  {/* )} */}
                </ListItem>
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
}
