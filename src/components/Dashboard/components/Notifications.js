import React, { Fragment, useEffect, useState, useContext } from 'react';
import Avatar from 'react-avatar';
import { useHistory } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';

import { Grid, Typography } from '@material-ui/core';
import { CircularProgress, Menu, MenuItem, TextField, InputAdornment, IconButton } from '@material-ui/core';
import CardHeader from '@material-ui/core/CardHeader';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Tooltip from '@material-ui/core/Tooltip';
import { LocalAtm } from '@material-ui/icons';
import { DescriptionOutlined } from '@material-ui/icons';
import ClearIcon from '@material-ui/icons/Clear';
import FolderIcon from '@material-ui/icons/Folder';
import ContactIcon from '@material-ui/icons/Group';
import NotificationsIcon from '@material-ui/icons/Notifications';
import FlowIcon from '@material-ui/icons/Repeat';
import SearchIcon from '@material-ui/icons/Search';

import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import { useLazyQuery, useMutation } from '@apollo/client';

import Loader from 'components/Loaders';
import { CommonCommentText } from 'components/Shared/CommentComponent';
import ArchiveIcon from 'components/Shared/svgIcons/archive';
import MarkUnreadIcon from 'components/Shared/svgIcons/mark-unread';
import TractIcon from 'components/Shared/svgIcons/tract';
import UnitIcon from 'components/Shared/svgIcons/unit';

import { ARCHIVE_ALL_MUTATIONS } from 'graphQL/useMutationArchiverAllMentions';
import { UPDATE_NOTIFICATION_STATUS } from 'graphQL/useMutationUpdateNotificationStatus';
import { GET_DB_DATA } from 'graphQL/useQueryDbQuery';
import { GET_PROFILES_IMAGES } from 'graphQL/useQueryGetProfile';
import { GETMONGOUSERS } from 'graphQL/useQueryGetUsers';

import { globalStateController } from 'stateManagement/globalStateController';

import { dateIsValid } from 'utils/helper';

import { AppContext } from 'AppContext';

const useStyles = makeStyles(theme => ({
	header: {
		padding: '8px 8px 0 16px',
		backgroundColor: '#FFFFF',
		color: 'black',
	},
	listitem: {
		padding: '10px',
		backgroundColor: '#F6F8F9',
		'&:hover': {
			backgroundColor: '#DDDFE0',
		},
		'& .MuiFormControl-marginDense': {
			margin: '0px !important',
		},
		'& .MuiIconButton-root': {
			paddingLeft: '10px !important',
			paddingRight: '10px !important',
		},
	},
	thumb: {
		height: '16px',
		maxWidth: '16px',
	},
	source: {
		fontSize: '12px',
		marginLeft: '0px',
	},
	title: {
		fontSize: '16px',
		marginLeft: '22px',
		marginBottom: '-6px',
		fontWeight: 'bold',
		textDecoration: 'none',
		color: 'black',
		cursor: 'pointer',
		display: 'flex',
		'& svg': {
			color: '#000000',
			marginRight: '7px',
		},
		'&:hover': {
			textDecoration: 'underline',
		},
	},
	content: {
		fontSize: '12px',
		marginBottom: '0px',
	},
	date: {
		fontSize: '10px',
	},
	paper: {
		margin: '12px 8px',
		cursor: 'pointer',
		boxShadow: 'none !important',
	},
	image: {
		maxHeight: '72px',
		maxWidth: '65px !important',
		borderRadius: '0px',
	},
	gridStyle: {
		padding: '8px 0px',
	},
	paddingLeft10: {
		paddingLeft: '10px !important',
		paddingTop: '3px !important',
	},
	bold: {
		fontWeight: 'bold',
	},
	commentTime: {
		marginLeft: '8px',
		fontSize: '12px',
	},
	sysNotification: {
		marginLeft: 0,
	},
	customTabs: {
		display: 'flex',
		alignItems: 'center ',
		float: 'right',
		paddingRight: '30px',
		'& .MuiTab-root': {
			minWidth: '60px',
		},
		'& .Mui-selected': {
			color: '#18AADD',
		},
	},
	menuIcon: {
		display: 'none',
	},
	archiveBtn: {
		display: 'block',
		position: 'absolute',
		bottom: '-25px',
		boxShadow: 'rgba(170, 180, 190, 0.6) 0px 4px 20px',
		zIndex: 1,
		backgroundColor: 'white',
	},
	menuItem: {
		fontSize: '14px',
		padding: 0,
		'& > span': {
			display: 'flex',
			gap: '4px',
		},
	},
	searchStyle: {
		gap: '1rem',
		flexWrap: 'nowrap',
	},
}));

