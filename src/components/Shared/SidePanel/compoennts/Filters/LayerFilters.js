import React, { useCallback, useContext, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import {
	Typography,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Grid,
	Chip,
	IconButton,
	ListItemText,
	Button,
} from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon, Close as ClearButton } from '@material-ui/icons';

// Contexts
import { NavigationContext } from 'components/Navigation/NavigationContext';
//Components
import * as LayerFiltersComponents from 'components/Shared/SidePanel/compoennts/Filters';
import { layerFiltersController } from 'hookstate/layerFiltersController';
import { navController } from 'hookstate/navStateController';
import { StyledListItemSecondaryAction, StyledMenuSecondaryHeaderItem } from '../style';
import UserMapFilter from './UserMapFilter';
import { globalStateController } from 'hookstate/globalStateController';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';

const useStyles = makeStyles(() => ({
	root: {
		backgroundColor: '#0e111a',
		height: 'calc(100vh - 172px)',
		fontFamily: 'Poppins',
		display: 'block',
		color: 'white',
		padding: '0px 10px',
		overflow: 'overlay',
	},
	accordionRoot: {
		borderRadius: '5px',
		backgroundColor: '#1a253c',
		color: '#fff',
		margin: '10px 0px',
		'& .MuiButtonBase-root.MuiAccordionSummary-root': {
			maxHeight: '50px',
			minHeight: '50px',
			'& .MuiAccordionSummary-expandIcon': {
				color: '#fff',
			},
		},
		'&.MuiAccordion-root.Mui-expanded': {
			margin: 0,
		},
	},
	accordionDetails: {
		backgroundColor: '#101d29',
		padding: 0,
		// overridding the default text fields colors
		'& svg': {
			fill: 'white',
		},
		'& label': {
			color: 'white',
		},
		'& label.Mui-focused': {
			color: 'white',
		},
		'& label.Mui-disabled': {
			color: '#adadad',
		},
		'& input': {
			color: 'white !important',
		},
		'& .MuiInputBase-adornedStart:before': {
			borderBottomColor: 'white',
		},
		'& .MuiInputBase-adornedStart:after': {
			borderBottomColor: 'white',
		},
		'& .MuiInput-underline:before': {
			borderBottomColor: 'white',
		},
		'& .MuiInput-underline:after': {
			borderBottomColor: 'white',
		},
		'& .MuiOutlinedInput-root': {
			color: 'white',
			'& fieldset': {
				borderColor: 'white',
			},
			'&:hover fieldset': {
				borderColor: 'white',
			},
			'&.Mui-focused fieldset': {
				borderColor: 'white',
			},
			'&.Mui-disabled fieldset': {
				borderColor: '#adadad',
			},
			'&.Mui-disabled svg': {
				fill: '#adadad !important',
			},
		},
	},
	accordionHeading: {
		display: 'flex',
		alignItems: 'center',
		'& .MuiChip-root': {
			height: '22px !important',
			borderRadius: '3px !important',
			backgroundColor: '#18aadd',
		},
	},
	clearIcon: {
		'& .MuiButtonBase-root': {
			color: 'grey',
		},
	},
}));

const geoFiltersParams = [
	'filterAOI',
	'filterParcel',
	'filterBasin',
	'stateName',
	'countyName',
	'gridId1',
	'gridId2',
	'gridId3',
	'gridId4',
	'gridId5',
];
const prodFiltersParams = ['prodOptions'];
const wellFiltersParams = [
	'operatorName',
	'typeName',
	'profileName',
	'statusName',
	'primaryFormationName',
	'playName',
	'fieldName',
	'filterTVD',
	'measuredDistanceWell',
	'lateralLengthWell',
	'filterPermitDateRange',
	'filterSpudDateRange',
	'filterCompletetionDateRange',
	'filterFirstProdDateRange',
];
const ownershipFiltersParams = [
	'interestName',
	'ownerTypeName',
	'filterOwnerCount',
	'filterHasOwnerCount',
	'filterOwnerConfidence',
];
const tagFiltersParams = ['selectedTags'];
const filterTypes = {
	Geography: { component: 'GeographyFilter', countKey: 'geographyFilterCount' },
	Wells: { component: 'WellFilter', countKey: 'wellFilterCount' },
	// Production: { component: "ProductionFilter", countKey: "productionFilterCount" },
	// Ownership: { component: "OwnershipFilter", countKey: "ownershipFilterCount" },
	// Tags: { component: "TagsFilter", countKey: "tagFilterCount" },
};

