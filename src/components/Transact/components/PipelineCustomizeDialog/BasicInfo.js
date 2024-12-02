import React, { useEffect, useState, useRef, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Controller } from 'react-hook-form';
import { makeStyles } from '@material-ui/core/styles';
import {
	Grid,
	FormControl,
	TextField,
	Select,
	Switch,
	FormControlLabel,
	InputLabel,
	MenuItem,
	Typography,
	TableCell,
	Checkbox,
	RootRef,
	Table,
	TableBody,
	TableRow,
} from '@material-ui/core';
import { DragIndicator } from '@material-ui/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// import { TransactContext } from "components/Transact/TransactContext";

const useStyles = makeStyles(theme => ({
	basicInfoRoot: {
		maxWidth: 650,
		padding: '25px',
		'& .MuiInputBase-root': {
			height: '40px !important',
			'& .MuiSelect-root': {
				backgroundColor: 'transparent',
			},
		},
	},
	label: {
		margin: 0,
	},
	formControl: {
		minWidth: '100%',
		maxHeight: '45px',
		marginBottom: 0,

		'& .MuiFormControlLabel-label': {
			paddingLeft: theme.spacing(1),
		},
	},
	switchControl: {
		'& > .MuiFormControlLabel-label': {
			fontSize: 12,
		},
	},
	titleText: {
		fontWeight: 'bold',
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(2),
	},
	cardFieldController: {
		border: '2px solid #BFBFBF',
		borderRadius: theme.spacing(1),
		padding: theme.spacing(1),
	},
	tableCell: {
		border: 'none',
		paddingLeft: 4,
		paddingRight: 4,
	},
	cardSwitchControl: {
		marginLeft: 0,
		marginRight: 0,

		'& .MuiFormControlLabel-label': {
			flex: 1,
		},
	},
}));

const dealFlowLine = [
	{ name: 'Deal Received', isSelected: false, key: 'receivedDate' },
	{ name: 'Bid Date', isSelected: false, key: 'bidDate' },
	{ name: 'Close Date', isSelected: false, key: 'closeDate' },
	{ name: 'Offer Price', isSelected: false, key: 'offerPrice' },
	{ name: 'Closed Price', isSelected: false, key: 'closedPrice' },
	{ name: 'Total NRA', isSelected: false, key: 'totalNRA' },
];
const generalFlowLine = [{ name: 'Due Date', isSelected: false, key: 'dueDate' }];

const reorder = (list, startIndex, endIndex) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result;
};

