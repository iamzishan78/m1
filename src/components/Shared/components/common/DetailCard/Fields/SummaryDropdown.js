import React, { useState, useEffect } from 'react';

import { isEqual } from 'lodash';
import PropTypes from 'prop-types';

import ReactSelectField from 'components/MRTTable/Common/MetaData/ReactSelectField';
import * as Pages from 'components/Shared/components/common/DetailCard/pages';

import { detailCardController } from 'controllers/detailCardController';

const SummaryDropdown = ({ fieldData, field, summaryData, isMetaField }) => {
	const {
		stateValues: { page, loadingField },
	} = detailCardController.useState(['page', 'loadingField']);
	const { useUpdate } = Pages[page];
	const { callApi } = useUpdate();

	const [value, setValue] = useState(fieldData || '');

	const handleChange = currValue => {
		if (currValue === fieldData) {
			return;
		}

		if (!isMetaField) return callApi({ key: field.key, value: currValue });

		const oldCustomData = summaryData.custom_data || {};
		const customData = {
			...oldCustomData,
			[field.key.replaceAll('custom_data.', '')]: currValue,
		};
		if (!isEqual(customData, oldCustomData)) callApi({ key: 'custom_data', value: customData, originalKey: field.key });
	};

	useEffect(() => {
		setValue(fieldData || '');
	}, [fieldData]);

	return (
		<ReactSelectField
			id={`field-${field.title}`}
			isSingleSelect={true}
			fullWidth
			variant="outlined"
			dropdownOptions={field.dropdownOptions}
			column={field}
			onCustomKeyChange={value => {
				handleChange(value);
			}}
			disabled={field.disabled}
			value={value}
			minHeight=""
			margin="dense"
			loading={loadingField && loadingField === field.key}
		/>
	);
};

SummaryDropdown.propTypes = {
	fieldData: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
	field: PropTypes.shape({
		key: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
		dropdownOptions: PropTypes.arrayOf(
			PropTypes.shape({
				label: PropTypes.string.isRequired,
				value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).isRequired,
			})
		).isRequired,
		disabled: PropTypes.bool,
	}).isRequired,
	summaryData: PropTypes.shape({
		custom_data: PropTypes.object,
	}),
	isMetaField: PropTypes.bool,
};

export default SummaryDropdown;
