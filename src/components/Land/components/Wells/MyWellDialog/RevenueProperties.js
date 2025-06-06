import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
	Grid,
	ListItemText,
	makeStyles,
	Divider,
	List,
	ListItem,
	Typography,
	Tooltip,
	InputBase,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	TextField,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import AddIcon from '@material-ui/icons/Add';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SearchIcon from '@material-ui/icons/Search';

import { LinearProgress } from '@mui/material';

import { useLazyQuery, useMutation } from '@apollo/client';

import { UPSERT_WELL_DESCRIPTOR } from 'graphQL/useMutationWellDescriptor';
import { GET_WELL_PROPERTY_INTERESTS } from 'graphQL/useQueryWellDescriptors';

import { statusData } from 'utils/data';

import SearchField from './SearchField';

const propertyInterestParams = [
	{
		type: 'text',
		label: 'Well NRI',
		key: 'interestAmount',
		valueFormatter: (value, key) => {
			return value && value.length > 0 ? (value.length > 1 ? 'MULTIPLE' : value[0][key]) : '';
		},
	},
	{
		type: 'text',
		label: 'Interest Type',
		key: 'interestType',
		valueFormatter: (value, key) => {
			return value && value.length > 0 ? (value.length > 1 ? 'MULTIPLE' : value[0][key]) : '';
		},
	},
	{
		type: 'text',
		label: 'Cost Free',
		key: 'costFree',
		valueFormatter: (value, key) => {
			return value && value.length > 0 ? (value.length > 1 ? 'MULTIPLE' : value[0][key]) : '';
		},
	},
];

const propertyParams = [
	{
		type: 'text',
		label: 'Pay Status',
		key: 'status',
		valueFormatter: value => statusData.find(sd => sd.value === value)?.label ?? value,
	},
	{ type: 'text', label: 'Div Order Status', key: 'divOrderStatus' },
	{ type: 'text', label: 'Internal Company', key: 'internalCompany' },
	{ type: 'text', label: 'Acquisition ID', key: 'acquisitionID' },
	{ type: 'text', label: 'Prospect ID', key: 'prospectID' },
];

const useStyles = makeStyles(theme => ({
	rootPadding: {
		padding: '6px 15px',
	},
	list: {
		overflowY: 'auto',
		maxHeight: '79vh',
		'& .MuiList-padding': {
			padding: '23px 0px !important',
		},
	},
	button: {
		width: '100%',
	},
	actionGrid: {
		margin: '0px 0px 10px 0px',
	},
	search: {
		position: 'relative',
		borderRadius: theme.shape.borderRadius,
		marginLeft: 0,
		marginTop: 5,
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			width: 'auto',
		},
	},
	iconSearch: {
		height: '100%',
		display: 'flex',
		position: 'absolute',
		alignItems: 'center',
		justifyContent: 'center',
		color: 'rgba(121, 121, 121, 0.85)',
		zIndex: 1,
		'&:hover': {
			color: '#fff',
			cursor: 'pointer',
		},
	},
	inputRoot: {
		color: 'inherit',
	},
	inputInput: {
		paddingLeft: `calc(1em + ${theme.spacing(2)}px)`,
		transition: theme.transitions.create('width'),
		width: '100%',

		[theme.breakpoints.up('sm')]: {
			width: '0ch',
			'&:focus': {
				width: '30ch',
				height: '2ch',
			},
		},
	},
	deleteIcon: {
		'& svg': {
			fill: '#c1c5ca',
		},
		'&:hover': {
			'& svg': {
				fill: '#929aa3',
			},
		},
	},
	wellLink: {
		cursor: 'pointer',
		fontSize: '14px',
		margin: 0,
		variant: 'subtitle1',
		color: 'primary',
		'&:hover': {
			fontWeight: '700',
		},
	},
	secondaryText: {
		color: 'grey',
		fontSize: '14px',
		margin: 0,
		padding: 0,
	},
	accordion: {
		'& .MuiIconButton-root': {
			padding: 0,
		},
		'& .MuiInputBase-root.Mui-disabled:before': {
			borderBottom: '1px solid',
		},
	},
}));

