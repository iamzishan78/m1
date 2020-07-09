import React, { useContext, useState, useEffect } from "react";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import { Grid } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { CONTACTSQUERY } from "../../../../../graphQL/useQueryContacts";
import { CONTACTSBYOWNERSID } from "../../../../../graphQL/useQueryContactsByOwnerId";
import { ADDCONTACT } from "../../../../../graphQL/useMutationAddContact";
import { ADDREMOVEOWNERTOACONTACT } from "../../../../../graphQL/useMutationAddRemoveOwnerToAContact";
import Taps from "../../../Taps";
import CircularProgress from "@material-ui/core/CircularProgress";
import { AppContext } from "../../../../../AppContext";

const phonenumber = (inputtxt) => {
  if (inputtxt.match(/^([0-9]||-|\(|\)|\.|,)+$/) !== null) {
    return true;
  } else {
    return false;
  }
};
const email = (inputtxt) => {
  if (
    inputtxt.match(/^(([0-9a-zA-Z]|\.)+@?[0-9a-zA-Z]*\.?[0-9a-zA-Z]*)?$/) !==
    null
  ) {
    return true;
  } else {
    return false;
  }
};

const zipCopde = (inputtxt) => {
  if (inputtxt.match(/^([0-9]+-?[0-9]*)?$/) !== null) {
    return true;
  } else {
    return false;
  }
};

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
  dialogTitle: {
    paddingBottom: (dataContacts) => (dataContacts ? "55px" : "16px"),
  },
}));

