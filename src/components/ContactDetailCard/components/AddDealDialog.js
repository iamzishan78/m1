import React, { useState, useEffect, useContext, useRef } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import uuid from "uuid";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import { AppContext } from "../../../AppContext";
import { UPDATETRANSACTION } from "../../../graphQL/useMutationUpdateTransaction";
import { TRANSACTIONDATA } from "../../../graphQL/useQueryTransactionData";
import { CONTACT } from "../../../graphQL/useQueryContact";
import { ADDCONTACT } from "../../../graphQL/useMutationAddContact";
import getLaneTitle from "../../Transact/getLaneTitle";
import AutocompEntityNamesVirtualizeList from "../../Shared/M1nTable/components/SubComponents/AutocompEntityNamesVirtualizeList";
import { ALLENTITYNAMESFORPARCEL } from "../../../graphQL/useQueryAllEntityNamesToAddAsParcelOwner";
import { PAGINATEDCONTACTSQUERY } from "../../../graphQL/useQueryPaginatedContacts";
import { GETUSERS } from "../../../graphQL/useQueryGetUsers";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { CircularProgress, Typography } from "@material-ui/core";
import RightDialog from "./RightDialog";
import { DatePicker } from "@material-ui/pickers";

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
  dateLabel: {
    transform: "translate(10px, 2px) scale(0.75) !important",
    backgroundColor: "#fff !important",
    padding: "0 6px",
  },
  shrinkLabel: {
    backgroundColor: "#fff !important",
    padding: "0 6px",
  },
  inputFieldDateRoot: {
    "& .MuiDialog-root": {
      // zIndex: 99999,
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
  dialogFooter: {
    display: "flex",
    justifyContent: "flex-end",
  },
  footerButton: {
    letterSpacing: "1px",
    textTransform: "capitalize",
    fontWeight: "bold",
    padding: "8px 35px",
  },

  label: {
    backgroundColor: "white",
  },

  closeIcon: {
    color: theme.palette.secondary.main,
  },

  topBtnGroup: {},
  inputField: {
    marginBottom: "30px",
    outline: "none",
  },
  dealStateOpen: {
    padding: "8px 16px",
    borderRadius: 5,
    cursor: "pointer",
    backgroundColor: "#d9d9d9",
  },
  dealStateClosed: {
    padding: "8px 16px",
    borderRadius: 18,
    color: "#fff",
  },
  dealStateReopen: {
    padding: "2px 10px",
    cursor: "pointer",
    borderRadius: 5,
    border: "1px solid gray",
  },
}));

const newContact = {
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
};
const wonStyle = { borderColor: "#35DA97" };
const lostStyle = { borderColor: "#F74E1E" };
const defaultStyle = { borderColor: "#e2e2e2" };
const openStyle = { borderColor: "#EBC253" };

