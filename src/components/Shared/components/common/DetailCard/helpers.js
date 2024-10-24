export const getAssetFields = (asset, isSummaryField = false) => {
	if (!asset?.modelKeys) return null;

	// Filter the fields based on the isSummaryField value
	return asset.modelKeys.filter(key => key?.isSummaryField === isSummaryField);
};
