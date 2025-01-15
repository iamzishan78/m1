import React, { useState, useEffect, useContext } from 'react';
import { Flipper, Flipped } from 'react-flip-toolkit';
import { ContextProvider } from 'react-sortly';
import Sortly, { useDrag, useDrop, useIsClosestDragging } from 'react-sortly';

import {
	Grid,
	IconButton,
	Popover,
	List,
	ListItem,
	ListItemText,
	Tooltip,
	ListItemIcon,
	Typography,
	TextField,
} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';
import {
	DragIndicator,
	AccountCircle,
	Event as CelendarIcon,
	Close as CloseIcon,
	Edit as EditIcon,
} from '@material-ui/icons';
import { KeyboardDatePicker } from '@material-ui/pickers';

import { useMutation } from '@apollo/client';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';

import CustomAvatar from 'components/Shared/ui/CustomAvatar';

import { UPDATE_DEAL_SUBTASK } from 'graphQL/useMutationDealSubtask';

import { AppContext } from 'AppContext';

const useStyles = makeStyles(theme => ({
	subTaskRoot: props => ({
		width: '100%',
		minHeight: '40px',
		zIndex: props.muted ? 1 : 0,
		display: 'flex',
	}),
	subTaskLeftGrid: {
		flex: '1 1 auto',
		'& .MuiFormControlLabel-root': {
			marginRight: 0,
		},
	},
	subTaskRightGrid: props => ({
		alignItems: 'right',
		textAlign: 'right',
		// maxWidth: 200,
		// width: '20%',
		'& .MuiIconButton-root': {
			height: '25px',
			width: '25px',
			margin: '5px',
		},
		'& .MuiTextField-root': {
			margin: '2px 10px 0px 0px',
			marginBottom: 0,
		},
		'& .MuiInput-underline:before': {
			borderBottom: 'none !important',
		},
		'& .MuiInput-underline:after': {
			borderBottom: 'none !important',
		},
		'& .MuiFormHelperText-root': {
			display: 'none !important',
		},
		'& .MuiInputBase-input': {
			textAlign: 'right',
			cursor: 'pointer',
			maxWidth: '90px',
		},
		'& .MuiInputAdornment-root': {
			display: props.task.dueDate ? 'none' : '',
		},
	}),
	avatarButton: {
		'& .MuiIconButton-label': {
			width: 'auto',
			'& span': {
				paddingTop: '5px',
			},
		},
	},
	taskTemplateDatePopover: {
		cursor: 'pointer',
	},
	pencilIcon: {
		margin: '-5px 0px -5px 5px',
		cursor: 'pointer',
	},
}));