const BasicInfo = ({ control, reset, setValue, watch, flowErrors, setFlowErrors }) => {
	const classes = useStyles();
	const callCount = useRef(0);
	// const [stateTransact] = useContext(TransactContext);
	const { openPipeDialog, selectedPipe } = useSelector(({ Flow }) => Flow);

	const flowLineType = watch('flowLineType');
	const name = watch('name');
	const rottenness = watch('rottenness');
	const showDescription = watch('showDescription');
	const fieldsOnCardToShow = watch('fieldsOnCardToShow');
	const [cardDataOptions, setCardOptions] = useState([]);

	useEffect(() => {
		if (name && flowErrors.name) {
			setFlowErrors(flowErrors => ({ ...flowErrors, name: false }));
		}
	}, [name, setFlowErrors]);

	useEffect(() => {
		if (openPipeDialog === true) {
			reset({ ...selectedPipe, flowLineType: selectedPipe.flowLineType || 'deal' });
		}
	}, [openPipeDialog, reset, selectedPipe]);

	useEffect(() => {
		if (flowLineType) {
			const options = [];
			const optionsArr = flowLineType === 'general' ? generalFlowLine : dealFlowLine;

			fieldsOnCardToShow?.forEach(field => {
				const find = optionsArr.find(item => item.key === field);

				find && options.push({ ...find, isSelected: true });
			});

			const unSelectedOptions = optionsArr.filter(item => !fieldsOnCardToShow?.includes(item.key));
			options.push(...unSelectedOptions);
			setCardOptions(options);
			callCount.current > 0 && setSelectedField([]);
			callCount.current++;
		}
	}, [flowLineType]);

	const setSelectedField = newCardOp => {
		const fields = newCardOp.filter(field => field.isSelected).map(field => field.key);

		setValue('fieldsOnCardToShow', fields);
	};

	const onDragEnd = result => {
		// dropped outside the list || same position
		if (!result.destination || result.destination.index === result.source.index) {
			return;
		}

		const items = reorder(cardDataOptions, result.source.index, result.destination.index);

		setCardOptions(items);
		setSelectedField(items);
	};

	const handleCheckedChange = (e, index) => {
		const newCardDataOptions = [];

		cardDataOptions.forEach((el, key) => {
			newCardDataOptions.push({ ...el, isSelected: key === index ? e.target.checked : el.isSelected });
		});

		setCardOptions(newCardDataOptions);
		setSelectedField(newCardDataOptions);
	};

	return (
		<div className={classes.basicInfoRoot}>
			<Grid container display="flex" alignItems="center" spacing={2}>
				<Grid item xs={12}>
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<h4 className={classes.label}>Flowline Name</h4>
						<Controller
							control={control}
							name="IsDefault"
							render={field => (
								<FormControlLabel
									control={
										<Switch
											{...field}
											checked={!!watch('IsDefault')}
											size="small"
											onChange={({ target }) => setValue('IsDefault', target.checked)}
										/>
									}
									className={classes.switchControl}
									labelPlacement="start"
									label="Set as default"
								/>
							)}
						/>
					</div>
					<Controller
						control={control}
						name="name"
						render={field => (
							<TextField
								{...field}
								margin="dense"
								variant="outlined"
								placeholder="Click to enter flowline name"
								required
								fullWidth
								error={flowErrors.name}
								helperText={flowErrors.name && 'Flowline name is required'}
							/>
						)}
					/>
				</Grid>

				{/* temporarily commenting out until we get further along on flow custom settings and custom detail Card -KC 20210918 */}
				{/* <Grid item xs={12}>
          <h4 className={classes.label}>Project Tie</h4>
          <FormControl variant="outlined" className={classes.formControl}>
            <Controller
              control={control}
              name="projectId"
              render={(field) => (
                <Select {...field} native>
                  <>
                    <option value=""></option>
                    {stateTransact.projects?.map((project, index) => (
                      <Fragment key={index}>
                        <option value={project.projectId}>{project.projectName}</option>
                      </Fragment>
                    ))}
                  </>
                </Select>
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <h4 className={classes.label}>Flow Milestone Date</h4>
          <FormControl variant="outlined" className={classes.formControl}>
            <Controller
              control={control}
              name="milestoneDate"
              render={(field) => (
                <Select {...field} native>
                  <option value=""></option>
                  <option value="expectedClose">Expected Close</option>
                </Select>
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <h4 className={classes.label}>Detail Card Section</h4>
          <FormControl variant="outlined" className={classes.formControl}>
            <Controller
              control={control}
              name="detailCardSection"
              render={(field) => (
                <Select {...field} native>
                  <option value=""></option>
                  <option value="description">Description</option>
                </Select>
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <h4 className={classes.label}>Flow Status</h4>
          <FormControl variant="outlined" className={classes.formControl}>
            <Controller
              control={control}
              name="status"
              render={(field) => (
                <Select {...field} native defaultValue="">
                  <option value=""></option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                  <option value="passed">Passed</option>
                </Select>
              )}
            />
          </FormControl>
        </Grid> */}
				<Grid item xs={12} mt={2}>
					<Controller
						control={control}
						name="flowLineType"
						render={field => (
							<FormControl variant="outlined" fullWidth size="small">
								<InputLabel id="flowLineTypeLabel">Flowline Type</InputLabel>
								<Select
									{...field}
									value={flowLineType || ''}
									labelId="flowLineType"
									id="flowLineType"
									label="Flowline Type"
								>
									<MenuItem value="deal">Deal</MenuItem>
									<MenuItem value="general">General</MenuItem>
								</Select>
							</FormControl>
						)}
					/>
				</Grid>

				<Grid item xs={12}>
					<Grid container spacing={2}>
						<Typography variant="subtitle2" className={classes.titleText}>
							Summary Card Settings
						</Typography>
						<Grid item xs={12}>
							<FormControl variant="outlined" className={classes.formControl}>
								<Controller
									control={control}
									name="showDescription"
									render={field => (
										<FormControlLabel
											control={
												<Switch
													{...field}
													checked={showDescription}
													size="small"
													onChange={({ target }) => setValue('showDescription', target.checked)}
													defaultChecked={
														(openPipeDialog === true && selectedPipe.showDescription !== false) ||
														openPipeDialog !== true
													}
												/>
											}
											label="Show description on card"
											labelPlacement="start"
											className={classes.cardSwitchControl}
										/>
									)}
								/>
							</FormControl>
						</Grid>
						<Grid item xs={12}>
							<FormControl variant="outlined" className={classes.formControl}>
								<Controller
									control={control}
									name="rottenness"
									render={field => (
										<FormControlLabel
											control={
												<Switch
													{...field}
													checked={rottenness}
													size="small"
													onChange={({ target }) => setValue('rottenness', target.checked)}
													defaultChecked={
														(openPipeDialog === true && selectedPipe.rottenness !== false) || openPipeDialog !== true
													}
												/>
											}
											label="Show rotten indicator on card"
											labelPlacement="start"
											className={classes.cardSwitchControl}
										/>
									)}
								/>
							</FormControl>
						</Grid>
					</Grid>
				</Grid>

				<Grid item xs={12}>
					<Typography variant="subtitle2" className={classes.titleText}>
						Card Data Elements (Select up to 4)
					</Typography>
					<div className={classes.cardFieldController}>
						<DragDropContext onDragEnd={onDragEnd}>
							<Droppable droppableId="droppableM1">
								{(provided, snapshot) => (
									<RootRef rootRef={provided.innerRef}>
										<Controller
											control={control}
											name="fieldsOnCardToShow"
											render={field => (
												<Table size="small">
													<TableBody>
														{cardDataOptions.map((fieldObj, index) => {
															const labelId = `checkbox-list-label-${index}`;
															return (
																<Draggable key={labelId} draggableId={labelId} index={index}>
																	{(provided, snapshot) => (
																		<TableRow key={index} ref={provided.innerRef} {...provided.draggableProps}>
																			<TableCell className={classes.tableCell} {...provided.dragHandleProps}>
																				<DragIndicator />
																			</TableCell>
																			<TableCell className={classes.tableCell} align="left" scope="row">
																				{fieldObj.name}
																			</TableCell>
																			<TableCell className={classes.tableCell} align="right">
																				<Checkbox
																					color="primary"
																					checked={fieldObj.isSelected}
																					onChange={e => handleCheckedChange(e, index)}
																					inputProps={{
																						'aria-label': 'secondary checkbox',
																					}}
																				/>
																			</TableCell>
																		</TableRow>
																	)}
																</Draggable>
															);
														})}
													</TableBody>
												</Table>
											)}
										/>
									</RootRef>
								)}
							</Droppable>
						</DragDropContext>
					</div>
				</Grid>
			</Grid>
		</div>
	);
};

export default BasicInfo;
