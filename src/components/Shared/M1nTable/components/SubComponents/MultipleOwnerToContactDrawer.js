import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLazyQuery, useMutation } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Grid, Container, Box, CircularProgress, Tab, Tabs, IconButton } from "@material-ui/core";

import CloseSharp from "@material-ui/icons/CloseSharp";
import DoneSharpIcon from "@material-ui/icons/DoneSharp";
import RemoveSharpIcon from "@material-ui/icons/RemoveSharp";
import Typography from "@material-ui/core/Typography";
import AutocompEntityNamesVirtualizeList from "./AutocompEntityNamesVirtualizeList";
import RightDialog from "../../../../ContactDetailCard/components/RightDialog";
import { showSuccessMessage, showErrorMessage } from "../../../../../actions";
import { AppContext } from "../../../../../AppContext";
import { setStateIfDeepEqual } from "../../../functions";
import { PAGINATEDCONTACTSQUERY } from "../../../../../graphQL/useQueryPaginatedContacts";
import { CONVERT_MULTITPLE_OWNER_TO_CONTACT } from "../../../../../graphQL/useMutationConvertMultitpleOwnerToContact";

const styles = () => ({
  topHeading: { fontWeight: "bold" },
  loading: { position: "absolute", left: "250px", bottom: "148px", zIndex: "150" },
});

const useStyles = makeStyles(styles);

export default function MultipleOwnerToContactDrawer({ onClose, rows, setRows, setM1nSelectedRowsIndexes }) {
  const [stateApp] = React.useContext(AppContext);
  const classes = useStyles();
  const dispatch = useDispatch();

  const [primaryOwner, setPrimaryOwner] = useState(rows[0]);
  const [tab, setTab] = React.useState(0);
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
    ownerIds = ownerIds.reduce((ids, row) => { ids.push(row.id); return ids; }, []);

    let existingContactId = null;
    if (tab === 1) {
      existingContactId = nameAutValue._id
    }

    setLoading(true);
    convertMultitpleOwnerToContact({
      variables: { ownerIds, existingContactId, userId: stateApp.user.mongoId },
      refetchQueries: ["checkIfOwnersAreContacts"],
      awaitRefetchQueries: true
    }).then(
      res => {
        console.log(res)
        dispatch(showSuccessMessage("Contacts Merged Successfully"));
        setM1nSelectedRowsIndexes([])
        onClose();
        setLoading(false);
      },
      err => { console.log(err); setLoading(false); dispatch(showErrorMessage("Failed to merge")); }
    );
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
              <Tabs value={tab} indicatorColor="primary" textColor="primary" onChange={handleTabChange} >
                <Tab label="Create New" />
                <Tab label="Add to Existing Contact" />
              </Tabs>
            </Box>

            <Box mt={2}>
              <Typography>
                Selected interest owners will be combined into a single contact.
            </Typography>
            </Box>
            {
              tab === 1 &&
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

          {rows.map((row) => (
            <Grid container direction="row" spacing={2} alignItems="center" key={row.id}>

              {
                tab === 0 && <Grid item md={1}>
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

              <Grid item md={tab === 0 ? 10 : 11}>
                <Typography style={{ backgroundColor: "#edfbff" }}>
                  <Grid container justify='center' alignItems='center'>
                    <Grid item md={4}>{row.name}</Grid>
                    <Grid item md={8}>{row.StreetAddress} {row.City}, {row.State} {row.Zip}</Grid>
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

          <Box pt={6} mt={6}>
            <Grid container direction="row" justify="flex-end" alignItems="flex-end">
              <Grid item>
                <Button onClick={handleClose}>Cancel</Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  component="span"
                  disabled={rows.length < 2}
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
