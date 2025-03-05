import React, { useEffect, useState } from 'react';

import {
	Typography,
	Grid,
	CircularProgress,
	Dialog,
	DialogTitle,
	IconButton,
	TextField,
	withStyles,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import InputAdornment from '@material-ui/core/InputAdornment';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import GetAppIcon from '@material-ui/icons/GetApp';
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';

import { useLazyQuery, useMutation } from '@apollo/client';
import clsx from 'clsx';
import loadashFilter from 'lodash/filter';
import PropTypes from 'prop-types';

import DeleteConfirmationDialog from 'components/MRTTable/Common/Dialog/ConfirmationDialog/DeleteConfirmationDialog';
import CustomDatePicker from 'components/Shared/components/Fields/CustomDatePicker';
import get_file_icon from 'components/Shared/functions/get_file_icon.js';
import joinAddress from 'components/Shared/valueformatters/join-address.js';

import { CREATEDESCRIPTORFILE } from 'graphQL/useMutationCreateDescriptorFile';
import { UPDATE_DOCUMENT } from 'graphQL/useMutationUpdateDocument';
import { GET_DOCUMENTS } from 'graphQL/useQueryDocuments';
import { DOCUMENT_TYPE } from 'graphQL/useQueryDocumentType';
import { VIEWFILEQUERY, VIEWFILESQUERY } from 'graphQL/useQueryViewFile';

import { AppContext } from 'AppContext';

import UploadZone from '../../Shared/UploadZone';

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
});

