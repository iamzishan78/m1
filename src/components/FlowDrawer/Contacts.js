import React, { useEffect, useState } from "react";
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
import Avatar from "react-avatar";
import SearchIcon from "@material-ui/icons/Search";
import AddIcon from "@material-ui/icons/Add";
import AutocompEntityNamesVirtualizeList from "components/Shared/M1nTable/components/SubComponents/AutocompEntityNamesVirtualizeList";
import { PAGINATEDCONTACTSQUERY } from "graphQL/useQueryPaginatedContacts";
import { useLazyQuery } from "@apollo/client";

const useStyles = makeStyles((theme) => ({
  root: {
    "&  .MuiList-padding": {
      padding: "23px 0px !important",
    },
  },
  button: {
    width: "100%",
  },
}));

export default function Contacts() {
  const classes = useStyles();
  const [search, setSearch] = useState("");
  const [contacts, setContacts] = useState(["Kumail Pirzada", "Jacob Avery"]);
  const [filteredContacts, setFilteredContacts] = useState(contacts);
  const [mongoEntitiesArray, setMongoEntitiesArray] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);
  const [nameAutValue, setNameAutValue] = useState("");
  const [nameAutInputValue, setNameAutInputValue] = useState("");
  const [addContact, setAddContact] = useState(false);

  const [
    getPaginatedContacts,
    { data: allContacts, loading, fetchMore: fetchMorePaginatedContacts },
  ] = useLazyQuery(PAGINATEDCONTACTSQUERY, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  useEffect(() => {
    console.log("AUTOCOMPLETE INPUT CHANGE: ", nameAutInputValue);
    //will also run during initial mount
    setIsNextPageLoading(true);
    getPaginatedContacts({
      variables: {
        search: nameAutInputValue,
      },
    });
  }, [nameAutInputValue]);

  useEffect(() => {
    console.log("ALL CONTACTS: ", allContacts);
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

  return (
    <div>
      <h1>GSC Project 1</h1>
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

      <div>
        <Grid container>
          <Grid item xs={12}>
            {addContact ? (
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
              />
            ) : (
              <Button
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
