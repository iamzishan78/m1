import React, { useContext, useEffect, useState } from 'react';
import { Controller, useForm, useFieldArray } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import {
	Grid,
	Button,
	FormControl,
	IconButton,
	InputLabel,
	MenuItem,
	Select,
	Popover,
	List,
	ListItem,
	ListItemText,
	ListItemIcon,
} from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import {
	DeleteOutline as DeleteIcon,
	MoreVert as MoreVertIcon,
	Add as AddIcon,
	ExpandMore as ExpandMoreIcon,
} from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import { KeyboardDatePicker } from '@material-ui/pickers';

import { useLazyQuery, useMutation } from '@apollo/client';
import debounce from 'lodash/debounce';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';

import Loader from 'components/Loaders';
import { NavigationContext } from 'components/Navigation/NavigationContext';
import CommentsWithIcon from 'components/Shared/CommentsWithIcon';
import AutoCompleteWithNewOption from 'components/Shared/Forms/Fields/AutoCompleteWithNewOption';
import { copy } from 'components/Shared/functions';

import { CREATE_AGREEMENT_PROVISION } from 'graphQL/useMutationCreateAgreementProvision';
import { GET_PROVISION_AUTOCOMPLETE_LIST } from 'graphQL/useQueryGetProvisionAutoCompleteList';
import { GETMONGOUSERS } from 'graphQL/useQueryGetUsers';

import { detailCardController } from 'stateManagement/detailCardController';

import ResponsibleParty from './ResponsibleParty';
import { AppContext } from '../../../AppContext';

const styles = makeStyles(() => ({
	root: {
		paddingLeft: '10px',
		paddingRight: '10px',
		paddingTop: '8px',
		paddingBottom: '40px',
		'& .MuiFormControl-root': {
			backgroundColor: 'white',
		},
		padding: '15px',
		'& .MuiIconButton-root, & .MuiButtonBase-root': {
			'&:hover': {
				backgroundColor: 'rgba(0, 0, 0, 0.08) !important',
			},
		},
	},
	accordion: {
		border: '3px solid #d9d9d9',
		backgroundColor: '#fcfcfc',
	},
	accordionSummary: {
		padding: '0px 17px !important',
	},
	provisionCard: {
		border: '1px solid #d9d9d9',
		backgroundColor: '#f9f9f9',
		marginBottom: '25px',
	},
	provisionCardSelected: {
		borderLeft: '4px solid #4dc7f4',
	},
	marginNormal: {
		marginTop: '0px',
		marginBottom: '0px',
		'& .MuiIconButton-label': {
			'& .MuiSvgIcon-root': {
				color: '#7f7f7f !important',
				fill: '#7f7f7f !important',
			},
		},
	},
	unchecked: { opacity: 0.5 },
	checked: { opacity: 1 },
	heading: {
		fontWeight: 'bold',
	},
	addDataButton: {
		backgroundColor: 'white',
		color: 'black',
		textTransform: 'capitalize',
		'&:hover': {
			backgroundColor: 'white',
			opacity: 0.15,
		},
	},
	contactCard: {
		'& path': {
			fill: 'grey',
		},
	},
	menuIcon: {
		background: 'transparent',
		align: 'center',
		'& svg': {
			fill: '#808080 !important',
		},
	},
	menu: {
		'& .MuiListItem-gutters': {
			paddingLeft: '10px !important',
			paddingRight: '10px !important',
		},
		'& .MuiListItem-root': {
			'& .MuiListItemIcon-root': {
				minWidth: '25px',
				'& .MuiSvgIcon-root': {
					fill: 'red !important',
				},
			},
		},
	},
}));

