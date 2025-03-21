import React, { useContext, useState, useEffect } from 'react';
import Avatar from 'react-avatar';

import { CircularProgress } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';

import { useMutation, useLazyQuery, useQuery } from '@apollo/client';

import { CommonCommentText } from 'components/Shared/CommentComponent';
import CommentType from 'components/Shared/components/Comment/CommentType';

import { GET_PROFILES_IMAGES } from 'graphQL/useQueryGetProfile';
import { GETMONGOUSERS } from 'graphQL/useQueryGetUsers';

import { tableGlobalController } from 'stateManagement/tableController';

import { UserSession } from 'utils/user';

import { AppContext } from '../../AppContext';
import { REMOVECOMMENT } from '../../graphQL/useMutationRemoveComment';
import { UPSERTCOMMENT } from '../../graphQL/useMutationUpsertComment';
import { COMMENTSBYOBJECTIDQUERY } from '../../graphQL/useQueryCommentsByObjectId';
import { COMMENTSBYOBJECTSIDS } from '../../graphQL/useQueryCommentsByObjectsIds';
import MentionsUser from '../Shared/MentionsUser';
import capitalizeFirstLetter from '../Shared/valueformatters/capitalize-first-letter.js';
import CommentField from './components/Fields/CommentField';

const AntSwitch = withStyles(theme => ({
	root: {
		width: 28,
		height: 16,
		padding: 0,
		display: 'flex',
		zIndex: 1200,
	},
	switchBase: {
		padding: 2,
		color: theme.palette.grey[500],
		'&$checked': {
			transform: 'translateX(12px)',
			color: theme.palette.common.white,
			'& + $track': {
				opacity: 1,
				backgroundColor: '#12ABE0',
				borderColor: '#12ABE0',
			},
		},
	},
	thumb: {
		width: 12,
		height: 12,
		boxShadow: 'none',
	},
	track: {
		border: `1px solid ${theme.palette.grey[500]}`,
		borderRadius: 16 / 2,
		opacity: 1,
		backgroundColor: theme.palette.common.white,
	},
	checked: {},
}))(Switch);

