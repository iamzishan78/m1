import React, { useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { Box, Grid, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Close as ClearButton } from '@material-ui/icons';

import { useLazyQuery } from '@apollo/client';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types'; // Import PropTypes for prop validation

import { generateFileFilters } from 'components/Map/DeckGL/helpers/common';
import { viewStateController } from 'components/MRTTable/Common/GridView/ViewController';
import { stringFilterOptions, tableESSimpleFilterModes, searchFilterOptions } from 'components/MRTTable/utils/data';

import { GET_DB_FILTERS } from 'graphQL/useQueryDbQuery';

import { globalStateController } from 'hookstate/globalStateController';
import { tableESState } from 'hookstate/initialStates';
import { layerFiltersController } from 'hookstate/layerFiltersController';
import { tableController } from 'hookstate/tableController';

import { customLayersFieldAccessors } from './consts';
import CustomAutocomplete from './CustomAutocomplete';

const TWO = 2;
const FIVE_HUNDRED = 500;
const FIFTEEN_HUNDRED = 1500;

// Define custom styles using Material-UI's makeStyles hook
const useStyles = makeStyles(theme => ({
	container: {
		backgroundColor: '#182B4D', // Dark blue background for the container
		padding: theme.spacing(TWO),
		width: '100%',
		borderRadius: theme.shape.borderRadius,
		borderLeft: '5px solid #0E638D', // Left border with a blue accent
		position: 'relative',
		color: 'white',
		minHeight: '400px', // Fixed height for the filter container
	},
	autoComplete: {
		marginBottom: '25px', // Margin for spacing between autocomplete fields
		// White styles for input and label elements to match dark background
		'& .MuiInputBase-input': { color: 'white' },
		'& .MuiInput-underline:before': { borderBottom: '1px solid white' },
		'& .MuiInput-underline:hover:before': { borderBottom: '2px solid white' },
		'& .MuiInput-underline:after': { borderBottom: '2px solid white' },
		'& .MuiFormLabel-root': { color: 'white' },
		'& .MuiFormLabel-root.Mui-focused': { color: 'white' },
		'& .MuiSvgIcon-root': { color: 'white' },
	},
	iconButton: {
		display: 'flex',
		width: '100%',
		justifyContent: 'flex-end', // Aligns the clear button to the right
		color: 'white',
	},
	clearIcon: {
		'& .MuiButtonBase-root': { color: 'grey' }, // Styles for the clear button icon
	},
}));

// Function to format filter values based on the filter type
export const getFormattedFilterBasedOnType = (filterType, fieldName, filterValues) => {
	// Normalize filterType if it's an object
	const normalizedFilterType = filterType?.value || filterType;

	let filterValue;

	switch (normalizedFilterType) {
		case 'multiselect':
			return {
				field: fieldName?.value || fieldName,
				value: filterValues || [],
				isMapViewFilter: true,
				searchType: normalizedFilterType,
			};
		case 'empty':
		case 'notEmpty':
			filterValue = ' '; // empty value for empty/notEmpty filters
			break;
		case 'date':
			filterValue = {
				gte: filterValues?.gte || '1970-01-01',
				lte: filterValues?.lte || moment().format('YYYY-MM-DD'),
			};
			break;
		case 'range':
			filterValue = [filterValues?.[0], filterValues?.[1]];
			break;
		default:
			filterValue = typeof filterValues === 'string' ? filterValues : filterValues?.[0];
			break;
	}

	// Construct the final filter object
	const baseFilter = {
		field: fieldName?.value || fieldName,
		value: filterValue,
		isMapViewFilter: true,
		searchType: normalizedFilterType,
	};

	// Additional properties based on filter type
	switch (normalizedFilterType) {
		case 'singleselect':
			return baseFilter;
		case 'date':
			return {
				...baseFilter,
				columnType: 'date',
				type: 'advanced',
				searchType: 'betweenInclusive',
			};
		case 'range':
			return {
				...baseFilter,
				type: 'advanced',
				searchType: 'betweenInclusive',
			};
		default:
			return {
				...baseFilter,
				type: 'advanced',
				columnType: 'string',
			};
	}
};

const UserMapFilter = ({ mapView, index, remove, resetForm }) => {
	const classes = useStyles(); // Apply custom styles
	const { control, setValue, watch } = useFormContext(); // Get form control methods

	const [searchText, setSearchText] = useState('');

	const debouncedSetSearchText = useMemo(() => {
		return _.debounce(value => {
			setSearchText(value);
			// Perform your search or API call here
		}, FIVE_HUNDRED); // Adjust delay as needed
	}, []);

	const handleChange = e => {
		debouncedSetSearchText(e?.target?.value || '');
	};
	// Lazy query to fetch filter list from the GraphQL API when required
	const [getFiltersList, { data: filtersData }] = useLazyQuery(GET_DB_FILTERS, { fetchPolicy: 'no-cache' });

	// Watch form fields to dynamically react to their values
	const dataSourceNameField = watch(`mapViews.${index}.dataSourceName`);
	const dataSourceName = dataSourceNameField?.value || dataSourceNameField;
	const fieldName = watch(`mapViews.${index}.fieldName`);
	const filterValues = watch(`mapViews.${index}.filterValues`);
	const filterType = watch(`mapViews.${index}.filterType`);

	const mapViews = watch('mapViews');

	const layers = globalStateController.getValue('layers');

	const [debouncedFilterValues, setDebouncedFilterValues] = useState(filterValues); // New state for debounced filter values

	// Debounce the filter values
	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedFilterValues(filterValues);
		}, FIFTEEN_HUNDRED); // Delay of 1500ms

		// Cleanup function to clear the timeout
		return () => {
			clearTimeout(handler);
		};
	}, [filterValues]);

	const getSelectedField = (fieldName, _dataSource) => {
		const fileId = dataSourceName?.substring(0, dataSourceName.indexOf('_'));
		const layerShapeName = dataSourceName?.substring(dataSourceName.indexOf('_') + 1);
		const layer = layers.find(l => l.file === fileId && l.layerShapeName === layerShapeName);
		return (
			customLayersFieldAccessors[_dataSource || mapView?.dataSourceName || dataSourceName]?.keys || layer?.layerSchema
		)?.find(key => key.value.replace('.keyword', '') === fieldName || key?.value === fieldName);
	};

	const getMapViewFilters = () => {
		return mapViews?.map(mapView => {
			const isMultiSelect = mapView.filterType?.value === 'multiselect';
			const isString = typeof mapView.filterValues === 'string';
			const selectedField = getSelectedField(
				mapView?.fieldName?.value || mapView?.fieldName,
				mapView?.dataSourceName?.value || mapView?.dataSourceName
			);

			let _filterType = selectedField?.type || mapView.filterType;

			return {
				dataSourceName: mapView?.dataSourceName?.value || mapView?.dataSourceName,
				filterType: _filterType?.value || _filterType,
				fieldName: mapView?.fieldName?.value || mapView?.fieldName,
				filterValues: isMultiSelect
					? mapView.filterValues && isString
						? [mapView.filterValues]
						: mapView.filterValues
					: _filterType === 'date' && !mapView.filterValues
						? {
								gte: '1970-01-01',
								lte: moment().format('YYYY-MM-DD'),
							}
						: mapView.filterValues,
			};
		});
	};

	const getLayerTypeAndFilters = dataSourceName => {
		let esIndex,
			filters = [],
			search = { fields: [] };
		const layerType = customLayersFieldAccessors[dataSourceName]?.layerKey?.toLowerCase(); // Get the layer type

		// Determine the filters based on the layer type

		if (layerType === 'agreement') {
			esIndex = 'shapes_flat';
			filters = [{ field: 'shapeJson.properties.type.keyword', value: 'agreement' }];
		} else if (layerType === 'wells') {
			esIndex = 'mywells_flat';
			filters = [];
		} else if (layerType === 'parcel' || layerType === 'unit') {
			esIndex = 'shapes_flat';
			filters = [{ field: 'layer.keyword', value: layerType }];
		} else if (layerType === 'platformdata:wells') {
			esIndex = 'platformData:wells';
		} else {
			esIndex = 'shapefile_flat';
			const fileId = dataSourceName?.substring(0, dataSourceName.indexOf('_'));
			const layerShapeName = dataSourceName?.substring(dataSourceName.indexOf('_') + 1);
			const selectedLayer = globalStateController
				.getValue('layers')
				?.find(layer => layer?.layerShapeName === layerShapeName && layer?.file === fileId);
			filters = selectedLayer ? generateFileFilters({ fileLayer: selectedLayer }).variables.filters : [];
			search = selectedLayer ? generateFileFilters({ fileLayer: selectedLayer }).variables.search : {};
			search.fields = [];
		}
		return { esIndex, filters, search };
	};

	// Effect to trigger data fetching based on the selected data source and field name
	useEffect(() => {
		if (!(dataSourceName && fieldName)) {
			return;
		}

		const { esIndex, filters, search } = getLayerTypeAndFilters(dataSourceName);

		// Execute the lazy query to fetch filter options
		getFiltersList({
			variables: {
				search,
				filterAggs: {
					field: fieldName?.value,
					query: searchText ? `*${searchText}*` : '',
					size: 50,
				},
				esIndex,
				index: esIndex,
				filters,
				pagination: { first: 10000, after: null },
				size: 10,
			},
		});
	}, [dataSourceName, fieldName, searchText, getFiltersList]); // Dependencies trigger re-run when they change

	// Effect to log filter values when they change
	useEffect(() => {
		if (dataSourceName) {
			const selectedMapView = viewStateController('MapView').getValue('selectedView');

			const selectedField = getSelectedField(fieldName?.value || fieldName);

			const canUpdateMapView =
				dataSourceName && selectedField?.value && (filterType || ['date', 'range'].includes(selectedField?.type));

			const mapViewFilters = getMapViewFilters();
			// Upsert the map view data to the GraphQL API
			if (canUpdateMapView) {
				const tableKey = Object.keys(tableESState).find(key => {
					const tableState = tableESState[key].get({ noproxy: true });
					return tableState?.layerIdentifier === dataSourceName;
				});
				const tableState = tableESState[tableKey]?.get({ noproxy: true });

				const formattedFilter = getFormattedFilterBasedOnType(
					selectedField?.type || filterType,
					selectedField?.value?.replace('.keyword', ''),
					filterValues
				);

				const isFilterApplied = tableState?.filters?.find(
					filter =>
						formattedFilter?.field?.replace('.keyword', '') === filter?.field?.replace('.keyword', '') &&
						(formattedFilter?.searchType === 'multiselect' || formattedFilter?.searchType === filter.searchType) &&
						_.isEqual(formattedFilter?.value, filter.value)
				);

				if (!isFilterApplied && tableKey) {
					if (!formattedFilter?.value || formattedFilter?.value?.length === 0) {
						tableController(tableKey).clearFilter((fieldName?.value || fieldName)?.replace('.keyword', ''), false);
					} else {
						tableController(tableKey).setShowColumnFilters(true);
						tableController(tableKey).setFilterMode(
							formattedFilter?.field?.replace('.keyword', ''),
							formattedFilter?.searchType
						);
						tableController(tableKey).setFilter(formattedFilter);
					}
				}

				if (!tableKey) {
					viewStateController('MapView').updateState({
						selectedView: {
							...selectedMapView,
							filters: mapViewFilters,
						},
					});
				}
				layerFiltersController.updateLayerFiltersFromMapViews(dataSourceName, mapViewFilters);
			}
		}
	}, [debouncedFilterValues, filterType, fieldName, dataSourceName]); // Dependencies trigger re-run when they change

	// Memoized calculation of autocomplete fields to optimize rendering
	const autocompleteFields = useMemo(() => {
		const filterValueHits = filtersData?.getDbFilters?.hits || []; // Get filter options from query results
		const filterValuesOptions = filterValueHits.map(hit => hit.key).filter(key => (key?.trim ? key.trim() : key)); // Clean options

		// Map filter type options to autocomplete options
		const filterTypeOptions = stringFilterOptions.map(option => {
			return { label: tableESSimpleFilterModes[option].label, value: tableESSimpleFilterModes[option].option };
		});

		// making datasets fields in the below code block
		let datasets = globalStateController.getValue('datasets');
		datasets = datasets?.filter(dataset => dataset.sourceName !== 'M1 Platform');

		let datasetsShapeNames =
			datasets?.flatMap(dataset =>
				dataset.categories.map(category => ({
					label: `[${dataset.name}] - ${category.layerShapeName}`,
					value: `${dataset.file}_${category.layerShapeName}`,
				}))
			) || [];

		const m1LayersOptions = Object.keys(customLayersFieldAccessors).map(layer => ({ label: layer, value: layer }));

		const shapeFileOptions = filterTypeOptions.filter(option => ['singleselect', 'multiselect'].includes(option.value));

		const wellsFilterOptions = filterTypeOptions.filter(option => ['multiselect'].includes(option.value));

		// Making filter options based on selected dataset
		let requiredFilterOptions = [];
		if (dataSourceName === 'Wells') {
			requiredFilterOptions = wellsFilterOptions;
		} else if (dataSourceName && customLayersFieldAccessors[dataSourceName]) {
			requiredFilterOptions = filterTypeOptions;
		} else {
			requiredFilterOptions = shapeFileOptions;
		}

		const fileId = dataSourceName?.substring(0, dataSourceName.indexOf('_'));
		const layerShapeName = dataSourceName?.substring(dataSourceName.indexOf('_') + 1);
		const layer = layers.find(l => l.file === fileId && l.layerShapeName === layerShapeName);

		if (dataSourceName && !(customLayersFieldAccessors[dataSourceName]?.keys || layer?.layerSchema)) {
			return [];
		}
		const tableKey = Object.keys(tableESState).find(key => {
			const tableState = tableESState[key].get({ noproxy: true });
			return tableState?.layerIdentifier === dataSourceName;
		});

		const fields = [
			{
				name: `mapViews.${index}.dataSourceName`,
				label: 'Data Source Name',
				options: [...m1LayersOptions, ...datasetsShapeNames], // Static options from constants
				defaultValue: mapView?.dataSourceName
					? [...m1LayersOptions, ...datasetsShapeNames]?.find(option => option.value === mapView?.dataSourceName)
					: null, // Set default value if mapView is provided
				onChange: () => {
					setValue(`mapViews.${index}.fieldName`, null);
					setValue(`mapViews.${index}.filterType`, null);
					setValue(`mapViews.${index}.filterValues`, null);
				}, // Reset other fields on change
			},
			{
				name: `mapViews.${index}.fieldName`,
				label: 'Field Name',
				options: customLayersFieldAccessors[dataSourceName]?.keys || layer?.layerSchema || [], // Dynamic based on data source
				defaultValue: mapView?.dataSourceName ? getSelectedField(mapView?.fieldName) || mapView?.fieldName : null, // Set default value if mapView is provided
				onChange: (e, v, r, previousValue) => {
					setValue(
						`mapViews.${index}.filterType`,
						v?.type
							? null
							: {
									label: 'Multi Select',
									value: 'multiselect',
								}
					);
					setValue(`mapViews.${index}.filterValues`, null);

					if (tableKey) {
						tableController(tableKey).clearFilter(
							(previousValue?.value || previousValue)?.replace('.keyword', ''),
							true,
							false
						);
						tableController(tableKey).setFilterMode(
							(fieldName?.value || fieldName)?.replace('.keyword', ''),
							'singleselect',
							false
						);
					}
				}, // Reset other fields on change
			},
		];

		const isDate = fieldName?.type === 'date';
		const isRange = fieldName?.type === 'range';

		if (!isDate && !isRange) {
			fields.push({
				name: `mapViews.${index}.filterType`,
				label: 'Filter Type',
				options: requiredFilterOptions,
				defaultValue: filterTypeOptions.find(filterTypeOption => filterTypeOption.value === mapView?.filterType), // Set default value if mapView is provided
				onChange: (e, v, r, previousValue) => {
					setValue(`mapViews.${index}.filterValues`, null);
					if (!['empty', 'notEmpty'].includes(v?.value) && !['empty', 'notEmpty'].includes(previousValue?.value)) {
						Object.keys(tableESState).map(tableKey =>
							tableController(tableKey).clearFilter((fieldName?.value || fieldName)?.replace('.keyword', ''), false)
						);
					}
				}, // Reset other fields on change
			});
		}

		if (!['empty', 'notEmpty'].includes(filterType?.value || filterType)) {
			fields.push({
				name: `mapViews.${index}.filterValues`,
				label: 'Filter Values',
				options: filterValuesOptions || [], // Dynamic based on filter options
				defaultValue: mapView?.filterValues, // Set default value if mapView is provided
				type: fieldName?.type,
			});
		}
		return fields;
	}, [dataSourceName, filtersData, filterType, fieldName, index, mapView, getSelectedField, setValue]); // Dependencies for recalculating when data changes

	// Function to clear the filter when the clear button is clicked
	const clearFilter = () => {
		const selectedMapView = viewStateController('MapView').getValue('selectedView');
		let mapViewFilters = getMapViewFilters();

		mapViewFilters = mapViewFilters.filter((_, i) => i !== index);

		const tableKey = Object.keys(tableESState).find(key => {
			const tableState = tableESState[key].get({ noproxy: true });
			return tableState?.layerIdentifier === dataSourceName;
		});
		tableController(tableKey).clearFilter((fieldName?.value || fieldName)?.replace('.keyword', ''), false);
		tableController(tableKey).setFilterMode(
			(fieldName?.value || fieldName)?.replace('.keyword', ''),
			'singleselect',
			false
		);
		remove(index); // Set the filter cleared state to true
		resetForm({
			mapViews: mapViewFilters || [],
		});

		viewStateController('MapView').updateState({
			selectedView: {
				...selectedMapView,
				filters: mapViewFilters,
			},
		});
		layerFiltersController.updateLayerFiltersFromMapViews(dataSourceName, mapViewFilters);
	};

	return (
		<Box className={classes.container} mb={4}>
			{/* Clear button */}
			<div className={classes.iconButton}>
				<Grid item className={classes.clearIcon}>
					<IconButton onClick={clearFilter} size="small">
						<ClearButton />
					</IconButton>
				</Grid>
			</div>

			{/* Render autocomplete fields */}
			{autocompleteFields.map(field => (
				<Box mb={2} key={field?.name}>
					<CustomAutocomplete
						defaultValue={field.defaultValue} // Set default value if mapView is provided
						onChange={field.onChange} // Triggered when the field value changes
						name={field.name}
						type={field.type}
						control={control} // Form control passed for managing input state
						options={field.options}
						label={field.label}
						className={classes.autoComplete} // Apply custom autocomplete styles
						isTextFieldOnly={
							searchFilterOptions.includes(filterType?.value || filterType) && field.label === 'Filter Values'
						}
						searchText={searchText}
						handleChange={handleChange}
						multiple={field.label === 'Filter Values' && (filterType?.value || filterType) === 'multiselect'}
					/>
				</Box>
			))}
		</Box>
	);
};

UserMapFilter.propTypes = {
	mapView: PropTypes.object.isRequired,
	index: PropTypes.number.isRequired,
	remove: PropTypes.func.isRequired,
	resetForm: PropTypes.func.isRequired,
};

export default UserMapFilter;
