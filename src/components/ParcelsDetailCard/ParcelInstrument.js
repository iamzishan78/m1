import React, { useEffect, useState } from 'react';

import {
	CircularProgress,
	Dialog,
	DialogTitle,
	IconButton,
	TextField,
	withStyles,
	Menu,
	MenuItem,
	ListItemIcon,
	ListItemText,
	Typography,
	Grid,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import GetAppIcon from '@material-ui/icons/GetApp';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';

import { useLazyQuery, useMutation } from '@apollo/client';
import clsx from 'clsx';
import loadashFilter from 'lodash/filter';
import PropTypes from 'prop-types';

import DeleteConfirmationDialog from 'components/MRTTable/Common/Dialog/ConfirmationDialog/DeleteConfirmationDialog';
import CustomDatePicker from 'components/Shared/components/Fields/CustomDatePicker';
import get_file_icon from 'components/Shared/functions/get_file_icon.js';
import CloseIcon from 'components/Shared/svgIcons/KeyboardTabBlackIcon';
import UploadZone from 'components/Shared/UploadZone';
import joinAddress from 'components/Shared/valueformatters/join-address.js';

import { ADD_PARCEL_AGREEMENT } from 'graphQL/useMutationAddParcelAgreement';
import { DELETEDESCRIPTORRELATEDFILE } from 'graphQL/useMutationDeleteDescriptorFile';
import { DELETE_PARCEL_RUNSHEET } from 'graphQL/useMutationDeleteParcelAgreement';
import { UPDATE_PARCEL_AGREEMENT } from 'graphQL/useMutationUpdateParcelAgreement';
import { GET_VIEW_TOKEN_URI } from 'graphQL/useQueryGetViewTokenUri';
import { INSTRUMENT_TYPE } from 'graphQL/useQueryInstrumentType';
import { RECORD_TYPE } from 'graphQL/useQueryRecordType';
import { VIEWFILEQUERY, VIEWFILESQUERY } from 'graphQL/useQueryViewFile';

import { tableGlobalController } from 'stateManagement/tableController';

import { AppContext } from 'AppContext';

const filter = createFilterOptions();

const useStyles = makeStyles({
	list: {
		width: 250,
	},
	fullList: {
		width: 'auto',
	},
	maxWidth: {
		width: '100%',
	},

	fileUploadSection: {
		minHeight: '50px',
		display: 'flex',
		justifyContent: 'space-between',
		flexDirection: 'column',
		width: '100%',
	},
	fileUploadTopSection: {
		minHeight: '50px',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		marginBottom: '23px',
	},
	uploadTitle: {
		margin: '0',
		color: '#757575',
		fontWeight: 'normal',
		marginBottom: '8px',
	},
	uploadSubtext: {
		color: 'rgb(176, 176, 176)',
		margin: '0',
		fontWeight: 'normal',
	},
	IconSection: {
		minHeight: '35px',
		display: 'flex',
		justifyContent: 'center',
		width: 'fit-content',
	},
	fileDrop: {
		minHeight: '125px',
		width: '100%',
		padding: '10px 40px',
		color: '#757575',
		fontWeight: 'normal',
		backgroundColor: '#eee',
		textAlign: 'center',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		border: '2px dashed rgb(176, 176, 176)',
		marginBottom: '30px',
	},
	titleSection: {
		display: 'flex',
		justifyContent: 'space-between',
		width: '100%',
		alignItems: 'center',
		padding: '10px 16px',
		'& svg': {
			fill: '#757575 !important',
		},
	},
	menu: {
		'& .MuiListItem-root': {
			'& .MuiListItemIcon-root': {
				minWidth: '30px',
				'& .MuiSvgIcon-root': {
					fill: 'red !important',
				},
			},
		},
	},
	imageSubText: {
		letterSpacing: '0.5px',
		textAlign: 'center',
	},
	fileDropError: {
		color: 'red',
	},
	Uploadcomp: {
		// width: "200px !important",
		// height: "200px !important",
	},
	forImage: {
		width: '100px !important',
		height: '100px !important',
		backgroundColor: 'transparent !important',
		// border: "1px solid #999",
		borderRadius: '10px !important',
	},
	forImageContainer: {
		width: '100px !important',
		height: '100px !important',
		borderRadius: '10px !important',
		backgroundColor: '#eeeeee !important',
		// border: "1px solid #999",
		textAlign: 'center',
		fontSize: '1.5rem',
		fontWeight: 'bold',
		color: '#555',
		textTransform: 'uppercase',
		paddingTop: '30px',
		cursor: 'pointer',
		marginBottom: '5px',
	},
	dialogFooter: {
		display: 'flex',
		justifyContent: 'flex-end',
		paddingTop: '10px',
		paddingRight: '19px',
		paddingBottom: '40px',
	},
	footerButton: {
		letterSpacing: '1px',
		textTransform: 'capitalize',
		fontWeight: 'bold',
		padding: '8px 20px',
	},
	selectedType: {
		borderBottom: '4px solid #01B0F0',
		display: 'inline',
		cursor: 'pointer',
	},
	unSelectedType: {
		display: 'inline',
		color: '#827F7F',
		cursor: 'pointer',
	},
	optionNumber: {
		fontSize: '12px',
	},
	dateRoot: {
		color: 'grey',
		'& input': {
			marginLeft: '20px',
		},
	},
});

export default function ParcelInstrument(props) {
	const { selectedInstrument, setSelectedInstrument } = props;
	const instrumentInitial = {
		instrumentType: '',
		recordType: '',
		fromPartySummary: '',
		toPartySummary: '',
		effectiveDate: null,
		executionDate: null,
		fileDate: null,
		recordationNumber: '',
		volume: '',
		page: '',
		legalDescription: '',
	};
	const classes = useStyles();
	const anchor = 'right';
	const DELETE_OPTIONS_ENUMS = {
		file: 'File',
		parcelAgreement: 'Parcel Agreement',
	};
	const [stateApp, setStateApp] = React.useContext(AppContext);

	const [anchorEl, setAnchorEl] = useState();
	let [loader, setLoader] = useState(false);
	const [fileData, setFileData] = useState(null);
	const [newInstrument, setNewInstrument] = useState(instrumentInitial);
	const [initiateDeleteDialogForFileOrAgreement, setInitiateDeleteDialogForFileOrAgreement] = useState(null);
	const [state, setState] = useState({
		right: false,
	});
	const [viewFile, { data: viewFileResult }] = useLazyQuery(VIEWFILEQUERY, {
		fetchPolicy: 'no-cache',
	});
	const [getInstrumentTypes, { data: instrumentTypes }] = useLazyQuery(INSTRUMENT_TYPE, {
		fetchPolicy: 'no-cache',
	});
	const [getViewTokenUri] = useLazyQuery(GET_VIEW_TOKEN_URI, {
		fetchPolicy: 'no-cache',
	});
	const [getRecordTypes, { data: recordTypes }] = useLazyQuery(RECORD_TYPE, {
		fetchPolicy: 'no-cache',
	});
	const [deleteFile] = useMutation(DELETEDESCRIPTORRELATEDFILE);
	const [addParcelAgreement] = useMutation(ADD_PARCEL_AGREEMENT, {
		refetchQueries: ['getDbData'],
		awaitRefetchQueries: true,
		onCompleted: () => {
			tableGlobalController.refetch();
			tableGlobalController.updateState({
				selectedInstrument: null,
			});
		},
	});
	const [updateParcelAgreement] = useMutation(UPDATE_PARCEL_AGREEMENT, {
		refetchQueries: ['getDbData'],
		awaitRefetchQueries: true,
		onCompleted: () => {
			tableGlobalController.refetch();
			tableGlobalController.updateState({
				selectedInstrument: null,
			});
		},
	});
	const [deleteParcelRunsheet] = useMutation(DELETE_PARCEL_RUNSHEET, {
		refetchQueries: ['getDbData'],
		awaitRefetchQueries: true,
		onCompleted: () => {
			tableGlobalController.refetch();
			tableGlobalController.updateState({
				selectedInstrument: null,
			});
		},
	});

	const [viewFiles, { data: viewFileSResult }] = useLazyQuery(VIEWFILESQUERY, {
		fetchPolicy: 'no-cache',
	});

	useEffect(() => {
		getInstrumentTypes();
		getRecordTypes();
	}, [getInstrumentTypes, getRecordTypes]);

	useEffect(() => {
		let ID = [];
		if (selectedInstrument?._id) {
			if (selectedInstrument?.fileId) {
				getViewTokenUri({
					variables: { fileId: selectedInstrument?.fileId },
				}).then(result => {
					selectedInstrument.viewToken = result.data.getViewTokenUri;
				});

				selectedInstrument.test = 'test';
				ID.push(selectedInstrument?.fileId);

				viewFiles({
					variables: { fileIds: ID },
				});
			}
			if (selectedInstrument) {
				const {
					instrumentType,
					recordType,
					descriptorObject,
					fromPartySummary,
					toPartySummary,
					effectiveDate,
					executionDate,
					fileDate,
					recordationNumber,
					volume,
					page,
					legalDescription,
					fileId,
				} = selectedInstrument;
				setNewInstrument({
					instrumentType,
					recordType,
					descriptorObject,
					fromPartySummary,
					toPartySummary,
					effectiveDate,
					executionDate,
					fileDate,
					recordationNumber,
					volume,
					page,
					legalDescription,
					fileId,
				});
			} else {
				setSelectedInstrument(null);

				setNewInstrument(instrumentInitial);
			}
		}
	}, [selectedInstrument]);

	useEffect(() => {
		if (viewFileResult?.viewFile?.uri) {
			let a = document.createElement('a');
			a.href = viewFileResult.viewFile.uri;
			a.download = viewFileResult.viewFile.name;
			a.click();
		}
	}, [viewFileResult]);

	useEffect(() => {
		if (fileData) {
			let ID = [];
			ID.push(fileData?.addFileDescriptor?.file?.id);
			viewFiles({
				variables: { fileIds: ID },
			});
		}
	}, [fileData]);

	const handleViewFile = async id => {
		viewFile({ variables: { fileId: id } });
	};

	const handleDeleteAccept = () => {
		// Delete Document Logic goes here

		if (!selectedInstrument) {
			setFileData(null);
			return;
		}
		setLoader(true);
		if (initiateDeleteDialogForFileOrAgreement === 'parcelAgreement') {
			deleteParcelRunsheet({
				variables: {
					id: selectedInstrument.descriptorObject,
					parcelId: selectedInstrument.customLayerId,
					fileId: selectedInstrument.fileId,
				},
				refetchQueries: ['getDbData'],
				awaitRefetchQueries: true,
			}).then(() => {
				props.setShowSlider(false);
				setSelectedInstrument(null);
				setStateApp(stateApp => ({
					...stateApp,
					selectedAgreement: null,
				}));
				setNewInstrument(instrumentInitial);
			});
		} else if (initiateDeleteDialogForFileOrAgreement === 'file') {
			deleteFile({
				variables: {
					descriptorObjectId: selectedInstrument.fileId,
					relatedObjectId: selectedInstrument._id,
				},
				refetchQueries: ['getDbData'],
				awaitRefetchQueries: true,
			}).then(() => {
				setFileData(null);
				setStateApp({
					...stateApp,
					DocumentDrawer: false,
					selectedDocument: {},
				});
				setNewInstrument({
					...newInstrument,
					fileId: null,
				});
				setInitiateDeleteDialogForFileOrAgreement(false);
				setLoader(false);
			});
		}
	};

	const handleDeleteCancel = () => {
		setInitiateDeleteDialogForFileOrAgreement(null);
	};

	const handleMenuClick = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleClose = () => {
		props.setShowSlider(false);
		setSelectedInstrument(null);
		tableGlobalController.updateState({
			selectedInstrument: null,
		});
		setStateApp(stateApp => ({
			...stateApp,
			selectedAgreement: null,
		}));
		setNewInstrument(instrumentInitial);
	};

	const LightTooltip = withStyles(theme => ({
		tooltip: {
			backgroundColor: theme.palette.common.white,
			color: 'rgba(0, 0, 0, 0.87)',
			boxShadow: theme.shadows[1],
			fontSize: 11,
		},
	}))(Tooltip);

	const toggleDrawer = (anchor, open) => event => {
		if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
			return;
		}

		setState({ ...state, [anchor]: open });
	};

	const handleSave = () => {
		let instrumentType = '';
		if (typeof newInstrument.instrumentType === 'string') {
			instrumentType = newInstrument.instrumentType;
		} else if (newInstrument.instrumentType?.name) {
			instrumentType = newInstrument.instrumentType.name;
		}

		let recordType = '';
		if (typeof newInstrument.recordType === 'string') {
			recordType = newInstrument.recordType;
		} else if (newInstrument.recordType?.name) {
			recordType = newInstrument.recordType.name;
		}

		const fileId = fileData?.addFileDescriptor?.file?.id;
		setLoader(true);
		if (selectedInstrument) {
			updateParcelAgreement({
				variables: {
					agreement: {
						_id: selectedInstrument._id,
						instrumentType: instrumentType,
						effectiveDate: newInstrument.effectiveDate,
						fileDate: newInstrument.fileDate,
						toPartySummary: newInstrument.toPartySummary,
						fromPartySummary: newInstrument.fromPartySummary,
						executionDate: newInstrument.executionDate,
						legalDescription: newInstrument.legalDescription,
						page: newInstrument.page,
						recordationNumber: newInstrument.recordationNumber,
						recordType: recordType,
						descriptorObject: newInstrument.descriptorObject,
						volume: newInstrument.volume,
						fileId: fileId,
						fileName: fileData?.addFileDescriptor?.file?.name,
						parcelId: props.parcelId,
					},
				},
				refetchQueries: ['getDbData'],
				awaitRefetchQueries: true,
			}).then(() => {
				props.setShowSlider(false);

				setSelectedInstrument(null);
				setStateApp(stateApp => ({
					...stateApp,
					selectedAgreement: null,
				}));
				setNewInstrument(instrumentInitial);
				setLoader(false);
			});
		} else {
			addParcelAgreement({
				variables: {
					agreement: {
						instrumentType: instrumentType,
						effectiveDate: newInstrument.effectiveDate,
						fileDate: newInstrument.fileDate,
						toPartySummary: newInstrument.toPartySummary,
						fromPartySummary: newInstrument.fromPartySummary,
						executionDate: newInstrument.executionDate,
						legalDescription: newInstrument.legalDescription,
						page: newInstrument.page,
						recordationNumber: newInstrument.recordationNumber,
						recordType: recordType,
						volume: newInstrument.volume,
						fileId: fileId || newInstrument.fileId,
						fileName: fileData?.addFileDescriptor?.file?.name,
						userId: stateApp.user.mongoId,
						parcelId: props.parcelId,
					},
					refetchQueries: ['getParcelAgreement', 'getDbData'],
					awaitRefetchQueries: true,
				},
			}).then(() => {
				props.setShowSlider(false);

				setSelectedInstrument(null);
				setStateApp(stateApp => ({
					...stateApp,
					selectedAgreement: null,
				}));
				setNewInstrument(instrumentInitial);
				setLoader(false);
			});
		}
	};
	return (
		<div>
			<Drawer anchor={'right'} open={true} ModalProps={{ onBackdropClick: handleClose }}>
				<Dialog
					open={initiateDeleteDialogForFileOrAgreement}
					onClose={handleDeleteCancel}
					style={{ zIndex: 99999999999 }}
				>
					<DeleteConfirmationDialog
						header={`Delete  ${DELETE_OPTIONS_ENUMS[initiateDeleteDialogForFileOrAgreement]}`}
						onClose={handleDeleteCancel}
						deleteFunc={handleDeleteAccept}
					>
						{`Do you want to delete the selected ${DELETE_OPTIONS_ENUMS[initiateDeleteDialogForFileOrAgreement]}?`}
					</DeleteConfirmationDialog>
				</Dialog>
				<Dialog open={loader} style={{ zIndex: 99999999999 }}>
					<DialogTitle id="alert-dialog-title">
						<CircularProgress />
					</DialogTitle>
				</Dialog>

				<div
					style={{ width: '500px', marginLeft: '15px' }}
					className={clsx(classes.list, {
						[classes.fullList]: anchor === 'top' || anchor === 'bottom',
					})}
					role="presentation"
					onClick={toggleDrawer(anchor, false)}
					onKeyDown={toggleDrawer(anchor, false)}
				>
					<div style={{ flexShrink: 0 }}>
						<div className={classes.titleSection}>
							<div>{selectedInstrument ? <h2>Update Instrument</h2> : <h2>Add New Instrument</h2>}</div>
							<div style={{ cursor: 'pointer' }}>
								{selectedInstrument && (
									<IconButton
										size="small"
										component="span"
										style={{
											background: 'transparent',
											paddingLeft: '10px',
											align: 'center',
										}}
										onClick={handleMenuClick}
									>
										<MoreHorizIcon id="fileDetailHorzIcon" size="medium" />
									</IconButton>
								)}
								<IconButton size="small" onClick={() => handleClose()}>
									<CloseIcon />
								</IconButton>
								<Menu
									id="dealMenu"
									anchorEl={anchorEl}
									keepMounted
									open={Boolean(anchorEl)}
									onClose={handleMenuClose}
									className={classes.menu}
									getContentAnchorEl={null}
									anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
									transformOrigin={{ vertical: 'top', horizontal: 'center' }}
								>
									<MenuItem
										onClick={() => {
											setInitiateDeleteDialogForFileOrAgreement('parcelAgreement');
											handleMenuClose();
										}}
									>
										<ListItemIcon>
											<DeleteIcon size="medium" />
										</ListItemIcon>
										<ListItemText>Delete</ListItemText>
									</MenuItem>
								</Menu>
							</div>
						</div>
					</div>

					<List>
						<ListItem
							style={{
								flexDirection: 'column',
								justifyContent: 'start',
								alignItems: 'start',
							}}
						>
							<h4>Instrument Type</h4>
							<AutoCompleteField
								className={classes.maxWidth}
								options={instrumentTypes?.getInstrumentType || []}
								setValue={value => {
									setNewInstrument({
										...newInstrument,
										instrumentType: value,
									});
								}}
								value={newInstrument.instrumentType ? newInstrument.instrumentType : ''}
							/>
						</ListItem>
						<ListItem
							style={{
								flexDirection: 'column',
								justifyContent: 'start',
								alignItems: 'start',
							}}
						>
							<h4>Party of the First (Grantor)</h4>
							<TextField
								className={classes.maxWidth}
								multiline
								value={newInstrument?.fromPartySummary}
								onChange={e => {
									setNewInstrument({
										...newInstrument,
										fromPartySummary: e.target.value,
									});
								}}
							/>
						</ListItem>
						<ListItem
							style={{
								flexDirection: 'column',
								justifyContent: 'start',
								alignItems: 'start',
							}}
						>
							<h4>Party of the Second (Grantee)</h4>
							<TextField
								className={classes.maxWidth}
								multiline
								value={newInstrument?.toPartySummary}
								onChange={e => {
									setNewInstrument({
										...newInstrument,
										toPartySummary: e.target.value,
									});
								}}
							/>
						</ListItem>
						<ListItem
							style={{
								flexDirection: 'column',
								justifyContent: 'start',
								alignItems: 'start',
							}}
						>
							<h4>Effective Date</h4>
							<CustomDatePicker
								fieldAttributes={{
									value: newInstrument?.effectiveDate,
									placeholder: 'MM/DD/YYYY',
									format: 'MM/DD/YYYY',
								}}
								fieldEvents={{
									onChange: value => {
										setNewInstrument({
											...newInstrument,
											effectiveDate: value,
										});
									},
								}}
								fieldConfig={{
									variant: 'standard',
								}}
							/>
						</ListItem>
						<ListItem
							style={{
								flexDirection: 'column',
								justifyContent: 'start',
								alignItems: 'start',
							}}
						>
							<h4>Instrument Date</h4>
							<CustomDatePicker
								fieldAttributes={{
									value: newInstrument?.executionDate,
									placeholder: 'MM/DD/YYYY',
									format: 'MM/DD/YYYY',
								}}
								fieldEvents={{
									onChange: value => {
										setNewInstrument({
											...newInstrument,
											executionDate: value,
										});
									},
								}}
								fieldConfig={{
									variant: 'standard',
								}}
							/>
						</ListItem>
						<ListItem
							style={{
								flexDirection: 'column',
								justifyContent: 'start',
								alignItems: 'start',
							}}
						>
							<h4>File Date</h4>
							<CustomDatePicker
								fieldAttributes={{
									value: newInstrument?.fileDate,
									placeholder: 'MM/DD/YYYY',
									format: 'MM/DD/YYYY',
								}}
								fieldEvents={{
									onChange: value => {
										setNewInstrument({
											...newInstrument,
											fileDate: value,
										});
									},
								}}
								fieldConfig={{
									variant: 'standard',
								}}
							/>
						</ListItem>
						<ListItem
							style={{
								flexDirection: 'column',
								justifyContent: 'start',
								alignItems: 'start',
							}}
						>
							<h4>Record Type</h4>
							<AutoCompleteField
								className={classes.maxWidth}
								options={recordTypes?.getRecordType || []}
								setValue={value => {
									setNewInstrument({
										...newInstrument,
										recordType: value,
									});
								}}
								value={newInstrument.recordType ? newInstrument.recordType : ''}
							/>
						</ListItem>
						<ListItem
							style={{
								flexDirection: 'column',
								justifyContent: 'start',
								alignItems: 'start',
							}}
						>
							<Grid container spacing={2}>
								<Grid item xs={4}>
									<>
										<h4>Rec #</h4>
										<TextField
											className={classes.maxWidth}
											multiline
											value={newInstrument?.recordationNumber}
											onChange={e => {
												setNewInstrument({
													...newInstrument,
													recordationNumber: e.target.value,
												});
											}}
										/>
									</>
								</Grid>
								<Grid item xs={4}>
									<>
										<h4>Volume</h4>
										<TextField
											className={classes.maxWidth}
											multiline
											value={newInstrument?.volume}
											onChange={e => {
												setNewInstrument({
													...newInstrument,
													volume: e.target.value,
												});
											}}
										/>
									</>
								</Grid>
								<Grid item xs={4}>
									<>
										<h4>Page</h4>
										<TextField
											className={classes.maxWidth}
											multiline
											value={newInstrument?.page}
											onChange={e => {
												setNewInstrument({
													...newInstrument,
													page: e.target.value,
												});
											}}
										/>
									</>
								</Grid>
							</Grid>
						</ListItem>
						<ListItem
							style={{
								flexDirection: 'column',
								justifyContent: 'start',
								alignItems: 'start',
							}}
						>
							<h4>Legal Description</h4>
							<TextField
								className={classes.maxWidth}
								multiline
								value={newInstrument?.legalDescription}
								onChange={e => {
									setNewInstrument({
										...newInstrument,
										legalDescription: e.target.value,
									});
								}}
							/>
						</ListItem>
					</List>

					{(newInstrument?.fileId || fileData) && (
						<ListItem>
							<div style={{ display: 'flex', justifyContent: 'start' }}>
								{viewFileSResult?.viewFiles?.map((value, index) => {
									let fileExtension = value?.name?.slice(value.name.lastIndexOf('.') + 1)?.toLowerCase();
									if (index <= 1) {
										return (
											<div key={value.uri}>
												<LightTooltip
													title={
														<div className={classes.IconSection}>
															<IconButton
																size="small"
																onClick={() => {
																	setInitiateDeleteDialogForFileOrAgreement('file');
																}}
															>
																<DeleteIcon />
															</IconButton>

															<IconButton
																disabled={false}
																size="small"
																onClick={e => {
																	e.preventDefault();
																	handleViewFile(value.id);
																}}
															>
																<GetAppIcon />
															</IconButton>
														</div>
													}
													interactive
												>
													<div>
														{new RegExp(['jpg', 'jpeg', 'png', 'bmp'].join('|')).test(fileExtension) ? (
															<img src={value.uri} alt={value.name} className={classes.forImage}></img>
														) : (
															<div
																className={classes.forImageContainer}
																onClick={() => {
																	if (fileExtension === 'pdf') {
																		setStateApp(state => ({
																			...state,
																			pdfView: selectedInstrument,
																		}));
																	} else {
																		handleViewFile(selectedInstrument.fileId);
																	}
																}}
															>
																{get_file_icon(fileExtension)}
															</div>
														)}
														<div className={classes.imageSubText}>
															{value?.name?.length > 12 ? value.name.slice(0, 8) + '...' : value.name}
														</div>
													</div>
												</LightTooltip>
											</div>
										);
									}
									return undefined;
								})}
							</div>
						</ListItem>
					)}

					{!newInstrument?.fileId && !fileData && (
						<div className={classes.Uploadcomp}>
							<UploadZone
								style={{
									paddingLeft: '50px',
								}}
								// relatedObjectId={props.parcelId}
								// relatedObjectType="Parcel"
								userId={stateApp.user.mongoId}
								setFileData={setFileData}
							/>
						</div>
					)}

					<div className={classes.dialogFooter}>
						<Button
							variant="contained"
							color="default"
							size="medium"
							disableElevation
							className={classes.footerButton}
							style={{
								margin: '0px 15px 0px 0px',
							}}
							onClick={() => {
								handleClose();
							}}
						>
							Cancel
						</Button>

						<Button
							variant="contained"
							color="secondary"
							size="medium"
							disableElevation
							// disabled={!fileData && !newInstrument.fileId}
							onClick={() => {
								// if (fileData || newInstrument.fileId) {
								setLoader(true);
								handleSave();
								// }
							}}
							className={classes.footerButton}
						>
							Save
						</Button>
					</div>
				</div>
			</Drawer>
		</div>
	);
}

