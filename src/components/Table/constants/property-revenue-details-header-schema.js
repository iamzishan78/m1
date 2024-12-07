import ColumnWithLink from 'components/Shared/M1nTable/components/SubComponents/ColumnWithLink';

//value formatters
import vf_number from 'components/Shared/valueformatters/vf_number';
import { vf_currency_to_fixed } from 'components/Shared/valueformatters/vf_currency';

const RevenueStatementHeadCells = [
	{
		name: '_id',
		options: { filter: false, display: false, sort: false, viewColumns: false },
	},
	{
		name: 'checkId',
		options: { filter: false, display: false, sort: false, viewColumns: false },
	},
	{
		name: 'checkNumber',
		label: 'Check #',
		esKey: 'check.checkNumber.keyword',
		options: {
			customHeadLabelRender: () => (
				<>
					<div style={{ minWidth: 80 }}>Check #</div>
				</>
			),
			customRender: (value, tableMeta) => {
				return (
					<ColumnWithLink
						value={value}
						link={`/revenue/statement/details/${tableMeta.rowData[1]}`}
						onClick={e => {
							e.stopPropagation();
						}}
					/>
				);
			},
			sort: true,
			filter: true,
		},
	},
	{
		name: 'purchaser',
		label: 'Payor',
		esKey: 'check.payor.name.keyword',
		options: { sort: true, filter: true },
		style: { minWidth: 210 },
	},
	{
		name: 'purchaserNumber',
		label: 'Purhaser Property #',
		esKey: 'property.purchaserNumber.keyword',
		options: {
			customHeadLabelRender: () => (
				<>
					<div style={{ minWidth: 80 }}>Payor Property #</div>
				</>
			),
			sort: true,
			filter: true,
		},
		style: { minWidth: 150 },
	},
	{
		name: 'number',
		label: 'Operator Property #',
		esKey: 'property.number.keyword',
		options: {
			customHeadLabelRender: () => (
				<>
					<div style={{ minWidth: 80 }}>Operator Property #</div>
				</>
			),
			sort: true,
			filter: true,
			display: false,
		},
		style: { minWidth: 150 },
	},
	{
		name: 'name',
		label: 'Property Name',
		esKey: 'property.name.keyword',
		options: { sort: true, filter: true },
		style: { minWidth: 210 },
	},
	{
		name: 'checkDate',
		label: 'Check Date',
		esKey: 'check.checkDate',
		custom: { key_as_string: true, isDate: true },
		options: { sort: true, filter: true },
	},
	{
		name: 'salesDate',
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
		esKey: 'disbursement.keyword',
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
		options: {
			sort: true,
			filter: true,
			customRender: value => {
				return value ? (
					<p>{value ? `${vf_currency_to_fixed(value, 2)}` : ''}</p>
				) : (
					<p style={{ color: '#898989b0' }}>--</p>
				);
			},
		},
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
				return value ? (
					<p>{value ? `${vf_currency_to_fixed(value, 2)}` : ''}</p>
				) : (
					<p style={{ color: '#898989b0' }}>--</p>
				);
			},
		},
	},
	{
		name: 'grossOwnerVolume',
		label: 'Owner Volume',
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
				return value ? (
					<p>{value ? `${vf_currency_to_fixed(value, 2)}` : ''}</p>
				) : (
					<p style={{ color: '#898989b0' }}>--</p>
				);
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
				return value ? (
					<p>{value ? `${vf_currency_to_fixed(value, 2)}` : ''}</p>
				) : (
					<p style={{ color: '#898989b0' }}>--</p>
				);
			},
		},
	},
	{
		name: 'taxType',
		label: 'Tax Type',
		esKey: 'taxType',
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
				return value ? (
					<p>{value ? `${vf_currency_to_fixed(value, 2)}` : ''}</p>
				) : (
					<p style={{ color: '#898989b0' }}>--</p>
				);
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
				return value ? (
					<p>{value ? `${vf_currency_to_fixed(value, 2)}` : ''}</p>
				) : (
					<p style={{ color: '#898989b0' }}>--</p>
				);
			},
		},
	},
];

export default RevenueStatementHeadCells;
