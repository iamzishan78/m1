import React, { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import {
	CircularProgress,
	Tab,
	Tabs,
	Button,
	Grid,
	Container,
	Box,
	RadioGroup,
	FormControlLabel,
	IconButton,
	FormControl,
	Radio,
} from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CloseSharp from '@material-ui/icons/CloseSharp';
import DoneSharpIcon from '@material-ui/icons/DoneSharp';
import KeyboardTabIcon from '@material-ui/icons/KeyboardTab';
import RemoveSharpIcon from '@material-ui/icons/RemoveSharp';

import { useLazyQuery } from '@apollo/client';

import CampaignField from 'components/ContactDetailCard/components/FieldContent/CampaignField';
import { contactStatusOptions } from 'components/ContactDetailedInfo/helper';
import ContactAutoComplete from 'components/Shared/ContactAutoComplete';
import { copy, setStateIfDeepEqual } from 'components/Shared/functions';
import Tags from 'components/Shared/Tagger';

import { PAGINATEDCONTACTSQUERY } from 'graphQL/useQueryPaginatedContacts';

import { AppContext } from 'AppContext';

import AutocompEntityNamesVirtualizeList from './AutocompEntityNamesVirtualizeList';
import RightDialog from '../../../../ContactDetailCard/components/RightDialog';

const styles = () => ({
	topHeading: { fontWeight: 'bold' },
	loading: { position: 'absolute', left: '250px', bottom: '148px', zIndex: '150' },
	tabs: {
		backgroundColor: 'rgb(20, 171, 223)',
	},
	radio: {
		'& .MuiSvgIcon-root': {
			fill: 'rgb(20, 171, 223) !important',
		},
	},
	fullWidth: {
		width: '100%',
	},
	title: {
		display: 'flex',
		justifyContent: 'space-between',
		width: '100%',
		alignItems: 'center',
		padding: '0px 0px',
		'& svg': {
			fill: '#757575 !important',
		},
	},
	field: {
		marginTop: 30,
		fontSize: '16px',
	},
	tags: {
		marginTop: 20,
		width: '100%',
	},
	bold: {
		fontWeight: 'bold',
	},
});

const useStyles = makeStyles(styles);

const ACTION = Object.freeze({
	SINGLE: 'single',
	COMBINE: 'combine',
});

const TAB = Object.freeze({
	NEW: 0,
	EXISTING: 1,
});

const MultipleOwnerToContactDrawer = ({
	onClose,
	rows,
	setRows,
	getContactCampaignAction,
	convertMultipleOwnerToContactAction,
	campaignList,
	isEntities,
	jobName,
	jobType,
	onSuccess,
}) => {
	const [stateApp] = React.useContext(AppContext);
	const classes = useStyles();

	const [primaryOwner, setPrimaryOwner] = useState(rows[0]);
	const [tab, setTab] = useState(TAB.NEW);
	const [actionType, setActionType] = useState('single');
	const [loading, setLoading] = useState(false);
	const [mongoEntitiesArray, setMongoEntitiesArray] = useState([]);
	const [nameAutValue, setNameAutValue] = useState({ name: '', id: 0, _id: 0 });
	const [nameAutInputValue, NameAutInputValue] = useState('');
	const [hasNextPage, setHasNextPage] = useState(true);
	const [isNextPageLoading, setIsNextPageLoading] = useState(false);
	const [newTagsIds, setNewTagsIds] = useState([]);
	const [campaigns, setCampaigns] = useState([]);

	const { control, getValues, watch } = useForm();

	const contactStatus = watch('contactStatus', contactStatusOptions[0].value);
	const contactOwner = watch('contactOwner', null);
	const userId = stateApp.user.mongoId;

	const [getPaginatedContacts, { data: allContacts, fetchMore: fetchMorePaginatedContacts }] = useLazyQuery(
		PAGINATEDCONTACTSQUERY,
		{
			fetchPolicy: 'cache-and-network',
			nextFetchPolicy: 'cache-first',
		}
	);

	useEffect(() => {
		getContactCampaignAction({
			search: '*',
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (allContacts?.paginatedContacts) {
			setMongoEntitiesArray(allContacts?.paginatedContacts?.edges?.map(el => el.node));
			setHasNextPage(allContacts?.paginatedContacts?.pageInfo?.hasNextPage);
			setIsNextPageLoading(false);
		}
	}, [allContacts]);

	useEffect(() => {
		setIsNextPageLoading(true);
		getPaginatedContacts({ variables: { search: nameAutInputValue } });
	}, [getPaginatedContacts, nameAutInputValue]);

	const setNameAutInputValue = (newState, n, k) => {
		setStateIfDeepEqual(NameAutInputValue, newState);
	};

	const handleTabChange = (event, newValue) => {
		setTab(newValue);
	};

	const loadNextPage = async pageVariables => {
		setIsNextPageLoading(true);
		fetchMorePaginatedContacts(pageVariables);
	};

	const onDelete = row => {
		setRows(rows.filter(r => r.id !== row.id));
	};

	const onConvert = () => {
		let entitiesIds = [];
		let entities = rows.filter(row => row.isEntity);

		if (entities.length > 0) {
			let Ids = entities.filter(row => row.id !== primaryOwner.id);
			Ids.unshift(primaryOwner);
			entitiesIds = Ids.map(id => id._id);
		}

		const autoCalculateOfferPrice = !!stateApp?.user?.features?.find(f => f.name === 'autoCalculateOfferPrice');

		let existingContactId = null;
		let action = actionType;
		if (tab === TAB.EXISTING) {
			existingContactId = nameAutValue._id;
			action = ACTION.COMBINE;
		}

		const selectedRows = copy(rows);

		const index = selectedRows.findIndex(row => row.id === primaryOwner.id);
		if (index > -1) {
			selectedRows[index].isPrimary = true;
		}
		const values = getValues();

		if (entitiesIds.length === 0) {
			convertMultipleOwnerToContactAction({
				...values,
				campaigns,
				rows: selectedRows,
				existingContactId,
				autoCalculateOfferPrice,
				actionType: action,
				userId: userId,
				tags: newTagsIds,
				jobType,
				jobName,
			});
		} else {
			convertMultipleOwnerToContactAction({
				...values,
				campaigns,
				entitiesIds,
				rows: selectedRows,
				existingContactId,
				autoCalculateOfferPrice,
				actionType: action,
				contactOwner,
				userId: userId,
				tags: newTagsIds,
				jobType,
				jobName,
			});
		}
		onClose();
		setLoading(false);
	};

	const setTagId = id => {
		const ids = JSON.parse(JSON.stringify(newTagsIds));
		ids.push(id);
		setNewTagsIds(ids);
	};

	return (
		<RightDialog open={true}>
			<Container maxWidth="sm">
				<div>
					<Box pt={1} pb={3} p={0}>
						<Grid container direction="row" spacing={4} justify="space-between" alignItems="center">
							<Grid item>
								<Typography className={classes.topHeading} variant="h5" component="h2">
									Convert to Contact
								</Typography>
							</Grid>
							<Grid item>
								<IconButton aria-label="delete" color="primary" onClick={onClose}>
									<KeyboardTabIcon />
								</IconButton>
							</Grid>
						</Grid>

						<Box mt={2}>
							<Tabs value={tab} inkBarStyle={classes.tabs} textColor="primary" onChange={handleTabChange}>
								<Tab label="Create New" />
								<Tab label="Add to Existing Contact" />
							</Tabs>
						</Box>

						{tab === TAB.NEW && (
							<Box mt={2}>
								<FormControl component="fieldset">
									<RadioGroup
										aria-label="actionType"
										name="actionType"
										value={actionType}
										onChange={e => setActionType(e.target.value)}
									>
										<FormControlLabel
											value={ACTION.SINGLE}
											control={<Radio className={actionType === ACTION.SINGLE ? classes.radio : ''} />}
											label="Convert selected interest owners to new contacts"
										/>
										<FormControlLabel
											value={ACTION.COMBINE}
											control={<Radio className={actionType === ACTION.COMBINE ? classes.radio : ''} />}
											disabled={rows.length === 1}
											label="Combine selected interest owners into single contact"
										/>
									</RadioGroup>
								</FormControl>
							</Box>
						)}
						{tab === TAB.EXISTING && (
							<Box mt={2}>
								<AutocompEntityNamesVirtualizeList
									mongoEntitiesArray={mongoEntitiesArray}
									setMongoEntitiesArray={setMongoEntitiesArray}
									nameAutValue={nameAutValue}
									setNameAutValue={setNameAutValue}
									nameAutInputValue={nameAutInputValue}
									setNameAutInputValue={setNameAutInputValue}
									variant="outlined"
									label="Contact Name"
									disableClearable
									hasNextPage={hasNextPage}
									isNextPageLoading={isNextPageLoading}
									loadNextPage={loadNextPage}
								/>
							</Box>
						)}

						<Box pt={3}>
							<Typography style={{ fontWeight: 'bold' }}>Interest Owners</Typography>
							<Typography>{rows.length} selected</Typography>
						</Box>
					</Box>

					<Box>
						{rows.map(row => (
							<Grid
								container
								direction="row"
								spacing={2}
								alignItems="center"
								key={row.id}
								justify="space-between"
								display="flex"
							>
								{tab === TAB.NEW && actionType === ACTION.COMBINE && (
									<Grid item md={1}>
										{primaryOwner.id === row.id ? (
											<IconButton>
												<DoneSharpIcon
													fontSize="small"
													style={{ background: '#00af48', color: 'white', borderRadius: 3 }}
												/>
											</IconButton>
										) : (
											<IconButton onClick={() => setPrimaryOwner(row)}>
												<RemoveSharpIcon
													fontSize="small"
													style={{ background: '#f70000', color: 'white', borderRadius: 3 }}
												/>
											</IconButton>
										)}
									</Grid>
								)}

								<Grid item md={tab === TAB.NEW && ACTION.COMBINE ? 10 : 11}>
									<Typography style={{ backgroundColor: '#edfbff' }}>
										<Grid container alignItems="center" style={{ paddingLeft: 10 }}>
											<div style={{ width: '100%' }}>{row.name || row.OwnerName}</div>
											<div>
												{row.StreetAddress || row.address1} {row.City || row.city}, {row.State || row.state},{' '}
												{row.Zip || row.zip}
											</div>
										</Grid>
									</Typography>
								</Grid>

								<Grid item md={1}>
									{rows.length > 1 && (
										<IconButton aria-label="delete" onClick={() => onDelete(row)}>
											<CloseSharp />
										</IconButton>
									)}
								</Grid>
							</Grid>
						))}
					</Box>

					{tab === TAB.NEW && (
						<>
							<div className={classes.field}>
								<label className={classes.bold}>Contact Stage</label>
								<Controller
									control={control}
									name="contactStatus"
									defaultValue={contactStatusOptions[0].value}
									render={props => (
										<Select
											styles={{
												menu: provided => ({ ...provided, zIndex: 9999 }),
											}}
											value={contactStatus}
											menuPlacement="auto"
											onChange={e => {
												props.onChange(e.target.value);
											}}
											className={classes.fullWidth}
											isDisabled={stateApp.selectedMeta}
										>
											<MenuItem value="Lead"> Lead </MenuItem>
											<MenuItem value="Prospect"> Prospect </MenuItem>
											<MenuItem value="Deal Contact"> Contact </MenuItem>
										</Select>
									)}
								/>
							</div>
							<div className={classes.field}>
								<label className={classes.bold}>Contact Owner</label>
								<Controller
									control={control}
									name="contactOwner"
									render={props => (
										<ContactAutoComplete
											value={contactOwner}
											contactValue="email"
											onChange={(e, user) => {
												props.onChange(user.value);
											}}
										/>
									)}
								/>
							</div>
							<div className={classes.field}>
								<label className={classes.bold}>Campaign Names</label>
								<Controller
									control={control}
									name="campaigns"
									render={params => (
										<CampaignField
											{...params}
											value={params.value}
											className={classes.maxWidth}
											onChange={values => {
												params.onChange(values);
												setCampaigns(values.map(val => ({ ...val, id: val._id })));
											}}
											fullWidth
											targetLabel="Shape"
											simpleChips
										/>
									)}
								/>
							</div>
						</>
					)}
					<Box marginTop={3}>
						<Tags
							variant="standard"
							setTagId={setTagId}
							targetLabel="contact"
							targetSourceId="new"
							hidePlusIcon
							shareable={false}
							width="100%"
						/>
					</Box>

					{tab === TAB.EXISTING && nameAutValue && nameAutValue.id === 0 && (
						<Typography style={{ fontWeight: 'bold', color: 'red', marginTop: '40px', marginLeft: '25px' }}>
							** Please select a contact from the dropdown menu **
						</Typography>
					)}

					<Box pt={6} mt={6} mb={6} mr={2}>
						<Grid container direction="row" justify="flex-end" alignItems="flex-end">
							<Grid item>
								<Button onClick={onClose}>Cancel</Button>
							</Grid>
							<Grid item>
								{((tab === TAB.NEW && rows && rows.length > 0) ||
									(tab === TAB.EXISTING && nameAutValue && nameAutValue.id !== 0)) && (
									<Button
										variant="contained"
										component="span"
										disabled={
											(tab === TAB.NEW && rows && rows.length === 0) ||
											(tab === TAB.EXISTING && nameAutValue && nameAutValue.id === 0)
										}
										style={{ backgroundColor: '#00abed', color: 'white' }}
										onClick={onConvert}
									>
										Convert
									</Button>
								)}
							</Grid>
						</Grid>
					</Box>
				</div>
			</Container>

			{loading && (
				<div className={classes.loading}>
					<CircularProgress size={80} disableShrink color="secondary" />
				</div>
			)}
		</RightDialog>
	);
};

export default MultipleOwnerToContactDrawer;
