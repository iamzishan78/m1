import React, { useEffect, useState, Fragment } from 'react';
import { Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import {
	Grid,
	TextField,
	Button,
	Select,
	MenuItem,
	Tooltip,
	IconButton,
	makeStyles,
	InputAdornment,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import CreateTwoToneIcon from '@material-ui/icons/CreateTwoTone';
import EditIcon from '@material-ui/icons/Edit';

import { useLazyQuery } from '@apollo/client';
import { get } from 'lodash';
import uniqBy from 'lodash/uniqBy';
import PropTypes from 'prop-types';

import ReactSelectField from 'components/MRTTable/Common/Components/ReactSelectField';
import CountyField from 'components/Revenue/components/Properties/DetailComponents/County';
import StateField from 'components/Revenue/components/Properties/DetailComponents/State';
import { getCustomMetaFields } from 'components/Shared/Agreement/helpers';
import CustomDatePicker from 'components/Shared/components/Fields/CustomDatePicker';
import CustomTextField from 'components/Shared/components/Fields/CustomTextField';
import AutoCompleteTypeComponent from 'components/Shared/Forms/Fields/AutoCompleteType';

import { GET_META_DATA } from 'graphQL/useQueryGetMetaData';

import { globalStateController } from 'stateManagement/globalStateController';
import { popupController } from 'stateManagement/popupStateController';

import { KEYBOARD_KEYS, TO_FIXED } from 'utils/consts';
import { copy } from 'utils/helper';
import MetaField from 'utils/MetaField';

import { showInfoMessage } from 'actions';

import { useStyles as summaryStyles } from '../style';
import fieldsData from './data';

const useStyles = makeStyles(() => ({
	valueOveridden: {
		'& .MuiInputBase-input': {
			color: '#01B0F0 !important',
			fontWeight: 'bold !important',
		},
	},
	valueNormal: {
		'& .MuiInputBase-input': {
			color: 'inherit !important',
			fontWeight: 'normal !important',
		},
	},
}));

export default function FieldsSection({ updateAgreement, control, agreementDetails }) {
	const classes = summaryStyles();
	const overrideClasses = useStyles();
	const { globalStateValues } = globalStateController.useState(['showFieldModal', 'user'], 'globalStateValues');
	const [fieldsList, setFieldsList] = useState([]);
	const [isHovered, setIsHovered] = useState(false);
	const [editIconState, setEditIconState] = useState({});
	const [agreementDetailCopied, setAgreementCopied] = useState();
	const [state, setState] = useState();
	const [county, setCounty] = useState();
	const history = useHistory();
	const dispatch = useDispatch();

	const [isAcquisitionCostOverridden, setIsAcquisitionCostOverridden] = useState(
		agreementDetails?.totalAcquisitionCost !== agreementDetails?.calculated?.totalAcquisitionCost
	);

	const [getMetaData, { data: metaDataRes }] = useLazyQuery(GET_META_DATA);

	const onGlobalKeyDown = e => {
		const id = e?.target?.id;

		if (e.keyCode === KEYBOARD_KEYS.TAB) {
			if (e.shiftKey) {
				if (!document.getElementById(`field-${Number(id.split('-')[1]) - 1}`)) {
					e.preventDefault();
					return;
				} else {
					document.getElementById(`field-${Number(id.split('-')[1])}`).focus();
				}
			}
		}
	};

	useEffect(() => {
		document.addEventListener('keydown', onGlobalKeyDown, false);
		document.addEventListener('blur', () => {});
	}, []);

	useEffect(() => {
		if (agreementDetails?._id && !agreementDetails?.agreementNumber) {
			dispatch(showInfoMessage('Agreement Number is required'));
		}
	}, [agreementDetails?._id, agreementDetails?.agreementNumber, dispatch]);

	useEffect(() => {
		setAgreementCopied(agreementDetails);
	}, [agreementDetails]);

	useEffect(() => {
		getMetaData({
			variables: {
				user: globalStateValues.user?.mongoId,
				category: 'Agreement',
			},
		});
	}, [globalStateValues.user?.mongoId, getMetaData]);

	useEffect(() => {
		return history.listen(() => {
			if (!agreementDetails?.agreementNumber) {
				popupController.updateState({
					selectedShape: null,
				});
				history.goBack();
			}
		});
	}, [history, agreementDetails]);

	useEffect(() => {
		let customData = getCustomMetaFields(agreementDetails, metaDataRes);
		customData = uniqBy(customData, 'esKey');
		setFieldsList([...fieldsData(globalStateValues.user), ...customData]);
		if (agreementDetails?.originalProperties?.State || agreementDetails?.originalProperties?.StateAbbreviation) {
			setState(agreementDetails.originalProperties.State || agreementDetails.originalProperties.StateAbbreviation);
		}
		if (agreementDetails?.originalProperties?.County) {
			setCounty(agreementDetails.originalProperties.County);
		}
	}, [metaDataRes, agreementDetails, globalStateValues.user?.mongoId]);

	const addAgreementCustomData = data => {
		const customData = copy(agreementDetails.custom_data) ?? {};
		data.forEach(d => {
			if (!customData[d.name]) {
				customData[d.name] = null;
			}
		});
		updateAgreement('custom_data', customData);
	};

	const offClickHandler = (key, value, isCustom) => {
		updateAgreement(key, value, isCustom);
	};

	return (
		<Grid
			container
			direction="row"
			display="flex"
			justify="space-between"
			alignItems="center"
			className={classes.fieldsSection}
		>
			{fieldsList.map(field => {
				const handleEdit = () => {
					globalStateController.updateState({ showFieldModal: true, selectedMeta: field });
				};

				const isMetaField = field?._id && field?.category;
				const endAdornment =
					isMetaField && isHovered === field?._id ? (
						<InputAdornment position="end">
							<IconButton aria-label="Edit Meta" style={{ padding: '6px' }} onClick={handleEdit}>
								<EditIcon />
							</IconButton>
						</InputAdornment>
					) : undefined;

				return (
					<Grid item xs={12} key={field.label + field.key + field._id}>
						<Grid container className={classes.gridStyle} style={{ display: 'flex', justifyContent: 'space-between' }}>
							<Grid
								item
								xs={3}
								onMouseEnter={() => {
									setEditIconState({ [`${field.key}key`]: true });
								}}
								onMouseLeave={() => {
									setEditIconState({ [`${field.key}key`]: false });
								}}
								style={{ display: 'flex' }}
							>
								<div className={classes.fieldLabel}>{field.key !== 'approvalStatus' && field.label}</div>
								{field.isCustom && editIconState[`${field.key}key`] && (
									<Tooltip title={'Edit'} placement="top">
										<CreateTwoToneIcon
											className={classes.pencilIcon}
											onClick={() => {
												globalStateController.updateState({ showFieldModal: true, selectedMeta: field });
											}}
										/>
									</Tooltip>
								)}
							</Grid>
							<Grid
								item
								xs={8}
								onMouseEnter={() => {
									setIsHovered(field._id);
								}}
								onMouseLeave={() => {
									setIsHovered(false);
								}}
							>
								<Fragment>
									{field.type === 'text' && (
										<CustomTextField
											id={`field-${field.key}`}
											style={{ width: 'calc(100% + 8px)' }}
											control={control}
											fieldConfig={{
												disabled: field?.disabled,
												fullWidth: true,
												variant: 'outlined',
												margin: 'dense',
											}}
											fieldAttributes={{
												name: field.key,
												defaultValue: get(agreementDetails, `${field.key}`, ''),
												InputProps: {
													...field.InputProps,
													endAdornment,
												},
											}}
											fieldEvents={{
												onBlur: value => {
													offClickHandler(field.key, value);
												},
											}}
										/>
									)}
									{field.type === 'number' && (
										<CustomTextField
											id={`field-${field.key}`}
											style={{ width: 'calc(100% + 8px)' }}
											control={control}
											fieldConfig={{
												disabled: field?.disabled,
												fullWidth: true,
												variant: 'outlined',
												margin: 'dense',
												type: 'number',
											}}
											fieldAttributes={{
												name: field.key,
												defaultValue: get(agreementDetails, `${field.key}`, ''),
												InputProps: {
													...field.InputProps,
													endAdornment,
												},
											}}
											fieldEvents={{
												onBlur: value => {
													offClickHandler(field.key, value);
												},
											}}
										/>
									)}
									{field.type === 'date' && (
										<CustomDatePicker
											control={control}
											id={`field-${field.key}`}
											fieldConfig={{
												margin: 'dense',
											}}
											fieldAttributes={{
												name: field.key,
												value: get(agreementDetails, `${field.key}`, ''),
												InputProps: {
													style: { width: 'calc(100% + 8px)' },
												},
											}}
											fieldEvents={{
												onChange: newValue => {
													offClickHandler?.(field.key, newValue.toDate());
												},
											}}
											InputProps={{
												...field.InputProps,
												endAdornment,
											}}
										/>
									)}
									{(field.type === 'dropdown' || field.type === 'multiselect' || field.type === 'select') && (
										<Controller
											control={control}
											name={field.key}
											render={({ field: fieldProps }) => {
												return (
													<Fragment>
														{field.type === 'dropdown' && (
															<div
																style={{
																	margin: '8px 0px 4px',
																}}
															>
																<ReactSelectField
																	id={`field-${field.title}`}
																	isSingleSelect={true}
																	fullWidth
																	variant="outlined"
																	dropdownOptions={field.options}
																	column={field}
																	onCustomKeyChange={value => {
																		offClickHandler(field.key, value, field.isCustom);
																	}}
																	disabled={field.disabled}
																	value={get(agreementDetails, `${field.key}`, '')}
																/>
															</div>
														)}
														{field.type === 'select' && (
															<Select
																{...fieldProps}
																id={`field-${field.key}`}
																variant="outlined"
																fullWidth
																InputLabelProps={{
																	shrink: true,
																}}
																style={{ margin: '8px 0px 4px' }}
																onChange={event => offClickHandler(field.key, event.target.value, field.isCustom)}
																disabled={field.disabled}
																value={get(agreementDetails, `${field.key}`, '')}
															>
																{field.options.map(option => (
																	<MenuItem key={option.value ?? option} value={option.value ? option.value : option}>
																		{option.label ? option.label : option}
																	</MenuItem>
																))}
															</Select>
														)}
														{field.type === 'multiselect' && (
															<div
																style={{
																	margin: '8px 0px 4px',
																}}
															>
																<ReactSelectField
																	id={`field-${field.key}`}
																	variant="outlined"
																	margin="dense"
																	fullWidth
																	dropdownOptions={field.options}
																	column={field}
																	value={get(agreementDetails, `${field.key}`) ?? []}
																	onCustomKeyChange={value => {
																		offClickHandler(field.key, value, field.isCustom);
																	}}
																/>
															</div>
														)}
													</Fragment>
												);
											}}
										/>
									)}
									{field.type === 'autocomplete' && field.key !== 'approvalStatus' && (
										<AutoCompleteTypeComponent
											value={agreementDetailCopied?.[field.key]}
											shapeType="Agreement"
											typeKey={field.key}
											variant="outlined"
											onChange={(event, newValue) => {
												setAgreementCopied({ ...agreementDetailCopied, [field.key]: newValue?.name || null });
											}}
											onBlur={event => offClickHandler(field.key, event.target.value)}
											autoFocus={false}
											id={`field-${field.key}`}
										/>
									)}
									{field.key === 'totalAcquisitionCost' && (
										<Controller
											control={control}
											name={field.key}
											render={({ field: fieldProps }) => (
												<TextField
													{...fieldProps}
													id={`field-${field.key}`}
													value={parseFloat(fieldProps.value).toFixed(TO_FIXED)}
													className={
														isAcquisitionCostOverridden ? overrideClasses.valueOveridden : overrideClasses.valueNormal
													}
													variant="outlined"
													margin="dense"
													fullWidth
													inputRef={fieldProps.ref}
													onWheel={e => e.target.blur()}
													onChange={e => {
														const toFixedValue = parseFloat(e.target.value).toFixed(TO_FIXED);
														const calculatedAcquisitionCost = parseFloat(
															agreementDetails?.calculated?.totalAcquisitionCost || 0
														).toFixed(TO_FIXED);
														fieldProps.onChange(toFixedValue);
														setIsAcquisitionCostOverridden(toFixedValue !== calculatedAcquisitionCost);
													}}
													onBlur={() =>
														offClickHandler(field.key, {
															value: Number(fieldProps.value),
															overridden: isAcquisitionCostOverridden,
														})
													}
													InputProps={{
														...field.InputProps,
														endAdornment: (
															<InputAdornment position="end">
																{isAcquisitionCostOverridden && (
																	<IconButton
																		aria-label="toggle royality-acres"
																		onClick={() => {
																			const totalAcquisitionCost = parseFloat(
																				agreementDetails?.calculated?.totalAcquisitionCost || 0
																			).toFixed(TO_FIXED);
																			fieldProps.onChange(totalAcquisitionCost);
																			offClickHandler(field.key, {
																				value: Number(totalAcquisitionCost),
																				overridden: isAcquisitionCostOverridden,
																			});
																			setIsAcquisitionCostOverridden(false);
																		}}
																	>
																		<AutorenewIcon />
																	</IconButton>
																)}
															</InputAdornment>
														),
													}}
												/>
											)}
										/>
									)}
									{field.key === 'state' && (
										<StateField
											// label="State"
											id={`field-${field.key}`}
											shrink
											value={state}
											onStateChange={selectedState => {
												setState(selectedState.acronym);
												setCounty('');
												updateAgreement('state', selectedState.acronym, false);
											}}
										/>
									)}
									{field.key === 'county' && (
										<CountyField
											// label="County"
											shrink
											value={county}
											state={state}
											onCountyChange={selectedCounty => {
												setCounty(selectedCounty ? selectedCounty.county : '');
												updateAgreement('county', selectedCounty ? selectedCounty.county : '', false);
											}}
										/>
									)}
								</Fragment>
							</Grid>
						</Grid>
					</Grid>
				);
			})}
			{globalStateValues.showFieldModal && (
				<MetaField
					customDataPrefix="shapeJson.properties.custom_data"
					customDataPostfix=".keyword"
					columns={[]}
					category="Agreement"
					updateColumnSorting={addAgreementCustomData}
				/>
			)}
			{globalStateValues.user?.rolePrivileges !== 'READ_ONLY' && (
				<Grid item>
					<Button
						variant="contained"
						color="primary"
						className={classes.addDataButton}
						startIcon={<AddIcon />}
						onClick={() => globalStateController.updateState({ showFieldModal: true })}
					>
						Add Custom Data
					</Button>
				</Grid>
			)}
		</Grid>
	);
}

FieldsSection.propTypes = {
	updateAgreement: PropTypes.func.isRequired,
	control: PropTypes.object.isRequired,
	agreementDetails: PropTypes.object,
};