const Title = ({ tab, setTab, setNotifications, copyData, archiveAllAndClose }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const [search, setSearch] = useState('');
	const [defaultData, setDefaultData] = useState([]);
	const classes = useStyles();

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleClick = event => {
		setAnchorEl(event.currentTarget);
	};

	useEffect(() => {
		setSearch('');
	}, [tab]);

	useEffect(() => {
		if (search?.length && copyData?.length) {
			setDefaultData(copyData);
			const showNotification = copyData.filter(notification => {
				const parentName = notification?.parent?.name;
				if (Array.isArray(parentName)) {
					return parentName.some(name => name.toLowerCase().includes(search?.toLowerCase()));
				} else {
					return parentName?.toLowerCase()?.includes(search?.toLowerCase());
				}
			});
			setNotifications(showNotification);
		} else if (search?.length === 0 && copyData?.length) {
			setNotifications(defaultData);
		}
	}, [search]);

	const archiveAll = () => {
		archiveAllAndClose();
		handleClose();
	};

	return (
		<Grid container className={classes.gridStyle}>
			<Grid item xs={6} container alignItems="center" className={classes.searchStyle}>
				<Typography variant="h5">Notifications</Typography>

				<TextField
					value={search}
					onChange={e => setSearch(e.target.value)}
					style={{
						margin: 0,
						width: '70%',
					}}
					margin="dense"
					variant="outlined"
					InputProps={{
						startAdornment: (
							<InputAdornment>
								<IconButton size="small">
									<SearchIcon htmlColor="grey" />
								</IconButton>
							</InputAdornment>
						),
						endAdornment: (
							<>
								<Tooltip title="Clear">
									<IconButton
										id="crossButton"
										size="small"
										htmlColor="#fff"
										onClick={() => {
											setNotifications(defaultData);
											setSearch('');
										}}
									>
										<ClearIcon />
									</IconButton>
								</Tooltip>
							</>
						),
					}}
				/>
			</Grid>

			<Grid item xs={6}>
				<div className={classes.customTabs}>
					<Tabs
						value={tab}
						textColor="primary"
						onChange={(e, newValue) => {
							setTab(newValue);
						}}
					>
						<Tab label="Active" />
						<Tab label="Archive" />
					</Tabs>
					<MoreHorizIcon onClick={handleClick} />

					<Menu
						id="menu"
						anchorEl={anchorEl}
						keepMounted
						open={Boolean(anchorEl)}
						onClose={handleClose}
						getContentAnchorEl={null}
						anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
						transformOrigin={{ vertical: 'top', horizontal: 'center' }}
					>
						<MenuItem>
							<IconButton className={classes.menuItem} onClick={archiveAll}>
								<Inventory2OutlinedIcon /> {'Archive All'}
							</IconButton>
						</MenuItem>
					</Menu>
				</div>
			</Grid>
		</Grid>
	);
};

