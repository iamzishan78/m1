import React, { useContext, useState, useEffect } from "react";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import { Grid } from "@material-ui/core";
import { AppContext } from "../../../../../AppContext";
import { Modals } from "../../../../../styles/Modal";
import { useMutation, useLazyQuery } from "@apollo/client";
import { ADDOWNERTOAPARCEL } from "../../../../../graphQL/useMutationAddOwnerToAParcel";
import { UPDATEPARCELOWNER } from "../../../../../graphQL/useMutationUpdateParcelOwner";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import { showErrorMessage, showSuccessMessage } from "../../../../../actions";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import AutocompEntityNamesVirtualizeList from "./AutocompEntityNamesVirtualizeList";
import { ALLENTITYNAMESFORPARCEL } from "../../../../../graphQL/useQueryAllEntityNamesToAddAsParcelOwner";
import CircularProgress from "@material-ui/core/CircularProgress";
import { PAGINATEDCONTACTSQUERY } from "../../../../../graphQL/useQueryPaginatedContacts";
import { setStateIfDeepEqual } from "../../../functions";
import RightDialog from "../../../../ContactDetailCard/components/RightDialog";

const entities = [
  "Corporation",
  "Educational Institution",
  "Governmental Body",
  "Individual",
  "Non Profit",
  "Religious Institution",
  "Trust",
  "Unknown",
];
const types = [
  "Fee Interest",
  "Leasehold",
  "Mineral Interest",
  "Non-Executive Mineral Interest (NEMI)",
  "Overriding Royalty (ORRI)",
  "Royalty Interest (NPRI)",
  "Surface Rights",
  "Unknown",
  "Working Interest",
];

const useStyles = makeStyles((theme) => ({
  maxWidth: {
    width: "100%",
  },
  dialogContent: {
    "& header": {
      position: "absolute",
      left: "0",
      top: "55px",
    },
  },
  primary: {
      color: 'black',
      backgroundColor: '#E0E0E0'
  },
  secondary: {
      color: 'white',
      backgroundColor: '#26ACD8',
  },
  dialogAction: {
    "& .Mui-disabled": {
      backgroundColor: 'transparent',
    }
  },
  move: {
    zIndex: 10000,
  }
}));

