import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Grid, IconButton } from '@material-ui/core';
import { Close as ClearButton } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { useLazyQuery } from '@apollo/client';
import { GET_ES_FILTER_LIST } from 'graphQL/useQueryESFilterList';
import CustomAutocomplete from './CustomAutocomplete';
import { customLayersFieldAccessors } from './consts';
import { layerFiltersController } from 'hookstate/layerFiltersController';
import { globalStateController } from 'hookstate/globalStateController';
import { useFormContext } from 'react-hook-form';
import { stringFilterOptions, tableESSimpleFilterModes, searchFilterOptions } from 'components/MRTTable/utils/data';

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
		...(filterType !== 'singleselect' && {
			type: 'advanced',
			searchType: filterType,
			isKeyword: true,
			columnType: 'string',
		}),
	};
};

const UserMapFilter = ({ mapView, index, remove }) => {
	const classes = useStyles(); // Apply custom styles
	const { control, setValue, watch } = useFormContext(); // Get form control methods

	// Lazy query to fetch filter list from the GraphQL API when required
	const [getFiltersList, { data: filtersData }] = useLazyQuery(GET_ES_FILTER_LIST, { fetchPolicy: 'no-cache' });

	// Watch form fields to dynamically react to their values
	const dataSourceName = watch(`mapViews.${index}.dataSourceName`);
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

	// Effect to trigger data fetching based on the selected data source and field name
	useEffect(() => {
		if (dataSourceName && fieldName) {
			let filters = [];
			const esIndex = 'shapes_flat'; // Elasticsearch index used in the query
			const layerType = customLayersFieldAccessors[dataSourceName].layerKey.toLowerCase(); // Get the layer type

			// Determine the filters based on the layer type
			if (layerType === 'agreement') {
				filters = [{ field: 'shapeJson.properties.layerType', value: 'agreement' }];
			} else {
				filters = [{ field: 'layer.keyword', value: layerType }];
			}

			// Execute the lazy query to fetch filter options
			getFiltersList({
				variables: {
					search: '*', // Search query to fetch all data
					filterKey: fieldName?.value,
					size: 10000, // Maximum number of results to fetch
					esIndex,
					filters,
				},
			});
		}
	}, [dataSourceName, fieldName, getFiltersList]); // Dependencies trigger re-run when they change

	// Effect to log filter values when they change
	useEffect(() => {
		if (dataSourceName) {
			const state = layerFiltersController.getValue([dataSourceName]); // Get layer filters from hookstate
			const initialFilters = state?.variables?.filters || []; // Get initial filters
			let filters = initialFilters.filter(filter => filter.field !== fieldName?.value); // Remove existing filter
			let globalFilters = globalStateController.getValue('allMapViewFilters') || [];

			const canUpdateMapView = dataSourceName && fieldName && filterType;

			// Upsert the map view data to the GraphQL API
			if (canUpdateMapView) {
				globalFilters = globalFilters.filter(
					filter => filter.fieldName !== (fieldName?.value || fieldName) || filter.dataSourceName !== dataSourceName
				);
				globalStateController.updateState({
					allMapViewFilters: [
						...globalFilters.filter(filter => filter?.fieldName),
						{
							dataSourceName,
							filterType: filterType?.value || filterType,
							fieldName: fieldName?.value || fieldName,
							filterValues: typeof debouncedFilterValues === 'string' ? [debouncedFilterValues] : debouncedFilterValues,
						},
					],
				});
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
	}, [debouncedFilterValues, filterType, fieldName, dataSourceName]); // Dependencies trigger re-run when they change

	const getSelectedField = useCallback(
		fieldName => {
			return customLayersFieldAccessors[mapView?.dataSourceName].keys.find(key => key.value === fieldName);
		},
		[mapView?.dataSourceName]
	);

	// Memoized calculation of autocomplete fields to optimize rendering
	const autocompleteFields = useMemo(() => {
		const filterValueHits = filtersData?.getESFilterList?.hits || []; // Get filter options from query results
		const filterValuesOptions = filterValueHits.map(hit => hit.key).filter(key => key.trim()); // Clean options

		// Map filter type options to autocomplete options
		const filterTypeOptions = stringFilterOptions.map(option => {
			return { label: tableESSimpleFilterModes[option].label, value: tableESSimpleFilterModes[option].option };
		});

		return [
			{
				name: `mapViews.${index}.dataSourceName`,
				label: 'Data Source Name',
				options: Object.keys(customLayersFieldAccessors), // Static options from constants
				defaultValue: mapView?.dataSourceName, // Set default value if mapView is provided
				onChange: () => {
					setValue(`mapViews.${index}.fieldName`, null);
					setValue(`mapViews.${index}.filterType`, null);
					setValue(`mapViews.${index}.filterValues`, null);
				}, // Reset other fields on change
			},
			{
				name: `mapViews.${index}.fieldName`,
				label: 'Field Name',
				options: dataSourceName ? customLayersFieldAccessors[dataSourceName].keys : [], // Dynamic based on data source
				defaultValue: mapView?.dataSourceName ? getSelectedField(mapView?.fieldName) : null, // Set default value if mapView is provided
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
	}, [dataSourceName, filtersData, filterType, index, mapView, getSelectedField, setValue]); // Dependencies for recalculating when data changes

	// Function to clear the filter when the clear button is clicked
	const clearFilter = () => {
		const state = layerFiltersController.getValue([dataSourceName]); // Get layer filters from hookstate
		const initialFilters = state?.variables?.filters || []; // Get initial filters
		const filters = initialFilters.filter(filter => filter.field !== fieldName.value); // Remove existing filter
		layerFiltersController.setVariables(dataSourceName, { filters }); // Clear filter from layer filters
		let globalFilters = globalStateController.getValue('allMapViewFilters') || [];
		globalFilters = globalFilters.filter(
			filter => filter.fieldName !== (fieldName?.value || fieldName) || filter.dataSourceName !== dataSourceName
		);
		remove(index); // Set the filter cleared state to true
		globalStateController.updateState({
			allMapViewFilters: globalFilters.filter(filter => filter?.fieldName),
		});
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
