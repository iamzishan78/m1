import React, { useState, useEffect } from 'react';
import { TextField, InputAdornment, CircularProgress } from '@material-ui/core';
import { Autorenew as AutorenewIcon } from '@material-ui/icons';
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';
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
		stateValues: { page },
	} = detailCardController.useState(['page']);
	const { useUpdate } = Pages[page];
	const { callApi, isChanged, renewFunction } = useUpdate() || {};
	const { loadingField } = detailCardController.useState(['loadingField']);
	const activeLoadingField = loadingField.get({ noproxy: true });

	const [value, setValue] = useState(fieldData || '');

	const isChangedValue = isChanged ? isChanged(field.key, value) : null;

	const upDateField = currValue => {
		if (currValue === fieldData) return;

		if (!isMetaField) return callApi(field.key, currValue);

		const oldCustomData = summaryData.custom_data || {};
		const customData = {
			...oldCustomData,
			[field.key.replaceAll('custom_data.', '')]: value,
		};
		if (!isEqual(customData, oldCustomData)) callApi('custom_data', customData, field.key);
	};

	const handleBlur = event => {
		let currValue = event.target.value;
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
					field.type === 'email' && value ? (
						<a href={'mailto:' + value}>
							<InputAdornment position="end">
								<EmailOutlinedIcon htmlColor="#757575" />
							</InputAdornment>
						</a>
					) : activeLoadingField && activeLoadingField === field.key ? (
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
