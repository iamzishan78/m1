import React, { useState, useEffect, useContext, useRef } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import { AppContext } from '../../../AppContext';
import { CONTACT } from '../../../graphQL/useQueryContact';
import { ADDCONTACT } from '../../../graphQL/useMutationAddContact';
import AutocompEntityNamesVirtualizeList from '../../Shared/M1nTable/components/SubComponents/AutocompEntityNamesVirtualizeList';
import { PAGINATEDCONTACTSQUERY } from '../../../graphQL/useQueryPaginatedContacts';
import { GETMONGOUSERS as GETUSERS } from '../../../graphQL/useQueryGetUsers';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  CircularProgress,
  Dialog,
  Typography,
  Avatar,
} from '@material-ui/core';
import RightDialog from './RightDialog';
import moment from 'moment';
import {
  deepEqual,
  deepEqualObjects,
  setStateIfDeepEqual,
} from '../../Shared/functions';
import TrackToggleButton from '../../Shared/TrackToggleButton';
import { TRACKBYOBJECTID } from '../../../graphQL/useQueryTrackByObjectId';
import TaggerWithIcon from '../../Shared/TaggerWithIcon';
import CommentsWithIcon from '../../Shared/CommentsWithIcon';
import DeleteConfirmationDialogContent from '../../Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent';
import { useDispatch, useSelector } from 'react-redux';
import { ADDDEAL } from 'graphQL/useMutationAddDeal';
import InputAdornment from '@material-ui/core/InputAdornment';
import { UPDATEDEAL } from 'graphQL/useMutationUpdateDeal';
import { UPSERTDEALDESCRIPTOR } from 'graphQL/useMutationUpsertDealDescriptor';
import { UPDATESTAGEDEALDESCRIPTOR } from 'graphQL/useMutationUpdateStageDealDescriptor';
import {
  setFlowState,
  showErrorMessage,
  showSuccessMessage,
} from '../../../actions';
import { GETPIPELINES } from 'graphQL/useQueryPipelines';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import Drawer from '../../Transact/components/Drawer';
import Documents from '../../Shared/Documents';
import AddDialogeUploadZone from './AddDialogUploadZone';
import { GETRECENTCONTACTFILES } from 'graphQL/useQueryGetContactFiles';
import { VIEWFILEQUERY, VIEWFILESQUERY } from 'graphQL/useQueryViewFile';
import { GETDEAL } from 'graphQL/useQueryDeal';
import ExpandableCardProvider from '../../ExpandableCard/ExpandableCardProvider';
import Contacts from 'components/FlowDrawer/Contacts';
import EventIcon from '@material-ui/icons/Event';
import './style/dialog.css';

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

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    '&  .MuiPaper-root': {
      maxWidth: '400px',
      padding: '25px',
    },
  },
  dialogTitle: {
    textAlign: 'center',
  },
  dialogContentText: {
    textAlign: 'center',
  },
  inputField: {
    marginBottom: '10px',
  },
  dateLabel: {
    transform: 'translate(10px, 2px) scale(0.75) !important',
    backgroundColor: '#fff !important',
    padding: '0 6px',
  },
  shrinkLabel: {
    backgroundColor: '#fff !important',
    padding: '0 6px',
  },
  inputFieldDateRoot: {
    '& .MuiDialog-root': {
      // zIndex: 99999,
    },
  },
  inputFieldDate: {
    marginBottom: '30px',
    '& .MuiInputBase-input': {
      paddingTop: '10.5px',
      paddingBottom: '10.5px',
    },
  },
  progress: {
    marginLeft: '30px',
    verticalAlign: 'middle',
  },
  // dialogFooter: {
  // 	display: "flex",
  // 	justifyContent: "flex-end",
  // 	paddingTop: "10px",
  // },
  // footerButton: {
  // 	letterSpacing: "1px",
  // 	textTransform: "capitalize",
  // 	fontWeight: "bold",
  // 	padding: "8px 20px",
  // },

  label: {
    backgroundColor: 'white',
  },

  closeIcon: {
    fill: theme.palette.secondary.main,
    '&:hover': {
      fill: 'red',
    },
  },
  topBtnGroup: {},
  inputField: {
    marginBottom: '30px',
    outline: 'none',
  },
  dealStateOpenWon: {
    padding: '8px 16px',
    borderRadius: 5,
    cursor: 'pointer',
    backgroundColor: '#d9d9d9',
    '&:hover': {
      backgroundColor: '#a6e5c3',
      // borderStyle: "solid",
      fontWeight: 'bold',
      color: '#54a83c',
    },
  },
  dealStateOpenLost: {
    padding: '8px 16px',
    borderRadius: 5,
    cursor: 'pointer',
    backgroundColor: '#d9d9d9',
    '&:hover': {
      backgroundColor: '#ffa8a8',
      // borderStyle: "solid",
      fontWeight: 'bold',
      color: '#f96060',
    },
  },
  dealStateClosed: {
    padding: '8px 16px',
    borderRadius: 18,

    // color: "#fff",
  },
  dealStateReopen: {
    padding: '2px 10px',
    cursor: 'pointer',
    borderRadius: 5,
    border: '1px solid gray',
  },
  originationDate: {
    paddingBottom: '12px',
    fontSize: 12,
    letterSpacing: 2,
    textAlign: 'center',
  },
  dialog: {
    zIndex: '9999999999 !important',
  },
  notes: {
    backgroundColor: '#FFFCDC',
    display: 'block',
    width: '100%',

    '& .MuiOutlinedInput-root': {
      width: '100%',
    },
  },
  dialogExpCard: {
    zIndex: '9999999999999999999 !important',
  },
  root: {
    '&.Mui-focused fieldset': {
      border: '1px solid black',
      backgroundColor: 'transparent',
    },
    '&:hover': {
      backgroundColor: '#EBEBEB',
    },
    '&:active': {
      border: '1px solid black',
      backgroundColor: '#fff',
    },
  },
  notchedOutline: {
    border: 0,
  },
  dealOwnerRoot: {
    // This matches the specificity of the default styles at https://github.com/mui-org/material-ui/blob/v4.11.3/packages/material-ui-lab/src/Autocomplete/Autocomplete.js#L90
    '&[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-child': {
      // Default left padding is 6px
      paddingLeft: 26,
    },

    '& .MuiOutlinedInput-notchedOutline': {
      border: 0,
    },
    '&:hover.MuiOutlinedInput-root': {
      backgroundColor: '#EBEBEB',
    },
    '&:hover .MuiAutocomplete-popupIndicator': {
      visibility: 'visible',
      padding: '2px',
      marginRight: '-2px',
    },
  },
  dealOwnerRootFocused: {
    '& .MuiOutlinedInput-notchedOutline': {
      border: '1px solid black',
    },
  },
  dealOwnerAvatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    color: '#fff',
    fontSize: '0.6rem',
    backgroundColor: '#4880F6',
    padding: '0.5em',
  },
  dealOwnerLabel: {
    marginLeft: 4,
    marginTOP: -2,
  },
  popupIndicator: {
    visibility: 'hidden',
    padding: '2px',
    marginRight: '-2px',
    '&:hover': {
      visibility: 'visible',
    },
  },
}));

