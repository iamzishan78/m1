import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { IconButton, Grid, Table, TableCell, TableBody, FormControl } from '@material-ui/core';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import { showErrorMessage } from 'actions';
import CreateTwoToneIcon from '@material-ui/icons/CreateTwoTone';
import AutoCompleteTypeComponent from 'components/Shared/Forms/Fields/AutoCompleteType';
import vf_number from 'components/Shared/valueformatters/vf_number';

const tableData = [
	{
		label: 'Tract Name',
		type: 'text',
		key: 'shapeLabel',
		edit: true,
	},
	{
		label: 'State',
		type: 'text',
		key: 'state',
		edit: false,
	},
	{
		label: 'Country',
		type: 'autocomplete',
		key: 'county',
		edit: false,
	},
	{
		label: 'Survey',
		type: 'autocomplete',
		key: 'survey',
		showStateTX: true,
		edit: false,
	},
	{
		label: 'Block',
		type: 'autocomplete',
		key: 'block',
		showStateTX: true,
		edit: false,
	},
	{
		label: 'Section',
		type: 'text',
		key: 'section',
		showStateTX: true,
		edit: false,
	},
	{
		label: 'Abstract',
		type: 'text',
		key: 'abstract',
		showStateTX: true,
		edit: false,
	},
	{
		label: 'Alt Survey',
		type: 'text',
		key: 'altSurvey',
		showStateTX: true,
		edit: false,
	},
	{
		label: 'Meridian',
		type: 'text',
		key: 'meridian',
		showStateTX: false,
		edit: false,
	},
	{
		label: 'Township',
		type: 'autocomplete',
		key: 'township',
		showStateTX: false,
		edit: false,
	},
	{
		label: 'Range',
		type: 'number',
		key: 'range',
		showStateTX: false,
		edit: false,
	},
	{
		label: 'Section',
		type: 'text',
		key: 'section',
		showStateTX: false,
		edit: false,
	},
	{
		label: 'Gross Acres',
		type: 'comma-number',
		key: 'sdGrossAcres',
		edit: true,
	},
	{
		label: 'Calculated Acres',
		type: 'comma-number',
		key: 'shapeArea',
		edit: false,
	},
	{
		label: 'Department',
		type: 'autocomplete',
		key: 'department',
		showStateTX: true,
		edit: true,
	},
	// {
	//   label: "Tract Status",
	//   type: "autocomplete",
	//   key: "tractStatus",
	//   edit: true,
	// },
	{
		label: 'Map Status',
		type: 'autocomplete',
		key: 'mapStatus',
		edit: true,
	},
];

const manualOptions = ['Land', 'Business Development'];

const useStyles = makeStyles(theme => ({
	table: {
		width: '100%',
		height: '100%',
		margin: '0px',
		padding: '0px',
		border: '1px solid rgba(224, 224, 224, 1)',
		// borderStyle: "none",
	},
	rowGrey: {
		background: '#f7f8f9',
		border: '0px',
	},
	rowWhite: {
		background: '#FFF',
		border: '0px',
	},
	cell1: {
		border: '0px',
		fontFamily: 'Poppins',
		fontStyle: 'normal',
		width: '43%',
		fontWeight: 'bolder',
		fontSize: '13px',
		lineHeight: '18px',
		color: 'black',
		borderRight: '1px solid rgba(224, 224, 224, 1)',
	},
	cell2: {
		border: '0px',
		fontFamily: 'Poppins',
		fontStyle: 'normal',
		fontWeight: 300,
		fontSize: '14px',
		lineHeight: '18px',
		color: '#75767A',
		height: '55px',
	},

	select: {
		'& .MuiOutlinedInput-root': {
			height: '38px',
		},
	},
	foodText: {
		position: 'absolute',
		bottom: '20px',
		right: '0px',
		fontSize: '10px',
		color: '#6e6e6e',
		margin: '0 !important',
		textAlign: 'right',
		height: '0',
		paddingRight: '10px',
		'& span': {
			fontWeight: 'bold',
		},
	},
}));

