import React, { useEffect, forwardRef, useState, useMemo } from 'react';

import { TablePagination } from '@material-ui/core';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

import get from 'lodash/get';
import MaterialTable from 'material-table';

import { jobController } from 'hookstate/jobStateController';

import { AppContext } from '../../../AppContext';

const tableIcons = {
	Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
	Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
	Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
	Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
	DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
	Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
	Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
	Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
	FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
	LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
	NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
	PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
	ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
	Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
	SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
	ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
	ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

const main_div = {
	textAlign: 'center',
	padding: '1.5vh',
};
const big_text = {
	fontSize: '20px',
	fontWeight: 'bold',
	color: '#504D4D',
};
const padding_div_top = {
	paddingTop: '4vh',
};
const table = {
	maxWidth: '90vw',
	margin: 'auto',
};

export default function MaterialTableDemo() {
	const { m1neralHeaders, jobStateValues, csvDataToSend } = jobController.useState(
		['csvDataToSend', 'uploaderFormValues', 'm1neralHeaders', 'options'],
		'jobStateValues'
	);

	const [row, setRows] = useState([]);
	const [tableLoading, setTableLoading] = useState(false);

	let columns = useMemo(() => {
		const actual_columns = jobStateValues.m1neralHeaders.map(element => ({
			...element,
			title: element.label,
			field: element.actual_key,
		}));

		return actual_columns;
	}, [m1neralHeaders]);

	const checkProperties = obj => {
		for (var key in obj) {
			if (obj[key] !== null && obj[key] != '') {
				return false;
			}
		}
		return true;
	};

	useEffect(() => {
		let temp_state = [];
		jobStateValues.csvDataToSend.forEach(element => {
			let temp = { ...element };
			temp.leadSource = null;
			temp.tableData = null;
			if (checkProperties(temp) === false) {
				temp_state.push({ ...element, ...get(jobStateValues, 'uploaderFormValues', {}) });
			}
		});

		jobController.updateState({
			csvDataToSend: temp_state,
		});
	}, []);

	const checkAndParseData = () => {
		let rowsData = jobStateValues.csvDataToSend;
		const columnsData = columns;
		columnsData.forEach(col => {
			rowsData.forEach((data, index) => {
				const key = data[col.actual_key];
				if (col.data_type && key) {
					if (typeof key === 'string' && col.data_type === 'number') {
						try {
							rowsData[index][col.actual_key] = parseInt(rowsData[index][col.actual_key]);
						} catch (e) {
							rowsData[index].invalidKey = col.actual_key;
							rowsData[index].reason = 'Invalid data -> number is required for this field';
						}
					} else if (typeof key === 'number' && col.data_type === 'string') {
						try {
							rowsData[index][col.actual_key] = rowsData[index][col.actual_key].toString();
						} catch (e) {
							rowsData[index].invalidKey = col.actual_key;
							rowsData[index].reason = 'Invalid data -> string is required for this field';
						}
					} else if (col.data_type === 'id' && !(typeof key === 'string' && key.match(/^[0-9a-fA-F]{24}$/))) {
						rowsData[index].invalidKey = col.actual_key;
						rowsData[index].reason = 'Invalid data -> mongo id is required for this field';
					} else if (
						col.data_type === 'date' &&
						typeof key === 'string' &&
						isNaN(Date.parse(rowsData[index][col.actual_key]))
					) {
						rowsData[index].invalidKey = col.actual_key;
						rowsData[index].reason = 'Invalid data -> mongo date format is wrong';
					} else if (
						col.data_type === 'email' &&
						typeof key === 'string' &&
						!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rowsData[index][col.actual_key])
					) {
						rowsData[index].invalidKey = col.actual_key;
						rowsData[index].reason = 'Invalid email';
					} else if (typeof key !== col.data_type && col.data_type !== 'date' && col.data_type !== 'email') {
						rowsData[index].invalidKey = col.actual_key;
						rowsData[index].reason = 'Invalid data';
					}
				}
			});
		});
		return rowsData;
	};

	const checkForRequiredField = rowsData => {
		jobStateValues?.options?.required?.split('||');
		return rowsData;
	};

	useEffect(() => {
		setTableLoading(true);
		let rowsData = checkAndParseData();
		rowsData = checkForRequiredField(rowsData);
		setRows(rowsData);
		setTableLoading(false);
	}, [csvDataToSend]);

	return (
		<div style={main_div}>
			<div style={{ ...big_text, ...padding_div_top }}>
				Review the data to be uploaded based on the mapping of M1neral headers that were selected.
			</div>
			<div id="materialTable" style={{ ...padding_div_top, ...table }}>
				<MaterialTable
					title={`Contacts ${row.filter(r => r.invalidKey).length > 0 ? `( Invalid record ${row.filter(r => r.invalidKey).length}` : ''} )`}
					icons={tableIcons}
					columns={columns}
					data={row}
					options={{
						rowStyle: rowData => {
							return { backgroundColor: rowData.invalidKey ? 'red' : 'white' };
						},
					}}
					editable={{
						onRowAdd: jobController.onRowAdd,
						onRowUpdate: jobController.onRowUpdate,
						onRowDelete: jobController.onRowDelete,
					}}
					components={{
						Pagination: props => <TablePagination {...props} rowsPerPageOptions={[10, 25, 50, 100, 500, 1000]} />,
					}}
					isLoading={tableLoading}
				/>
			</div>
		</div>
	);
}