const ReveueProperties = ({ platformWell, propertyDescriptor }) => {
	// Initials
	let history = useHistory();
	const classes = useStyles();

	// States
	const [search, setSearch] = useState('');
	const [isSearchActive, setSearchState] = useState(false);
	const [addWell, setAddWell] = useState(false);

	const [upsertWellDescriptor, { loading }] = useMutation(UPSERT_WELL_DESCRIPTOR);

	const handleAddProperty = propertyId => {
		upsertWellDescriptor({
			variables: {
				well: { ...platformWell, Id: platformWell.id, isDeleted: false },
				relatedObject: propertyId,
				relatedObjectType: 'Property',
			},
			refetchQueries: ['getMyWellByGlobalId', 'getWellPropertyInterest'],
			awaitRefetchQueries: true,
		});
	};

	const [getWellPropertyInterest, { data: wellPropertyInterests, loading: propertiesLoading }] =
		useLazyQuery(GET_WELL_PROPERTY_INTERESTS);

	useEffect(() => {
		if (platformWell?._id) {
			getWellPropertyInterest({
				variables: {
					descriptorObject: platformWell._id,
				},
			});
		}
	}, []);

	const properties = wellPropertyInterests?.getWellPropertyInterest?.[0]?.properties;

	return (
		<div style={{ marginRight: '14px' }}>
			<Grid container direction="row" justify="space-between" alignItems="center" className={classes.rootPadding}>
				{!addWell && (
					<React.Fragment>
						{!isSearchActive && (
							<Grid item xs={10}>
								<Typography variant="h6" style={{ fontWeight: 'bold' }}>
									Related Properties
								</Typography>
							</Grid>
						)}
						<Grid item xs={1}>
							<div className={classes.search}>
								<Tooltip
									title="Search"
									className={classes.iconSearch}
									onClick={() => {
										if (!isSearchActive) {
											document.getElementById('searchInputRelatedProperties').focus();
										}
									}}
								>
									<SearchIcon />
								</Tooltip>
								<InputBase
									id="searchInputRelatedProperties"
									autoComplete="off"
									placeholder="Search Wells"
									classes={{
										root: classes.inputRoot,
										input: classes.inputInput,
									}}
									inputProps={{ 'aria-label': 'search' }}
									onFocus={() => setSearchState(true)}
									value={search}
									onBlur={() =>
										setTimeout(() => {
											setSearchState(false);
										}, 300)
									}
									onChange={() => {}}
								/>
							</div>
						</Grid>
					</React.Fragment>
				)}
				{addWell && (
					<Grid item xs={11}>
						{/* <WellSearchApiFieldES getSelectedWell={getSelectedWell} /> */}
						<SearchField
							esIndex="properties_flat"
							fields={['name', '_all']}
							optionsParams={['name', 'internalID']}
							targetLabel="properties"
							onSelectOption={property => handleAddProperty(property._id)}
						/>
					</Grid>
				)}
				<Grid item xs={1}>
					<IconButton
						onClick={() => {
							setAddWell(addWell => !addWell);
							setSearch('');
						}}
					>
						<AddIcon id="addIcon" size="large" />
					</IconButton>
				</Grid>
			</Grid>
			<Divider />
			{(loading || propertiesLoading) && <LinearProgress />}
			<div className={classes.list}>
				<List id="wellsList" aria-label="wells list">
					{properties?.length > 0 ? (
						properties.map(property => (
							<Accordion className={classes.accordion} key={property._id}>
								<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
									<div>
										<Link
											className={classes.wellLink}
											color="primary"
											onClick={event => {
												event.stopPropagation();
												history.push(`/revenue/property/details/${property._id}`);
											}}
										>
											<Typography variant="h6">{property.name}</Typography>
										</Link>
										<p className={classes.secondaryText}>{property.internalID}</p>
									</div>
								</AccordionSummary>
								<AccordionDetails>
									<div>
										{propertyInterestParams.map(param => (
											<React.Fragment key={param.key}>
												<TextField
													margin="dense"
													label={param.label}
													value={param.valueFormatter(propertyDescriptor, param.key)}
													fullWidth
													defaultValue=""
													disabled
												/>
											</React.Fragment>
										))}
										{propertyParams.map(param => (
											<React.Fragment key={param.key}>
												<TextField
													margin="dense"
													label={param.label}
													value={param.valueFormatter ? param.valueFormatter(property[param.key]) : property[param.key]}
													fullWidth
													defaultValue=""
													disabled
												/>
											</React.Fragment>
										))}
									</div>
								</AccordionDetails>
							</Accordion>
						))
					) : (
						<ListItem>
							<ListItemText
								primary={'No related properties found.'}
								primaryTypographyProps={{
									color: 'primary',
								}}
							/>
						</ListItem>
					)}
				</List>
			</div>
		</div>
	);
};

export default ReveueProperties;
