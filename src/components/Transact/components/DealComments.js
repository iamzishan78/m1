import React, { useState, useEffect, useContext, Fragment, useCallback } from 'react';
import Avatar from 'react-avatar';
import { useSelector, useDispatch } from 'react-redux';
import ReactTimeAgo from 'react-time-ago';

import { CircularProgress, Menu, MenuItem, Grid, Tooltip, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
	ThumbUp as ThumbUpIcon,
	ThumbUpAltOutlined as ThumbUpAltOutlinedIcon,
	ExpandMore as ExpandMoreIcon,
} from '@material-ui/icons';

import { useMutation, useLazyQuery } from '@apollo/client';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import ru from 'javascript-time-ago/locale/ru';
import moment from 'moment';

import { CommonCommentText } from 'components/Shared/CommentComponent';
import CommentField from 'components/Shared/components/Fields/CommentField';

import { REMOVECOMMENT } from 'graphQL/useMutationRemoveComment';
import { UPSERTCOMMENT } from 'graphQL/useMutationUpsertComment';
import { COMMENTSBYOBJECTIDQUERY } from 'graphQL/useQueryCommentsByObjectId';
import { GET_PROFILES_IMAGES, GET_PROFILE_IMAGE } from 'graphQL/useQueryGetProfile';
import { GETMONGOUSERS } from 'graphQL/useQueryGetUsers';
import { TOGGLECOMMENTREACTION } from 'graphQL/userMutationToggleCommentReaction';

import { updatePinComments } from 'store/actions/commonActions';

import { UserSession } from 'utils/user';

import { AppContext } from 'AppContext';

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

const useStyles = makeStyles(theme => ({
	container: {
		backgroundColor: '#F6F8F9',
		'& .MuiFormControl-marginDense': {
			margin: '0px !important',
		},
		'& .MuiIconButton-root': {
			padding: '0px !important',
		},
	},
	comment: {
		maxHeight: '290px',
		overflow: 'auto',
		padding: '5px 10px',
		marginRight: '60px',
	},
	noBorder: {
		border: 'none',
	},
	border: {
		border: '1px solid #EBEBEB',
		background: 'white',
		overflow: 'auto',
	},
	commentBtn: {
		float: 'right',
		right: '10px',
		bottom: '10px',
		marginBottom: -20,
		background: '#24afdf',
	},
	paddingLeft10: {
		paddingLeft: '20px !important',
		paddingTop: '3px !important',
	},
	paddingCreateTask: {
		paddingLeft: '20px !important',
		paddingTop: '4px !important',
		flex: '1 1 auto',
	},
	moreComment: {
		padding: '10px',
		marginLeft: '35px',
		display: 'flex',
		color: '#18AADD',
		cursor: 'pointer',
	},
	whiteSpace: {
		whiteSpace: 'pre-wrap',
		marginTop: '5px',
	},
	gridStyle: {
		padding: '12px 0px',
		flexWrap: 'nowrap',
	},
	bold: {
		fontWeight: 'bold',
	},
	commentView: {
		padding: '10px 5px 10px 0px',
		// marginRight: "60px",
		// marginBottom: "10px",
		marginLeft: '20px',
	},
	commentTime: {
		marginLeft: '10px',
		fontSize: '12px',
	},
	floatRight: {
		float: 'right',
	},
	cursorPointer: {
		cursor: 'pointer',
	},
	inlineFlex: {
		display: 'inline-flex',
	},
	containerWrapper: {
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
		gap: '10px',
	},
}));

export function getLikedPeoplesName(comment, myUserId) {
	const { likedBy } = comment || {};
	const names = (likedBy || []).map(user => {
		if (user._id === myUserId) {
			return <li>You</li>;
		} else {
			return <li>{user.name || user.displayName}</li>;
		}
	});

	if (names.length < 1) {
		return '';
	}
	return <ul style={{ listStyle: 'none', paddingLeft: 0 }}>{names}</ul>;
}

