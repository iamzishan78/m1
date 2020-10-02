import React, { useState, useEffect, useContext } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import uuid from "uuid";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import AddContactDialogContent from "../../../components/Shared/M1nTable/components/SubComponents/AddContactDialogContent";
import { AppContext } from "../../../AppContext";
import { UPDATECONTACT } from "../../../graphQL/useMutationUpdateContact";
import { UPDATETRANSACTION } from "../../../graphQL/useMutationUpdateTransaction";
import { TRANSACTIONDATA } from "../../../graphQL/useQueryTransactionData";
import { CONTACT } from "../../../graphQL/useQueryContact";

const useStyles = makeStyles((theme) => ({
  root: {
    "&  .MuiPaper-root": {
      maxWidth: "400px",
      padding: "25px",
    },
  },
  dialogTitle: {
    textAlign: "center",
  },
  dialogContentText: {
    textAlign: "center",
  },
  inputField: {
    marginBottom: "30px",
  },
  inputFieldDateRoot: {
    "& .MuiDialog-root": {
      zIndex: 99999,
    },
  },
  inputFieldDate: {
    marginBottom: "30px",
    "& .MuiInputBase-input": {
      paddingTop: "10.5px",
      paddingBottom: "10.5px",
    },
  },
  progress: {
    marginLeft: "30px",
    verticalAlign: "middle",
  },
  dialogFooter: { marginTop: "20px", display: "flex", justifyContent: "flex-start" },

  label: {
    backgroundColor: "white",
  },

  closeIcon: {
    color: theme.palette.secondary.main,
  },
}));

const initialErrors = {
  notes: false,
  activityType: false,
  dateTime: false,
};

