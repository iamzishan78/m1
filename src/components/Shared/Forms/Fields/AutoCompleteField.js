import React from 'react';
import { VariableSizeList } from 'react-window';

import { Typography } from '@material-ui/core';

import PropTypes from 'prop-types';

import CustomAutoComplete from 'components/Shared/components/Fields/CustomAutoComplete';

function RenderRow(props) {
	const { data, index, style } = props;
	return (
		<Typography noWrap style={style}>
			{data[index]}
		</Typography>
	);
}

function ListboxComponent(props, ref) {
	const { children, ...other } = props;
	const itemData = React.Children.toArray(children);
	return (
		<div ref={ref} {...other}>
			<VariableSizeList
				height={300}
				width="100%"
				itemSize={() => 38}
				itemCount={itemData.length}
				itemData={itemData}
				overscanCount={10}
			>
				{RenderRow}
			</VariableSizeList>
		</div>
	);
}

function AutoCompleteFieldComponent(props) {
	const { onChange, name, options, label, value, defaultValue, variant, disabled, ...other } = props;

	return (
		<CustomAutoComplete
			fieldAttributes={{
				name,
				label,
				value,
				defaultValue,
				optionArray: options,
			}}
			fieldConfig={{
				variant: variant || 'outlined',
				margin: 'dense',
				disabled,
				allowNewOptions: true,
			}}
			fieldEvents={{
				onChange: ({ value }) => onChange(value),
			}}
			ListboxComponent={React.forwardRef(ListboxComponent)}
			{...other}
		/>
	);
}

RenderRow.propTypes = {
	data: PropTypes.arrayOf(PropTypes.node).isRequired,
	index: PropTypes.number.isRequired,
	style: PropTypes.object.isRequired,
};

ListboxComponent.propTypes = {
	children: PropTypes.node,
	ref: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
};

AutoCompleteFieldComponent.propTypes = {
	inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
	onChange: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
	options: PropTypes.arrayOf(PropTypes.string).isRequired,
	label: PropTypes.string,
	value: PropTypes.string,
	defaultValue: PropTypes.string,
	variant: PropTypes.string,
	ref: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
	disabled: PropTypes.bool,
};

export default AutoCompleteFieldComponent;