const AutoCompleteField = ({ setValue, value, options, ...other }) => {
	const useStyles = makeStyles({
		inputRoot: {
			backgroundColor: '#ffffff',
		},
		listbox: {
			boxSizing: 'border-box',
			'& ul': {
				padding: 0,
				margin: 0,
			},
		},
	});

	const classes = useStyles();

	const onInputChange = (event, value) => {
		setValue(value);
	};
	return (
		<Autocomplete
			defaultValue={value}
			value={value}
			disableListWrap
			classes={classes}
			options={
				options
					? options?.map(type => {
							return { _id: type, name: type };
						})
					: []
			}
			getOptionLabel={option => {
				if (typeof option === 'string') {
					return option;
				}
				if (option.inputValue) {
					return option.name;
				}

				if (option?.name) {
					return option.name;
				} else {
					return '';
				}
			}}
			getOptionSelected={(option, value) => {
				return option?._id === value?._id;
			}}
			renderOption={option => {
				if (option._id === 'newEntity') {
					return <Typography style={{ color: 'midnightblue' }}>Add &apos;{option.name}&apos;</Typography>;
				}

				return (
					<Grid container spacing={0}>
						<Grid container item xs={12} alignItems="center">
							<Grid item xs>
								<span style={{ fontWeight: 400 }}>{option.name}</span>

								<Typography variant="body2" color="textSecondary">
									{joinAddress(option)}
								</Typography>
							</Grid>
						</Grid>
					</Grid>
				);
			}}
			onInputChange={onInputChange}
			filterOptions={(options, params) => {
				let inputValue = JSON.parse(JSON.stringify(value));
				if (inputValue.name) {
					inputValue = inputValue.name;
				}
				const filtered = filter(options, { ...params, inputValue });
				const isExist = loadashFilter(filtered, filter => {
					return filter._id === inputValue;
				});
				if (inputValue !== '' && (!isExist || isExist.length === 0)) {
					filtered.unshift({
						name: inputValue,
						_id: 'newEntity',
					});
				}
				return filtered;
			}}
			onChange={(event, newValue) => {
				if (newValue && newValue._id) {
					if (newValue._id !== 'newEntity') {
						setValue(newValue);
					} else {
						setValue({ _id: 'newEntity', name: newValue.name });
					}
				} else {
					setValue('');
				}
			}}
			renderInput={params => (
				<TextField
					margin="dense"
					{...params}
					InputProps={{
						...params.InputProps,
					}}
					size="small"
				/>
			)}
			{...other}
		/>
	);
};

ParcelInstrument.propTypes = {
	selectedInstrument: PropTypes.object,
	setSelectedInstrument: PropTypes.func.isRequired,
	setShowSlider: PropTypes.func.isRequired,
	parcelId: PropTypes.string,
};

AutoCompleteField.propTypes = {
	setValue: PropTypes.func.isRequired,
	value: PropTypes.string,
	options: PropTypes.array,
};
