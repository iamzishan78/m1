import React, { useEffect, useState, Fragment } from 'react';
import { useDispatch } from 'react-redux';

import { IconButton, TextField, withStyles, Typography, Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import GetAppIcon from '@material-ui/icons/GetApp';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';

import { useApolloClient, useLazyQuery, useMutation } from '@apollo/client';
import { BlockBlobClient } from '@azure/storage-blob';
import _ from 'lodash';
import loadashFilter from 'lodash/filter';
import PropTypes from 'prop-types';

import Loader from 'components/Loaders';
import ReactSelectField from 'components/MRTTable/Common/Components/ReactSelectField';
import GenericDateField from 'components/Shared/components/Fields/GenericDateFIeld';
import get_file_icon from 'components/Shared/functions/get_file_icon.js';
import joinAddress from 'components/Shared/valueformatters/join-address.js';

import { ADDDESCRIPTORFILE } from 'graphQL/useMutationAddDescriptorFile';
import { PARSE_PDF_TEXTS, UPDATE_DOCUMENT } from 'graphQL/useMutationUpdateDocument';
import { DOCUMENT_TYPE } from 'graphQL/useQueryDocumentType';
import { VIEWFILESQUERY } from 'graphQL/useQueryViewFile';

import { globalStateController } from 'hookstate/globalStateController';
import { tableController, tableGlobalController } from 'hookstate/tableController';

import { CREATED_STATUS, ONE_MB } from 'utils/consts';

import { showErrorMessage } from 'actions';

import { createViewStateController, initialState } from './AddAndEditController';
import UploadZone from './UploadZone';

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
	dateRoot: {
		color: 'grey',
		'& input': {
			marginLeft: '20px',
		},
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
		'& .MuiDropzoneArea-root': {
			minHeight: '90px',
		},
	},
	forImage: {
		width: '100px !important',
		height: '100px !important',
		backgroundColor: 'transparent !important',
		borderRadius: '10px !important',
	},
	forImageContainer: {
		width: '100px !important',
		height: '100px !important',
		borderRadius: '10px !important',
		backgroundColor: '#eeeeee !important',
		textAlign: 'center',
		fontSize: '1.5rem',
		fontWeight: 'bold',
		color: '#555',
		textTransform: 'uppercase',
		paddingTop: '30px',
		cursor: 'pointer',
		marginBottom: '5px',
		marginLeft: '2rem',
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
	contentRoot: {
		maxHeight: 'calc(100vh - 310px)',
	},
	listItem: {
		flexDirection: 'column',
		justifyContent: 'start',
		alignItems: 'start',

		'& h4': {
			marginBottom: 0,
		},
	},
});

const LightTooltip = withStyles(theme => ({
	tooltip: {
		backgroundColor: theme.palette.common.white,
		color: 'rgba(0, 0, 0, 0.87)',
		boxShadow: theme.shadows[1],
		fontSize: 11,
	},
}))(Tooltip);

