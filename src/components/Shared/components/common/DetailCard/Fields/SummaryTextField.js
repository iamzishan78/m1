import React, { useState, useEffect } from 'react';
import { TextField, InputAdornment, CircularProgress } from '@material-ui/core';
import { Autorenew as AutorenewIcon } from '@material-ui/icons';
import { CurrencyFormatCustom } from 'components/Shared/Forms/Formatting/CurrencyFormatCustom';
import { makeStyles } from '@material-ui/core/styles';
import { detailCardController } from 'hookstate/detailCardController';
import * as Pages from 'components/Shared/components/common/DetailCard/pages';
import { isEqual } from 'lodash';

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

const SummaryTextField = ({ fieldData, field, summaryData, isMetaField }) => {
	const classes = useStyles();
	const {
		stateValues: { page, loadingField },
	} = detailCardController.useState(['page', 'loadingField']);
	const { useUpdate } = Pages[page];
	const { callApi, isChanged, renewFunction } = useUpdate() || {};

	const [value, setValue] = useState(fieldData || (field.type === 'number' ? 0 : ''));

	const isChangedValue = isChanged ? isChanged(field.key, value) : null;

	const upDateField = currValue => {
		if (currValue === fieldData) return;

		if (!isMetaField)
			return callApi({ key: field.key, value: currValue, field, previousValue: fieldData, resetFn: setValue });

		const oldCustomData = summaryData.custom_data || {};
		const customData = {
			...oldCustomData,
			[field.key.replaceAll('custom_data.', '')]: value,
		};
		if (!isEqual(customData, oldCustomData))
			callApi({ key: 'custom_data', value: customData, originalKey: field.key, field, fieldData, resetFn: setValue });
	};

	const handleBlur = event => {
		let currValue = event.target.value;
		if (currValue && field.type === 'number' && !isNaN(Number(currValue))) {
			currValue = Number(currValue);
		}
		upDateField(currValue);
	};

	const handleChange = ({ target }) => {
		let updatedvalue = target.value;
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
		setValue(fieldData || '');
	}, [fieldData]);

	return (
		<TextField
			id={`field-${field.key}`}
			variant="outlined"
			margin="dense"
			type={field.type}
			multiline={field.multiline}
			rows={field.rows}
			fullWidth
			InputLabelProps={{
				shrink: true,
			}}
			onBlur={handleBlur}
			onChange={handleChange}
			onKeyUp={handleKeyUp}
			disabled={field.disabled}
			// className={`${field.isOverRideable ? 'baseValueChanged' : ''}`}
			className={`${classes.field} ${field.isOverRideable && isChangedValue ? classes.baseValueChanged : null}`}
			value={value}
			InputProps={{
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
			}}
		/>
	);
};

export default SummaryTextField;