const Notifications = () => {
	let history = useHistory();
	const [, setStateApp] = useContext(AppContext);
	const [notifications, setNotifications] = useState([]);
	const [profilesInfo, setProfilesInfo] = useState({});
	const [users, setUsers] = useState([]);
	const [tab, setTab] = useState(0);
	const [copyData, setCopyData] = useState([]);
	const { user } = globalStateController.useState(['user']);
	const getUser = user.get({ noproxy: true });

	const [archiveAllMentions] = useMutation(ARCHIVE_ALL_MUTATIONS);
	const [updateNotificationStatus] = useMutation(UPDATE_NOTIFICATION_STATUS);

	const [getNotifications, { data: allNotifications, loading, refetch: refetchAllNotifications }] = useLazyQuery(
		GET_DB_DATA,
		{ fetchPolicy: 'no-cache' }
	);

	const [getProfilesImages, profilesData] = useLazyQuery(GET_PROFILES_IMAGES, {
		fetchPolicy: 'cache-first',
	});
	const [getAllMongoUsers, { data: userLists }] = useLazyQuery(GETMONGOUSERS, {
		fetchPolicy: 'cache-and-network',
	});

	useEffect(() => {
		const filters = [{ field: 'receiverId', value: getUser?._id }];
		if (tab === 0) {
			filters.push({
				field: 'state',
				value: 'ARCHIVED',
				type: 'advanced',
				searchType: 'notEquals',
			});
		} else {
			filters.push({ field: 'state', value: 'ARCHIVED' });
		}

		getNotifications({
			variables: {
				index: 'notification_flat',
				filters,
				sort: { field: 'dateTimeAdded', order: 'desc' },
				pagination: {
					first: 10000,
					after: null,
				},
			},
		});
	}, [tab]);

	useEffect(() => {
		if (allNotifications) {
			// if notificationType is MENTION then comment key must exist in array
			// {notificationType: "MENTION", comment: { $exists: true }}
			const showNotifications = allNotifications?.getDbData?.hits?.filter(notificationObj => {
				return (
					notificationObj.notificationType !== 'MENTION' ||
					(notificationObj.notificationType === 'MENTION' && notificationObj.comment !== undefined)
				);
			});
			setNotifications(showNotifications);
			setCopyData(showNotifications);
		}
	}, [allNotifications]);

	useEffect(() => {
		getAllMongoUsers();
	}, [getAllMongoUsers]);

	useEffect(() => {
		if (userLists && userLists.allMongoUsers) {
			const data = userLists.allMongoUsers
				?.map(user => ({
					_id: user._id,
					name: user.name,
					email: user.email,
				}))
				.filter(user => user._id && user.name);
			setUsers(data);
			const emails = userLists.allMongoUsers?.map(user => user.email);
			getProfilesImages({
				variables: { emails },
			});
		}
	}, [userLists]);

	useEffect(() => {
		if (profilesData?.data?.profileByEmail?.profiles) {
			setProfilesInfo(profilesData.data.profileByEmail.profiles);
		}
	}, [profilesData]);

	const handleScroll = () => {
		// const list = document.getElementById("noifications-list");
		// if (list) {
		//   const scrollTop = list.scrollTop;
		//   const scrollHeight = list.scrollHeight;
		//   const clientHeight = list.clientHeight;
		//   // Calculate the position where the user reaches the end of the list's content
		//   const isAtEndOfList = scrollTop + clientHeight >= scrollHeight - 20;
		//   if (allNotifications?.getDbData?.hits?.length === 0) return;
		//   if (isAtEndOfList && !isFetching) {
		//   }
		// }
	};

	const archiveAllAndClose = async () => {
		Loader.createToast('archived', 'Archive All Mentions in Progress');
		await archiveAllMentions({
			awaitRefetchQueries: false,
		});
		Loader.successToast('archived', 'Archive All Mentions Complete');
		refetchAllNotifications();
	};
	const classes = useStyles();

	const getNotificationIcon = type => {
		switch (type) {
			case 'PARCEL':
				return <TractIcon />;
			case 'UNIT':
				return <UnitIcon />;
			case 'AGREEMENT':
				return <FolderIcon />;
			case 'CONTACT':
				return <ContactIcon />;
			case 'DEAL':
				return <FlowIcon />;
			case 'CHECK':
				return <LocalAtm />;
			case 'PROPERTY':
			case 'FILE':
				return <DescriptionOutlined />;
			default:
				return;
		}
	};

	return (
		<Fragment>
			<CardHeader
				title={
					<Title
						tab={tab}
						setTab={setTab}
						setNotifications={setNotifications}
						copyData={copyData}
						archiveAllAndClose={archiveAllAndClose}
					/>
				}
				className={classes.header}
			/>

			{loading ? (
				<CircularProgress className={classes.progress} size={80} disableShrink color="secondary"></CircularProgress>
			) : (
				<List
					onScroll={handleScroll}
					id="noifications-list"
					style={{ maxHeight: 'calc(100% - 48px)', overflow: 'auto' }}
				>
					{notifications?.map(
						(
							{
								_id,
								state,
								comment,
								parent,
								sender,
								notificationType,
								parentType,
								dateTimeAdded,
								message,
								pipelineId,
								stageId,
							},
							i
						) => {
							const user = users.find(user => comment?.user === user?._id);
							return (
								<Paper key={i} className={classes.paper}>
									<Grid
										container
										direction="row"
										justify="space-between"
										alignItems="center"
										style={
											state === 'UNREAD' ? { borderLeft: '4px solid #01B0F0' } : { borderLeft: '4px solid #BFBFBF' }
										}
										className={classes.listitem}
										spacing={1}
										onClick={async () => {
											await updateNotificationStatus({
												variables: {
													id: _id,
													state: 'READ',
												},
											});
											refetchAllNotifications();
											if (parentType === 'DEAL') {
												history.push(`/flow/${pipelineId}/lane/${stageId}/card/${parent._id}/`);
											} else if (parentType === 'PARCEL' || parentType === 'UNIT') {
												history.push(`/map/${parentType.toLowerCase()}s/${parent._id}`);
											} else if (parentType === 'AGREEMENT') {
												history.push(`/map/${parent.layer}s/${parent._id}`);
											} else if (parentType === 'ACTIVITY') {
												history.push(`/calendar/activities/${parent._id}`);
											} else if (parentType === 'CHECK') {
												history.push(`/revenue/statement/details/${parent._id}`);
											} else if (parentType === 'PROPERTY') {
												history.push(`/revenue/property/details/${parent._id}`);
											} else if (parentType === 'CONTACT') {
												history.push(`/contact/details/${parent._id}`);
											} else if (parentType === 'FILE') {
												history.push('/documents');
												setStateApp(state => ({
													...state,
													pdfView: null,
													selectedDocument: {
														fileId: parent._id,
														documentName: parent.name,
														fileType: parent.name.split('.')[parent.name.split('.').length - 1].toUpperCase(),
														fileCreatedAt: parent.fileCreatedAt,
														uploadedBy: parent.user.name,
														fileSize: Math.round(parent.size / 1024) + ' KB',
														...parent,
													},
												}));
											}
										}}
									>
										<Grid item xs={10} zeroMinWidth>
											{parent &&
												(parentType === 'DEAL' ||
													parentType === 'PARCEL' ||
													parentType === 'UNIT' ||
													parentType === 'AGREEMENT' ||
													parentType === 'CONTACT') && (
													<span className={classes.title}>
														{getNotificationIcon(parentType)}
														{parent.name}
													</span>
												)}
											{parent && parentType === 'CHECK' && (
												<span className={classes.title}>
													{getNotificationIcon(parentType)}
													{parent.checkNumber}-{parent?.payor?.name}
												</span>
											)}
											{parent && parentType === 'PROPERTY' && (
												<span className={classes.title}>
													{getNotificationIcon(parentType)}
													{parent.number}-{parent.name}
												</span>
											)}

											{parent && parentType === 'FILE' && (
												<span className={classes.title}>
													{getNotificationIcon(parentType)}
													{parent.name}
												</span>
											)}

											{(notificationType === 'TASK_COMPLETED' || notificationType === 'TASK_ASSIGNMENT') && (
												<Grid container className={classes.gridStyle}>
													<Grid item xs={1}>
														<IconButton style={{ marginTop: '0px', marginLeft: '14px' }}>
															{profilesInfo[sender?.email]?.profileImage ? (
																<Avatar src={profilesInfo[sender?.email].profileImage} size="38" round />
															) : (
																<Avatar name={sender?.name} size="38" round />
															)}
														</IconButton>
													</Grid>
													<Grid item xs={11} className={classes.paddingLeft10}>
														<div>
															<span className={classes.bold}>{sender?.name}</span>
															{notificationType === 'TASK_COMPLETED'
																? '  has completed the Task'
																: '  has assigned you a Task'}
														</div>
														<div>{parent?.name}</div>
														<div>Deal: {parent?.dealName || 'N/A'}</div>
													</Grid>
												</Grid>
											)}

											{notificationType === 'SYSTEM' && (
												<Grid container className={classes.gridStyle}>
													<Grid item xs={1}>
														<IconButton style={{ marginTop: '0px', marginLeft: '14px' }}>
															<NotificationsIcon />
														</IconButton>
													</Grid>
													<Grid item xs={11} className={classes.paddingLeft10}>
														<div>
															{dateIsValid(Date.parse(dateTimeAdded)) && (
																<ReactTimeAgo
																	className={[classes.commentTime, classes.sysNotification]}
																	date={
																		new Date(
																			new Intl.DateTimeFormat('en-US', {
																				year: 'numeric',
																				month: 'long',
																				day: '2-digit',
																				hour: '2-digit',
																				minute: '2-digit',
																			}).format(Date.parse(dateTimeAdded))
																		)
																	}
																	locale="en-US"
																/>
															)}
															<br />
															<span>{message}</span>
														</div>
													</Grid>
												</Grid>
											)}
											{notificationType === 'MENTION' && (
												<Grid container className={classes.gridStyle}>
													<Grid item xs={1}>
														<IconButton style={{ marginTop: '0px', marginLeft: '14px' }}>
															{profilesInfo[user?.email]?.profileImage ? (
																<Avatar src={profilesInfo[user?.email].profileImage} size="38" round />
															) : (
																<Avatar name={user?.name} size="38" round />
															)}
														</IconButton>
													</Grid>
													<Grid item xs={11} className={classes.paddingLeft10}>
														<div>
															<span className={classes.bold}>{user?.name}</span>
															{comment?.ts && (
																<ReactTimeAgo
																	className={classes.commentTime}
																	date={new Date(comment?.ts)}
																	locale="en-US"
																/>
															)}
														</div>
														<CommonCommentText users={users} eachComment={comment} />
													</Grid>
												</Grid>
											)}
										</Grid>
										<Grid item xs={2} style={{ textAlign: '-webkit-center' }}>
											<Tooltip title="Mark as unread">
												<IconButton
													onClick={async e => {
														e.stopPropagation();
														await updateNotificationStatus({
															variables: {
																id: _id,
																state: 'UNREAD',
															},
														});
														refetchAllNotifications();
													}}
												>
													<MarkUnreadIcon />
												</IconButton>
											</Tooltip>
											{state !== 'ARCHIVED' && (
												<Tooltip title="Archive notification">
													<IconButton
														onClick={async e => {
															e.stopPropagation();
															await updateNotificationStatus({
																variables: {
																	id: _id,
																	state: 'ARCHIVED',
																},
															});
															refetchAllNotifications();
														}}
													>
														<ArchiveIcon />
													</IconButton>
												</Tooltip>
											)}
										</Grid>
									</Grid>
								</Paper>
							);
						}
					)}
					{loading && (
						<CircularProgress className={classes.progress} size={40} disableShrink color="secondary"></CircularProgress>
					)}
				</List>
			)}
		</Fragment>
	);
};
export default Notifications;