export default function DocumentDetails({ selectedDocument, handleClose, tableKey }) {
	const classes = useStyles();
	const dispatch = useDispatch();

	const { user } = globalStateController.useState(['user']);
	const getUser = user.get({ noproxy: true });

	const client = useApolloClient();

	const [getDocumentTypes, { data: documentTypes }] = useLazyQuery(DOCUMENT_TYPE, {
		fetchPolicy: 'no-cache',
	});

	const [addFile, { data: addFileData }] = useMutation(ADDDESCRIPTORFILE, {
		refetchQueries: ['getRecentContactFiles'],
		awaitRefetchQueries: true,
	});

	const [viewFiles, { data: viewFilesResult }] = useLazyQuery(VIEWFILESQUERY, {
		fetchPolicy: 'no-cache',
	});

	const [updateDocument] = useMutation(UPDATE_DOCUMENT);

	const formController = createViewStateController(tableKey);
	const formState = formController.useCompleteState();
	const formStateValues = formState?.get({ noproxy: true });

	const tableState = tableController(tableKey).useState(['TableSchema', 'columnVisibility']);
	const tableStateValues = tableState.stateValues;
	const filteredColumns = _.pickBy(tableStateValues?.columnVisibility, _.identity);
	const metaColumns = tableStateValues?.TableSchema.filter(obj => {
		const accessorKey = obj?.accessorKey || obj?.id;
		return filteredColumns[accessorKey] === true && obj?.isCustom;
	});

	const [fileUpload, setFileUpload] = useState({ upload: false, fileExtension: null, fileInformation: '' });
	const [url, setUrl] = useState({
		isValid: selectedDocument?.url ? true : false,
		value: selectedDocument?.url,
		error: false,
	});
	const [inputFile, setInputFile] = useState(null);
	const [fileDownload, setFileDownload] = useState(false);

	const saveDocument = document => {
		updateDocument({
			variables: {
				document,
			},
			refetchQueries: ['getParcelFiles', 'getParcelFilesCount'],
			awaitRefetchQueries: true,
		}).then(res => {
			if (res?.data?.updateDocumentFile) {
				const { success, message } = res.data.updateDocumentFile;
				if (success) {
					Loader.successToast('DocumentUpdating', message);
				} else {
					Loader.errorToast('DocumentUpdating', message);
				}
			} else {
				Loader.errorToast('DocumentUpdating', 'Failed to Update Document');
			}

			tableGlobalController.refetch();
		});
	};

	useEffect(() => {
		if (selectedDocument?._id || fileDownload) {
			viewFiles({ variables: { fileIds: [selectedDocument?._id] } });
		}
	}, [selectedDocument, fileDownload]);

	useEffect(() => {
		if (viewFilesResult && !fileDownload) {
			let fileInformation = viewFilesResult?.viewFiles[0];
			const splittedStrings = fileInformation?.name?.split('.');
			let docExtention = splittedStrings?.[splittedStrings.length - 1]?.toLowerCase();
			setFileUpload({ upload: true, fileExtension: docExtention, fileInformation });
		}

		if (fileDownload) {
			let a = document.createElement('a');
			a.href = viewFilesResult.viewFiles[0].uri;
			a.download = viewFilesResult.viewFiles[0].name;
			a.click();
		}
	}, [viewFilesResult]);

	useEffect(() => {
		getDocumentTypes();
	}, [getDocumentTypes]);

	useEffect(() => {
		if (addFileData && addFileData?.addFileDescriptor?.success) {
			const uri = addFileData.addFileDescriptor.file.uri;
			const interal_key = addFileData.addFileDescriptor.file.internalKey;
			const file_id = addFileData.addFileDescriptor.file.id;
			const file_name = addFileData.addFileDescriptor.file.name;

			const MBS = 4;

			if (file_id) {
				const blockBlobClient = new BlockBlobClient(uri);
				blockBlobClient
					.uploadBrowserData(inputFile, {
						maxSingleShotSize: MBS * ONE_MB,
						blobHTTPHeaders: {
							blobContentDisposition: `attachment; filename="${file_name}"`,
						},
						metadata: {
							Internalkey: interal_key,
						},
					})
					.then(res => {
						if (res?._response?.status !== CREATED_STATUS) {
							dispatch(showErrorMessage('Upload failed'));
							return;
						}

						if (fileUpload.fileExtension !== 'pdf') {
							return;
						}

						client.mutate({
							mutation: PARSE_PDF_TEXTS,
							variables: {
								fileId: file_id,
							},
						});
					})
					.catch(err => console.log(err));

				delete formStateValues.tableKey;
				const document = {
					...formStateValues,
					fileId: file_id,
				};

				Loader.createToast('DocumentUpdating', 'Document Updating in Progress');

				saveDocument(document);
				handleClose();
			}
		}
	}, [addFileData]);

	useEffect(() => {
		let fieldsValue = {};
		if (selectedDocument) {
			fieldsValue = _.pick(selectedDocument, Object.keys(initialState));
		}
		formController?.initialize(tableKey, fieldsValue);

		return () => {
			formController?.reset();
		};
	}, [selectedDocument]);

	useEffect(() => {
		const value = url?.isValid ? url?.value : null;
		formState?.url?.set(value);
	}, [url]);

	const uploadFile = () => {
		Loader.createToast('FileUploading', 'File Uploading in Progress');

		setInputFile(fileUpload?.fileInformation);
		addFile({
			variables: {
				fileName: fileUpload?.fileInformation?.name,
				userId: getUser?._id,
				// relatedObjectId: null,
				// relatedObjectType: null,
				fileId: selectedDocument?._id,
			},
		}).then(res => {
			if (res?.data?.addFileDescriptor) {
				const { success, message } = res.data.addFileDescriptor;
				if (success) {
					Loader.successToast('FileUploading', message);
				} else {
					Loader.errorToast('FileUploading', message);
				}
			} else {
				Loader.errorToast('FileUploading', 'Failed to Upload File');
			}
		});
	};

	const replaceFile = fileIdToDelete => {
		Loader.createToast('ReplaceFile', 'File Deletion in Progress');
		updateDocument({
			variables: {
				document: { fileId: fileIdToDelete, isDeleted: true },
			},
			awaitRefetchQueries: true,
		}).then(res => {
			if (res?.data?.updateDocumentFile) {
				const { success, message } = res.data.updateDocumentFile;
				if (success) {
					Loader.successToast('ReplaceFile', message);
				} else {
					Loader.errorToast('ReplaceFile', message);
				}
			} else {
				Loader.errorToast('ReplaceFile', 'Failed to Update Document');
			}

			setFileUpload({ upload: false, fileExtension: null, fileInformation: '' });
			tableGlobalController.refetch();
		});
	};

	return (
		<div>
			<div
				id="documentdetails"
				style={{
					flexGrow: 1,
					overflow: 'auto',
					minHeight: '2em',
					maxHeight: 'calc(100vh - 400px)',
				}}
			>
				<List>
					<ListItem className={classes.listItem}>
						<h4>File Number</h4>
						<TextField
							id="filenumber"
							className={classes.maxWidth}
							multiline
							value={formStateValues?.documentNumber}
							onChange={e => {
								formState?.documentNumber?.set(e.target.value);
							}}
						/>
					</ListItem>
					<ListItem className={classes.listItem}>
						<h4>File Name</h4>
						<TextField
							id="filename"
							className={classes.maxWidth}
							multiline
							value={formStateValues?.documentName}
							onChange={e => {
								formState?.documentName?.set(e.target.value);
							}}
						/>
					</ListItem>
					<ListItem className={classes.listItem}>
						<h4>File Type</h4>
						<DocumentType
							className={classes.maxWidth}
							documentTypes={documentTypes}
							setDocumentType={value => {
								let documentType = '';
								if (typeof value === 'string') {
									documentType = value;
								} else if (value?.name) {
									documentType = value.name;
								}
								formState?.documentType?.set(documentType);
							}}
							value={formStateValues?.documentType}
						/>
					</ListItem>
					<ListItem className={classes.listItem}>
						<h4>File Date</h4>
						<GenericDateField
							value={formStateValues?.dateTime}
							onChange={value => {
								formState?.dateTime?.set(value);
							}}
						/>
					</ListItem>

					<ListItem className={classes.listItem} style={{ flexDirection: 'row' }}>
						<div
							style={{
								marginRight: '15px',
							}}
						>
							<h4>Book</h4>
							<TextField
								id="book"
								className={classes.maxWidth}
								multiline
								value={formStateValues?.book}
								onChange={e => {
									formState?.book?.set(e.target.value);
								}}
							/>
						</div>

						<div
							style={{
								marginRight: '15px',
							}}
						>
							<h4>Page</h4>
							<TextField
								id="page"
								className={classes.maxWidth}
								multiline
								value={formStateValues?.page}
								onChange={e => {
									formState?.page?.set(e.target.value);
								}}
							/>
						</div>
						<div>
							<h4>Instrument #</h4>
							<TextField
								id="instrument"
								className={classes.maxWidth}
								multiline
								value={formStateValues?.instrument}
								onChange={e => {
									formState?.instrument?.set(e.target.value);
								}}
							/>
						</div>
					</ListItem>

					{metaColumns.map(meta => {
						return (
							<Fragment key={meta?.name}>
								{meta?.inputType === 'text' && (
									<ListItem className={classes.listItem}>
										<h4>{meta?.label}</h4>
										<TextField
											className={classes.maxWidth}
											value={formStateValues?.custom_data?.[meta?.dbKey]}
											onChange={e => {
												formController.updateState({
													custom_data: {
														...(formStateValues.custom_data || {}),
														[meta?.dbKey]: e.target.value,
													},
												});
											}}
										/>
									</ListItem>
								)}
								{(meta?.inputType === 'dropdown' || meta?.inputType === 'multiselect') && (
									<ListItem id={`${meta?.label}-field`} className={classes.listItem}>
										<h4>{meta?.label}</h4>
										<ReactSelectField
											isSingleSelect={meta?.inputType !== 'multiselect'}
											fullWidth
											showUnderline
											showChevron={true}
											index={'documentTable'}
											dropdownOptions={meta?.dropdownOptions}
											column={meta}
											value={formStateValues?.custom_data?.[meta?.dbKey]}
											onCustomKeyChange={value => {
												let dropdownValue = value ? value : null;
												formController.updateState({
													custom_data: {
														...(formStateValues.custom_data || {}),
														[meta?.dbKey]: dropdownValue,
													},
												});
											}}
										/>
									</ListItem>
								)}
							</Fragment>
						);
					})}
				</List>
			</div>
			<div style={{ flexShrink: 0 }}>
				<LightTooltip
					title={
						<div className={classes.IconSection}>
							<IconButton
								size="small"
								onClick={() => {
									if (selectedDocument?._id) {
										replaceFile(selectedDocument?._id);
									} else {
										setFileUpload({ upload: false, fileExtension: null, fileInformation: '' });
									}
								}}
							>
								<DeleteIcon />
							</IconButton>

							{selectedDocument?._id && (
								<IconButton
									disabled={false}
									size="small"
									onClick={() => {
										setFileDownload(true);
									}}
								>
									<GetAppIcon />
								</IconButton>
							)}
						</div>
					}
					interactive
				>
					{new RegExp(['jpg', 'jpeg', 'png', 'bmp'].join('|')).test(fileUpload?.fileExtension) ? (
						<img
							src={fileUpload?.fileInformation?.uri}
							alt={fileUpload?.fileInformation?.name}
							className={classes.forImage}
						></img>
					) : (
						<div className={fileUpload?.fileExtension ? classes.forImageContainer : ''} onClick={() => {}}>
							{get_file_icon(fileUpload?.fileExtension)}
						</div>
					)}
				</LightTooltip>

				{!fileUpload?.fileExtension ? (
					<div className={classes.Uploadcomp}>
						<UploadZone
							userId={getUser?._id}
							fileId={selectedDocument?._id}
							setFileUpload={setFileUpload}
							title={'Upload Document'}
							setUrl={setUrl}
							url={url}
						/>
					</div>
				) : null}
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
						id="documentSaveButton"
						variant="contained"
						color="secondary"
						size="medium"
						disableElevation
						disabled={!fileUpload?.upload && !url?.isValid}
						onClick={() => {
							if (fileUpload?.upload) {
								uploadFile();
							} else {
								delete formStateValues.tableKey;
								saveDocument({ ...formStateValues, fileId: null });
								handleClose();
							}
						}}
						className={classes.footerButton}
					>
						Save
					</Button>
				</div>
			</div>
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
			id="filetype"
			defaultValue={value}
			value={value}
			disableListWrap
			classes={classes}
			options={
				documentTypes?.getFilesType?.map(type => {
					return { _id: type, name: type };
				}) ?? []
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

DocumentDetails.propTypes = {
	selectedDocument: PropTypes.object,
	handleClose: PropTypes.func.isRequired,
	tableKey: PropTypes.string.isRequired,
};

DocumentType.propTypes = {
	setDocumentType: PropTypes.func.isRequired,
	value: PropTypes.string,
	documentTypes: PropTypes.object,
};
