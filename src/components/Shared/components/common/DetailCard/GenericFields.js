import React, { memo } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import { get } from 'lodash';
import PropTypes from 'prop-types';

import * as Pages from 'components/Shared/components/common/DetailCard/pages';
import CustomAutoComplete from 'components/Shared/components/Fields/CustomAutoComplete';

import { detailCardController } from 'stateManagement/detailCardController';

import { copy } from 'utils/helper';

import BooleanField from './Fields/BooleanField';
import OwnerField from './Fields/OwnerField';
import ShapeAutoComplete from './Fields/ShapeAutoComplete';
import SimpleSelectField from './Fields/SimpleSelectField';
import SummaryAutoComplete from './Fields/SummaryAutoComplete';
import SummaryDropdown from './Fields/SummaryDropdown';
import SummaryTextField from './Fields/SummaryTextField';
import SummaryUsersList from './Fields/SummaryUsersList';

const useStyles = makeStyles(() => ({
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
			height: '49px',
		},
		'& .MuiOutlinedInput-input': {
			padding: '8px 14px',
		},
	},
}));

const GenericFields = ({ field: fieldObj, summaryDataValues }) => {
	const classes = useStyles();
	const field = copy(fieldObj);
	const isMetaField = field._id && field.category;

	field.key = (field.mappingKey || field.key)?.replaceAll('.keyword', '');
	field.type = field.keyType || field.type;

	// Get update functionality for array fields
	const {
		stateValues: { page },
	} = detailCardController.useState(['page']);
	const { useUpdate } = Pages[page];
	const { callApi } = useUpdate() || {};

	const handleArrayChange = ({ value }) => {
		if (!callApi) {
			return;
		}

		// Extract values from the selected options
		let newValue;
		if (Array.isArray(value)) {
			// For multiselect, extract values from objects
			newValue = value.map(item => {
				if (item && typeof item === 'object') {
					return item.value;
				}
				return item;
			});
		} else {
			// For single select, convert to array
			newValue = [value && typeof value === 'object' ? value.value : value];
		}

		const currentValue = get(summaryDataValues, field.key) || [];
		if (JSON.stringify(newValue) !== JSON.stringify(currentValue)) {
			callApi({ key: field.key, value: newValue, field, previousValue: currentValue });
		}
	};

	switch (field.keyType) {
		case 'text':
		case 'string':
		case 'textarea':
		case 'email':
		case 'currency':
		case 'number':
		case 'date':
			return (
				<SummaryTextField
					fieldData={get(summaryDataValues, field.key)}
					field={field}
					summaryData={summaryDataValues}
					isMetaField={isMetaField}
					customGridSpacing={1}
				/>
			);

		case 'autocomplete':
			return (
				<SummaryAutoComplete
					fieldData={get(summaryDataValues, field.key)}
					fieldKey={field.key}
					defaultOptions={field.options || []}
					payload={field.payload}
					variant="outlined"
					field={field}
				/>
			);

		case 'simpleSelect':
			return <SimpleSelectField fieldData={get(summaryDataValues, field.key)} field={field} />;

		case 'owner':
			return <OwnerField fieldData={get(summaryDataValues, field.key)} field={field} />;

		case 'user':
			return <SummaryUsersList fieldData={get(summaryDataValues, field.key)} field={field} />;

		case 'dropdown':
		case 'multiselect':
			return (
				<SummaryDropdown
					fieldData={get(summaryDataValues, field.key)}
					field={field}
					summaryData={summaryDataValues}
					isMetaField={isMetaField}
				/>
			);

		case 'shapeautocomplete':
			return (
				<ShapeAutoComplete
					fieldData={get(summaryDataValues, field.key)}
					fieldKey={field.key}
					shapeType={field.shapeType}
					variant="outlined"
					field={field}
				/>
			);

		case 'boolean':
			return <BooleanField fieldData={get(summaryDataValues, field.key)} field={field} />;

		case 'json':
			return <div>JSON Field Type is not supported yet</div>;

		case 'array': {
			const arrayValue = get(summaryDataValues, field.key) || [];
			const fieldOptions = field.options || [];

			let mappedValue;

			if (field.selectType === 'multi') {
				// Map primitive values to option objects for multi-select
				mappedValue = arrayValue.map(value => {
					const matchingOption = fieldOptions.find(option => option.value === value);
					return matchingOption || value;
				});
			} else {
				// For single select: pick the first value and find its matching option object
				const value = Array.isArray(arrayValue) ? arrayValue[0] : arrayValue;
				mappedValue = fieldOptions.find(option => option.value === value) || value;
			}
			return (
				<CustomAutoComplete
					fieldConfig={{
						variant: 'outlined',
						margin: 'dense',
						size: 'small',
						multiple: field.selectType === 'multi',
						disabled: false,
						inputClassName: classes.field,
					}}
					fieldAttributes={{
						value: mappedValue,
						optionArray: fieldOptions,
						InputLabelProps: {
							shrink: true,
						},
					}}
					fieldEvents={{
						onChange: handleArrayChange,
					}}
				/>
			);
		}

		default:
			return <div>{`Unsupported Field Type: ${field.type}`}</div>;
	}
};

GenericFields.propTypes = {
	field: PropTypes.shape({
		_id: PropTypes.string,
		category: PropTypes.string,
		mappingKey: PropTypes.string,
		key: PropTypes.string.isRequired,
		keyType: PropTypes.oneOf([
			'text',
			'string',
			'textarea',
			'email',
			'currency',
			'number',
			'autocomplete',
			'date',
			'simpleSelect',
			'owner',
			'user',
			'dropdown',
			'multiselect',
			'shapeautocomplete',
			'json',
			'boolean',
			'array',
		]),
		type: PropTypes.string,
		options: PropTypes.array,
		payload: PropTypes.object,
		shapeType: PropTypes.string,
	}).isRequired,
	summaryDataValues: PropTypes.object.isRequired,
};

export default memo(GenericFields);
