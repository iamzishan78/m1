import React, { useState, useEffect, useContext, Fragment, useCallback } from 'react';
import NumberFormat from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { TextField, FormControl, Grid, Dialog, Avatar, CircularProgress } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { useLazyQuery, useMutation } from '@apollo/client';
import { get } from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom/cjs/react-dom.production.min';

import AddDialogeUploadZone from 'components/ContactDetailCard/components/AddDialogUploadZone';
import DealTasksProgressZone from 'components/ContactDetailCard/components/DealTasksProgressZone';
import RightDialog from 'components/ContactDetailCard/components/RightDialog';
import Contacts from 'components/FlowDrawer/Contacts';
import MapProvider from 'components/Map/MapProvider';
import { findBoundsMap } from 'components/MapControls/commonHelper';
import { drawBoundaries } from 'components/MapControls/components/DrawShapes/drawShapesHelpers';
import Documents from 'components/Shared/Documents';
import { getRandomColor } from 'components/Shared/functions/ui';
import DeleteConfirmationDialogContent from 'components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent';
import CustomAvatar from 'components/Shared/ui/CustomAvatar';
import DealComments from 'components/Transact/components/DealComments';
import DealDialogHeader from 'components/Transact/components/DealDialog/DealDialogHeader';
import Drawer from 'components/Transact/components/Drawer';
import { TransactContext } from 'components/Transact/TransactContext';

import { ADDCONTACT } from 'graphQL/useMutationAddContact';
import { ADDDEAL, CREATE_DEAL_DEFAULT_SETTINGS } from 'graphQL/useMutationAddDeal';
import { REMOVEDEALDESCRIPTOR } from 'graphQL/useMutationRemoveDealDescriptor';
import { UPDATEDEAL } from 'graphQL/useMutationUpdateDeal';
import { UPDATE_STAGE_DEAL_DESCRIPTOR } from 'graphQL/useMutationUpdateStageDealDescriptor';
import { UPDATESTAGEDEALDESCRIPTORS } from 'graphQL/useMutationUpdateStageDealDescriptors';
import { UPSERTDEALDESCRIPTOR } from 'graphQL/useMutationUpsertDealDescriptor';
import { CONTACT } from 'graphQL/useQueryContact';
import { GETDEAL } from 'graphQL/useQueryDeal';
import { GET_DEAL_SHAPES } from 'graphQL/useQueryDealShapes';
import { GET_FLOW_ASSOCIATED_SUMMARY } from 'graphQL/useQueryFlowAssociatedData';
import { GETRECENTCONTACTFILES } from 'graphQL/useQueryGetContactFiles';
import { GET_DEAL_SETTINGS } from 'graphQL/useQueryGetDealSettings';
import { GETMONGOUSERS } from 'graphQL/useQueryGetUsers';
import { VIEWFILESQUERY } from 'graphQL/useQueryViewFile';

import { globalStateController } from 'hookstate/globalStateController';
import { layerFiltersController } from 'hookstate/layerFiltersController';
import { mapControlsController } from 'hookstate/mapControlsController';
import { mapStateController } from 'hookstate/mapStateController';
import { tableGlobalController } from 'hookstate/tableController';

import { showErrorMessage, showSuccessMessage } from 'actions';
import { AppContext } from 'AppContext';

import DealTasksDetails from '../DealTasksDetails';
import ExistingDeal from './ExistingDeal';
import AssociatedFlowDealDetails from '../AssociatedFlowDealDetails';

import './dialog.css';

const THREE = 3;
const FIVE = 5;
const FOURTY = 40;