export default function DealComment(props) {
	const { targetSourceId, contactData } = props;
	const classes = useStyles();
	const [stateApp] = useContext(AppContext);
	const [users, setUsers] = useState([]);
	const dispatch = useDispatch();
	const [comment, setComment] = useState('');
	const [editCommentId, setEditCommentId] = useState('');
	const [editComment, setEditComment] = useState('');
	const [showAllComments, setShowAllComments] = useState(false);
	const [profilesInfo, setProfilesInfo] = useState({});
	const [profileImage, setProfileImage] = useState(null);
	const [commentsArray, setCommentsArray] = useState([]);
	const [showActions, setShowActions] = useState(false);
	const [showCommentActionId, setShowCommentActionId] = useState(null);
	const [loadingComments, setLoadingComments] = useState(true);
	const [pinnedArray, setPinnedArray] = React.useState([]);
	const [isMinimize, setIsMinimize] = useState(false);
	const [isEdit, setIsEdit] = useState(false);

	const [removeComment] = useMutation(REMOVECOMMENT);
	const [upsertComment, { data: newlyAddedComment }] = useMutation(UPSERTCOMMENT);
	const [getAllMongoUsers, { data: userLists }] = useLazyQuery(GETMONGOUSERS, {
		fetchPolicy: 'cache-and-network',
	});
	const [getProfileImage, profiledata] = useLazyQuery(GET_PROFILE_IMAGE);
	const [getProfilesImages, profilesData] = useLazyQuery(GET_PROFILES_IMAGES, {
		fetchPolicy: 'cache-first',
	});
	const [getCommentsByObjectId, { data: dataComments }] = useLazyQuery(COMMENTSBYOBJECTIDQUERY, {
		fetchPolicy: 'no-cache',
	});
	const [toggleCommentReaction, { data: resultToggleCommentReaction }] = useMutation(TOGGLECOMMENTREACTION, {
		refetchQueries: ['getCommentsByObjectId', 'getCommentsByObjectsIds'],
	});

	useEffect(() => {
		getAllMongoUsers();
	}, [getAllMongoUsers]);

	useEffect(() => {
		if (userLists && userLists.allMongoUsers) {
			const data = userLists.allMongoUsers
				.map(user => ({
					_id: user._id,
					name: user.name,
					email: user.email,
				}))
				.filter(user => user._id && user.name);
			setUsers(data);
			const emails = userLists.allMongoUsers.map(user => user.email);
			getProfilesImages({
				variables: { emails },
			});
		}
	}, [userLists]);

	useEffect(() => {
		if (targetSourceId) {
			setLoadingComments(true);
			getCommentsByObjectId({
				variables: {
					objectId: targetSourceId,
				},
			});
		}
	}, [targetSourceId]);

	useEffect(() => {
		if (dataComments && dataComments.commentsByObjectId) {
			const sortedComments = sortArrayBasedOnTs([...dataComments.commentsByObjectId]);
			if (stateApp.activeDeal._id && stateApp.activeDeal?.createdOn) {
				sortedComments.unshift(getPinnedComment());
			}

			sortedComments.map(sc => ({ ...sc, type: 'comment' }));
			setCommentsArray(sortedComments);
		}
		setLoadingComments(false);
	}, [dataComments]);

	useEffect(() => {
		setLoadingComments(false);
		if (!targetSourceId && newlyAddedComment?.upsertComment?.comment) {
			const comments = JSON.parse(JSON.stringify(commentsArray));
			comments.push({
				...newlyAddedComment.upsertComment.comment,
				user: { name: stateApp.user.name, email: stateApp.user.email },
				isNew: true,
				type: 'comment',
				tenant: UserSession.getStorageItem('tenantName'),
			});
			props.setNewCommentId(newlyAddedComment.upsertComment.comment._id);
			setCommentsArray(sortArrayBasedOnTs([...comments]));
		}
	}, [newlyAddedComment]);

	useEffect(() => {
		if (profilesData?.data?.profileByEmail?.profiles) {
			setProfilesInfo(profilesData.data.profileByEmail.profiles);
		}
	}, [profilesData]);

	useEffect(() => {
		if (stateApp?.user?.email) {
			getProfileImage({
				variables: { email: stateApp.user.email },
				fetchPolicy: 'network-only',
			});
		}
	}, [stateApp.user]);

	useEffect(() => {
		if (profiledata && profiledata.data && profiledata.data.profileByEmail && profiledata.data.profileByEmail.profile) {
			const {
				data: {
					profileByEmail: {
						profile: { profileImage },
					},
				},
			} = profiledata;
			setProfileImage(profileImage);
		}
	}, [profiledata]);

	const getPinnedComment = () => ({
		user: stateApp.activeDeal.user,
		isPinned: true,
		isPublic: true,
		ts: new Date(stateApp.activeDeal.createdOn),
	});

	const sortArrayBasedOnTs = array => {
		const compare = (a, b) => {
			if (a.ts < b.ts) {
				return -1;
			}
			if (b.ts < a.ts) {
				return 1;
			}

			return 0;
		};
		if (!props.multipleIds) {
			array.sort(compare);
		}

		return array;
	};

	const newCommentCleaner = value =>
		value.trim()[value.trim().length - 1] === '.'
			? value
					.split('\n')
					.map(line => {
						if (line.trim() !== '.') {
							return line.trim();
						}
					})
					.join('\n')
			: `${value
					.split('\n')
					.map(line => {
						if (line.trim() !== '.') {
							return line.trim();
						}
					})
					.join('\n')}`;

	const updateComment = value => {
		setLoadingComments(true);
		upsertComment({
			variables: {
				comment: {
					comment: typeof value === 'object' ? newCommentCleaner(value.comment) : newCommentCleaner(value),
					user: stateApp.user.mongoId,
					commentedOn: targetSourceId,
					_id: editCommentId,
					objectType: props.targetLabel,
					isEdited: true,
					tenant: UserSession.getStorageItem('tenantName'),
				},
			},
			refetchQueries: ['getCommentsByObjectId', 'getCommentsCounter', 'getCommentsByObjectsIds'],
			awaitRefetchQueries: true,
		});
		setShowActions(false);
		setComment('');
		setEditComment('');
		setEditCommentId('');
	};

	const deleteComment = id => {
		setLoadingComments(true);
		removeComment({
			variables: {
				commentId: id,
			},
			refetchQueries: ['getCommentsByObjectId', 'getCommentsCounter', 'getCommentsByObjectsIds'],
			awaitRefetchQueries: true,
		});
		setShowActions(false);
		setComment('');
		setEditComment('');
		setEditCommentId('');
	};
	const pinToTop = eachComment => {
		const newCommentList = commentsArray.map(c => {
			if (c._id === eachComment) {
				return {
					...c,
					isPinned: true,
					_id: eachComment,
				};
			}
			return {
				...c,
				isPinned: false,
			};
		});
		dispatch(updatePinComments(newCommentList));
		upsertComment({
			variables: {
				comment: {
					_id: eachComment,
					pin: true,
				},
			},
			refetchQueries: ['getCommentsByObjectId', 'getCommentsCounter', 'getCommentsByObjectsIds'],
			awaitRefetchQueries: true,
		});
		setShowCommentActionId(null);
		//  commentsArray
		// let temp = commentsArray
	};
	const unpinFromTop = eachComment => {
		const newCommentList = commentsArray.map(c => {
			if (c.id === eachComment) {
				return {
					...c,
					isPinned: false,
				};
			}
			return c;
		});
		dispatch(updatePinComments(newCommentList));
		upsertComment({
			variables: {
				comment: {
					_id: eachComment,
					pin: false,
				},
			},
			refetchQueries: ['getCommentsByObjectId', 'getCommentsCounter', 'getCommentsByObjectsIds'],
			awaitRefetchQueries: true,
		});
		setShowCommentActionId(null);
		setLoadingComments(true);
	};

	const addNewComment = value => {
		setLoadingComments(true);
		upsertComment({
			variables: {
				comment: {
					comment: typeof value === 'object' ? newCommentCleaner(value.comment) : newCommentCleaner(value),
					public: true,
					user: stateApp.user.mongoId,
					commentedOn: targetSourceId,
					objectType: props.targetLabel,
					tenant: UserSession.getStorageItem('tenantName'),
				},
			},
			refetchQueries: ['getCommentsByObjectId', 'getCommentsCounter', 'getCommentsByObjectsIds'],
			awaitRefetchQueries: true,
		});
		setShowActions(false);
		setComment('');
	};

	const getCount = () => {
		let indexToShow = commentsArray.length > 3 ? commentsArray?.length - 3 : 0;
		return indexToShow;
	};

	useEffect(() => {
		try {
			setLoadingComments(true);
			const activity = stateApp.activeDeal.activity;
			if (dataComments && dataComments.commentsByObjectId) {
				if (activity && activity.length > 0) {
					let activittyData = [];
					activity.forEach(element => {
						activittyData.push({
							user: { name: element.ownerName, email: element.ownerName },
							activityData: element,
							comment: element.notes,
							ts: new Date(element._ts.includes('GMT') ? element._ts : Number(element._ts)).getTime(),
							isActivity: true,
							isEdited: false,
							public: true,
							__typename: 'Comment',
							type: 'activity',
						});
					});
					let tempArray = dataComments.commentsByObjectId.concat(activittyData);

					// setCommentsArray(sortArrayBasedOnTs([...tempArray]));

					let temp = [];
					let tempArr = sortArrayBasedOnTs([...tempArray]);

					tempArr.map(item => {
						if (item.pin === true) {
							temp.push(item);
						}
					});

					const trueFirst = temp.sort((a, b) => Number(b.pin) - Number(a.pin));
					setCommentsArray(tempArray);
					setPinnedArray(trueFirst);
				} else {
					// setCommentsArray(sortArrayBasedOnTs([...dataComments.commentsByObjectId]));
					let temp = [];

					// setCommentsArray(sortArrayBasedOnTs([...tempArray]));
					let tempArr = sortArrayBasedOnTs([...dataComments.commentsByObjectId]);
					tempArr.map(item => {
						if (item.pin === true) {
							temp.push(item);
						}
					});

					const trueFirst = temp.sort((a, b) => Number(b.pin) - Number(a.pin));
					setCommentsArray(tempArr);
					setPinnedArray(temp);
				}
			}
		} catch (e) {
			console.log('modifying the Comment Error', e);
		} finally {
			setLoadingComments(false);
		}
	}, [stateApp?.activeDeal?.activity, dataComments]);

	const didILikedThisComment = useCallback(
		comment => {
			if (!stateApp?.user?._id) {
				return false;
			}

			const likedBy = comment?.likedBy || [];
			const find = likedBy.find(user => user._id === stateApp.user._id);

			return !!find;
		},
		[stateApp.user]
	);

	const callToggleCommentReactionMutation = useCallback(comment => {
		toggleCommentReaction({
			variables: {
				commentId: comment._id,
			},
		});
	}, []);

	return (
		<div className={classes.container}>
			<div className={classes.comment} id="commentsContainer">
				{!loadingComments ? (
					<>
						{!showAllComments && commentsArray.length > 3 && (
							<div className={classes.moreComment} style={{ marginTop: 10, marginBottom: 10 }}>
								<span
									onClick={() => {
										setShowAllComments(true);
									}}
								>
									{getCount()} more comments
								</span>
							</div>
						)}

						{showAllComments && commentsArray.length > 3 && (
							<div className={classes.moreComment} style={{ marginTop: 10, marginBottom: 10 }}>
								<span onClick={() => setShowAllComments(false)}>Hide Earlier Comments</span>
							</div>
						)}

						{pinnedArray.map((eachComment, index) => {
							const pinnedComment = eachComment.pin;
							let indexToShow = pinnedArray.length > 3 ? pinnedArray.length - 3 : 0;
							return (
								<Fragment key={index}>
									{(showAllComments || index >= indexToShow) && (
										<Grid
											container
											// className={classes.gridStyle}
											className={pinnedComment ? classes.pinned : classes.gridStyle}
											onMouseOver={() => setShowCommentActionId(eachComment._id)}
											onMouseLeave={() => setShowCommentActionId(null)}
										>
											<Grid item style={{ maxWidth: '55px' }}>
												<IconButton style={{ marginTop: '3px', marginLeft: '12px' }}>
													{profilesInfo[eachComment.user?.email]?.profileImage || eachComment.isNew ? (
														<Avatar
															src={
																eachComment.isNew ? profileImage : profilesInfo[eachComment.user?.email].profileImage
															}
															size="38"
															round
														/>
													) : (
														<Avatar name={eachComment.user?.name} size="38" round />
													)}
												</IconButton>
											</Grid>
											<Grid item className={classes.paddingCreateTask}>
												<div>
													<div className={classes.containerWrapper}>
														<span className={classes.bold}>{eachComment.user?.name}</span>
														<span>
															{
																<ReactTimeAgo
																	className={classes.commentTime}
																	date={new Date(Number(eachComment.ts))}
																	locale="en-US"
																/>
															}
														</span>
													</div>
													{eachComment.isActivity === true && (
														<>
															<div className={`${classes.whiteSpace}`}>
																{eachComment.activityData.type.replace(/_/g, ' ').toUpperCase()} -{' '}
																{eachComment.activityData.name}
															</div>
															<div className={`${classes.whiteSpace}`}>
																START DATE: {moment(eachComment.activityData.dateTime).format('MM/DD/YYYY hh:mm A')}
															</div>
															<div className={`${classes.whiteSpace}`}>
																END DATE: {moment(eachComment.activityData.endDateTime).format('MM/DD/YYYY hh:mm A')}
															</div>
														</>
													)}
													{eachComment.isPinned && <span> created this task.</span>}

													{!eachComment.isPinned && (
														<>
															{eachComment.isEdited && <span className={classes.commentTime}>(Edited)</span>}
															{eachComment.user?.email === stateApp.user.email &&
																showCommentActionId === eachComment._id &&
																editCommentId !== eachComment._id && (
																	<div
																		className={`${classes.floatRight} ${classes.cursorPointer} ${classes.inlineFlex}`}
																	>
																		<ActionMenu
																			eachComment={eachComment}
																			setEditCommentId={setEditCommentId}
																			setEditComment={setEditComment}
																			deleteComment={deleteComment}
																			unpinFromTop={unpinFromTop}
																			pinToTop={pinToTop}
																			setShowActions={setShowActions}
																		/>
																	</div>
																)}
														</>
													)}
												</div>
												{!eachComment.isPinned && (
													<>
														{editCommentId !== eachComment._id ? (
															<CommonCommentText users={users} eachComment={eachComment} />
														) : (
															<div className={classes.border}>
																<CommentField
																	isEdit
																	profilesInfo={profilesInfo}
																	users={users}
																	comment={editComment}
																	showActions={showActions}
																	setEditCommentId={setEditCommentId}
																	setComment={setEditComment}
																	upsertComment={updateComment}
																/>
															</div>
														)}
													</>
												)}
											</Grid>
											{!eachComment.isActivity && (
												<Grid>
													<IconButton onClick={() => callToggleCommentReactionMutation(pinnedComment)}>
														<div
															style={{
																display: 'flex',
																alignItems: 'center',
																gap: 5,
															}}
														>
															{pinnedComment.likedBy?.length > 0 && (
																<span style={{ fontSize: '12px' }}>{pinnedComment.likedBy?.length}</span>
															)}
															<Tooltip title={<>{getLikedPeoplesName(pinnedComment, stateApp.user._id)}</>}>
																{didILikedThisComment(pinnedComment) ? <ThumbUpIcon /> : <ThumbUpAltOutlinedIcon />}
															</Tooltip>
														</div>
													</IconButton>
												</Grid>
											)}
										</Grid>
									)}
								</Fragment>
							);
						})}

						{commentsArray.map((eachComment, index) => {
							const pinnedComment = eachComment.pin;
							const duplicate =
								commentsArray.filter(obj => obj._id === eachComment._id).length > 0 &&
								pinnedArray.filter(obj => obj._id === eachComment._id).length > 0;
							let indexToShow = commentsArray.length > 3 ? commentsArray.length - 3 : 0;
							return (
								<Fragment key={index}>
									{(showAllComments || index >= indexToShow) && (
										<Grid
											container
											// className={classes.gridStyle}
											className={pinnedComment ? classes.tracking : classes.gridStyle}
											onMouseOver={() => setShowCommentActionId(eachComment._id)}
											onMouseLeave={() => setShowCommentActionId(null)}
										>
											<Grid item style={{ maxWidth: '55px' }}>
												<IconButton style={{ marginTop: '3px', marginLeft: '12px' }}>
													{profilesInfo[eachComment.user?.email]?.profileImage || eachComment.isNew ? (
														<Avatar
															src={
																eachComment.isNew ? profileImage : profilesInfo[eachComment.user?.email].profileImage
															}
															size="38"
															round
														/>
													) : (
														<Avatar name={eachComment.user?.name} size="38" round />
													)}
												</IconButton>
											</Grid>
											<Grid item className={classes.paddingCreateTask}>
												<div>
													<div className={classes.containerWrapper}>
														<span className={classes.bold}>{eachComment.user?.name}</span>
														<span>
															{
																<ReactTimeAgo
																	className={classes.commentTime}
																	date={new Date(Number(eachComment.ts))}
																	locale="en-US"
																/>
															}
														</span>
													</div>
													{eachComment.isActivity === true && (
														<>
															<div className={`${classes.whiteSpace}`}>
																{eachComment.activityData.type.replace(/_/g, ' ').toUpperCase()} -{' '}
																{eachComment.activityData.name}
															</div>
															<div className={`${classes.whiteSpace}`}>
																START DATE: {moment(eachComment.activityData.dateTime).format('MM/DD/YYYY hh:mm A')}
															</div>
															<div className={`${classes.whiteSpace}`}>
																END DATE: {moment(eachComment.activityData.endDateTime).format('MM/DD/YYYY hh:mm A')}
															</div>
														</>
													)}
													{eachComment.isPinned && <span> created this task.</span>}

													{!eachComment.isPinned && (
														<>
															{eachComment.isEdited && <span className={classes.commentTime}>(Edited)</span>}
															{eachComment.user?.email === stateApp.user.email &&
																showCommentActionId === eachComment._id &&
																editCommentId !== eachComment._id && (
																	<div
																		className={`${classes.floatRight} ${classes.cursorPointer} ${classes.inlineFlex}`}
																	>
																		<ActionMenu
																			eachComment={eachComment}
																			setEditCommentId={setEditCommentId}
																			setEditComment={setEditComment}
																			deleteComment={deleteComment}
																			unpinFromTop={unpinFromTop}
																			pinToTop={pinToTop}
																		/>
																	</div>
																)}
														</>
													)}
												</div>
												{!eachComment.isPinned && (
													<>
														{editCommentId !== eachComment._id ? (
															<CommonCommentText users={users} eachComment={eachComment} />
														) : (
															<div className={classes.border}>
																<CommentField
																	isEdit
																	setIsEdit={setIsEdit}
																	profilesInfo={profilesInfo}
																	users={users}
																	comment={editComment}
																	showActions={showActions}
																	setEditCommentId={setEditCommentId}
																	setComment={setEditComment}
																	updateCommentData={updateComment}
																	isMinimize={isMinimize}
																	setIsMinimize={setIsMinimize}
																	setShowActions={setShowActions}
																/>
															</div>
														)}
													</>
												)}
											</Grid>
											{editCommentId !== eachComment._id && !eachComment.isActivity && (
												<Grid>
													<IconButton onClick={() => callToggleCommentReactionMutation(eachComment)}>
														<div
															style={{
																display: 'flex',
																alignItems: 'center',
																gap: 5,
															}}
														>
															{eachComment.likedBy?.length > 0 && (
																<span style={{ fontSize: '12px' }}>{eachComment.likedBy?.length}</span>
															)}
															<Tooltip title={<>{getLikedPeoplesName(eachComment, stateApp.user._id)}</>}>
																{didILikedThisComment(eachComment) ? <ThumbUpIcon /> : <ThumbUpAltOutlinedIcon />}
															</Tooltip>
														</div>
													</IconButton>
												</Grid>
											)}
										</Grid>
									)}
								</Fragment>
							);
						})}
					</>
				) : (
					<CircularProgress color="secondary"></CircularProgress>
				)}
			</div>
			{!editCommentId && (
				<div style={{ paddingBottom: '20px' }}>
					<Grid container>
						<Grid item xs={1}>
							<IconButton className={classes.commentView}>
								{profileImage ? (
									<Avatar src={profileImage} size="38" round />
								) : (
									<Avatar name={stateApp.user.name} size="38" round />
								)}
							</IconButton>
						</Grid>
						<Grid item xs={11} className={classes.paddingLeft10}>
							<div
								className={classes.border}
								style={{ width: 'calc(23vw)', paddingRight: '13px' }}
								onClick={() => {
									setShowActions(true);
								}}
								onBlur={() => {
									if (showActions && !comment) {
										setShowActions(false);
									}
								}}
							>
								<CommentField
									profilesInfo={profilesInfo}
									users={users}
									comment={comment}
									showActions={showActions}
									setComment={setComment}
									upsertComment={addNewComment}
									isMinimize={isMinimize}
									setIsMinimize={setIsMinimize}
								/>
							</div>
						</Grid>
					</Grid>
				</div>
			)}
		</div>
	);
}