export default function AddParcelOwnerDialogContent({
  selectedRow,
  setSelectedRow,
  ...props
}) {
  const dispatch = useDispatch();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [newOwner, setNewOwner] = useState({
    entity: "Unknown",
    type: "Unknown",
    depthFrom: "",
    depthTo: "",
    interest: "",
    nma: "",
    nra: "",
    customLayer: props.customLayerId,
  });
  const [parcelOwnersRadioBValue, setParcelOwnersRadioBValue] = useState(
    "true"
  );

  const [nameAutValue, setNameAutValue] = useState({ name: "", _id: null });
  const [mongoEntitiesArray, setMongoEntitiesArray] = useState([]);
  const [nameAutInputValue, NameAutInputValue] = useState("");
  const setNameAutInputValue = (newState) => {
    setStateIfDeepEqual(NameAutInputValue, newState);
  };
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);

  useEffect(() => {
    if (selectedRow) {
      const {
        entity,
        type,
        depthFrom,
        depthTo,
        interest,
        nma,
        nra,
        customLayer,
        name,
        ownerEntity,
      } = selectedRow;
      setNameAutValue({ name, _id: ownerEntity });

      setNewOwner({
        entity,
        type,
        depthFrom,
        depthTo,
        interest,
        nma,
        nra,
        customLayer,
      });

      if (depthTo === "All depths" && depthFrom === "All depths")
        setParcelOwnersRadioBValue("true");
      else setParcelOwnersRadioBValue("false");
    }
  }, [selectedRow]);

  // CONTACT

  const [
    getPaginatedContacts,
    {
      data: allContacts,
      loading: contactsLoading,
      fetchMore: fetchMorePaginatedContacts,
    },
  ] = useLazyQuery(PAGINATEDCONTACTSQUERY, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  const [addOwnerToAParcel, { data: mutationData }] = useMutation(
    ADDOWNERTOAPARCEL
  );

  const [updateParcelOwner, { data: updateData }] = useMutation(
    UPDATEPARCELOWNER
  );

  useEffect(() => {
    if (allContacts?.paginatedContacts) {
      setMongoEntitiesArray([
        ...allContacts?.paginatedContacts?.edges?.map((el) => el.node),
      ]);
      setHasNextPage(allContacts?.paginatedContacts?.pageInfo?.hasNextPage);
    }
    setIsNextPageLoading(false);
  }, [allContacts]);

  useEffect(() => {
    //will also run during initial mount
    setIsNextPageLoading(true);
    getPaginatedContacts({
      variables: {
        search: nameAutInputValue,
      },
    });
  }, [nameAutInputValue]);

  const loadNextPage = async (pageVariables) => {
    setIsNextPageLoading(true);
    fetchMorePaginatedContacts(pageVariables);
    return null;
  };

  useEffect(() => {
    let type = null;
    if (mutationData && mutationData.addOwnerToAParcel) {
      type = { name: "add", success: mutationData.addOwnerToAParcel.success };
    } else if (updateData && updateData.updateParcelOwner) {
      type = { name: "updat", success: updateData.updateParcelOwner.success };
    }

    if (type) {
      if (type.success) {
        dispatch(
          showSuccessMessage(
            nameAutValue && nameAutValue.name
              ? `${nameAutValue.name} was successfully ${type.name}ed`
              : `The owner was successfully ${type.name}ed`
          )
        );

        handleClickDialogClose();
      } else {
        dispatch(showErrorMessage("Error occurred"));
      }

      setStateApp((state) => ({
        ...state,
        universalCircularLoaderAct: false,
      }));
    }
  }, [mutationData, updateData]);

  const emptyStates = () => {
    setNewOwner({
      entity: "Unknown",
      type: "Unknown",
      depthFrom: "",
      depthTo: "",
      interest: "",
      nma: "",
      nra: "",
      customLayer: props.customLayerId,
    });
    setParcelOwnersRadioBValue("true");
    setNameAutValue(null);
    setNameAutInputValue("");
    setSelectedRow(null);
  };

  const handleClickDialogClose = () => {
    props.onClose();
    emptyStates();
  };

  const handleClickAdd = (e) => {
    e.preventDefault();
    if (nameAutValue) {
      const ownerToAdd = { ...newOwner };
      if (parcelOwnersRadioBValue === "true") {
        ownerToAdd.depthFrom = "All depths";
        ownerToAdd.depthTo = "All depths";
      }
      // if (nameAutValue._id === "newEntity") ownerToAdd.name = nameAutValue.name;
      // else ownerToAdd.ownerEntity = nameAutValue._id;
      if (nameAutValue._id && nameAutValue.name) {
        ownerToAdd.ownerEntity = nameAutValue.entity || nameAutValue._id;
        ownerToAdd.name = nameAutValue.name;
      }

      if (selectedRow) {
        ownerToAdd._id = selectedRow._id;
        updateParcelOwner({
          variables: {
            parcelOwner: {
              ...ownerToAdd,
              createBy: stateApp.user.mongoId,
              lastUpdateBy: stateApp.user.mongoId,
            },
          },
          refetchQueries: [
            "getparcelOwners",
            "getContactParcelInterests",
          ],
          awaitRefetchQueries: true,
        });
      } else {
        addOwnerToAParcel({
          variables: {
            parcelOwner: {
              ...ownerToAdd,
              createBy: stateApp.user.mongoId,
              lastUpdateBy: stateApp.user.mongoId,
            }
          },
          refetchQueries: [
            "getCustomLayer",
            // causing timing issue since getCustomLayer also calls this query
            "getparcelOwners",
            "getContactParcelInterests",
          ],
          awaitRefetchQueries: true,
        });
      }

      setStateApp((state) => ({ ...state, universalCircularLoaderAct: true }));
    }
  };

  const classes = useStyles();
  const modalClass = Modals();
  return (
    <div className={classes.move}>
    <React.Fragment>
      <RightDialog
          open={true}
          handleClickDialogClose={()=>{}}
          width={"450px"}
      >
        <DialogTitle id="customized-dialog-title"  style={{fontWeight: 'bold'}}>
          {selectedRow ? "Update" : "Add"} Parcel Ownership
          <IconButton
            style={{ float: 'right'}}
            onClick={props.onClose}
            className={modalClass.titleClose}
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
          {selectedRow &&(
            <IconButton
              style={{ float: 'right', marginRight: "5px"}}
              onClick={() => {props.setM1nSelectedRowsIds([selectedRow._id]); props.handleExpandClick(null, null, null, "deleteParcelOwnership")}}
              className={modalClass.titleClose}
              size="small"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <h3>Name</h3>

              <AutocompEntityNamesVirtualizeList
                mongoEntitiesArray={mongoEntitiesArray}
                setMongoEntitiesArray={setMongoEntitiesArray}
                nameAutValue={nameAutValue}
                setNameAutValue={setNameAutValue}
                nameAutInputValue={nameAutInputValue}
                setNameAutInputValue={setNameAutInputValue}
                hasNextPage={hasNextPage}
                isNextPageLoading={isNextPageLoading}
                loadNextPage={loadNextPage}
                addNew={true}
              />
            </Grid>

            <Grid item xs={12}>
              <h3>Entity</h3>
              <Autocomplete
                options={entities}
                getOptionLabel={(option) => option}
                value={newOwner.entity}
                onChange={(e, newInputValue) => {
                  setNewOwner({
                    ...newOwner,
                    entity: newInputValue ? newInputValue : "",
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    className={classes.maxWidth}
                    multiline
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <h3>Type</h3>

              <Autocomplete
                options={types}
                getOptionLabel={(option) => option}
                value={newOwner.type}
                onChange={(e, newInputValue) => {
                  setNewOwner({
                    ...newOwner,
                    type: newInputValue ? newInputValue : "",
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    className={classes.maxWidth}
                    multiline
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <RadioGroup
                row
                value={parcelOwnersRadioBValue}
                onChange={(event) => {
                  setParcelOwnersRadioBValue(event.target.value);
                }}
              >
                <FormControlLabel
                  value="true"
                  control={<Radio />}
                  label="All Depths"
                />
                <FormControlLabel
                  value="false"
                  control={<Radio />}
                  label="Footages/Formations"
                />
              </RadioGroup>
            </Grid>

            {parcelOwnersRadioBValue === "false" && (
              <Grid item xs={12}>
                <h3>Depth From</h3>
                <TextField
                  size="small"
                  className={classes.maxWidth}
                  multiline
                  value={newOwner.depthFrom}
                  onChange={(e) => {
                    setNewOwner({
                      ...newOwner,
                      depthFrom: e.target.value,
                    });
                  }}
                />
              </Grid>
            )}
            {parcelOwnersRadioBValue === "false" && (
              <Grid item xs={12}>
                <h3>Depth To</h3>
                <TextField
                  size="small"
                  className={classes.maxWidth}
                  multiline
                  value={newOwner.depthTo}
                  onChange={(e) => {
                    setNewOwner({
                      ...newOwner,
                      depthTo: e.target.value,
                    });
                  }}
                />
              </Grid>
            )}

            <Grid item xs={4}>
              <h3>Interest</h3>
              <TextField
                size="small"
                className={classes.maxWidth}
                multiline
                value={newOwner.interest}
                onChange={(e) => {
                  setNewOwner({
                    ...newOwner,
                    interest: e.target.value,
                  });
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <h3>NMA</h3>
              <TextField
                size="small"
                className={classes.maxWidth}
                multiline
                value={newOwner.nma}
                onChange={(e) => {
                  setNewOwner({
                    ...newOwner,
                    nma: e.target.value,
                  });
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <h3>NRA</h3>
              <TextField
                size="small"
                className={classes.maxWidth}
                multiline
                value={newOwner.nra}
                onChange={(e) => {
                  setNewOwner({
                    ...newOwner,
                    nra: e.target.value,
                  });
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className={classes.dialogAction}>
          <Button className={classes.primary} onClick={handleClickDialogClose} color="primary">
            Cancel
          </Button>
          <Button
            className={classes.secondary}
            disabled={
              !nameAutValue || !nameAutValue.name || nameAutValue.name === ""
                ? true
                : false
            }
            onClick={handleClickAdd}
            color="secondary"
          >
            {selectedRow ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </RightDialog>
    </React.Fragment>
    </div>
  );
}
