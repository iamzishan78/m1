import { get, sortBy } from 'lodash';

export const getCustomMetaFields = (agreementDetails, metaDataRes) => {
	const metaData = get(metaDataRes, 'getMetaData.metaData', []).filter(field => !(field.mapping?.length > 0));
	const customData = [];
	const attachedMetaData = [];
	const nonAttachedMetaData = [];

	agreementDetails.custom_data_arr?.forEach((data, index) => {
		customData.push({
			...data,
			title: data.key,
			label: data.key,
			key: `custom_data_arr[${index}].value`,
			value: data.value,
		});
	});

	//? Meta data which is attached to this agreement
	metaData.forEach(md => {
		const { isCustom, ...meta } = md;
		// Checking if meta data key exists in agreement detail
		// then it should be ignored from meta data
		// e.g. internal_company
		if (md.name.replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase()) in agreementDetails) {
			return;
		}
		if (md.name in get(agreementDetails, 'custom_data', [])) {
			attachedMetaData.push(meta);
		} else {
			nonAttachedMetaData.push(meta);
		}
	});

	attachedMetaData.forEach(meta => {
		customData.push({
			...meta,
			title: meta.label,
			key: `custom_data.${meta.name}`,
			options: meta.dropdownOptions.map(op => ({
				...op,
				label: op.value,
			})),
			isCustomData: true,
		});
	});

	nonAttachedMetaData.forEach(meta => {
		customData.push({
			...meta,
			title: meta.label,
			key: `custom_data.${meta.name}`,
			options: meta.dropdownOptions.map(op => ({
				...op,
				label: op.value,
			})),
			isCustomData: true,
		});
	});

	return sortBy(customData, 'createAt');
};