export default function AddContactDialogContent(props) {
  const [stateApp] = React.useContext(AppContext);
  const [validated, setValidated] = useState(false);
  const [activeTapIndex, setActiveTapIndex] = useState(0);
  const [contacts, setContacts] = useState([]);
  const [existingContact, setExistingContact] = useState({ name: "" });
  const [newContact, setNewContact] = useState({
    name: "",
    mobilePhone: "",
    homePhone: "",
    primaryEmail: "",
    address1: "",
    address2: "",
    city: "",
    country: "",
    state: "",
    zip: "",
    owners: props.parent ? [props.parent] : [],
  });
  const [
    getContacts,
    { loading: loadingContacts, data: dataContacts },
  ] = useLazyQuery(CONTACTSQUERY, {
    fetchPolicy: "cache-and-network",
  });
  const [
    getContactsByOwnerId,
    { loading: loadingContactsByOwnerId, data: dataContactsByOwnerId },
  ] = useLazyQuery(CONTACTSBYOWNERSID, {
    fetchPolicy: "cache-and-network",
  });
  const [addContact] = useMutation(ADDCONTACT);
  const [addRemoveOwnerToAContact] = useMutation(ADDREMOVEOWNERTOACONTACT);

  useEffect(() => {
    if (props.parent || props.setDealsContact) {
      getContacts();
    }
  }, [props.parent, props.setDealsContact]);

  useEffect(() => {
    if (props.parent) {
      getContactsByOwnerId({
        variables: { objectId: props.parent },
      });
    }
  }, [props.parent]);

  useEffect(() => {
    if (
      dataContacts &&
      dataContacts.contacts &&
      dataContacts.contacts.length > 0
    ) {
      if (
        dataContactsByOwnerId &&
        dataContactsByOwnerId.contactsByOwnerId &&
        dataContactsByOwnerId.contactsByOwnerId.length > 0
      ) {
        const tempIdArray = dataContactsByOwnerId.contactsByOwnerId.map(
          (cont) => cont._id
        );

        setContacts([
          ...dataContacts.contacts.filter(
            (cont) => tempIdArray.indexOf(cont._id) === -1
          ),
        ]);
      } else {
        setContacts([...dataContacts.contacts]);
      }
    }
  }, [dataContacts, dataContactsByOwnerId]);

  useEffect(() => {
    if (
      (activeTapIndex === 1 && existingContact.name !== "") ||
      (activeTapIndex === 0 && newContact.name.trim() !== "")
    ) {
      setValidated(true);
    } else {
      setValidated(false);
    }
  }, [activeTapIndex, existingContact, newContact.name]); ///////////add other inputs

  useEffect(() => {
    emptyStates();
  }, [activeTapIndex]);

  const emptyStates = () => {
    setExistingContact({ name: "" });
    setNewContact({
      ...newContact,
      name: "",
      mobilePhone: "",
      homePhone: "",
      primaryEmail: "",
      address1: "",
      address2: "",
      city: "",
      country: "",
      state: "",
      zip: "",
    });
  };

  const handleClickDialogClose = (e) => {
    e.preventDefault();
    props.onClose();
    setActiveTapIndex(0);
    emptyStates();
  };

  const handleClickAdd = (e) => {
    e.preventDefault();

    if (props.dealsPage) {
      if (activeTapIndex === 0) {
        addContact({
          variables: {
            contact: {
              ...newContact,
              createBy: stateApp.user.mongoId,
              lastUpdateBy: stateApp.user.mongoId,
            },
          },
          refetchQueries: ["getContacts"],
          awaitRefetchQueries: true,
        });
        props.setDealsContact(newContact);
      } else if (activeTapIndex === 1) {
        props.setDealsContact(existingContact);
      }
      handleClickDialogClose(e);
      return;
    }

    if (props.parent && activeTapIndex === 1) {
      //////update///// existingContact   //////////

      addRemoveOwnerToAContact({
        variables: {
          contactId: existingContact._id,
          ownerId: props.parent,
        },
        refetchQueries: [
          "getContacts",
          "getContactsByOwnerId",
          "getContactsCounter",
          "getContact",
        ],
        awaitRefetchQueries: true,
      });
    }

    if (!props.parent || (props.parent && activeTapIndex === 0)) {
      //////add new///// newContact ////////////
      addContact({
        variables: {
          contact: {
            ...newContact,
            createBy: stateApp.user.mongoId,
            lastUpdateBy: stateApp.user.mongoId,
          },
        },
        refetchQueries: [
          "getContacts",
          "getContactsByOwnerId",
          "getContactsCounter",
          "getContact",
        ],
        awaitRefetchQueries: true,
      });
    }

    handleClickDialogClose(e);
  };

  const selectExisting = () => {
    return (
      <React.Fragment>
        {!loadingContacts && !loadingContactsByOwnerId ? (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Autocomplete
                size="small"
                className={classes.maxWidth}
                style={{ minWidth: "325.6px" }}
                options={contacts}
                getOptionLabel={(option) =>
                  option && option.name ? option.name : option ? option : ""
                }
                autoComplete
                autoSelect
                disableClearable
                includeInputInList
                value={existingContact.name}
                disabled={!contacts || contacts.length === 0}
                onChange={(e, newValue) => {
                  setExistingContact(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Contacts"
                    variant="outlined"
                    fullWidth
                    multiline
                  />
                )}
              />
            </Grid>
          </Grid>
        ) : (
          <CircularProgress size={40} disableShrink color="secondary" />
        )}
      </React.Fragment>
    );
  };

  const addNew = () => {
    return (
      <React.Fragment>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              size="small"
              className={classes.maxWidth}
              label="Name"
              multiline
              variant="outlined"
              value={newContact.name}
              onChange={(e) => {
                setNewContact({
                  ...newContact,
                  name: e.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              size="small"
              className={classes.maxWidth}
              label="Mobile Phone"
              multiline
              variant="outlined"
              value={newContact.mobilePhone}
              onChange={(e) => {
                if (phonenumber(e.target.value)) {
                  setNewContact({
                    ...newContact,
                    mobilePhone: e.target.value,
                  });
                }
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              size="small"
              className={classes.maxWidth}
              label="Home Phone"
              multiline
              variant="outlined"
              value={newContact.homePhone}
              onChange={(e) => {
                if (phonenumber(e.target.value)) {
                  setNewContact({
                    ...newContact,
                    homePhone: e.target.value,
                  });
                }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              size="small"
              className={classes.maxWidth}
              label="Email"
              multiline
              variant="outlined"
              value={newContact.primaryEmail}
              onChange={(e) => {
                if (email(e.target.value)) {
                  setNewContact({
                    ...newContact,
                    primaryEmail: e.target.value,
                  });
                }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              size="small"
              className={classes.maxWidth}
              label="Address 1"
              multiline
              variant="outlined"
              value={newContact.address1}
              onChange={(e) => {
                setNewContact({
                  ...newContact,
                  address1: e.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              size="small"
              className={classes.maxWidth}
              label="Address 2"
              multiline
              variant="outlined"
              value={newContact.address2}
              onChange={(e) => {
                setNewContact({
                  ...newContact,
                  address2: e.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              size="small"
              className={classes.maxWidth}
              label="City"
              multiline
              variant="outlined"
              value={newContact.city}
              onChange={(e) => {
                setNewContact({
                  ...newContact,
                  city: e.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              size="small"
              className={classes.maxWidth}
              label="State"
              multiline
              variant="outlined"
              value={newContact.state}
              onChange={(e) => {
                setNewContact({
                  ...newContact,
                  state: e.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              size="small"
              className={classes.maxWidth}
              label="Zip Code"
              multiline
              variant="outlined"
              value={newContact.zip}
              onChange={(e) => {
                if (zipCopde(e.target.value)) {
                  setNewContact({
                    ...newContact,
                    zip: e.target.value,
                  });
                }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              size="small"
              className={classes.maxWidth}
              label="Country"
              multiline
              variant="outlined"
              value={newContact.country}
              onChange={(e) => {
                setNewContact({
                  ...newContact,
                  country: e.target.value,
                });
              }}
            />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  };

  const whichTapIsActive = (index) => {
    setActiveTapIndex(index);
  };

  const classes = useStyles(contacts && contacts.length > 0 ? true : false);

  return !loadingContacts && !loadingContactsByOwnerId ? (
    <React.Fragment>
      <DialogTitle
        id="alert-dialog-slide-title"
        className={classes.dialogTitle}
      >
        Add a Contact
      </DialogTitle>
      <DialogContent dividers className={classes.dialogContent}>
        {contacts && contacts.length > 0 ? (
          <Taps
            tabLabels={["Add New", "Select Existing"]}
            tabPanels={[addNew(), selectExisting()]}
            whichTapIsActive={whichTapIsActive}
            backgroundColor="#fff"
          />
        ) : (
          addNew()
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClickDialogClose} color="primary">
          Cancel
        </Button>
        <Button
          disabled={!validated}
          onClick={handleClickAdd}
          color="secondary"
        >
          Add
        </Button>
      </DialogActions>
    </React.Fragment>
  ) : (
    <div style={{ padding: "15px" }}>
      <CircularProgress size={80} disableShrink color="secondary" />
    </div>
  );
}
