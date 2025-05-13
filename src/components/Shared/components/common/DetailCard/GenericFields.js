import React, { memo } from 'react';

import { get } from 'lodash';
import PropTypes from 'prop-types';

import { copy } from 'utils/helper';

import BooleanField from './Fields/BooleanField';
import OwnerField from './Fields/OwnerField';
import ShapeAutoComplete from './Fields/ShapeAutoComplete';
import SimpleSelectField from './Fields/SimpleSelectField';
import SummaryAutoComplete from './Fields/SummaryAutoComplete';
import SummaryDropdown from './Fields/SummaryDropdown';
import SummaryTextField from './Fields/SummaryTextField';
import SummaryUsersList from './Fields/SummaryUsersList';

const GenericFields = ({ field: fieldObj, summaryDataValues }) => {
	const field = copy(fieldObj);
	const isMetaField = field._id && field.category;

	field.key = (field.mappingKey || field.key)?.replaceAll('.keyword', '');
	field.type = field.keyType || field.type;

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
				/>
			);

		case 'boolean':
			return <BooleanField fieldData={get(summaryDataValues, field.key)} field={field} />;

		case 'json':
			return <div>JSON Field Type is not supported yet</div>;

		case 'array':
			return <div>Array Field Type is not supported yet</div>;

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
