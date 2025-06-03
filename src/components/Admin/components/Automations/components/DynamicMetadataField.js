import React from 'react';

import { FormControl } from '@material-ui/core';

import PropTypes from 'prop-types';

import ReactSelectField from 'components/MRTTable/Common/Components/ReactSelectField';
import CustomDatePicker from 'components/Shared/components/Fields/CustomDatePicker';
import CustomTextField from 'components/Shared/components/Fields/CustomTextField';

const DynamicMetadataField = ({ selectedField, value, onChange }) => {
	if (!selectedField) {
		return null;
	}

	const fieldLabel = `Enter value for ${selectedField.label}`;
	const dateLabel = `Select date for ${selectedField.label}`;

	if (['link', 'text', 'number'].includes(selectedField.type)) {
		return (
			<FormControl fullWidth>
				<CustomTextField
					style={{ borderRadius: '4px' }}
					fieldConfig={{
						type: selectedField.type === 'number' ? 'number' : 'text',
						variant: 'outlined',
						size: 'small',
					}}
					fieldAttributes={{
						label: fieldLabel,
						value: value,
					}}
					fieldEvents={{
						onChange: onChange,
					}}
				/>
			</FormControl>
		);
	}

	if (selectedField.type === 'date') {
		return (
			<FormControl fullWidth>
				<CustomDatePicker
					style={{ borderRadius: '4px' }}
					fieldAttributes={{
						label: dateLabel,
						value: value,
					}}
					fieldConfig={{
						size: 'small',
					}}
					fieldEvents={{
						onChange: onChange,
					}}
				/>
			</FormControl>
		);
	}

	if (['dropdown', 'select'].includes(selectedField.type)) {
		return (
			<FormControl fullWidth>
				<ReactSelectField
					style={{ borderRadius: '4px' }}
					isSingleSelect
					fullWidth
					variant="outlined"
					dropdownOptions={selectedField.dropdownOptions}
					column={selectedField}
					value={value}
					onCustomKeyChange={onChange}
				/>
			</FormControl>
		);
	}

	if (selectedField.type === 'multiselect') {
		return (
			<FormControl fullWidth>
				<ReactSelectField
					style={{ borderRadius: '4px' }}
					fullWidth
					variant="outlined"
					dropdownOptions={selectedField.dropdownOptions}
					column={selectedField}
					value={value || []}
					onCustomKeyChange={onChange}
				/>
			</FormControl>
		);
	}

	return null;
};

DynamicMetadataField.propTypes = {
	selectedField: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		type: PropTypes.oneOf(['link', 'text', 'number', 'date', 'dropdown', 'select', 'multiselect']).isRequired,
		label: PropTypes.string.isRequired,
		dropdownOptions: PropTypes.arrayOf(
			PropTypes.shape({
				label: PropTypes.string.isRequired,
				value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
			})
		),
	}),
	value: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
		PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
	]),
	onChange: PropTypes.func.isRequired,
};

DynamicMetadataField.defaultProps = {
	selectedField: null,
	value: '',
};

export default DynamicMetadataField;