const newContact = {
  name: '',
  mobilePhone: '',
  homePhone: '',
  primaryEmail: '',
  address1: '',
  address2: '',
  city: '',
  country: '',
  state: '',
  zip: '',
};

function AddDealDialog(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { selectedPipe, pipelines, pipeToShow } = useSelector(
    ({ Flow }) => Flow
  );
  const [selectedContactToAdd, setSelectedContactToAdd] = useState(null);
  const [stateApp, setStateApp] = useContext(AppContext);
  const [title, setTitle] = useState(''); // title change from contact.name to dealName
  const [label, setLabel] = useState('');
  const [stageId, setStageId] = useState(null);
  const [dealPosition, setDealPosition] = useState(null);
  const [dealState, setDealState] = useState(null);
  const [description, setDescription] = useState('');
  const [pipelineId, setPipelineId] = useState(selectedPipe?._id);
  const [stagesToChoose, setStagesToChoose] = useState([]);
  const [ownerId, setOwnerId] = useState('');
  const [cardId, setCardId] = useState('');
  const [users, setUsers] = useState([]);
  const [closeDate, setCloseDate] = useState(new Date());
  const [colaborators, setColaborators] = useState([]);
  const [originationDate, setOriginationDate] = useState(null);

  const [nameAutValue, setNameAutValue] = useState({ name: '', id: 0, _id: 0 });
  const [mongoEntitiesArray, setMongoEntitiesArray] = useState([]);
  const [nameAutInputValue, NameAutInputValue] = useState('');
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

  const [valid, setValid] = useState({});

  const [getPipelines, { data: pipelinesData }] = useLazyQuery(GETPIPELINES);

  const [
    addContact,
    {
      data: addContactData,
      called: addContactCalled,
      loading: addContactLoading,
    },
  ] = useMutation(ADDCONTACT);

  const [getAllUsers, { data: userLists }] = useLazyQuery(GETUSERS, {
    fetchPolicy: 'cache-and-network',
  });

  const [addDeal, { data: dealData }] = useMutation(ADDDEAL);
  const [updateDeal, { loading: updateDealLoading }] = useMutation(UPDATEDEAL);
  const [upsertDealDescriptor] = useMutation(UPSERTDEALDESCRIPTOR);
  const [updateStageDealDescriptor] = useMutation(UPDATESTAGEDEALDESCRIPTOR);

  const [getContact, { data: cData }] = useLazyQuery(CONTACT, {
    fetchPolicy: 'cache-and-network',
  });

  // CONTACT

  const [
    getPaginatedContacts,
    { data: allContacts, loading, fetchMore: fetchMorePaginatedContacts },
  ] = useLazyQuery(PAGINATEDCONTACTSQUERY, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });

  const [contact, setContact] = useState({});

  useEffect(() => {
    getPipelines();
  }, []);

  useEffect(() => {
    if (stateApp.transactBarView !== '') {
      console.log('stateApp.transactBarView', stateApp.transactBarView);
      handleValidate();

      if (!(stateApp.activeDeal?.cardId || stateApp.activeDeal?.id)) {
        addUpdateDeal(null, false);
      }
    }
  }, [stateApp.transactBarView]);

  useEffect(() => {
    if (dealData) {
      console.log('dealData', dealData);

      setStateApp((stateApp) => ({
        ...stateApp,
        activeDeal: dealData?.addDeal?.deal,
      }));
    }
  }, [dealData]);

  useEffect(() => {
    if (pipelinesData) {
      //// select first one as default
      if (pipelinesData.pipelines && pipelinesData.pipelines.length > 0)
        dispatch(
          setFlowState({
            selectedPipe: pipelinesData.pipelines[0],
            pipelines: pipelinesData.pipelines,
          })
        );
      else
        dispatch(
          setFlowState({
            selectedPipe: null,
            pipelines: [],
            pipeToShow: false,
          })
        );
    }
  }, [pipelinesData]);

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
    getAllUsers();
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
          search: nameAutInputValue,
        },
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
        isTracked: dataTrack.trackByObjectId ? true : false,
      });
    }
  }, [dataTrack]);
  // TRACK END

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
    const cardId = stateApp.activeDeal?.cardId || stateApp.activeDeal?.id;
    const laneId = stateApp.activeDeal?.laneId;

    if (cardId && laneId && stateApp.dealDialog) {
      //  auto-fills

      // TRACK
      setCardId(cardId);
      trackByObjectId({
        variables: {
          userId: stateApp.user.mongoId,
          objectId: cardId.toLowerCase(),
        },
      });

      const card = stateApp.activeDeal;
      setTitle(card.name ? card.name : '');
      setDealState(card.status ? card.status : null);
      setLabel(card.offerPrice ? card.offerPrice : '');
      setDescription(card.notes ? card.notes : '');
      // setPipelineId
      settingNewPipeWithDefaultStage(
        card.pipeline ? card.pipeline : null,
        false
      );
      // setStageId
      settingNewStageAndFindNextAvailablePosition(laneId, false);
      setCloseDate(
        card.closeDate
          ? moment.parseZone(card.closeDate).format('yyyy-MM-DD')
          : ''
      );
      setDealPosition(card.position ? card.position : null);
      // setColaborators(card.colaborators ? card.colaborators : []);
      setOriginationDate(card.ts ? card.ts : null);

      setOwnerId(
        card.owners?.length > 0
          ? card.owners[0]?.relatedObject?._id
            ? card.owners[0]?.relatedObject?._id
            : card.ownerId
          : stateApp.user.mongoId
      );

      if (card.contacts?.length > 0)
        // setting contact
        setNameAutValue({
          name: card.contacts[0]?.relatedObject?.entity?.name,
          _id: card.contacts[0]?.relatedObject?._id,
        });
      else setNameAutValue(null);
    } else if (props.contact) {
      setNameAutValue({ name: props.contact.name, _id: props.contact._id });
    } else if (props.contactId) {
      getContact({
        variables: {
          contactId: props.contactId,
        },
      });
    }
  }, [stateApp.activeDeal, props.contact, stateApp.dealDialog, stateApp.user]);

  const handleValidate = () => {
    const tempValid = {
      ...valid,
      title: !title,
    };
    setValid(tempValid);

    return !Object.values(tempValid).reduce((acc, cur) => acc + cur);
  };

  const handleClose = () => {
    handleValidate();
    handleUpdate();
    setTitle('');
    setLabel('');
    setDescription('');
    setStageId(null);
    setDealState(null);
    if (props.isTransactPage) setNameAutValue(null);
    setNameAutInputValue('');
    setPipelineId(null);
    setOwnerId(null);
    setCloseDate('');
    setColaborators([]);
    setOriginationDate(null);
    setTarget({});
    setCardId('');
    setDealPosition(null);
    if (props.isTransactPage) setContact({});
    setStateApp((stateApp) => ({
      ...stateApp,
      dealDialog: false, // some genius level coding here.
      addDealDialog: false, // not sure why different flags were used here
      activeDeal: { cardId: null, laneId: null },
      transactBarView: '',
      viewDoc: null,
    }));
    setValid({});
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
          deal: { _id: cardId, IsDeleted: true },
        },
        refetchQueries: ['getPipeline', 'getContactDeals'],
        awaitRefetchQueries: true,
      }).then((result) => {
        const {
          data: { updateDeal },
        } = result;
        if (updateDeal?.success === true) {
          dispatch(showSuccessMessage('The Deal was successfully deleted.'));
          handleClose();
        } else dispatch(showErrorMessage('An error occurred.'));
      });
  };

  const addUpdateDeal = async (newContact = null, closeAfterUpdate = true) => {
    let tempContact = newContact ? newContact?.addContact?.contact : contact;
    let contactId = tempContact?._id;

    //// foreing deal ids:
    //// stageId, pipelineId, ownerId, contactId

    if (pipelineId && stageId && title && title.trim() !== '') {
      const cardId = stateApp.activeDeal?.cardId || stateApp.activeDeal?.id;

      const deal = {
        name: title ? title.trim() : null,
        offerPrice: label,
        notes: description ? description.trim() : null,
        status: dealState ? dealState : 'open',
        closeDate:
          closeDate && closeDate !== ''
            ? new Date(`${closeDate}T08:00`).toUTCString()
            : null,
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
                  relatedObjectType: 'Contact',
                  userId: stateApp.user.mongoId,
                },
                refetchQueries: ['getPipeline', 'getContactDeals'],
                awaitRefetchQueries: true,
              }).then((result) => {
                const {
                  data: { upsertDealDescriptor },
                } = result;
                if (upsertDealDescriptor?.success === false) success = false;
                resolve();
              });
            })
          );
        }

        if (
          ownerId &&
          ((stateApp.activeDeal?.owners?.length > 0 &&
            stateApp.activeDeal?.owners[0]?.relatedObject?._id !== ownerId) ||
            !stateApp.activeDeal.owners ||
            stateApp.activeDeal.owners.length <= 0)
        ) {
          //// updating the owner
          allPromises.push(
            new Promise((resolve, reject) => {
              upsertDealDescriptor({
                variables: {
                  dealId: cardId,
                  relatedObject: [ownerId],
                  relatedObjectType: 'User',
                  userId: stateApp.user.mongoId,
                },
                refetchQueries: ['getPipeline', 'getContactDeals'],
                awaitRefetchQueries: true,
              }).then((result) => {
                const {
                  data: { upsertDealDescriptor },
                } = result;
                if (upsertDealDescriptor?.success === false) success = false;
                resolve();
              });
            })
          );
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
                      : null,
                },
                refetchQueries: ['getPipeline', 'getContactDeals'],
                awaitRefetchQueries: true,
              }).then((result) => {
                const {
                  data: { updateStageDealDescriptor },
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
                  deal,
                },
                refetchQueries: ['getPipeline', 'getContactDeals'],
                awaitRefetchQueries: true,
              }).then((result) => {
                const {
                  data: { updateDeal },
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
          userId: stateApp.user.mongoId,
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
            'getPipeline',
            'getContactDeals',
            'getContact',
            'getAllActivities',
            'getAllActivitiesForSearch',
            'getOpenDeals',
            'openDeals',
          ],
          awaitRefetchQueries: true,
        });
      }

      // if (closeAfterUpdate) handleClose();
    }
  };

  const handleUpdate = async () => {
    if (transactData && contact && contact._id === 'newEntity') {
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
          'getPaginatedContacts',
          'getContact',
          'getCustomLayer',
        ],
        awaitRefetchQueries: true,
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
      fetchPolicy: 'no-cache',
    });

  const refetchDeal = () => {
    getDeal({
      variables: { id: stateApp.activeDeal.cardId },
    });
  };

  const addSelectedContactToDeal = (contact) => {
    // HERE
    upsertDealDescriptor({
      variables: {
        dealId: cardId,
        relatedObject: [contact._id],
        relatedObjectType: 'Contact',
        userId: stateApp.user.mongoId,
      },
      refetchQueries: ['getPipeline', 'getContactDeals'],
      awaitRefetchQueries: true,
    }).then((result) => {
      const {
        data: { upsertDealDescriptor },
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
              name: c.name,
            })),
          ],
        },
      }));
    }

    // 	let metadata = { ...stateApp.activeDeal, contacts: [ upsertDealDescriptor.descriptor[0], ...stateApp.activeDeal.contacts ] };
  }, [getDealResult]);

  const getView = () => {
    if (stateApp.transactBarView === 'Documents') {
      return (
        <Documents
          id={stateApp.activeDeal?.cardId}
          user_id={stateApp.user.email}
          isTransactPage={true}
        />
      );
    }
    if (stateApp.transactBarView === 'Contacts') {
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
      fetchPolicy: 'cache-and-network',
      onCompleted: ({ getFileDescriptors }) => {
        let allActive = true;

        if (getFileDescriptors)
          for (let i = 0; i < getFileDescriptors.length; i++) {
            if (getFileDescriptors[i].fileState !== 'active') {
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
                  relatedObjectType: 'Deal',
                },
              });
              clearTimeout(waitBeforeRequestAgain);
            }, 1000);
          } else {
            setFileRequestCounter(1);
            // dispatch(
            //   showWarningMessage(
            //     "Please wait a few seconds until the last uploaded file is ready, then reload the app"
            //   )
            // );
          }
        } else setFileRequestCounter(1);
      },
    }
  );
  const [viewFiles, { data: viewFileResult, loading: viewFileLoading }] =
    useLazyQuery(VIEWFILESQUERY, {
      fetchPolicy: 'no-cache',
    });

  useEffect(() => {
    getRecentFiles({
      variables: {
        relatedObjectId: stateApp.activeDeal?.cardId,
        relatedObjectType: 'Deal',
        limit: 2,
      },
    });
  }, [stateApp.activeDeal?.cardId]);
  useEffect(() => {
    let ID = [];
    for (let i = 0; i < files?.getFileDescriptors.length; i++) {
      ID.push(files?.getFileDescriptors[i].fileId);
    }

    viewFiles({
      variables: { fileIds: ID },
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
      contactUpdated: null,
    }));
  };
  return (
    <>
      {showExpandableCard && (
        <Dialog
          className={classes.dialogExpCard}
          fullWidth
          maxWidth="xl"
          open={showExpandableCard}
          onClose={handleCloseDialog}
        >
          <ExpandableCardProvider
            expanded={true}
            handleCloseExpandableCard={handleCloseExpandableCard}
            title={'Documents'}
            subTitle={' '}
            parent="table"
            mouseX={0}
            mouseY={0}
            position="relative"
            cardLeft={'0'}
            cardTop={'0'}
            zIndex={1201}
            cardWidthExpanded="100%"
            cardHeightExpanded="100%"
            targetSourceId={stateApp?.activeDeal?.cardId}
            targetLabel={'deals'}
            noTrackAvailable={true}
            component={
              <div
                style={{
                  width: '100%',
                  backgroundColor: '#fff',
                  minHeight: '100%',
                }}
              >
                {/* //// ViewAll card top bar //// */}

                {expCardSubComponent}
              </div>
            }
          />
        </Dialog>
      )}
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
      stateApp.transactBarView !== '' &&
      (stateApp.activeDeal?.cardId || stateApp.activeDeal?.id) ? (
        <RightDialog
          open={props.open}
          width={props.width}
          onClose={() =>
            setStateApp((stateApp) => ({
              ...stateApp,
              transactBarView: '',
              viewDoc: null,
            }))
          }
          isTransactPage={props.isTransactPage}
        >
          <div style={{ padding: '30px' }}>
            <Grid item xs={12} style={{ minHeight: '35px' }}>
              <h4
                style={{
                  margin: '0 0 15px 0',
                  float: 'left',
                  fontSize: '1.1rem',
                }}
              >
                {stateApp.transactBarView}
              </h4>

              <div style={{ float: 'right' }}>
                <IconButton
                  disabled={updateDealLoading || addContactLoading}
                  onClick={() =>
                    setStateApp((stateApp) => ({
                      ...stateApp,
                      transactBarView: '',
                      viewDoc: null,
                    }))
                  }
                  size="small"
                >
                  {/* // this is the close icon "x" button for sub panels\ */}
                  <CloseIcon fontSize="small" />
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
              setStateApp((stateApp) => ({
                ...stateApp,
                dealDialog: false,
                activeDeal: { cardId: null, laneId: null },
              }));
              handleClose();
            }
          }}
          width={props.width}
          isTransactPage={props.isTransactPage}
        >
          <div style={{ padding: '30px' }}>
            {/* <h4 style={{ margin: "0 0 30px 0", fontSize: "16px" }}>
        Recent Activities
      </h4> */}
            <Grid item xs={12} style={{ minHeight: '35px' }}>
              <h4
                style={{
                  margin: '0 0 15px 0',
                  float: 'left',
                  fontSize: '1.1rem',
                }}
              >
                Deal Information
              </h4>

              <div style={{ float: 'right' }}>
                {(stateApp.activeDeal?.cardId || stateApp.activeDeal?.id) &&
                  stateApp.activeDeal?.laneId && (
                    <>
                      {/* <CommentsWithIcon
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
                    /> */}

                      <IconButton
                        disabled={updateDealLoading || addContactLoading}
                        onClick={openConfirmationDialog}
                        size="small"
                        component="span"
                        style={{
                          margin: '3px 8px 0 8px',
                          background: 'transparent',
                        }}
                      >
                        <DeleteIcon
                          size="medium"
                          className={classes.closeIcon}
                        />
                      </IconButton>
                    </>
                  )}

                {/* <IconButton
									disabled={updateDealLoading || addContactLoading}
									onClick={handleClose}
									size="small"
								>
									<CloseIcon className={classes.closeIcon} fontSize="small" />
								</IconButton> */}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  margin: '8px 0',
                }}
              >
                {(dealState === null || dealState === 'open') && (
                  <>
                    <div
                      className={classes.dealStateOpenWon}
                      onClick={() => setDealState('won')}
                      style={{
                        marginRight: 8,
                        marginBottom: 10,
                      }}
                    >
                      Won
                    </div>

                    <div
                      className={classes.dealStateOpenLost}
                      onClick={() => setDealState('lost')}
                      style={{
                        marginBottom: 10,
                      }}
                    >
                      Lost
                    </div>
                  </>
                )}
                {dealState === 'won' && (
                  <>
                    <div
                      className={classes.dealStateClosed}
                      style={{
                        backgroundColor: '#a6e5c3',
                        fontWeight: 'bold',
                        color: '#54a83c',
                        marginRight: 8,
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
                {dealState === 'lost' && (
                  <>
                    <div
                      className={classes.dealStateClosed}
                      style={{
                        backgroundColor: '#ffa8a8',
                        // borderStyle: "solid",
                        fontWeight: 'bold',
                        color: '#f96060',
                        marginRight: 8,
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
              </div>
            </Grid>

            <div className={classes.inputFieldDateRoot}>
              <TextField
                margin="dense"
                value={title}
                label="Deal Name"
                variant="outlined"
                required
                error={valid['title']}
                helperText={
                  valid['title'] ? 'Enter a deal name to get started' : ''
                }
                fullWidth
                //   required
                onChange={(e) => {
                  setTitle(e.target.value);
                  setValid({
                    ...valid,
                    title: false,
                  });
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
                // <div className={classes.inputField}>
                //   <Grid container>
                //     <Grid item xs={12}>
                //       <AutocompEntityNamesVirtualizeList
                //         mongoEntitiesArray={mongoEntitiesArray}
                //         setMongoEntitiesArray={setMongoEntitiesArray}
                //         nameAutValue={nameAutValue}
                //         setNameAutValue={setNameAutValue}
                //         nameAutInputValue={nameAutInputValue}
                //         setNameAutInputValue={setNameAutInputValue}
                //         variant="outlined"
                //         label="Contact Name"
                //         hasNextPage={hasNextPage}
                //         isNextPageLoading={isNextPageLoading}
                //         loadNextPage={loadNextPage}
                //       />
                //     </Grid>
                //   </Grid>
                // </div>
                <></>
              )}

              <TextField
                margin="dense"
                variant="outlined"
                value={label}
                error={isNaN(label)}
                helperText={
                  isNaN(label) ? 'Offer Price must be a valid number' : ''
                }
                label="Offer Price"
                fullWidth
                onChange={(e) => {
                  setLabel(e.target.value);
                }}
                className={classes.inputField}
                InputProps={{
                  inputComponent: NumberFormatCustom,
                }}
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
                  style={{ paddingLeft: 0 }}
                  onChange={(e) => {
                    setCloseDate(e.target.value);
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    classes: {
                      root: classes.root,
                      focused: classes.focused,
                      notchedOutline: classes.notchedOutline,
                    },
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
                  // disabled={stateApp.activeDeal?.cardId ? true : false}
                  native
                  value={pipelineId}
                  onChange={(e) => {
                    // setPipelineId(e.target.value);
                    settingNewPipeWithDefaultStage(e.target.value, true);
                  }}
                  fullWidth
                  label="Pipeline"
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
                    // setStageId(e.target.value);
                    settingNewStageAndFindNextAvailablePosition(
                      e.target.value,
                      true
                    );
                  }}
                  fullWidth
                  label="Deal Stage"
                >
                  {stagesToChoose &&
                    stagesToChoose.map((stage, i) => (
                      <option value={stage._id} key={i}>
                        {stage.name}
                      </option>
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
                    setOwnerId(user?.value);
                  }}
                  value={users.find((user) => user?.value === ownerId) || null}
                  getOptionLabel={(option) => option.text}
                  getOptionSelected={(option) => option.value === ownerId}
                  classes={{
                    inputRoot: classes.dealOwnerRoot,
                    focused: classes.dealOwnerRootFocused,
                    popupIndicator: classes.popupIndicator,
                  }}
                  renderInput={(params) => (
                    <TextField
                      margin="dense"
                      {...params}
                      variant="outlined"
                      label="Deal Owner"
                      InputLabelProps={{
                        ...params.InputLabelProps,
                        shrink: true,
                        classes: {
                          root: classes.dealOwnerLabel,
                        },
                      }}
                      placeholder="Assign Owner"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <InputAdornment position="start">
                              <Avatar className={classes.dealOwnerAvatar}>
                                {users.find((user) => user?.value === ownerId)
                                  ? users
                                      .find((user) => user?.value === ownerId)
                                      .text.toString()
                                      .toUpperCase()
                                      .split(' ').length > 1
                                    ? users
                                        .find((user) => user?.value === ownerId)
                                        .text.toString()
                                        .toUpperCase()
                                        .split(' ')[0][0] +
                                      '' +
                                      users
                                        .find((user) => user?.value === ownerId)
                                        .text.toString()
                                        .toUpperCase()
                                        .split(' ')[1][0]
                                    : 'AO'
                                  : 'AO'}
                              </Avatar>
                            </InputAdornment>
                            {params.InputProps.startAdornment}
                          </>
                        ),
                      }}
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
                  Origination Date:{' '}
                  {moment(originationDate).format('M/DD/YYYY, hh:mmA')}
                </div>
              )}
              <div>
                {/* AddDailogeUploadZone */}
                <AddDialogeUploadZone
                  isTransactPage={true}
                  filesData={viewFileResult}
                  id={stateApp.activeDeal?.cardId}
                  loading={viewFileLoading}
                  disabled={!stateApp.activeDeal?.cardId}
                  handleOpenExpandableCard={handleOpenExpandableCard}
                ></AddDialogeUploadZone>
              </div>
              {/* <div className={classes.dialogFooter}>
								<Button
									variant="contained"
									color="default"
									size="medium"
									disableElevation
									onClick={() => {
										if (!updateDealLoading && !addContactLoading) {
											handleClose();
										}
									}}
									disabled={updateDealLoading || addContactLoading}
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
									onClick={() => {
										handleValidate() && handleUpdate()
									}}
									className={classes.footerButton}
									disabled={
										updateDealLoading || addContactLoading || isNaN(label) || !valid
									}
								>
									{updateDealLoading || addContactLoading ? (
										<CircularProgress size={14} />
									) : (

										"Save"

									)}
								</Button>
							</div> */}
            </div>
          </div>
        </RightDialog>
      )}
    </>
  );
}

export default AddDealDialog;