export default function DocumentDrawer(props) {
	const documentInitial = {
		documentName: '',
		recordingInfo: '',
		dateTime: null,
		documentNumber: '',
		documentType: '',
		partyName1: '',
		partyName2: '',
		fileId: '',
	};
	const classes = useStyles();
	const [stateApp, setStateApp] = React.useContext(AppContext);

	let [loader, setLoader] = useState(false);
	const [selectedType, setSelectedType] = useState('new');
	const [fileData, setFileData] = useState(null);
	const [newDocument, setNewDocument] = useState(documentInitial);
	const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
	const [fileIdToDelete, setFileIdToDelete] = useState(null);
	const [search, setSearch] = useState('');
	const [state, setState] = useState({
		right: false,
	});
	const [nameAutValueParty1, setNameAutValueParty1] = useState({
		name: '',
		_id: null,
	});
	const [nameAutValueParty2, setNameAutValueParty2] = useState({
		name: '',
		_id: null,
	});

	const [viewFile, { data: viewFileResult }] = useLazyQuery(VIEWFILEQUERY, {
		fetchPolicy: 'no-cache',
	});
	const [getDocumentTypes, { data: documentTypes }] = useLazyQuery(DOCUMENT_TYPE, {
		fetchPolicy: 'no-cache',
	});
	const [updateDocument] = useMutation(UPDATE_DOCUMENT);
	const [getDocuments, { data: documents }] = useLazyQuery(GET_DOCUMENTS, {
		fetchPolicy: 'no-cache',
	});
	const [addFile] = useMutation(CREATEDESCRIPTORFILE, {
		refetchQueries: ['getRecentContactFiles'],
		awaitRefetchQueries: true,
	});

	const [viewFiles, { data: viewFileSResult }] = useLazyQuery(VIEWFILESQUERY, {
		fetchPolicy: 'no-cache',
	});

	useEffect(() => {
		getDocuments({
			variables: {
				search: '',
			},
		});
	}, [getDocuments]);

	useEffect(() => {
		getDocumentTypes();
	}, [getDocumentTypes]);

	useEffect(() => {
		if (viewFileResult?.viewFile?.uri) {
			let a = document.createElement('a');
			a.href = viewFileResult.viewFile.uri;
			a.download = viewFileResult.viewFile.name;

			// if for some reason we want to download (or open depending on x-ms-blob-content-disposition) in a new tab
			// a.target = "_blank";

			// file download on click is not 100% guranteed if the x-ms-blob-content-disposition is not set to attachment
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

	useEffect(() => {
		let ID = [];
		if (stateApp.selectedDocument?.fileId) {
			ID.push(stateApp.selectedDocument?.fileId);

			viewFiles({
				variables: { fileIds: ID },
			});
			if (stateApp.selectedDocument) {
				const { documentName, dateTime, documentNumber, documentType, partyName1, partyName2, fileId, recordingInfo } =
					stateApp.selectedDocument;
				setSearch(documentName);
				setSelectedType('update');
				setNameAutValueParty1({
					name: partyName1?.entityDetail?.name,
					_id: partyName1?._id,
				});
				setNameAutValueParty2({
					name: partyName2?.entityDetail?.name,
					_id: partyName2?._id,
				});

				setNewDocument({
					recordingInfo,
					documentName,
					dateTime,
					documentNumber,
					documentType,
					partyName1,
					partyName2,
					fileId,
				});
			} else {
				setNewDocument(documentInitial);
			}
		}
	}, [stateApp.selectedDocument]);

	const UpDatefileFN = () => {
		let documentType = '';
		if (typeof newDocument.documentType === 'string') {
			documentType = newDocument.documentType;
		} else if (newDocument.documentType?.name) {
			documentType = newDocument.documentType.name;
		}
		const fileId = fileData?.addFileDescriptor?.file?.id;
		setLoader(true);
		updateDocument({
			variables: {
				document: {
					recordingInfo: newDocument.recordingInfo,
					documentName: newDocument.documentName,
					dateTime: newDocument.dateTime,
					documentNumber: newDocument.documentNumber,
					documentType: documentType,
					partyName1: nameAutValueParty1._id,
					partyName2: nameAutValueParty2._id,
					fileId: fileId || newDocument.fileId,
				},
			},
			refetchQueries: ['getTenantWell', 'getParcelFiles'],
			awaitRefetchQueries: true,
		}).then(() => {
			// props.getAllFiles({
			//   variables: {
			//     relatedObjectId: props.tenantWellId,
			//     relatedObjectType: "Well",
			//   },
			// });
			props.setShowDocumentSlider(false);
			setNameAutValueParty1({ name: '', _id: null });
			setNameAutValueParty2({ name: '', _id: null });
			setNewDocument(documentInitial);
			setLoader(false);
		});
		// }
	};

	const handleViewFile = async id => {
		viewFile({ variables: { fileId: id } });
	};

	const handleDeleteCancel = () => {
		setFileIdToDelete(null);
		setOpenDeleteConfirmDialog(false);
		setNewDocument(documentInitial);
	};
	const handleClose = () => {
		props.setShowDocumentSlider(false);
		setNameAutValueParty1({ name: '', _id: null });
		setNameAutValueParty2({ name: '', _id: null });
		setNewDocument(documentInitial);
	};

	const handleDeleteAccept = () => {
		// Delete Document Logic goes here
		if (fileIdToDelete) {
			setLoader(true);
			updateDocument({
				variables: {
					document: {
						fileId: fileIdToDelete,
						isDeleted: true,
					},
				},
				refetchQueries: ['getDocuments'],
				awaitRefetchQueries: true,
			}).then(() => {
				setStateApp({
					...stateApp,
					DocumentDrawer: false,
					selectedDocument: {},
				});
				setFileData(null); // set fileData null on deleting file
				setFileIdToDelete(null);
				setNewDocument(documentInitial);
				setNameAutValueParty1({ name: '', _id: null });
				setNameAutValueParty2({ name: '', _id: null });
				setOpenDeleteConfirmDialog(false);
				setLoader(false);
			});
		}
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

	const onSearcSelected = searchedDocument => {
		let ID = [];
		if (searchedDocument?.fileId) {
			ID.push(searchedDocument?.fileId);
			viewFiles({
				variables: { fileIds: ID },
			});
			if (searchedDocument) {
				const {
					documentName,
					dateTime,
					documentNumber,
					documentType,
					partyName1,
					partyName2,
					fileId,
					recordingInfo,
					fileName,
				} = searchedDocument;
				setNameAutValueParty1({
					name: partyName1?.entityDetail?.name,
					_id: partyName1?._id,
				});
				setNameAutValueParty2({
					name: partyName2?.entityDetail?.name,
					_id: partyName2?._id,
				});

				setNewDocument({
					recordingInfo,
					documentName,
					dateTime,
					documentNumber,
					documentType,
					partyName1,
					partyName2,
					fileId,
					fileName,
				});
			} else {
				setNewDocument(documentInitial);
			}
		}
	};

	const DocumentDetail = anchor => (
		<div
			style={{ width: '500px', marginLeft: '15px' }}
			className={clsx(classes.list, {
				[classes.fullList]: anchor === 'top' || anchor === 'bottom',
			})}
			role="presentation"
			onClick={toggleDrawer(anchor, false)}
			onKeyDown={toggleDrawer(anchor, false)}
		>
			<List>
				<ListItem
					style={{
						display: 'flex',
						justifyContent: 'between',
						width: '100%',
						alignItems: 'center',
					}}
				>
					<ListItemText>
						<h3>Related Documents</h3>
					</ListItemText>
					<ListItemIcon style={{ cursor: 'pointer' }}>
						<IconButton size="small" onClick={() => handleClose()}>
							<CloseIcon></CloseIcon>
						</IconButton>
					</ListItemIcon>
				</ListItem>
				{selectedType !== 'update' && (
					<>
						<ListItem
							style={{
								flexDirection: 'column',
								justifyContent: 'start',
								alignItems: 'start',
							}}
						>
							<ListItemText>
								<h4
									onClick={() => {
										setSelectedType('new');
										setSearch('');
										setNewDocument(documentInitial);
									}}
									className={selectedType === 'new' ? classes.selectedType : classes.unSelectedType}
								>
									New Document
								</h4>
								<h4
									onClick={() => {
										setSelectedType('existing');
									}}
									className={selectedType === 'existing' ? classes.selectedType : classes.unSelectedType}
									style={{ marginLeft: '20px' }}
								>
									Existing Document
								</h4>
							</ListItemText>
						</ListItem>
						{selectedType === 'existing' && (
							<ListItem
								style={{
									flexDirection: 'column',
									justifyContent: 'start',
									alignItems: 'start',
								}}
							>
								<Autocomplete
									defaultValue={search}
									value={search}
									disableListWrap
									className={classes.maxWidth}
									options={
										// Check if 'documents?.getFiles' is an array
										Array.isArray(documents?.getFiles)
											? // If it is an array, map over 'documents.getFiles' and return a new array of objects
												documents.getFiles.map(doc => {
													return {
														_id: doc?.fileId,
														name: doc?.documentName,
														number: doc?.documentNumber,
														fileName: doc?.fileName,
													};
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

										return '';
									}}
									renderOption={option => (
										<React.Fragment>
											<Grid container direction="column">
												<Grid item>{option.name}</Grid>
												<Grid item className={classes.optionNumber}>
													{option.number}
												</Grid>
											</Grid>
										</React.Fragment>
									)}
									getOptionSelected={(option, value) => {
										return option?._id === value?._id;
									}}
									onInputChange={(event, value) => {
										setSearch(value);
									}}
									filterOptions={options => {
										const filtered = options.filter(
											opt =>
												opt.name?.toLowerCase()?.includes(search?.toLowerCase()) ||
												opt.number?.toLowerCase()?.includes(search?.toLowerCase())
										);
										return filtered;
									}}
									onChange={(event, newValue) => {
										if (newValue) {
											const document = documents.getFiles.find(doc => doc.fileId === newValue._id);
											onSearcSelected(document);
										} else {
											setNewDocument(documentInitial);
										}
									}}
									renderInput={params => (
										<TextField
											variant="outlined"
											margin="dense"
											placeholder="Search by document name or number"
											{...params}
											InputProps={{
												...params.InputProps,
												startAdornment: (
													<InputAdornment position="start">
														<SearchIcon />
													</InputAdornment>
												),
											}}
											size="small"
										/>
									)}
								/>
							</ListItem>
						)}
					</>
				)}
				<ListItem
					style={{
						flexDirection: 'column',
						justifyContent: 'start',
						alignItems: 'start',
					}}
				>
					<h4>File Number</h4>
					<TextField
						className={classes.maxWidth}
						multiline
						disabled={selectedType === 'existing'}
						value={newDocument?.documentNumber}
						onChange={e => {
							setNewDocument({
								...newDocument,
								documentNumber: e.target.value,
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
					<h4>File Name</h4>
					<TextField
						className={classes.maxWidth}
						multiline
						disabled={selectedType === 'existing'}
						value={newDocument?.documentName}
						onChange={e => {
							setNewDocument({
								...newDocument,
								documentName: e.target.value,
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
					<h4>File Type</h4>
					<DocumentType
						disabled={selectedType === 'existing'}
						className={classes.maxWidth}
						documentTypes={documentTypes}
						setDocumentType={value => {
							setNewDocument({
								...newDocument,
								documentType: value,
							});
						}}
						value={newDocument.documentType ? newDocument.documentType : ''}
					/>
				</ListItem>
				<ListItem>
					<CustomDatePicker
						fieldAttributes={{
							name: 'fileDate',
							title: 'File Date',
							value: newDocument?.dateTime || null,
							titleComponent: 'h4',
							spacing: 0,
						}}
						fieldConfig={{
							variant: 'standard',
							disabled: selectedType === 'existing',
							fullWidth: true,
						}}
						fieldEvents={{
							onChange: value => {
								setNewDocument({
									...newDocument,
									dateTime: value.toDate(),
								});
							},
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
					<h4>Recording Info</h4>
					<TextField
						className={classes.maxWidth}
						multiline
						disabled={selectedType === 'existing'}
						value={newDocument?.recordingInfo}
						onChange={e => {
							setNewDocument({
								...newDocument,
								recordingInfo: e.target.value,
							});
						}}
					/>
				</ListItem>
			</List>

			{(newDocument?.fileId || fileData) && (
				<ListItem>
					<div style={{ display: 'flex', justifyContent: 'start' }}>
						{viewFileSResult?.viewFiles?.map((value, index) => {
							let fileExtension = value?.name?.slice(value.name.lastIndexOf('.') + 1)?.toLowerCase();

							if (index < 1) {
								return null;
							}

							return (
								<div key={value.id}>
									<LightTooltip
										title={
											<div className={classes.IconSection}>
												<IconButton
													size="small"
													disabled={selectedType === 'existing'}
													onClick={() => {
														setOpenDeleteConfirmDialog(true);
														setFileIdToDelete(value.id); // Pass fieldId in parameters
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
																pdfView: stateApp.selectedDocument,
															}));
														} else {
															handleViewFile(stateApp.selectedDocument.fileId);
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
						})}
						{/* <div style={{width:'150px',marginLeft:'20px'}}>
         <UploadZone
                style={{width:'150px',height:'150px'}}
             
              />
         </div> */}
					</div>
				</ListItem>
			)}

			{selectedType !== 'existing' && !newDocument?.fileId && !fileData && (
				<div className={classes.Uploadcomp}>
					<UploadZone
						style={{
							paddingLeft: '50px',
						}}
						relatedObjectId={props.globalWellId}
						relatedObjectType="Well"
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
					// disabled={updateDealLoading || addContactLoading}
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
					disabled={(!fileData && !newDocument.fileId) || (selectedType === 'existing' && !newDocument.fileId)}
					onClick={() => {
						if (selectedType === 'existing') {
							setLoader(true);
							addFile({
								variables: {
									fileName: newDocument.fileName,
									descriptorObjectId: newDocument.fileId,
									userId: stateApp.user.mongoId,
									relatedObjectId: props.globalWellId,
									relatedObjectType: 'Well',
								},
							}).then(() => {
								props.getAllFiles({
									variables: {
										relatedObjectId: props.tenantWellId,
										relatedObjectType: 'Well',
									},
								});
								props.setShowDocumentSlider(false);
								setNameAutValueParty1({ name: '', _id: null });
								setNameAutValueParty2({ name: '', _id: null });
								setNewDocument(documentInitial);
								setLoader(false);
							});
						} else {
							if (fileData || newDocument.fileId) {
								setLoader(true);
								UpDatefileFN();
							}
						}
					}}
					className={classes.footerButton}
				>
					Save
				</Button>
			</div>
		</div>
	);

	return (
		<div>
			<Drawer anchor={'right'} open={true}>
				<Dialog open={openDeleteConfirmDialog} onClose={handleDeleteCancel} style={{ zIndex: 99999999999 }}>
					<DeleteConfirmationDialog
						header="Delete Document"
						onClose={handleDeleteCancel}
						deleteFunc={handleDeleteAccept}
					>
						Do you want to delete the selected documents?
					</DeleteConfirmationDialog>
				</Dialog>
				<Dialog open={loader} style={{ zIndex: 99999999999 }}>
					<DialogTitle id="alert-dialog-title">
						<CircularProgress />
					</DialogTitle>
				</Dialog>

				<>{DocumentDetail('right')}</>
			</Drawer>
		</div>
	);
}

const DocumentType = ({ setDocumentType, value, documentTypes, ...other }) => {
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
		setDocumentType(value);
	};
	return (
		<Autocomplete
			defaultValue={value}
			value={value}
			disableListWrap
			classes={classes}
			options={
				documentTypes
					? documentTypes?.getFilesType?.map(type => {
							return { _id: type, name: type };
						})
					: []
			}
			getOptionLabel={option => {
				// Value selected with enter, right from the input
				if (typeof option === 'string') {
					return option;
				}
				// Add "xxx" option created dynamically
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
				// Suggest the creation of a new value
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
						setDocumentType(newValue);
					} else {
						setDocumentType({ _id: 'newEntity', name: newValue.name });
					}
				} else {
					setDocumentType('');
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

DocumentDrawer.propTypes = {
	setShowDocumentSlider: PropTypes.func.isRequired,
	getAllFiles: PropTypes.func.isRequired,
	globalWellId: PropTypes.string,
	tenantWellId: PropTypes.string,
};

DocumentType.propTypes = {
	control: PropTypes.object.isRequired,
	setDocumentType: PropTypes.func.isRequired,
	documentTypes: PropTypes.array,
	value: PropTypes.string,
};
