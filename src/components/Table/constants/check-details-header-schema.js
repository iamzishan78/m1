
import { Typography } from "@material-ui/core";
import ColumnWithLink from "components/Shared/M1nTable/components/SubComponents/ColumnWithLink";
import vf_number from "components/Shared/valueformatters/vf_number";
import { GlobalStickyStyles } from "GlobalSettings";
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from "@material-ui/core/styles";
import { Tooltip } from '@mui/material';
import vf_currency from "components/Shared/valueformatters/vf_currency";

const getFormattedValue = (value,  { currency = false, toFixed } = {}) => {
    return <Typography>{value ? currency ? vf_currency(value) : vf_number(value, toFixed) : <span style={{ color: 'rgb(149,149,149)' }}>--</span>}</Typography>;
}

const useStyles = makeStyles({
	deleteIcon: {
		color: 'red',
		verticalAlign: 'middle',
		marginLeft: '8px', // optional: adds some space between text and icon
	},
});


const DeletedPropertyName = ({ value }) => {
	const classes = useStyles();

	return (
		<Tooltip title="This Property is Deleted">
			{value} <DeleteIcon className={classes.deleteIcon} />
		</Tooltip>
	);
};


const RevenueStatementHeadCells = [
	{
		name: "_id", options: { filter: false, display: false, sort: false, viewColumns: false, }
	},
	{
		/// this is the control column for properties 
		name: "purchaserNumber",
		label: "Property",
		// esKey: 'property.number.keyword',
		options: {
			...GlobalStickyStyles({
				setCellProps: {
					left: "77px",
					maxWidth: "300px"
				},
				setCellHeaderProps: {
					left: "77px",
					maxWidth: "300px",
					paddingLeft: '0px',
				}
			}),
			sort: true, filter: false,

			customRender: (value, tableMeta) => {
				const clickable = tableMeta.rowData?.[23]
				if (clickable) {
					return (
						<ColumnWithLink
							value={value?.split("_")?.[0]
								? tableMeta?.rowData[3] ? `${value?.split("_")?.[0]} - ${tableMeta?.rowData[3]}` : value
								: tableMeta?.rowData[3]}
							link={`/revenue/property/details/${tableMeta.rowData[21]}`}
							onClick={(e) => {
								e.stopPropagation();
							}}
						/>
					)
				} else {
					value =
						value?.split("_")?.[0]
							? tableMeta?.rowData[3] ? `${value?.split("_")?.[0]} - ${tableMeta?.rowData[3]}` : value
							: tableMeta?.rowData[3]

					return <DeletedPropertyName value={value} />
				}
			}
		},
	},
	{
		name: "purchaserNumber", label: "Payor Prop #", esKey: 'property.purchaserNumber.keyword', options: { filter: true, style: { minWidth: 250 }, }
	},
	{
		name: "name", label: "Property Name", esKey: 'property.name.keyword', options: { filter: true }
	},
	{
		name: "number", label: "Operator Prop #", esKey: 'property.number.keyword', options: { filter: true, style: { minWidth: 250 }, }
	},
	{
		name: "state", label: "State", esKey: 'property.state.keyword', options: { sort: true, filter: true }
	},
	{
		name: "county", label: "County", esKey: 'property.county.keyword', options: { sort: true, filter: true }
	},
	{
		name: "date", label: "Sales Date", esKey: 'date', custom: { key_as_string: true, isDate: true }, options: { sort: true, filter: true }
	},
	{
		name: "product", label: "Product", esKey: 'product.keyword', options: { sort: true, filter: true }
	},
	{
		name: "disbursement", label: "Decimal Interest", esKey: 'disbursement', options: { sort: true, filter: true }
	},
	{
		name: "interestType", label: "Type", esKey: 'interestType.keyword', options: { sort: true, filter: true }
	},
	{
		name: "price", label: "Avg Price", esKey: 'price', options: {
			sort: true, filter: true, customRender: (value) => getFormattedValue(value, { currency: true })
		}
	},
	{
		name: "grossPropertyVolume", label: "Prop Gross Volume", esKey: 'grossPropertyVolume', options: { sort: true, filter: true, customRender: (value) => getFormattedValue(value,  { toFixed: 0 }) }
	},
	{
		name: "grossPropertyValue", label: "Prop Gross Revenue", esKey: 'grossPropertyValue', options: { sort: true, filter: true, customRender: (value) => getFormattedValue(value, { currency: true }) }
	},
	{
		name: "grossOwnerVolume", label: "Owner Volume", esKey: 'grossOwnerVolume', options: { sort: true, filter: true, customRender: (value) => getFormattedValue(value) }
	},
	{
		name: "grossOwnerValue", label: "Owner Gross Revenue", esKey: 'grossOwnerValue', options: { sort: true, filter: true, customRender: (value) => getFormattedValue(value, { currency: true }) }
	},
	{
		name: "ownerTax", label: "Owner Tax Amt", esKey: 'ownerTax', options: { sort: true, filter: true, customRender: (value) => getFormattedValue(value) }
	},
	{
		name: "taxType", label: "Tax Type", esKey: 'taxType', options: { sort: true, filter: true }
	},
	{
		name: "ownerDeducts", label: "Deduct Amt", esKey: 'ownerDeducts', options: { sort: true, filter: true, customRender: (value) => getFormattedValue(value) }
	},
	{
		name: "deductType", label: "Deduct Cd", esKey: 'deductType.keyword', options: { sort: true, filter: true }
	},
	{
		name: "netOwnerValue", label: "Owner Net Rev", esKey: 'netOwnerValue', options: { sort: true, filter: true, customRender: (value) => getFormattedValue(value) }
	},
	{
		name: "propertyId", options: { filter: false, display: false, sort: false, viewColumns: false, }
	},

	{
		name: "commentsCounter",
		label: " ",
		options: {
			dbName: "comments.comment",
			filter: false,
			searchable: false,
			sort: true,
			download: false,
			print: false,
			viewColumns: false,
		},
	},
	{
		name: "clickable", options: { filter: false, display: false, sort: false, viewColumns: false, }
	},
];

export default RevenueStatementHeadCells;