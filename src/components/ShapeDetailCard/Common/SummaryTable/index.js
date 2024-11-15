import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { set, get, upperFirst, capitalize } from 'lodash';
import TextField from '@material-ui/core/TextField';
import moment from 'moment';
import { IconButton, Grid, Table, TableCell, TableBody, FormControl, CircularProgress } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import AutorenewIcon from '@material-ui/icons/Autorenew';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import { showErrorMessage, showInfoMessage } from 'actions';
import CreateTwoToneIcon from '@material-ui/icons/CreateTwoTone';
import AutoCompleteTypeComponent from 'components/Shared/Forms/Fields/AutoCompleteType';
import { summaryTableStyles } from 'components/ShapeDetailCard/style';
import UserList from 'components/Shared/UserList';
import CampaignNameField from 'components/ContactDetailCard/components/FieldContent/CampaignNameField';
import vf_currency from 'components/Shared/valueformatters/vf_currency';
import vf_number from 'components/Shared/valueformatters/vf_number';
import { getCustomMetaFields } from 'components/Shared/Agreement/helpers';
import { getRoundedNra, validateUrl } from 'utils/helper';
import ReactSelectField from 'components/Shared/M1nTable/components/SubComponents/ReactSelectField';
import { copy } from 'components/Shared/functions';
import { AppContext } from 'AppContext';
import StateField from 'components/Revenue/components/Properties/DetailComponents/State';
import CountyField from 'components/Revenue/components/Properties/DetailComponents/County';
import { AutoCompleteLandgrid } from 'components/Shared/Forms/Fields/AutoCompleteLandgrid';
import { US_STATES_CODES } from 'utils/data';
import filterConsts from 'components/Table/TableAddDialog/Common/filterConsts';
import { hookstate, useHookstate } from '@hookstate/core';
import { globalStateController } from 'hookstate/globalStateController';
import NumberField from 'components/Shared/components/Fields/NumberField';
import DateField from 'components/Shared/components/Fields/DateField';
import CustomTextField from 'components/Shared/components/Fields/CustomTextField';
import LinkPopup from 'components/Shared/components/Popups/Link';

function TableTextField({ data, value, onChange, onKeyDown, onBlur, onWheel, showMessage, type, InputProps, loading }) {
	const dispatch = useDispatch();
	const classes = summaryTableStyles();
	// match unit nra value with system generated nra
	const getNraClass = () => {
		if (value.unitNra === value.calculatedNra) return '';
		return classes.baseValueChanged;
	};

	return (
		<div style={{ position: 'relative' }}>
			<TextField
				size="small"
				type={data.type === 'calculation' ? 'number' : data.type}
				value={data.type === 'calculation' ? value.unitNra : value}
				variant="outlined"
				autoFocus
				onChange={e => {
					e.persist();
					onChange(e, data, type);
				}}
				data-testid={`data-field-${data.label}`}
				onKeyDown={e => {
					if (e.keyCode === 13) {
						e.stopPropagation();
						if (['uName', 'shapeLabel'].includes(data.key) && !e.target.value?.trim())
							// validate after trimming the value
							dispatch(showInfoMessage('Name field cannot be empty'));
						else onKeyDown(e, data, type);
					}
				}}
				onWheel={onWheel ? onWheel : () => {}}
				onBlur={() => {
					onBlur(data, type);
				}}
				className={data.type === 'calculation' ? getNraClass() : ''}
				InputProps={{
					...InputProps,
					startAdornment: showMessage && (
						<p className={classes.foodText}>
							<span>Return</span> to save
						</p>
					),
					endAdornment: loading ? <CircularProgress color="secondary" size={40} /> : null,
				}}
				fullWidth
			/>

			{data.type === 'calculation' && value.unitNra !== value.calculatedNra && (
				<IconButton
					className={classes.positionRenewIcon}
					aria-label="toggle royality-acres"
					onMouseDown={e => e.preventDefault()}
					onMouseUp={e => onKeyDown(e, data, 'calculation')}
				>
					<AutorenewIcon style={{ color: 'dodgerblue' }} />
				</IconButton>
			)}
		</div>
	);
}
const editIconState = hookstate({});