const useStyles = makeStyles(theme => ({
	root: {
		// backgroundColor: "#fff",
		// zIndex: '999999 !important',
	},
	title: {
		fontSize: 10,
	},
	pos: {
		marginBottom: 12,
	},
	content: {
		height: '100%',
		padding: props => (props.detailCard ? '0 23px 0 23px' : props.handleRightDialogClose ? '0 0 0 8px' : '0'),
		overflowY: 'auto',
		'&::-webkit-scrollbar': {
			width: '0.75em',
			height: '0.75em',
		},
		// "&:hover::-webkit-scrollbar": {
		//     width: "1.0em",
		// },
		// "&::-webkit-scrollbar-track": {
		//     "-webkitBoxShadow": "inset 0 0 6px rgba(0,0,0,0.00)",
		// },
		maxHeight: props => (props.handleRightDialogClose ? 'none' : '60vh'),
		zIndex: '999999 !important',
	},
	list: {
		width: '100%',
		height: '100%',
		background: 'rgba(255,255,255,0)',
		color: 'rgba(23, 170, 221, 1)',
		overflowY: 'auto',
		'&::-webkit-scrollbar': {
			width: '0.75em',
			height: '0.75em',
		},
		// "&:hover::-webkit-scrollbar": {
		//     width: "1.0em",
		// },
		// "&::-webkit-scrollbar-track": {
		//     "-webkitBoxShadow": "inset 0 0 6px rgba(0,0,0,0.00)",
		// },
		padding: 0,
	},
	listItem: {
		fontFamily: 'Poppins',
		'& .MuiListItemIcon-root, & .MuiListItemText-primary': {
			color: theme.palette.common.black,
		},
		'& .MuiListItemText-secondary': {
			color: 'rgba(23, 170, 221, 1)',
			right: '0px',
		},
	},
	textInput: {
		width: '100%',
		backgroundColor: '#fff',
	},
	header: {
		paddingBottom: '0',
		'& .MuiTypography-h5': { fontSize: '1.2rem ' },
	},
	listItemText: {
		'& .MuiTypography-body1': { fontSize: '0.85rem' },
		'& .MuiTypography-body2': { fontSize: '0.7rem' },
		'&  p': {
			margin: '0',
		},
	},
	avatar: {
		minWidth: '50px',
	},
	foodText: {
		fontSize: '10px',
		color: '#6e6e6e',
		margin: '0',
		textAlign: 'right',
		float: 'right',
		marginLeft: '10px',
		'& span': {
			fontWeight: 'bold',
		},
		'& .redColor': {
			color: 'rgb(240, 89, 89) !important',
		},
	},
	emptyInput: {
		'& fieldset': {
			borderColor: 'rgb(240, 89, 89) !important',
		},
	},
	switchButtom: {
		float: 'right',
		alignSelf: 'flex-end',
		marginRight: 0,
		'& span.MuiTypography-body1': {
			fontSize: '0.9rem',
		},
	},
	switchTextDeselected: {
		color: 'rgb(141, 141, 141)',
	},
	viewAll: {
		textDecoration: 'underline',
		margin: '0 0 8px 0',
		float: 'right',
		color: theme.palette.secondary.main,
		cursor: 'pointer',
		fontWeight: 'normal',
		'&:hover': { color: '#757575' },
		transition: 'color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
	},
	closeIcon: {
		color: theme.palette.secondary.main,
	},
	sharedCommentLabel: {
		width: 'fit-content',
		margin: '0',
		float: 'left',
		color: '#757575',
		fontWeight: 'normal',
	},
	nameAndDateLine: {
		color: 'rgb(176, 176, 176)',
		margin: '0',
		fontWeight: 'normal',
	},
	deleteLine: {
		textDecoration: 'underline',
		color: '#757575',
		margin: '0',
		fontWeight: 'normal',
		'&:hover': {
			color: theme.palette.primary.main,
			cursor: 'pointer',
		},
	},
	commentType: {
		display: 'flex',
		padding: '12px',
	},
	commentBtn: {
		float: 'right',
		// right: '15px',
		zIndex: '999',
		marginTop: '10px',
	},
}));

