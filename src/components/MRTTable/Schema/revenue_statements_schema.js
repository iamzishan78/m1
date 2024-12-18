// Importing necessary dependencies and components
import React from 'react';
import ColumnWithLink from 'components/Shared/M1nTable/components/SubComponents/ColumnWithLink.js';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import { Warning as WarningIcon, CheckCircle } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { formatDate } from 'components/Shared/functions';
import { LocalAtm as CurrencyIcon } from '@material-ui/icons';
import { vf_currency_to_fixed } from 'components/Shared/valueformatters/vf_currency';
// Define styles for tooltip
const useStyles = makeStyles(theme => ({
	tooltip: {
		position: 'absolute',
		top: 15,
		display: 'none',
		color: 'rgb(255, 0, 0)',
		width: 200,
		left: -150,
	},
}));

// Elasticsearch index for revenue statements
const esIndex = 'checks_flat';

// Metadata for the Revenue Statements table
const RevenueStatementsMeta = {
	esIndex,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	defaultSort: { field: 'checkDate', order: 'desc' }, // set default sort by checkDate
	maxTableHeight: 'calc(100vh - 500px)',
	isInFiniteScroll: true,
	columnVirtualization: true,
	gridViewSettings: {
		label: 'Revenue Statements',
		module: 'RevenueStatements',
		Icon: CurrencyIcon,
		defaultView: {
			name: 'All Revenue Statements',
			type: 'Default',
		},
		handleDefaultView: (view, user) => {
			return view;
		},
		cssOverride: {
			top: '440px',
			left: '5px',
		},
	},
	TableSchema: [
		// Hidden columns
		{
			...CommonSchema.MONGO_ID,
			name: '_id',
			accessorKey: '_id',
		},
		// Column for Check Number with link
		{
			...CommonSchema.INITAIL_PINNED,
			name: 'checkNumber.keyword',
			accessorKey: 'checkNumber',
			header: 'Check Number',
			// Cell rendering for Check Number column
			Cell: ({ renderedCellValue, row }) => {
				const checkNumber = row?.original?.checkNumber;
				const payor = row.getValue('payor.name');
				return (
					<ColumnWithLink
						value={checkNumber && payor ? `${checkNumber} - ${payor}` : checkNumber || payor || 'N/A'}
						link={`/revenue/statement/details/${row.getValue('_id')}`}
						onClick={e => {
							e.stopPropagation();
						}}
					/>
				);
			},
		},
		// Column for Check Amount
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'checkAmount',
			accessorFn: row => vf_currency_to_fixed(row?.checkAmount, 2), //Commma sperated checkamount after each thousand
			id: 'checkAmount',
			header: 'Check Amount',
			isSearchField: false,
			Cell: ({ row }) => <>{vf_currency_to_fixed(row?.original?.checkAmount, 2)}</>,
		},
		// Column for Check Date
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'checkDate',
			accessorFn: row => row?.checkDate,
			id: 'checkDate',
			header: 'Check Date',
			simple: true,
			type: 'date',
			isSearchField: false,
			// Cell rendering for Check Date column
			Cell: ({ renderedCellValue, row }) => {
				return <>{formatDate(row?.original?.checkDate)}</>;
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'payor.name.keyword',
			accessorFn: row => row?.payor?.name,
			id: 'payor.name',
			header: 'Payor Name',
		},
		// Columns for Payee details
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'payee.name.keyword',
			accessorFn: row => row?.payee?.name,
			id: 'payee.name',
			header: 'Owner Name',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'payee.number.keyword',
			accessorFn: row => row?.payee?.number,
			id: 'payee.number',
			header: 'Owner Number',
		},
		// Column for Deposit Date
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'depositDate',
			accessorFn: row => row?.depositDate,
			id: 'depositDate',
			header: 'Deposit Date',
			simple: true,
			type: 'date',
			isSearchField: false,
			// Cell rendering for Deposit Date column
			Cell: ({ renderedCellValue, row }) => {
				return <>{formatDate(row?.original?.depositDate)}</>;
			},
		},
		// Column for Check Detail Lines
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'checkDetail.lines',
			accessorFn: row => row?.checkDetail?.lines,
			id: 'checkDetail.lines',
			header: 'Lines',
			isSearchField: false,
		},
		// Columns for additional details
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'source.keyword',
			accessorFn: row => row?.source,
			id: 'source',
			header: 'Source',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'sourceId.keyword',
			accessorFn: row => row?.sourceId,
			id: 'sourceId',
			header: 'Source ID',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'approvalStatus.keyword',
			accessorFn: row => row?.approvalStatus,
			id: 'approvalStatus',
			header: 'Approval Status',
		},
		// Columns for tags and comments
		{
			...CommonSchema.TAGS,
			// Cell rendering for Tags column
			Cell: ({ row }) => {
				const targetSourceId = row.getValue('_id');
				const targetLabel = 'check';
				return (
					<TagCell
						id={targetSourceId}
						targetSourceId={targetSourceId}
						tags={row?.original?.tags}
						targetLabel={targetLabel}
					/>
				);
			},
		},
		{
			...CommonSchema.COMMENTS,
			// Cell rendering for Comments column
			Cell: ({ renderedCellValue, row }) => {
				const id = row.getValue('_id');
				const targetLabel = 'check';
				return <CommentCell id={id} value={renderedCellValue.length} targetLabel={targetLabel} />;
			},
		},
		// Column for validation status
		{
			size: 220,
			name: 'isAmountValidated',
			accessorFn: row => row?.isAmountValidated,
			id: 'isAmountValidated',
			header: '',
			enableColumnActions: false,
			enableHiding: false,
			enableColumnFilter: false,
			isExport: false,
			enableColumnOrdering: false,
			enableResizing: false,
			filter: false,
			isSearchField: false,
			// Cell rendering for validation status column
			Cell: ({ renderedCellValue, row }) => {
				const classes = useStyles();
				return (
					<>
						{renderedCellValue === 'true' ? (
							<div className="flex justifyCenter alignCenter success w-100">
								<CheckCircle size={20} />
							</div>
						) : (
							<div
								className="flex justifyCenter alignCenter warning w-100"
								onMouseOver={() => (document.getElementById(`alertTootip${row?.index}`).style.display = 'block')}
								onMouseOut={() => (document.getElementById(`alertTootip${row?.index}`).style.display = 'none')}
								style={{ marginRight: 6, position: 'relative', zIndex: 100 }}
							>
								<WarningIcon />

								<div id={`alertTootip${row.index}`} className={classes.tooltip}>
									<p style={{ fontSize: 14, lineHeight: '120%', textAlign: 'left' }}>
										Sum of check details does not match check amount
									</p>
								</div>
							</div>
						)}
					</>
				);
			},
		},
	],
};

export default RevenueStatementsMeta;
