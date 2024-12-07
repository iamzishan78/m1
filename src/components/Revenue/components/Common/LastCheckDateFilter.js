import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Grid, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/styles';
import CustomDates from 'components/Revenue/components/Common/CustomDates';
import { useLazyQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import ReportGroupHeader from 'components/Shared/ReportGroupHeader';
import { dateFilterToDate, getFirstDayOfMonth } from 'utils/helper';
import { copy } from 'components/Shared/functions';
import { GET_DB_AGGS } from 'graphQL/useQueryDbQuery';
import { get } from 'lodash';

const useStyles = makeStyles(theme => ({
	actionBar: {
		backgroundColor: '#f7f7f7',
		width: '100%',
		minHeight: '65px',
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

const LastCheckDateFilter = ({
	field,
	esIndex,
	esFilters,
	setESFilters,
	filterToggle,
	propertyNumbers,
	checkNumbers,
	setFilterToggle,
	extraFitlers = [],
	stateESKey = '',
	isComparisonReport = false,
}) => {
	const classes = useStyles();

	const [fromDate, setFromDate] = React.useState(null);
	const [toDate, setToDate] = React.useState(null);
	const [lastCheckMinDate, setLastCheckMinDate] = useState('');
	const [propertyFilter, setPropertyFilter] = useState([]);
	const [checkNumberFilter, setCheckNumberFilter] = useState();
	const [propertyNumberFilter, setPropertyNumberFilter] = useState();

	const reportGroupFilters = useRef([]);

	const propertiesReportGroup = useSelector(({ Revenue }) => Revenue.propertiesReportGroup);

	const [getDbMinValue] = useLazyQuery(GET_DB_AGGS, {
		fetchPolicy: 'no-cache',
		onCompleted: data => {
			const key = field.replace(/\./g, '_');
			const value = get(data, `getDbAggs.aggregations.${key}[0].${key}`);

			if (value) {
				setLastCheckMinDate(value);
			}
		},
	});
	useEffect(() => {
		getDbMinValue({
			variables: {
				index: esIndex,
				aggs: {
					[field]: {
						min: { field },
					},
				},
			},
		});
	}, [getDbMinValue, esIndex, field]);

	const updateFilters = useCallback(() => {
		let filters = copy(esFilters) ?? [];
		const isDuplicateFilter = filters?.findIndex(filter => filter.field === field) !== -1;

		filters = filters.filter(
			filter =>
				filter.type !== 'range' &&
				filter.field !== `${stateESKey}state.keyword` &&
				filter.field !== 'check.checkNumber.keyword' &&
				filter.field !== 'property.number.keyword' &&
				filter.field !== 'status.keyword'
		);
		if (checkNumberFilter) {
			filters.push({ field: 'check.checkNumber.keyword', value: checkNumberFilter });
		}
		if (propertyNumberFilter) {
			filters.push({ field: 'property.number.keyword', value: propertyNumberFilter });
		}
		if (fromDate && toDate && !isDuplicateFilter) {
			filters.unshift({
				field,
				value: [
					fromDate ? `${getFirstDayOfMonth(fromDate)}` : null,
					toDate ? `${dateFilterToDate(toDate)}T00:00:00.000Z` : null,
				],
				type: 'advanced',
				columnType: 'date',
				searchType: 'between',
			});
		}

		const _propertyFilter = copy(propertyFilter);
		filters = filters.filter(filter => !reportGroupFilters.current.includes(filter.field));
		_propertyFilter.forEach(filter => {
			const field = filter.field.includes('wells') ? filter.field.replace('property.', '') : stateESKey + filter.field;
			filters = filters.filter(f => f.field !== field);
			filter.field = field;
			filters.push({ ...filter });
		});
		reportGroupFilters.current = _propertyFilter.map(filter => filter.field);

		// if (status !== 'ALL') {
		// 	filters.push({
		// 		field: 'status.keyword',
		// 		value: status,
		// 	});
		// }
		// Removed the conditional statement because clicking the cross icon in the comparison grid's global filter or selecting all dates was not updating the grid filters as expected.

		setESFilters(filters);
		setFilterToggle(!filterToggle);
		// disabling this because a dependency causes infinite loop in useEffect
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [toDate, fromDate, propertyFilter, checkNumberFilter, propertyNumberFilter]);

	useEffect(() => {
		updateFilters();
	}, [updateFilters]);

	return (
		<div className={classes.actionBar}>
			<Grid container alignItems="center" spacing={2} style={{ padding: '0px 36px 0px 45px', width: '100%' }}>
				<CustomDates
					fromDate={fromDate}
					setFromDate={setFromDate}
					toDate={toDate}
					setToDate={setToDate}
					isProperties
					lastCheckMinDate={lastCheckMinDate}
					datesInputWidth={2}
				/>
				{extraFitlers.includes('propertyGroup') && (
					<Grid item xs md={2}>
						<ReportGroupHeader
							type="Properties"
							esFilters={propertiesReportGroup || []}
							setESFilters={value => setPropertyFilter(value)}
							setFilterToggle={() => {}}
							isBackground={false}
							noUpdate={true}
							strechedWidth
							isShrink
							noPadding
						/>
					</Grid>
				)}
				{/* commenting out as it is not working currently  --KC 2024-08-06 */}
				{/* {extraFitlers.includes("status") && (
          <Grid item xs md={2}>
            <MuiThemeProvider>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="status-outlined-label">Status</InputLabel>

                <Select
                  fullWidth
                  labelId="status-outlined-label"
                  id="status-filter"
                  value={status ? status : ""}
                  className={classes.viewSwitcher}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <MenuItem value="ALL">All</MenuItem>
                  <MenuItem value="InPay">In Pay</MenuItem>
                  <MenuItem value="NotInPay">Not In Pay</MenuItem>
                </Select>
              </FormControl>
            </MuiThemeProvider>
          </Grid>
        )} */}
				{isComparisonReport && (
					<>
						{extraFitlers.includes('checkNumber') && (
							<Grid item xs style={{ minwidth: '15%' }}>
								<Autocomplete
									size="small"
									onChange={(event, newValue) => {
										setCheckNumberFilter(newValue);
									}}
									options={checkNumbers}
									renderInput={params => (
										<TextField
											{...params}
											label="Check Number"
											variant="outlined"
											placeholder=""
											style={{ backgroundColor: 'white' }}
										/>
									)}
									disableListWrap
									id="custom-date-dropdown"
								/>
							</Grid>
						)}
						{extraFitlers.includes('propertyNumber') && (
							<Grid item xs style={{ minWidth: '15%' }}>
								<Autocomplete
									size="small"
									onChange={(event, newValue) => {
										setPropertyNumberFilter(newValue);
									}}
									options={propertyNumbers}
									renderInput={params => (
										<TextField
											{...params}
											label="Property Number"
											variant="outlined"
											placeholder=""
											style={{ backgroundColor: 'white' }}
										/>
									)}
									disableListWrap
									id="custom-date-dropdown"
								/>
							</Grid>
						)}
					</>
				)}
			</Grid>
		</div>
	);
};

export default React.memo(LastCheckDateFilter);