function TableTextField({ data, value, onChange, onKeyDown, onBlur, setTableDataState, showMessage, type }) {
	const classes = useStyles();
	return (
		<TextField
			size="small"
			type={data.type}
			value={value}
			variant="outlined"
			autoFocus
			onChange={e => {
				e.persist();
				onChange(e, data, type);
			}}
			onKeyDown={e => {
				if (e.keyCode === 13) {
					e.stopPropagation();
					onKeyDown(e, data, type);
					setTableDataState({});
				}
			}}
			onBlur={() => {
				onBlur(data, type);
			}}
			InputProps={{
				endAdornment: showMessage && (
					<p className={classes.foodText}>
						<span>Return</span> to save
					</p>
				),
			}}
			fullWidth
		/>
	);
}

export default function ParcelTableInfo({ properties, updateProperties, updateCustomProperties, search }) {
	const classes = useStyles();
	const dispatch = useDispatch();
	const [tableDataState, setTableDataState] = useState({});
	const [editIconState, setEditIconState] = useState({});

	const [filteredTableData, setFilteredTableData] = useState(tableData);

	const [tableTempProperties, setTableTempProperties] = useState(properties);

	const filterStateData = data => {
		if (tableTempProperties?.state === 'TX' || tableTempProperties.originalProperties?.State === 'TX') {
			setFilteredTableData(data.filter(data => data.showStateTX !== false));
		} else {
			setFilteredTableData(data.filter(data => data.showStateTX !== true));
		}
	};

	useEffect(() => {
		filterStateData(tableData.concat(properties?.custom_data_arr || []));
		properties?.custom_data_arr?.forEach(data => {
			tableTempProperties[data.key] = data.value;
			tableTempProperties[`${data.key}key`] = data.key;
		});
		setTableTempProperties({ ...tableTempProperties });
		setTableDataState({});
	}, [properties]);

	useEffect(() => {
		if (search) {
			const td = tableData.concat(properties?.custom_data_arr || []);
			const newTableData = td.filter(
				row =>
					row.key?.toLowerCase()?.startsWith(search.toLowerCase()) ||
					row.label?.toLowerCase()?.startsWith(search.toLowerCase()) ||
					tableTempProperties[row.key]?.toLowerCase()?.startsWith(search.toLowerCase())
			);

			filterStateData(newTableData);
		} else {
			filterStateData(tableData.concat(properties?.custom_data_arr || []));
		}
	}, [search]);

	const onChange = (e, data, type) => {
		const appendValue = type === 'key' ? type : '';
		setTableTempProperties({ ...tableTempProperties, [`${data.key}${appendValue}`]: e.target.value });
	};

	const onKeyDown = (e, data, type) => {
		if (type === 'value') {
			if (data.isCustom) {
				if (!tableTempProperties[`${data.key}key`]) {
					dispatch(showErrorMessage('Please provide key value first'));
					return;
				} else {
					updateCustomProperties(type, tableTempProperties[data.key], data.id);
				}
			} else updateProperties(e, data.key, tableTempProperties[data.key], data.isCustom);
		} else {
			const exists = filteredTableData.find(
				row => row.key === tableTempProperties[`${data.key}key`] && row.id !== data.id
			);
			if (exists) {
				dispatch(showErrorMessage('Key with this name already exists'));
				return;
			}
			updateCustomProperties(type, tableTempProperties[`${data.key}key`], data.id);
		}
	};

	const onBlur = (e, data, type) => {
		setTableDataState({});
		if (type === 'value') {
			setTableTempProperties({ ...tableTempProperties, [data.key]: data.isCustom ? data.value : properties[data.key] });
		} else setTableTempProperties({ ...tableTempProperties, [`${data.key}key`]: data.key });
	};

	return (
		<Table className={classes.table} size="small" aria-label="parcel table">
			<TableBody>
				{filteredTableData.map((data, index) => (
					<>
						<TableRow className={index % 2 === 0 ? classes.rowGrey : classes.rowWhite}>
							<TableCell
								className={classes.cell1}
								align="left"
								onMouseEnter={() => {
									setEditIconState({ [`${data.key}key`]: true });
								}}
								onMouseLeave={() => {
									setEditIconState({ [`${data.key}key`]: false });
								}}
							>
								{data.isCustom ? (
									<>
										{' '}
										{tableDataState[`${data.key}key`] ? (
											<TableTextField
												data={data}
												value={tableTempProperties[`${data.key}key`]}
												showMessage={tableDataState[`${data.key}key`] === true}
												onChange={onChange}
												onKeyDown={onKeyDown}
												onBlur={onBlur}
												type="key"
												setTableDataState={setTableDataState}
											/>
										) : (
											<div style={{ minWidth: '30px', cursor: 'pointer' }}>
												<Grid container direction="row" justifyContent="space-between" alignItems="center">
													<Grid item>{data.key || '-'}</Grid>
													<Grid item>
														{editIconState[`${data.key}key`] && (
															<Tooltip title={'Edit'} placement="top">
																<IconButton
																	size="small"
																	onClick={() => {
																		setTableDataState({ [`${data.key}key`]: true });
																	}}
																>
																	<CreateTwoToneIcon id="contPencilIcon" className={classes.pencilIcon} />
																</IconButton>
															</Tooltip>
														)}
													</Grid>
												</Grid>
											</div>
										)}{' '}
									</>
								) : (
									<>{data.label}</>
								)}
							</TableCell>
							<TableCell
								className={classes.cell2}
								align="right"
								onMouseEnter={() => {
									setEditIconState({ [data.key]: data.edit === false ? false : true });
								}}
								onMouseLeave={() => {
									setEditIconState({ [data.key]: false });
								}}
							>
								{tableDataState[data.key] ? (
									<>
										{data.type === 'select' && (
											<FormControl variant="outlined">
												<Select
													className={classes.select}
													fullWidth
													labelId="demo-simple-select-label"
													id="demo-simple-select"
													value={tableTempProperties[data.key]}
													onClick={e => e.stopPropagation()}
													onChange={e => {
														e.keyCode = 13;
														updateProperties(e, data.key, e.target.value);
													}}
													onBlur={() => {
														setTableDataState({});
														setTableTempProperties({ ...tableTempProperties, [data.key]: properties[data.key] });
													}}
												>
													{data.options.map(option => (
														<MenuItem value={option}>{option}</MenuItem>
													))}
												</Select>
											</FormControl>
										)}
										{(data.type === 'text' || data.type === 'number' || data.type === 'comma-number') && (
											<TableTextField
												data={data}
												value={tableTempProperties[data.key]}
												showMessage={tableDataState[data.key] === true}
												onChange={onChange}
												onKeyDown={onKeyDown}
												onBlur={onBlur}
												setTableDataState={setTableDataState}
												type="value"
											/>
										)}

										{data.type === 'textarea' && (
											<TableTextField
												data={data}
												value={tableTempProperties[data.key]}
												showMessage={tableDataState[data.key] === true}
												onChange={onChange}
												onKeyDown={onKeyDown}
												onBlur={onBlur}
												setTableDataState={setTableDataState}
												type="value"
											/>
										)}

										{data.type === 'autocomplete' && (
											<>
												<AutoCompleteTypeComponent
													data={data}
													value={properties[data.key]}
													manualOptions={manualOptions}
													shapeType={'Parcel'}
													typeKey={data.key}
													onBlur={() => {
														setTableDataState({});
														setTableTempProperties({ ...tableTempProperties, [data.key]: properties[data.key] });
													}}
													onChange={(e, value) => {
														e.keyCode = 13;
														if (value?.name) updateProperties(e, data.key, value.name);
													}}
												/>
											</>
										)}
									</>
								) : (
									<div style={{ minWidth: '30px', cursor: data.edit !== false ? 'pointer' : 'none' }}>
										<Grid container direction="row" justifyContent="space-between" alignItems="center">
											<Grid item>
												{data.type !== 'comma-number'
													? data.value || properties[data.key] || '-'
													: vf_number(data.value) || vf_number(properties[data.key]) || '-'}
											</Grid>
											<Grid item>
												{editIconState[data.key] && (
													<Tooltip title={'Edit'} placement="top">
														<IconButton
															size="small"
															onClick={() => {
																setTableDataState({ [data.key]: true });
															}}
														>
															<CreateTwoToneIcon id="contPencilIcon" className={classes.pencilIcon} />
														</IconButton>
													</Tooltip>
												)}
											</Grid>
										</Grid>
									</div>
								)}
							</TableCell>
						</TableRow>
					</>
				))}
			</TableBody>
		</Table>
	);
}