function AddActivityDialog(props) {
  const classes = useStyles();
  // const { transactData, handleDataChange } = props;
  const [stateApp, setStateApp] = useContext(AppContext);
  // const [title, setTitle] = useState(props.contact ? props.contact.name : ""); // title change from contact.name to dealName
  const [title, setTitle] = useState(""); // title change from contact.name to dealName
  const [label, setLabel] = useState("");
  const [stage, setStage] = useState("");
  const [description, setDescription] = useState("");

  const [openContactDialog, setOpenContactDialog] = useState(false);
  // const [getOwners, { data: dataOwners }] = useLazyQuery(OWNERSQUERY);

  const [getTransactionData, { data: tdata }] = useLazyQuery(TRANSACTIONDATA);

  const [getContact, { data: cData }] = useLazyQuery(CONTACT, {
    fetchPolicy: "cache-and-network",
  });

  const [contact, setContact] = useState({});

  useEffect(() => {
    if (cData?.contact) {
      setContact(
        cData?.contact
          ? { name: cData.contact.name, _id: cData.contact._id }
          : {}
      );
    }
  }, [cData]);

  let [transactData, setTransactData] = useState(
    props.transactData ? { ...props.transactData } : null
  );

  useEffect(() => {
    console.log("TDATAAAAAAAAA : ", tdata?.transactionData?.allData);
    if (tdata?.transactionData?.allData) {
      setTransactData(
        JSON.parse(JSON.stringify(tdata?.transactionData?.allData))
      );
    }
  }, [tdata]);

  const [updateTransaction] = useMutation(UPDATETRANSACTION);

  const openContact = () => {
    handleClose();
    props.selectRowOpenContact(contact);
  };

  const handleDataChange = (newData) => {
    if (tdata?.transactionData?._id) {
      updateTransaction({
        variables: {
          transactionId: tdata.transactionData._id,
          transaction: { allData: newData, user: stateApp.user.mongoId },
        },
        refetchQueries: ["getTransactionData", "getContact", "getContacts"],
        awaitRefetchQueries: true,
      });
    }
  };

  useEffect(() => {
    if (stateApp.user && stateApp.user.mongoId) {
      console.log(stateApp.user);
      getTransactionData({
        variables: {
          userId: stateApp.user.mongoId,
        },
      });
    }
  }, [stateApp.user]);

  useEffect(() => {
    if (props.contactId) {
      getContact({
        variables: {
          contactId: props.contactId,
        },
      });
    }
  }, [props.contactId]);

  useEffect(() => {
    console.log("ACTIVE DEAL: ", stateApp.activeDeal)
    const cardId = stateApp.activeDeal?.cardId || stateApp.activeDeal?.id;
    const laneId = stateApp.activeDeal?.laneId;

    if (transactData && cardId && laneId && stateApp.dealDialog) {
      // best for transact page, auto-fills card with contact details
      const lane = transactData.lanes.find((lane) => lane.id === laneId); // selecting lane
      if (!lane || !lane.cards) return;
      const card = lane.cards.find((card) => card.id === cardId); // selecting card
      if (!card) return;

      setTitle(card.title ? card.title : "");
      setLabel(card.label ? card.label : "");
      setDescription(card.description ? card.description : "");
      setStage(card.laneId ? card.laneId : "lane1");
      if (card.contactId) {
        setContact({ name: card.contactName, _id: card.contactId }); // setting contact
      }
    } else if (props.contact) {
      setContact({ name: props.contact.name, _id: props.contact._id });
    } else if (props.contactId) {
      getContact({
        variables: {
          contactId: props.contactId,
        },
      });
    }
  }, [transactData, stateApp.activeDeal, props.contact, stateApp.dealDialog]);

  // old
  // useEffect(() => {
  //   if (contact?._id) {
  //     setTitle(contact.name);
  //   }
  // }, [contact]);

  const handleClose = () => {
    setTitle("");
    setLabel("");
    setDescription("");
    setStage("");
    // setContact({});
    setStateApp((stateApp) => ({
      ...stateApp,
      dealDialog: false,
    }));
  };

  const handleCloseContactDialog = () => {
    setOpenContactDialog(false);
  };

  const handleUpdate = () => {
    // if (title.trim() !== "" && description.trim() !== "") {

    let newStage = stage ? stage : "lane1";
    if (transactData) {
      const cardId = stateApp.activeDeal?.cardId || stateApp.activeDeal?.id;
      const laneId = stateApp.activeDeal?.laneId;
      if (cardId && laneId) {
        // update existing
        const laneIndex = transactData.lanes.findIndex(
          (lane) => lane.id === laneId
        );
        const lane = transactData.lanes[laneIndex];
        const cardIndex = lane.cards.findIndex((card) => card.id === cardId);
        const card = lane.cards[cardIndex];

        const updatedCard = {
          // dealName: dealName.trim(),
          // title: contact?.name.trim(),
          contactName: contact?.name ? contact.name.trim() : "",
          title: title ? title.trim() : "",
          label: label ? label.trim() : "",
          description: description ? description.trim() : "",
          laneId: newStage,
          contactId: contact?._id ? contact._id : uuid(),
          id: card.id,
        };

        if (card.laneId !== newStage) {
          if (cardIndex > -1) {
            // remove card from current lane
            let td = { ...transactData };
            td.lanes[laneIndex].cards.splice(cardIndex, 1);
            // add card to updated lane
            const stageIndex = td.lanes.findIndex(
              (lane) => lane.id === newStage
            );
            td.lanes[stageIndex].cards.push(updatedCard);
            setTransactData(td);
          }
        } else {
          let td = { ...transactData };

          td.lanes[laneIndex].cards[cardIndex] = updatedCard;
          setTransactData(td);
        }
      } else if (!cardId && !laneId) {
        // add new

        let td = { ...transactData };
        console.log(td, transactData, stateApp.user.mongoId);

        td.lanes.forEach((lane) => {
          if (lane.id === newStage) {
            let cards = [...lane.cards];
            const newCard = {
              // dealName: dealName.trim(),
              // title: contact?.name,
              contactName: contact?.name ? contact.name.trim() : "",
              title: title ? title.trim() : "",
              label: label ? label.trim() : "",
              description: description ? description.trim() : "",
              id: uuid(),
              contactId: contact?._id ? contact._id : uuid(),
              laneId: newStage,
            };
            cards.push(newCard);
            lane.cards = cards;
          }
        });

        setTransactData(td);
      }

      handleClose();
    }
  };

  useEffect(() => {
    if (tdata?.transactionData?.allData) {
      handleDataChange(transactData);
    }
  }, [transactData]);

  return (
    <div style={{ padding: "30px" }}>
      {/* <h4 style={{ margin: "0 0 30px 0", fontSize: "16px" }}>
        Recent Activities
      </h4> */}
      <Grid item xs={12} style={{ minHeight: "35px" }}>
        <h4 style={{ margin: "0 0 30px 0", float: "left" }}>
          Add Deal
        </h4>

        <IconButton
          onClick={props.onClose}
          size="small"
          style={{ float: "right", top: "-5px", right: "-5px" }}
        >
          <CloseIcon className={classes.closeIcon} fontSize="small" />
        </IconButton>
      </Grid>
      <div className={classes.inputFieldDateRoot}>
        <TextField
          margin="dense"
          value={title}
          label="Deal Name"
          fullWidth
          //   required
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <Dialog
          className={classes.dialog}
          open={openContactDialog ? true : false}
          onClose={handleCloseContactDialog}
          maxWidth={"xs"}
        >
          <AddContactDialogContent
            onClose={handleCloseContactDialog}
            dealsPage={true}
            setDealsContact={setContact}
          />
        </Dialog>

        <FormControl margin="dense" fullWidth size="small">
          {/* <InputLabel
            id="demo-simple-select-outlined-label"
            className={classes.label}
          >
            Contact Name
          </InputLabel> */}

          {!(
            (Object.keys(contact).length === 0 &&
              contact.constructor === Object) ||
            contact === null
          ) && (
            <TextField
              margin="dense"
              value={contact?.name}
              label=""
              fullWidth
              disabled
            />
          )}

          <ButtonGroup
            fullWidth
            variant="contained"
            color="primary"
            aria-label="contained primary button group"
          >
            <Button onClick={() => setOpenContactDialog(true)}>
              Add / Select Contact
            </Button>

            {contact && (
              <Button
                disabled={
                  (Object.keys(contact).length === 0 &&
                    contact.constructor === Object) ||
                  contact === null
                }
                onClick={() => openContact()}
              >
                View Contact
              </Button>
            )}
          </ButtonGroup>
        </FormControl>

        <FormControl margin="dense" fullWidth size="small">
          <InputLabel
            id="demo-simple-select-outlined-label"
            className={classes.label}
          >
            Deal Stage
          </InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={stage}
            onChange={(e) => {
              console.log("Stage: ", e.target.value);
              setStage(e.target.value);
            }}
            fullWidth
            label="Deal Stage"
          >
            <MenuItem value={"lane1"}>Offer Preparation</MenuItem>
            <MenuItem value={"lane2"}>Offer Extended</MenuItem>
            <MenuItem value={"lane3"}>Accepted - Due Diligence</MenuItem>
            <MenuItem value={"lane4"}>Deal Closed</MenuItem>
            <MenuItem value={"lane5"}>Offer Rejected</MenuItem>
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          value={label}
          label="Offer Price"
          fullWidth
          onChange={(e) => {
            setLabel(e.target.value);
          }}
          // InputProps={{
          //   inputComponent: NumberFormatCustom,
          // }}
        />
        <TextField
          //   autoFocus
          margin="dense"
          value={description}
          label="Offer Details"
          fullWidth
          multiline
          //   required
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />

        <div className={classes.dialogFooter}>
          <Button
            variant="contained"
            color="secondary"
            size="medium"
            disableElevation
            onClick={handleUpdate}
            style={{ margin: "0px 20px 0px 0px" }}
          >
            Save
          </Button>
          <Button
            variant="contained"
            color="default"
            size="medium"
            disableElevation
            onClick={handleClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AddActivityDialog;
