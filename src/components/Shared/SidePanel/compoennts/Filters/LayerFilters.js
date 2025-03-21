import React, { useCallback, useContext, useEffect } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';

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
import { makeStyles } from '@material-ui/core/styles';
import { ExpandMore as ExpandMoreIcon, Close as ClearButton } from '@material-ui/icons';

import { viewStateController } from 'components/MRTTable/Common/GridView/ViewController';
import { NavigationContext } from 'components/Navigation/NavigationContext';
import * as LayerFiltersComponents from 'components/Shared/SidePanel/compoennts/Filters';

import { globalStateController } from 'stateManagement/globalStateController';
import { layerFiltersController } from 'stateManagement/layerFiltersController';
import { layerController } from 'stateManagement/layerStateController';
import { navController } from 'stateManagement/navStateController';

import { StyledListItemSecondaryAction, StyledMenuSecondaryHeaderItem } from '../style';
import { customLayersFieldAccessors } from './consts';
import UserMapFilter from './UserMapFilter';

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
	// Wells: { component: 'WellFilter', countKey: 'wellFilterCount' },
	// Production: { component: "ProductionFilter", countKey: "productionFilterCount" },
	// Ownership: { component: "OwnershipFilter", countKey: "ownershipFilterCount" },
	// Tags: { component: "TagsFilter", countKey: "tagFilterCount" },
};

const LayerFilters = () => {
	const classes = useStyles();
	const [stateNav, setStateNav] = useContext(NavigationContext);

	const {
		stateValues: { selectedView, shouldSyncView },
	} = viewStateController('MapView').useState(['selectedView', 'shouldSyncView']);
	const { navStateValues } = navController.useState(['geographyFilterCount', 'wellFilterCount'], 'navStateValues');
	const layers = layerController.getValue('layers');

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
		if (selectedView) {
			resetForm({
				mapViews: selectedView?.filters || [],
			});
		}
	}, []);

	useEffect(() => {
		if (shouldSyncView === false) {
			return;
		}

		if (selectedView) {
			resetForm({
				mapViews: selectedView?.filters || [],
			});
			viewStateController('MapView').updateState({
				shouldSyncView: false,
			});
		}
	}, [shouldSyncView]);

	const resetFilters = (params, additionalParamsToReset = {}) => {
		const geoFiltersToReset = {};
		params.forEach(param => {
			if (!Array.isArray(stateNav[param]) && stateNav[param]) {
				geoFiltersToReset[param] = null;
			} else if (Array.isArray(stateNav[param]) && stateNav[param].length > 0) {
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
					<Accordion className={classes.accordionRoot} key={filterType}>
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
						<StyledMenuSecondaryHeaderItem disableRipple>
							<ListItemText primary={'User Defined Data'} />
							<StyledListItemSecondaryAction>
								<Button
									type="button"
									id="managerButton"
									onClick={() =>
										append({
											dataSourceName: null,
											fieldName: null,
											filterType: null,
											filterValues: null,
										})
									}
									color="secondary"
									variant="outlined"
								>
									+ Add Filter
								</Button>
							</StyledListItemSecondaryAction>
						</StyledMenuSecondaryHeaderItem>
						{fields.map((mapView, index) => {
							// Check if mapView has a valid dataSourceName and if it's a string
							if (mapView?.dataSourceName && typeof mapView?.dataSourceName === 'string') {
								// Extract fileId and layerIdentifier from dataSourceName
								const fileId = mapView?.dataSourceName?.substring(0, mapView?.dataSourceName?.indexOf('_'));
								const layerIdentifier = mapView?.dataSourceName?.substring(mapView?.dataSourceName?.indexOf('_') + 1);

								// Find the corresponding layer in the layers array
								const layer = layers.find(l => l.file === fileId && l.layerIdentifier === layerIdentifier);

								// Skip rendering if no custom layers field accessor or no matching layer found
								if (!customLayersFieldAccessors[mapView?.dataSourceName] && !layer) {
									return null;
								}
							}

							// Render the UserMapFilter component if the checks pass
							return (
								<UserMapFilter key={mapView.id} mapView={mapView} index={index} remove={remove} resetForm={resetForm} />
							);
						})}
					</div>
				</FormProvider>
			</div>
		</>
	);
};

export default LayerFilters;
