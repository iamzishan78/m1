import { Breadcrumbs, Typography, IconButton } from '@material-ui/core';
import { Menu, MenuItem } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import get from 'lodash/get';
import moment from 'moment';
import React, { useContext, useState } from 'react';
import { useDispatch } from 'react-redux';

import { setCurrentUserGridViewAction } from 'store/actions/sessionActions';

import { AppContext } from '../../../AppContext';
import { AutoCompleteFilter } from '../AutoCompleteFilter';

export const handleTagColumn = (TableHeader, cleanAvailableTags) => {
	return cleanAvailableTags.length > 0
		? TableHeader.map(column => {
				if (column.name === 'tags') {
					return {
						...column,
						options: {
							...column.options,
							filterOptions: {
								...column.options.filterOptions,
								names: cleanAvailableTags,
							},
						},
					};
				}
				return column;
			})
		: TableHeader.map(column => {
				if (column.name === 'tags') {
					return {
						...column,
						options: {
							...column.options,
							filter: false,
						},
					};
				}
				return column;
			});
};

export const handleCustomFilterColumns = (TableHeader, filterObject) => {
	return filterObject && Object.keys(filterObject)?.length > 0
		? TableHeader.map(column => {
				if (Object.keys(filterObject).includes(column.name)) {
					return {
						...column,
						options: {
							...column.options,
							filterOptions: {
								...column.options.filterOptions,
								names: filterObject[column.name]?.map(el => el._id),
							},
						},
					};
				}
				return column;
			})
		: TableHeader;
};

export const setColumnDisplayAndFilter = (TableHeader, selectedGridView, column) => {
	if (!TableHeader) {
		return;
	}
	if (selectedGridView?.columns) {
		const col = selectedGridView.columns.find(col => col.name === column.name);
		if (col && typeof col.display !== 'undefined') {
			column.options.display = col.display;
			if (col.hasOwnProperty('viewColumns')) {
				column.options.viewColumns = col.viewColumns;
			}
			if (column.esKey && !column.noFilter) {
				column.options.filter = true;
			}
		} else if (column.name !== ' ') {
			const tableHeaderCol = TableHeader.find(tH => tH.name === column.name);
			if (tableHeaderCol) {
				if (typeof tableHeaderCol?.options?.display !== 'undefined') {
					column.options.display = tableHeaderCol.options.display;
				}
				if (typeof tableHeaderCol?.options?.filter !== 'undefined') {
					column.options.filter = tableHeaderCol.options.filter;
				}
			} else {
				column.options.display = false;
				column.options.filter = false;
			}
		}
	} else {
		if (TableHeader.find(col => col.name === column.name)?.options?.display !== false) {
			column.options.display = true;
			if (column.esKey && !column.noFilter) {
				column.options.filter = true;
			}
		} else if (
			TableHeader.find(col => col.name === column.name).options.forceFilter !== undefined &&
			TableHeader.find(col => col.name === column.name).options.forceFilter
		) {
			column.options.display = false;
			column.options.filter = true;
		} else {
			column.options.display = false;
			column.options.filter = false;
		}
	}
};

export const setColumnsData = (
	TableHeader,
	filters,
	columns,
	setColumns,
	setFilters,
	query,
	esIndex,
	extendSearchQuery = '',
	searchFields
) => {
	columns.forEach((column, index) => {
		const tableCol = TableHeader.find(el => el.name === column.name);
		if (column?.options?.filter) {
			const custom = column.custom;
			const multiple = column.type === 'multiselect' ? true : !!column?.options?.multiple;
			column.options = {
				...tableCol.options,
				...column.options,
				filter: true,
				filterType: 'custom',
				filterList: undefined,
				customFilterListOptions: {
					render: v =>
						v?.map(l =>
							l === 'true' && column?.options?.forceFilter
								? 'Yes'
								: l === 'false' && column?.options?.forceFilter
									? 'No'
									: l
						),
				},
				filterOptions: {
					display: (filterList, onChange, index, column) => {
						column.filterKey = TableHeader.find(el => el.name === column.name)?.esKey;
						return (
							<AutoCompleteFilter
								multiple={multiple}
								esIndex={esIndex}
								setFilters={setFilters}
								filterList={filterList}
								column={column}
								index={index}
								onChange={onChange}
								query={query}
								extendSearchQuery={extendSearchQuery}
								custom={custom}
								searchFields={searchFields}
							/>
						);
					},
				},
				// onFilterChange: (columnChanged, filterList) => {
				//   setFilters(filterList);
				// },
			};
		}

		//Convert format of isotype date to MM/DD/YYYY format
		if (column.custom?.isDate && columns?.length) {
			let filterList = Array.isArray(column.esKey) ? undefined : [];
			if (column?.options?.filter && column?.options?.filterList?.length > 0) {
				let value = column.options.filterList;
				value = value.map(v => moment(new Date(v)).format('MM/DD/YYYY'));
				filterList = value;

				column.options.filterList = filterList;
			}
		}
	});

	setColumns(columns);
};

