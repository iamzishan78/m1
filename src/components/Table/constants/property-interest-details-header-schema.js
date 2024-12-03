const RevenueStatementHeadCells = [
	{
		name: '_id',
		options: { filter: false, display: false, sort: false, viewColumns: false },
	},
	{
		name: 'ownerName',
		label: 'Owner Name',
		esKey: 'owner.entityDetail.name.keyword',
		options: { sort: true, filter: true },
	},
	{
		name: 'interestType',
		label: 'Interest Type',
		esKey: 'interestType.keyword',
		options: { sort: true, filter: true },
	},
	{
		name: 'productType',
		label: 'Product Type',
		esKey: 'productType.keyword',
		options: { sort: true, filter: true },
	},
	{
		name: 'interestAmount',
		label: 'Interest Amount',
		esKey: 'interestAmount',
		options: { sort: true, filter: true },
		custom: {
			toFixed: 8,
		},
	},
	{
		name: 'effectiveDate',
		label: 'Effective Date',
		esKey: 'effectiveDate',
		options: { sort: true, filter: true },
		custom: {
			key_as_string: true,
			isDate: true,
		},
	},
	{
		name: 'endDate',
		label: 'End Date',
		esKey: 'endDate',
		options: { sort: true, filter: true },
		custom: {
			key_as_string: true,
			isDate: true,
		},
	},
	{
		name: 'interestStatus',
		label: 'Status',
		esKey: 'status.keyword',
		options: { sort: true, filter: true },
	},
	{
		name: 'costFree',
		label: 'Cost Free?',
		esKey: 'costFree.keyword',
		options: { sort: true, filter: true },
	},
	{
		name: 'tags',
		label: 'Tags ',
		esKey: 'tags.tag.keyword',
		options: {
			sort: true,
			download: false,
			print: false,
			filter: true,
		},
	},
	{
		name: 'commentsCounter',
		label: ' ',
		options: {
			filter: false,
			searchable: false,
			sort: true,
			download: false,
			print: false,
			viewColumns: false,
		},
	},
];

export default RevenueStatementHeadCells;
