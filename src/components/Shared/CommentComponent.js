/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, Fragment, useRef, useCallback } from 'react';
import Avatar from 'react-avatar';
import { useDispatch } from 'react-redux';
import ReactTimeAgo from 'react-time-ago';

import { CircularProgress, Menu, MenuItem, Tooltip } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import {
	ThumbUp as ThumbUpIcon,
	ThumbUpAltOutlined as ThumbUpAltOutlinedIcon,
	ExpandMore as ExpandMoreIcon,
} from '@material-ui/icons';

import { useMutation, useLazyQuery } from '@apollo/client';
import DOMPurify from 'dompurify';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import ru from 'javascript-time-ago/locale/ru';
import { get } from 'lodash';
import moment from 'moment';

import CommentField from 'components/Shared/components/Fields/CommentField';

import { REMOVECOMMENT } from 'graphQL/useMutationRemoveComment';
import { UPSERTCOMMENT } from 'graphQL/useMutationUpsertComment';
import { COMMENTSBYOBJECTIDQUERY } from 'graphQL/useQueryCommentsByObjectId';
import { GET_PROFILES_IMAGES } from 'graphQL/useQueryGetProfile';
import { GET_PROFILE_IMAGE } from 'graphQL/useQueryGetProfile';
import { GETMONGOUSERS } from 'graphQL/useQueryGetUsers';
import { TOGGLECOMMENTREACTION } from 'graphQL/userMutationToggleCommentReaction';

import { globalStateController } from 'hookstate/globalStateController';
import { slidoutState } from 'hookstate/initialStates';

import { updatePinComments } from 'store/actions/commonActions';

import { UserSession } from 'utils/user';

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

