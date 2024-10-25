// Summary field keys and  there eskeys
export const customLayersFieldAccessors = {
	Units: {
		keys: [
			{ label: 'County', value: 'shapeJson.properties.originalProperties.County.keyword' },
			{ label: 'State', value: 'shapeJson.properties.originalProperties.State.keyword', orKey: 'StateAbbreviation' },
			{ label: 'Survey', value: 'shapeJson.properties.originalProperties.Survey.keyword' },
			{ label: 'Township', value: 'shapeJson.properties.originalProperties.Township.keyword' },
			{ label: 'Range', value: 'shapeJson.properties.originalProperties.Range.keyword' },
			{ label: 'Section', value: 'shapeJson.properties.originalProperties.Section.keyword' },
			{ label: 'Unit Type', value: 'shapeJson.properties.uType.keyword' },
			{ label: 'Unit Status', value: 'shapeJson.properties.uStatus.keyword' },
			{ label: 'Current Operator', value: 'shapeJson.properties.uPrimaryOperator.keyword' },
			{ label: 'Qualifier', value: 'shapeJson.properties.qualifier.name.keyword' },
			{ label: 'Reviewer', value: 'shapeJson.properties.reviewer.name.keyword' },
		],
		layerKey: 'Unit',
	},
	Parcels: {
		keys: [
			{ label: 'County', value: 'shapeJson.properties.originalProperties.County.keyword' },
			{ label: 'State', value: 'shapeJson.properties.originalProperties.State.keyword', orKey: 'StateAbbreviation' },
			{ label: 'Meridian', value: 'shapeJson.properties.originalProperties.Merdian.keyword' },
			{ label: 'Township', value: 'shapeJson.properties.originalProperties.Township.keyword' },
			{ label: 'Range', value: 'shapeJson.properties.originalProperties.Range.keyword' },
			{ label: 'Section', value: 'shapeJson.properties.originalProperties.Section.keyword' },
		],
		layerKey: 'Parcel',
	},
	Agreements: {
		keys: [
			{ label: 'Agremeent Type', value: 'shapeJson.properties.agreementType.keyword' },
			{ label: 'Agremeent Subtype', value: 'shapeJson.properties.agreementSubtype.keyword' },
			{ label: 'Rights Type', value: 'shapeJson.properties.rightsType.keyword' },
			{ label: 'Agreement Status', value: 'shapeJson.properties.agreementStatus.keyword' },
			{ label: 'Grantor', value: 'shapeJson.properties.grantor.keyword' },
			{ label: 'Grantee', value: 'shapeJson.properties.grantee.keyword' },
			{ label: 'County', value: 'shapeJson.properties.originalProperties.County.keyword' },
			{ label: 'State', value: 'shapeJson.properties.originalProperties.State.keyword', orKey: 'StateAbbreviation' },
		],
		layerKey: 'Agreement',
	},
};
