import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback
} from "react";
import { useHistory } from "react-router-dom";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import { useLazyQuery, useMutation } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import { AppContext } from "../../../AppContext";
import { CONTACT } from "../../../graphQL/useQueryContact";
import { ADDCONTACT } from "../../../graphQL/useMutationAddContact";
import AutocompEntityNamesVirtualizeList from "../../Shared/M1nTable/components/SubComponents/AutocompEntityNamesVirtualizeList";
import { PAGINATEDCONTACTSQUERY } from "../../../graphQL/useQueryPaginatedContacts";
import { GETMONGOUSERS } from "../../../graphQL/useQueryGetUsers";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  CircularProgress,
  Dialog,
  Typography,
  Avatar
} from "@material-ui/core";
import RightDialog from "./RightDialog";
import moment from "moment";
import {
  deepEqual,
  deepEqualObjects,
  setStateIfDeepEqual
} from "../../Shared/functions";
import TrackToggleButton from "../../Shared/TrackToggleButton";
import { TRACKBYOBJECTID } from "../../../graphQL/useQueryTrackByObjectId";
import TaggerWithIcon from "../../Shared/TaggerWithIcon";
import CommentsWithIcon from "../../Shared/CommentsWithIcon";
import DeleteConfirmationDialogContent from "../../Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";
import { useDispatch, useSelector } from "react-redux";
import { ADDDEAL } from "graphQL/useMutationAddDeal";
import InputAdornment from "@material-ui/core/InputAdornment";
import { UPDATEDEAL } from "graphQL/useMutationUpdateDeal";
import { UPSERTDEALDESCRIPTOR } from "graphQL/useMutationUpsertDealDescriptor";
import { REMOVEDEALDESCRIPTOR } from "../../../graphQL/useMutationRemoveDealDescriptor";
import { UPDATESTAGEDEALDESCRIPTOR } from "graphQL/useMutationUpdateStageDealDescriptor";
import {
  setFlowState,
  showErrorMessage,
  showSuccessMessage
} from "../../../actions";
import PropTypes from "prop-types";
import NumberFormat from "react-number-format";
import Documents from "../../Shared/Documents";
import AddDialogeUploadZone from "./AddDialogUploadZone";
import { GETRECENTCONTACTFILES } from "graphQL/useQueryGetContactFiles";
import { VIEWFILEQUERY, VIEWFILESQUERY } from "graphQL/useQueryViewFile";
import { GETDEAL } from "graphQL/useQueryDeal";
import ExpandableCardProvider from "../../ExpandableCard/ExpandableCardProvider";
import Contacts from "components/FlowDrawer/Contacts";
import EventIcon from "@material-ui/icons/Event";
import "./style/dialog.css";
import { faCloudShowersHeavy } from "@fortawesome/free-solid-svg-icons";

// mui icons
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { CustomAvatar } from "components/Transact/Transact";

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
            value: values.value
          }
        });
      }}
      thousandSeparator
      isNumericString
      prefix="$"
    />
  );
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

