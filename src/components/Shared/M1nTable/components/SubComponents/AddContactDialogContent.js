import React, { useContext, useState, useEffect } from "react";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import Taps from "../../../Taps";
import CircularProgress from "@material-ui/core/CircularProgress";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { Grid } from "@material-ui/core";
import { AppContext } from "../../../../../AppContext";
import { Modals } from "../../../../../styles/Modal";
import { useLazyQuery, useMutation } from "@apollo/client";
import { PAGINATEDCONTACTSQUERY } from "../../../../../graphQL/useQueryPaginatedContacts";
import { ADDCONTACT } from "../../../../../graphQL/useMutationAddContact";
import { makeStyles } from "@material-ui/core/styles";
import RightDialog from "../../../../ContactDetailCard/components/RightDialog";
import { GETMONGOUSERS } from "../../../../../graphQL/useQueryGetUsers";

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
    margin: '0 8px 25px 8px',
    flex:'none'
  },
  dialogTitle: {
    paddingBottom: (dataContacts) => (dataContacts ? "55px" : "16px"),
  },
  dialogFooter: {
    display: "flex",
    justifyContent: "flex-end",
    paddingTop: "10px",
    margin:'0 28px 15px 0',
  },
  footerButton: {
    letterSpacing: "1px",
    textTransform: "capitalize",
    fontWeight: "bold",
    padding: "8px 20px",
    width:'120px'
  },
  closeIcon: {
		color: theme.palette.secondary.main,
	},
}));

