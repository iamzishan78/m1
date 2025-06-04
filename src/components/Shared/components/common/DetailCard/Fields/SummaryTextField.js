import React, { useState, useEffect } from 'react';

import { InputAdornment, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Autorenew as AutorenewIcon } from '@material-ui/icons';

import { isEqual } from 'lodash';
import PropTypes from 'prop-types';

import * as Pages from 'components/Shared/components/common/DetailCard/pages';
import CustomTextField from 'components/Shared/components/Fields/CustomTextField';
import { CurrencyFormatCustom } from 'components/Shared/Forms/Formatting/CurrencyFormatCustom';

import { detailCardController } from 'stateManagement/detailCardController';

const useStyles = makeStyles(() => ({
	container: {
		height: '100%',
		padding: '10px 30px 15px 5px',
	},
	gridStyle: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	fieldLabel: {
		fontWeight: 'bold',
		fontSize: '15px',
	},
	field: {
		'& .MuiAutocomplete-clearIndicator': {
			marginRight: '10px',
		},
		'& .MuiFormControl-marginNormal': {
			margin: '0px',
		},
		'& .MuiFormControl-marginDense': {
			margin: '0px',
		},
		'& .MuiInputBase-root': {
			borderRadius: '7px',
		},
		'& .MuiOutlinedInput-input': {
			padding: '8px 14px',
		},
	},
	hoverPointer: {
		cursor: 'pointer',
	},
	baseValueChanged: {
		width: '100%',
		'& .MuiInputBase-input': {
			color: 'dodgerblue',
			fontWeight: 'bold',
		},
	},
}));

const formatValue = (field, inputValue) => {
	if (!inputValue) {
		return '';
	}

	switch (field.type) {
		case 'date':
			try {
				const date = new Date(inputValue);
				if (isNaN(date.getTime())) {
					return '';
				}
				return date.toISOString().split('T')[0];
			} catch {
				return '';
			}
		case 'number':
			return !isNaN(Number(inputValue)) ? inputValue : 0;
		default:
			return inputValue;
	}
};

const SummaryTextField = ({ fieldData, field, summaryData, isMetaField }) => {
	const classes = useStyles();
	const {
		stateValues: { page, loadingField },
	} = detailCardController.useState(['page', 'loadingField']);
	const { useUpdate } = Pages[page];
	const { callApi, isChanged, renewFunction } = useUpdate() || {};

	const [value, setValue] = useState(() => formatValue(field, fieldData));

	const isChangedValue = isChanged ? isChanged(field.key, value) : null;

	const upDateField = currValue => {
		if (currValue === fieldData) {
			return;
		}

		if (!isMetaField) {
			return callApi({ key: field.key, value: currValue, field, previousValue: fieldData, resetFn: setValue });
		}

		const oldCustomData = summaryData.custom_data || {};
		const customData = {
			...oldCustomData,
			[field.key.replaceAll('custom_data.', '')]: value,
		};
		if (!isEqual(customData, oldCustomData)) {
			callApi({ key: 'custom_data', value: customData, originalKey: field.key, field, fieldData, resetFn: setValue });
		}
	};

	const handleBlur = currValue => {
		upDateField(currValue);
	};

	const handleChange = updatedvalue => {
		if (updatedvalue && field.type === 'number' && !isNaN(Number(updatedvalue))) {
			setValue(updatedvalue);
		} else {
			setValue('');
		}
		setValue(updatedvalue);
	};

	const handleKeyUp = e => {
		if (e.key === 'Enter') {
			e.target.blur();
		}
	};

	useEffect(() => {
		const formattedValue = formatValue(field, fieldData);
		setValue(formattedValue);
	}, [fieldData]);

	return (
		<CustomTextField
			rows={field.rows}
			id={`field-${field.key}`}
			fieldEvents={{
				onChange: handleChange,
				onKeyUp: handleKeyUp,
				onBlur: handleBlur,
			}}
			fieldConfig={{
				variant: 'outlined',
				margin: 'dense',
				size: 'small',
				type: field.type,
				multiline: field.multiline,
				disabled: field.disabled,
				customStyleClass: `${classes.field} ${field.isOverRideable && isChangedValue ? classes.baseValueChanged : null}`,
			}}
			fieldAttributes={{
				value: value,
				InputLabelProps: {
					shrink: true,
				},
				InputProps: {
					inputComponent: field.type === 'currency' ? CurrencyFormatCustom : undefined,
					startAdornment:
						field.type === 'currency' && !value ? <InputAdornment position="start">$</InputAdornment> : undefined,
					endAdornment:
						loadingField && loadingField === field?.key ? (
							<CircularProgress size={22} color="secondary" />
						) : (
							<>
								{field.isOverRideable && isChangedValue && (
									<AutorenewIcon
										className={classes.hoverPointer}
										htmlColor="#757575"
										onClick={() => {
											const renewValue = renewFunction(field.key);
											setValue(renewValue || 0);
											upDateField(renewValue || 0);
										}}
									/>
								)}
							</>
						),
				},
			}}
		/>
	);
};

SummaryTextField.propTypes = {
	fieldData: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	field: PropTypes.shape({
		key: PropTypes.string.isRequired,
		type: PropTypes.string.isRequired,
		rows: PropTypes.number,
		multiline: PropTypes.bool,
		disabled: PropTypes.bool,
		isOverRideable: PropTypes.bool,
	}).isRequired,
	summaryData: PropTypes.object,
	isMetaField: PropTypes.bool,
};

export default SummaryTextField;
