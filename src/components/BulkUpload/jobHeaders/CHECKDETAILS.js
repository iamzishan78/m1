const checkDetailsKeys = [
	{
		// unmapped
		label: 'UID',
		mapped_key: 'Line Number',
		required: true,
		actual_key: 'lineNumber',
		showAsSample: false,
	},
	{
		// unmapped
		label: 'Payor',
		mapped_key: '',
		required: false,
		actual_key: 'check.payor.name',
		showAsSample: false,
	},
	{
		label: 'Check Number',
		mapped_key: '',
		required: false,
		actual_key: 'check.checkNumber',
		showAsSample: false,
	},
	{
		label: 'Check Amount',
		mapped_key: '',
		required: false,
		actual_key: 'check.checkAmount',
		showAsSample: false,
	},
	{
		label: 'Check Date',
		mapped_key: '',
		required: false,
		actual_key: 'check.checkDate',
		showAsSample: false,
	},
	{
		// unmapped
		label: 'M1 Property ID',
		mapped_key: '',
		required: false,
		actual_key: 'property._id',
	},
	{
		// unmapped
		label: 'Payor Prop #',
		mapped_key: '',
		required: false,
		actual_key: 'property.purchaserNumber',
	},
	{
		label: 'Operator CC',
		mapped_key: '',
		required: false,
		actual_key: 'property.number',
	},
	{
		// unmapped
		label: 'Accounting Ref ID',
		mapped_key: '',
		required: false,
		actual_key: 'property.internalID',
	},
	{
		// unmapped
		label: 'Property Name',
		mapped_key: '',
		required: false,
		actual_key: 'property.name',
	},
	{
		label: 'Operator Name',
		mapped_key: '',
		required: false,
		actual_key: 'property.operator',
	},
	{
		label: 'Owner Number',
		mapped_key: '',
		required: false,
		actual_key: 'check.payee.number',
		showAsSample: false,
	},
	{
		label: 'Owner Name',
		mapped_key: '',
		required: false,
		actual_key: 'check.payee.name',
		showAsSample: false,
	},
	{
		label: 'Owner Percent',
		mapped_key: '',
		required: false,
		actual_key: 'check.payee.percent',
		showAsSample: false,
	},
	{
		label: 'Distribution Percent',
		mapped_key: '',
		required: false,
		actual_key: 'check.payee.distributionPercent',
		showAsSample: false,
	},
	{
		label: 'BTU Factor',
		mapped_key: '',
		required: false,
		actual_key: 'BTU',
	},
	{
		// Prod Date
		label: 'Sales Date',
		mapped_key: '',
		required: true,
		actual_key: 'date',
	},
	{
		label: 'Product Code Description',
		mapped_key: '',
		required: false,
		actual_key: 'product',
	},
	{
		label: 'Property Description',
		mapped_key: '',
		required: false,
		actual_key: 'property.description',
	},
	{
		// unmapped
		label: 'Decimal Interest',
		mapped_key: '',
		required: false,
		actual_key: 'disbursement',
	},
	{
		label: 'Interest Type',
		mapped_key: '',
		required: false,
		actual_key: 'interestType',
	},
	{
		label: 'Price',
		mapped_key: '',
		required: false,
		actual_key: 'price',
	},
	{
		label: 'Gross Volume',
		mapped_key: '',
		required: false,
		actual_key: 'grossPropertyVolume',
	},
	{
		label: 'Gross Value',
		mapped_key: '',
		required: false,
		actual_key: 'grossPropertyValue',
	},
	{
		label: 'Gross Taxes',
		mapped_key: '',
		required: false,
		actual_key: 'grossPropertyTaxes',
	},
	{
		label: 'Gross Deducts',
		mapped_key: '',
		required: false,
		actual_key: 'grossPropertyDeducts',
	},
	{
		label: 'Owner Volume',
		mapped_key: '',
		required: false,
		actual_key: 'grossOwnerVolume',
	},
	{
		label: 'Owner Value',
		mapped_key: '',
		required: false,
		actual_key: 'grossOwnerValue',
	},
	{
		label: 'Owner Taxes',
		mapped_key: '',
		required: false,
		actual_key: 'ownerTax',
	},
	{
		label: 'Tax Type 1',
		mapped_key: '',
		required: false,
		actual_key: 'taxType',
	},
	{
		label: 'Owner Deducts',
		mapped_key: '',
		required: false,
		actual_key: 'ownerDeducts',
	},
	{
		label: 'Deduct Type 1',
		mapped_key: '',
		required: false,
		actual_key: 'deductType',
	},
	{
		label: 'Owner Net Value',
		mapped_key: '',
		required: false,
		actual_key: 'netOwnerValue',
	},
	{
		label: 'Net Value',
		mapped_key: '',
		required: false,
		actual_key: 'netValue',
	},

	{
		// unmapped
		label: 'Line Number',
		mapped_key: '',
		required: true,
		actual_key: 'lineNumber',
		showAsSample: false,
	},

	{
		label: 'Detail Line Notation',
		mapped_key: '',
		required: false,
		actual_key: 'detailLineNotation',
	},
];

export default checkDetailsKeys;
