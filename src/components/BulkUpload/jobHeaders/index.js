const UNITS = require('./UNITS').default;
const TRACTS = require('./TRACTS').default;
const AGREEMENT_HEADER = require('./AGREEMENT_HEADER').default;
const AGREEMENT_COMMENTS = require('./AGREEMENT_COMMENTS').default;
const AGREEMENT_PROVISIONS = require('./AGREEMENT_PROVISIONS').default;
const CONTACTS_WELL_INTEREST = require('./CONTACTS_WELL_INTEREST').default;
const AGREEMENT_RELATED_WELLS = require('./AGREEMENT_RELATED_WELLS').default;
const AGREEMENT_RELATED_TRACTS = require('./AGREEMENT_RELATED_TRACTS').default;
const AGREEMENT_SHAPE = require('./AGREEMENT_SHAPE').default;
const CHECKDETAILS = require('./CHECKDETAILS').default;
const CONTACT_COMMENTS = require('./CONTACT_COMMENTS').default;
const CONTACTS = require('./CONTACTS').default;
const PARCELINTERESTS = require('./PARCELINTERESTS').default;
const PROPERTIES = require('./PROPERTIES').default;
const SHAPEOWNER = require('./SHAPEOWNER').default;
const TRACT_COMMENTS = require('./TRACT_COMMENTS').default;
const TRACT_SHAPE = require('./TRACT_SHAPE').default;
const UNIT_SHAPE = require('./UNIT_SHAPE').default;
const eportData = {
	CONTACTS,
	TRACTS,
	UNITS,
	PARCELINTERESTS,
	SHAPEOWNER,
	CHECKDETAILS,
	PROPERTIES,
	CONTACTS_WELL_INTEREST,
	AGREEMENT_SHAPE,
	UNIT_SHAPE,
	TRACT_SHAPE,
	AGREEMENT_HEADER,
	AGREEMENT_PROVISIONS,
	AGREEMENT_COMMENTS,
	CONTACT_COMMENTS,
	AGREEMENT_RELATED_WELLS,
	AGREEMENT_RELATED_TRACTS,
	TRACT_COMMENTS,
};
export default eportData;

export const addAfterLabel = (data, label, insertData) => {
	const index = data.findIndex(row => row.label === label);
	data.splice(index, 0, insertData);
};

export const removeByLabel = (data, label) => {
	return data.filter(row => row.label !== label);
};

export const getCustomFieldHeaders = (jobType, metaData) => {
	let customFieldHeaders = [];

	switch (jobType) {
		case 'TRACTS':
			customFieldHeaders = (metaData || [])
				.filter(md => md.category === 'Parcel')
				.map(md => ({
					...md,
					actual_key: `parcel.custom_data.${md.name}`,
				}));
			break;

		case 'UNITS':
			customFieldHeaders = (metaData || [])
				.filter(md => md.category === 'Unit')
				.map(md => ({
					...md,
					actual_key: `shape.custom_data.${md.name}`,
				}));
			break;

		case 'CONTACTS':
			customFieldHeaders = (metaData || [])
				.filter(md => md.category === 'Contacts')
				.map(md => ({
					...md,
					actual_key: `entityDetail.custom_data.${md.name}`,
				}));
			break;

		case 'AGREEMENT_SHAPE':
			customFieldHeaders = (metaData || [])
				.filter(md => md.category === 'Agreement')
				.map(md => ({
					...md,
					actual_key: `custom_data.${md.name}`,
				}));
			break;

		case 'TRACT_SHAPE':
			customFieldHeaders = (metaData || [])
				.filter(md => md.category === 'Parcel')
				.map(md => ({
					...md,
					actual_key: `custom_data.${md.name}`,
				}));
			break;

		case 'UNIT_SHAPE':
			customFieldHeaders = (metaData || [])
				.filter(md => md.category === 'Unit')
				.map(md => ({
					...md,
					actual_key: `custom_data.${md.name}`,
				}));
			break;

		default:
			break;
	}

	return customFieldHeaders;
};