function EditIconComponent({ data, dataKey, classes, onClick }) {
	const state = useHookstate(editIconState[dataKey]);

	return (
		<>
			{state.get() && (
				<Tooltip title={'Edit'} placement="top">
					<IconButton size="small" onClick={onClick} data-testid={`edit-${data.label}`}>
						<CreateTwoToneIcon id="contPencilIcon" className={classes.pencilIcon} />
					</IconButton>
				</Tooltip>
			)}
		</>
	);
}

export default function SummaryTableInfo({
	tableData,
	properties,
	updateProperties,
	updateCustomProperties,
	search,
	metaData = [],
	id,
	updating,
	isCustomLayerAutoComplete,
}) {
	const classes = summaryTableStyles();
	const dispatch = useDispatch();
	const [, setStateApp] = useContext(AppContext);
	const [tableDataState, setTableDataState] = useState({});
	const [state, setState] = useState();
	const [county, setCounty] = useState();
	const [tooltipVisible, setTooltipVisible] = useState({});

	const [filteredTableData, setFilteredTableData] = useState(tableData);

	// Data fix for tract
	if (properties?.originalProperties?.StateAbbreviation)
		properties.originalProperties.State = properties?.State || properties?.originalProperties?.StateAbbreviation;
	if (properties?.originalProperties?.ShortName)
		properties.originalProperties.Section = properties?.Section || properties?.originalProperties?.ShortName;
	if (properties?.originalProperties?.PrincipalMeridian)
		properties.originalProperties.Meridian = properties?.Meridian || properties?.originalProperties?.PrincipalMeridian;
	// Data fix for tract
	const [tableTempProperties, setTableTempProperties] = useState(properties);

	useEffect(() => {
		const customMetaData = getCustomMetaFields(properties, metaData);
		if (customMetaData.length === 0) return;
		let filteredKeys = tableData.concat(customMetaData);
		customMetaData.forEach(md => {
			if (!md.isCustomData) {
				set(tableTempProperties, md.key, md.value);
				set(tableTempProperties, [`${md.key}key`], md.key);
			}
		});

		set(tableTempProperties, 'netRoyalityAcres', properties.netRoyalityAcres);
		setFilteredTableData(filteredKeys);
		setTableTempProperties(copy(tableTempProperties));
		setTableDataState({});
		if (properties?.originalProperties?.State || properties?.originalProperties?.StateAbbreviation) {
			setState(properties.originalProperties.State || properties.originalProperties.StateAbbreviation);
		}
		if (properties?.originalProperties?.County) {
			setCounty(properties.originalProperties.County);
		}
	}, [properties, metaData]);

	useEffect(() => {
		// Check if the search input is not empty
		if (search) {
			// Retrieve custom meta fields using the provided function
			const customMetaData = getCustomMetaFields(properties, metaData);

			// Concatenate table data with custom meta data
			const td = tableData.concat(customMetaData);

			// Filter the table data based on the search input
			const newTableData = td.filter(
				row =>
					// Check if row key contains the search input
					(row.key && typeof row.key === 'string' && row.key.toLowerCase().includes(search.toLowerCase())) ||
					// Check if row label contains the search input
					(row.label && typeof row.label === 'string' && row.label.toLowerCase().includes(search.toLowerCase())) ||
					// Check if temporary table properties contain the search input
					(tableTempProperties[row.key] &&
						typeof tableTempProperties[row.key] === 'string' &&
						tableTempProperties[row.key].toLowerCase().includes(search.toLowerCase()))
			);

			// Set the filtered table data
			setFilteredTableData(newTableData);
		} else {
			// If search input is empty, retrieve custom meta fields
			const customMetaData = getCustomMetaFields(properties, metaData);

			// Concatenate table data with custom meta data
			const td = tableData.concat(customMetaData);

			// Set the filtered table data to the concatenated table data
			setFilteredTableData(td);
		}
	}, [search, tableData]);

	const getKey = (data, type, e) => {
		const appendValue = type === 'key' ? type : '';
		if (appendValue) {
			data.key = e.target.value;
			return `${data.key}${appendValue}`;
		}
		return `${data.key}`;
	};

	const onChange = (e, data, type) => {
		const obj = { ...tableTempProperties };

		if (data.key === 'netRoyalityAcres') {
			set(tableTempProperties, 'netRoyalityAcres.unitNra', e.target.value);
			setTableTempProperties(copy(tableTempProperties));
		} else {
			const key = getKey(data, type, e);
			set(obj, key, e.target.value);
			setTableTempProperties(obj);
			if (type === 'key') setTableDataState({ [key]: true });
		}
	};

	const onKeyDown = (e, data, type) => {
		if (type === 'value') {
			if (data.key === 'netRoyalityAcres') {
				e.target.value = parseFloat(e.target.value).toFixed(8);
				set(tableTempProperties, 'netRoyalityAcres.unitNra', e.target.value);
				setTableTempProperties(copy(tableTempProperties));
			}
			if (data.isCustom || data.isCustomData) {
				if (!get(tableTempProperties, `${data.key}key`) && !data.isCustomData) {
					dispatch(showErrorMessage('Please provide key value first'));
					return;
				} else {
					updateCustomProperties(type, get(tableTempProperties, `${data.key}`), data.key, data.id);
				}
			} else {
				updateProperties(e, data.key, get(tableTempProperties, `${data.key}`), data.isCustom);
			}
		} else {
			if (type === 'calculation') {
				if (tableTempProperties?.netRoyalityAcres?.calculatedNra) {
					tableTempProperties.netRoyalityAcres.unitNra = tableTempProperties?.netRoyalityAcres?.calculatedNra;
					setTableTempProperties(copy(tableTempProperties));
					updateProperties(e, data.key, { ...tableTempProperties.netRoyalityAcres }, data.isCustom);
				}
			} else {
				const exists = filteredTableData.find(
					row => row.key === get(tableTempProperties, `${data.key}key`) && row.id !== data.id
				);
				if (exists) {
					dispatch(showErrorMessage('Key with this name already exists'));
					return;
				}
				updateCustomProperties(type, get(tableTempProperties, `${data.key}key`), data.key, data.id);
			}
		}
	};

	const onBlur = (e, data, type) => {
		setTableDataState({});
		if (type === 'value') {
			setTableTempProperties({ ...tableTempProperties, [data.key]: data.isCustom ? data.value : properties[data.key] });
		} else setTableTempProperties({ ...tableTempProperties, [`${data.key}key`]: data.key });
	};

	const checkFieldChange = (e, data, type, func) => {
		func(e, data, type);
	};

	// match unit nra value with system generated nra
	const isNraMatched = () => {
		if (properties?.netRoyalityAcres?.unitNra === properties?.netRoyalityAcres?.calculatedNra) return true;
		return false;
	};

	const getDependencies = useCallback(
		deps => {
			const dependency = {
				state: { field: 'level1Name.keyword', value: US_STATES_CODES[get(properties, filterConsts.state.key)] },
				county: { field: 'level2Name.keyword', value: get(properties, filterConsts.county.key) },
				survey: { field: 'level3Name.keyword', value: get(properties, filterConsts.survey.key) },
				meridian: { field: 'level3Name.keyword', value: get(properties, filterConsts.meridian.key) },
				block: { field: 'level4Name.keyword', value: get(properties, filterConsts.block.key) },
				section: { field: 'level5Name.keyword', value: get(properties, filterConsts.section.key) },
				townshipRange: {
					field: 'level5Name.keyword',
					value:
						get(properties, filterConsts.township.key) && get(properties, filterConsts.township.key)
							? `${get(properties, filterConsts.township.key)} ${get(properties, filterConsts.range.key)}`
							: '',
				},
				abstract: { field: 'level6Name.keyword', value: get(properties, filterConsts.abstract.key) },
				sectiontx: { field: 'level6Name.keyword', value: get(properties, filterConsts.sectiontx.key) },
			};
			const dependencies = [];
			deps?.forEach(dep => {
				if (dependency[dep].value) dependencies.push(dependency[dep]);
			});

			return dependencies;
		},
		[properties]
	);

	const newOptionFilters = useCallback(
		data => {
			return data.dependencyArray.reduce((acc, val) => {
				if (val === 'townshipRange') {
					return {
						...acc,
						[isCustomLayerAutoComplete ? 'originalProperties.Township' : 'township']: get(
							properties,
							'originalProperties.Township'
						),
						[isCustomLayerAutoComplete ? 'originalProperties.Range' : 'range']: get(
							properties,
							'originalProperties.Range'
						),
					};
				}
				return {
					...acc,
					[isCustomLayerAutoComplete ? `originalProperties.${capitalize(val)}` : val]: get(
						properties,
						filterConsts[val].key
					),
				};
			}, {});
		},
		[properties]
	);

	const autoCompleteLandgridFilters = useCallback(
		data => {
			return [{ field: data.filterField, value: upperFirst(data.esKey) }, ...getDependencies(data.dependencyArray)];
		},
		[properties]
	);

	const handleLinkClick = (e, key) => {
		e.stopPropagation();
		setTooltipVisible(prev => ({ ...prev, [key]: false }));
	};

	return (
		<Table className={classes.table} size="small" aria-label="unit table">
			<TableBody>
				{filteredTableData.map((data, index) => (
					<>
						<TableRow className={index % 2 === 0 ? classes.rowGrey : classes.rowWhite}>
							<TableCell
								className={classes.cell1}
								align="left"
								onMouseEnter={() => {
									editIconState.set({ [`${data.key}key`]: true });
								}}
								onMouseLeave={() => {
									editIconState.set({ [`${data.key}key`]: false });
								}}
							>
								{data.isCustom || data.isCustomData ? (
									<>
										{' '}
										{tableDataState[`${data.key}key`] ? (
											<TableTextField
												data={data}
												value={tableTempProperties[`${data.key}key`]}
												showMessage={tableDataState[`${data.key}key`] === true}
												onChange={(e, data, type) => {
													checkFieldChange(e, data, type, onChange);
												}}
												onKeyDown={(e, data, type) => {
													checkFieldChange(e, data, type, onKeyDown);
												}}
												onBlur={(e, data, type) => {
													checkFieldChange(e, data, type, onBlur);
												}}
												type="key"
											/>
										) : (
											<div style={{ minWidth: '30px', cursor: 'pointer' }}>
												<Grid container direction="row" justifyContent="space-between" alignItems="center">
													<Grid item md={10}>
														{data.label || '-'}
													</Grid>

													<Grid item md={2}>
														{
															<EditIconComponent
																data={data}
																dataKey={`${data.key}key`}
																onClick={() => {
																	if (data.isCustom) {
																		setTableDataState({ [`${data.key}key`]: true });
																	} else {
																		setStateApp(stateApp => ({
																			...stateApp,
																			selectedMeta: data,
																		}));
																		globalStateController.updateState({
																			showFieldModal: true,
																		});
																	}
																}}
																classes={classes}
															/>
														}
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
								data-testid={`data-cell-${data.label}`}
								onMouseEnter={() => {
									editIconState.set({ [data.key]: true });
									const isValidURL = validateUrl(get(tableTempProperties, `${data.key}`, ''));
									setTooltipVisible(prev => ({ ...prev, [data.key]: isValidURL }));
								}}
								onMouseLeave={() => {
									editIconState.set({ [data.key]: false });
									setTooltipVisible(prev => ({ ...prev, [data.key]: false }));
								}}
							>
								{tableDataState[data.key] ? (
									<>
										{(data.type === 'select' || data.type === 'dropdown') && (
											<FormControl fullWidth margin="dense">
												<ReactSelectField
													isSingleSelect={true}
													fullWidth
													index={`field${index}`}
													dropdownOptions={data.options}
													column={data}
													value={get(properties, data.key) ?? []}
													onCustomKeyChange={value => {
														set(tableTempProperties, data.key, value);
														setTableTempProperties(tableTempProperties);
														updateProperties(null, data.key, value);
													}}
												/>
											</FormControl>
										)}
										{data.type === 'multiselect' && (
											<FormControl fullWidth margin="dense">
												<ReactSelectField
													fullWidth
													index={`field${index}`}
													dropdownOptions={data.options}
													column={data}
													value={get(properties, data.key) ?? []}
													onCustomKeyChange={value => {
														set(tableTempProperties, data.key, value);
														setTableTempProperties(tableTempProperties);
														updateProperties(null, data.key, value);
													}}
												/>
											</FormControl>
										)}
										{data.type === 'calculation' && (
											<TableTextField
												data={data}
												value={get(tableTempProperties, data.key) || 0}
												showMessage={tableDataState[data.key] === true}
												onChange={(e, data, type) => {
													checkFieldChange(e, data, type, onChange);
												}}
												onKeyDown={(e, data, type) => {
													checkFieldChange(e, data, type, onKeyDown);
												}}
												onBlur={(e, data, type) => {
													checkFieldChange(e, data, type, onBlur);
												}}
												onWheel={e => e.target.blur()}
												type="value"
												InputProps={data.InputProps}
											/>
										)}
										{(data.type === 'text' || data.type === 'currency' || data.type === 'comma-number') && (
											<>
												{data.isCustom || data.isCustomData ? (
													<CustomTextField
														id={`field-${data.key}`}
														index={data.key}
														field={data}
														fieldKey={data.key}
														defaultValue={get(tableTempProperties, `${data.key}`, '')}
														showLinkPopup={false}
														offClickHandler={(key, value) => {
															set(tableTempProperties, key, value);
															setTableTempProperties(tableTempProperties);
															updateProperties(null, key, value);
														}}
													/>
												) : (
													<TableTextField
														data={data}
														value={get(tableTempProperties, `${data.key}`)}
														showMessage={tableDataState[data.key] === true}
														onChange={(e, data, type) => {
															checkFieldChange(e, data, type, onChange);
														}}
														onKeyDown={(e, data, type) => {
															checkFieldChange(e, data, type, onKeyDown);
														}}
														onBlur={(e, data, type) => {
															checkFieldChange(e, data, type, onBlur);
														}}
														onWheel={e => e.target.blur()}
														type="value"
														InputProps={data.InputProps}
														loading={updating}
													/>
												)}
											</>
										)}
										{data.type === 'number' && (
											<NumberField
												id={`field-${data.key}`}
												index={index}
												field={data}
												fieldKey={data.key}
												defaultValue={get(tableTempProperties, `${data.key}`, '')}
												offClickHandler={(key, value) => {
													set(tableTempProperties, key, value);
													setTableTempProperties(tableTempProperties);
													updateProperties(null, key, value);
												}}
											/>
										)}
										{data.type === 'date' && (
											<DateField
												id={`field-${data.key}`}
												index={index}
												field={data}
												fieldKey={data.key}
												defaultValue={get(tableTempProperties, `${data.key}`, '')}
												offClickHandler={(key, value) => {
													set(tableTempProperties, key, value);
													setTableTempProperties(tableTempProperties);
													updateProperties(null, key, value);
												}}
											/>
										)}
										{data.type === 'autocomplete' && (
											<>
												<AutoCompleteTypeComponent
													data={data}
													value={properties[data.key]}
													shapeType={'Unit'}
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
										{data.type === 'autocompletelandgrid' && (
											<AutoCompleteLandgrid
												value={get(properties, data.key)}
												filterKey={data.filterKey}
												filters={autoCompleteLandgridFilters(data)}
												label={data.label}
												onBlur={() => {
													setTableDataState({});
													setTableTempProperties({ ...tableTempProperties, [data.key]: properties[data.key] });
												}}
												onChange={(e, value) => {
													e.keyCode = 13;
													if (value?.key && e.keyCode === 13) updateProperties(e, data.key, value.key);
												}}
												autoFocus={false}
												newOptions={data.newOptions !== false}
												newOptionFilters={newOptionFilters(data)}
												autoCompleteType={true ? 'CustomLayer' : 'AgreementShapeOwner'}
											/>
										)}
										{data.type === 'custom' && (
											<>
												{console.log('data 2', data)}
												{['qualifier', 'reviewer'].includes(data.key) && (
													<UserList
														id={data.key + 'Input'}
														value={properties[data.key]}
														setValue={user => {
															updateProperties(null, data.key, user);
														}}
													/>
												)}
											</>
										)}
										{data.type === 'state' && (
											<>
												<StateField
													shrink
													value={state}
													onStateChange={selectedState => {
														setState(selectedState.acronym);
														setCounty('');
														updateProperties(null, 'state', selectedState.acronym);
													}}
												/>
											</>
										)}
										{data.type === 'county' && (
											<CountyField
												// label="County"
												shrink
												value={county}
												state={state}
												onCountyChange={selectedCounty => {
													setCounty(selectedCounty ? selectedCounty.county : '');
													updateProperties(null, 'county', selectedCounty ? selectedCounty.county : '');
												}}
											/>
										)}
									</>
								) : (
									<div style={{ minWidth: '30px', cursor: 'pointer', maxWidth: '14vw' }}>
										<Grid
											style={{ display: 'flex' }}
											container
											direction="row"
											justifyContent="space-between"
											alignItems="center"
										>
											{data.formatValue ? (
												<Grid item style={{ overflowWrap: 'break-word' }}>
													{data.formatValue(data.value || properties[data.key]) || '-'}
												</Grid>
											) : (
												<Grid item style={{ width: '100%', overflowWrap: 'break-word', position: 'relative' }}>
													{data.type === 'date' &&
														(get(properties, `${data.key}`, '')
															? moment(get(properties, `${data.key}`, ''))
																	.utc(true)
																	.format('DD/MM/yyyy')
															: '-')}
													{data.type === 'custom' && (
														<>{['qualifier', 'reviewer'].includes(data.key) && (properties[data.key]?.name || '-')}</>
													)}
													{data.type !== 'date' &&
														data.type !== 'custom' &&
														data.type !== 'currency' &&
														data.type !== 'comma-number' &&
														data.type !== 'multiselect' &&
														data.type !== 'calculation' &&
														data.type !== 'state' &&
														data.type !== 'county' &&
														(data.value || get(properties, `${data.key}`, '-'))}

													{data.type === 'text' && tooltipVisible[data.key] && (
														<LinkPopup
															id={data.key}
															url={data.value || get(properties, `${data.key}`, '-')}
															onLinkClick={e => handleLinkClick(e, data.key)}
															maxLength={40}
															className={classes.linkTooltip}
														/>
													)}

													{data.type === 'state' &&
														(get(properties, 'originalProperties.StateAbbreviation', '') ||
															get(properties, 'originalProperties.State', '') ||
															'-')}
													{data.type === 'county' && get(properties, 'originalProperties.County', '-')}
													{data.type === 'multiselect' &&
														(Array.isArray(get(properties, `${data.key}`))
															? get(properties, `${data.key}`).join(', ')
															: '-')}
													{data.type === 'currency' &&
														(vf_currency(data.value) || vf_currency(properties[data.key]) || '-')}
													{data.type === 'comma-number' &&
														(vf_number(data.value) || vf_number(properties[data.key]) || '-')}
													{data.type === 'calculation' &&
														((
															<>
																<Typography className={isNraMatched() ? classes.nraText : classes.nraHighLight}>
																	{getRoundedNra(properties?.netRoyalityAcres?.unitNra || 0, 2)}
																</Typography>
															</>
														) ||
															0)}
													{data.key === 'campaignName' && (
														<CampaignNameField
															className={classes.maxWidth}
															onChange={value => {
																updateProperties(null, data.key, value);
															}}
															value={properties[data.key] ? properties[data.key] : []}
															fullWidth
															targetLabel="Shape"
															targetLabelId={id}
														/>
													)}
												</Grid>
											)}
											{!data.nonEditable && data.key !== 'campaignName' && (
												<Grid item>
													{
														<EditIconComponent
															data={data}
															dataKey={data.key}
															classes={classes}
															onClick={() => {
																setTableDataState({ [data.key]: true });
															}}
														/>
													}
												</Grid>
											)}
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
