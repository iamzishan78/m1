import React, { useContext, useEffect, useState } from 'react';

import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import debounce from 'lodash/debounce';

import { AutoCompleteFilter } from 'components/Common/AutoCompleteFilter';

import { GET_ES_SIMPLE_FILTER } from 'graphQL/useQueryESSimpleFilter';

import { AppContext } from 'AppContext';

const useStyles = makeStyles(theme => ({
	gridItem: {
		display: 'flex',
		flexDirection: 'column',
	},
	formControl: {
		minWidth: 249,
		color: 'black',
		'& .MuiInputBase-root': {
			backgroundColor: '#101d29',
		},
	},
}));

const remartsTypeFilters = [
	{
		label: 'Remark Type',
		filterKey: 'comments.commentTypeData.commentType.keyword',
		searchFields: ['comments.commentTypeData.commentType'],
	},
];

const AutoCompleteDropdown = ({ classes, onChange, filter, filterList, index }) => {
	const params = {
		esIndex: 'shapes_flat',
		variant: 'outlined',
		setFilters: () => {},
		filterList,
		column: {
			label: filter.label,
			filterKey: filter.filterKey,
		},
		index,
		onChange,
		query: GET_ES_SIMPLE_FILTER,
		searchFields: filter.searchFields,
		filters: [{ field: 'shapeJson.properties.type.keyword', value: 'agreement' }],
		extendSearchQuery: '',
	};
	if (filter.getOptionLabel) {
		params['getOptionLabel'] = filter.getOptionLabel;
	}
	return (
		<FormControl variant="outlined" className={classes.formControl}>
			<AutoCompleteFilter {...params} />
		</FormControl>
	);
};

export default function ProvisionsFilters(props) {
	const classes = useStyles();
	const [stateApp, setStateApp] = useContext(AppContext);
	const [filterList, setFilterList] = useState([[]]);

	useEffect(() => {
		if (stateApp.landSearchFilters?.remarksTypes?.length === 0) {
			setFilterList([[]]);
		}
	}, [stateApp.landSearchFilters?.remarksTypes]);

	const onFilterChange = debounce((request, callback, index) => {
		const { filterKey } = callback;
		setStateApp(stateApp => ({
			...stateApp,
			landSearchFilters: { ...stateApp.landSearchFilters, remarksTypes: [{ field: filterKey, value: request[0] }] },
		}));

		let _filterList = [...filterList];
		_filterList[index] = request;
		setFilterList(_filterList);
	}, 1000);

	return (
		<Grid container item spacing={2} style={{ padding: '8px', width: '100%', margin: '0' }}>
			{remartsTypeFilters.map((filter, index) => (
				<Grid item key={index} sm={12} className={classes.gridItem}>
					<AutoCompleteDropdown
						classes={classes}
						onChange={(request, top, callback) => {
							onFilterChange(request, callback, index);
						}}
						filter={filter}
						filterList={filterList}
						index={index}
					/>
				</Grid>
			))}
		</Grid>
	);
}
