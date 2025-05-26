import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import contactTaxRollInterestToolbar from 'components/MRTTable/TablesOverride/TaxRollInterest/contactTaxRollInterestToolbar';

import { GET_CONTACT_TAX_ROLL_INTERESTS_QUERY } from 'graphQL/useQueryGetContactTaxRollInterests';

const TaxRollInterestsMeta = {
	query: GET_CONTACT_TAX_ROLL_INTERESTS_QUERY,
	maxTableHeight: 'calc(50vh - 120px)',
	getVariables: tableMeta => {
		const { contactId } = tableMeta?.customProps || {};

		if (!contactId) {
			return null;
		}

		return {
			contactId,
		};
	},
	getDataFromRes: res => res?.data?.contactTaxRollInterests || [],
	getIdsFromRows: rows => rows?.map(row => row?.globalWell) || [],
	CustomToolBar: contactTaxRollInterestToolbar,
	isClientSide: true,
	isDeleteDisabled: true,
	enableFacetedValues: true,
	isInFiniteScroll: true,
	TableSchema: [
		{
			...CommonSchema.INITAIL_PINNED,
			header: 'Api Number',
			id: 'api',
			name: 'api',
		},
		{
			...CommonSchema.INITAIL_PINNED,
			header: 'Well Name',
			id: 'wellName',
			name: 'wellName',
		},
		{
			...CommonSchema.SELECT_STRING_COLUMN,
			header: 'County',
			id: 'county',
			name: 'county',
		},
		{
			...CommonSchema.SELECT_STRING_COLUMN,
			header: 'Block',
			id: 'block',
			name: 'block',
		},
		{
			...CommonSchema.SELECT_STRING_COLUMN,
			header: 'Section',
			id: 'section',
			name: 'section',
		},
		{
			...CommonSchema.SELECT_STRING_COLUMN,
			header: 'Survey',
			id: 'survey',
			name: 'survey',
		},
		{
			...CommonSchema.SELECT_STRING_COLUMN,
			header: 'Abstract',
			id: 'abstract',
			name: 'abstract',
		},
		{
			...CommonSchema.SELECT_STRING_COLUMN,
			header: 'Lease ID',
			id: 'leaseId',
			name: 'leaseId',
		},
		{
			...CommonSchema.SELECT_STRING_COLUMN,
			header: 'Lease',
			id: 'lease',
			name: 'lease',
		},
		{
			...CommonSchema.NUMBER_COLUMN,
			header: 'Lease Acres',
			id: 'leaseAcres',
			name: 'leaseAcres',
		},
		{
			...CommonSchema.SELECT_STRING_COLUMN,
			header: 'Property Name',
			id: 'propertyName',
			name: 'propertyName',
		},
		{
			...CommonSchema.SELECT_STRING_COLUMN,
			header: 'Interest Owner',
			id: 'interestOwner',
			name: 'interestOwner',
		},
		{
			...CommonSchema.SELECT_STRING_COLUMN,
			header: 'Type',
			id: 'type',
			name: 'type',
		},
		{
			...CommonSchema.INTEREST_COLUMN,
			header: 'Amount',
			id: 'amount',
			name: 'amount',
		},
		{
			...CommonSchema.CURRENCY_COLUMN,
			header: 'Tax Value',
			id: 'taxValue',
			name: 'taxValue',
		},
		{
			...CommonSchema.INTEREST_COLUMN,
			header: 'NRA',
			id: 'nra',
			name: 'nra',
		},
	],
};

export default TaxRollInterestsMeta;
