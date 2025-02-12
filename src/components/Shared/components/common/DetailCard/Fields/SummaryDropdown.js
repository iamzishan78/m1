import React, { useState, useEffect } from 'react';
import { detailCardController } from 'hookstate/detailCardController';
import * as Pages from 'components/Shared/components/common/DetailCard/pages';
import ReactSelectField from 'components/MRTTable/Common/MetaData/ReactSelectField';
import { isEqual } from 'lodash';

const SummaryDropdown = ({ fieldData, field, summaryData, isMetaField }) => {
	const {
		stateValues: { page, loadingField },
	} = detailCardController.useState(['page', 'loadingField']);
	const { useUpdate } = Pages[page];
	const { callApi } = useUpdate();

	const [value, setValue] = useState(fieldData?.get({ noproxy: true }) || '');

	const handleChange = currValue => {
		if (currValue === fieldData?.get({ noproxy: true })) return;

		if (!isMetaField) return callApi({ key: field.key, value: currValue });

		const oldCustomData = summaryData.custom_data || {};
		const customData = {
			...oldCustomData,
			[field.key.replaceAll('custom_data.', '')]: currValue,
		};
		if (!isEqual(customData, oldCustomData)) callApi({ key: 'custom_data', value: customData, originalKey: field.key });
	};

	useEffect(() => {
		setValue(fieldData?.get({ noproxy: true }) || '');
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

export default SummaryDropdown;