export const handleSelectedGridChange = (TableHeader, selectedGridView, columns, isGridChanged = false) => {
	if (selectedGridView?.filters) {
		columns.forEach((column, index) => {
			setColumnDisplayAndFilter(TableHeader, selectedGridView, column);
			if (isGridChanged) {
				const value =
					selectedGridView?.filters
						?.filter(filter => {
							return JSON.stringify(filter.field) === JSON.stringify(column.esKey);
						})
						?.map(filter => filter.value) || [];

				let filterList = Array.isArray(column.esKey) ? undefined : [];
				if (value) {
					filterList = value;
				}
				if (column?.options?.filter) {
					column.options.filterList = filterList;
				}
			}
		});
	} else {
		columns.forEach((column, index) => {
			setColumnDisplayAndFilter(TableHeader, selectedGridView, column);
			if (isGridChanged) {
				if (column.options) {
					column.options.filterList = Array.isArray(column.esKey) ? undefined : [];
				}
			}
		});
	}
	return columns;
};

export const HeaderComponent = ({
	Icon,
	label,
	selectedGridView = {
		type: 'Default',
	},
	setShowViewModal,
	showViewModal,
	setShowSaveAsNew,
	selectedFilters,
	updateGridView,
	columns,
}) => {
	const dispatch = useDispatch();
	const [stateApp, setStateApp] = useContext(AppContext);

	const [showIcon, setShowIcon] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleClick = event => {
		setAnchorEl(event.currentTarget);
	};

	return (
		<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
			<IconButton onClick={() => setShowViewModal(!showViewModal)}>
				<Icon />
			</IconButton>

			<Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
				<Typography
					style={{
						marginLeft: '10px',
						fontSize: '16px',
					}}
					color="inherit"
				>
					{label}
				</Typography>
				<div>
					<div
						style={{
							display: 'flex',
							color: '#18AADD',
							fontSize: '16px',
							cursor: 'pointer',
						}}
						onClick={event => handleClick(event)}
						onMouseOver={() => setShowIcon(true)}
						onMouseLeave={() => setShowIcon(false)}
					>
						<Typography>
							<span style={selectedGridView.isModified ? { 'font-style': 'italic' } : {}}>{selectedGridView.name}</span>
						</Typography>
						<span
							style={{
								height: '0px',
								color: '#18AADD',
								fontSize: '16px',
								cursor: 'pointer',
							}}
						>
							{showIcon && <ExpandMoreIcon />}
						</span>
					</div>
					<Menu
						style={{ zIndex: '1305' }}
						id="menu"
						anchorEl={anchorEl}
						keepMounted
						open={Boolean(anchorEl)}
						onClose={handleClose}
						getContentAnchorEl={null}
						anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
						transformOrigin={{ vertical: 'top', horizontal: 'center' }}
					>
						<MenuItem
							style={{ width: '250px' }}
							onClick={() => {
								handleClose();
								updateGridView({
									variables: {
										gridView: {
											_id: selectedGridView._id,
											filters: selectedFilters,
											columns: columns.map(col => ({
												name: col.name,
												display: col.options.display,
											})),
										},
									},
									refetchQueries: ['getGridViews'],
									awaitRefetchQueries: true,
								});
								dispatch(
									setCurrentUserGridViewAction.STARTED({
										gridViewId: selectedGridView._id,
										userId: stateApp.user.mongoId,
									})
								);
							}}
							disabled={selectedGridView.type === 'Default' || selectedGridView.name === 'All Contacts'}
						>
							Update view
						</MenuItem>
						<MenuItem
							onClick={() => {
								handleClose();
								setShowViewModal(true);
								setShowSaveAsNew(true);
							}}
						>
							Save as new view
						</MenuItem>
					</Menu>
				</div>
			</Breadcrumbs>
		</div>
	);
};

export const colorPallete = [
	{
		id: 1,
		color: '#C5C2C2',
		textColor: 'black',
	},
	{
		id: 2,
		color: '#FA7668',
		textColor: 'black',
	},
	{
		id: 3,
		color: '#F3936F',
		textColor: 'black',
	},
	{
		id: 4,
		color: '#F4BC67',
		textColor: 'black',
	},
	{
		id: 5,
		color: '#FADA6E',
		textColor: 'black',
	},
	{
		id: 6,
		color: '#ADC351',
		textColor: 'black',
	},
	{
		id: 7,
		color: '#569781',
		textColor: 'white',
	},
	{
		id: 8,
		color: '#2B949D',
		textColor: 'white',
	},
	{
		id: 9,
		color: '#A2D6D6',
		textColor: 'black',
	},
	{
		id: 10,
		color: '#4072D1',
		textColor: 'white',
	},
	{
		id: 11,
		color: '#9190E3',
		textColor: 'white',
	},
	{
		id: 12,
		color: '#B084C3',
		textColor: 'white',
	},
	{
		id: 13,
		color: '#F7BFF1',
		textColor: 'black',
	},
	{
		id: 14,
		color: '#EC8AB2',
		textColor: 'white',
	},
	{
		id: 15,
		color: '#FCA6A0',
		textColor: 'black',
	},
	{
		id: 16,
		color: '#6D6E6F',
		textColor: 'white',
	},
];
