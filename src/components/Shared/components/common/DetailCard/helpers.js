export const getAssetFields = (asset, isSummaryField = false) => {
	if (!asset?.modelKeys) {
		return null;
	}

	// Filter the fields based on the isSummaryField value
	return asset.modelKeys.filter(key => key?.isSummaryField === isSummaryField);
};

export const getNonEmptyFields = (assetData, fields) => {
	return fields?.filter(
		field =>
			assetData?.[field?.mappingKey] !== null &&
			assetData?.[field?.mappingKey] !== undefined &&
			!(Array.isArray(assetData?.[field?.mappingKey]) && assetData?.[field?.mappingKey]?.length === 0) &&
			(field.keyType === 'string' ? assetData?.[field?.mappingKey]?.trim() !== '' : true)
	);
};
