import React, { memo } from 'react';

import { get } from 'lodash';
import { copy } from 'utils/helper';

import DateField from './Fields/DateField';
import OwnerField from './Fields/OwnerField';
import SummaryDropdown from './Fields/SummaryDropdown';
import SummaryUsersList from './Fields/SummaryUsersList';
import SummaryTextField from './Fields/SummaryTextField';
import ShapeAutoComplete from './Fields/shapeAutoComplete';
import SimpleSelectField from './Fields/SimpleSelectFIeld';
import SummaryAutoComplete from './Fields/SummaryAutoComplete';

const GenericFields = memo(({ field: fieldObj, summaryDataValues }) => {
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

		case 'date':
			return (
				<DateField
					fieldData={get(summaryDataValues, field.key)}
					field={field}
					// Add date-specific props here
				/>
			);

		case 'simpleSelect':
			return (
				<SimpleSelectField
					fieldData={get(summaryDataValues, field.key)}
					field={field}
					// Add simple select-specific props here
				/>
			);

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

		// Add more cases for other field types

		default:
			return <div>{`Unsupported Field Type : ${field.type}`}</div>;
	}
});

export default GenericFields;
