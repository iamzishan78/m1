import React from 'react';

import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { AutoCompleteFilter } from 'components/Table/AutoCompleteFilter';

import { GET_ES_SIMPLE_FILTER } from 'graphQL/useQueryESSimpleFilter';

import { wellsFilterColumnsHeader } from 'utils/data';

const useStyles = makeStyles(theme => ({
	actionBar: {
		padding: '10px 40px',
		display: 'flex',
		alignItems: 'center',
		backgroundColor: '#f7f7f7',
		width: '100%',
		minHeight: '65px',

		'& .MuiSelect-select:focus, & .MuiOutlinedInput-root': {
			backgroundColor: '#ffff',
		},
		'& .MuiButtonGroup-groupedContainedSecondary:not(:last-child)': {
			borderColor: '#ffff',
		},
	},
	actionsGrid: {
		marginTop: '6px',
		'& .MuiButtonBase-root': {
			width: '149px',
			height: '35px',
			fontWeight: 'bold',
		},
	},
	viewSwitcher: {
		height: '40px',
		backgroundColor: 'white',
	},

	formControl: {
		width: '100%',
	},
}));

const WellsFilters = ({ filters, setFilters }) => {
	const classes = useStyles();
	const onChange = (filter, index, column, esKey) => {
		let allFilters = JSON.parse(JSON.stringify(filters));
		if (allFilters.length > 0) {
			const index = allFilters.findIndex(f => f.field === column.filterKey);
			if (index > -1) {
				allFilters[index].value = column.filterList[0];
			} else {
				allFilters.push({ field: column.filterKey, value: column.filterList[0] });
			}
		} else {
			allFilters.push({ field: column.filterKey, value: column.filterList[0] });
		}
		allFilters = allFilters.filter(filter => filter.value);
		setFilters(allFilters);
	};

	return (
		<Grid container direction="row" display="flex" className={classes.actionBar} spacing={2}>
			{wellsFilterColumnsHeader.map((filterColumn, index) => {
				const custom = {
					multi_filter_keys: true,
				};
				const appliedFilters = [];
				let filterList = [[''], [''], [''], ['']];

				return (
					<Grid item xs md style={{ minWidth: '150px', maxWidth: '250px' }}>
						<AutoCompleteFilter
							esIndex={'mywells_flat'}
							variant="outlined"
							setFilters={setFilters}
							filterList={filterList}
							column={filterColumn}
							disabled={filterColumn?.disabled}
							index={index}
							custom={Array.isArray(filterColumn.filterKey) ? custom : undefined}
							onChange={onChange}
							query={GET_ES_SIMPLE_FILTER}
							searchFields={['*']}
							filters={appliedFilters}
							extendSearchQuery={''}
						/>
					</Grid>
				);
			})}
		</Grid>
	);
};

export default WellsFilters;
