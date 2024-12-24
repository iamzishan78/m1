import ColumnWithLink from 'components/Shared/M1nTable/components/SubComponents/ColumnWithLink';
import { vf_currency_to_fixed } from 'components/Shared/valueformatters/vf_currency';
import vf_number from 'components/Shared/valueformatters/vf_number';

import { GlobalStickyStyles } from 'GlobalSettings';

const RevenueStatementHeadCells = [
	{
		name: '_id',
		esKey: 'check._id.keyword',
		options: { filter: false, display: false, sort: false, viewColumns: false },
	},

	{
		/// this is the control column for properties
		name: 'number',
		label: 'Check Number',
		esKey: 'check.checkNumber.keyword',
		options: {
			...GlobalStickyStyles({
				setCellProps: {
					left: '124px',
					maxWidth: '300px',
				},
				setCellHeaderProps: {
					left: '124px',
					maxWidth: '300px',
					paddingLeft: '0px',
				},
			}),
			sort: true,
			filter: false,
			viewColumns: false,

			customRender: (value, tableMeta) => {
				return (
					<ColumnWithLink
						value={
							value?.split('_')?.[0]
								? tableMeta?.rowData[3]
									? `${value?.split('_')?.[0]} - ${tableMeta?.rowData[3]}`
									: value
								: tableMeta?.rowData[3]
						}
						link={`/revenue/statement/details/${tableMeta.rowData[0]}`}
						onClick={e => {
							e.stopPropagation();
						}}
					/>
				);
			},
		},
	},
	{
		name: 'propertyName',
		label: 'Property',
		esKey: 'property.name.keyword',
		options: { sort: true, filter: true },
	},
	{
		name: 'purchaser',
		label: 'Payor',
		esKey: 'check.payor.name.keyword',
		options: { sort: true, filter: true },
	},
	{
		name: 'checkDate',
		label: 'Check Date',
		esKey: 'check.checkDate',
		custom: { key_as_string: true, isDate: true },
		options: { sort: true, filter: true },
	},
	{
		name: 'ownerNumber',
		label: 'Owner Number',
		esKey: 'property.ownerNumber.keyword',
		options: { sort: true, filter: true },
	},
	{
		name: '_owner',
		label: 'Owner',
		esKey: 'property._owner.name.keyword',
		options: { sort: true, filter: true },
	},
	{
		name: 'depositDate',
		label: 'Deposit Date',
		esKey: 'check.depositDate',
		custom: { key_as_string: true, isDate: true },
		options: { sort: true, filter: true },
	},
	{
		name: 'checkAmount',
		label: 'Check Amount',
		esKey: 'check.checkAmount',
		options: {
			sort: true,
			filter: true,
			customRender: value => {
				return value ? (
					<p>{value ? `${vf_currency_to_fixed(value, 2)}` : ''}</p>
				) : (
					<p style={{ color: '#898989b0' }}>N/A</p>
				);
			},
		},
	},
	{
		name: 'source',
		label: 'Source',
		esKey: 'check.source.keyword',
		options: { sort: true, filter: true },
	},
	{
		name: 'sourceId',
		label: 'Source Id',
		esKey: 'check.sourceId.keyword',
		options: { sort: true, filter: true },
	},
	{
		name: 'number',
		label: 'Payor Property #',
		esKey: 'property.number.keyword',
		options: { sort: true, filter: true },
	},
	{
		name: 'state',
		label: 'State',
		esKey: 'property.state.keyword',
		options: { sort: true, filter: true },
	},
	{
		name: 'county',
		label: 'County',
		esKey: 'property.county.keyword',
		options: { sort: true, filter: true },
	},
	{
		name: 'date',
		label: 'Sales Date',
		esKey: 'date',
		custom: { key_as_string: true, isDate: true },
		options: { sort: true, filter: true },
	},
	{
		name: 'product',
		label: 'Product',
		esKey: 'product.keyword',
		options: { sort: true, filter: true },
	},
	{
		name: 'disbursement',
		label: 'Decimal Interest',
		esKey: 'disbursement',
		options: { sort: true, filter: true },
	},
	{
		name: 'interestType',
		label: 'Type',
		esKey: 'interestType.keyword',
		options: { sort: true, filter: true },
	},

	{
		name: 'price',
		label: 'Avg Price',
		esKey: 'price',
		options: { sort: true, filter: true },
	},
	{
		name: 'grossPropertyVolume',
		label: 'Prop Gross Volume',
		esKey: 'grossPropertyVolume',
		options: {
			sort: true,
			filter: true,
			customRender: value => {
				return value ? <p>{value ? vf_number(value, 2) : ''}</p> : <p style={{ color: '#898989b0' }}>--</p>;
			},
		},
	},
	{
		name: 'grossPropertyValue',
		label: 'Prop Gross Revenue',
		esKey: 'grossPropertyValue',
		options: {
			sort: true,
			filter: true,
			customRender: value => {
				return value ? <p>{value ? vf_number(value, 2) : ''}</p> : <p style={{ color: '#898989b0' }}>--</p>;
			},
		},
	},
	{
		name: 'grossOwnerVolume',
		label: 'Gross Owner Volume',
		esKey: 'grossOwnerVolume',
		options: {
			sort: true,
			filter: true,
			customRender: value => {
				return value ? <p>{value ? vf_number(value, 2) : ''}</p> : <p style={{ color: '#898989b0' }}>--</p>;
			},
		},
	},
	{
		name: 'grossOwnerValue',
		label: 'Owner Gross Revenue',
		esKey: 'grossOwnerValue',
		options: {
			sort: true,
			filter: true,
			customRender: value => {
				return value ? <p>{value ? vf_number(value, 2) : ''}</p> : <p style={{ color: '#898989b0' }}>--</p>;
			},
		},
	},
	{
		name: 'ownerTax',
		label: 'Owner Tax Amt',
		esKey: 'ownerTax',
		options: {
			sort: true,
			filter: true,
			customRender: value => {
				return value ? <p>{value ? vf_number(value, 2) : ''}</p> : <p style={{ color: '#898989b0' }}>--</p>;
			},
		},
	},
	{
		name: 'taxType',
		label: 'Tax Type',
		esKey: 'taxType.keyword',
		options: { sort: true, filter: true },
	},
	{
		name: 'ownerDeducts',
		label: 'Deduct Amt',
		esKey: 'ownerDeducts',
		options: {
			sort: true,
			filter: true,
			customRender: value => {
				return value ? <p>{value ? vf_number(value, 2) : ''}</p> : <p style={{ color: '#898989b0' }}>--</p>;
			},
		},
	},
	{
		name: 'deductType',
		label: 'Deduct Cd',
		esKey: 'deductType.keyword',
		options: { sort: true, filter: true },
	},
	{
		name: 'netOwnerValue',
		label: 'Owner Net Rev',
		esKey: 'netOwnerValue',
		options: {
			sort: true,
			filter: true,
			customRender: value => {
				return value ? <p>{value ? vf_number(value, 2) : ''}</p> : <p style={{ color: '#898989b0' }}>--</p>;
			},
		},
	},
	{
		name: 'propertyId',
		options: { filter: false, display: false, sort: false, viewColumns: false },
	},
];

export default RevenueStatementHeadCells;