const useStyles = makeStyles(theme => ({
	container: ({ isFileDetail }) => ({
		backgroundColor: '#F6F8F9',
		'& .MuiFormControl-marginDense': {
			margin: '0px !important',
		},
		height: isFileDetail ? 'calc(100vh - 395px)' : '100%',
		minHeight: '200px',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-end',
	}),
	comment: ({ commentsHeight }) => ({
		position: 'relative',
		overflow: 'auto',
		'& *': {
			overflowAnchor: 'none',
		},

		'& #checkIf': {
			overflowAnchor: 'auto',
			height: '1px',
		},
	}),
	hideMenuIcon: {
		visibility: 'hidden',
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
		paddingLeft: '8px !important',
		paddingTop: '3px !important',
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
		margin: '5px 0px',
	},
	pinnedGrid: {
		flexWrap: 'nowrap',
		backgroundColor: '#FFF6EE',
	},
	pinnedCommentBar: {
		display: 'flex',
		minHeight: '10px',
		minWidth: '5px',
		backgroundColor: '#EFC480',
	},
	gridStyle: {
		padding: '12px 0px',
		flexWrap: 'nowrap',
	},
	bold: {
		fontWeight: 'bold',
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
	commentContent: {
		flex: '1 1 auto',
		maxWidth: 'calc(100% - 55px)',
		overflowWrap: 'break-word',
		wordWrap: 'break-word',
		wordBreak: 'break-word',
	},
	commentTypeSection: {
		fontWeight: 'bold',
		fontSize: '16px',
		display: 'flex',
		marginBottom: '5px',
	},
	commentWords: {
		// display: 'inline-block',
		overflowWrap: 'break-word',
		wordWrap: 'break-word',
		wordBreak: 'break-word',
		hyphens: 'auto',
		margin: '0px !Important',
	},
}));

function urlify(text) {
	const urlRegex = /(https?:\/\/[^\s]+)/g;

	return text.replace(urlRegex, url => {
		return '<a href="' + url + '">' + url + '</a>';
	});
}

export function getLikedPeoplesName(comment, myUserId) {
	const { likedBy } = comment;
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
export const CommonCommentText = ({ eachComment, users, isPinned }) => {
	const classes = useStyles();

	// Split by spaces and newlines, keeping spaces as part of the array
	let formatComment = (eachComment?.comment || '')
		.split(/(\s|\n)/) // Split by space or newline
		.filter(part => part !== ''); // Remove empty strings

	return (
		<div id={eachComment?._id} className={`${classes.whiteSpace}`}>
			{get(eachComment, 'commentType') &&
				!isPinned &&
				get(eachComment, 'commentType.commentType', get(eachComment, 'commentType')) !== 'General' && (
					<span className={classes.commentTypeSection}>
						{
							// Displplay commentType
							get(eachComment, 'commentType.commentType')
						}
					</span>
				)}

			{formatComment.map((word, index) => {
				// If word contains {{username}} syntax, process it separately
				if (word.includes('{{') && word.includes('}}')) {
					const splittedWord = word.split(/\r?\n/);

					if (splittedWord.length) {
						return (
							<>
								{splittedWord.map(sWord => {
									console.log('sWord', sWord);
									const idRegex = /\{\{(.*?)\}\}/g;
									let match;
									let parts = [];
									let lastIndex = 0;

									// Process all matches of {{id}} in sWord
									while ((match = idRegex.exec(sWord)) !== null) {
										const id = match[1]; // Extract the ID inside {{ }}
										const username = users?.find(user => user._id === id)?.name || '';

										// Capture the text before the current match
										if (match.index > lastIndex) {
											// Replace \n with <br /> for the text portion
											parts.push(
												sWord
													.substring(lastIndex, match.index)
													.split('\n')
													.map((text, idx) => (
														<React.Fragment key={`text-${idx}`}>
															{idx > 0 && <br />}
															{text}
														</React.Fragment>
													))
											);
										}

										// Add the username with no space after
										parts.push(
											<span className={`${classes.commentWords} blue`} key={id}>
												@{username}
											</span>
										);

										// Update lastIndex to continue processing
										lastIndex = match.index + match[0].length;
									}

									// Add any remaining text after the last match, replacing \n with <br />
									if (lastIndex < sWord.length) {
										parts.push(
											sWord
												.substring(lastIndex)
												.split('\n')
												.map((text, idx) => (
													<React.Fragment key={`end-text-${idx}`}>
														{idx > 0 && <br />}
														{text}
													</React.Fragment>
												))
										);
									}

									return (
										<p className={classes.commentWords} style={{ display: 'inline-block' }} key={sWord}>
											{parts.flat()}
										</p>
									);
								})}
							</>
						);
					}

					return <p className={classes.commentWords}>{splittedWord}</p>;
				} else {
					// Process regular words, ensure spaces are correctly handled
					const _word = index !== formatComment.length - 1 ? `${word}` : word;
					const sanitizedData = () => ({
						__html: DOMPurify.sanitize(urlify(_word)),
					});
					return <span className={classes.commentWords} dangerouslySetInnerHTML={sanitizedData()}></span>;
				}
			})}
		</div>
	);
};

export default function CommentComponent(props) {
	const { targetSourceId, commentsHeight } = props;
	const classes = useStyles({
		commentsHeight,
		isFileDetail: props.targetLabel === 'file' || false,
	});
	const dispatch = useDispatch();

	const {
		stateValues: { user },
	} = globalStateController.useState(['user']);

	const [users, setUsers] = useState([]);
	const [comment, setComment] = useState('');
	const [editCommentId, setEditCommentId] = useState('');
	const [editComment, setEditComment] = useState('');
	const [showAllComments, setShowAllComments] = useState(false);
	const [profilesInfo, setProfilesInfo] = useState({});
	const [profile, setProfile] = useState({});
	const [commentsArray, setCommentsArray] = useState([]);
	const [showActions, setShowActions] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [showCommentActionId, setShowCommentActionId] = useState(null);
	const [loadingComments, setLoadingComments] = useState(true);
	const [scrollIntoView, setScrollIntoView] = useState(false);
	const commentContainerRef = useRef(null);

	const [removeComment] = useMutation(REMOVECOMMENT);
	const [upsertComment, { data: newlyAddedComment }] = useMutation(UPSERTCOMMENT);
	const [toggleCommentReaction] = useMutation(TOGGLECOMMENTREACTION, {
		refetchQueries: ['getCommentsByObjectId', 'getCommentsByObjectsIds'],
	});
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
		let allComments = [];
		if (dataComments && dataComments.commentsByObjectId) {
			if (props.activityLog && props.activityLog.length > 0) {
				let activityData = [];
				props.activityLog.forEach(element => {
					const timestamp = element?.createAt
						? new Date(new Date(element.createAt).toUTCString()).getTime()
						: new Date(element._ts.includes('GMT') ? element._ts : Number(element._ts)).getTime();
					activityData.push({
						user: { name: element.ownerName, email: element.ownerName },
						activityData: element,
						comment: element.notes,
						outcome: element.outcome,
						ts: timestamp,
						isActivity: true,
						isEdited: false,
						public: true,
						__typename: 'Comment',
					});
				});
				allComments = dataComments.commentsByObjectId.concat(activityData);
			} else {
				allComments = sortArrayBasedOnTs([...dataComments.commentsByObjectId]);
			}
			allComments = sortArrayBasedOnTs(allComments);
			setCommentsArray(allComments);
		}
		setLoadingComments(false);
	}, [dataComments, props.activityLog]);

	useEffect(() => {
		setLoadingComments(false);
		if (!targetSourceId && newlyAddedComment?.upsertComment?.comment && props.targetLabel !== 'activity') {
			const comments = JSON.parse(JSON.stringify(commentsArray));
			comments.push({
				...newlyAddedComment.upsertComment.comment,
				user: { name: user.name, email: user.email },
				isNew: true,
			});
			if (props.setNewCommentId) {
				props.setNewCommentId(newlyAddedComment.upsertComment.comment._id);
			}
			setCommentsArray(sortArrayBasedOnTs([...comments]));
		}
	}, [newlyAddedComment]);

	useEffect(() => {
		if (profilesData?.data?.profileByEmail?.profiles) {
			// Set profile data
			setProfilesInfo(profilesData.data.profileByEmail.profiles);
		}
	}, [profilesData]);

	useEffect(() => {
		if (user?.email) {
			getProfileImage({
				variables: { email: user.email },
				fetchPolicy: 'network-only',
			});
		}
	}, [user]);

	useEffect(() => {
		if (profiledata && profiledata.data && profiledata.data.profileByEmail && profiledata.data.profileByEmail.profile) {
			const profile = profiledata.data.profileByEmail.profile;
			setProfile(profile);
		}
	}, [profiledata]);

	const pinnedComments = React.useMemo(() => {
		const pinnedComments = commentsArray.filter(comment => comment.pin === true);
		return pinnedComments;
	}, [commentsArray]);

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
						return '';
					})
					.join('\n')
			: `${value
					.split('\n')
					.map(line => {
						if (line.trim() !== '.') {
							return line.trim();
						}
						return '';
					})
					.join('\n')}`;

	const updateComment = value => {
		setLoadingComments(true);

		upsertComment({
			variables: {
				comment: {
					comment: typeof value === 'object' ? newCommentCleaner(value.comment) : newCommentCleaner(value),
					commentType: typeof value === 'object' ? value.commentType || 'General' : 'General',
					user: user.mongoId,
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
		// const commentsArray1 = Object.values(pinComments);
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
	};

	useEffect(() => {
		if (commentsArray?.length > 0 && scrollIntoView) {
			commentContainerRef?.current?.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
				inline: 'start',
			});
		}
	}, [commentsArray, scrollIntoView]);

	const addNewComment = value => {
		const userDetails = user;
		setCommentsArray(state => {
			let newComment = {
				commentedOn: targetSourceId,
				isEdited: false,
				public: true,
				ts: Date.now(),
				user: {
					name: userDetails.name,
					email: userDetails.email,
					__typename: 'User',
				},
				__typename: 'Comment',
				_id: '62e78820b4f930ae6002a7f2',
			};
			if (typeof value === 'object') {
				newComment = { ...value, ...newComment };
			} else {
				newComment['comment'] = value;
			}
			state.push(newComment);
			return state;
		});
		setScrollIntoView(true);

		const comment = {
			comment: typeof value === 'object' ? newCommentCleaner(value.comment) : newCommentCleaner(value),
			commentType: typeof value === 'object' ? value.commentType || 'General' : 'General',
			public: true,
			user: user.mongoId,
			commentedOn: targetSourceId,
			objectType: props.targetLabel,
			pin: false,
			tenant: UserSession.getStorageItem('tenantName'),
		};

		if (props.targetLabel === 'activity') {
			slidoutState.newComments.set([...slidoutState.newComments.get(), comment]);
		}

		upsertComment({
			variables: {
				comment,
			},
			refetchQueries: ['getCommentsByObjectId', 'getCommentsCounter', 'getCommentsByObjectsIds'],
			awaitRefetchQueries: true,
		}).then(result => {
			setScrollIntoView(false);
		});
		setShowActions(false);
		setComment('');
	};

	const getCount = () => {
		let indexToShow = commentsArray.length > 5 ? commentsArray.length - 5 : 0;
		return indexToShow;
	};

	const didILikedThisComment = useCallback(
		comment => {
			if (!user?._id) {
				return false;
			}

			const likedBy = comment?.likedBy || [];
			const find = likedBy.find(u => u._id === user._id);

			return !!find;
		},
		[user]
	);

	const callToggleCommentReactionMutation = useCallback(comment => {
		toggleCommentReaction({
			variables: {
				commentId: comment._id,
			},
		});
	}, []);

	const pinnedCommentsJsx = React.useMemo(
		() => (
			<>
				{pinnedComments?.map(
					(pinnedComment, key) =>
						pinnedComment?.user?.name && (
							<Fragment key={key}>
								<Grid
									id="commentsArea"
									container
									className={classes.pinnedGrid}
									onMouseOver={() => setShowCommentActionId(pinnedComment?._id)}
									onMouseLeave={() => setShowCommentActionId(null)}
									pinned
								>
									<div className={classes.pinnedCommentBar}></div>
									<Grid item style={{ maxWidth: '55px', padding: '0px' }}>
										<IconButton>
											{profilesInfo[pinnedComment?.user?.email]?.profileImage || pinnedComment.isNew ? (
												<Avatar
													src={
														pinnedComment.isNew
															? profile?.profileImage
															: profilesInfo[pinnedComment?.user?.email].profileImage
													}
													size="38"
													round
												/>
											) : (
												<Avatar name={pinnedComment?.user?.name} size="38" round />
											)}
										</IconButton>
									</Grid>
									<Grid
										item
										className={`${classes.paddingLeft10} ${classes.commentContent}`}
										style={{ marginTop: '5px' }}
									>
										<div>
											<span className={classes.bold}>{pinnedComment?.user?.name}</span>
											{!isNaN(pinnedComment.ts) && (
												<ReactTimeAgo
													className={classes.commentTime}
													date={new Date(Number(pinnedComment.ts))}
													locale="en-US"
												/>
											)}
											{pinnedComment.isEdited && <span className={classes.commentTime}>(Edited)</span>}
										</div>
										<CommonCommentText users={users} eachComment={pinnedComment} isPinned />
									</Grid>
									<Grid item style={{ maxWidth: '75px', padding: '0px' }}>
										<IconButton onClick={() => callToggleCommentReactionMutation(pinnedComment)}>
											<div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
												{pinnedComment.likedBy?.length > 0 && (
													<span style={{ fontSize: '12px' }}>{pinnedComment.likedBy?.length}</span>
												)}
												<Tooltip title={<>{getLikedPeoplesName(pinnedComment, user._id)}</>}>
													{didILikedThisComment(pinnedComment) ? <ThumbUpIcon /> : <ThumbUpAltOutlinedIcon />}
												</Tooltip>
											</div>
										</IconButton>
									</Grid>
								</Grid>
							</Fragment>
						)
				)}
			</>
		),
		[pinnedComments, profile, profilesInfo, users]
	);

	return (
		<>
			<div className={classes.container}>
				<div className={classes.comment} id="commentsContainer">
					{!loadingComments ? (
						<>
							{
								// This will return a new grid for pinned comments
								pinnedCommentsJsx
							}

							{!showAllComments && commentsArray.length > 7 && (
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
							{showAllComments && commentsArray.length > 7 && (
								<div className={classes.moreComment} style={{ marginTop: 10, marginBottom: 10 }}>
									<span onClick={() => setShowAllComments(false)}>Hide Earlier Comments</span>
								</div>
							)}

							{commentsArray.map((eachComment, index) => {
								let indexToShow = commentsArray.length > 7 ? commentsArray.length - 7 : 0;
								return (
									eachComment?.user?.name && (
										<Fragment key={index}>
											{(showAllComments || index >= indexToShow) && (
												<Grid
													id="commentsArea"
													container
													className={classes.gridStyle}
													onMouseOver={() => setShowCommentActionId(eachComment?._id)}
													onMouseLeave={() => setShowCommentActionId(null)}
												>
													{eachComment?.pin && <div className={classes.pinnedCommentBar}></div>}
													<Grid item style={{ maxWidth: '55px', padding: '0px' }}>
														<IconButton>
															{profilesInfo[eachComment?.user?.email]?.profileImage || eachComment?.isNew ? (
																<Avatar
																	src={
																		eachComment?.isNew
																			? profile?.profileImage
																			: profilesInfo[eachComment?.user?.email].profileImage
																	}
																	size="38"
																	round
																/>
															) : (
																<Avatar name={eachComment?.user?.name} size="38" round />
															)}
														</IconButton>
													</Grid>
													<Grid
														item
														className={`${classes.paddingLeft10} ${classes.commentContent}`}
														style={
															eachComment?.commentType?.commentType === 'unitCreation' ? { marginTop: '1rem' } : null
														}
													>
														<div>
															<span className={classes.bold}>{eachComment?.user?.name}</span>
															{eachComment?.commentType?.commentType === 'unitCreation' && (
																<span style={{ display: 'inline-block', marginLeft: '8px' }}>
																	{eachComment?.comment}
																</span>
															)}

															{!isNaN(eachComment?.ts) && (
																<ReactTimeAgo
																	className={classes.commentTime}
																	style={{ whiteSpace: 'nowrap' }}
																	date={new Date(Number(eachComment?.ts))}
																	locale="en-US"
																/>
															)}
															{eachComment?.isEdited && <span className={classes.commentTime}>(Edited)</span>}
															{eachComment?.user?.email === user.email &&
																showCommentActionId === eachComment?._id &&
																editCommentId !== eachComment?._id &&
																eachComment?.commentType?.commentType !== 'unitCreation' && (
																	<div
																		className={`${classes.floatRight} ${classes.cursorPointer} ${classes.inlineFlex} ${
																			!(
																				eachComment?.user?.email === user.email &&
																				showCommentActionId === eachComment?._id &&
																				editCommentId !== eachComment?._id
																			) && classes.hideMenuIcon
																		}`}
																	>
																		<ActionMenu
																			eachComment={eachComment}
																			setEditCommentId={setEditCommentId}
																			setEditComment={setEditComment}
																			deleteComment={deleteComment}
																			setShowActions={setShowActions}
																			setIsEdit={setIsEdit}
																			pinToTop={pinToTop}
																			unpinFromTop={unpinFromTop}
																		/>
																	</div>
																)}
														</div>
														{eachComment?.isActivity === true && (
															<>
																<div className={`${classes.whiteSpace}`}>
																	{eachComment?.activityData.type.replace(/_/g, ' ').toUpperCase()} -{' '}
																	{eachComment?.activityData.name}
																</div>
																<div className={`${classes.whiteSpace}`}>
																	START DATE: {moment(eachComment?.activityData.dateTime).format('MM/DD/YYYY hh:mm A')}
																</div>
																<div className={`${classes.whiteSpace}`}>
																	END DATE: {moment(eachComment?.activityData.endDateTime).format('MM/DD/YYYY hh:mm A')}
																</div>
																{eachComment?.activityData.outcome && (
																	<div className={`${classes.whiteSpace}`}>
																		OUTCOME: {eachComment?.activityData.outcome}
																	</div>
																)}
															</>
														)}
														{eachComment?.commentType?.commentType !== 'unitCreation' &&
															(editCommentId !== eachComment?._id ? (
																<CommonCommentText users={users} eachComment={eachComment} />
															) : (
																<div className={classes.border}>
																	<CommentField
																		isEdit={isEdit}
																		profilesInfo={profilesInfo}
																		users={users}
																		comment={editComment}
																		showActions={showActions}
																		setEditCommentId={setEditCommentId}
																		setComment={setEditComment}
																		upsertComment={updateComment}
																		setIsEdit={setIsEdit}
																		setShowActions={setShowActions}
																	/>
																</div>
															))}
													</Grid>
													{eachComment?.commentType?.commentType !== 'unitCreation' && (
														<Grid item style={{ maxWidth: '75px', padding: '0px' }}>
															<IconButton onClick={() => callToggleCommentReactionMutation(eachComment)}>
																<div
																	style={{
																		display: 'flex',
																		alignItems: 'center',
																		gap: 5,
																	}}
																>
																	{eachComment?.likedBy?.length > 0 && (
																		<span style={{ fontSize: '12px' }}>{eachComment?.likedBy?.length}</span>
																	)}

																	<Tooltip title={<>{getLikedPeoplesName(eachComment, user._id)}</>}>
																		{didILikedThisComment(eachComment) ? <ThumbUpIcon /> : <ThumbUpAltOutlinedIcon />}
																	</Tooltip>
																</div>
															</IconButton>
														</Grid>
													)}
												</Grid>
											)}
										</Fragment>
									)
								);
							})}
						</>
					) : (
						<CircularProgress color="secondary"></CircularProgress>
					)}
					<div id="checkIf" ref={commentContainerRef} />
				</div>
				{!editCommentId && (
					<div
						style={{
							paddingBottom: '20px',
							// position: "absolute",
							// bottom: "0px",
							width: '100%',
						}}
					>
						<Grid container alignItems="center">
							<Grid item style={{ maxWidth: '55px' }}>
								<IconButton
									className={classes.commentView}
									// style={{ top: "3px" }}
								>
									{profile?.profileImage ? (
										<Avatar src={profile?.profileImage} size="38" round />
									) : (
										<Avatar name={user.name} size="38" round />
									)}
								</IconButton>
							</Grid>
							<Grid item className={`${classes.paddingLeft10} ${classes.commentContent}`}>
								<>
									<div
										className={classes.border}
										style={{ paddingBottom: '20px' }}
										onClick={() => {
											if (!showActions) {
												setShowActions(true);
											}
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
											showCommentType={props.showCommentType}
										/>
									</div>
								</>
							</Grid>
						</Grid>
					</div>
				)}
			</div>
		</>
	);
}

export const CommentText = ({ eachComment, users }) => {
	const classes = useStyles();
	let formatComment = (eachComment?.comment || '').split(' ');

	return (
		<div id={eachComment?._id} className={`${classes.whiteSpace}`}>
			{formatComment.map((word, index) => {
				if (word.includes('{{') && word.includes('}}')) {
					const splittedWord = word.split(/\r?\n/);

					// splitt word to manage new lines in the word
					if (splittedWord.length) {
						return (
							<>
								{splittedWord.map(sWord => {
									if (sWord.includes('{{') && sWord.includes('}}')) {
										const firstPart = sWord.split('{{')[0];
										const secondPart = sWord.split('}}')[1];
										let id = sWord.split('{{')[1];
										id = id.split('}}')[0];
										return (
											<p className={`${classes.commentWords} blue`}>
												{firstPart}@{users?.find(user => user._id === id)?.name}
												{secondPart}{' '}
											</p>
										);
									} else if (sWord === '') {
										return <br />;
									} else {
										return (
											<p className={classes.commentWords}>
												{sWord} <br />{' '}
											</p>
										);
									}
								})}
							</>
						);
					}

					return <p className={classes.commentWords}>{splittedWord}</p>;
				} else {
					return <p className={classes.commentWords}>{word} </p>;
				}
			})}
		</div>
	);
};

const ActionMenu = ({
	pinToTop,
	unpinFromTop,
	showActions,
	eachComment,
	setEditCommentId,
	setEditComment,
	deleteComment,
	setShowActions,
	setIsEdit,
}) => {
	const [anchorEl, setAnchorEl] = useState(null);

	const handleClick = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const pinnedComment = eachComment?.pin;

	return (
		<>
			<ExpandMoreIcon
				id="expandCommentActionIcon"
				aria-controls={eachComment?._id}
				aria-haspopup="true"
				onClick={handleClick}
				showActions={showActions}
			/>

			<Menu
				style={{ zIndex: '1305' }}
				id={eachComment?._id}
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={handleClose}
				getContentAnchorEl={null}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
				transformOrigin={{ vertical: 'top', horizontal: 'center' }}
			>
				<MenuItem
					id="editComment"
					onClick={event => {
						setEditCommentId(eachComment?._id);
						setEditComment(eachComment?.comment);
						setShowActions(true);
						setIsEdit(true);
						handleClose();
					}}
				>
					Edit Comment
				</MenuItem>
				<MenuItem textcolor="red" onClick={() => deleteComment(eachComment?._id)} id="deleteComment">
					Delete Comment
				</MenuItem>
				{pinnedComment ? (
					<MenuItem textcolor="red" onClick={() => unpinFromTop(eachComment?._id)} id="unpin">
						Unpin
					</MenuItem>
				) : (
					<MenuItem textcolor="red" onClick={() => pinToTop(eachComment?._id)} id="pintotop">
						Pin To Top
					</MenuItem>
				)}
			</Menu>
		</>
	);
};
