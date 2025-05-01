import React from 'react';

import PropTypes from 'prop-types';

import CustomAutoComplete from 'components/Shared/components/Fields/CustomAutoComplete';

const AutoCompleteWithNewOption = ({ options, onChange, value, onBlur, disabled = false, ...rest }) => {
	return (
		<CustomAutoComplete
			fieldAttributes={{
				label: rest.label,
				value: value ? { _id: value, name: value } : null,
				optionArray: options?.map(type => ({ _id: type, name: type })) || [],
			}}
			fieldConfig={{
				size: rest.size ?? 'small',
				disabled: disabled,
				margin: rest.margin,
				allowNewOptions: true,
				variant: rest.variant ?? 'standard',
			}}
			fieldEvents={{
				onBlur,
				onChange: ({ value: newValue }) => onChange(null, newValue),
			}}
			id={rest?.id || 'autocompleteWithNewOptions'}
		/>
	);
};

AutoCompleteWithNewOption.propTypes = {
	options: PropTypes.arrayOf(
		PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.shape({
				_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
				name: PropTypes.string,
			}),
		])
	),
	onChange: PropTypes.func.isRequired,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	shapeType: PropTypes.any,
	typeKey: PropTypes.any,
	onBlur: PropTypes.func,
	disabled: PropTypes.bool,
	label: PropTypes.string,
	size: PropTypes.string,
	margin: PropTypes.string,
	variant: PropTypes.string,
	id: PropTypes.string,
};

export default AutoCompleteWithNewOption;
