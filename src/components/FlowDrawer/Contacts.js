import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  Grid,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  makeStyles,
  TextField,
  Divider,
  List,
  ListItem,
  Button,
} from "@material-ui/core";
import get from 'lodash/get'
import Avatar from "react-avatar";
import SearchIcon from "@material-ui/icons/Search";
import AddIcon from "@material-ui/icons/Add";

import AutocompEntityNamesVirtualizeList from "components/Shared/M1nTable/components/SubComponents/AutocompEntityNamesVirtualizeList";
import { PAGINATEDCONTACTSQUERY } from "graphQL/useQueryPaginatedContacts";
import { ADDCONTACT } from "graphQL/useMutationAddContact";
import { AppContext } from "../../AppContext";
import { useLazyQuery, useMutation } from "@apollo/client";
import DeleteIcon from '@material-ui/icons/Delete';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import { REMOVEDEALDESCRIPTOR } from "../../graphQL/useMutationRemoveDealDescriptor";

const useStyles = makeStyles((theme) => ({
  root: {
    overflowY: "auto",
    maxHeight: "85vh",
    padding: "0px 30px 10px 30px",
    "& .MuiList-padding": {
      padding: "23px 0px !important",
    },
  },
  button: {
    width: "100%",
  },
  actionGrid: {
    margin: "0px 0px 10px 0px"
  }
}));

export default function Contacts(props) {
  const classes = useStyles();
  const [search, setSearch] = useState("");
  const [contacts, setContacts] = useState();
  const [filteredContacts, setFilteredContacts] = useState(contacts);
  const [mongoEntitiesArray, setMongoEntitiesArray] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);
  const [nameAutValue, setNameAutValue] = useState("");
  const [nameAutInputValue, setNameAutInputValue] = useState("");
  const [addContact, setAddContact] = useState(false);
  const [stateApp,] = useContext(AppContext);
  const [mutationLoading, setMutationLoading] = useState(false)
  const [
    getPaginatedContacts,
    { data: allContacts, fetchMore: fetchMorePaginatedContacts },
  ] = useLazyQuery(PAGINATEDCONTACTSQUERY, {
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
    if (get(addContactData, 'addContact.contact')) {
      setNameAutValue({ name: addContactData.addContact.contact.name, _id: addContactData.addContact.contact._id })
    }
  }, [addContactData])

  useEffect(() => {
    if (allContacts?.paginatedContacts) {
      setMongoEntitiesArray(
        allContacts?.paginatedContacts?.edges?.map((el) => el.node)
      );
      setHasNextPage(allContacts?.paginatedContacts?.pageInfo?.hasNextPage);
      setIsNextPageLoading(false);
    }
  }, [allContacts]);

  const loadNextPage = async (pageVariables) => {
    setIsNextPageLoading(true);
    fetchMorePaginatedContacts(pageVariables);
  };

  useEffect(() => {
    let filtered = contacts?.filter((c) =>
      c.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredContacts(filtered);

  }, [search, contacts]);

  const GettingContacts = useCallback(() => {
    let contactnames = stateApp.activeDeal?.contacts?.map((value) => {
      if (value.relatedObject?.entity?.name !== undefined) {
        return value.relatedObject?.entity?.name
      }
      else if (value?.name && value?.name !== undefined) {
        return value.name;
      }
      else {
        return 'Empty'
      }
    })
    setContacts(contactnames)
  }, [stateApp.activeDeal?.contacts]);

  useEffect(() => {
    GettingContacts()
  }, [search, props, GettingContacts]);

  useEffect(() => {
    if (!props.loading) { setMutationLoading(false) }
  }, [props.loading])
  const DeleteContact = async (dealid) => {
    let result = await removeDealDescriptor({
      variables: { id: dealid, relatedObjectType: "Contact" },
      refetchQueries: ["getPipeline", "getContactDeals"],
      awaitRefetchQueries: true,

    });
    let response = await result.data.removeDealDescriptor.success
    if (response) {
      // GettingContacts()
      props.getDeal()

    }
    else {
      setMutationLoading(false)
    }
  }
  return (
    <div>
      <div style={{ padding: "0px 30px" }}>
        <h1>{stateApp.activeDeal.name}</h1>
        <TextField
          fullWidth
          placeholder="Search contacts..."
          InputProps={{
            startAdornment: (
              <>
                <InputAdornment position="start">
                  <SearchIcon htmlColor="#757575" />
                </InputAdornment>
              </>
            ),
          }}
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
          }}
        />
      </div>
      <div className={classes.root}>
        <List aria-label="contacts list">
          {filteredContacts && filteredContacts.length > 0 ? (
            filteredContacts.map((c, i) => (
              <>
                <ListItem key={i}>
                  <ListItemIcon>
                    <Avatar
                      color={Avatar.getRandomColor(c, [
                        "#b5d2f6",
                        "#ade2e9",
                        "#eaeaea",
                        "#f2c1e2",
                        "#d7d6fb",
                      ])}
                      fgColor="#000"
                      name={c}
                      size="35"
                      round
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={c}
                    primaryTypographyProps={{
                      color: "primary",
                    }}
                  />
                  {mutationLoading === stateApp.activeDeal?.contacts[i]?._id ? (
                    <ListItemSecondaryAction >
                      <IconButton edge="end" aria-label="delete">
                        <CircularProgress></CircularProgress>
                      </IconButton>
                    </ListItemSecondaryAction>
                  ) : (<ListItemSecondaryAction onClick={() => {
                    DeleteContact(stateApp.activeDeal?.contacts[i]?._id);
                    setMutationLoading(stateApp.activeDeal?.contacts[i]?._id)
                  }}>
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>)}

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
        <Grid container className={classes.actionGrid}>
          <Grid item xs={12}>
            {addContact ? (
              <>
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
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  onClick={() => {
                    props.addSelectedContact(nameAutValue)
                    GettingContacts()
                    setMutationLoading(true)
                    setAddContact(false)
                  }}
                >
                  <AddIcon />
                </Button>
              </>
            ) : (
              <Button
                disabled={mutationLoading}
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                className={classes.button}
                onClick={() => setAddContact((addContact) => !addContact)}
              >
                Add Contact
              </Button>
            )}
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