const LayerFilters = () => {
	const classes = useStyles();
	const [stateNav, setStateNav] = useContext(NavigationContext);

	const { navStateValues } = navController.useState(['geographyFilterCount', 'wellFilterCount'], 'navStateValues');
	const { mapStateValues } = globalStateController.useState(['mapView'], 'mapStateValues');

	const formMethods = useForm({
		defaultValues: {
			mapViews: [],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: formMethods.control,
		name: 'mapViews', // This refers to the array in the form's state
	});

	// Memoize resetForm to avoid unnecessary re-creation
	const resetForm = useCallback(
		values => {
			formMethods.reset(values);
		},
		[formMethods]
	);

	useEffect(() => {
		const selectedMapView = mapStateValues?.mapView?.selectedMapView;

		if (selectedMapView) {
			resetForm({
				mapViews: selectedMapView?.filters || [],
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mapStateValues?.mapView?.selectedMapView]);

	const resetFilters = (params, additionalParamsToReset = {}) => {
		const geoFiltersToReset = {};
		params.forEach(param => {
			if (!Array.isArray(stateNav[param]) && stateNav[param]) geoFiltersToReset[param] = null;
			else if (Array.isArray(stateNav[param]) && stateNav[param].length > 0) {
				geoFiltersToReset[param] = [];
			}
		});
		setStateNav(stateNav => ({
			...stateNav,
			...geoFiltersToReset,
			...additionalParamsToReset,
		}));
	};

	const clearFilters = filterType => {
		switch (filterType) {
			case 'Geography':
				navController.clearGeographyFilters();
				resetFilters(geoFiltersParams);
				break;
			case 'Wells':
				layerFiltersController.clearWellsFilters();
				resetFilters(wellFiltersParams, {
					filterOperator: null,
					filterWellType: null,
					filterWellProfile: null,
					filterWellStatus: null,
					filterPrimaryFormation: null,
					filterPlay: null,
					filterField: null,
					tvdWell: null,
					filterLateralLength: null,
					filterMeasuredDistance: null,
				});
				break;
			case 'Production':
				resetFilters(prodFiltersParams);
				break;
			case 'Ownership':
				resetFilters(ownershipFiltersParams, {
					filterAllInterestTypes: null,
					filterAllOwnershipTypes: null,
					ownerCountWell: null,
					ownerConfidenceWell: null,
				});
				break;
			case 'Tags':
				resetFilters(tagFiltersParams);
				break;
			default:
		}
	};

	return (
		<>
			<div className={classes.root}>
				{Object.keys(filterTypes).map((filterType, index) => (
					<Accordion className={classes.accordionRoot}>
						<AccordionSummary
							aria-controls="panel1a-content"
							id="panel1a-header"
							expandIcon={<ExpandMoreIcon />}
							defaultExpanded={index === 0}
							style={{
								borderLeft: navStateValues[filterTypes[filterType].countKey] > 0 ? '5px solid #18aadd' : 'transparent',
							}}
						>
							<Grid container direction="row" justify="space-between" alignItems="center">
								<Grid item className={classes.accordionHeading}>
									<Typography style={{ padding: '15px 5px' }}>{filterType}</Typography>
									{navStateValues[filterTypes[filterType].countKey] > 0 && (
										<Chip color="info" label={navStateValues[filterTypes[filterType].countKey]} />
									)}
								</Grid>
								<Grid item className={classes.clearIcon}>
									<IconButton
										size="small"
										onClick={event => {
											event.stopPropagation();
											clearFilters(filterType);
										}}
									>
										<ClearButton />
									</IconButton>
								</Grid>
							</Grid>
						</AccordionSummary>
						<AccordionDetails className={classes.accordionDetails}>
							{LayerFiltersComponents[filterTypes[filterType].component]()}
						</AccordionDetails>
					</Accordion>
				))}
				<FormProvider {...formMethods}>
					<div style={{ marginTop: '50px' }}>
						<StyledMenuSecondaryHeaderItem>
							<ListItemText primary={'User Defined Data'} />
							<StyledListItemSecondaryAction>
								<Button
									type="button"
									id="managerButton"
									onClick={() => append({})}
									color="secondary"
									variant="outlined"
								>
									+ Add Filter
								</Button>
							</StyledListItemSecondaryAction>
						</StyledMenuSecondaryHeaderItem>
						{fields.map((mapView, index) => (
							<UserMapFilter key={mapView.id} mapView={mapView} index={index} remove={remove} />
						))}
					</div>
				</FormProvider>
			</div>
		</>
	);
};

export default LayerFilters;
