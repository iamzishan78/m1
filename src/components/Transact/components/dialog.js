import React, { useState, useContext, useEffect } from "react";
import uuid from "uuid";
import NumberFormat from "react-number-format";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import DialogContent from "@material-ui/core/DialogContent";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { TransactContext } from "../TransactContext";
import { AppContext } from "../../../AppContext";
import AddContactDialogContent from "../../Shared/M1nTable/components/SubComponents/AddContactDialogContent";

const useStyles = makeStyles((theme) => ({
  label: {
    backgroundColor: "white",
  },
}));

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
      prefix="$"
    />
  );
}

export default function TransactDialog(props) {
  const classes = useStyles();
  const { cardId, laneId, transactData, handleDataChange } = props;
  const [stateApp] = useContext(AppContext);
  const [stateTransact, setStateTransact] = useContext(TransactContext);
  const [dealName, setDealName] = useState("");
  const [title, setTitle] = useState(props.contact ? props.contact.name : "");
  const [label, setLabel] = useState("");
  const [stage, setStage] = useState("");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState(
    props.contact ? { name: props.contact.name, _id: props.contact._id } : {}
  );
  const [openContactDialog, setOpenContactDialog] = useState(false);
  console.log("Contact dialog.js: ", contact);


  useEffect(() => {
    console.log("TRANSACT DATA ON MOUNT: ", transactData);
    console.log("CARD ID MOUNT: ", cardId);
    console.log("LANE ID MOUNT: ", laneId);
    if (transactData && cardId && laneId && stateTransact.openDialog) {
      const lane = transactData.lanes.find((lane) => lane.id === laneId);
      console.log("LANE SETTING: ", lane);
      if (!lane || !lane.cards) return;
      const card = lane.cards.find((card) => card.id === cardId);
      console.log("CARD SETTING: ", card);
      if (!card) return;

      setDealName(card.dealName ? card.dealName : "");
      setLabel(card.label ? card.label : "");
      setDescription(card.description ? card.description : "");
      setStage(card.laneId ? card.laneId : "lane1");
      if (card.contactId) {
        console.log("SETTING CONTACT: ", card.title);
        setContact({ name: card.title, _id: card.contactId });
      }
    } else if (props.contact) {
      setContact({ name: props.contact.name, _id: props.contact._id });
    }
  }, [
    transactData,
    cardId,
    laneId,
    props.contact,
    stateTransact.openDialog,
    props.openDeals,
  ]);

  useEffect(() => {
    if (contact?._id) {
      setTitle(contact.name);
    }
  }, [contact]);

  const handleClose = () => {
    setDealName("");
    setTitle("");
    setLabel("");
    setDescription("");
    setStage("");
    setContact({});
    if (
      props.handleCloseDeals !== null &&
      props.handleCloseDeals !== undefined
    ) {
      props.handleCloseDeals();
    }
    setStateTransact((stateTransact) => ({
      ...stateTransact,
      openDialog: false,
    }));
  };

  const handleCloseContactDialog = () => {
    console.log("Handle close dialog");
    setOpenContactDialog(false);
  };

  const handleUpdate = () => {
    // if (title.trim() !== "" && description.trim() !== "") {

    console.log("ADDING");
    console.log("ttransactData", transactData);
    console.log(cardId, laneId);

    if (transactData) {
      if (cardId && laneId) {
        // update existing

        // BUG: if we change laneId/Stage, card won't move to different lane
        // To fix: Manually delete card from lane and re-insert in appropriate lane

        transactData.lanes.forEach((lane) => {
          if (lane.id === laneId) {
            lane.cards.forEach((card) => {
              if (card.id === cardId) {
                card.dealName = dealName.trim();
                card.title = contact?.name;
                card.label = label.trim();
                card.description = description.trim();
                card.laneId = stage;
                card.contactId = contact?._id;
              }
            });
          }
        });
      } else if (cardId === null && laneId === null) {
        // add new

        transactData.lanes.forEach((lane) => {
          if (lane.id === stage) {
            let cards = [...lane.cards];
            const newCard = {
              dealName: dealName.trim(),
              title: contact?.name,
              label: label.trim(),
              description: description.trim(),
              id: uuid(),
              contactId: contact?._id,
              laneId: stage
            };
            cards.push(newCard);
            lane.cards = cards;
          }
        });
      }
      handleDataChange(transactData);

      handleClose();
    }
  };

  console.log("OPEN: ", stateTransact?.openDialog);
  return (
    <Dialog
      open={stateTransact.openDialog || props.openDeals}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle id="form-dialog-title">Deal Information</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          value={dealName}
          label="Deal Name"
          fullWidth
          //   required
          onChange={(e) => {
            setDealName(e.target.value);
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
            contact === null ||
            title === ""
          ) && (
            <TextField
              margin="dense"
              value={contact?.name}
              label=""
              fullWidth
              disabled
            />
          )}

          {!props.contact && (
            <ButtonGroup
              fullWidth
              variant="contained"
              color="primary"
              aria-label="contained primary button group"
            >
              <Button onClick={() => setOpenContactDialog(true)}>
                Add / Select Contact
              </Button>

              <Button
                component="a"
                href="http://www.google.com"
                target="_blank"
                disabled={
                  (Object.keys(contact).length === 0 &&
                    contact.constructor === Object) ||
                  contact === null ||
                  title === ""
                }
              >
                View Contact
              </Button>
            </ButtonGroup>
          )}
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
            <MenuItem value={"lane1"}>Offer Preperation</MenuItem>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleUpdate} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
