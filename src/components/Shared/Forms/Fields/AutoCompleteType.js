import React, { useEffect, useState } from 'react';

import { useLazyQuery } from '@apollo/client';
import PropTypes from 'prop-types';

import CustomAutoComplete from 'components/Shared/components/Fields/CustomAutoComplete';

import { SHAPE_AUTOCOMPLETE_LIST } from 'graphQL/useQueryShapeAutoCompleteList';

const AutoCompleteTypeComponent = ({
	onChange,
	value,
	shapeType,
	meta,
	label,
	typeKey,
	onBlur,
	createable,
	...other
}) => {
	const [types, setTypes] = useState([]);
	const [typeListQuery, { data: dataTypes }] = useLazyQuery(SHAPE_AUTOCOMPLETE_LIST);

	useEffect(() => {
		typeListQuery({ variables: { shapeType, key: typeKey, meta } });
	}, []);

	useEffect(() => {
		if (dataTypes && dataTypes[Object.keys(dataTypes)[0]]) {
			setTypes(() => {
				let options = dataTypes[Object.keys(dataTypes)[0]];
				if (other?.manualOptions) {
					options = options.concat(other?.manualOptions);
					options = Array.from(new Set(options));
				}
				return options;
			});
		}
	}, [dataTypes]);

	return (
		<CustomAutoComplete
			fieldAttributes={{
				name: typeKey,
				value: value ? { _id: value, name: value } : null,
				label,
				defaultOptions: types?.map(type => ({ _id: type, name: type })) || [],
			}}
			fieldConfig={{
				variant: other.variant ?? 'standard',
				margin: 'dense',
				size: 'small',
				allowNewOptions: createable,
				autoFocus: other.autoFocus,
				textfieldRestProps: {
					fullWidth: true,
				},
			}}
			fieldEvents={{
				onChange: ({ value }) => {
					onChange(null, value);
				},
				onBlur,
			}}
			id={other.id}
		/>
	);
};

AutoCompleteTypeComponent.defaultProps = {
	autoFocus: true,
	createable: true,
};

AutoCompleteTypeComponent.propTypes = {
	onChange: PropTypes.func.isRequired,
	value: PropTypes.string,
	shapeType: PropTypes.string.isRequired,
	meta: PropTypes.object,
	label: PropTypes.string,
	typeKey: PropTypes.string.isRequired,
	onBlur: PropTypes.func,
	createable: PropTypes.bool,
	manualOptions: PropTypes.arrayOf(PropTypes.string),
	variant: PropTypes.string,
	autoFocus: PropTypes.bool,
	id: PropTypes.string,
};

export default AutoCompleteTypeComponent;
