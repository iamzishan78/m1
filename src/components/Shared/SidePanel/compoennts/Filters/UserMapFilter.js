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
import { tableGlobalController } from 'hookstate/tableController';

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

	// Lazy query to fetch filter list from the GraphQL API when required
	const [getFiltersList, { data: filtersData }] = useLazyQuery(GET_ES_SIMPLE_FILTER, { fetchPolicy: 'no-cache' });
	const [getShapeFileSchema, { data: shapeFileSchema }] = useLazyQuery(GET_SHAPE_FILE_SCHEMA);

	// Watch form fields to dynamically react to their values
	const dataSourceNameField = watch(`mapViews.${index}.dataSourceName`);
	const dataSourceName = dataSourceNameField?.value || dataSourceNameField;
	const fieldName = watch(`mapViews.${index}.fieldName`);
	const filterValues = watch(`mapViews.${index}.filterValues`);
	const filterType = watch(`mapViews.${index}.filterType`);

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
		getShapeFileSchema({
			variables: {
				layerId: dataSourceName,
			},
		});
	}, [dataSourceName, getShapeFileSchema]);

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
		} else {
			esIndex = 'shapefile_flat';
			const selectedLayer = globalStateController.getValue('layers')?.find(layer => layer?.layerId === dataSourceName);
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
					query: '',
					size: 10000,
				},
				esIndex,
				index: esIndex,
				filters,
				pagination: { first: 10000, after: null },
				size: 10,
			},
		});
	}, [dataSourceName, fieldName, getFiltersList]); // Dependencies trigger re-run when they change

	// Effect to log filter values when they change
	useEffect(() => {
		if (dataSourceName) {
			const layerShapeName = globalStateController
				.getValue('layers')
				?.find(layer => layer?.layerId === dataSourceName)?.layerShapeName;
			const state = layerFiltersController.getValue([layerShapeName || dataSourceName]); // Get layer filters from hookstate
			const initialFilters = state?.variables?.filters || []; // Get initial filters
			let filters = initialFilters.filter(filter => filter.field !== fieldName?.value); // Remove existing filter
			const selectedMapView = globalStateController.getValue('mapView')?.selectedMapView;
			let globalFilters = selectedMapView?.filters || [];

			const canUpdateMapView =
				dataSourceName &&
				fieldName?.value &&
				filterType &&
				(['empty', 'notEmpty'].includes(filterType?.value || filterType) || filterValues);

			// Upsert the map view data to the GraphQL API
			if (canUpdateMapView) {
				globalFilters = globalFilters.filter(
					filter => filter.fieldName !== (fieldName?.value || fieldName) || filter.dataSourceName !== dataSourceName
				);
				globalStateController.updateState({
					mapView: {
						selectedMapView: {
							...selectedMapView,
							filters: [
								...globalFilters.filter(filter => filter?.fieldName),
								{
									dataSourceName: dataSourceName,
									filterType: filterType?.value || filterType,
									fieldName: fieldName?.value || fieldName,
									filterValues:
										typeof debouncedFilterValues === 'string' ? [debouncedFilterValues] : debouncedFilterValues,
								},
							],
						},
					},
				});
				tableGlobalController.reInitialized();
			}

			// Update layer filters with the new filter values
			if (
				(debouncedFilterValues || ['empty', 'notEmpty'].includes(filterType?.value || filterType)) &&
				fieldName?.value
			) {
				filters = [...filters, getFormattedFilterBasedOnType(filterType, fieldName, debouncedFilterValues)];
			}

			// Set the updated filters in the layer filters
			layerFiltersController.setVariables(dataSourceName, { filters });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedFilterValues, filterType, fieldName, dataSourceName]); // Dependencies trigger re-run when they change

	const getSelectedField = useCallback(
		fieldName => {
			return customLayersFieldAccessors[mapView?.dataSourceName]?.keys?.find(
				key => key.value.replace('.keyword', '') === fieldName || key?.value === fieldName
			);
		},
		[mapView?.dataSourceName]
	);

	// Memoized calculation of autocomplete fields to optimize rendering
	const autocompleteFields = useMemo(() => {
		const filterValueHits = filtersData?.getESSimpleFilter?.hits || []; // Get filter options from query results
		const filterValuesOptions = filterValueHits.map(hit => hit.key).filter(key => key.trim()); // Clean options

		// Map filter type options to autocomplete options
		const filterTypeOptions = stringFilterOptions.map(option => {
			return { label: tableESSimpleFilterModes[option].label, value: tableESSimpleFilterModes[option].option };
		});

		const layers = globalStateController.getValue('layers');
		const fileLayers = layers?.filter(layer => layer?.layerShapeName && layer?.layerSchema);
		const layerShapeNames = fileLayers?.map(layer => ({ label: layer?.layerShapeName, value: layer?.layerId || '' }));
		const m1LayersOptions = Object.keys(customLayersFieldAccessors).map(layer => ({ label: layer, value: layer }));

		return [
			{
				name: `mapViews.${index}.dataSourceName`,
				label: 'Data Source Name',
				options: [...m1LayersOptions, ...layerShapeNames], // Static options from constants
				defaultValue: mapView?.dataSourceName
					? [...m1LayersOptions, ...layerShapeNames]?.find(option => option.value === mapView?.dataSourceName)
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
				options: filterTypeOptions, // Static options for filter types
				defaultValue: mapView?.filterType, // Set default value if mapView is provided
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
		const layerShapeName = globalStateController
			.getValue('layers')
			?.find(layer => layer?.layerId === dataSourceName)?.layerShapeName;
		const filterAccessor = layerShapeName || dataSourceName;
		const state = layerFiltersController.getValue([filterAccessor]); // Get layer filters from hookstate
		const initialFilters = state?.variables?.filters || []; // Get initial filters
		const filters = initialFilters.filter(filter => filter.field !== fieldName.value); // Remove existing filter
		layerFiltersController.setVariables(filterAccessor, { filters }); // Clear filter from layer filters
		const selectedMapView = globalStateController.getValue('mapView')?.selectedMapView;
		let globalFilters = selectedMapView?.filters || [];
		globalFilters = globalFilters.filter(
			filter => filter.fieldName !== (fieldName?.value || fieldName) || filter.dataSourceName !== dataSourceName
		);
		remove(index); // Set the filter cleared state to true

		globalStateController.updateState({
			mapView: {
				selectedMapView: {
					...selectedMapView,
					filters: [...globalFilters.filter(filter => filter?.fieldName)],
				},
			},
		});
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
						multiple={field.label === 'Filter Values' && (filterType?.value || filterType) === 'multiselect'}
					/>
				</Box>
			))}
		</Box>
	);
};

export default UserMapFilter;
