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
import { GETMONGOUSERS as GETUSERS } from "../../../graphQL/useQueryGetUsers";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { CircularProgress, Dialog, Typography } from "@material-ui/core";
import RightDialog from "./RightDialog";
import { DatePicker } from "@material-ui/pickers";
import moment from "moment";
import {
  deepEqual,
  deepEqualObjects,
  setStateIfDeepEqual,
} from "../../Shared/functions";
import TrackToggleButton from "../../Shared/TrackToggleButton";
import { TRACKBYOBJECTID } from "../../../graphQL/useQueryTrackByObjectId";
import TaggerWithIcon from "../../Shared/TaggerWithIcon";
import CommentsWithIcon from "../../Shared/CommentsWithIcon";
import DeleteConfirmationDialogContent from "../../Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";
import { useDispatch, useSelector } from "react-redux";
import { ADDDEAL } from "../../../graphQL/useMutationAddDeal";

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
    marginBottom: "10px",
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
    paddingTop: "10px",
  },
  footerButton: {
    letterSpacing: "1px",
    textTransform: "capitalize",
    fontWeight: "bold",
    padding: "8px 20px",
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
  originationDate: {
    paddingBottom: "12px",
    fontSize: 12,
    letterSpacing: 2,
    // fontWeight: "bold",
    textAlign: "center",
  },
  dialog: {
    zIndex: "9999999999 !important",
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
  const { selectedPipe, pipelines, pipeToShow } = useSelector(
    ({ Flow }) => Flow
  );
  const [stateApp, setStateApp] = useContext(AppContext);
  // const [title, setTitle] = useState(props.contact ? props.contact.name : ""); // title change from contact.name to dealName
  const [title, setTitle] = useState(""); // title change from contact.name to dealName
  const [label, setLabel] = useState("");
  const [stageId, setStageId] = useState(null);
  const [dealPosition, setDealPosition] = useState(null);
  const [dealState, setDealState] = useState(null);
  const [description, setDescription] = useState("");
  const [pipelineId, setPipelineId] = useState(selectedPipe?._id);
  const [stagesToChoose, setStagesToChoose] = useState([]);
  const [ownerId, setOwnerId] = useState(null);
  const [cardId, setCardId] = useState("");
  const [users, setUsers] = useState([]);
  const [closeDate, setCloseDate] = useState(null);
  const [colaborators, setColaborators] = useState([]);
  const [originationDate, setOriginationDate] = useState("");

  const [nameAutValue, setNameAutValue] = useState({ name: "", id: 0, _id: 0 });
  const [mongoEntitiesArray, setMongoEntitiesArray] = useState([]);
  const [nameAutInputValue, NameAutInputValue] = useState("");
  const setNameAutInputValue = (newState) => {
    setStateIfDeepEqual(NameAutInputValue, newState);
  };

  const [openContactDialog, setOpenContactDialog] = useState(false);
  // const [getOwners, { data: dataOwners }] = useLazyQuery(OWNERSQUERY);

  const [pageVariables, setPageVariables] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);
  let [transactData, setTransactData] = useState(
    props.transactData ? { ...props.transactData } : null
  );

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

  // const [getTransactionData, { data: tdata }] = useLazyQuery(TRANSACTIONDATA);
  const [addDeal, { data: addDealData, loading: addDealLoading }] = useMutation(
    ADDDEAL
  );

  const [getContact, { data: cData }] = useLazyQuery(CONTACT, {
    fetchPolicy: "cache-and-network",
  });

  // CONTACT

  const [
    getPaginatedContacts,
    { data: allContacts, loading, fetchMore: fetchMorePaginatedContacts },
  ] = useLazyQuery(PAGINATEDCONTACTSQUERY);

  const [contact, setContact] = useState({});

  useEffect(() => {
    if (selectedPipe?._id) setPipelineId(selectedPipe._id);
  }, [selectedPipe]);

  useEffect(() => {
    if (pipelines && pipelineId) {
      const i = pipelines.findIndex((pipe) => pipe._id === pipelineId);
      if (i >= 0 && pipelines[i] && pipelines[i].stages) {
        setStagesToChoose(pipelines[i].stages);
        setStageId(pipelines[i].stages[0]?._id);
      }
    }
  }, [pipelineId, pipelines]);

  useEffect(() => {
    if (stageId)
      if (pipeToShow?._id === pipelineId) {
        let position = -1;

        if (pipeToShow.lanes) {
          for (let i = 0; i < pipeToShow.lanes.length; i++) {
            const lane = pipeToShow.lanes[i];
            if (lane.id === stageId && lane.cards) {
              lane.cards.map((card) => {
                if (card.metadata?.position > position)
                  position = card.metadata.position;
              });

              break;
            }
          }
        }
        setDealPosition(position + 1);
      } else {
        setDealPosition(null);
      }
  }, [stageId, pipeToShow]);

  useEffect(() => {
    // getPaginatedContacts();
    getAllUsers();
  }, []);

  useEffect(() => {
    console.log("ALL CONTACTS: ", allContacts);
    if (allContacts?.paginatedContacts) {
      setMongoEntitiesArray(
        allContacts?.paginatedContacts?.edges?.map((el) => el.node)
      );
      setHasNextPage(allContacts?.paginatedContacts?.pageInfo?.hasNextPage);
      setIsNextPageLoading(false);
    }
  }, [allContacts]);

  useEffect(() => {
    console.log("AUTOCOMPLETE INPUT CHANGE: ", nameAutInputValue);

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

  // CONTACT END

  // TRACK
  const [
    trackByObjectId,
    { loading: loadingTrack, data: dataTrack },
  ] = useLazyQuery(TRACKBYOBJECTID);

  const [target, setTarget] = useState({});

  useEffect(() => {
    if (dataTrack) {
      setTarget({
        isTracked: dataTrack.trackByObjectId ? true : false,
      });
    }
  }, [dataTrack]);
  // TRACK END

  // useEffect(() => {
  //   console.log("CONTACT", contact);
  //   if (contact?.name) {
  //     setNameAutValue(contact);
  //   }
  // }, [contact]);

  // useEffect(() => {
  //   console.log("TDATA : ", tdata?.transactionData[props.index]?.allData);
  //   if (tdata?.transactionData[props.index]?.allData) {
  //     setTransactData(
  //       JSON.parse(JSON.stringify(tdata?.transactionData[props.index]?.allData))
  //     );
  //   }
  // }, [tdata, props.index]);

  useEffect(() => {
    if (userLists && userLists.allUsers) {
      setUsers(
        userLists.allUsers.map((user) => ({
          value: user._id,
          text: user.name,
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
    // if (tdata?.transactionData[props.index]?._id) {
    //   await updateTransaction({
    //     variables: {
    //       transactionId: tdata.transactionData[props.index]._id,
    //       transaction: { allData: newData, user: stateApp.user.mongoId },
    //     },
    //     refetchQueries: ["getTransactionData"],
    //     awaitRefetchQueries: true,
    //   });
    // }
  };

  // useEffect(() => {
  //   if (stateApp.user && stateApp.user.mongoId) {
  //     console.log(stateApp.user);
  //     getTransactionData({
  //       variables: {
  //         userId: stateApp.user.mongoId,
  //       },
  //     });
  //   }
  // }, [stateApp.user]);

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

      console.log("ACTIVE DEAL: ", stateApp.activeDeal, card, stateApp.user);

      // TRACK
      setCardId(card.id);

      trackByObjectId({
        variables: {
          userId: stateApp.user.mongoId,
          objectId: card.id.toLowerCase(),
        },
      });

      setTitle(card.title ? card.title : "");
      setDealState(card.dealState ? card.dealState : null);
      setLabel(card.label ? card.label : "");
      setDescription(card.description ? card.description : "");
      setPipelineId(card.pipelineId ? card.pipelineId : "");
      setOwnerId(card.ownerId ? card.ownerId : stateApp.user.mongoId);
      setCloseDate(card.expectedCloseDate ? card.expectedCloseDate : null);
      setColaborators(card.colaborators ? card.colaborators : []);
      setOriginationDate(card.createdAt ? card.createdAt : "");
      setStageId(card.laneId ? card.laneId : "lane1");
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
  }, [
    transactData,
    stateApp.activeDeal,
    props.contact,
    stateApp.dealDialog,
    stateApp.user,
  ]);

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
    // setStageId(null);
    setDealState(null);
    setNameAutValue(null);
    setNameAutInputValue("");
    setPipelineId(selectedPipe?._id);
    setOwnerId(null);
    setCloseDate(null);
    setColaborators([]);
    setOriginationDate("");
    setContact({});
    setTarget({});
    setCardId("");
    if (props.isTransactPage) setContact({});
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
    // if (transactData) {
    //   const cardId = stateApp.activeDeal?.cardId || stateApp.activeDeal?.id;
    //   const laneId = stateApp.activeDeal?.laneId;
    //   const laneIndex = transactData.lanes.findIndex(
    //     (lane) => lane.id === laneId
    //   );
    //   const lane = transactData.lanes[laneIndex];
    //   const cardIndex = lane.cards.findIndex((card) => card.id === cardId);
    //   const card = lane.cards[cardIndex];
    //   const deletedCard = {
    //     ...card,
    //     isDeleted: true,
    //     style: defaultStyle,
    //   };
    //   let td = {
    //     ...transactData,
    //     lanes: [
    //       ...transactData.lanes.slice(0, laneIndex),
    //       {
    //         ...lane,
    //         cards: [
    //           ...lane.cards.slice(0, cardIndex),
    //           { ...deletedCard },
    //           ...lane.cards.slice(cardIndex + 1),
    //         ],
    //       },
    //       ...transactData.lanes.slice(laneIndex + 1),
    //     ],
    //   };
    //   setTransactData(td);
    //   await handleDataChange(td);
    //   handleClose();
    // }
  };

  const addUpdateDeal = async (newContact = null) => {
    let tempContact = newContact ? newContact?.addContact?.contact : contact;
    let contactId = tempContact?._id;

    //// foreing deal ids:
    //// stageId, pipelineId, ownerId, contactId

    if (pipelineId && stageId && title && title.trim() !== "") {
      const cardId = stateApp.activeDeal?.cardId || stateApp.activeDeal?.id;

      const deal = {
        name: title ? title.trim() : null,
        offerPrice: label ? label.trim() : null,
        notes: description ? description.trim() : null,
        status: dealState ? dealState : "open",
        closeDate: closeDate,
      };

      if (cardId) {
        //// update existing deal
      } else {
        //// add a new deal
        addDeal({
          variables: {
            deal,
            stageId,
            pipelineId,
            ownerId,
            contactId,
            position: dealPosition?.toString(),
            userId: stateApp.user.mongoId,
          },
          refetchQueries: ["getPipeline"],
          awaitRefetchQueries: true,
        });
      }
      //////////////////////////////////////////////////////////
      // console.log("Contact: ", newContact, contact, tempContact);
      // let newStage = stageId ? stageId : "lane1";
      // if (transactData) {
      //   const cardId = stateApp.activeDeal?.cardId || stateApp.activeDeal?.id;
      //   const laneId = stateApp.activeDeal?.laneId;

      //   console.log("CARD AND LANE: ", cardId, laneId, stateApp.activeDeal);
      //   if (cardId && laneId) {
      //     // update existing
      //     const laneIndex = transactData.lanes.findIndex(
      //       (lane) => lane.id === laneId
      //     );
      //     const lane = transactData.lanes[laneIndex];
      //     const cardIndex = lane.cards.findIndex((card) => card.id === cardId);
      //     const card = lane.cards[cardIndex];

      //     let style;

      //     if (dealState === "won") {
      //       style = wonStyle;
      //     } else if (dealState === "lost") {
      //       style = lostStyle;
      //     } else {
      //       style = openStyle;
      //     }

      //     const updatedCard = {
      //       // dealName: dealName.trim(),
      //       // title: contact?.name.trim(),
      //       ...card,
      //       isDeleted: false,
      //       contactName: tempContact ? tempContact.name : "",
      //       title: title ? title.trim() : "",
      //       contactId: tempContact ? tempContact._id : "",
      //       label: label ? label.trim() : "",
      //       description: description ? description.trim() : "",
      //       laneId: newStage,
      //       dealState: dealState,
      //       pipelineId: pipelineId,
      //       ownerId: ownerId,
      //       expectedCloseDate: closeDate,
      //       colaborators: colaborators,
      //       style,
      //     };
      //     console.log("Update existing: ", updatedCard);

      //     if (card.laneId !== newStage) {
      //       if (cardIndex > -1) {
      //         // remove card from current lane
      //         let td = { ...transactData };
      //         td.lanes[laneIndex].cards.splice(cardIndex, 1);
      //         // add card to updated lane
      //         const stageIndex = td.lanes.findIndex(
      //           (lane) => lane.id === newStage
      //         );
      //         if (stageIndex === -1) {
      //           td.lanes.push({
      //             // create lane if doesn't exist
      //             id: newStage,
      //             title: getLaneTitle(newStage),
      //             cards: [updatedCard],
      //           });
      //         } else {
      //           td.lanes[stageIndex].cards.push(updatedCard);
      //         }
      //         setTransactData(td);
      //         await handleDataChange(td);
      //       }
      //     } else {
      //       let td = { ...transactData };

      //       td.lanes[laneIndex].cards[cardIndex] = updatedCard;
      //       setTransactData(td);
      //       await handleDataChange(td);
      //     }
      //   } else if (!cardId || !laneId) {
      //     // add new

      //     let td = { ...transactData };
      //     console.log(td, transactData, stateApp.user.mongoId);

      //     // create lane if doesn't exist
      //     if (td?.lanes.findIndex((lane) => lane.id === newStage) === -1) {
      //       td.lanes.push({
      //         id: newStage,
      //         title: getLaneTitle(newStage),
      //         cards: [],
      //       });
      //     }

      //     td.lanes.forEach((lane) => {
      //       if (lane.id === newStage) {
      //         let cards = [...lane.cards];
      //         let style;
      //         if (dealState === "won") {
      //           style = wonStyle;
      //         } else if (dealState === "lost") {
      //           style = lostStyle;
      //         } else {
      //           style = openStyle;
      //         }
      //         // CARD STRUCTURE
      //         const newCard = {
      //           // dealName: dealName.trim(),
      //           // title: contact?.name,
      //           isDeleted: false,
      //           contactName: tempContact ? tempContact.name : "",
      //           title: title ? title.trim() : "",
      //           label: label ? label.trim() : "",
      //           description: description ? description.trim() : "",
      //           dealState: dealState,
      //           id: uuid(),
      //           contactId: tempContact ? tempContact._id : "",
      //           laneId: newStage,
      //           // VALUES TO SET
      //           createdAt: new Date().toISOString(),
      //           pipelineId: pipelineId,
      //           ownerId: ownerId,
      //           expectedCloseDate: closeDate,
      //           colaborators: colaborators,
      //           style,
      //         };

      //         console.log("Add new: ", newCard);
      //         cards.push(newCard);
      //         lane.cards = cards;
      //       }
      //     });

      //     setTransactData(td);
      //     await handleDataChange(td);
      //   }

      handleClose();
    }
    // }
  };

  // console.log("LOADING", addContactLoading, updateTransactionLoading);

  const handleUpdate = async () => {
    // if (title.trim() !== "" && description.trim() !== "") {

    // if (transactData) {
    if (transactData && contact && contact._id === "newEntity") {
      await addContact({
        variables: {
          contact: {
            ...newContact,
            name: contact.name,
            createBy: stateApp.user.mongoId,
            lastUpdateBy: stateApp.user.mongoId,
          },
        },
        refetchQueries: [
          "getPaginatedContacts",
          "getContact",
          "getCustomLayer",
        ],
        awaitRefetchQueries: true,
      });
    } else {
      await addUpdateDeal();
    }
    // }
  };

  // useEffect(() => {
  //   if (tdata?.transactionData?.allData) {
  //     handleDataChange(transactData);
  //   }
  // }, [transactData]);

  // console.log("USERS", users);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const openConfirmationDialog = () => {
    setDeleteDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setDeleteDialogOpen(false);
  };

  const deleteFunc = async () => {
    try {
      setIsDeleting(true);
      await deleteDeal();
      setIsDeleting(false);
    } catch {
      setIsDeleting(false);
    }
  };
  const sortedPipelines = [...pipelines].sort((a, b) => {
    let comparison = 0;
    if (a.name.toUpperCase() > b.name.toUpperCase()) {
      comparison = 1;
    } else if (a.name.toUpperCase() < b.name.toUpperCase()) {
      comparison = -1;
    }
    return comparison;
  });

  // const locallySelectedPipe =
  //   pipelines && pipelineId
  //     ? pipelines.filter((pipe) => pipe._id === pipelineId)[0]
  //     : null;
  // const stagesToChoose = locallySelectedPipe?.stages;

  return (
    <>
      {deleteDialogOpen && (
        <Dialog
          className={classes.dialog}
          open={deleteDialogOpen ? true : false}
          onClose={handleCloseDialog}
          fullWidth={false}
          maxWidth="sm"
        >
          <DeleteConfirmationDialogContent
            header={`Delete Deal`}
            onClose={handleCloseDialog}
            deleteFunc={deleteFunc}
            m1nSelectedRowsIds={null}
            setM1nSelectedRowsIndexes={() => {}}
          >
            Do you want to delete deal?
          </DeleteConfirmationDialogContent>
        </Dialog>
      )}
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
              style={{
                margin: "0 0 15px 0",
                float: "left",
                fontSize: "1.1rem",
              }}
            >
              Deal Information
            </h4>
            <div style={{ float: "right" }}>
              {(stateApp.activeDeal?.cardId || stateApp.activeDeal?.id) &&
                stateApp.activeDeal?.laneId && (
                  <>
                    <CommentsWithIcon
                      objectId={stateApp.activeDeal?.cardId}
                      targetLabel={"deal"}
                      iconZiseSmall={true}
                    />
                    <TaggerWithIcon
                      objectId={stateApp.activeDeal?.cardId}
                      targetLabel={"deal"}
                      iconZiseSmall={true}
                    />
                    <TrackToggleButton
                      target={target}
                      targetLabel={"deal"}
                      targetSourceId={stateApp.activeDeal?.cardId}
                      iconZiseSmall={true}
                      dark={true}
                    />
                    <IconButton
                      disabled={updateTransactionLoading || addContactLoading}
                      onClick={openConfirmationDialog}
                      size="small"
                      style={{ margin: "0 8px" }}
                    >
                      {isDeleting ? (
                        <CircularProgress size={20} color="secondary" />
                      ) : (
                        <DeleteIcon
                          className={classes.closeIcon}
                          fontSize="small"
                        />
                      )}
                    </IconButton>
                  </>
                )}

              <IconButton
                disabled={updateTransactionLoading || addContactLoading}
                onClick={handleClose}
                size="small"
              >
                <CloseIcon className={classes.closeIcon} fontSize="small" />
              </IconButton>
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
                {selectedPipe && (
                  <option value={selectedPipe._id}>{selectedPipe.name}</option>
                )}
                {sortedPipelines.map((pipeline) => {
                  if (selectedPipe && selectedPipe._id === pipeline._id) return;
                  return <option value={pipeline._id}>{pipeline.name}</option>;
                })}
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
                value={stageId}
                onChange={(e) => {
                  console.log("Stage: ", e.target.value);
                  setStageId(e.target.value);
                }}
                fullWidth
                label="Deal Stage"
              >
                {stagesToChoose &&
                  stagesToChoose.map((stage) => (
                    <option value={stage._id}>{stage.name}</option>
                  ))}
              </Select>
            </FormControl>

            <FormControl
              variant="outlined"
              fullWidth
              className={classes.inputField}
              size="small"
            >
              <Autocomplete
                className={classes.fieldWidth}
                options={users}
                onChange={(e, user) => {
                  setOwnerId(user.value);
                }}
                value={users.find((user) => user.value === ownerId) || null}
                getOptionLabel={(option) => option.text}
                getOptionSelected={(option) => option.value === ownerId}
                renderInput={(params) => (
                  <TextField
                    margin="dense"
                    {...params}
                    variant="outlined"
                    label="Deal Owner"
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </FormControl>

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

            {originationDate && (
              <div className={classes.originationDate}>
                Origination Date:{" "}
                {moment(originationDate).format("M/DD/YYYY, hh:mmA")}
              </div>
            )}

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
    </>
  );
}

export default AddDealDialog;
