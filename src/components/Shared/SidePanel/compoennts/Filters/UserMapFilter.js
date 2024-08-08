import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Grid, IconButton } from '@material-ui/core';
import { Close as ClearButton } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { useLazyQuery } from '@apollo/client';
import CustomAutocomplete from './CustomAutocomplete';
import { customLayersFieldAccessors } from './consts';
import { layerFiltersController } from 'hookstate/layerFiltersController';
import { globalStateController } from 'hookstate/globalStateController';
import { useFormContext } from 'react-hook-form';
import { stringFilterOptions, tableESSimpleFilterModes, searchFilterOptions } from 'components/MRTTable/utils/data';
import { GET_SHAPE_FILE_SCHEMA } from 'graphQL/useQueryGetShapeFileSchema';
import { generateFileFilters } from 'components/Map/DeckGL/helpers/common';
import { GET_ES_SIMPLE_FILTER } from 'graphQL/useQueryESSimpleFilter';
import { tableController, tableGlobalController } from 'hookstate/tableController';
import { tableESState } from 'hookstate/initialStates';
import _ from 'lodash';

// Define custom styles using Material-UI's makeStyles hook
const useStyles = makeStyles(theme => ({
	container: {
		backgroundColor: '#182B4D', // Dark blue background for the container
		padding: theme.spacing(2),
		width: '100%',
		borderRadius: theme.shape.borderRadius,
		borderLeft: '5px solid #0E638D', // Left border with a blue accent
		position: 'relative',
		color: 'white',
		height: '400px', // Fixed height for the filter container
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
	// Handle cases where filterType might be an object
	filterType = filterType?.value || filterType;

	let filterValue;

	switch (filterType) {
		case 'multiselect':
			return {
				field: fieldName?.value || fieldName,
				value: filterValues,
				isMapViewFilter: true,
				searchType: filterType,
			};
		case 'empty':
		case 'notEmpty':
			filterValue = ' ';
			break;
		default:
			filterValue = typeof filterValues === 'string' ? filterValues : filterValues?.[0];
			break;
	}

	return {
		field: fieldName?.value || fieldName,
		value: filterValue,
		isMapViewFilter: true,
		searchType: filterType,
		...(filterType !== 'singleselect' && {
			type: 'advanced',
			isKeyword: true,
			columnType: 'string',
		}),
	};
};

const UserMapFilter = ({ mapView, index, remove }) => {
	const classes = useStyles(); // Apply custom styles
	const { control, setValue, watch } = useFormContext(); // Get form control methods

	const [searchText, setSearchText] = useState('');

	const debouncedSetSearchText = useMemo(() => {
		return _.debounce(value => {
			setSearchText(value);
			// Perform your search or API call here
		}, 500); // Adjust delay as needed
	}, []);

	const handleChange = e => {
		debouncedSetSearchText(e?.target?.value || '');
	};
	// Lazy query to fetch filter list from the GraphQL API when required
	const [getFiltersList, { data: filtersData }] = useLazyQuery(GET_ES_SIMPLE_FILTER, { fetchPolicy: 'no-cache' });
	const [getShapeFileSchema, { data: shapeFileSchema }] = useLazyQuery(GET_SHAPE_FILE_SCHEMA);

	// Watch form fields to dynamically react to their values
	const dataSourceNameField = watch(`mapViews.${index}.dataSourceName`);
	const dataSourceName = dataSourceNameField?.value || dataSourceNameField;
	const fieldName = watch(`mapViews.${index}.fieldName`);
	const filterValues = watch(`mapViews.${index}.filterValues`);
	const filterType = watch(`mapViews.${index}.filterType`);

	const mapViews = watch(`mapViews`);

	const [debouncedFilterValues, setDebouncedFilterValues] = useState(filterValues); // New state for debounced filter values

	// Debounce the filter values
	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedFilterValues(filterValues);
		}, 1500); // Delay of 1500ms

		// Cleanup function to clear the timeout
		return () => {
			clearTimeout(handler);
		};
	}, [filterValues]);

	useEffect(() => {
		if (!dataSourceName || customLayersFieldAccessors[dataSourceName]) return;
		const fileId = dataSourceName.substring(0, dataSourceName.indexOf('_'));
		const layerShapeName = dataSourceName.substring(dataSourceName.indexOf('_') + 1);
		getShapeFileSchema({
			variables: {
				file: fileId,
				layerShapeName,
			},
		});
	}, [dataSourceName, getShapeFileSchema]);

	const getMapViewFilters = () => {
		const isMultiSelect = mapView.filterType?.value === 'multiselect';
		const isString = typeof mapView.filterValues === 'string';
		return mapViews?.map(mapView => ({
			dataSourceName: mapView?.dataSourceName?.value || mapView?.dataSourceName,
			filterType: mapView?.filterType?.value || filterType || mapView?.filterType,
			fieldName: mapView?.fieldName?.value || mapView?.fieldName,
			filterValues: isMultiSelect
				? mapView.filterValues && isString
					? [mapView.filterValues]
					: mapView.filterValues
				: mapView.filterValues,
		}));
	};

	const getLayerTypeAndFilters = dataSourceName => {
		let esIndex,
			filters = [],
			search = { fields: [] };
		const layerType = customLayersFieldAccessors[dataSourceName]?.layerKey?.toLowerCase(); // Get the layer type

		// Determine the filters based on the layer type

		if (layerType === 'agreement') {
			esIndex = 'shapes_flat';
			filters = [{ field: 'shapeJson.properties.layerType', value: 'agreement' }];
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
			const fileId = dataSourceName.substring(0, dataSourceName.indexOf('_'));
			const layerShapeName = dataSourceName.substring(dataSourceName.indexOf('_') + 1);
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
		if (!(dataSourceName && fieldName)) return;

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
			const selectedMapView = globalStateController.getValue('mapView')?.selectedMapView;
			const canUpdateMapView = dataSourceName && (fieldName?.value || fieldName) && filterType;

			const mapViewFilters = getMapViewFilters();
			// Upsert the map view data to the GraphQL API
			if (canUpdateMapView) {
				globalStateController.updateState({
					mapView: {
						selectedMapView: {
							...selectedMapView,
							filters: mapViewFilters,
						},
					},
				});
				tableGlobalController.reInitialized();
				layerFiltersController.updateLayerFiltersFromMapViews(dataSourceName, mapViewFilters);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedFilterValues, filterType, fieldName, dataSourceName]); // Dependencies trigger re-run when they change

	const getSelectedField = useCallback(
		fieldName => {
			return (customLayersFieldAccessors[mapView?.dataSourceName]?.keys || shapeFileSchema?.getShapeFileSchema)?.find(
				key => key.value.replace('.keyword', '') === fieldName || key?.value === fieldName
			);
		},
		[mapView?.dataSourceName, shapeFileSchema?.getShapeFileSchema]
	);

	// Memoized calculation of autocomplete fields to optimize rendering
	const autocompleteFields = useMemo(() => {
		const filterValueHits = filtersData?.getESSimpleFilter?.hits || []; // Get filter options from query results
		const filterValuesOptions = filterValueHits.map(hit => hit.key).filter(key => (key?.trim ? key.trim() : key)); // Clean options

		// Map filter type options to autocomplete options
		const filterTypeOptions = stringFilterOptions.map(option => {
			return { label: tableESSimpleFilterModes[option].label, value: tableESSimpleFilterModes[option].option };
		});

		// making datasets fields in the below code block
		let datasets = globalStateController.getValue('datasets');
		datasets = datasets.filter(dataset => dataset.sourceName !== 'M1 Platform');

		let datasetsShapeNames = datasets.flatMap(dataset =>
			dataset.categories.map(category => ({
				label: `[${dataset.name}] - ${category.layerShapeName}`,
				value: `${dataset.file}_${category.layerShapeName}`,
			}))
		);

		const m1LayersOptions = Object.keys(customLayersFieldAccessors).map(layer => ({ label: layer, value: layer }));

		const shapeFileOptions = filterTypeOptions.filter(option => ['singleselect', 'multiselect'].includes(option.value));

		// Making filter options based on selected dataset
		const requiredFilterOptions =
			dataSourceName && customLayersFieldAccessors[dataSourceName] ? filterTypeOptions : shapeFileOptions;

		return [
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
				options: customLayersFieldAccessors[dataSourceName]?.keys || shapeFileSchema?.getShapeFileSchema || [], // Dynamic based on data source
				defaultValue: mapView?.dataSourceName ? getSelectedField(mapView?.fieldName) || mapView?.fieldName : null, // Set default value if mapView is provided
				onChange: () => {
					setValue(`mapViews.${index}.filterType`, null);
					setValue(`mapViews.${index}.filterValues`, null);
				}, // Reset other fields on change
			},
			{
				name: `mapViews.${index}.filterType`,
				label: 'Filter Type',
				options: requiredFilterOptions,
				defaultValue: filterTypeOptions.find(filterTypeOption => filterTypeOption.value === mapView?.filterType), // Set default value if mapView is provided
				onChange: () => {
					Object.keys(tableESState).map(tableKey =>
						tableController(tableKey).clearFilter((fieldName?.value || fieldName)?.replace('.keyword', ''), false)
					);
					setValue(`mapViews.${index}.filterValues`, null);
				}, // Reset other fields on change
			},
			...(!['empty', 'notEmpty'].includes(filterType?.value || filterType)
				? [
						{
							name: `mapViews.${index}.filterValues`,
							label: 'Filter Values',
							options: filterValuesOptions || [], // Dynamic based on filter options
							defaultValue: mapView?.filterValues, // Set default value if mapView is provided
						},
					]
				: []),
		];
	}, [dataSourceName, filtersData, filterType, index, mapView, getSelectedField, setValue, shapeFileSchema]); // Dependencies for recalculating when data changes

	// Function to clear the filter when the clear button is clicked
	const clearFilter = () => {
		const selectedMapView = globalStateController.getValue('mapView')?.selectedMapView;
		let mapViewFilters = getMapViewFilters();

		mapViewFilters = mapViewFilters.filter((_, i) => i !== index);

		remove(index); // Set the filter cleared state to true

		globalStateController.updateState({
			mapView: {
				selectedMapView: {
					...selectedMapView,
					filters: mapViewFilters,
				},
			},
		});
		layerFiltersController.updateLayerFiltersFromMapViews(dataSourceName, mapViewFilters);
		tableGlobalController.reInitialized();
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
			{autocompleteFields.map((field, i) => (
				<Box mb={2} key={i}>
					<CustomAutocomplete
						defaultValue={field.defaultValue} // Set default value if mapView is provided
						onChange={field.onChange} // Triggered when the field value changes
						name={field.name}
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

export default UserMapFilter;
