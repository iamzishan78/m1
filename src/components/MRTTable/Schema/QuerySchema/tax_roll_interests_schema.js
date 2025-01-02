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
	isSelectAllAllowed: true,
	isDeleteDisabled: true,
	isExportDisabled: true,
	enableFacetedValues: true,
	isInFiniteScroll: true,
	columnVirtualization: true,
	TableSchema: [
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Api Number',
			id: 'api',
			name: 'api',
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Well Name',
			id: 'wellName',
			name: 'wellName',
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'County',
			id: 'county',
			name: 'county',
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Lease ID',
			id: 'leaseId',
			name: 'leaseId',
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Lease',
			id: 'lease',
			name: 'lease',
		},
		{
			...CommonSchema.NUMBER_COLUMN,
			header: 'Lease Acers',
			id: 'leaseAcres',
			name: 'leaseAcres',
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Property Name',
			id: 'propertyName',
			name: 'propertyName',
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Interest Owner',
			id: 'interestOwner',
			name: 'interestOwner',
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Type',
			id: 'type',
			name: 'type',
		},
		{
			...CommonSchema.NUMBER_COLUMN,
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
			...CommonSchema.NUMBER_COLUMN,
			header: 'NRA',
			id: 'nra',
			name: 'nra',
		},
	],
};

export default TaxRollInterestsMeta;
