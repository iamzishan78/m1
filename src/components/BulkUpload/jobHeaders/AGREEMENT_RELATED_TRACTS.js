import { copy } from 'components/Shared/functions';

import { landColumns } from './COMMON';

const tracts = [
	{
		label: 'Agreement System ID',
		mapped_key: '',
		required: true,
		actual_key: 'agreement._id',
	},
	{
		label: 'Agreement Number',
		mapped_key: '',
		required: true,
		actual_key: 'agreement.agreementNumber',
	},
	{
		label: 'Parcel Id',
		mapped_key: '',
		required: true,
		actual_key: 'parcel._id',
	},
	{
		label: 'Parcel Name',
		mapped_key: '',
		required: true,
		actual_key: 'parcel.name',
	},
	{
		label: 'Basin',
		mapped_key: '',
		required: true,
		actual_key: 'parcel.basin',
	},
	{
		label: 'Field',
		mapped_key: '',
		required: true,
		actual_key: 'parcel.field',
	},
	...copy(landColumns),
	{
		label: 'Description',
		mapped_key: '',
		actual_key: 'parcel.legalDescription',
	},
	{
		label: 'QTR1',
		mapped_key: '',
		required: false,
		actual_key: 'parcel.qtr.0',
	},
	{
		label: 'QTR2',
		mapped_key: '',
		required: false,
		actual_key: 'parcel.qtr.1',
	},
	{
		label: 'QTR3',
		mapped_key: '',
		required: false,
		actual_key: 'parcel.qtr.2',
	},
	{
		label: 'QTR4',
		mapped_key: '',
		required: false,
		actual_key: 'parcel.qtr.3',
	},
	{
		label: 'Gross Acres',
		mapped_key: '',
		required: false,
		actual_key: 'parcel.sdGrossAcres',
	},
	{
		label: 'Department',
		mapped_key: '',
		required: false,
		actual_key: 'parcel.department',
	},
	{
		label: 'Map Status',
		mapped_key: '',
		required: false,
		actual_key: 'parcel.mapStatus',
	},
	{
		label: 'Contact Id',
		mapped_key: '',
		required: false,
		actual_key: '_id',
	},
	{
		label: 'Full Name',
		mapped_key: '',
		required: false,
		actual_key: 'entityDetail.name',
	},
	{
		label: 'First Name',
		mapped_key: '',
		required: false,
		actual_key: 'entityDetail.firstName',
	},
	{
		label: 'Last Name',
		mapped_key: '',
		required: false,
		actual_key: 'entityDetail.lastName',
	},
	{
		label: 'Primary Address 1',
		mapped_key: '',
		required: false,
		actual_key: 'entityDetail.address1',
	},
	{
		label: 'Primary Address 2',
		mapped_key: '',
		required: false,
		actual_key: 'entityDetail.address2',
	},
	{
		label: 'City',
		mapped_key: '',
		required: false,
		actual_key: 'entityDetail.city',
	},
	{
		label: 'AddressState',
		mapped_key: '',
		required: false,
		actual_key: 'entityDetail.state',
	},
	{
		label: 'Zip',
		mapped_key: '',
		required: false,
		actual_key: 'entityDetail.zip',
	},
	{
		label: 'Country',
		mapped_key: '',
		required: false,
		actual_key: 'entityDetail.country',
	},
	{
		label: 'Surface Interest',
		mapped_key: '',
		required: false,
		actual_key: 'owner.surface_interest',
	},
	{
		label: 'Mineral Interest',
		mapped_key: '',
		required: false,
		actual_key: 'owner.mineral_interest',
	},
	{
		label: 'Royalty Interest',
		mapped_key: '',
		required: false,
		actual_key: 'owner.royalty_interest',
	},
	{
		label: 'Overriding Royalty',
		mapped_key: '',
		required: false,
		actual_key: 'owner.orri',
	},
	{
		label: 'Working Interest',
		mapped_key: '',
		required: false,
		actual_key: 'owner.working_interest',
	},
	{
		label: 'Net Revenue Interest',
		mapped_key: '',
		required: false,
		actual_key: 'owner.nri',
	},
	{
		label: 'Net Acres',
		mapped_key: '',
		required: false,
		actual_key: 'owner.net_acres',
	},
	{
		label: 'Company Net Acres',
		mapped_key: '',
		required: false,
		actual_key: 'owner.company_net_acres',
	},
	{
		label: 'Net Royalty Acres',
		mapped_key: '',
		required: false,
		actual_key: 'owner.nra',
	},
	// {
	//     label: "Lease Royalty Interest",
	//     mapped_key: "",
	//     required: false,
	//     actual_key: "owner.lease_royalty_interest"
	// },
	{
		label: 'Acquistion $/NRA',
		mapped_key: '',
		required: false,
		actual_key: 'owner.acquisition_nra',
	},
	{
		label: 'Acquisition Cost',
		mapped_key: '',
		required: false,
		actual_key: 'owner.acquisition_cost',
	},
	{
		label: 'Depth From',
		mapped_key: '',
		required: false,
		actual_key: 'owner.depthFrom',
	},
	{
		label: 'Depth To',
		mapped_key: '',
		required: false,
		actual_key: 'owner.depthTo',
	},
	{
		label: 'Tract Status',
		mapped_key: '',
		required: false,
		actual_key: 'owner.tractStatus',
	},
	{
		label: 'Count Acres',
		mapped_key: '',
		required: false,
		actual_key: 'owner.countAcres',
	},
];

export default tracts;
