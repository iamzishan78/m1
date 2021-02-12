import React, { useState, useContext, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { useLazyQuery, useMutation } from "@apollo/client";
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
import { OWNERSQUERY } from "../../../graphQL/useQueryOwners";
import { CONTACT } from "../../../graphQL/useQueryContact";

import { UPDATETRANSACTION } from "../../../graphQL/useMutationUpdateTransaction";
import { TRANSACTIONDATA } from "../../../graphQL/useQueryTransactionData";

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
        refetchQueries: [
          "getTransactionData",
          "getContact",
          "getPaginatedContacts"
        ],
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
    const cardId = stateApp.activeDeal?.cardId;
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
    setContact({});
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
    <Dialog
      open={false}
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
