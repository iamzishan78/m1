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
			accessorKey: 'api',
			name: 'api',
			accessorFn: row => row?.api,
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Well Name',
			accessorKey: 'wellName',
			name: 'wellName',
			accessorFn: row => row?.wellName,
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'County',
			accessorKey: 'county',
			name: 'county',
			accessorFn: row => row?.county,
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Lease ID',
			accessorKey: 'leaseId',
			name: 'leaseId',
			accessorFn: row => row?.leaseId,
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Lease',
			accessorKey: 'lease',
			name: 'lease',
			accessorFn: row => row?.lease,
		},
		{
			...CommonSchema.NUMBER_COLUMN,
			header: 'Lease Acers',
			accessorKey: 'leaseAcres',
			name: 'leaseAcres',
			accessorFn: row => row?.leaseAcres,
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Property Name',
			accessorKey: 'propertyName',
			name: 'propertyName',
			accessorFn: row => row?.propertyName,
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Interest Owner',
			accessorKey: 'interestOwner',
			name: 'interestOwner',
			accessorFn: row => row?.interestOwner,
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Type',
			accessorKey: 'type',
			name: 'type',
			accessorFn: row => row?.type,
		},
		{
			...CommonSchema.NUMBER_COLUMN,
			header: 'Amount',
			accessorKey: 'amount',
			name: 'amount',
			accessorFn: row => row?.amount,
		},
		{
			...CommonSchema.CURRENCY_COLUMN,
			header: 'Tax Value',
			accessorKey: 'taxValue',
			name: 'taxValue',
		},
		{
			...CommonSchema.NUMBER_COLUMN,
			header: 'NRA',
			accessorKey: 'nra',
			name: 'nra',
			accessorFn: row => row?.nra,
		},
	],
};

export default TaxRollInterestsMeta;
