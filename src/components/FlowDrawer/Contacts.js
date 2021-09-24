import React, { useEffect, useState, useContext, useCallback } from "react";
import { Grid, ListItemIcon, ListItemText, makeStyles, Divider, List, ListItem, Typography, Tooltip, InputBase } from "@material-ui/core";
import get from "lodash/get";
import Avatar from "react-avatar";
import SearchIcon from "@material-ui/icons/Search";
import AddIcon from "@material-ui/icons/Add";
import { useHistory } from "react-router-dom";
import AutocompEntityNamesVirtualizeList from "components/Shared/M1nTable/components/SubComponents/AutocompEntityNamesVirtualizeList";
import { PAGINATEDCONTACTSQUERY } from "graphQL/useQueryPaginatedContacts";
import { ADDCONTACT } from "graphQL/useMutationAddContact";
import { AppContext } from "../../AppContext";
import { useLazyQuery, useMutation } from "@apollo/client";
import DeleteIcon from "@material-ui/icons/Delete";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import { REMOVEDEALDESCRIPTOR } from "../../graphQL/useMutationRemoveDealDescriptor";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles((theme) => ({
  rootPadding: {
    padding: "6px 30px",
  },
  list: {
    overflowY: "auto",
    maxHeight: "79vh",
    padding: "0px 30px",
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
  const [contacts, setContacts] = useState();
  const [isSearchActive, setSearchState] = useState(false);
  const [filteredContacts, setFilteredContacts] = useState(contacts);
  const [mongoEntitiesArray, setMongoEntitiesArray] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);
  const [nameAutValue, setNameAutValue] = useState("");
  const [nameAutInputValue, setNameAutInputValue] = useState("");
  const [addContact, setAddContact] = useState(false);
  const [stateApp, setStateApp] = useContext(AppContext);
  const [mutationLoading, setMutationLoading] = useState(false);
  const [getPaginatedContacts, { data: allContacts, fetchMore: fetchMorePaginatedContacts }] = useLazyQuery(PAGINATEDCONTACTSQUERY, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });
  const [addNewContact, { data: addContactData }] = useMutation(ADDCONTACT);
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
      GettingContacts();
      setMutationLoading(true);
      setAddContact(false);
    }
  }, [nameAutValue]);

  useEffect(() => {
    if (get(addContactData, "addContact.contact")) {
      setNameAutValue({ name: addContactData.addContact.contact.name, _id: addContactData.addContact.contact._id });
    }
  }, [addContactData]);

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
    let filtered = contacts?.filter((c) => c.toLowerCase().includes(search.toLowerCase()));
    setFilteredContacts(filtered);
  }, [search, contacts]);

  const GettingContacts = useCallback(() => {
    let contactnames = stateApp.activeDeal?.contacts?.map((value) => {
      if (value.relatedObject?.entity?.name !== undefined) {
        return value.relatedObject?.entity?.name;
      } else if (value?.name && value?.name !== undefined) {
        return value.name;
      } else {
        return "Empty";
      }
    });
    setContacts(contactnames);
  }, [stateApp.activeDeal?.contacts]);

  useEffect(() => {
    GettingContacts();
  }, [search, props, GettingContacts]);

  useEffect(() => {
    if (!props.loading) {
      setMutationLoading(false);
    }
  }, [props.loading]);
  const DeleteContact = async (dealid) => {
    let result = await removeDealDescriptor({
      variables: { id: dealid, relatedObjectType: "Contact" },
      refetchQueries: ["getPipeline", "getContactDeals"],
      awaitRefetchQueries: true,
    });
    let response = await result.data.removeDealDescriptor.success;
    if (response) {
      props.getDeal();
    } else {
      setMutationLoading(false);
    }
  };

  const gotoContact = (index) => {
    setStateApp((stateApp) => ({
      ...stateApp,
      selectedContact: stateApp.activeDeal?.contacts[index]?._id,
      dealDialog: false,
      transactBarView: "Deal",
    }));
    history.push(`/contact/details/${stateApp.activeDeal?.contacts[index]?._id}?return-url=${history.location.pathname}`);
  };

  return (
    <>
      <Grid container direction="row" justify="space-between" alignItems="center" className={classes.rootPadding}>
        {!addContact && (
          <React.Fragment>
            {!isSearchActive && (
              <Grid item xs={10}>
                <Typography variant="h6">Contacts</Typography>
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
                  placeholder="Search Contacts"
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
        {addContact && (
          <Grid item xs={11}>
            <AutocompEntityNamesVirtualizeList
              mongoEntitiesArray={mongoEntitiesArray}
              setMongoEntitiesArray={setMongoEntitiesArray}
              nameAutValue={nameAutValue}
              setNameAutValue={setNameAutValue}
              nameAutInputValue={nameAutInputValue}
              setNameAutInputValue={setNameAutInputValue}
              variant="outlined"
              label="Contact Name"
              hasNextPage={hasNextPage}
              isNextPageLoading={isNextPageLoading}
              loadNextPage={loadNextPage}
              disabled={props.loading}
              addNew={true}
              addNewOnClick={(value) => {
                const contact = { name: value };
                addNewContact({
                  variables: {
                    contact: {
                      ...contact,
                      createBy: stateApp.user.mongoId,
                      lastUpdateBy: stateApp.user.mongoId,
                    },
                  },
                  refetchQueries: ["getPaginatedContacts", "getContact"],
                  awaitRefetchQueries: true,
                });
              }}
            />
          </Grid>
        )}
        <Grid item xs={1}>
          <IconButton
            onClick={() => {
              setAddContact((addContact) => !addContact);
              setSearch("");
            }}
          >
            <AddIcon size="large" />
          </IconButton>
        </Grid>
      </Grid>
      <Divider />
      <div className={classes.list}>
        <Grid container className={classes.actionGrid}>
          <Grid item xs={12}>
            {mutationLoading === true && (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress size="20px" />
              </div>
            )}
          </Grid>
        </Grid>

        <List aria-label="contacts list">
          {filteredContacts && filteredContacts.length > 0 ? (
            filteredContacts.map((c, i) => (
              <>
                <ListItem key={i}>
                  <ListItemIcon>
                    <Avatar
                      color={Avatar.getRandomColor(c, ["#b5d2f6", "#ade2e9", "#eaeaea", "#f2c1e2", "#d7d6fb"])}
                      fgColor="#000"
                      name={c}
                      size="35"
                      round
                    />
                  </ListItemIcon>
                  <Link
                    style={{
                      cursor: "pointer",
                    }}
                    color="primary"
                    onClick={() => gotoContact(i)}
                  >
                    {c}
                  </Link>

                  {mutationLoading === stateApp.activeDeal?.contacts[i]?._id ? (
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="delete">
                        <CircularProgress />
                      </IconButton>
                    </ListItemSecondaryAction>
                  ) : (
                    <ListItemSecondaryAction
                      onClick={() => {
                        DeleteContact(stateApp.activeDeal?.contacts[i]?.descriptorId);
                        setMutationLoading(stateApp.activeDeal?.contacts[i]?._id);
                      }}
                    >
                      <IconButton edge="end" aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
                <Divider />
              </>
            ))
          ) : (
            <ListItem>
              <ListItemText
                primary={"No contacts found."}
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
}