export default function Comments(props) {
	//// props.detailCard - to show a version for a detail card ////
	const [stateApp] = useContext(AppContext);
	const [commentsArray, setCommentsArray] = useState([]);
	const [textValue, setTextValue] = useState('');
	const [loadingComments, setLoadingComments] = useState(true);
	const [emptyInput, setEmptyInput] = useState(false);
	const [publicComment, setPublicComment] = useState(true);
	const [selectedCommentType, setSelectedCommentType] = useState('General');
	const classes = useStyles({
		...props,
		commentsArrayLength: commentsArray.length,
	});

	const [getCommentsByObjectId, { data: dataComments }] = useLazyQuery(COMMENTSBYOBJECTIDQUERY, {
		fetchPolicy: 'cache-and-network',
	});
	const [getCommentsByObjectsIds, { data: dataCommentsMultiIds }] = useLazyQuery(COMMENTSBYOBJECTSIDS, {
		fetchPolicy: 'cache-and-network',
	});
	const { data: userLists } = useQuery(GETMONGOUSERS, {
		fetchPolicy: 'cache-and-network',
	});
	const [getProfilesImages, profilesData] = useLazyQuery(GET_PROFILES_IMAGES, {
		fetchPolicy: 'cache-first',
	});

	const [upsertComment] = useMutation(UPSERTCOMMENT, {
		onCompleted: () => {
			tableGlobalController.refetch();
			props.refetch?.();
		},
	});
	const [removeComment] = useMutation(REMOVECOMMENT);

	///////////////////// START FETCHING COMMENTS DATA ////////////////////////////////////////////

	useEffect(() => {
		setLoadingComments(true);
		if (!props.multipleIds) {
			getCommentsByObjectId({
				variables: {
					objectId: props.targetSourceId,
				},
			});
		} else {
			getCommentsByObjectsIds({
				variables: {
					objectsIdsArray: props.multipleIds,
					userId: stateApp.user.mongoId,
				},
			});
		}
	}, [props.targetSourceId, props.multipleIds]);

	const sortArrayBasedOnTs = array => {
		const compare = (a, b) => {
			if (a.ts > b.ts) {
				return -1;
			}
			if (b.ts > a.ts) {
				return 1;
			}

			return 0;
		};

		if (!props.multipleIds) {
			array.sort(compare);
		}

		return array;
	};

	useEffect(() => {
		if (dataComments && dataComments.commentsByObjectId) {
			setCommentsArray(sortArrayBasedOnTs([...dataComments.commentsByObjectId]));
		}
		setLoadingComments(false);
	}, [dataComments]);

	useEffect(() => {
		if (dataCommentsMultiIds && dataCommentsMultiIds.commentsByObjectsIds) {
			const checkIfUserMatch = user => {
				for (let i = 0; i < user.length; i++) {
					if (user[i]._id !== stateApp.user.mongoId) {
						return false;
					}
				}
				return user[0];
			};

			let comments = [];
			for (let i = 0; i < dataCommentsMultiIds.commentsByObjectsIds.length; i++) {
				const element = dataCommentsMultiIds.commentsByObjectsIds[i];
				if (
					element.commentedOn.length === props.multipleIds.length &&
					element.public.filter(v => v === publicComment).length === props.multipleIds.length
				) {
					comments.push({
						...element,
						user: checkIfUserMatch(element.user) ? checkIfUserMatch(element.user) : { name: '', email: '' },
						public: publicComment,
					});
				}
			}

			setCommentsArray(sortArrayBasedOnTs(comments));
		}
		setLoadingComments(false);
	}, [dataCommentsMultiIds, publicComment]);

	///////////////////// INSERTING NEW COMMENT ///////////////////////////////////////////////

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
					.join('\n')}.`;

	const addNewComment = (value, commentedOn) => {
		upsertComment({
			variables: {
				comment: {
					comment: newCommentCleaner(value),
					public: publicComment,
					user: stateApp.user.mongoId,
					commentedOn,
					objectType: props.targetLabel,
					commentType: selectedCommentType,
					pin: false,
					tenant: UserSession.getStorageItem('tenantName'),
				},
			},
			refetchQueries: [
				'getCommentsByObjectId',
				'getCommentsCounter',
				'getCommentsByObjectsIds',

				'getDbData',
				...props.refetchQueries,
			],
			awaitRefetchQueries: true,
		});
	};

	const handleEnteringComment = event => {
		event.persist();
		if (
			event.target.value.split('\n').join('').trim() !== '' &&
			event.target.value.split('\n').join('').trim() !== '.'
		) {
			if (!props.multipleIds) {
				addNewComment(event.target.value, props.targetSourceId);
			} else {
				for (let i = 0; i < props.multipleIds.length; i++) {
					addNewComment(event.target.value, props.multipleIds[i]);
				}
			}
			setEmptyInput(false);
		} else {
			setEmptyInput(true);
		}
		setTextValue('');
	};

	///////////////////// DELETING A COMMENT ///////////////////////////////////////////////

	const handleDeleteClick = comment => {
		if (!props.multipleIds) {
			removeComment({
				variables: {
					commentId: comment._id,
				},
				refetchQueries: [
					'getCommentsByObjectId',
					'getCommentsCounter',
					'getCommentsByObjectsIds',

					'getDbData',
					...props.refetchQueries,
				],
				awaitRefetchQueries: true,
			});
		} else {
			for (let i = 0; i < comment.ids.length; i++) {
				removeComment({
					variables: {
						commentId: comment.ids[i],
					},
					refetchQueries: [
						'getCommentsByObjectId',
						'getCommentsCounter',
						'getCommentsByObjectsIds',

						'getDbData',
						...props.refetchQueries,
					],
					awaitRefetchQueries: true,
				});
			}
		}
	};

	////////////////////////////////////////////////////////////////////////////////////////

	const textFieldHandleChange = e => {
		if (e.target.value[e.target.value.length - 1] !== '\\') {
			if (e.target.value[e.target.value.length - 1] !== '\n') {
				setTextValue(
					e.target.value
						.split('\n')
						.map(line => {
							return capitalizeFirstLetter(line);
						})
						.join('\n')
				);
			} else {
				if (e.target.value[e.target.value.length - 2] !== '\n') {
					setTextValue(`${textValue}.\n`);
				}
			}
		}
		if (e.target.value.split('\n').join('').trim() !== '' && emptyInput) {
			setEmptyInput(false);
		}
	};

	useEffect(() => {
		if (props.focus) {
			document.getElementById('commentInput')?.focus?.();
		}
	}, [props.focus]);

	let commentsDisplayedCount = 0;

	// const [isEdit, setIsEdit] = useState(false);
	const [profilesInfo, setProfilesInfo] = useState({});
	const [users, setUsers] = useState([]);
	const [comment, setComment] = useState('');
	const [showActions, setShowActions] = useState(false);
	// const [editCommentId, setEditCommentId] = useState("");

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
		if (profilesData?.data?.profileByEmail?.profiles) {
			setProfilesInfo(profilesData.data.profileByEmail.profiles);
		}
	}, [profilesData]);

	const updateComment = value => {
		setLoadingComments(true);

		upsertComment({
			variables: {
				comment: {
					comment: typeof value === 'object' ? newCommentCleaner(value.comment) : newCommentCleaner(value),
					commentType: selectedCommentType,
					user: stateApp.user.mongoId,
					commentedOn: props.targetSourceId,
					objectType: props.targetLabel,
					public: publicComment,
					pin: false,
					tenant: UserSession.getStorageItem('tenantName'),
				},
			},
			refetchQueries: [
				'getCommentsByObjectId',
				'getCommentsCounter',
				'getCommentsByObjectsIds',

				'getDbData',
				...props.refetchQueries,
			],
			awaitRefetchQueries: true,
		});
		setShowActions(false);
		// setComment("");
		setComment('');
		// setEditCommentId("");
	};

	return (
		<Card
			className={classes.root}
			variant="outlined"
			style={props.detailCard ? { backgroundColor: 'transparent', border: 'none', zIndex: 99999 } : {}}
		>
			<CardActions
				style={
					props.detailCard || props.handleRightDialogClose
						? {
								padding: '23px 23px 8px 23px',
							}
						: {}
				}
			>
				<Grid container>
					{(props.detailCard || props.handleRightDialogClose) && (
						<Grid item xs={12} style={{ minHeight: '35px' }}>
							<h4 style={{ margin: '0 0 8px 0', float: 'left' }}>Recent Comments</h4>
							{props.viewAll ? (
								<h4
									className={classes.viewAll}
									onClick={e => {
										e.preventDefault();
										props.viewAll('comments');
									}}
								>
									View All
								</h4>
							) : (
								<IconButton
									onClick={e => {
										if (props.handleRightDialogClose) {
											props.handleRightDialogClose(e);
										}
									}}
									size="small"
									style={{ float: 'right', top: '-5px', right: '-5px' }}
								>
									<CloseIcon className={classes.closeIcon} fontSize="small" />
								</IconButton>
							)}
						</Grid>
					)}
					<Grid item xs={12} style={{ marginBottom: '8px' }}>
						<FormGroup style={{ display: 'block' }}>
							{(props.detailCard || props.handleRightDialogClose) && (
								<h4 className={classes.sharedCommentLabel}>Share comments</h4>
							)}
							<FormControlLabel
								className={`${classes.switchButtom} ${!publicComment ? classes.switchTextDeselected : ''}`}
								control={
									<React.Fragment>
										<AntSwitch
											checked={publicComment}
											onChange={() => {
												setPublicComment(!publicComment);
											}}
											name="checkedC"
										/>
									</React.Fragment>
								}
								label={!props.detailCard && !props.handleRightDialogClose ? 'Shared' : ''}
								labelPlacement="start"
							/>
						</FormGroup>
					</Grid>
					<Grid item xs={12}>
						<MentionsUser
							users={users}
							comment={comment}
							setComment={setComment}
							updateComment={updateComment}
							profilesInfo={profilesInfo}
							isSaveAllowed={props?.isSaveAllowed}
							placeholder={props.placeholder}
							isHelperTextAllow={props.isHelperTextAllow}
						/>
					</Grid>
				</Grid>
			</CardActions>
			<CardContent
				className={classes.content}
				style={{
					paddingBottom: props.detailCard && commentsArray.length > 0 ? '23px' : '0',
					height: props.handleRightDialogClose ? 'calc(100vh - 218px)' : null,
				}}
			>
				{!loadingComments ? (
					<List className={classes.list}>
						{commentsArray.map((comment, index) =>
							props.detailCard
								? ((publicComment && comment.public) ||
										(!publicComment && !comment.public && stateApp?.user?.email === comment?.user?.email)) &&
									(commentsDisplayedCount += 1) &&
									(props.top && props.top < commentsDisplayedCount ? null : (
										//// ListItem ////
										<div key={index}>
											{commentsDisplayedCount !== 1 && (
												<Divider
													style={{
														marginTop: '13px',
														marginBottom: '13px',
													}}
												/>
											)}
											{/* //// name and date line //// */}
											<h5 className={classes.nameAndDateLine}>{`${comment?.user?.name} · ${new Intl.DateTimeFormat(
												'en-US',
												{
													year: 'numeric',
													month: 'long',
													day: '2-digit',
													hour: '2-digit',
													minute: '2-digit',
												}
											).format(comment.ts)}`}</h5>

											{/* //// comment line //// */}
											<div style={{ marginTop: '7px', marginBottom: '7px' }}>
												{comment.comment.split('\n').map((line, i) => {
													return (
														<p
															key={i}
															style={{
																color: '#757575',
																margin: '0',
															}}
														>
															{line}
														</p>
													);
												})}
											</div>

											{/* //// delete line //// */}
											<h5 className={classes.deleteLine} onClick={() => handleDeleteClick(comment)}>
												Delete
											</h5>
										</div>
									))
								: //// ListItem  End ////
									((publicComment && comment.public) ||
										(!publicComment && stateApp.user.email === comment?.user?.email && !comment.public)) && (
										<ListItem key={index} className={classes.listItem} alignItems="flex-start">
											<ListItemAvatar className={classes.avatar}>
												<Avatar
													name={comment?.user?.name}
													color={Avatar.getRandomColor(comment?.user?.email, [
														'#b5d2f6',
														'#ade2e9',
														'#eaeaea',
														'#f2c1e2',
														'#d7d6fb',
													])}
													fgColor="#000"
													size="35"
													round
												/>
											</ListItemAvatar>
											<ListItemText
												className={classes.listItemText}
												primary={
													// <div style={{ marginBottom: '8px' }}>
													//   <div style={{
													//     marginTop: '2px',
													//     marginBottom: '5px',
													//     fontWeight: 'bolder',
													//     color: '#3e3e3e',
													//     fontSize: '15px',
													//   }}>{comment?.commentType || 'General'}</div>
													//   <CommentText users={userLists?.allMongoUsers} eachComment={comment} />
													// </div>
													<CommonCommentText users={userLists?.allMongoUsers} eachComment={comment} />
												}
												secondary={
													`${comment?.user?.name}` +
													(comment.ids
														? ''
														: ` - ${new Intl.DateTimeFormat('en-US', {
																year: 'numeric',
																month: 'long',
																day: '2-digit',
																hour: '2-digit',
																minute: '2-digit',
															}).format(comment.ts)}`)
												}
											/>
											<ListItemSecondaryAction>
												<IconButton
													edge="end"
													aria-label="delete"
													data-testid={`comment-delete-icon-${index}`}
													onClick={() => handleDeleteClick(comment)}
												>
													<DeleteIcon />
												</IconButton>
											</ListItemSecondaryAction>
										</ListItem>
									)
						)}
					</List>
				) : (
					<CircularProgress color="secondary"></CircularProgress>
				)}
				<div className={classes.commentType}>
					<CommentType showCommentType={true} setSelectedCommentType={setSelectedCommentType} />
				</div>
			</CardContent>
		</Card>
	);
}

Comments.defaultProps = {
	refetchQueries: [],
};