function NumberFormatCustom(props) {
	const { inputRef, onChange, ...other } = props;

	return (
		<NumberFormat
			{...other}
			getInputRef={inputRef}
			onValueChange={values => {
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

const formatIt = mdata => {
	return {
		type: 'FeatureCollection',
		features: mdata
			.filter(feature => feature.geometry && feature.geometry.coordinates)
			.map(feature => {
				return {
					type: 'Feature',
					properties: feature,
					geometry: {
						type: feature.geometry.type,
						coordinates: feature.geometry.coordinates,
					},
				};
			}),
	};
};

export const useDealMapFlyto = mapReady => {
	const [getDealShapes, { data: dataDealShapes }] = useLazyQuery(GET_DEAL_SHAPES, {
		fetchPolicy: 'cache-and-network',
		skip: true,
	});
	const [stateApp] = useContext(AppContext);

	const handleFlyto = useCallback(
		async (contactIds, dealId) => {
			await getDealShapes({
				variables: {
					contactIds,
					dealId,
				},
			});
		},
		[getDealShapes]
	);

	useEffect(() => {
		if (dataDealShapes && dataDealShapes.dealShapes?.length && stateApp.transactBarView === 'Map') {
			globalStateController.updateState({ universalLoader: true });

			const formattedFeatures = formatIt(dataDealShapes.dealShapes).features;
			const unitLayerIds = [];
			const tractLayerIds = [];

			// Loop through each deal shape to categorize the IDs based on their layerType
			dataDealShapes?.dealShapes?.forEach(shape => {
				if (shape.layerType === 'unit') {
					unitLayerIds.push(shape._id); // Store 'unit' layerType IDs
				} else if (shape.layerType === 'parcel') {
					tractLayerIds.push(shape._id); // Store 'tract' layerType IDs
				}
			});

			if (formattedFeatures.length > 0 && window.mapRef) {
				// Ensure we have valid formatted features
				findBoundsMap(formattedFeatures, window.mapRef, {
					top: 50,
					bottom: 50,
					left: 50,
					right: 50,
				});
				mapControlsController.updateState({ mapGridCardActivated: false });

				// Draw boundries on multiple shapes
				drawBoundaries(formattedFeatures);

				// Filter Units
				layerFiltersController.setVariables('Units', {
					filters: [{ field: '_id', value: unitLayerIds }],
				});

				// Filter Units
				layerFiltersController.setVariables('Parcels', {
					filters: [{ field: '_id', value: tractLayerIds }],
				});
			}
		}
		globalStateController.updateState({ universalLoader: false });
	}, [dataDealShapes, stateApp.transactBarView, mapReady]);

	return { handleFlyto };
};

NumberFormatCustom.propTypes = {
	inputRef: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};

const useStyles = makeStyles(theme => ({
	mainRoot: {},
	dialogTitle: {
		textAlign: 'center',
	},
	dialogContentText: {
		textAlign: 'center',
	},
	inputFieldOwner: {
		marginBottom: '7px',
	},
	inputFieldDate: {
		marginBottom: '7px',
	},
	inputFieldFlowline: {
		marginBottom: '7px',
	},
	inputFieldFlowStage: {
		marginBottom: '7px',
	},
	inputFieldCustomTextInput: {
		marginBottom: '7px',
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
	scrollbar: {
		overflowX: 'hidden',
		overflowY: 'overlay',
	},
	dealDetailRoot: {
		'& .MuiDialog-paper': {
			overflowY: 'hidden',
		},
	},
	contentRoot: {
		overflowY: 'overlay',
		overflowX: 'hidden',
		marginRight: '60px',
	},
	inputFieldRoot: {
		padding: '15px 25px 0px',
	},
	progress: {
		marginLeft: '30px',
		verticalAlign: 'middle',
	},

	label: {
		backgroundColor: 'white',
	},
	topBtnGroup: {},
	gridStyle: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
	originationDate: {
		paddingBottom: '12px',
		paddingTop: '4px',
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
		marginTop: 25,
		// marginBottom: 25,

		'& .MuiOutlinedInput-root': {
			width: '100%',
			'& fieldset': {
				borderColor: 'white',
			},
		},
	},
	dialogExpCard: {
		zIndex: '9999999999999999999 !important',
	},
	dateRoot: {
		border: '1px solid #EBEBEB',

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

	flowlineRoot: {
		'&:hover': {
			backgroundColor: '#EBEBEB',
			'& .MuiOutlinedInput-notchedOutline': {
				border: 0,
			},
			'& .MuiSelect-icon': {
				display: 'inline-block',
			},
		},
		'&:active': {
			border: '1px solid black',
			backgroundColor: '#EBEBEB',
		},
	},
	notchedOutlineFlow: {
		border: '0.2px solid #EBEBEB',
	},
	notchedOutlineFlowFocused: {
		'& .MuiOutlinedInput-notchedOutline': {
			border: '1px solid black',
		},
	},
	icon: {
		display: 'none',
	},
	customDataTextInputRoot: {
		border: '1px solid #EBEBEB',
		'&.Mui-focused fieldset': {
			border: '1px solid black',
			backgroundColor: 'transparent',
		},
		'&:hover': {
			backgroundColor: '#EBEBEB',
		},
	},
	notchedOutline: {
		border: 0,
	},
	dealOwnerRoot: {
		border: '1px solid #EBEBEB',

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
		width: theme.spacing(THREE),
		height: theme.spacing(THREE),
		color: '#fff',
		fontSize: '0.6rem',
		backgroundColor: '#4880F6',
		padding: '0.5em',
	},
	dealOwnerLabel: {
		marginLeft: 4,
		// marginTOP: -2,
	},
	popupIndicator: {
		visibility: 'hidden',
		padding: '2px',
		marginRight: '-2px',
		'&:hover': {
			visibility: 'visible',
		},
	},
	dealContainer: {
		maxHeight: 'calc(100vh - 147px) !important',
	},
	tags: {
		'& fieldset': {
			border: 'none',
		},
		width: '100%',
	},

	rootDiv: {
		width: ({ width }) => (width ? width : '500px'),
		'& > * + *': {
			marginTop: theme.spacing(FIVE),
		},
		'& .MuiAutocomplete-clearIndicator': {
			display: 'none',
		},
	},
	publicLeftBottom: {
		float: 'none',
		flexDirection: 'row',
		alignSelf: 'unset',
		margin: 0,
		'& .MuiTypography-root': {
			display: 'none',
		},
		'& .h4Before': { margin: '0 13px', color: '#202020 !important' },
		'& .h4After': { margin: '0 0 0 13px', color: '#B7B7B7 !important' },
	},
	chip: {
		'& .MuiAutocomplete-inputRoot': { minHeight: '56px' },
		'& .MuiChip-root': {
			backgroundColor: '#ECEDED',
			color: '#606060',
			fontWeight: '700',
			borderRadius: '4px',
		},
	},
	input: {
		'& input': {
			caretColor: ({ showPlusAddIcon }) => (!showPlusAddIcon ? '' : 'transparent'),
			color: ({ showPlusAddIcon }) => (!showPlusAddIcon ? '' : '#008ebf'),
			backgroundColor: ({ showPlusAddIcon }) => (!showPlusAddIcon ? '' : '#D5F4FF'),
			maxWidth: ({ showPlusAddIcon }) => (!showPlusAddIcon ? '' : '33px'),
			width: ({ showPlusAddIcon }) => (!showPlusAddIcon ? '' : '33px'),
			height: ({ showPlusAddIcon }) => (!showPlusAddIcon ? '' : '32px'),
			fontSize: ({ showPlusAddIcon }) => (!showPlusAddIcon ? '' : '25px'),
			margin: ({ showPlusAddIcon }) => (!showPlusAddIcon ? '' : '3px'),
			padding: ({ showPlusAddIcon }) => (!showPlusAddIcon ? '' : '0px !important'),
			borderRadius: ({ showPlusAddIcon }) => (!showPlusAddIcon ? '' : '50%'),
			textAlign: ({ showPlusAddIcon }) => (!showPlusAddIcon ? '' : 'center'),
			cursor: ({ showPlusAddIcon }) => (!showPlusAddIcon ? '' : 'pointer'),
			'&:hover': {
				boxShadow: ({ showPlusAddIcon }) =>
					!showPlusAddIcon
						? ''
						: '0px 2px 2px -1px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.12), 0px 1px 10px 0px rgba(0,0,0,0.1)',
				backgroundColor: ({ showPlusAddIcon }) => (!showPlusAddIcon ? '' : 'rgba(0, 0, 0, 0.08)'),
			},
			transition: ({ showPlusAddIcon }) =>
				!showPlusAddIcon
					? ''
					: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
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
	let history = useHistory();
	const classes = useStyles();
	const { selectedPipe, pipelines, pipeToShow } = useSelector(({ Flow }) => Flow);
	const [newCommentsIds, setNewCommentsIds] = useState([]);
	const [stateApp, setStateApp] = useContext(AppContext);
	const [stateTransact, setStateTransact] = useContext(TransactContext);

	const { globalStateValues } = globalStateController.useState(['mapReady'], 'globalStateValues');

	const [title, setTitle] = useState(''); // title change from contact.name to dealName
	const [titleFocus, setTitleFocus] = useState(false);
	const [label, setLabel] = useState('');
	const [closedPrice, setClosedPrice] = useState('');
	const [totalNRA, setTotalNRA] = useState('');
	const [stageId, setStageId] = useState(null);
	const [dealPosition, setDealPosition] = useState(null);
	const [dealState, setDealState] = useState(null);
	const [description, setDescription] = useState('');
	const [pipelineId, setPipelineId] = useState('');
	const [stagesToChoose, setStagesToChoose] = useState([]);
	const [ownerId, setOwnerId] = useState('');
	const [users, setUsers] = useState([]);
	const [receivedDate, setReceivedDate] = useState('');
	const [bidDate, setBidDate] = useState('');
	const [dueDate, setDueDate] = useState('');
	const [closeDate, setCloseDate] = useState('');

	const [nameAutValue, setNameAutValue] = useState({ name: '', id: 0, _id: 0 });
	const [uploadedFiles, setUploadedFiles] = useState([]);
	let [transactData] = useState(props.transactData ? { ...props.transactData } : null);

	const [mapSettings, setMapSettings] = useState(null);

	const [getDeal, { data: getDealResult }] = useLazyQuery(GETDEAL, {
		fetchPolicy: 'no-cache',
	});
	const [addContact, { data: addContactData, loading: addContactLoading }] = useMutation(ADDCONTACT);

	const [getAllMongoUsers, { data: userLists }] = useLazyQuery(GETMONGOUSERS, {
		fetchPolicy: 'no-cache',
	});

	const [addDeal, { loading: addDealLoading }] = useMutation(ADDDEAL);
	const [createDealDefaultSettings] = useMutation(CREATE_DEAL_DEFAULT_SETTINGS);
	const [updateDeal, { loading: updateDealLoading }] = useMutation(UPDATEDEAL);
	const [upsertDealDescriptor, { loading: upsertDealDescriptorLoading }] = useMutation(UPSERTDEALDESCRIPTOR);
	const [removeDealDescriptor] = useMutation(REMOVEDEALDESCRIPTOR);
	const [updateStageDealDescriptor, { data: updatedStageDealDescriptor }] = useMutation(UPDATE_STAGE_DEAL_DESCRIPTOR);
	const [updateStageDealDescriptors] = useMutation(UPDATESTAGEDEALDESCRIPTORS);

	const [getContact, { data: cData }] = useLazyQuery(CONTACT, {
		fetchPolicy: 'cache-and-network',
	});

	// DEAL SETTINGS
	const [getDealSettings, { data: dealSettings }] = useLazyQuery(GET_DEAL_SETTINGS, {
		fetchPolicy: 'cache-and-network',
	});

	const [contact, setContact] = useState({});

	const { mapStateValues } = mapStateController.useState(['mapVars'], 'mapStateValues');

	useEffect(() => {
		return () =>
			setStateTransact(stateTransact => ({
				...stateTransact,
				dealToCreate: {},
			}));
	}, [setStateTransact]);

	//? pre saving the deal id in case deal descriptors
	//? are created before deal
	useEffect(() => {
		if (updatedStageDealDescriptor) {
			const {
				updateStageDealDescriptor: { stageDealDescriptors },
			} = updatedStageDealDescriptor;
			if (stageDealDescriptors) {
				setStateTransact(stateTransact => ({
					...stateTransact,
					dealToCreate: { _id: stageDealDescriptors.descriptorObject },
				}));
			}
		}
	}, [setStateTransact, updatedStageDealDescriptor]);

	useEffect(() => {
		getDeal({
			variables: { id: stateApp.activeDeal?.cardId },
		});
	}, [getDeal, stateApp.activeDeal?.cardId]);

	// For creating a deal
	// useEffect(() => {
	const finishCreatingDeal = useCallback(
		async dealData => {
			if (dealData?.addDeal?.deal) {
				const {
					addDeal: { deal },
				} = dealData;
				const defaultSettings = get(dealSettings, 'dealSettings', []);
				if (defaultSettings.length > 0) {
					// deal default settings
					const stageDealDescriptors = defaultSettings.map(setting => ({
						//? creating stage deal descriptors json
						relatedObject: setting._id,
						descriptorObject: deal._id,
						pipeline: pipelineId,
						approver: get(setting, 'stageDealDescriptor.descriptorObject.assignee', null),
						tasks: setting.tasks,
						isCurrent: setting._id === stageId,
					}));
					// api call for default setting
					createDealDefaultSettings({
						variables: {
							stageDealDescriptors,
							dealId: deal._id,
							stageId,
						},
					}).then(() => {
						setStateApp(stateApp => ({
							...stateApp,
							activeDeal: deal,
						}));
						setStateTransact(stateTransact => ({
							...stateTransact,
							dealToCreate: {},
						}));
						getDealSettings({
							variables: {
								dealId: deal._id,
								pipelineId: pipelineId,
							},
						});
					});
				} else {
					setStateApp(stateApp => ({
						...stateApp,
						activeDeal: deal,
					}));
					setStateTransact(stateTransact => ({
						...stateTransact,
						dealToCreate: {},
					}));
				}
			}
		},
		[createDealDefaultSettings, dealSettings, getDealSettings, pipelineId, setStateApp, setStateTransact, stageId]
	);

	useEffect(() => {
		if (stateApp.activeDeal && pipelineId) {
			// fetching deal settings
			const dealId = stateApp.activeDeal._id || stateTransact?.dealToCreate?._id;
			getDealSettings({
				variables: {
					dealId,
					pipelineId: pipelineId,
				},
			});
		}
	}, [getDealSettings, pipelineId, stateApp.activeDeal, stateTransact?.dealToCreate]);

	const settingNewStageAndFindNextAvailablePosition = useCallback(
		(stageId, findPosition, localPipelineId = pipelineId) => {
			setStageId(stageId);

			if (findPosition) {
				if (
					stateApp.activeDeal?.laneId &&
					stateApp.activeDeal?.descriptorId === localPipelineId &&
					stateApp.activeDeal?.laneId === stageId
				) {
					setDealPosition(stateApp.activeDeal?.position);
				} else {
					if (pipeToShow?._id === localPipelineId) {
						let position = -1;

						if (pipeToShow.lanes) {
							const lane = pipeToShow.lanes.find(lane => lane.id === stageId);

							if (lane && lane.cards) {
								position = lane.cards.reduce((maxPosition, card) => {
									return card.metadata?.position > maxPosition ? card.metadata.position : maxPosition;
								}, -1);
							}
						}

						setDealPosition(position + 1);
					} else {
						setDealPosition(null);
					}
				}
			}
		},
		// TODO: requires code refactoring which will take time disabling lint rule for hotfix
		 
		[
			pipeToShow?._id,
			pipeToShow?.lanes,
			stateApp.activeDeal?.descriptorId,
			stateApp.activeDeal?.laneId,
			stateApp.activeDeal?.position,
		]
	);

	const settingNewPipeWithDefaultStage = useCallback(
		(pipelineId, defaultStage) => {
			setPipelineId(pipelineId);
			if (!pipelineId) {
				setStagesToChoose([]);
				setStageId(null);
				setDealPosition(null);
			} else if (pipelines) {
				const i = pipelines.findIndex(pipe => pipe._id === pipelineId);

				if (i >= 0 && pipelines[i] && pipelines[i].stages) {
					setStagesToChoose(pipelines[i].stages);

					if (defaultStage) {
						settingNewStageAndFindNextAvailablePosition(pipelines[i].stages[0]?._id, true, pipelineId);
					}
				}
			}
		},
		[pipelines, settingNewStageAndFindNextAvailablePosition]
	);

	useEffect(() => {
		if (pipelines.length > 0 && props.contactId) {
			let activePipeline = {};
			const isExist = !!pipelines.find(p => p._id === selectedPipe?._id);
			if (selectedPipe && isExist) {
				activePipeline = pipelines.find(p => p._id === selectedPipe._id);
			} else {
				activePipeline = pipelines[0];
			}
			settingNewPipeWithDefaultStage(activePipeline._id, true);
		}
	}, [pipelines, props.contactId, selectedPipe, settingNewPipeWithDefaultStage]);

	useEffect(() => {
		if (stateApp.dealDialog && !stateApp.activeDeal?.cardId && selectedPipe?._id) {
			settingNewPipeWithDefaultStage(selectedPipe._id, true);
		}
	}, [selectedPipe?._id, settingNewPipeWithDefaultStage, stateApp.activeDeal?.cardId, stateApp.dealDialog]);

	useEffect(() => {
		getAllMongoUsers();
	}, [getAllMongoUsers]);

	useEffect(() => {
		if (cData?.contact) {
			setNameAutValue(cData?.contact ? { name: cData.contact.name, _id: cData.contact._id } : {});
		}
	}, [cData]);

	useEffect(() => {
		if (nameAutValue?.name) {
			setContact(nameAutValue);
		}
	}, [nameAutValue]);

	const addUpdateDeal = async (newContact = null) => {
		let tempContact = newContact ? newContact?.addContact?.contact : contact;
		let contactId = tempContact?._id;

		//// foreing deal ids:
		//// stageId, pipelineId, ownerId, contactId

		if (pipelineId && stageId && title && title.trim() !== '') {
			const cardId = stateApp.activeDeal?.cardId || stateApp.activeDeal?._id;
			let selectedReceivedDate = receivedDate;
			if (receivedDate instanceof Date) {
				selectedReceivedDate = moment(receivedDate).format('YYYY-MM-DD');
			}
			let selectedBidDate = bidDate;
			if (bidDate instanceof Date) {
				selectedBidDate = moment(bidDate).format('YYYY-MM-DD');
			}
			let selectedCloseDate = closeDate;
			if (closeDate instanceof Date) {
				selectedCloseDate = moment(closeDate).format('YYYY-MM-DD');
			}
			let selectedDueDate = dueDate;
			if (closeDate instanceof Date) {
				selectedCloseDate = moment(dueDate).format('YYYY-MM-DD');
			}
			const deal = {
				name: title ? title.trim() : null,
				offerPrice: label,
				notes: description ? description.trim() : null,
				status: dealState ? dealState : 'open',
				closedPrice: closedPrice,
				totalNRA: totalNRA,
				receivedDate:
					selectedReceivedDate && selectedReceivedDate !== ''
						? new Date(`${selectedReceivedDate}T08:00`).toUTCString()
						: null,
				bidDate: selectedBidDate && selectedBidDate !== '' ? new Date(`${selectedBidDate}T08:00`).toUTCString() : null,
				dueDate: selectedDueDate && selectedDueDate !== '' ? new Date(`${selectedDueDate}T08:00`).toUTCString() : null,
				closeDate:
					selectedCloseDate && selectedCloseDate !== '' ? new Date(`${selectedCloseDate}T08:00`).toUTCString() : null,
				mapSettings: mapSettings,
			};

			if (cardId) {
				//// update existing deal

				let allPromises = [];
				//// checking where it change
				if (
					contactId &&
					((stateApp.activeDeal?.contacts?.length > 0 &&
						stateApp.activeDeal?.contacts[0]?.relatedObject?._id !== contactId) ||
						!stateApp.activeDeal.contacts ||
						stateApp.activeDeal.contacts.length <= 0)
				) {
					//// updating the contact
					allPromises.push(
						new Promise(resolve => {
							upsertDealDescriptor({
								variables: {
									dealId: cardId,
									relatedObject: [contactId],
									relatedObjectType: 'Contact',
									userId: stateApp.user.mongoId,
								},
								refetchQueries: ['getPipeline', 'getContactDeals', 'getContactSummary'],
								awaitRefetchQueries: true,
							}).then(() => {
								resolve();
							});
						})
					);
				}

				if (
					(stateApp.activeDeal?.owners?.length > 0 && stateApp.activeDeal?.owners[0]?.relatedObject?._id !== ownerId) ||
					!stateApp.activeDeal.owners ||
					stateApp.activeDeal.owners.length <= 0
				) {
					//// updating the owner

					if (ownerId) {
						allPromises.push(
							new Promise(resolve => {
								upsertDealDescriptor({
									variables: {
										dealId: cardId,
										relatedObject: [ownerId],
										relatedObjectType: 'User',
										userId: stateApp.user.mongoId,
									},
									refetchQueries: ['getPipeline', 'getContactDeals', 'getContactSummary'],

									awaitRefetchQueries: true,
								}).then(() => {
									resolve();
								});
							})
						);
					}
					// removing the owner
					else if (!ownerId && stateApp.activeDeal?.owners?.length > 0) {
						allPromises.push(
							new Promise(resolve => {
								removeDealDescriptor({
									variables: {
										id: stateApp.activeDeal?.owners[0]?._id,
										relatedObjectType: 'User',
									},
									refetchQueries: ['getPipeline', 'getContactDeals', 'getContactSummary'],

									awaitRefetchQueries: true,
								}).then(() => {
									resolve();
								});
							})
						);
					}
				}

				//// checking if stage or pipe changed
				if (
					(stateApp.activeDeal?.laneId !== stageId || stateApp.activeDeal?.pipeline !== pipelineId) &&
					stateApp.activeDeal?.descriptorId
				) {
					//// updating the stageDealDescriptor
					allPromises.push(
						new Promise(resolve => {
							const movedCardDescriptor = {
								// _id: stateApp.activeDeal.descriptorId,
								descriptorObject: stateApp.activeDeal._id,
								descriptorType: 'Deal',
								relatedObject: stageId,
								relatedObjectType: 'Stage',
								// position: dealPosition ? dealPosition : 0,
								pipeline: pipelineId,
								pipelineType: 'Pipeline',
								isCurrent: true,
								user: stateApp.user.mongoId,
							};

							updateStageDealDescriptors({
								variables: {
									stageDealDescriptors: [
										{
											_id: stateApp.activeDeal.descriptorId,
											isCurrent: false,
										},
									],
								},
								refetchQueries: ['getPipeline'],
							});

							updateStageDealDescriptor({
								variables: {
									descriptor: movedCardDescriptor,
								},
								refetchQueries: ['getPipeline', 'getContactDeals', 'getContactSummary'],
								awaitRefetchQueries: true,
							}).then(() => {
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
						new Promise(resolve => {
							updateDeal({
								variables: {
									deal,
								},
								refetchQueries: ['getPipeline', 'getContactDeals', 'getContactSummary'],
								awaitRefetchQueries: true,
							}).then(() => {
								resolve();
							});
						})
					);
				}

				////////////////////////////////////////////
				if (allPromises.length > 0) {
					Promise.all(allPromises)
						.then(() => {
							// if (success === true)
							// 	dispatch(
							// 		showSuccessMessage("The Deal was successfully updated.")
							// 	);
							// else
							// 	dispatch(
							// 		showErrorMessage("An error occurred during the update.")
							// 	);
						})
						.catch(reason => {
							console.log(reason);
						});
				}
			} else if (!addDealLoading) {
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
					let user = users.find(user => user.value === ownerId);
					variables = user?.text ? { ...variables, ownerId, ownerName: user.text } : { ...variables, ownerId };
				}

				if (contactId) {
					variables = tempContact?.name
						? { ...variables, contactId, contactName: tempContact.name }
						: { ...variables, contactId };
				}

				const ID = [];
				for (let i = 0; i < uploadedFiles.length; i++) {
					ID.push({
						id: uploadedFiles[i].addFileDescriptor.file.id,
						name: uploadedFiles[i].addFileDescriptor.file.name,
					});
				}

				if (ID.length > 0) {
					variables = { ...variables, files: ID };
				}

				if (newCommentsIds.length > 0) {
					variables = { ...variables, comments: newCommentsIds };
				}
				addDeal({
					variables: { ...variables, deal: { ...variables.deal, _id: get(stateTransact, 'dealToCreate._id') } },
					refetchQueries: [
						'getPipeline',
						'getContactDeals',
						'getContact',
						'getAllActivities',
						'getAllActivitiesForSearch',
						'getOpenDeals',
						'openDeals',
						'getContactSummary',
					],
					awaitRefetchQueries: true,
				}).then(result => {
					finishCreatingDeal(result?.data);
				});
			}
		}
		tableGlobalController.refetch();
		setUploadedFiles([]);
	};

	const { handleFlyto } = useDealMapFlyto(globalStateValues.mapReady);

	useEffect(() => {
		if (stateApp.transactBarView !== 'Deal') {
			if (!(stateApp.activeDeal?.cardId || stateApp.activeDeal?.id || stateApp.activeDeal?._id)) {
				addUpdateDeal(null, false);
			}
		}
		if (stateApp.transactBarView === 'Map' && window.mapRef) {
			const dealId = stateApp.activeDeal?.cardId || stateApp.activeDeal?._id;
			const contactIds = stateApp?.activeDeal?.contacts?.map(contact => contact._id) || [];
			handleFlyto(contactIds, dealId);
		}
		 
	}, [handleFlyto, stateApp.activeDeal, stateApp.transactBarView, globalStateValues.mapReady]);

	useEffect(() => {
		if (userLists && userLists.allMongoUsers) {
			setUsers(
				userLists.allMongoUsers.map(user => ({
					value: user._id,
					text: user.name,
					email: user.email,
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
	}, [getContact, props.contactId]);

	useEffect(() => {
		const cardId = stateApp.activeDeal?.cardId || stateApp.activeDeal?.id;
		const laneId = stateApp.activeDeal?.laneId;

		if (cardId && laneId && stateApp.dealDialog) {
			const card = stateApp.activeDeal;
			setTitle(card.name ? card.name : '');
			setDealState(card.status ? card.status : null);
			setLabel(card.offerPrice ? card.offerPrice : '');
			setClosedPrice(card.closedPrice ? card.closedPrice : '');
			setTotalNRA(card.totalNRA ? card.totalNRA : '');
			setDescription(card.notes ? card.notes : '');
			// setPipelineId
			settingNewPipeWithDefaultStage(card.pipeline ? card.pipeline : null, false);
			// setStageId
			settingNewStageAndFindNextAvailablePosition(laneId, false);
			setReceivedDate(card.receivedDate ? moment.parseZone(card.receivedDate).format('yyyy-MM-DD') : '');
			setBidDate(card.bidDate ? moment.parseZone(card.bidDate).format('yyyy-MM-DD') : '');
			setDueDate(card.dueDate ? moment.parseZone(card.dueDate).format('yyyy-MM-DD') : '');
			setCloseDate(card.closeDate ? moment.parseZone(card.closeDate).format('yyyy-MM-DD') : '');
			setMapSettings(card.mapSettings ? card.mapSettings : null);
			setDealPosition(card.position ? card.position : null);

			setOwnerId(card.owners[0]?.relatedObject?._id || card.ownerId);

			if (card.contacts?.length > 0) {
				// setting contact
				setNameAutValue({
					name: card.contacts[0]?.relatedObject?.entity?.name,
					_id: card.contacts[0]?.relatedObject?._id,
				});
			} else {
				setNameAutValue(null);
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
		getContact,
		props.contact,
		props.contactId,
		settingNewPipeWithDefaultStage,
		settingNewStageAndFindNextAvailablePosition,
		stateApp.activeDeal,
		stateApp.dealDialog,
		stateApp.user?.mongoId,
	]);
	// }, [stateApp.activeDeal, props.contact, stateApp.dealDialog, stateApp.user]);

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
				refetchQueries: ['getPaginatedContacts', 'getContact', 'getCustomLayer'],
				awaitRefetchQueries: true,
			});
		} else {
			await addUpdateDeal();
		}
	};

	const handleClose = async () => {
		// handleValidate();
		await handleUpdate();
		setTitle('');
		setLabel('');
		setClosedPrice('');
		setTotalNRA('');
		setDescription('');
		setStageId(null);
		setDealState(null);
		if (props.isTransactPage) {
			setNameAutValue(null);
		}
		setPipelineId(null);
		setOwnerId(null);
		setReceivedDate('');
		setBidDate('');
		setCloseDate('');
		setMapSettings(null);
		setDealPosition(null);
		if (props.isTransactPage) {
			setContact({});
		}
		setStateApp(stateApp => ({
			...stateApp,
			dealDialog: false,
			addExistingDeal: false,
			activeDeal: { cardId: null, laneId: null },
			transactBarView: 'Deal',
			viewDoc: null,
		}));
	};

	useEffect(() => {
		if (addContactData) {
			addUpdateDeal(addContactData);
		}
		 
	}, [addContactData]);

	useEffect(() => {
		if (
			stateApp?.activeDeal?.mapSettings?.mapDefaultPosition != null &&
			mapStateValues?.mapVars !== stateApp?.activeDeal?.mapSettings?.mapDefaultPosition
		) {
			mapStateController.updateState({ mapVars: stateApp?.activeDeal?.mapSettings?.mapDefaultPosition });
		}
	}, [mapSettings, mapStateValues?.mapVars, stateApp?.activeDeal?.mapSettings?.mapDefaultPosition]);

	const deleteDeal = async () => {
		const cardId = stateApp.activeDeal?.cardId || stateApp.activeDeal?.id;

		if (cardId) {
			await updateDeal({
				variables: {
					deal: { _id: cardId, IsDeleted: true },
				},
				refetchQueries: ['getPipeline', 'getContactDeals', 'getContactSummary'],
				awaitRefetchQueries: true,
			}).then(result => {
				const {
					data: { updateDeal },
				} = result;
				if (updateDeal?.success === true) {
					dispatch(showSuccessMessage('The Deal was successfully deleted.'));
					handleClose();
				} else {
					dispatch(showErrorMessage('An error occurred.'));
				}
			});
		}
	};

	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const openConfirmationDialog = () => {
		setDeleteDialogOpen(true);
	};
	const handleCloseDialog = () => {
		setDeleteDialogOpen(false);
	};

	const deleteFunc = async () => {
		try {
			await deleteDeal();
			history.push(`${history.location.pathname.split('/lane')[0]}`);
		} catch (err) {
			throw new Error(err);
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

	const refetchDeal = useCallback(() => {
		getDeal({
			variables: { id: stateApp?.activeDeal?.cardId },
		});
	}, [getDeal, stateApp?.activeDeal?.cardId]);

	useEffect(() => {
		refetchDeal();
	}, [refetchDeal]);

	const addSelectedContactToDeal = contact => {
		upsertDealDescriptor({
			variables: {
				dealId: stateApp.activeDeal._id,
				relatedObject: [contact._id],
				relatedObjectType: 'Contact',
				userId: stateApp.user.mongoId,
			},
			refetchQueries: ['getPipeline', 'getContactDeals'],
			awaitRefetchQueries: true,
		}).then(() => {
			getDeal({
				variables: { id: stateApp.activeDeal._id },
			});
		});
	};

	useEffect(() => {
		if (getDealResult?.deal?.deal?.contacts) {
			setStateApp(stateApp => ({
				...stateApp,
				activeDeal: {
					...stateApp.activeDeal,
					contacts: [...(getDealResult?.deal?.deal?.contacts?.map(c => c) || [])],
					activity: getDealResult.deal.deal.activity,
				},
			}));
		}
	}, [getDealResult, setStateApp]);

	const getView = () => {
		if (stateApp.transactBarView === 'Documents') {
			return <Documents id={stateApp.activeDeal?._id} user_id={stateApp.user.email} isTransactPage={true} />;
		} else if (stateApp.transactBarView === 'Contacts') {
			return (
				<Contacts
					addSelectedContact={addSelectedContactToDeal}
					loading={upsertDealDescriptorLoading}
					getDeal={refetchDeal}
				/>
			);
		} else if (stateApp.transactBarView === 'Task Progress') {
			return (
				<DealTasksDetails
					users={users}
					ownerId={ownerId}
					activeDeal={stateApp.activeDeal}
					dealSettings={get(dealSettings, 'dealSettings', [])}
					user={stateApp.user}
					updateStageDealDescriptor={updateStageDealDescriptor}
					pipelineId={pipelineId}
				/>
			);
		}

		return null;
	};

	const [fileRequestCounter, setFileRequestCounter] = useState(1);

	const [getRecentFiles, { data: files }] = useLazyQuery(GETRECENTCONTACTFILES, {
		fetchPolicy: 'cache-and-network',
		onCompleted: ({ getFileDescriptors }) => {
			let allActive = true;

			if (getFileDescriptors) {
				for (let i = 0; i < getFileDescriptors.length; i++) {
					if (getFileDescriptors[i].fileState !== 'active') {
						allActive = false;
						break;
					}
				}
			}

			if (!allActive) {
				if (fileRequestCounter <= FOURTY) {
					let waitBeforeRequestAgain = setTimeout(() => {
						setFileRequestCounter(fileRequestCounter + 1);
						getRecentFiles({
							variables: {
								relatedObjectId: stateApp.activeDeal?.cardId,
								relatedObjectType: 'Deal',
								limit: 2,
							},
						});
						clearTimeout(waitBeforeRequestAgain);
					}, 1000);
				} else {
					setFileRequestCounter(1);
				}
			} else {
				setFileRequestCounter(1);
			}
		},
	});
	const [viewFiles, { data: viewFileResult, loading: viewFileLoading }] = useLazyQuery(VIEWFILESQUERY, {
		fetchPolicy: 'no-cache',
	});
	const [dealAssociatedSummary, { data: dealSummaryData }] = useLazyQuery(GET_FLOW_ASSOCIATED_SUMMARY);

	useEffect(() => {
		const variables = {
			dealId: stateApp?.activeDeal?.cardId,
		};

		const contactIds = stateApp.activeDeal?.contacts?.map(contact => contact._id) || [];
		if (contactIds.length > 0) {
			variables.contactIds = contactIds;
		}

		dealAssociatedSummary({
			variables,
		});
	}, [dealAssociatedSummary, stateApp.activeDeal?.cardId, stateApp.activeDeal?.contacts]);

	useEffect(() => {
		getRecentFiles({
			variables: {
				relatedObjectId: stateApp.activeDeal?.cardId,
				relatedObjectType: 'Deal',
				limit: 2,
			},
		});
	}, [getRecentFiles, stateApp.activeDeal?.cardId]);

	useEffect(() => {
		let ID = [];
		for (let i = 0; i < files?.getFileDescriptors.length; i++) {
			ID.push(files?.getFileDescriptors[i].fileId);
		}
		for (let i = 0; i < uploadedFiles.length; i++) {
			ID.push(uploadedFiles[i].addFileDescriptor.file.id);
		}
		viewFiles({
			variables: { fileIds: ID },
		});
	}, [files, uploadedFiles, viewFiles]);

	const setUploadedFileData = uploadedfile => {
		setUploadedFiles([...uploadedFiles, uploadedfile]);
	};

	const setNewCommentId = id => {
		const comments = JSON.parse(JSON.stringify(newCommentsIds));
		comments.push(id);
		setNewCommentsIds(comments);
	};

	const getSubtaskNumber = useCallback(() => {
		let subtasks = 0;
		get(dealSettings, 'dealSettings', []).forEach(s => {
			subtasks += s.tasks?.length;
		});
		return subtasks;
	}, [dealSettings]);

	const handleClickDialogClose = () => {
		setStateApp(state => {
			const newState = { ...state, transactBarShowGrid: false, addType: null, interestsIds: null };
			if (state.transactBarView === 'Map') {
				newState.transactBarView = 'Deal';
			}

			return newState;
		});

		if (!updateDealLoading && !addContactLoading) {
			if (history.location.pathname.includes('lane')) {
				history.push(`${history.location.pathname.split('/lane')[0]}`);
			}
			handleClose();
		}
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
						header={'Delete Deal'}
						onClose={handleCloseDialog}
						deleteFunc={deleteFunc}
						m1nSelectedRowsIds={null}
						setM1nSelectedRowsIndexes={() => {}}
					>
						Do you want to delete the selected deal?
					</DeleteConfirmationDialogContent>
				</Dialog>
			)}
			<div className={classes.dealDetailRoot}>
				<RightDialog
					open={props.open}
					handleClickDialogClose={handleClickDialogClose}
					disableEnforceFocus={true}
					width="28vw"
					isTransactPage={props.isTransactPage}
					hiddenOverflow
					noBorder
					hideBackdrop={true}
				>
					{stateApp.addExistingDeal ? (
						<ExistingDeal contactId={contact._id} handleClickDialogClose={handleClickDialogClose} />
					) : (
						<>
							<DealDialogHeader
								titleFocus={titleFocus}
								dealState={dealState}
								setDealState={setDealState}
								classes={classes}
								activeDeal={stateApp.activeDeal}
								title={title}
								setTitle={setTitle}
								updateDealLoading={updateDealLoading}
								addContactLoading={addContactLoading}
								contact={contact}
								openConfirmationDialog={openConfirmationDialog}
								setTitleFocus={setTitleFocus}
								isTransactPage={props.isTransactPage}
								handleClickDialogClose={handleClickDialogClose}
							/>
							{addDealLoading ? (
								<div
									style={{
										display: 'flex',
										justifyContent: 'center',
										marginTop: 5,
									}}
								>
									<CircularProgress size="20px" />
								</div>
							) : (
								<div className={classes.contentRoot}>
									<Drawer
										dealSettingsNumber={getSubtaskNumber()}
										mapSettings={mapSettings}
										dealSummaryData={dealSummaryData}
									/>
									{!['Deal', 'Map'].includes(stateApp.transactBarView) &&
									(stateApp.activeDeal?.cardId ||
										get(stateApp, 'activeDeal._id') ||
										get(stateTransact, 'dealToCreate._id')) ? (
										<Fragment>{getView()}</Fragment>
									) : (
										<div className={classes.inputFieldRoot}>
											<div style={{ marginTop: 5 }}>
												<FormControl variant="outlined" fullWidth size="small">
													<Grid container className={classes.gridStyle}>
														<Grid item xs={3}>
															<div>Owner</div>
														</Grid>
														<Grid item xs={9}>
															<Autocomplete
																options={users
																	.filter(u => u.text)
																	.sort((a, b) => {
																		return a.text.localeCompare(b.text);
																	})}
																onChange={(e, user) => {
																	setOwnerId(user?.value);
																}}
																value={users.find(user => user?.value === ownerId) || null}
																getOptionLabel={option => option.text}
																getOptionSelected={option => option.value === ownerId}
																classes={{
																	inputRoot: classes.dealOwnerRoot,
																	focused: classes.dealOwnerRootFocused,
																	popupIndicator: classes.popupIndicator,
																}}
																renderInput={params => (
																	<TextField
																		margin="dense"
																		{...params}
																		variant="outlined"
																		className={classes.inputFieldOwner}
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
																						<Avatar
																							style={{
																								backgroundColor: users.find(user => user?.value === ownerId)
																									? getRandomColor(
																											users.find(user => user?.value === ownerId).text.toString()
																										)
																									: '',
																							}}
																							className={classes.dealOwnerAvatar}
																						>
																							{users.find(user => user?.value === ownerId) ? (
																								<CustomAvatar
																									diglog={true}
																									email={users.find(user => user?.value === ownerId).email}
																									text={
																										users
																											.find(user => user?.value === ownerId)
																											.text.toString()
																											.toUpperCase().length > 1
																											? users.find(user => user?.value === ownerId).text.toString()
																											: 'Add Owner'
																									}
																								/>
																							) : (
																								'AO'
																							)}
																						</Avatar>
																					</InputAdornment>
																					{params.InputProps.startAdornment}
																				</>
																			),
																		}}
																	/>
																)}
															/>
														</Grid>
													</Grid>
												</FormControl>
											</div>

											{selectedPipe.flowLineType === 'general' && (
												<FormControl variant="outlined" fullWidth size="small">
													<Grid container className={classes.gridStyle}>
														<Grid item xs={3}>
															<div>Due Date</div>
														</Grid>
														<Grid item xs={9}>
															<TextField
																margin="dense"
																type="date"
																variant="outlined"
																value={dueDate}
																placeholder=""
																fullWidth
																className={classes.inputFieldDate}
																onChange={e => {
																	setDueDate(e.target.value);
																}}
																InputLabelProps={{
																	shrink: true,
																}}
																InputProps={{
																	classes: {
																		root: classes.dateRoot,
																		focused: classes.focused,
																		notchedOutline: classes.notchedOutline,
																	},
																}}
															/>
														</Grid>
													</Grid>
												</FormControl>
											)}
											{selectedPipe.flowLineType !== 'general' && (
												<>
													<FormControl variant="outlined" fullWidth size="small">
														<Grid container className={classes.gridStyle}>
															<Grid item xs={3}>
																<div>Deal Received</div>
															</Grid>
															<Grid item xs={9}>
																<TextField
																	margin="dense"
																	type="date"
																	variant="outlined"
																	value={receivedDate}
																	placeholder=""
																	fullWidth
																	className={`${classes.dateRoot} ${classes.inputFieldDate}`}
																	onChange={e => {
																		setReceivedDate(e.target.value);
																	}}
																	InputLabelProps={{
																		shrink: true,
																	}}
																	InputProps={{
																		classes: {
																			root: classes.dateRoot,
																			focused: classes.focused,
																			notchedOutline: classes.notchedOutline,
																			light: classes.light,
																		},
																	}}
																/>
															</Grid>
															<Grid item xs={3}>
																<div>Bid Date</div>
															</Grid>
															<Grid item xs={9}>
																<TextField
																	margin="dense"
																	type="date"
																	variant="outlined"
																	value={bidDate}
																	placeholder=""
																	fullWidth
																	className={classes.inputFieldDate}
																	onChange={e => {
																		setBidDate(e.target.value);
																	}}
																	InputLabelProps={{
																		shrink: true,
																	}}
																	InputProps={{
																		classes: {
																			root: classes.dateRoot,
																			focused: classes.focused,
																			notchedOutline: classes.notchedOutline,
																		},
																	}}
																/>
															</Grid>
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
																	onChange={e => {
																		setCloseDate(e.target.value);
																	}}
																	InputLabelProps={{
																		shrink: true,
																	}}
																	InputProps={{
																		classes: {
																			root: classes.dateRoot,
																			focused: classes.focused,
																			notchedOutline: classes.notchedOutline,
																		},
																	}}
																/>
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
																	helperText={isNaN(label) ? 'Offer Price must be a valid number' : ''}
																	className={classes.inputFieldCustomTextInput}
																	fullWidth
																	onChange={e => {
																		setLabel(e.target.value);
																	}}
																	InputProps={{
																		inputComponent: NumberFormatCustom,
																		classes: {
																			root: classes.customDataTextInputRoot,
																			focused: classes.focused,
																			notchedOutline: classes.notchedOutline,
																		},
																	}}
																/>
															</Grid>
														</Grid>
													</FormControl>
													<FormControl variant="outlined" fullWidth size="small">
														<Grid container className={classes.gridStyle}>
															<Grid item xs={3}>
																<div>Closed Price</div>
															</Grid>
															<Grid item xs={9}>
																<TextField
																	margin="dense"
																	variant="outlined"
																	value={closedPrice}
																	error={isNaN(closedPrice)}
																	helperText={isNaN(closedPrice) ? 'Closed Price must be a valid number' : ''}
																	className={classes.inputFieldCustomTextInput}
																	fullWidth
																	onChange={e => {
																		setClosedPrice(e.target.value);
																	}}
																	InputProps={{
																		inputComponent: NumberFormatCustom,
																		classes: {
																			root: classes.customDataTextInputRoot,
																			focused: classes.focused,
																			notchedOutline: classes.notchedOutline,
																		},
																	}}
																/>
															</Grid>
														</Grid>
													</FormControl>
													<FormControl variant="outlined" fullWidth size="small">
														<Grid container className={classes.gridStyle}>
															<Grid item xs={3}>
																<div>Total NRA</div>
															</Grid>
															<Grid item xs={9}>
																<TextField
																	margin="dense"
																	variant="outlined"
																	value={totalNRA}
																	error={isNaN(totalNRA)}
																	helperText={isNaN(totalNRA) ? 'Total NRA must be a valid number' : ''}
																	className={classes.inputFieldCustomTextInput}
																	fullWidth
																	onChange={e => {
																		setTotalNRA(e.target.value);
																	}}
																	InputProps={{
																		classes: {
																			root: classes.customDataTextInputRoot,
																			focused: classes.focused,
																			notchedOutline: classes.notchedOutline,
																		},
																	}}
																/>
															</Grid>
														</Grid>
													</FormControl>
												</>
											)}

											<FormControl variant="outlined" fullWidth size="small">
												<Grid container className={classes.gridStyle}>
													<Grid item xs={3}>
														<div>Flowline</div>
													</Grid>

													<Grid item xs={9}>
														<TextField
															id="flowline"
															variant="outlined"
															margin="dense"
															select
															SelectProps={{
																native: true,
																classes: {
																	icon: classes.icon,
																},
															}}
															size="small"
															value={pipelineId}
															className={classes.inputFieldFlowline}
															onChange={e => {
																settingNewPipeWithDefaultStage(e.target.value, true);
															}}
															InputProps={{
																classes: {
																	root: classes.flowlineRoot,
																	notchedOutline: classes.notchedOutlineFlow,
																	focused: classes.notchedOutlineFlowFocused,
																},
															}}
															fullWidth
														>
															{selectedPipe && <option value={selectedPipe._id}>{selectedPipe.name}</option>}
															{sortedPipelines
																.filter(pipeline => selectedPipe?._id !== pipeline?._id)
																.map(pipeline => (
																	<option value={pipeline._id} key={pipeline._id}>
																		{pipeline.name}
																	</option>
																))}
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
																	icon: classes.icon,
																},
															}}
															size="small"
															value={stageId}
															className={classes.inputFieldFlowStage}
															onChange={e => {
																settingNewStageAndFindNextAvailablePosition(e.target.value, true);
															}}
															InputProps={{
																classes: {
																	root: classes.flowlineRoot,
																	notchedOutline: classes.notchedOutlineFlow,
																	focused: classes.notchedOutlineFlowFocused,
																},
															}}
															fullWidth
														>
															{stagesToChoose &&
																stagesToChoose.map(stage => (
																	<option value={stage._id} key={stage._id}>
																		{stage.name}
																	</option>
																))}
														</TextField>
													</Grid>
												</Grid>
											</FormControl>

											<TextField
												margin="dense"
												variant="outlined"
												multiline
												rows={8}
												value={description}
												label="Description"
												fullWidth
												//   required
												onChange={e => {
													setDescription(e.target.value);
												}}
												className={classes.notes}
											/>

											<div>
												{/* This is the document zone  */}
												<div style={{ marginTop: 20 }}>
													<AddDialogeUploadZone
														isTransactPage={true}
														filesData={viewFileResult}
														id={stateApp.activeDeal?.cardId}
														loading={viewFileLoading}
														setUploadedFileData={setUploadedFileData}
													></AddDialogeUploadZone>
												</div>

												{/* Here is flow lane form */}
												<div style={{ marginTop: 15, marginBottom: 50 }}>
													<DealTasksProgressZone
														dealSettings={get(dealSettings, 'dealSettings', [])}
														users={users}
														activeDeal={stateApp.activeDeal}
														updateStageDealDescriptor={updateStageDealDescriptor}
														pipelineId={pipelineId}
													/>
												</div>
											</div>
										</div>
									)}
								</div>
							)}
							{['Deal', 'Map'].includes(stateApp.transactBarView) && (
								<div style={{ marginTop: 2 }}>
									<DealComments
										setNewCommentId={setNewCommentId}
										targetLabel="deal"
										targetSourceId={stateApp.activeDeal?.cardId}
									/>
								</div>
							)}
						</>
					)}
				</RightDialog>
				{stateApp.transactBarView === 'Map' && (
					<div
						// map position styling
						style={{
							position: 'absolute',
							left: 0,
							'z-index': '9999',
							width: '71%',
							height: '100%',
						}}
					>
						<MapProvider
							match={{
								params: {
									expandedPanel: false,
									openSpeedDial: false,
									mapControls: false,
									viewPortCallback: mapSettings => {
										setMapSettings(mapSettings);
									},
								},
							}}
						></MapProvider>
					</div>
				)}
			</div>
			{stateApp.transactBarShowGrid &&
				createPortal(
					<AssociatedFlowDealDetails
						dealSummaryData={dealSummaryData}
						contacts={stateApp.activeDeal?.contacts?.map(contact => contact._id)}
						deal={stateApp?.activeDeal?.cardId}
					/>,
					document.body
				)}
		</>
	);
}

AddDealDialog.propTypes = {
	transactData: PropTypes.object,
	contactId: PropTypes.string,
	contact: PropTypes.shape({
		name: PropTypes.string,
		_id: PropTypes.string,
	}),
	isTransactPage: PropTypes.bool,
	open: PropTypes.bool,
};

export default AddDealDialog;