function AddDealDialog(props) {
  const classes = useStyles();
  // const { transactData, handleDataChange } = props;

  const [stateApp, setStateApp] = useContext(AppContext);
  // const [title, setTitle] = useState(props.contact ? props.contact.name : ""); // title change from contact.name to dealName
  const [title, setTitle] = useState(""); // title change from contact.name to dealName
  const [label, setLabel] = useState("");
  const [stage, setStage] = useState("");
  const [dealState, setDealState] = useState(null);
  const [description, setDescription] = useState("");
  const [pipelineId, setPipelineId] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [users, setUsers] = useState([]);
  const [closeDate, setCloseDate] = useState(null);
  const [colaborators, setColaborators] = useState([]);

  const [nameAutValue, setNameAutValue] = useState({ name: "", id: 0, _id: 0 });
  const [mongoEntitiesArray, setMongoEntitiesArray] = useState([]);
  const [nameAutInputValue, setNameAutInputValue] = useState([]);

  const [openContactDialog, setOpenContactDialog] = useState(false);
  // const [getOwners, { data: dataOwners }] = useLazyQuery(OWNERSQUERY);

  const [pageVariables, setPageVariables] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);

  const [
    addContact,
    {
      data: addContactData,
      called: addContactCalled,
      loading: addContactLoading,
    },
  ] = useMutation(ADDCONTACT);

  const [getAllUsers, { data: userLists }] = useLazyQuery(GETUSERS, {
    fetchPolicy: "cache-and-network",
  });

  const [getTransactionData, { data: tdata }] = useLazyQuery(TRANSACTIONDATA);

  const [getContact, { data: cData }] = useLazyQuery(CONTACT, {
    fetchPolicy: "cache-and-network",
  });

  const [getPaginatedContacts, { data: allContacts }] = useLazyQuery(PAGINATEDCONTACTSQUERY, {
    fetchPolicy: "cache-and-network",
  });

  const [contact, setContact] = useState({});

  useEffect(() => {
    // getPaginatedContacts();
    getAllUsers();
  }, []);

  useEffect(() => {
    console.log("CURRENT USER", ownerId);
  });

  useEffect(() => {
    console.log("ALL CONTACTS: ", allContacts);
    if (allContacts?.paginatedContacts) {
      setMongoEntitiesArray([...allContacts?.paginatedContacts?.edges?.map((el) => el.node)]);
      setHasNextPage(allContacts?.paginatedContacts?.pageInfo?.hasNextPage);
    }
    setIsNextPageLoading(false);
  }, [allContacts]);

  const loadNextPage = (...args) => {
    console.log("loadNextPage", ...args);
    setIsNextPageLoading(true);
    getPaginatedContacts();
    return null
  };

  useEffect(() => {
    console.log("CDATA", cData);
    if (cData?.contact) {
      setNameAutValue(
        cData?.contact
          ? { name: cData.contact.name, _id: cData.contact._id }
          : {}
      );
    }
  }, [cData]);

  useEffect(() => {
    console.log("CONTACT", nameAutValue);
    if (nameAutValue?.name) {
      setContact(nameAutValue);
    }
  }, [nameAutValue]);
  // useEffect(() => {
  //   console.log("CONTACT", contact);
  //   if (contact?.name) {
  //     setNameAutValue(contact);
  //   }
  // }, [contact]);

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

  useEffect(() => {
    if (userLists && userLists.allUsers) {
      setUsers(
        userLists.allUsers.map((user) => ({
          value: user.id,
          text: user.displayName,
        }))
      );
    }
  }, [userLists]);

  const [
    updateTransaction,
    {
      data: updateTransactionData,
      called: updateTransactionCalled,
      loading: updateTransactionLoading,
    },
  ] = useMutation(UPDATETRANSACTION);

  const openContact = () => {
    handleClose();
    props.selectRowOpenContact(contact);
  };

  const handleDataChange = async (newData) => {
    if (tdata?.transactionData?._id) {
      await updateTransaction({
        variables: {
          transactionId: tdata.transactionData._id,
          transaction: { allData: newData, user: stateApp.user.mongoId },
        },
        refetchQueries: ["getTransactionData"],
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
    console.log("ACTIVE DEAL: ", stateApp.activeDeal);
    const cardId = stateApp.activeDeal?.cardId || stateApp.activeDeal?.id;
    const laneId = stateApp.activeDeal?.laneId;

    if (transactData && cardId && laneId && stateApp.dealDialog) {
      // best for transact page, auto-fills card with contact details
      const lane = transactData.lanes.find((lane) => lane.id === laneId); // selecting lane
      if (!lane || !lane.cards) return;
      const card = lane.cards.find((card) => card.id === cardId); // selecting card
      if (!card) return;

      setTitle(card.title ? card.title : "");
      setDealState(card.dealState ? card.dealState : null);
      setLabel(card.label ? card.label : "");
      setDescription(card.description ? card.description : "");
      setPipelineId(card.pipelineId ? card.pipelineId : "");
      setOwnerId(card.ownerId ? card.ownerId : stateApp.user.mongoId);
      setCloseDate(card.closeDate ? card.closeDate : null);
      setColaborators(card.colaborators ? card.colaborators : []);
      setStage(card.laneId ? card.laneId : "lane1");
      if (card.contactId) {
        setNameAutValue({ name: card.contactName, _id: card.contactId }); // setting contact
      }
    } else if (props.contact) {
      setNameAutValue({ name: props.contact.name, _id: props.contact._id });
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
    // if (!updateTransactionLoading && !addContactLoading) {
    setTitle("");
    setLabel("");
    setDescription("");
    setStage("");
    setDealState(null);
    setNameAutValue(null);
    setNameAutInputValue("");
    setPipelineId("");
    setOwnerId("");
    setCloseDate(null);
    setColaborators([]);
    setContact({});
    setStateApp((stateApp) => ({
      ...stateApp,
      dealDialog: false,
      activeDeal: { cardId: null, laneId: null },
    }));
    // }
  };

  const handleCloseContactDialog = () => {
    setOpenContactDialog(false);
  };

  useEffect(() => {
    if (addContactData) {
      addUpdateDeal(addContactData);
    }
  }, [addContactData]);

  const deleteDeal = async () => {
    if (transactData) {
      const cardId = stateApp.activeDeal?.cardId || stateApp.activeDeal?.id;
      const laneId = stateApp.activeDeal?.laneId;

      const laneIndex = transactData.lanes.findIndex(
        (lane) => lane.id === laneId
      );
      const lane = transactData.lanes[laneIndex];
      const cardIndex = lane.cards.findIndex((card) => card.id === cardId);
      const card = lane.cards[cardIndex];

      const deletedCard = {
        ...card,
        isDeleted: true,
        style: defaultStyle,
      };

      let td = {
        ...transactData,
        lanes: [
          ...transactData.lanes.slice(0, laneIndex),
          {
            ...lane,
            cards: [
              ...lane.cards.slice(0, cardIndex),
              { ...deletedCard },
              ...lane.cards.slice(cardIndex + 1),
            ],
          },
          ...transactData.lanes.slice(laneIndex + 1),
        ],
      };

      setTransactData(td);
      await handleDataChange(td);
      handleClose();
    }
  };

  const addUpdateDeal = async (newContact = null) => {
    let tempContact = newContact ? newContact?.addContact?.contact : contact;

    console.log("Contact: ", newContact, contact, tempContact);
    let newStage = stage ? stage : "lane1";
    if (transactData) {
      const cardId = stateApp.activeDeal?.cardId || stateApp.activeDeal?.id;
      const laneId = stateApp.activeDeal?.laneId;

      console.log("CARD AND LANE: ", cardId, laneId, stateApp.activeDeal);
      if (cardId && laneId) {
        // update existing
        const laneIndex = transactData.lanes.findIndex(
          (lane) => lane.id === laneId
        );
        const lane = transactData.lanes[laneIndex];
        const cardIndex = lane.cards.findIndex((card) => card.id === cardId);
        const card = lane.cards[cardIndex];

        let style;

        if (dealState === "won") {
          style = wonStyle;
        } else if (dealState === "lost") {
          style = lostStyle;
        } else {
          style = openStyle;
        }

        const updatedCard = {
          // dealName: dealName.trim(),
          // title: contact?.name.trim(),
          ...card,
          isDeleted: false,
          contactName: tempContact ? tempContact.name : "",
          title: title ? title.trim() : "",
          contactId: tempContact ? tempContact._id : "",
          label: label ? label.trim() : "",
          description: description ? description.trim() : "",
          laneId: newStage,
          dealState: dealState,
          pipelineId: pipelineId,
          ownerId: ownerId,
          expectedCloseDate: closeDate,
          colaborators: colaborators,
          style,
        };
        console.log("Update existing: ", updatedCard);

        if (card.laneId !== newStage) {
          if (cardIndex > -1) {
            // remove card from current lane
            let td = { ...transactData };
            td.lanes[laneIndex].cards.splice(cardIndex, 1);
            // add card to updated lane
            const stageIndex = td.lanes.findIndex(
              (lane) => lane.id === newStage
            );
            if (stageIndex === -1) {
              td.lanes.push({
                // create lane if doesn't exist
                id: newStage,
                title: getLaneTitle(newStage),
                cards: [updatedCard],
              });
            } else {
              td.lanes[stageIndex].cards.push(updatedCard);
            }
            setTransactData(td);
            await handleDataChange(td);
          }
        } else {
          let td = { ...transactData };

          td.lanes[laneIndex].cards[cardIndex] = updatedCard;
          setTransactData(td);
          await handleDataChange(td);
        }
      } else if (!cardId || !laneId) {
        // add new

        let td = { ...transactData };
        console.log(td, transactData, stateApp.user.mongoId);

        // create lane if doesn't exist
        if (td?.lanes.findIndex((lane) => lane.id === newStage) === -1) {
          td.lanes.push({
            id: newStage,
            title: getLaneTitle(newStage),
            cards: [],
          });
        }

        td.lanes.forEach((lane) => {
          if (lane.id === newStage) {
            let cards = [...lane.cards];
            let style;
            if (dealState === "won") {
              style = wonStyle;
            } else if (dealState === "lost") {
              style = lostStyle;
            } else {
              style = openStyle;
            }
            // CARD STRUCTURE
            const newCard = {
              // dealName: dealName.trim(),
              // title: contact?.name,
              isDeleted: false,
              contactName: tempContact ? tempContact.name : "",
              title: title ? title.trim() : "",
              label: label ? label.trim() : "",
              description: description ? description.trim() : "",
              dealState: dealState,
              id: uuid(),
              contactId: tempContact ? tempContact._id : "",
              laneId: newStage,
              // VALUES TO SET
              createdAt: Date.now(),
              pipelineId: pipelineId,
              ownerId: ownerId,
              expectedCloseDate: closeDate,
              colaborators: colaborators,
              style,
            };

            console.log("Add new: ", newCard);
            cards.push(newCard);
            lane.cards = cards;
          }
        });

        setTransactData(td);
        await handleDataChange(td);
      }

      handleClose();
    }
  };

  console.log("LOADING", addContactLoading, updateTransactionLoading);

  const handleUpdate = async () => {
    // if (title.trim() !== "" && description.trim() !== "") {

    if (transactData) {
      if (contact && contact._id === "newEntity") {
        await addContact({
          variables: {
            contact: {
              ...newContact,
              name: contact.name,
              createBy: stateApp.user.mongoId,
              lastUpdateBy: stateApp.user.mongoId,
            },
          },
          refetchQueries: ["getPaginatedContacts", "getContact", "getCustomLayer"],
          awaitRefetchQueries: true,
        });
      } else {
        await addUpdateDeal();
      }
    }
  };

  // useEffect(() => {
  //   if (tdata?.transactionData?.allData) {
  //     handleDataChange(transactData);
  //   }
  // }, [transactData]);

  return (
    <RightDialog
      open={props.open}
      handleClickDialogClose={() => {
        if (!updateTransactionLoading && !addContactLoading) {
          setStateApp((stateApp) => ({
            ...stateApp,
            dealDialog: false,
            activeDeal: { cardId: null, laneId: null },
          }));
          handleClose();
        }
      }}
      width={props.width}
    >
      <div style={{ padding: "30px" }}>
        {/* <h4 style={{ margin: "0 0 30px 0", fontSize: "16px" }}>
        Recent Activities
      </h4> */}
        <Grid item xs={12} style={{ minHeight: "35px" }}>
          <h4
            style={{ margin: "0 0 15px 0", float: "left", fontSize: "1.1rem" }}
          >
            Deal Information
          </h4>
          <div style={{ float: "right" }}>
            {(stateApp.activeDeal?.cardId || stateApp.activeDeal?.id) &&
              stateApp.activeDeal?.laneId && (
                <IconButton
                  disabled={updateTransactionLoading || addContactLoading}
                  onClick={deleteDeal}
                  size="small"
                  style={{ marginRight: 8 }}
                >
                  <DeleteIcon className={classes.closeIcon} fontSize="small" />
                </IconButton>
              )}
{/* 
            <IconButton
              disabled={updateTransactionLoading || addContactLoading}
              onClick={handleClose}
              size="small"
            >
              <CloseIcon className={classes.closeIcon} fontSize="small" />
            </IconButton> */}
          </div>
        </Grid>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            margin: "8px 0",
          }}
        >
          {dealState === null && (
            <>
              <div
                className={classes.dealStateOpen}
                onClick={() => setDealState("won")}
                style={{
                  marginRight: 8,
                }}
              >
                Won
              </div>
              <div
                className={classes.dealStateOpen}
                onClick={() => setDealState("lost")}
              >
                Lost
              </div>
            </>
          )}
          {dealState === "won" && (
            <>
              <div
                className={classes.dealStateClosed}
                style={{
                  backgroundColor: "#35DA97",
                  marginRight: 8,
                }}
              >
                Won
              </div>
              <div
                className={classes.dealStateReopen}
                onClick={() => setDealState(null)}
              >
                Repoen
              </div>
            </>
          )}
          {dealState === "lost" && (
            <>
              <div
                className={classes.dealStateClosed}
                style={{
                  backgroundColor: "#F74E1E",
                  marginRight: 8,
                }}
              >
                Lost
              </div>
              <div
                className={classes.dealStateReopen}
                onClick={() => setDealState(null)}
              >
                Repoen
              </div>
            </>
          )}

          {/* <div
            className={classes.dealStateDiv}
            onClick={() => setDealState("won")}
            style={{
              backgroundColor: dealState === "won" ? "green" : "#d9d9d9",
              color: dealState === "won" ? "white" : "black",
              marginRight: 8,
            }}
          >
            Won
          </div>
          <div
            className={classes.dealStateDiv}
            onClick={() => setDealState("lost")}
            style={{
              backgroundColor: dealState === "lost" ? "red" : "#d9d9d9",
              color: dealState === "lost" ? "white" : "black",
            }}
          >
            Lost
          </div> */}
        </div>
        <div className={classes.inputFieldDateRoot}>
          <TextField
            margin="dense"
            value={title}
            label="Deal Name"
            variant="outlined"
            fullWidth
            //   required
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            className={classes.inputField}
          />

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
          ) && !props.isTransactPage ? (
            <div className={classes.inputFieldDateRoot}>
              <TextField
                variant="outlined"
                margin="dense"
                value={contact?.name}
                label="Contact Name"
                fullWidth
                disabled
                className={classes.inputField}
              />
            </div>
          ) : (
            <div className={classes.inputField}>
              <Grid container>
                <Grid item xs={12}>
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
                </Grid>
              </Grid>
            </div>
          )}

          {/* <DatePicker
            inputVariant="outlined"
            label="Expected Close Date"
            className={classes.inputField}
            size="small"
            style={{ zIndex: 999 }}
            // value={closeDate}
            // onChange={(date) => {
            //   setCloseDate(date);
            // }}
          /> */}

          <FormControl
            variant="outlined"
            fullWidth
            className={classes.inputField}
            size="small"
          >
            <InputLabel shrink className={classes.shrinkLabel}>
              Owner Name
            </InputLabel>
            <Select
              native
              value={ownerId}
              onChange={(e) => {
                setOwnerId(e.target.value);
              }}
              fullWidth
            >
              {users.map((user) => (
                <option key={user.value} value={user.value}>
                  {user.text}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl
            variant="outlined"
            fullWidth
            size="small"
            className={classes.inputField}
          >
            <InputLabel shrink className={classes.dateLabel}>
              Expected Close Date
            </InputLabel>
            <TextField
              margin="dense"
              type="date"
              variant="outlined"
              value={closeDate}
              placeholder=""
              fullWidth
              onChange={(e) => {
                console.log("DATE", e);
                setCloseDate(e.target.value);
              }}
            />
          </FormControl>

          <FormControl
            variant="outlined"
            fullWidth
            className={classes.inputField}
            size="small"
          >
            <InputLabel shrink className={classes.shrinkLabel}>
              Pipeline
            </InputLabel>
            <Select
              native
              value={pipelineId}
              onChange={(e) => {
                setPipelineId(e.target.value);
              }}
              fullWidth
              label="Pipeline"
            >
              {/* TODO: map over list of pipelines and render options */}
            </Select>
          </FormControl>

          <FormControl
            variant="outlined"
            fullWidth
            className={classes.inputField}
            size="small"
          >
            <InputLabel shrink className={classes.shrinkLabel}>
              Deal Stage
            </InputLabel>
            <Select
              native
              value={stage}
              onChange={(e) => {
                console.log("Stage: ", e.target.value);
                setStage(e.target.value);
              }}
              fullWidth
              label="Deal Stage"
            >
              <option value={"lane1"}>Offer Preparation</option>
              <option value={"lane2"}>Offer Extended</option>
              <option value={"lane3"}>Accepted - Due Diligence</option>
              <option value={"lane4"}>Deal Closed</option>
              <option value={"lane5"}>Offer Rejected</option>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            variant="outlined"
            value={label}
            label="Offer Price"
            fullWidth
            onChange={(e) => {
              setLabel(e.target.value);
            }}
            className={classes.inputField}
          />
          <TextField
            //   autoFocus
            margin="dense"
            variant="outlined"
            multiline
            rows={8}
            value={description}
            label="Notes"
            fullWidth
            multiline
            //   required
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            className={classes.inputField}
          />

          <div className={classes.dialogFooter}>
            <Button
              variant="contained"
              color="default"
              size="medium"
              disableElevation
              onClick={() => {
                if (!updateTransactionLoading && !addContactLoading) {
                  handleClose();
                }
              }}
              disabled={updateTransactionLoading || addContactLoading}
              className={classes.footerButton}
              style={{
                margin: "0px 15px 0px 0px",
                // padding: "8px 35px",
                // background: "rgb(215,244,254)",
                // color: "rgb(23, 170, 221)",
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              color="secondary"
              size="medium"
              disableElevation
              onClick={handleUpdate}
              className={classes.footerButton}
              disabled={updateTransactionLoading || addContactLoading}
              // style={{ margin: "0px 20px 0px 0px" }}
            >
              {updateTransactionLoading || addContactLoading ? (
                <CircularProgress size={14} />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </div>
    </RightDialog>
  );
}

export default AddDealDialog;
