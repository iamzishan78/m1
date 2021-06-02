import React, { useState, useEffect } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Grid, Container, Box, CircularProgress, Tab, Tabs, IconButton, FormControl, RadioGroup, FormControlLabel, Radio } from "@material-ui/core";

import CloseSharp from "@material-ui/icons/CloseSharp";
import DoneSharpIcon from "@material-ui/icons/DoneSharp";
import RemoveSharpIcon from "@material-ui/icons/RemoveSharp";
import Typography from "@material-ui/core/Typography";
import AutocompEntityNamesVirtualizeList from "./AutocompEntityNamesVirtualizeList";
import RightDialog from "../../../../ContactDetailCard/components/RightDialog";
import { AppContext } from "AppContext";
import { setStateIfDeepEqual } from "../../../functions";
import { PAGINATEDCONTACTSQUERY } from "graphQL/useQueryPaginatedContacts";
import { CONVERT_MULTITPLE_OWNER_TO_CONTACT } from "graphQL/useMutationConvertMultitpleOwnerToContact";
import ContactAutoComplete from "components/Shared/ContactAutoComplete";
import Loader from "components/Loaders";

const styles = () => ({
  topHeading: { fontWeight: "bold" },
  loading: { position: "absolute", left: "250px", bottom: "148px", zIndex: "150" },
  tabs: {
    backgroundColor: 'rgb(20, 171, 223)'
  },
  radio: {
    '& .MuiSvgIcon-root': {
      fill: 'rgb(20, 171, 223) !important'
    }
  },
});

const useStyles = makeStyles(styles);

const ACTION = Object.freeze({
  SINGLE: 'single',
  COMBINE: 'combine'
});

const TAB = Object.freeze({
  NEW: 0,
  EXISTING: 1
});