export default function ProvisionsTab({ provisions, standardProvisions, id, setPCounts }) {
	const classes = styles();
	let history = useHistory();
	const [stateApp, setStateApp] = useContext(AppContext);
	const [, setStateNav] = useContext(NavigationContext);
	const [users, setUsers] = useState([]);
	const [selectionProvision, setSelectedProvision] = useState('');
	const [frequenciesList, setFrequenciesList] = useState([]);
	const [provisionAutoCompleteList, setProvisionsList] = useState([]);
	const [hoverProvision, setHoverProvision] = useState(-1);
	const [, setAnchorEl] = useState();
	const { control, register, reset, getValues, watch } = useForm();

	const [getProvisionAutoCompleteList, { data: dataProvisionAutoCompleteList }] = useLazyQuery(
		GET_PROVISION_AUTOCOMPLETE_LIST
	);
	const [upsertAgreementProvision] = useMutation(CREATE_AGREEMENT_PROVISION);

	const { fields, append } = useFieldArray({
		control, // control props comes from useForm (optional: if you are using FormContext)
		name: 'provisions', // unique name for your Field Array
		// keyName: "id", default to "id", you can change the key name
	});
	const [getAllMongoUsers, { data: userLists }] = useLazyQuery(GETMONGOUSERS, {
		fetchPolicy: 'cache-and-network',
	});

	useEffect(() => {
		getAllMongoUsers();
		reset({ provisions });
	}, []);

	useEffect(() => {
		getProvisionAutoCompleteList({ variables: { keys: ['type', 'frequency'], agreementId: id } });
	}, []);

	useEffect(() => {
		reset({ provisions });
	}, [provisions]);

	useEffect(() => {
		if (userLists && userLists.allMongoUsers) {
			setUsers(
				userLists.allMongoUsers.map(user => ({
					value: user._id,
					text: user.name,
				}))
			);
		}
	}, [userLists]);

	useEffect(() => {
		if (dataProvisionAutoCompleteList?.provisionAutoCompleteList) {
			dataProvisionAutoCompleteList?.provisionAutoCompleteList.forEach(list => {
				if (list.key === 'type') {
					setProvisionsList(list.list);
				} else if (list.key === 'frequency') {
					setFrequenciesList(
						Array.from(new Set(['Annual', 'Monthly', 'Quarterly', 'Weekly', 'One-Time', ...list.list]))
					);
				}
			});
		}
	}, [dataProvisionAutoCompleteList]);

	useEffect(() => {
		if (setPCounts) {
			setPCounts(fields.length);
		}
	}, [fields.length]);

	const addRemoveProvision = (addProvision, provision) => {
		if (addProvision) {
			setSelectedProvision(provision.type);
			let addProvision = {
				agreement: id,
				type: provision.type,
				isDeleted: false,
				startDate: undefined,
				endDate: undefined,
			};
			if (provision._id) {
				addProvision = {
					...addProvision,
					isTemplate: false,
					applicable: true,
					templateRef: provision._id,
					user: stateApp.user.mongoId,
				};
				Loader.createToast('addRemoveProvision', 'Provision updation in Progress');
				upsertAgreementProvision({
					variables: { provision: { ...addProvision, isDeleted: false } },
					refetchQueries: ['getAgreementProvisions', 'provisionAutoCompleteList'],
				}).then(
					res => {
						Loader.successToast('addRemoveProvision', 'Provision updation Success');
						detailCardController.updateState({
							isStandardProvisionsRefetch: true,
						});
					},
					() => {
						Loader.errorToast('addRemoveProvision', 'Provision updation Failed');
					}
				);
			} else {
				append({ startDate: undefined, endDate: undefined });
			}
		} else {
			Loader.createToast('addRemoveProvision', 'Provision updation in Progress');
			upsertAgreementProvision({
				variables: { provision: { agreement: id, type: provision.type, isDeleted: true } },
				refetchQueries: ['getAgreementProvisions', 'provisionAutoCompleteList'],
			}).then(
				res => {
					Loader.successToast('addRemoveProvision', 'Provision updation Success');
					detailCardController.updateState({
						isStandardProvisionsRefetch: true,
					});
				},
				() => {
					Loader.errorToast('addRemoveProvision', 'Provision updation Failed');
				}
			);
			// remove(fields.findIndex(p => p.type === provision.type))
		}
	};

	const handleChange = debounce((item, index) => {
		const formValues = getValues();
		if (formValues?.provisions && formValues?.provisions[index]) {
			const provision = formValues.provisions[index];
			const assignedOwner = provision.assignedOwner;
			if (assignedOwner && typeof assignedOwner === 'object') {
				provision.assignedOwner = assignedOwner.value;
			}
			if (provision.type) {
				upsertAgreementProvision({
					variables: {
						provision: {
							agreement: id,
							...formValues.provisions[index],
							user: stateApp.user.mongoId,
							isDeleted: false,
						},
					},
					refetchQueries: ['getAgreementProvisions', 'provisionAutoCompleteList'],
				});
			}
		}
	}, 500);

	const getParty = item => {
		return item?.parties && item?.parties[0] ? item?.parties[0] : item?.parties;
	};
	const getCurrentParty = index => {
		const formValues = copy(getValues());
		if (formValues?.provisions) {
			const item = formValues?.provisions[index];
			const parties = item?.parties && item?.parties[0] ? item?.parties[0] : item?.parties;
			return parties && parties?._id ? parties : parties && parties[0]?._id ? parties[0] : null;
		}
	};

	return (
		<Grid container direction="column" spacing={5} className={classes.root}>
			<Grid item>
				<Accordion className={classes.accordion} defaultExpanded={true}>
					<AccordionSummary
						expandIcon={<ExpandMoreIcon />}
						aria-controls="panel1a-content"
						id="panel1a-header"
						className={classes.accordionSummary}
					>
						<Typography className={classes.heading}>Standard Provisions</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Grid container direction="row">
							{standardProvisions?.map(provision => {
								const isFound = !!fields.find(p => p.type === provision.type);
								return (
									<Grid item md={4}>
										<FormControlLabel
											className={isFound ? classes.checked : classes.unchecked}
											control={
												<Checkbox
													id={provision.type}
													checked={isFound}
													color="default"
													onChange={e => {
														addRemoveProvision(e.target.checked, provision);
													}}
													inputProps={{ 'aria-label': provision.type }}
												/>
											}
											label={provision.type}
										/>
									</Grid>
								);
							})}
						</Grid>
					</AccordionDetails>
				</Accordion>
			</Grid>
			<Grid item>
				{fields.map((item, index) => {
					const currentParty = getCurrentParty(index);
					return (
						<Grid
							key={item.id}
							container
							direction="column"
							spacing={2}
							className={`${classes.provisionCard} ${selectionProvision === item.type ? classes.provisionCardSelected : ''}`}
							onClick={() => setSelectedProvision(item.type)}
							onMouseEnter={() => setHoverProvision(index)}
							onMouseLeave={() => setHoverProvision(-1)}
						>
							<Grid item>
								<Grid container direction="row" spacing={2}>
									<TextField
										id="_id"
										name={`provisions[${index}]._id`}
										type={'hidden'}
										inputRef={register()}
										defaultValue={item._id}
									/>
									<TextField
										id="templateRef"
										name={`provisions[${index}].templateRef`}
										type={'hidden'}
										inputRef={register()}
										defaultValue={item.templateRef}
									/>
									<Grid item md={4}>
										<Controller
											control={control}
											name={`provisions[${index}].type`}
											defaultValue={item.type}
											render={({ onChange, value, ref }) => (
												<>
													{item.templateRef ? (
														<FormControl variant="outlined" fullWidth>
															<InputLabel id="provision-type-label">Provision Type</InputLabel>
															<Select
																labelId="provision-type-label"
																id={`provision-type-label-${index}`}
																label="Provision Type"
																onChange={value => {
																	onChange(value);
																	handleChange(item, index);
																}}
																inputRef={ref}
																disabled={provisions[index]?.isTemplate === false}
																value={value}
															>
																{standardProvisions?.map(p => (
																	<MenuItem value={p.type}>{p.type}</MenuItem>
																))}
															</Select>
														</FormControl>
													) : (
														<AutoCompleteWithNewOption
															variant="outlined"
															id="provisionType"
															label="Provision Type"
															options={provisionAutoCompleteList}
															value={value}
															onChange={(_, value) => {
																if (value) {
																	onChange(value.name);
																}
																handleChange(item, index);
															}}
														/>
													)}
												</>
											)}
										/>
									</Grid>
									<Grid id={`applicable-${index}`} item md={2}>
										<Controller
											control={control}
											name={`provisions[${index}].applicable`}
											defaultValue={item.applicable}
											render={({ onChange, value, ref }) => (
												<FormControl variant="outlined" fullWidth>
													<InputLabel id="applicable-label">Applicable</InputLabel>
													<Select
														labelId="applicable-label"
														id="applicable-label"
														label="Applicable"
														onChange={value => {
															onChange(value);
															handleChange(item, index);
														}}
														inputRef={ref}
														value={value}
													>
														<MenuItem id="menuItemYes" value={true}>
															Yes
														</MenuItem>
														<MenuItem value={false}>No</MenuItem>
													</Select>
												</FormControl>
											)}
										/>
									</Grid>
									<Grid item md={6}>
										<FormControl variant="outlined" fullWidth>
											<TextField
												fullWidth
												id={`provision-value-${index}`}
												label="Provision Value"
												variant="outlined"
												name={`provisions[${index}].value`}
												inputRef={register()}
												defaultValue={item.value}
												onBlur={() => handleChange(item, index)}
											/>
										</FormControl>
									</Grid>
								</Grid>
							</Grid>

							<Grid item>
								<Grid container direction="row" spacing={2}>
									<Grid item md={2}>
										<Controller
											control={control}
											name={`provisions[${index}].startDate`}
											render={({ onChange, value, ref }) => (
												<KeyboardDatePicker
													className={classes.marginNormal}
													disableToolbar
													fullWidth
													label={'Start Date'}
													inputVariant="outlined"
													variant="inline"
													format="MM/DD/YYYY"
													margin="normal"
													id={`start-date-picker-${index}`}
													ref={ref}
													value={value || null}
													onChange={date => {
														onChange(date);
														handleChange(item, index);
													}}
													KeyboardButtonProps={{ 'aria-label': 'change date' }}
												/>
											)}
										/>
									</Grid>
									<Grid item md={2}>
										<Controller
											control={control}
											name={`provisions[${index}].endDate`}
											render={({ onChange, value, ref }) => (
												<KeyboardDatePicker
													className={classes.marginNormal}
													disableToolbar
													fullWidth
													minDate={watch(`provisions[${index}].startDate`)}
													label={'End Date'}
													inputVariant="outlined"
													variant="inline"
													format="MM/DD/YYYY"
													margin="normal"
													id={`last-date-picker-${index}`}
													ref={ref}
													value={value || null}
													onChange={date => {
														onChange(date);
														handleChange(item, index);
													}}
													KeyboardButtonProps={{ 'aria-label': 'change date' }}
												/>
											)}
										/>
									</Grid>

									<Grid item md={2} id={`frequency-${index}`}>
										<Controller
											control={control}
											name={`provisions[${index}].frequency`}
											defaultValue={item.frequency}
											render={({ onChange, value, ref }) => (
												<AutoCompleteWithNewOption
													variant="outlined"
													label="Frequency"
													options={frequenciesList}
													value={value}
													onChange={(_, value) => {
														onChange(value?.name ?? '');
														handleChange(item, index);
													}}
												/>
											)}
										/>
									</Grid>
									<Grid item md={2} id={`responsibleParty-${index}`}>
										<Controller
											control={control}
											name={`provisions[${index}].responsibleParty`}
											defaultValue={item?.responsibleParty?.name}
											render={props => (
												<ResponsibleParty
													value={props.value}
													handleChange={value => {
														handleChange(item, index);
														props.onChange(value?.name || null);
													}}
												/>
											)}
										/>
									</Grid>
									<Grid item md={2} id={`provisions-${index}`}>
										<Controller
											control={control}
											name={`provisions[${index}].ownerId`}
											render={params => (
												<Autocomplete
													options={users.filter(u => u.text)}
													onChange={(e, user) => {
														const value = user?.value || null;
														params.onChange(value);
														handleChange(item, index);
													}}
													value={users.find(user => user.value === params.value) || null}
													getOptionLabel={option => option.text}
													getOptionSelected={option => option.value === item.ownerId}
													renderInput={params => <TextField {...params} variant="outlined" label="Assigned To" />}
												/>
											)}
										/>
									</Grid>
									<Grid item md={2} style={{ height: '0px' }}>
										<CommentsWithIcon objectId={item._id} targetLabel={'provision'} iconZiseSmall />
										<PopupState variant="popover" popupId={`party-${index}-popover`}>
											{popupState => (
												<>
													<IconButton
														style={{ visibility: hoverProvision === index ? 'visible' : 'hidden' }}
														aria-controls={`party${index}Menu`}
														aria-haspopup="true"
														className={classes.menuIcon}
														onClick={event => setAnchorEl(event.currentTarget)}
														{...bindTrigger(popupState)}
													>
														<MoreVertIcon size="medium" id="moreVertIconProvision" />
													</IconButton>
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
													>
														<List className={classes.menu}>
															<ListItem
																button
																onClick={() => {
																	addRemoveProvision(false, item);
																	popupState.close();
																}}
															>
																<ListItemIcon>
																	<DeleteIcon size="medium" />
																</ListItemIcon>
																<ListItemText id="deleteProvision">Delete Provision/Obligation</ListItemText>
															</ListItem>
														</List>
													</Popover>
												</>
											)}
										</PopupState>
									</Grid>
								</Grid>
							</Grid>

							<Grid item>
								<TextField
									id={`provisionDescription-${index}`}
									label="Full Description"
									variant="outlined"
									fullWidth
									multiline
									rows={4}
									name={`provisions[${index}].description`}
									inputRef={register()}
									defaultValue={item.description}
									onBlur={() => handleChange(item, index)}
								/>
							</Grid>
						</Grid>
					);
				})}
				<Grid item>
					<Button
						id="addProvisionButton"
						variant="contained"
						onClick={() => {
							addRemoveProvision(true, {});
						}}
						color="primary"
						component="span"
						className={classes.addDataButton}
						startIcon={<AddIcon />}
					>
						Add another provision
					</Button>
				</Grid>
			</Grid>
		</Grid>
	);
}
