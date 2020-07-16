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
  const { transactData, handleDataChange } = props;
  const [stateApp, setStateApp] = useContext(AppContext);
  // const [title, setTitle] = useState(props.contact ? props.contact.name : ""); // title change from contact.name to dealName
  const [title, setTitle] = useState(""); // title change from contact.name to dealName
  const [label, setLabel] = useState("");
  const [stage, setStage] = useState("");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState(
    props.contact ? { name: props.contact.name, _id: props.contact._id } : {}
  );
  const [openContactDialog, setOpenContactDialog] = useState(false);

  useEffect(() => {
    const cardId = stateApp.activeDeal?.cardId;
    const laneId = stateApp.activeDeal?.laneId;

    if (transactData && cardId && laneId && stateApp.dealDialog) {
      const lane = transactData.lanes.find((lane) => lane.id === laneId);
      console.log("LANE SETTING: ", lane);
      if (!lane || !lane.cards) return;
      const card = lane.cards.find((card) => card.id === cardId);
      console.log("CARD SETTING: ", card);
      if (!card) return;

      setTitle(card.title ? card.title : "");
      setLabel(card.label ? card.label : "");
      setDescription(card.description ? card.description : "");
      setStage(card.laneId ? card.laneId : "lane1");
      if (card.contactId) {
        console.log("SETTING CONTACT: ", card.title);
        setContact({ name: card.contactName, _id: card.contactId });
      }
    } else if (props.contact) {
      setContact({ name: props.contact.name, _id: props.contact._id });
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
    setContact({});
    setStateApp((stateApp) => ({
      ...stateApp,
      dealDialog: false,
    }));
  };

  const handleCloseContactDialog = () => {
    console.log("Handle close dialog");
    setOpenContactDialog(false);
  };

  const handleUpdate = () => {
    // if (title.trim() !== "" && description.trim() !== "") {

    let newStage = stage ? stage : "lane1";
    if (transactData) {
      const cardId = stateApp.activeDeal?.cardId;
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
          contactId: contact?._id,
          id: card.id,
        };

        if (card.laneId !== newStage) {
          if (cardIndex > -1) {
            // remove card from current lane
            transactData.lanes[laneIndex].cards.splice(cardIndex, 1);
            // add card to updated lane
            const stageIndex = transactData.lanes.findIndex(
              (lane) => lane.id === newStage
            );
            transactData.lanes[stageIndex].cards.push(updatedCard);
          }
        } else {
          transactData.lanes[laneIndex].cards[cardIndex] = updatedCard;
        }
      } else if (cardId === null && laneId === null) {
        // add new

        transactData.lanes.forEach((lane) => {
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
              contactId: contact?._id,
              laneId: newStage,
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

  return (
    <Dialog
      open={stateApp.dealDialog ? stateApp.dealDialog : false}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle id="form-dialog-title">Deal Information</DialogTitle>
      <DialogContent>
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
                  contact === null
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