export default function MultipleOwnerToContactDrawer({ onClose, rows, setRows, setM1nSelectedRowsIndexes }) {
  const [stateApp] = React.useContext(AppContext);
  const classes = useStyles();

  const [primaryOwner, setPrimaryOwner] = useState(rows[0]);
  const [tab, setTab] = useState(TAB.NEW);
  const [actionType, setActionType] = useState('single');
  const [contactOwner, setContactOwner] = useState('');
  const [loading, setLoading] = useState(false);
  const [mongoEntitiesArray, setMongoEntitiesArray] = useState([]);
  const [nameAutValue, setNameAutValue] = useState({ name: "", id: 0, _id: 0 });
  const [nameAutInputValue, NameAutInputValue] = useState("");
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);

  const [convertMultitpleOwnerToContact] = useMutation(CONVERT_MULTITPLE_OWNER_TO_CONTACT);

  const [getPaginatedContacts, { data: allContacts, fetchMore: fetchMorePaginatedContacts }] = useLazyQuery(PAGINATEDCONTACTSQUERY, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  useEffect(() => {
    if (allContacts?.paginatedContacts) {
      setMongoEntitiesArray(allContacts?.paginatedContacts?.edges?.map((el) => el.node));
      setHasNextPage(allContacts?.paginatedContacts?.pageInfo?.hasNextPage);
      setIsNextPageLoading(false);
    }
  }, [allContacts]);

  useEffect(() => {
    setIsNextPageLoading(true);
    getPaginatedContacts({ variables: { search: nameAutInputValue } });
  }, [nameAutInputValue]);

  const setNameAutInputValue = (newState, n, k) => {
    setStateIfDeepEqual(NameAutInputValue, newState);
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const loadNextPage = async (pageVariables) => {
    setIsNextPageLoading(true);
    fetchMorePaginatedContacts(pageVariables);
  };

  const onDelete = (row) => {
    setRows(rows.filter((r) => r._id !== row._id));
  };

  const handleClose = () => {
    setM1nSelectedRowsIndexes([])
    onClose();
  }

  const onConvert = () => {
    let ownerIds = rows.filter((row) => row.id !== primaryOwner.id);
    ownerIds.unshift(primaryOwner)
    ownerIds = ownerIds.reduce((ids, row) => { ids.push(row.globalOwnerId || row.id); return ids; }, []);

    let existingContactId = null;
    let action = actionType
    if (tab === TAB.EXISTING) {
      existingContactId = nameAutValue._id
      action = ACTION.COMBINE
    }
    Loader.createToast('contact-creation', 'Contact Creation in Progress')
    convertMultitpleOwnerToContact({
      variables: { ownerIds, existingContactId, contactOwner, action, userId: stateApp.user.mongoId },
      refetchQueries: ["checkIfOwnersAreContacts"],
      awaitRefetchQueries: true
    }).then(
      res => {
        if (res.data && res.data.convertMultitpleOwnerToContact) {
          const { success, message } = res.data.convertMultitpleOwnerToContact
          if (success) {
            Loader.successToast('contact-creation', message)
          } else {
            Loader.errorToast('contact-creation', message)
          }
        } else {
          Loader.errorToast('contact-creation', "Failed to convert to contact")
        }
      },
      err => { console.log(err); Loader.errorToast('contact-creation', "Failed to convert to contact") }
    );

    setM1nSelectedRowsIndexes([])
    onClose();
    setLoading(false);
  };

  return (
    <RightDialog open={true}>
      <Container maxWidth="sm" >
        <div >
          <Box p={3} pt={1}>
            <Grid container direction="row" spacing={4} justify="space-between" alignItems="center" >
              <Grid item>
                <Typography className={classes.topHeading} variant="h5" component="h2">
                  Convert to Contact
              </Typography>
              </Grid>
              <Grid item>
                <IconButton aria-label="delete" color="primary" onClick={handleClose}>
                  <CloseSharp />
                </IconButton>
              </Grid>
            </Grid>

            <Box mt={2}>
              <Tabs value={tab} inkBarStyle={classes.tabs} textColor="primary" onChange={handleTabChange} >
                <Tab label="Create New" />
                <Tab label="Add to Existing Contact" />
              </Tabs>
            </Box>

            {tab === TAB.NEW && <Box mt={2}>
              <FormControl component="fieldset" >
                <RadioGroup aria-label="actionType" name="actionType" value={actionType} onChange={(e) => setActionType(e.target.value)}>
                  <FormControlLabel value={ACTION.SINGLE} control={<Radio className={actionType === ACTION.SINGLE ? classes.radio : ''} />} label="Convert selected interest owners to new contacts" />
                  <FormControlLabel value={ACTION.COMBINE} control={<Radio className={actionType === ACTION.COMBINE ? classes.radio : ''} />} disabled={rows.length === 1} label="Combine selected interest owners into single contact" />
                </RadioGroup>
              </FormControl>
            </Box>
            }

            {/* <Box mt={2}>
              <Typography>
                Selected interest owners will be combined into a single contact.
            </Typography>
            </Box> */}
            {
              tab === TAB.EXISTING &&
              <Box mt={2}>
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
              </Box>
            }

            <Box pt={3}>
              <Typography style={{ fontWeight: "bold" }}>Interest Owners</Typography>
              <Typography>{rows.length} selected</Typography>
            </Box>
          </Box>

          <Box ml={3}>
            {rows.map((row) => (

              <Grid container direction="row" spacing={2} alignItems="center" key={row.id}>
                {
                  tab === TAB.NEW && actionType === ACTION.COMBINE && <Grid item md={1}>
                    {primaryOwner.id === row.id ? (
                      <IconButton>
                        <DoneSharpIcon fontSize="small" style={{ background: "#00af48", color: "white", borderRadius: 3 }} />
                      </IconButton>
                    ) : (
                      <IconButton onClick={() => setPrimaryOwner(row)}>
                        <RemoveSharpIcon fontSize="small" style={{ background: "#f70000", color: "white", borderRadius: 3 }} />
                      </IconButton>
                    )}
                  </Grid>
                }

                <Grid item md={tab === TAB.NEW && ACTION.COMBINE ? 10 : 11}>
                  <Typography style={{ backgroundColor: "#edfbff" }}>
                    <Grid container alignItems='center' style={{ paddingLeft: 10 }}>
                      <Grid item >{row.name || row.OwnerName}</Grid>
                      <Grid item >{row.StreetAddress} {row.City}, {row.State} {row.Zip}</Grid>
                    </Grid>
                  </Typography>
                </Grid>

                <Grid item md={1}>
                  <IconButton aria-label="delete" onClick={() => onDelete(row)}>
                    <CloseSharp />
                  </IconButton>
                </Grid>
              </Grid>

            ))}
          </Box>

          {tab === TAB.NEW &&
            <Box p={3} pt={3}>
              <Grid container direction="column"  >
                <Grid item>
                  <Typography style={{ fontWeight: "bold" }}>Contact Owner</Typography>
                </Grid>
                <Grid item >
                  <ContactAutoComplete
                    value={contactOwner}
                    onChange={(e, user) => {
                      setContactOwner(user.value);
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          }

          <Box pt={6} mt={6}>
            <Grid container direction="row" justify="flex-end" alignItems="flex-end">
              <Grid item>
                <Button onClick={handleClose}>Cancel</Button>
              </Grid>
              <Grid item>
                {console.log('ROWS',rows)}
                {console.log('ROWS NAME',nameAutValue)}
                {console.log('ROWS TAB',TAB.EXISTING)}

                
                

                <Button
                  variant="contained"
                  component="span"
                  // disabled={rows.length === 0}
                  disabled={(tab === TAB.NEW && rows && rows.length === 0) || (tab === TAB.EXISTING && nameAutValue && nameAutValue.length === 0)}                    
                  style={{ backgroundColor: "#00abed", color: "white" }}
                  onClick={onConvert}
                >
                  Convert
              </Button>
              </Grid>
            </Grid>
          </Box>
        </div>
      </Container>

      {loading && (
        <div className={classes.loading}>
          <CircularProgress size={80} disableShrink color="secondary" />
        </div>
      )}
    </RightDialog>
  );
}