export const SubtaskItem = ({
	task,
	handleUpdateSubtask,
	users,
	handleDragEnd,
	canDrag = true,
	isTemplate = false,
}) => {
	const approver = users.find(user => user?.value === task.assignee) || {};
	const [showTaskActions, setShow] = useState(false);
	const [isDatePopup, setDatePopup] = useState(false);
	const [isEdit, setEdit] = useState({ index: -1, isEditing: false, showIcon: false });
	const onHoverTask = state => setShow(state);

	const [{ isDragging }, drag, preview] = useDrag({
		collect: monitor => {
			return {
				isDragging: monitor.isDragging(),
			};
		},
		end(f) {
			handleDragEnd();
		},
	});

	const [, drop] = useDrop();
	const classes = useStyles({ muted: useIsClosestDragging() || isDragging, task });
	const [timeframe, setTimeframe] = useState();

	useEffect(() => {
		if (!showTaskActions) {
			setDatePopup(false);
		}
	}, [showTaskActions]);

	return (
		<Flipped flipId={task.id}>
			<div
				className={classes.subTaskRoot}
				onMouseLeave={() => onHoverTask(false)}
				onMouseEnter={() => onHoverTask(true)}
				ref={ref => canDrag && drop(preview(ref))}
			>
				<Grid
					container
					direction="row"
					justifyContent="space-between"
					alignItems="center"
					wrap="nowrap"
					onMouseEnter={() => setEdit({ ...isEdit, index: task.index, showIcon: true })}
					onMouseLeave={() => setEdit({ ...isEdit, index: -1, showIcon: false })}
				>
					<Grid item justifyContent="flex-start" className={classes.subTaskLeftGrid}>
						<Grid container direction="row" justify="flex-start" alignItems="center" wrap="nowrap">
							<Grid item>
								{canDrag && (
									<ListItemIcon ref={drag} style={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
										<DragIndicator style={{ cursor: 'move' }} />
									</ListItemIcon>
								)}
							</Grid>
							<Grid item>
								<FormControlLabel
									control={
										<Checkbox
											name="subtaskCheckbox"
											value={task.name}
											onChange={e =>
												handleUpdateSubtask({
													...task,
													isCompleted: e.target.checked,
													completionDate: e.target.checked ? new Date().toString() : null,
												})
											}
											checked={task.isCompleted}
										/>
									}
								/>
							</Grid>

							{!isEdit.isEditing ? (
								<>
									<Tooltip title={task.name} placement="top">
										<p style={{ fontSize: 'medium' }}>{task.name}</p>
									</Tooltip>
									{isEdit.index === task.index && isEdit.showIcon && (
										<EditIcon
											fontSize="small"
											onClick={event => {
												event.stopPropagation();
												setEdit({ ...isEdit, isEditing: true });
											}}
											className={classes.pencilIcon}
										/>
									)}
								</>
							) : (
								<Grid item style={{ maxWidth: '100%' }}>
									<TextField
										size="small"
										variant="outlined"
										label="Press Enter To Save"
										autoFocus
										style={{ width: '100%' }}
										defaultValue={task.name}
										onKeyDown={e => {
											if (e.key === 'Enter') {
												e.preventDefault();
												handleUpdateSubtask({
													...task,
													name: e.target.value,
												});
												setEdit({ ...isEdit, isEditing: false, index: -1 });
											}
										}}
										onClick={event => event.stopPropagation()}
										onBlur={() => setEdit({ isEditing: false, index: -1 })}
									/>
								</Grid>
							)}
						</Grid>
					</Grid>

					<Grid item className={classes.subTaskRightGrid}>
						<Grid container direction="row" justify="flex-end" alignItems="center" wrap="nowrap">
							<Grid item>
								{isTemplate ? (
									<PopupState variant="TaskTemplateDatePopover" popupId="TaskTemplateDatePopover">
										{popupState => (
											<>
												{task.timeframe ? (
													<Typography color="textSecondary" style={{ cursor: 'pointer' }} {...bindTrigger(popupState)}>
														+ {task.timeframe} days
													</Typography>
												) : (
													showTaskActions && (
														<IconButton className={classes.avatarButton} {...bindTrigger(popupState)}>
															<CelendarIcon size="medium" />
														</IconButton>
													)
												)}
												<Popover
													{...bindPopover(popupState)}
													anchorOrigin={{
														vertical: 'bottom',
														horizontal: 'center',
													}}
													transformOrigin={{
														vertical: 'top',
														horizontal: 'center',
													}}
													onClose={() => {
														handleUpdateSubtask({ ...task, timeframe });
														popupState.close();
													}}
												>
													<div style={{ padding: '5px', width: '300px' }}>
														<Grid container alignItems="center" style={{ textAlign: 'center' }}>
															<Grid item xs={4} style={{ alignSelf: 'center' }}>
																<Typography color="textSecondary">Due in +</Typography>
															</Grid>
															<Grid item xs={5}>
																<Typography color="textSecondary">
																	<TextField
																		type="number"
																		margin="dense"
																		variant="outlined"
																		className={classes.inputFieldOwner}
																		placeholder="Days"
																		defaultValue={task.timeframe}
																		onChange={({ target: { value } }) => setTimeframe(value)}
																		onKeyDown={e => {
																			if (e.keyCode === 13) {
																				e.preventDefault();
																				handleUpdateSubtask({ ...task, timeframe: e.target.value });
																			}
																		}}
																	/>
																</Typography>
															</Grid>
															<Grid item xs={3} style={{ alignSelf: 'center' }}>
																<Typography color="textSecondary">days</Typography>
															</Grid>
														</Grid>
													</div>
												</Popover>
											</>
										)}
									</PopupState>
								) : (
									!isTemplate &&
									(task.dueDate || showTaskActions) && (
										<span className={classes.taskTemplateDatePopover}>
											<KeyboardDatePicker
												disableToolbar
												variant="inline"
												format="MM/DD/YY"
												margin="normal"
												allowKeyboardControl={false}
												value={task.dueDate || ''}
												emptyLabel
												disabled
												keyboardIcon={task.dueDate && <></>}
												open={isDatePopup}
												onClick={() => setDatePopup(!isDatePopup)}
												onClose={() => setDatePopup(!isDatePopup)}
												onChange={date => {
													handleUpdateSubtask({ ...task, dueDate: date ? String(date['_d']) : '' });
													setDatePopup(!isDatePopup);
												}}
											/>
										</span>
									)
								)}
							</Grid>
							<Grid item>
								{(task.assignee || showTaskActions || task.timeframe || task.dueDate) && (
									<span>
										<PopupState variant="popper" popupId="SubtaskAssigneePopover">
											{popupState => (
												<>
													<IconButton className={classes.avatarButton} {...bindTrigger(popupState)}>
														{task.assignee ? (
															<CustomAvatar email={approver.email} text={approver.text?.toString()} />
														) : (
															<AccountCircle fontSize="default" />
														)}
													</IconButton>
													<Popover
														{...bindPopover(popupState)}
														getContentAnchorEl={null}
														anchorOrigin={{
															vertical: 'bottom',
															horizontal: 'center',
														}}
														transformOrigin={{
															vertical: 'top',
															horizontal: 'center',
														}}
													>
														<List style={{ maxHeight: 450 }}>
															{users.map(user => (
																<ListItem
																	button
																	onClick={() => {
																		handleUpdateSubtask({
																			...task,
																			assignee: user.value,
																			assignedDate: new Date().toString(),
																		});
																		popupState.close();
																	}}
																>
																	<ListItemText primary={user.text} />
																</ListItem>
															))}
														</List>
													</Popover>
												</>
											)}
										</PopupState>
									</span>
								)}
							</Grid>
							<Grid item>
								{showTaskActions && (
									<IconButton
										size="small"
										component="span"
										style={{
											background: 'transparent',
											align: 'center',
										}}
										onClick={() => handleUpdateSubtask({ ...task, IsDeleted: true })}
									>
										<CloseIcon size="medium" />
									</IconButton>
								)}
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</div>
		</Flipped>
	);
};

const DealSubtasks = props => {
	const { tasks, users, canDrag, isTemplate, currentStage } = props;
	const [items, setItems] = useState([]);

	const [updateSubtask] = useMutation(UPDATE_DEAL_SUBTASK);
	const [stateApp] = useContext(AppContext);

	useEffect(() => {
		setItems(tasks.map((t, index) => ({ ...t, id: `${index + 1}`, index, depth: 0 })));
	}, [tasks]);

	const handleUpdateSubtask = task => {
		updateSubtask({
			variables: {
				task: { ...task, notifySubtask: stateApp?.activeDeal?.laneId === currentStage },
			},
			refetchQueries: ['dealSettings', 'getTaskTemplate'],
			awaitRefetchQueries: true,
		});
	};

	const handleChange = newItems => setItems(newItems);
	const handleDragEnd = () => {
		updateSubtask({
			variables: {
				tasks: items.map((i, position) => ({ ...i, position })),
			},
			refetchQueries: ['dealSettings'],
			awaitRefetchQueries: true,
		});
	};

	return (
		// <DndProvider backend={HTML5Backend}>
		<ContextProvider>
			<Flipper flipKey={items.map(({ id }) => id).join('.')}>
				<Sortly items={items} onChange={handleChange}>
					{props => (
						<SubtaskItem
							task={props.data}
							handleUpdateSubtask={handleUpdateSubtask}
							users={users}
							handleDragEnd={handleDragEnd}
							canDrag={canDrag}
							isTemplate={isTemplate}
						/>
					)}
				</Sortly>
			</Flipper>
		</ContextProvider>
		// </DndProvider>
	);
};

export default DealSubtasks;