const useStyles = makeStyles((theme) => ({
  mainRoot: {
    // '& .MuiPaper-root': {
    //   overflowX: 'hidden !important'
    // },
    // '& .MuiDialog-root': {
    //   overflowX: 'hidden !important'
    // },
  },
  dialogTitle: {
    textAlign: "center"
  },
  dialogContentText: {
    textAlign: "center"
  },
  inputFieldOwner: {
    marginBottom: "7px"
  },
  inputFieldDate: {
    marginBottom: "7px"
  },
  inputFieldFlowline: {
    marginBottom: "7px"
  },
  inputFieldFlowStage: {
    marginBottom: "7px"
  },
  inputFieldCustomTextInput: {
    marginBottom: "7px"
  },
  inputFieldDealName: {
    marginBottom: "10px",
    width: "405px"
  },
  dateLabel: {
    transform: "translate(10px, 2px) scale(0.75) !important",
    backgroundColor: "#fff !important",
    padding: "0 6px"
  },
  shrinkLabel: {
    backgroundColor: "#fff !important",
    padding: "0 6px"
  },
  inputFieldDateRoot: {
    "& .MuiDialog-root": {}
  },
  progress: {
    marginLeft: "30px",
    verticalAlign: "middle"
  },

  label: {
    backgroundColor: "white"
  },

  closeIcon: {
    fill: theme.palette.secondary.main,
    "&:hover": {
      fill: "red"
    }
  },
  topBtnGroup: {},
  inputField: {
    // marginBottom: "30px",
    outline: "none"
  },
  dealStateOpenWon: {
    padding: "8px 16px",
    borderRadius: 5,
    cursor: "pointer",
    backgroundColor: "#d9d9d9",
    "&:hover": {
      backgroundColor: "#a6e5c3",
      // borderStyle: "solid",
      fontWeight: "bold",
      color: "#54a83c"
    }
  },
  dealStateOpenLost: {
    padding: "8px 16px",
    borderRadius: 5,
    cursor: "pointer",
    backgroundColor: "#d9d9d9",
    "&:hover": {
      backgroundColor: "#ffa8a8",
      // borderStyle: "solid",
      fontWeight: "bold",
      color: "#f96060"
    }
  },
  dealStateClosed: {
    padding: "8px 16px",
    borderRadius: 18

    // color: "#fff",
  },
  gridStyle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  dealStateReopen: {
    padding: "2px 10px",
    cursor: "pointer",
    borderRadius: 5,
    border: "1px solid gray"
  },
  originationDate: {
    paddingBottom: "12px",
    paddingTop: "4px",
    fontSize: 12,
    letterSpacing: 2,
    textAlign: "center"
  },
  dialog: {
    zIndex: "9999999999 !important"
  },
  notes: {
    backgroundColor: "#FFFCDC",
    display: "block",
    width: "100%",
    marginTop: 25,

    "& .MuiOutlinedInput-root": {
      width: "100%",
      "& fieldset": {
        borderColor: "white"
      }
    }
  },
  dialogExpCard: {
    zIndex: "9999999999999999999 !important"
  },
  dateRoot: {
    border: "1px solid #EBEBEB",

    "&.Mui-focused fieldset": {
      border: "1px solid black",
      backgroundColor: "transparent"
    },
    "&:hover": {
      backgroundColor: "#EBEBEB"
    },
    "&:active": {
      border: "1px solid black",
      backgroundColor: "#fff"
    }
  },

  flowlineRoot: {
    "&:hover": {
      backgroundColor: "#EBEBEB",
      "& .MuiOutlinedInput-notchedOutline": {
        border: 0
      },
      "& .MuiSelect-icon": {
        display: "inline-block"
      }
    },
    "&:active": {
      border: "1px solid black",
      backgroundColor: "#EBEBEB"
    }
  },
  notchedOutlineFlow: {
    border: "0.2px solid #EBEBEB"
  },
  notchedOutlineFlowFocused: {
    "& .MuiOutlinedInput-notchedOutline": {
      border: "1px solid black"
    }
  },
  icon: {
    display: "none"
  },
  dealNameRoot: {
    fontWeight: "bold",
    paddingLeft: 0,
    textAlign: "left",
    fontSize: "1.2rem",
    "&.Mui-focused fieldset": {
      border: "1px solid black",
      backgroundColor: "transparent"
    },
    "&:hover": {
      border: "1px solid black"
    }
  },
  customDataTextInputRoot: {
    border: "1px solid #EBEBEB",
    "&.Mui-focused fieldset": {
      border: "1px solid black",
      backgroundColor: "transparent"
    },
    "&:hover": {
      backgroundColor: "#EBEBEB"
    }
  },
  notchedOutline: {
    border: 0
  },

  dealOwnerRoot: {
    border: "1px solid #EBEBEB",

    // This matches the specificity of the default styles at https://github.com/mui-org/material-ui/blob/v4.11.3/packages/material-ui-lab/src/Autocomplete/Autocomplete.js#L90
    '&[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-child': {
      // Default left padding is 6px
      paddingLeft: 26
    },

    "& .MuiOutlinedInput-notchedOutline": {
      border: 0
    },
    "&:hover.MuiOutlinedInput-root": {
      backgroundColor: "#EBEBEB"
    },
    "&:hover .MuiAutocomplete-popupIndicator": {
      visibility: "visible",
      padding: "2px",
      marginRight: "-2px"
    }
  },
  dealOwnerRootFocused: {
    "& .MuiOutlinedInput-notchedOutline": {
      border: "1px solid black"
    }
  },
  dealOwnerAvatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    color: "#fff",
    fontSize: "0.6rem",
    backgroundColor: "#4880F6",
    padding: "0.5em"
  },
  dealOwnerLabel: {
    marginLeft: 4
    // marginTOP: -2,
  },
  popupIndicator: {
    visibility: "hidden",
    padding: "2px",
    marginRight: "-2px",
    "&:hover": {
      visibility: "visible"
    }
  }
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
  zip: ""
};

function AddDealDialog(props) {
  const dispatch = useDispatch();
  let history = useHistory();
  const classes = useStyles();
  const { selectedPipe, pipelines, pipeToShow } = useSelector(
    ({ Flow }) => Flow
  );
  const [selectedContactToAdd, setSelectedContactToAdd] = useState(null);
  const [stateApp, setStateApp] = useContext(AppContext);
  const [title, setTitle] = useState(""); // title change from contact.name to dealName
  const [titleFocus, setTitleFocus] = useState(false);
  const [label, setLabel] = useState("");
  const [stageId, setStageId] = useState(null);
  const [dealPosition, setDealPosition] = useState(null);
  const [dealState, setDealState] = useState(null);
  const [description, setDescription] = useState("");
  const [pipelineId, setPipelineId] = useState(selectedPipe?._id);
  const [stagesToChoose, setStagesToChoose] = useState([]);
  const [ownerId, setOwnerId] = useState("");
  const [cardId, setCardId] = useState("");
  const [users, setUsers] = useState([]);
  const [closeDate, setCloseDate] = useState(new Date());
  const [colaborators, setColaborators] = useState([]);
  const [originationDate, setOriginationDate] = useState(null);

  const [nameAutValue, setNameAutValue] = useState({ name: "", id: 0, _id: 0 });
  const [mongoEntitiesArray, setMongoEntitiesArray] = useState([]);
  const [nameAutInputValue, NameAutInputValue] = useState("");
  const setNameAutInputValue = (newState) => {
    setStateIfDeepEqual(NameAutInputValue, newState);
  };

  const [openContactDialog, setOpenContactDialog] = useState(false);

  const [dealInfoFocus, setDealInfoFocus] = useState(false);
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
      loading: addContactLoading
    }
  ] = useMutation(ADDCONTACT);

  const [getAllMongoUsers, { data: userLists }] = useLazyQuery(GETMONGOUSERS, {
    fetchPolicy: "no-cache"
  });

  const [addDeal, { data: dealData }] = useMutation(ADDDEAL);
  const [updateDeal, { loading: updateDealLoading }] = useMutation(UPDATEDEAL);
  const [upsertDealDescriptor] = useMutation(UPSERTDEALDESCRIPTOR);
  const [removeDealDescriptor] = useMutation(REMOVEDEALDESCRIPTOR);
  const [updateStageDealDescriptor] = useMutation(UPDATESTAGEDEALDESCRIPTOR);

  const [getContact, { data: cData }] = useLazyQuery(CONTACT, {
    fetchPolicy: "cache-and-network"
  });

  // CONTACT

  const [
    getPaginatedContacts,
    { data: allContacts, loading, fetchMore: fetchMorePaginatedContacts }
  ] = useLazyQuery(PAGINATEDCONTACTSQUERY, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first"
  });

  const [contact, setContact] = useState({});

  useEffect(() => {
    console.log("===========");
    console.log("FLOW TRANSACT BAR VIEW", stateApp.transactBarView);

    if (stateApp.transactBarView !== "") {
      // handleValidate();

      if (!(stateApp.activeDeal?.cardId || stateApp.activeDeal?.id)) {
        addUpdateDeal(null, false);
      }
    }
  }, [stateApp.transactBarView]);

  useEffect(() => {
    if (dealData) {
      setStateApp((stateApp) => ({
        ...stateApp,
        activeDeal: dealData?.addDeal?.deal
      }));
    }
  }, [dealData]);

  const settingNewStageAndFindNextAvailablePosition = (
    stageId,
    findPosition,
    localPipelineId = pipelineId
  ) => {
    setStageId(stageId);

    if (findPosition) {
      if (
        stateApp.activeDeal?.laneId &&
        stateApp.activeDeal?.descriptorId === localPipelineId &&
        stateApp.activeDeal?.laneId === stageId
      )
        setDealPosition(stateApp.activeDeal?.position);
      else {
        if (pipeToShow?._id === localPipelineId) {
          let position = -1;

          if (pipeToShow.lanes)
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

          setDealPosition(position + 1);
        } else setDealPosition(null);
      }
    }
  };

  const settingNewPipeWithDefaultStage = (pipelineId, defaultStage) => {
    setPipelineId(pipelineId);
    if (!pipelineId) {
      setStagesToChoose([]);
      setStageId(null);
      setDealPosition(null);
    } else if (pipelines) {
      const i = pipelines.findIndex((pipe) => pipe._id === pipelineId);

      if (i >= 0 && pipelines[i] && pipelines[i].stages) {
        setStagesToChoose(pipelines[i].stages);

        if (defaultStage)
          settingNewStageAndFindNextAvailablePosition(
            pipelines[i].stages[0]?._id,
            true,
            pipelineId
          );
      }
    }
  };

  useEffect(() => {
    if (
      stateApp.dealDialog &&
      !stateApp.activeDeal?.cardId &&
      selectedPipe?._id
    )
      settingNewPipeWithDefaultStage(selectedPipe._id, true);
  }, [selectedPipe, stateApp.dealDialog, stateApp.activeDeal]);

  useEffect(() => {
    getAllMongoUsers();
  }, []);

  useEffect(() => {
    if (allContacts?.paginatedContacts) {
      setMongoEntitiesArray(
        allContacts?.paginatedContacts?.edges?.map((el) => el.node)
      );
      setHasNextPage(allContacts?.paginatedContacts?.pageInfo?.hasNextPage);
      setIsNextPageLoading(false);
    }
  }, [allContacts]);

  useEffect(() => {
    if (props.isTransactPage) {
      //will also run during initial mount
      setIsNextPageLoading(true);
      getPaginatedContacts({
        variables: {
          search: nameAutInputValue
        }
      });
    }
  }, [nameAutInputValue]);

  const loadNextPage = async (pageVariables) => {
    setIsNextPageLoading(true);
    fetchMorePaginatedContacts(pageVariables);
  };

  useEffect(() => {
    if (cData?.contact) {
      setNameAutValue(
        cData?.contact
          ? { name: cData.contact.name, _id: cData.contact._id }
          : {}
      );
    }
  }, [cData]);

  useEffect(() => {
    if (nameAutValue?.name) {
      setContact(nameAutValue);
    }
  }, [nameAutValue]);

  // CONTACT END

  // TRACK
  const [trackByObjectId, { loading: loadingTrack, data: dataTrack }] =
    useLazyQuery(TRACKBYOBJECTID);

  const [target, setTarget] = useState({});

  useEffect(() => {
    if (dataTrack) {
      setTarget({
        isTracked: dataTrack.trackByObjectId ? true : false
      });
    }
  }, [dataTrack]);
  // TRACK END

  useEffect(() => {
    if (userLists && userLists.allMongoUsers) {
      setUsers(
        userLists.allMongoUsers.map((user) => ({
          value: user._id,
          text: user.name,
          email: user.email
        }))
      );
    }
  }, [userLists]);

  useEffect(() => {
    if (props.contactId) {
      getContact({
        variables: {
          contactId: props.contactId
        }
      });
    }
  }, [props.contactId]);

  useEffect(() => {
    const cardId = stateApp.activeDeal?.cardId || stateApp.activeDeal?.id;
    const laneId = stateApp.activeDeal?.laneId;

    if (cardId && laneId && stateApp.dealDialog) {
      //  auto-fills

      // TRACK
      setCardId(cardId);
      trackByObjectId({
        variables: {
          userId: stateApp.user.mongoId,
          objectId: cardId.toLowerCase()
        }
      });

      const card = stateApp.activeDeal;
      setTitle(card.name ? card.name : "");
      setDealState(card.status ? card.status : null);
      setLabel(card.offerPrice ? card.offerPrice : "");
      setDescription(card.notes ? card.notes : "");
      // setPipelineId
      settingNewPipeWithDefaultStage(
        card.pipeline ? card.pipeline : null,
        false
      );
      // setStageId
      settingNewStageAndFindNextAvailablePosition(laneId, false);
      setCloseDate(
        card.closeDate
          ? moment.parseZone(card.closeDate).format("yyyy-MM-DD")
          : ""
      );
      setDealPosition(card.position ? card.position : null);
      // setColaborators(card.colaborators ? card.colaborators : []);
      setOriginationDate(card.ts ? card.ts : null);

      setOwnerId(card.owners[0]?.relatedObject?._id || card.ownerId);

      if (card.contacts?.length > 0)
        // setting contact
        setNameAutValue({
          name: card.contacts[0]?.relatedObject?.entity?.name,
          _id: card.contacts[0]?.relatedObject?._id
        });
      else setNameAutValue(null);
    } else if (props.contact) {
      setNameAutValue({ name: props.contact.name, _id: props.contact._id });
    } else if (props.contactId) {
      getContact({
        variables: {
          contactId: props.contactId
        }
      });
    }
  }, [stateApp.activeDeal, props.contact, stateApp.dealDialog, stateApp.user]);

  const handleClose = () => {
    // handleValidate();
    handleUpdate();
    setTitle("");
    setLabel("");
    setDescription("");
    setStageId(null);
    setDealState(null);
    if (props.isTransactPage) setNameAutValue(null);
    setNameAutInputValue("");
    setPipelineId(null);
    setOwnerId(null);
    setCloseDate("");
    setColaborators([]);
    setOriginationDate(null);
    setTarget({});
    setCardId("");
    setDealPosition(null);
    if (props.isTransactPage) setContact({});
    setStateApp((stateApp) => ({
      ...stateApp,
      dealDialog: false,
      activeDeal: { cardId: null, laneId: null },
      transactBarView: "",
      viewDoc: null
    }));
    // setValid({title: false});
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
    const cardId = stateApp.activeDeal?.cardId || stateApp.activeDeal?.id;

    if (cardId)
      await updateDeal({
        variables: {
          deal: { _id: cardId, IsDeleted: true }
        },
        refetchQueries: ["getPipeline", "getContactDeals"],
        awaitRefetchQueries: true
      }).then((result) => {
        const {
          data: { updateDeal }
        } = result;
        if (updateDeal?.success === true) {
          dispatch(showSuccessMessage("The Deal was successfully deleted."));
          handleClose();
        } else dispatch(showErrorMessage("An error occurred."));
      });
  };

  const addUpdateDeal = async (newContact = null, closeAfterUpdate = true) => {
    let tempContact = newContact ? newContact?.addContact?.contact : contact;
    let contactId = tempContact?._id;

    //// foreing deal ids:
    //// stageId, pipelineId, ownerId, contactId

    if (pipelineId && stageId && title && title.trim() !== "") {
      const cardId = stateApp.activeDeal?.cardId || stateApp.activeDeal?.id;

      const deal = {
        name: title ? title.trim() : null,
        offerPrice: label,
        notes: description ? description.trim() : null,
        status: dealState ? dealState : "open",
        closeDate:
          closeDate && closeDate !== ""
            ? new Date(`${closeDate}T08:00`).toUTCString()
            : null
      };

      if (cardId) {
        //// update existing deal

        let success = true;
        let allPromises = [];
        //// checking where it change
        if (
          contactId &&
          ((stateApp.activeDeal?.contacts?.length > 0 &&
            stateApp.activeDeal?.contacts[0]?.relatedObject?._id !==
              contactId) ||
            !stateApp.activeDeal.contacts ||
            stateApp.activeDeal.contacts.length <= 0)
        ) {
          //// updating the contact
          allPromises.push(
            new Promise((resolve, reject) => {
              upsertDealDescriptor({
                variables: {
                  dealId: cardId,
                  relatedObject: [contactId], // HERE
                  relatedObjectType: "Contact",
                  userId: stateApp.user.mongoId
                },
                refetchQueries: ["getPipeline", "getContactDeals"],
                awaitRefetchQueries: true
              }).then((result) => {
                const {
                  data: { upsertDealDescriptor }
                } = result;
                if (upsertDealDescriptor?.success === false) success = false;
                resolve();
              });
            })
          );
        }

        if (
          (stateApp.activeDeal?.owners?.length > 0 &&
            stateApp.activeDeal?.owners[0]?.relatedObject?._id !== ownerId) ||
          !stateApp.activeDeal.owners ||
          stateApp.activeDeal.owners.length <= 0
        ) {
          //// updating the owner
          if (ownerId) {
            allPromises.push(
              new Promise((resolve, reject) => {
                upsertDealDescriptor({
                  variables: {
                    dealId: cardId,
                    relatedObject: [ownerId],
                    relatedObjectType: "User",
                    userId: stateApp.user.mongoId
                  },
                  refetchQueries: ["getPipeline", "getContactDeals"],

                  awaitRefetchQueries: true
                }).then((result) => {
                  const {
                    data: { upsertDealDescriptor }
                  } = result;
                  if (upsertDealDescriptor?.success === false) success = false;
                  resolve();
                });
              })
            );
          }
          // removing the owner
          else if (!ownerId && stateApp.activeDeal?.owners?.length > 0) {
            allPromises.push(
              new Promise((resolve, reject) => {
                removeDealDescriptor({
                  variables: {
                    id: stateApp.activeDeal?.owners[0]?._id,
                    relatedObjectType: "User"
                  },
                  refetchQueries: ["getPipeline", "getContactDeals"],

                  awaitRefetchQueries: true
                }).then((result) => {
                  const {
                    data: { removeDealDescriptor }
                  } = result;
                  if (removeDealDescriptor?.success === false) success = false;
                  resolve();
                });
              })
            );
          }
        }

        //// checking if stage or pipe changed
        if (
          (stateApp.activeDeal?.laneId !== stageId ||
            stateApp.activeDeal?.pipeline !== pipelineId) &&
          stateApp.activeDeal?.descriptorId
        ) {
          //// updating the stageDealDescriptor
          allPromises.push(
            new Promise((resolve, reject) => {
              updateStageDealDescriptor({
                variables: {
                  descriptorId: stateApp.activeDeal.descriptorId,
                  relatedObject: stageId,
                  position: dealPosition ? dealPosition : 0,
                  pipeline:
                    stateApp.activeDeal?.pipeline !== pipelineId
                      ? pipelineId
                      : null
                },
                refetchQueries: ["getPipeline", "getContactDeals"],
                awaitRefetchQueries: true
              }).then((result) => {
                const {
                  data: { updateStageDealDescriptor }
                } = result;
                if (updateStageDealDescriptor?.success === false)
                  success = false;
                resolve();
              });
            })
          );
        }

        //// checking if deal change
        let updated = false;
        for (const k in deal) {
          if (deal[k] !== stateApp.activeDeal[k]) {
            updated = true;
            break;
          }
        }
        if (updated) {
          //// updating the deal
          deal._id = cardId;
          allPromises.push(
            new Promise((resolve, reject) => {
              updateDeal({
                variables: {
                  deal
                },
                refetchQueries: ["getPipeline", "getContactDeals"],
                awaitRefetchQueries: true
              }).then((result) => {
                const {
                  data: { updateDeal }
                } = result;
                if (updateDeal?.success === false) success = false;
                resolve();
              });
            })
          );
        }

        ////////////////////////////////////////////
        if (allPromises.length > 0)
          Promise.all(allPromises)
            .then((values) => {
              // if (success === true)
              // 	dispatch(
              // 		showSuccessMessage("The Deal was successfully updated.")
              // 	);
              // else
              // 	dispatch(
              // 		showErrorMessage("An error occurred during the update.")
              // 	);
            })
            .catch((reason) => {
              console.log(reason);
            });
      } else {
        //// add a new deal
        let variables = {
          deal,
          stageId,
          pipelineId,
          // ownerId,
          // ownerName,
          // contactId,
          // contactName,
          position: dealPosition,
          userId: stateApp.user.mongoId
        };

        if (ownerId) {
          let user = users.find((user) => user.value === ownerId);
          variables = user?.text
            ? { ...variables, ownerId, ownerName: user.text }
            : { ...variables, ownerId };
        }

        if (contactId) {
          variables = tempContact?.name
            ? { ...variables, contactId, contactName: tempContact.name }
            : { ...variables, contactId };
        }

        addDeal({
          variables,
          refetchQueries: [
            "getPipeline",
            "getContactDeals",
            "getContact",
            "getAllActivities",
            "getAllActivitiesForSearch",
            "getOpenDeals",
            "openDeals"
          ],
          awaitRefetchQueries: true
        });
      }
    }
  };

  const handleUpdate = async () => {
    if (transactData && contact && contact._id === "newEntity") {
      await addContact({
        variables: {
          contact: {
            ...newContact,
            name: contact.name,
            createBy: stateApp.user.mongoId,
            lastUpdateBy: stateApp.user.mongoId
          }
        },
        refetchQueries: [
          "getPaginatedContacts",
          "getContact",
          "getCustomLayer"
        ],
        awaitRefetchQueries: true
      });
    } else {
      await addUpdateDeal();
    }
  };

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

  const [getDeal, { data: getDealResult, loading: getDealLoading }] =
    useLazyQuery(GETDEAL, {
      fetchPolicy: "no-cache"
    });

  const refetchDeal = () => {
    getDeal({
      variables: { id: stateApp.activeDeal.cardId }
    });
  };

  const addSelectedContactToDeal = (contact) => {
    // HERE
    upsertDealDescriptor({
      variables: {
        dealId: cardId,
        relatedObject: [contact._id],
        relatedObjectType: "Contact",
        userId: stateApp.user.mongoId
      },
      refetchQueries: ["getPipeline", "getContactDeals"],
      awaitRefetchQueries: true
    }).then((result) => {
      const {
        data: { upsertDealDescriptor }
      } = result;

      // if (upsertDealDescriptor?.success === false) success = false;
      // resolve();

      refetchDeal();
    });
  };

  useEffect(() => {
    if (getDealResult?.deal?.deal?.contacts) {
      setStateApp((stateApp) => ({
        ...stateApp,
        activeDeal: {
          ...stateApp.activeDeal,
          // contacts: [...getDealResult.deal.deal.contacts],
          contacts: [
            ...getDealResult.deal.deal.contacts.map((c) => ({
              _id: c.descriptorId,
              name: c.name
            }))
          ]
        }
      }));
    }
  }, [getDealResult]);

  const getView = () => {
    if (stateApp.transactBarView === "Documents") {
      return (
        <Documents
          id={stateApp.activeDeal?.cardId}
          user_id={stateApp.user.email}
          isTransactPage={true}
        />
      );
    }
    if (stateApp.transactBarView === "Contacts") {
      return (
        <Contacts
          addSelectedContact={addSelectedContactToDeal}
          loading={getDealLoading}
          getDeal={refetchDeal}
        />
      );
    }
  };

  const [fileRequestCounter, setFileRequestCounter] = useState(1);

  const [getRecentFiles, { data: files }] = useLazyQuery(
    GETRECENTCONTACTFILES,
    {
      fetchPolicy: "cache-and-network",
      onCompleted: ({ getFileDescriptors }) => {
        let allActive = true;

        if (getFileDescriptors)
          for (let i = 0; i < getFileDescriptors.length; i++) {
            if (getFileDescriptors[i].fileState !== "active") {
              allActive = false;
              break;
            }
          }

        if (!allActive) {
          if (fileRequestCounter <= 40) {
            let waitBeforeRequestAgain = setTimeout(() => {
              setFileRequestCounter(fileRequestCounter + 1);
              getRecentFiles({
                variables: {
                  relatedObjectId: stateApp.activeDeal?.cardId,
                  relatedObjectType: "Deal",
                  limit: 2
                }
              });
              clearTimeout(waitBeforeRequestAgain);
            }, 1000);
          } else {
            setFileRequestCounter(1);
          }
        } else setFileRequestCounter(1);
      }
    }
  );
  const [viewFiles, { data: viewFileResult, loading: viewFileLoading }] =
    useLazyQuery(VIEWFILESQUERY, {
      fetchPolicy: "no-cache"
    });

  useEffect(() => {
    getRecentFiles({
      variables: {
        relatedObjectId: stateApp.activeDeal?.cardId,
        relatedObjectType: "Deal",
        limit: 2
      }
    });
  }, [stateApp.activeDeal?.cardId]);

  useEffect(() => {
    let ID = [];
    for (let i = 0; i < files?.getFileDescriptors.length; i++) {
      ID.push(files?.getFileDescriptors[i].fileId);
    }

    viewFiles({
      variables: { fileIds: ID }
    });
  }, [files]);

  const [expCardSubComponent, setExpCardSubComponent] = useState(null);
  const [expCardSubComponentTitle, setExpCardSubComponentTitle] =
    useState(null);
  const [showExpandableCard, setShowExpandableCard] = useState(false);
  const handleOpenExpandableCard = (subComponent, subComponentTitle) => {
    setExpCardSubComponent(subComponent);
    setExpCardSubComponentTitle(subComponentTitle);
    setShowExpandableCard(true);
  };
  const handleCloseExpandableCard = () => {
    setShowExpandableCard(false);
    setStateApp((state) => ({
      ...state,
      contactUpdated: null
    }));
  };
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
            Do you want to delete the selected deal?
          </DeleteConfirmationDialogContent>
        </Dialog>
      )}

      {props.isTransactPage &&
      stateApp.transactBarView !== "" &&
      (stateApp.activeDeal?.cardId || stateApp.activeDeal?.id) ? (
        <RightDialog
          open={props.open}
          width={props.width}
          handleClickDialogClose={() => {
            if (!updateDealLoading && !addContactLoading) {
              setStateApp((stateApp) => ({
                ...stateApp,
                dealDialog: false,
                activeDeal: { cardId: null, laneId: null },
                transactBarView: "",
                viewDoc: null
              }));
              handleClose();
            }
          }}
          isTransactPage={props.isTransactPage}
        >
          <div style={{ padding: "30px" }}>
            <Grid item xs={12} style={{ minHeight: "35px" }}>
              <h4
                style={{
                  float: "left",
                  fontSize: "1.1rem",
                  marginTop: "0px"
                }}
              >
                {stateApp.transactBarView}
              </h4>

              <div style={{ float: "right" }}>
                <IconButton
                  disabled={updateDealLoading || addContactLoading}
                  onClick={() =>
                    setStateApp((stateApp) => ({
                      ...stateApp,
                      transactBarView: "",
                      viewDoc: null
                    }))
                  }
                  size="small"
                >
                  <ArrowBackIcon />
                </IconButton>
              </div>
            </Grid>

            {getView()}
          </div>
        </RightDialog>
      ) : (
        <RightDialog
          open={props.open}
          handleClickDialogClose={() => {
            if (!updateDealLoading && !addContactLoading) {
              history.push(`${history.location.pathname.split("/lane")[0]}`)
              setStateApp((stateApp) => ({
                ...stateApp,
                dealDialog: false,
                activeDeal: { cardId: null, laneId: null }
              }));
              handleClose();
            }
          }}
          width={props.width}
          isTransactPage={props.isTransactPage}
          className={classes.mainRoot}
        >
          <div style={{ padding: "30px" }}>
            <Grid
              item
              container
              xs={12}
              style={{
                margin: 0,
                padding: 0,

                marginBottom: "1em"
              }}
              alignItems="center"
            >
              {/* <Grid
                item
                xs
                style={{
                  flexGrow: 1,
                  padding: 0,
                  marginRight: titleFocus ? 0 : '5px',
                }}
              >
              </Grid> */}

              <Grid container spacing={2} className={classes.gridStyle}>
                <Grid item xs={6} style={{ minHeight: "35px" }}>
                  <Typography
                    variant="h5"
                    style={{
                      // margin: '0 0 0 0',

                      float: "left",

                      fontSize: "1.3rem"
                    }}
                  >
                    Deal Information
                  </Typography>
                </Grid>

                <Grid item xs={6} style={{ minHeight: "35px" }}>
                  {!titleFocus && (
                    <Grid
                      item
                      xs
                      style={{
                        flexGrow: 0,
                        padding: 2
                        // marginTop: 2
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          float: "right"
                        }}
                      >
                        {(dealState === null || dealState === "open") && (
                          <>
                            <div
                              className={classes.dealStateOpenWon}
                              onClick={() => setDealState("won")}
                              style={{
                                marginRight: 8
                              }}
                            >
                              Won
                            </div>

                            <div
                              className={classes.dealStateOpenLost}
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
                                backgroundColor: "#a6e5c3",
                                fontWeight: "bold",
                                color: "#54a83c",
                                marginRight: 8
                              }}
                            >
                              Won
                            </div>
                            <div
                              className={classes.dealStateReopen}
                              onClick={() => setDealState(null)}
                            >
                              Re-open
                            </div>
                          </>
                        )}
                        {dealState === "lost" && (
                          <>
                            <div
                              className={classes.dealStateClosed}
                              style={{
                                backgroundColor: "#ffa8a8",
                                // borderStyle: "solid",
                                fontWeight: "bold",
                                color: "#f96060",
                                marginRight: 8
                              }}
                            >
                              Lost
                            </div>
                            <div
                              className={classes.dealStateReopen}
                              onClick={() => setDealState(null)}
                            >
                              Re-open
                            </div>
                          </>
                        )}
                        {(stateApp.activeDeal?.cardId ||
                          stateApp.activeDeal?.id) &&
                          stateApp.activeDeal?.laneId && (
                            <>
                              <IconButton
                                disabled={
                                  updateDealLoading || addContactLoading
                                }
                                onClick={openConfirmationDialog}
                                size="small"
                                component="span"
                                style={{
                                  background: "transparent",
                                  paddingLeft: "10px",
                                  align: "center"
                                }}
                              >
                                <DeleteIcon
                                  size="medium"
                                  className={classes.closeIcon}
                                />
                              </IconButton>
                            </>
                          )}
                      </div>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>

            <div className={classes.inputFieldDateRoot}>
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
                <></>
              )}

              <FormControl
                variant="outlined"
                className={classes.inputFieldDealName}
                style={{ marginLeft: "-15px" }}
                fullWidth
                size="small"
              >
                <TextField
                  margin="dense"
                  value={title}
                  variant="outlined"
                  placeholder="Click to enter deal name"
                  required
                  fullWidth
                  // error text that will prevent things
                  error={title && title !== "" ? false : true}
                  helperText={
                    title && title !== ""
                      ? ""
                      : "Enter a deal name to get started"
                  }
                  //   required
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  InputProps={{
                    classes: {
                      root: classes.dealNameRoot,
                      focused: classes.focused,
                      notchedOutline: classes.notchedOutline
                    }
                  }}
                  onBlur={() => setTitleFocus(false)}
                />
              </FormControl>

              <FormControl variant="outlined" fullWidth size="small">
                <Grid container className={classes.gridStyle}>
                  <Grid item xs={3}>
                    <div>Owner</div>
                  </Grid>
                  <Grid item xs={9}>
                    <Autocomplete
                      options={users}
                      onChange={(e, user) => {
                        setOwnerId(user?.value);
                      }}
                      value={
                        users.find((user) => user?.value === ownerId) || null
                      }
                      getOptionLabel={(option) => option.text}
                      getOptionSelected={(option) => option.value === ownerId}
                      classes={{
                        inputRoot: classes.dealOwnerRoot,
                        focused: classes.dealOwnerRootFocused,
                        popupIndicator: classes.popupIndicator
                      }}
                      renderInput={(params) => (
                        <TextField
                          margin="dense"
                          {...params}
                          variant="outlined"
                          className={classes.inputFieldOwner}
                          InputLabelProps={{
                            ...params.InputLabelProps,
                            shrink: true,
                            classes: {
                              root: classes.dealOwnerLabel
                            }
                          }}
                          placeholder="Assign Owner"
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <>
                                <InputAdornment position="start">
                                  <Avatar className={classes.dealOwnerAvatar}>
                                    {users.find(
                                      (user) => user?.value === ownerId
                                    ) ? (
                                      <CustomAvatar
                                        diglog={true}
                                        email={
                                          users.find(
                                            (user) => user?.value === ownerId
                                          ).email
                                        }
                                        text={
                                          users
                                            .find(
                                              (user) => user?.value === ownerId
                                            )
                                            .text.toString()
                                            .toUpperCase()
                                            .split(" ").length > 1
                                            ? users
                                                .find(
                                                  (user) =>
                                                    user?.value === ownerId
                                                )
                                                .text.toString()
                                            : "Add Owner"
                                        }
                                      />
                                    ) : (
                                      "AO"
                                    )}
                                    {/* {users.find(
                                      (user) => user?.value === ownerId
                                    )
                                      ? users
                                          .find(
                                            (user) => user?.value === ownerId
                                          )
                                          .text.toString()
                                          .toUpperCase()
                                          .split(" ").length > 1
                                        ? users
                                            .find(
                                              (user) => user?.value === ownerId
                                            )
                                            .text.toString()
                                            .toUpperCase()
                                            .split(" ")[0][0] +
                                          "" +
                                          users
                                            .find(
                                              (user) => user?.value === ownerId
                                            )
                                            .text.toString()
                                            .toUpperCase()
                                            .split(" ")[1][0]
                                        : "AO"
                                      : "AO"} */}
                                  </Avatar>
                                </InputAdornment>
                                {params.InputProps.startAdornment}
                              </>
                            )
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </FormControl>

              <FormControl variant="outlined" fullWidth size="small">
                <Grid container className={classes.gridStyle}>
                  <Grid item xs={3}>
                    <div>Close Date</div>
                  </Grid>
                  <Grid item xs={9}>
                    <TextField
                      margin="dense"
                      type="date"
                      variant="outlined"
                      value={closeDate}
                      placeholder=""
                      fullWidth
                      className={classes.inputFieldDate}
                      onChange={(e) => {
                        setCloseDate(e.target.value);
                      }}
                      InputLabelProps={{
                        shrink: true
                      }}
                      InputProps={{
                        classes: {
                          root: classes.dateRoot,
                          focused: classes.focused,
                          notchedOutline: classes.notchedOutline
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </FormControl>

              <FormControl variant="outlined" fullWidth size="small">
                <Grid container className={classes.gridStyle}>
                  <Grid item xs={3}>
                    <div>Flowline</div>
                  </Grid>

                  <Grid item xs={9}>
                    <TextField
                      variant="outlined"
                      margin="dense"
                      select
                      SelectProps={{
                        native: true,
                        classes: {
                          icon: classes.icon
                        }
                      }}
                      size="small"
                      value={pipelineId}
                      className={classes.inputFieldFlowline}
                      onChange={(e) => {
                        settingNewPipeWithDefaultStage(e.target.value, true);
                      }}
                      InputProps={{
                        classes: {
                          root: classes.flowlineRoot,
                          notchedOutline: classes.notchedOutlineFlow,
                          focused: classes.notchedOutlineFlowFocused
                        }
                      }}
                      fullWidth
                    >
                      {selectedPipe && (
                        <option value={selectedPipe._id}>
                          {selectedPipe.name}
                        </option>
                      )}
                      {sortedPipelines?.map((pipeline, i) => {
                        if (selectedPipe && selectedPipe._id === pipeline._id)
                          return;
                        return (
                          <option value={pipeline._id} key={i}>
                            {pipeline.name}
                          </option>
                        );
                      })}
                    </TextField>
                  </Grid>
                </Grid>
              </FormControl>

              <FormControl variant="outlined" fullWidth size="small">
                <Grid container className={classes.gridStyle}>
                  <Grid item xs={3}>
                    <div>Flow Stage</div>
                  </Grid>

                  <Grid item xs={9}>
                    <TextField
                      margin="dense"
                      variant="outlined"
                      select
                      SelectProps={{
                        native: true,
                        classes: {
                          icon: classes.icon
                        }
                      }}
                      size="small"
                      value={stageId}
                      className={classes.inputFieldFlowStage}
                      onChange={(e) => {
                        settingNewStageAndFindNextAvailablePosition(
                          e.target.value,
                          true
                        );
                      }}
                      InputProps={{
                        classes: {
                          root: classes.flowlineRoot,
                          notchedOutline: classes.notchedOutlineFlow,
                          focused: classes.notchedOutlineFlowFocused
                        }
                      }}
                      fullWidth
                    >
                      {stagesToChoose &&
                        stagesToChoose.map((stage, i) => (
                          <option value={stage._id} key={i}>
                            {stage.name}
                          </option>
                        ))}
                    </TextField>
                  </Grid>
                </Grid>
              </FormControl>

              <FormControl variant="outlined" fullWidth size="small">
                <Grid container className={classes.gridStyle}>
                  <Grid item xs={3}>
                    <div>Offer Price</div>
                  </Grid>
                  <Grid item xs={9}>
                    <TextField
                      margin="dense"
                      variant="outlined"
                      value={label}
                      error={isNaN(label)}
                      helperText={
                        isNaN(label) ? "Offer Price must be a valid number" : ""
                      }
                      className={classes.inputFieldCustomTextInput}
                      fullWidth
                      onChange={(e) => {
                        setLabel(e.target.value);
                      }}
                      InputProps={{
                        inputComponent: NumberFormatCustom,
                        classes: {
                          root: classes.customDataTextInputRoot,
                          focused: classes.focused,
                          notchedOutline: classes.notchedOutline
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </FormControl>

              <TextField
                //   autoFocus
                margin="dense"
                variant="outlined"
                multiline
                rows={8}
                value={description}
                label="Description"
                fullWidth
                multiline
                //   required
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                className={classes.notes}
              />

              {originationDate && (
                <div className={classes.originationDate}>
                  Deal Creation Date:{" "}
                  {moment(originationDate).format("M/DD/YYYY, hh:mmA")}
                </div>
              )}
              <div>
                <AddDialogeUploadZone
                  isTransactPage={true}
                  filesData={viewFileResult}
                  id={stateApp.activeDeal?.cardId}
                  loading={viewFileLoading}
                  disabled={!stateApp.activeDeal?.cardId}
                  handleOpenExpandableCard={handleOpenExpandableCard}
                ></AddDialogeUploadZone>
              </div>
            </div>
          </div>
        </RightDialog>
      )}
    </>
  );
}

export default AddDealDialog;