export default function AddContactDialogContent(props) {
  const [stateApp] = React.useContext(AppContext);
  const [validated, setValidated] = useState(false);
  const [activeTapIndex, setActiveTapIndex] = useState(0);
  const [contacts, setContacts] = useState([]);
  const [users, setUsers] = useState([]);
  const [existingContact, setExistingContact] = useState({ name: "" });
  const [newContact, setNewContact] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    mobilePhone: "",
    homePhone: "",
    primaryEmail: "",
    address1: "",
    address2: "",
    city: "",
    country: "",
    state: "",
    zip: "",
    contactOwner: ""
    // owners: props.parent ? [props.parent] : [],
  });

  const [
    getPaginatedContacts,
    { loading: loadingContacts, data: dataContacts },
  ] = useLazyQuery(PAGINATEDCONTACTSQUERY, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  const [getAllMongoUsers, { data: userLists }] = useLazyQuery(GETMONGOUSERS, {
    fetchPolicy: "cache-and-network",
  });

  const [
    addContact,
    {
      data: addContactData,
      called: addContactCalled,
      loading: addContactLoading,
    },
  ] = useMutation(ADDCONTACT);

  //// comented after scale to more than 100 000 contacts
  // useEffect(() => {
  //   if (props.parent || props.setDealsContact) {
  //     getPaginatedContacts();
  //   }
  // }, [props.parent, props.setDealsContact]);

  // useEffect(() => {
  //   if (
  //     dataContacts &&
  //     dataContacts.contacts &&
  //     dataContacts.contacts.length > 0
  //   ) {
  //     setContacts([...dataContacts.contacts]);
  //   }
  // }, [dataContacts]);

  useEffect(() => {
    if (
      (activeTapIndex === 1 && existingContact.name !== "") ||
      (activeTapIndex === 0 && newContact.firstName.trim() !== "" && newContact.lastName.trim() !== "")
      //   &&
      // !validated
    ) {
      setValidated(true);
    } else {
      setValidated(false);
    }
  }, [activeTapIndex, existingContact, newContact.firstName, newContact.lastName]); ///////////add other inputs

  useEffect(() => {
    emptyStates();
  }, [activeTapIndex]);

  useEffect(() => {
    getAllMongoUsers();
  }, []);

  useEffect(() => {
    if (userLists && userLists.allMongoUsers) {
      setUsers(
        userLists.allMongoUsers.map((user) => ({
          value: user._id,
          text: user.name
        }))
      );
    }
  }, [userLists]);

  const emptyStates = () => {
    setExistingContact({ name: "" });
    setNewContact({
      ...newContact,
      firstName: "",
      middleName: "",
      lastName: "",
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

  useEffect(() => {
    if (addContactData && addContactCalled && !addContactLoading) {
      if (props.dealsPage) {
        props.setDealsContact(addContactData.addContact.contact);
        props.onClose();
        setActiveTapIndex(0);
        emptyStates();
      }
    }
  }, [addContactData, addContactCalled, addContactLoading]);

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
          refetchQueries: [
            "getPaginatedContacts",
            "getContact",
          ],
          awaitRefetchQueries: true,
        });
        e.preventDefault();
      } else if (activeTapIndex === 1) {
        props.setDealsContact(existingContact);
        handleClickDialogClose(e);
      }
      return;
    }

    // if (props.parent && activeTapIndex === 1) {
    //   //////update///// existingContact   //////////

    // }

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
        refetchQueries: ["getPaginatedContacts", "getContact"],
        awaitRefetchQueries: true,
      });
    }

    handleClickDialogClose(e);
  };

  const selectExisting = () => {
    return (
      <React.Fragment>
        <div style={{ paddingTop: "15%" }}>
          {!loadingContacts ? (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Autocomplete
                  size="small"
                  className={classes.maxWidth}
                  style={{ minWidth: "325.6px" }}
                  options={contacts}
                  getOptionLabel={(option) =>
                    option && option.name
                      ? option.name
                      : typeof option === "string"
                        ? option
                        : ""
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
        </div>
      </React.Fragment>
    );
  };

  const addNew = () => {
    return (
      <React.Fragment>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <h3>First Name</h3>
            <TextField
              size="small"
              className={classes.maxWidth}
              multiline
              value={newContact.firstName}
              onChange={(e) => {
                setNewContact({
                  ...newContact,
                  firstName: e.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <h3>Middle Name</h3>
            <TextField
              size="small"
              className={classes.maxWidth}
              multiline
              value={newContact.middleName}
              onChange={(e) => {
                setNewContact({
                  ...newContact,
                  middleName: e.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <h3>Last Name</h3>
            <TextField
              size="small"
              className={classes.maxWidth}
              multiline
              value={newContact.lastName}
              onChange={(e) => {
                setNewContact({
                  ...newContact,
                  lastName: e.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <h3>Mobile Phone</h3>
            <TextField
              size="small"
              //placeholder="E.g. xxx-xxx-xxxx"
              className={classes.maxWidth}
              multiline
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
            <h3>Home Phone</h3>
            <TextField
              size="small"
              // placeholder="E.g. xxx-xxx-xxxx"
              className={classes.maxWidth}
              multiline
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
            <h3>Email</h3>
            <TextField
              size="small"
              // placeholder="E.g. jacob@m1neral.com"
              className={classes.maxWidth}
              multiline
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
            <h3>Address #1</h3>
            <TextField
              size="small"
              className={classes.maxWidth}
              multiline
              autoComplete="nope"
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
            <h3>Address #2</h3>
            <TextField
              size="small"
              className={classes.maxWidth}
              multiline
              autoComplete="nope"
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
            <h3>City</h3>
            <TextField
              size="small"
              className={classes.maxWidth}
              multiline
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
            <h3>State</h3>
            <TextField
              size="small"
              className={classes.maxWidth}
              multiline
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
            <h3>Zip Code</h3>
            <TextField
              size="small"
              className={classes.maxWidth}
              multiline
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
            <h3>Country</h3>
            <TextField
              size="small"
              className={classes.maxWidth}
              multiline
              value={newContact.country}
              onChange={(e) => {
                setNewContact({
                  ...newContact,
                  country: e.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <h3>Contact Owner</h3>
            <Autocomplete
              className={classes.fieldWidth}
              options={users.filter(u => u.text)}
              onChange={(e, user) => { setNewContact({ ...newContact, contactOwner: user.value }); }}
              value={users.find((user) => user?.value === newContact.contactOwner) || null}
              getOptionLabel={(option) => option.text}
              getOptionSelected={(option) => option.value === newContact.contactOwner}
              renderInput={(params) => (
                <TextField size="small" {...params} className={classes.maxWidth} multiline value={newContact.contactOwner} />
              )}
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
  const modalClass = Modals();

  return !loadingContacts ? (
    <>
      <RightDialog
        open={true}
        handleClickDialogClose={handleClickDialogClose}
        width="450px"
      >
        <Grid item xs={12} style={{ minHeight: "35px",padding: 22 }}>
        <h4
              style={{
                margin: "0 0 15px 0",
                float: "left",
                fontSize: "1.4rem",
              }}
            >
               Add New Contact
          </h4>
					<div style={{ float: "right" }}>
							<IconButton
									onClick={props.onClose}
									size="small"
								>
									<CloseIcon className={classes.closeIcon} fontSize="small" />
							</IconButton>
					</div>
          
      </Grid>
      <DialogContent className={classes.dialogContent}>
        
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
      <div className={classes.dialogFooter}>
        <Button 
        onClick={handleClickDialogClose} 
        color="default"
        size="medium"
        variant="contained"
        className={classes.footerButton}
        style={{
          margin: "0px 15px 0px 0px",
        }}
        >
          Cancel
        </Button>
        <Button
          disabled={!validated}
          onClick={handleClickAdd}
          variant="contained"
          color="secondary"
          className={classes.footerButton}
          size="medium"
        >
          Add
        </Button>
      </div>
      </RightDialog>
    </>
  ) : (
      <div style={{ padding: "15px" }}>
        <CircularProgress size={80} disableShrink color="secondary" />
      </div>
    );
}
