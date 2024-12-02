const CONTACTS_FIELDS = require('./CONTACTS').default;

const fields = JSON.parse(JSON.stringify(CONTACTS_FIELDS));
fields.splice(CONTACTS_FIELDS.length - 1, 1);
export default [
	...fields,
	{
		label: 'Well ID',
		mapped_key: '',
		required: true,
		actual_key: 'well.globalWell',
	},
	{
		label: 'API Number',
		mapped_key: '',
		required: true,
		actual_key: 'well.apiNumber',
	},
	{
		label: 'Well Name',
		mapped_key: '',
		required: true,
		actual_key: 'well.wellName',
	},
	{
		label: 'Well State',
		mapped_key: '',
		required: false,
		actual_key: 'well.state',
	},
	{
		label: 'Well County',
		mapped_key: '',
		required: false,
		actual_key: 'well.county',
	},
	{
		label: 'Lease ID',
		mapped_key: '',
		required: false,
		actual_key: 'well.leaseId',
	},
	{
		label: 'Lease Name',
		mapped_key: '',
		required: false,
		actual_key: 'well.lease',
	},
	{
		label: 'Lease Acres',
		mapped_key: '',
		required: false,
		actual_key: 'well.leaseAcres',
	},
	{
		label: 'Interest Type',
		mapped_key: '',
		required: false,
		actual_key: 'wellInterest.type',
	},
	{
		label: 'Interest Amount',
		mapped_key: '',
		required: false,
		actual_key: 'wellInterest.interest',
	},
	{
		label: 'NRA',
		mapped_key: '',
		required: false,
		actual_key: 'wellInterest.nra',
	},
	{
		label: 'Price Per Acre',
		mapped_key: '',
		required: false,
		actual_key: 'wellInterest.price_per_acre',
	},
	{
		label: 'Tags',
		mapped_key: '',
		required: false,
		actual_key: 'wellInterest.tags',
	},
];
