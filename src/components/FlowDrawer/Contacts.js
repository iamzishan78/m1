import React, { useEffect, useState, useContext, useCallback } from "react";
import { Grid, ListItemIcon, ListItemText, makeStyles, Divider, List, ListItem, Typography, Tooltip, InputBase, Accordion, AccordionSummary, AccordionDetails } from "@material-ui/core";
import get from "lodash/get";
import Avatar from "react-avatar";
import SearchIcon from "@material-ui/icons/Search";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AddIcon from "@material-ui/icons/Add";
import { useHistory } from "react-router-dom";
import CallOutlinedIcon from '@material-ui/icons/CallOutlined';
import PhoneIphoneIcon from '@material-ui/icons/PhoneIphone';
import DomainOutlinedIcon from '@material-ui/icons/DomainOutlined';
import AutocompEntityNamesVirtualizeList from "components/Shared/M1nTable/components/SubComponents/AutocompEntityNamesVirtualizeList";
import { PAGINATEDCONTACTSQUERY } from "graphQL/useQueryPaginatedContacts";
import { ADDCONTACT } from "graphQL/useMutationAddContact";
import { AppContext } from "../../AppContext";
import { useLazyQuery, useMutation } from "@apollo/client";
import CloseIcon from "@material-ui/icons/Close";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import { REMOVEDEALDESCRIPTOR } from "../../graphQL/useMutationRemoveDealDescriptor";
import Link from "@material-ui/core/Link";
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';
import './Contact.css'

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
  acSummaryRoot: {
    minHeight: "unset !important",
  },
  acSummaryContent: {
    margin: "0px !important"
  },
  accDetail:{
    paddingTop: "0px !important",
    "& .acc-data .address:first-child":{
      marginTop: "0px !important"
    }
  }
}));
let contactDetail = {}
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
  const [expandedPanel, setExpandedPanel] = useState(false);
  const [getPaginatedContacts, { data: allContacts, fetchMore: fetchMorePaginatedContacts }] = useLazyQuery(PAGINATEDCONTACTSQUERY, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });
  const [getPaginatedContactList, { data: allContactList }] = useLazyQuery(PAGINATEDCONTACTSQUERY, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });
  const [addNewContact, { data: addContactData }] = useMutation(ADDCONTACT);
  const [removeDealDescriptor] = useMutation(REMOVEDEALDESCRIPTOR);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : false);
  };
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
      // setMutationLoading(true);
      setAddContact(false);
      setNameAutValue("");
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

  useEffect(() => {
    if (allContactList?.paginatedContacts && allContactList?.paginatedContacts?.edges[0]) {
      if (filteredContacts && filteredContacts.length > 0) {
        let filterData = filteredContacts.map((dataMap, index) => {
          if (dataMap === allContactList?.paginatedContacts?.edges[0].node.name) {
            contactDetail = {
              _id: dataMap._id,
              descriptorId: dataMap.descriptorId,
              name: allContactList?.paginatedContacts?.edges[0].node.name,
              homePhone: allContactList?.paginatedContacts?.edges[0].node.homePhone ? allContactList?.paginatedContacts?.edges[0].node.homePhone : "",
              mobilePhone: allContactList?.paginatedContacts?.edges[0].node.mobilePhone ? allContactList?.paginatedContacts?.edges[0].node.mobilePhone : "",
              address1: allContactList?.paginatedContacts?.edges[0].node.address1 ? allContactList?.paginatedContacts?.edges[0].node.address1 + " " + allContactList?.paginatedContacts?.edges[0].node.city + " " + allContactList?.paginatedContacts?.edges[0].node.state + " " + allContactList?.paginatedContacts?.edges[0].node.zip : "",
              primaryEmail: allContactList?.paginatedContacts?.edges[0].node.primaryEmail ? allContactList?.paginatedContacts?.edges[0].node.primaryEmail : ""
            }
          } else if (dataMap.name === allContactList?.paginatedContacts?.edges[0].node.name) {
            contactDetail = {
              _id: dataMap._id,
              descriptorId: dataMap.descriptorId,
              name: allContactList?.paginatedContacts?.edges[0].node.name,
              homePhone: allContactList?.paginatedContacts?.edges[0].node.homePhone ? allContactList?.paginatedContacts?.edges[0].node.homePhone : "",
              mobilePhone: allContactList?.paginatedContacts?.edges[0].node.mobilePhone ? allContactList?.paginatedContacts?.edges[0].node.mobilePhone : "",
              address1: allContactList?.paginatedContacts?.edges[0].node.address1 ? allContactList?.paginatedContacts?.edges[0].node.address1 + " " + allContactList?.paginatedContacts?.edges[0].node.city + " " + allContactList?.paginatedContacts?.edges[0].node.state + " " + allContactList?.paginatedContacts?.edges[0].node.zip : "",
              primaryEmail: allContactList?.paginatedContacts?.edges[0].node.primaryEmail ? allContactList?.paginatedContacts?.edges[0].node.primaryEmail : ""
            }
          } else {
            contactDetail = {
              _id: dataMap._id,
              descriptorId: dataMap.descriptorId,
              name: dataMap.name ? dataMap.name : dataMap,
              homePhone: dataMap.homePhone ? dataMap.homePhone : "",
              mobilePhone: dataMap.mobilePhone ? dataMap.mobilePhone : "",
              address1: dataMap.address1 ? dataMap.address1 : "",
              primaryEmail: dataMap.primaryEmail ? dataMap.primaryEmail : "",
            }
          }
          return contactDetail;
        })
        const uniqueIds = [];
        const unique = filterData.filter(element => {
          const isDuplicate = uniqueIds.includes(element.name);
          if (!isDuplicate) {
            uniqueIds.push(element.id);
            return true;
          }
        });
        setFilteredContacts(unique)
      }
    }
  }, [allContactList]);

  const loadNextPage = async (pageVariables) => {
    setIsNextPageLoading(true);
    fetchMorePaginatedContacts(528487);
  };

  useEffect(() => {
    let filtered = contacts?.filter((c) => c ? c : c.name.toLowerCase().includes(search.toLowerCase()));
    setFilteredContacts(filtered);
  }, [search, contacts]);

  const GettingContacts = useCallback(() => {
    let contactnames = stateApp.activeDeal?.contacts?.map((value) => {
      if (get(value, "relatedObject.entityDetail.name")) {
        return value.relatedObject.entityDetail.name;
      } else if (get(value, "name")) {
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
    setMutationLoading(props.loading);
  }, [props.loading]);

  const DeleteContact = async (index) => {
    const descriptorId = get(stateApp, `activeDeal.contacts[${index}].descriptorId`) || get(stateApp, `activeDeal.contacts[${index}]._id`);
    let result = await removeDealDescriptor({
      variables: { id: descriptorId, relatedObjectType: "Contact" },
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

  const toggleAcordion = (c) => {
    if (c && c !== "" && c !== "Empty") {
      setIsNextPageLoading(true);
      getPaginatedContactList({
        variables: {
          search: c,
        },
      });
    }
  }

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
              onBlur={() => setAddContact((addContact) => !addContact)}
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
      <div className={classes.list} style={{ padding: '0px' }}>
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

                  {/* {c} */}
                  <Accordion
                   expanded={expandedPanel === 'panel' + i.toString()} onChange={handleAccordionChange('panel' + i.toString())}>
                    <AccordionSummary
                      classes={{
                        root: classes.acSummaryRoot,
                        content: classes.acSummaryContent
                      }}
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      IconButtonProps={{
                        onClick: () => toggleAcordion(c.name ? c.name : c, i)
                      }}
                    >
                      <ListItemIcon>
                        <Avatar
                          color={Avatar.getRandomColor(c.name ? c.name : c, ["#b5d2f6", "#ade2e9", "#eaeaea", "#f2c1e2", "#d7d6fb"])}
                          fgColor="#000"
                          name={c.name ? c.name : c}
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
                        <Typography>{c.name ? c.name : c}</Typography>
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
                            DeleteContact(i);
                            setMutationLoading(stateApp.activeDeal?.contacts[i]?._id);
                          }}

                        >
                          <IconButton edge="end" aria-label="delete" size="small">
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </ListItemSecondaryAction>

                      )}

                    </AccordionSummary>

                    <AccordionDetails className={classes.accDetail}>
                      <div className="acc-data">
                        {c.homePhone ? <p className="address"><CallOutlinedIcon /> <Typography className="address_tabs">{c.homePhone}</Typography></p> : null}
                        {c.mobilePhone ? <p className="address"><PhoneIphoneIcon /> <Typography className="address_tabs">{c.mobilePhone}</Typography></p> : null}
                        {c.primaryEmail ? <p className="address"><EmailOutlinedIcon /> <Typography className="address_tabs"> {c.primaryEmail}</Typography></p> : null}
                        {c.address1 ? <p className="address"><DomainOutlinedIcon /> <Typography className="address_tabs">{c.address1}</Typography></p>
                          : null}
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </ListItem>
                <Divider key={`divider-${i}`} />
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
