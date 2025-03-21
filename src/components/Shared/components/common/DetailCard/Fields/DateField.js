import React, { useEffect, useState } from 'react';

import { CircularProgress } from '@mui/material';

import { debounce } from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';

import * as Pages from 'components/Shared/components/common/DetailCard/pages';
import CustomDatePicker from 'components/Shared/components/Fields/CustomDatePicker';

import { detailCardController } from 'stateManagement/detailCardController';

function DateField({ fieldData, field }) {
	const {
		stateValues: { page, loadingField },
	} = detailCardController.useState(['page', 'loadingField']);

	const { useUpdate } = Pages[page];
	const { callApi } = useUpdate();

	const [value, setValue] = useState(fieldData || '');

	useEffect(() => {
		setValue(fieldData || '');
	}, [fieldData]);

	const handleBlur = debounce(currValue => {
		if (currValue.toDate().toISOString() !== fieldData) {
			callApi({ key: field.key, value: currValue.toDate(), field, previousValue: fieldData, resetFn: setValue });
		}
	}, 1000);

	const handleDateChange = newValue => {
		const formattedValue = newValue ? moment(newValue.toDate()).format('YYYY-MM-DD') : '';
		setValue(formattedValue);
		handleBlur(newValue);
	};

	return (
		<CustomDatePicker
			fieldAttributes={{
				name: field.key,
				value,
				label: field.label || '',
				placeholder: 'Select a date',
			}}
			fieldConfig={{
				disabled: field.disabled,
				required: field.required || false,
				fullWidth: true,
				variant: 'outlined',
				hasTime: false,
			}}
			fieldEvents={{
				onChange: handleDateChange,
			}}
			InputProps={{
				endAdornment: loadingField && loadingField === field?.key && <CircularProgress size={22} color="secondary" />,
			}}
		/>
	);
}

DateField.propTypes = {
	fieldData: PropTypes.string,
	field: PropTypes.shape({
		key: PropTypes.string.isRequired,
		label: PropTypes.string,
		disabled: PropTypes.bool,
		required: PropTypes.bool,
	}),
};

export default DateField;