const ActionMenu = ({
	pinToTop,
	unpinFromTop,
	eachComment,
	setEditCommentId,
	setEditComment,
	deleteComment,
	setShowActions,
}) => {
	const [anchorEl, setAnchorEl] = useState(null);

	const handleClick = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};
	const pinnedComment = eachComment.pin;
	return (
		<>
			<ExpandMoreIcon
				id="expandCommentActionIcon"
				aria-controls={eachComment._id}
				aria-haspopup="true"
				onClick={handleClick}
			/>
			<Menu
				style={{ zIndex: '1305' }}
				id={eachComment._id}
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={handleClose}
				getContentAnchorEl={null}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
				transformOrigin={{ vertical: 'top', horizontal: 'center' }}
			>
				<MenuItem
					onClick={event => {
						setEditCommentId(eachComment._id);
						setEditComment(eachComment.comment);
						setShowActions(true);
						handleClose();
					}}
				>
					Edit Comment
				</MenuItem>
				<MenuItem textcolor="red" id="deleteComment" onClick={() => deleteComment(eachComment._id)}>
					Delete Comment
				</MenuItem>
				{/* pinnedComment */}
				{pinnedComment ? (
					<MenuItem textcolor="red" onClick={() => unpinFromTop(eachComment._id)} id="unpin" data-cy="unpin">
						Unpin
					</MenuItem>
				) : (
					<MenuItem textcolor="red" onClick={() => pinToTop(eachComment._id)} id="pintotop" data-cy="pintotop">
						Pin To Top
					</MenuItem>
				)}
			</Menu>
		</>
	);
};
