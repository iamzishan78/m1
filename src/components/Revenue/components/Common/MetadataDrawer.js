import React, { useState, useEffect, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import { Typography, TextField, Grid, FormControl, Select, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { useLazyQuery } from '@apollo/client';
import moment from 'moment';
import PropTypes from 'prop-types';

import AddDialogeUploadZone from 'components/ContactDetailCard/components/AddDialogUploadZone';
import CommentComponent from 'components/Shared/CommentComponent';
import ShapeOwnerInput from 'components/Shared/ShapeOwnerInput';
import ArrowForwardIcon from 'components/Shared/svgIcons/KeyboardTabBlackIcon';
import UsersListWithIcon from 'components/Shared/UsersListWithIcon';

import { GETRECENTCONTACTFILES } from 'graphQL/useQueryGetContactFiles';
import { VIEWFILESQUERY } from 'graphQL/useQueryViewFile';

import { AppContext } from 'AppContext';

const THEME_SPACING = 3;

const useStyles = makeStyles(theme => ({
	titleText: {
		// marginLeft: 16,
	},
	metaPanelCloseIcon: {
		'& svg': {
			fontSize: 18,
			cursor: 'pointer',
			fill: '#808080 !important',
		},
	},
	gridStyle: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
	dealOwnerRoot: {
		border: '1px solid #EBEBEB',
		'&[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-child': {
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
	popupIndicator: {
		visibility: 'hidden',
		padding: '2px',
		marginRight: '-2px',
		'&:hover': {
			visibility: 'visible',
		},
	},
	inputFieldOwner: {
		marginBottom: '7px',
	},
	dealOwnerAvatar: {
		width: theme.spacing(THEME_SPACING),
		height: theme.spacing(THEME_SPACING),
		color: '#fff',
		fontSize: '0.6rem',
		backgroundColor: '#4880F6',
		padding: '0.5em',
	},
	dealOwnerLabel: {
		marginLeft: 4,
	},
	descriptionInput: {
		width: '100%',
		minHeight: '90PX',
		mAXHeight: '140PX',
		margin: '20px 0 0',
		'& .MuiTextField-root': {
			backgroundColor: '#fffcdc',
			borderRadius: 4,
		},
		'& .MuiOutlinedInput-notchedOutline': {
			border: 'none',
		},
		'& textarea': {
			minHeight: '90PX',
			mAXHeight: '140PX',
		},
	},
	foodText: {
		position: 'absolute',
		bottom: '20px',
		right: '0px',
		fontSize: '10px',
		color: '#6e6e6e',
		margin: '0 !important',
		textAlign: 'right',
		height: '0',
		paddingRight: '10px',
		'& span': {
			fontWeight: 'bold',
		},
	},
	viewAll: {
		textDecoration: 'underline',
		// margin: "0 0 8px 0",
		float: 'right',
		color: theme.palette.secondary.main,
		cursor: 'pointer',
		fontWeight: 'normal',
		'&:hover': { color: '#757575' },
		transition: 'color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
	},
	contentRoot: {
		overflow: 'overlay',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		width: '100%',
		height: '100%',
	},
}));

export default function MetadataDrawer(props) {
	const classes = useStyles();
	const history = useHistory();
	const { control } = useForm();
	// States
	const [ownerId, setOwnerId] = useState('');
	const [description, setDescription] = useState('');
	const [fileRequestCounter, setFileRequestCounter] = useState(1);
	const [uploadedFiles, setUploadedFiles] = useState([]);
	const [, setStateApp] = useContext(AppContext);

	// Props
	const {
		setCollapse,
		targetSourceId,
		targetLabel,
		viewAllDocuments,
		pageLink,
		ownerTitle,
		ownerPlaceHolder,
		isApproval,
		isOwner,
		isSource,
		data,
		shapeType,
		shapeData,
	} = props;
	// Queries and Mutations
	const [getRecentFiles, { data: files }] = useLazyQuery(GETRECENTCONTACTFILES, {
		fetchPolicy: 'cache-and-network',
		onCompleted: ({ getFileDescriptors }) => {
			let allActive = true;
			const DEFAULT_COUNTER = 40;

			if (getFileDescriptors) {
				for (let i = 0; i < getFileDescriptors.length; i++) {
					if (getFileDescriptors[i].fileState !== 'active') {
						allActive = false;
						break;
					}
				}
			}

			if (!allActive) {
				if (fileRequestCounter <= DEFAULT_COUNTER) {
					let waitBeforeRequestAgain = setTimeout(() => {
						setFileRequestCounter(fileRequestCounter + 1);
						getRecentFiles({
							variables: {
								relatedObjectId: targetSourceId,
								relatedObjectType: targetLabel,
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

	useEffect(() => {
		setDescription(props?.data?.[props.descriptionKey]);
	}, [props.data, props.descriptionKey]);

	useEffect(() => {
		if (targetSourceId) {
			getRecentFiles({
				variables: {
					relatedObjectId: targetSourceId,
					relatedObjectType: targetLabel,
				},
			});
		}
	}, [targetSourceId, targetLabel, getRecentFiles]);

	useEffect(() => {
		if (files?.getFileDescriptors) {
			let ID = [];
			for (let i = 0; i < files.getFileDescriptors.length; i++) {
				ID.push(files.getFileDescriptors[i].fileId);
			}
			for (let i = 0; i < uploadedFiles.length; i++) {
				ID.push(uploadedFiles[i].addFileDescriptor.file.id);
			}
			viewFiles({
				variables: { fileIds: ID },
			});
			//* Getting most recent uploaded pdf file
			let recentFile = {};
			files.getFileDescriptors
				.filter(d => d.fileName.split('.')?.[1]?.toLowerCase() === 'pdf')
				.forEach((d, index) => {
					let descriptor = d;
					descriptor = {
						...descriptor,
						dateTime: moment(descriptor.dateTime, 'MM/DD/YYYY HH:mm Z'),
					};
					if (index === 0) {
						recentFile = descriptor;
					} else {
						if (recentFile.dateTime < descriptor.dateTime) {
							recentFile = descriptor;
						}
					}
				});
		}
	}, [files, uploadedFiles, viewFiles]);

	useEffect(() => {
		const owner = props.data?.metaOwner?._id ?? props.data?.owner; // null checks to avoid crashing
		if (owner) {
			setOwnerId(owner);
		}
	}, [props.data]);

	const setUploadedFileData = uploadedfile => {
		setUploadedFiles([...uploadedFiles, uploadedfile]);
	};

	return (
		<div
			className="flex column justifyStart alignStart w-100"
			style={{
				padding: '15px 25px 0',
				background: '#ffffff',
				borderRadius: 8,
				overflow: 'auto',
				height: '100%',
				width: '100%',
			}}
		>
			<div className="flex justifyBetween alignCenter w-100">
				<Typography
					varient="h5"
					className={classes.titleText}
					style={{
						fontWeight: 'bold',
						fontSize: 19,
					}}
				>
					{props.title}
				</Typography>

				<div className="flex alignCenter">
					{props.menuComponent}
					<span onClick={() => setCollapse(true)} className={classes.metaPanelCloseIcon}>
						<ArrowForwardIcon />
					</span>
				</div>
			</div>

			<div className={classes.contentRoot}>
				<div>
					{(isOwner || isApproval || isSource) && (
						<div style={{ marginTop: 10 }}>
							<FormControl variant="outlined" fullWidth size="small">
								{isOwner && targetLabel === 'Shape' && (
									<ShapeOwnerInput data={data} shapeType={shapeType} shapeData={shapeData} label="Owner" />
								)}
								{isOwner && targetLabel !== 'Shape' && (
									<UsersListWithIcon
										field={{ key: 'owner' }}
										label={ownerTitle}
										placeholder={ownerPlaceHolder}
										selectedUserId={ownerId}
										onChangeUser={user => {
											setOwnerId(user?.value);
											if (props.onUpdate) {
												props.onUpdate({
													owner: user?.value,
													ownerName: user?.text,
												});
											}
										}}
									/>
								)}
								{isApproval && (
									<Grid container className={classes.gridStyle}>
										<Grid item xs={3}>
											<div>Approval Status</div>
										</Grid>
										<Grid item xs={9}>
											<Controller
												control={control}
												name="status"
												render={({ field }) => (
													<Select
														{...field}
														id="status-simple-select-outlined-label"
														variant="outlined"
														value={data?.approvalStatus ? data.approvalStatus : data?.status ? data.status : ''}
														fullWidth
														onChange={e => {
															props.onUpdate({ approvalStatus: e.target.value });
														}}
													>
														<MenuItem value="Approved">Approved</MenuItem>
														<MenuItem value="Unapproved">Unapproved</MenuItem>
													</Select>
												)}
											/>
										</Grid>
									</Grid>
								)}
								{isSource && (
									<Grid container className={classes.gridStyle} style={{ marginTop: 10 }}>
										<Grid item xs={3}>
											<div>Source</div>
										</Grid>
										<Grid item xs={9}>
											<Controller
												control={control}
												name="status"
												render={({ field }) => (
													<Select
														{...field}
														id="source-simple-select-outlined-label"
														variant="outlined"
														value={data.source || ''}
														fullWidth
														onChange={e => {
															props.onUpdate({ source: e.target.value });
														}}
													>
														<MenuItem value="Manual Entry">Manual Entry</MenuItem>
														<MenuItem value="Imported">Imported</MenuItem>
													</Select>
												)}
											/>
										</Grid>
									</Grid>
								)}
							</FormControl>
						</div>
					)}

					{props.showDescription && (
						<Grid item className={classes.descriptionInput}>
							<TextField
								id="outlined-multiline-static"
								label="Description"
								value={description}
								multiline
								fullWidth
								rows={5}
								variant="outlined"
								onChange={e => {
									setDescription(e.target.value);
								}}
								onBlur={({ target }) => {
									if (props.onUpdate) {
										props.onUpdate({
											[props.descriptionKey]: target.value,
										});
									}
								}}
							/>
						</Grid>
					)}

					<div className="flex justifyBetween alignCenter" style={{ padding: '20px 10px 16px 0px', marginBottom: -56 }}>
						<h4 style={{ padding: '0px' }}>{props.documentsTitle}</h4>
						{viewAllDocuments && (
							<h4
								id="viewAllDocuments"
								className={classes.viewAll}
								onClick={() => {
									const link = pageLink ?? `/contact/details/${targetSourceId}/documents`;
									history.push(link);
									setStateApp(stateApp => ({ ...stateApp, viewDoc: null, isExpanded: true }));
								}}
							>
								View All
							</h4>
						)}
					</div>
					<AddDialogeUploadZone
						filesData={viewFileResult}
						id={targetSourceId}
						loading={viewFileLoading}
						targetLabel={targetLabel}
						setUploadedFileData={setUploadedFileData}
					/>
				</div>
				<div
					style={{
						height: '500px',
					}}
				>
					<CommentComponent
						targetLabel={targetLabel}
						targetSourceId={targetSourceId}
						commentsHeight={targetLabel === 'Contact' ? '580px' : null}
						activityLog={props.activityLog}
						showCommentType={props.showCommentType}
					/>
				</div>
			</div>
		</div>
	);
}

MetadataDrawer.propTypes = {
	setCollapse: PropTypes.func.isRequired,
	targetSourceId: PropTypes.string.isRequired,
	targetLabel: PropTypes.string.isRequired,
	title: PropTypes.string,
	viewAllDocuments: PropTypes.bool,
	ownerTitle: PropTypes.string,
	ownerPlaceHolder: PropTypes.string,
	isApproval: PropTypes.bool,
	isOwner: PropTypes.bool,
	isSource: PropTypes.bool,
	data: PropTypes.object,
	shapeType: PropTypes.string,
	shapeData: PropTypes.object,
	descriptionKey: PropTypes.string,
	onUpdate: PropTypes.func,
	menuComponent: PropTypes.node,
	showDescription: PropTypes.bool,
	documentsTitle: PropTypes.string, // Added propTypes validation for documentsTitle
	activityLog: PropTypes.array,
	showCommentType: PropTypes.bool,
	// other propTypes
};

MetadataDrawer.defaultProps = {
	title: 'Metadata',
	documentsTitle: 'Documents',
	showDescription: true,
	commentsWidth: '570px',
	viewAllDocuments: false,
	ownerTitle: 'Owner',
	ownerPlaceHolder: 'Assign Owner',
	descriptionKey: 'metaDescription',
	isApproval: false,
	isOwner: true,
	isSource: true,
	data: {},
};

MetadataDrawer.propTypes = {
	setCollapse: PropTypes.func,
	onUpdate: PropTypes.func,
	targetSourceId: PropTypes.string,
	targetLabel: PropTypes.string,
	viewAllDocuments: PropTypes.func,
	ownerTitle: PropTypes.string,
	showDescription: PropTypes.string,
	ownerPlaceHolder: PropTypes.string,
	isApproval: PropTypes.bool,
	isOwner: PropTypes.bool,
	isSource: PropTypes.bool,
	data: PropTypes.array,
	shapeType: PropTypes.string,
	descriptionKey: PropTypes.string,
	documentsTitle: PropTypes.string,
	title: PropTypes.string,
	shapeData: PropTypes.array,
	showCommentType: PropTypes.bool,
	menuComponent: PropTypes.bool,
	activityLog: PropTypes.array,
};
