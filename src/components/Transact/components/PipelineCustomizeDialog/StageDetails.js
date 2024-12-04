import React, { useState, useEffect, useMemo } from 'react';
import { get } from 'lodash';
import { useMutation, useLazyQuery } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Grid, Typography, TextField, InputAdornment, CircularProgress } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import { ADD_TASK, UPDATE_TASK } from 'graphQL/useMutationStageTask';
import { STAGE_TASK_TEMPLATE } from 'graphQL/useQueryTask';
import { GETMONGOUSERS } from 'graphQL/useQueryGetUsers';
import NewSubtask from 'components/Transact/components/Common/NewSubtask';
import DealSubtasks from 'components/Transact/components/DealTasksDetails/DealSubtasks';
import CustomAvatar from 'components/Shared/ui/CustomAvatar';

const useStyles = makeStyles(() => ({
	root: {
		width: 'auto',
		margin: '27px !important',
	},
	aneName: {
		fontWeight: 'bold',
		margin: '10px 0px 10px 0px',
		fontSize: 'large',
	},
	laneDetailRow: {
		margin: '5px 0px 5px 0px',
		display: 'flex',
		alignItems: 'center',
		'& .MuiTypography-body2': {
			minWidth: '80px !important',
		},
	},
	inputFieldOwner: {
		marginBottom: '7px',
		width: '275px',
		backgroundColor: '#efefef',
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
	dealOwnerLabel: {
		marginLeft: 4,
	},
	notes: {
		backgroundColor: '#FFFCDC',
		display: 'block',
		width: '100%',
		marginTop: 25,

		'& .MuiOutlinedInput-root': {
			width: '100%',
			'& fieldset': {
				borderColor: 'white',
			},
		},
	},
	accordionColored: {
		backgroundColor: 'aliceblue',
	},
	accordionColorReset: {
		backgroundColor: 'transparent',
		webkitTransition: 'background-color 1000ms linear',
		msTransition: 'background-color 1000ms linear',
		transition: 'background-color 1000ms linear',
	},
}));

function StageDetails({ selectedStageForDetail = {}, selectedPipe }) {
	const classes = useStyles();

	const [users, setUsers] = useState([]);
	const [taskTemplate, setTemlate] = useState();
	const [templateSubtasks, setSubtasks] = useState([]);
	const [createTask, { data: stageTask }] = useMutation(ADD_TASK);
	const [updateTask] = useMutation(UPDATE_TASK);
	const [getTaskTemplate, { loading: taskTemplateLoading }] = useLazyQuery(STAGE_TASK_TEMPLATE, {
		fetchPolicy: 'cache-and-network',
		onCompleted: ({ stageTaskTemplate }) => {
			if (stageTaskTemplate.stageDealDescriptor) {
				const { stageDealDescriptor } = stageTaskTemplate;
				if (stageDealDescriptor) {
					setTemlate(stageDealDescriptor.taskTemplate);
					setSubtasks(stageDealDescriptor.templateSubtasks);
				}
			} else {
				createTask({
					variables: {
						task: { isTemplate: true },
						stageId: selectedStageForDetail._id,
						pipelineId: selectedPipe._id,
					},
				});
			}
		},
	});
	const [getAllMongoUsers, { data: userLists }] = useLazyQuery(GETMONGOUSERS, {
		fetchPolicy: 'no-cache',
	});

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
		getAllMongoUsers();
		if (selectedStageForDetail) {
			getTaskTemplate({
				variables: {
					stageId: selectedStageForDetail._id,
					pipelineId: selectedPipe._id,
				},
			});
		}
	}, [getAllMongoUsers, getTaskTemplate, selectedPipe._id, selectedStageForDetail]);

	useEffect(() => {
		if (stageTask?.createTask?.task) {
			setTemlate(stageTask.createTask.task);
		}
	}, [stageTask]);

	const handleChangeApprover = assignee => {
		updateTask({
			variables: {
				task: { ...taskTemplate, assignee },
			},
			refetchQueries: ['getTaskTemplate'],
			awaitRefetchQueries: true,
		});
	};
	const approver = useMemo(() => {
		return users?.find(user => user?.value === taskTemplate?.assignee);
	}, [users, taskTemplate]);

	return (
		<Grid container className={classes.root}>
			{taskTemplateLoading ? (
				<div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
					<CircularProgress size="20px" />
				</div>
			) : (
				<>
					<Grid xs={12} item>
						<Typography variant="body1" style={{ fontWeight: 'bold' }}>
							Task Template
						</Typography>
					</Grid>
					<Grid item xl={8} md={8} sm={8} className={classes.laneDetailRow}>
						<Typography variant="body2" color="textSecondary">
							Approver
						</Typography>
						<Autocomplete
							options={users.filter(u => u.text)}
							onChange={(e, user) => {
								handleChangeApprover(get(user, 'value', null));
							}}
							value={users.find(user => user?.value === taskTemplate?.assignee) || null}
							getOptionLabel={option => option.text}
							getOptionSelected={option => option.value === taskTemplate?.assignee}
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
									placeholder="Assign approver"
									InputProps={{
										...params.InputProps,
										startAdornment: (
											<>
												<InputAdornment position="start">
													{taskTemplate?.assignee ? (
														<CustomAvatar email={approver?.email} text={approver?.text?.toString()} />
													) : (
														<AccountCircle fontSize="default" />
													)}
												</InputAdornment>
												{params.InputProps.startAdornment}
											</>
										),
									}}
								/>
							)}
						/>
					</Grid>
					<Grid item xl={12} sm={12} style={{ margin: '10px 0px 10px 0px' }}>
						<DealSubtasks tasks={templateSubtasks} users={users} canDrag={false} isTemplate />
					</Grid>
					<NewSubtask
						relatedObject={selectedStageForDetail._id}
						taskTemplate={taskTemplate}
						pipeline={selectedPipe._id}
						isTemplate
					/>
				</>
			)}
		</Grid>
	);
}

export default StageDetails;
