import { ErrorOutline } from '@material-ui/icons';
import ColumnWithLink from 'components/Shared/M1nTable/components/SubComponents/ColumnWithLink';
import { formatDate } from 'components/Shared/functions';

const esIndex = 'checkdetailsinterestscomparison_flat';

const ComparisonMeta = {
	esIndex,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	defaultSort: { field: 'flatSyncAt', order: 'desc' },
	maxTableHeight: 'calc(100vh - 540px)',
	isInFiniteScroll: true,
	columnVirtualization: true,
	TableSchema: [
		{
			name: '_id',
			accessorKey: '_id',
			isSearchField: false,
			hidden: true,
			enablePinning: false,
			enableHiding: false,
			enableColumnActions: false,
			enableColumnOrdering: false,
		},

		{
			name: 'check.checkNumber.keyword',
			accessorFn: row => row?.check?.checkNumber,
			id: 'check.checkNumber',
			header: 'Check Number',
			size: 400,
			isPinned: true,
			enableHiding: false,
			filter: true,
			type: 'string',
			isExternalFilter: true,
			enableColumnActions: true,
			enableColumnOrdering: false,
			Cell: ({ row, cell }) => {
				const interestAmount = row.getValue('property.interest.interestAmount');
				const decimalInterest = row.getValue('disbursement');
				const showMismatchedFlag = interestAmount !== decimalInterest;
				return (
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
						}}
					>
						<ColumnWithLink
							value={
								typeof cell.getValue() === 'string' && cell.getValue()?.split('_')?.[0]
									? row.getValue('property.number')
										? `${cell.getValue()} - ${row.getValue('property.number')}`
										: cell.getValue()
									: row.getValue('property.number')
							}
							link={`/revenue/statement/details/${row.getValue('check._id')}`}
							onClick={e => {
								e.stopPropagation();
							}}
						/>
						{showMismatchedFlag && (
							<div style={{ marginLeft: '15px', cursor: 'pointer' }}>
								<ErrorOutline
									style={{
										width: '17px',
										height: '17px',
										color: 'red',
									}}
								/>
							</div>
						)}
					</div>
				);
			},
		},

		{
			name: 'property.number.keyword',
			accessorFn: row => row?.property?.number,
			id: 'property.number',
			header: 'Operator Prop # / Property Number',
			size: 350,
			isPinned: false,
			filter: true,
			type: 'string',
			isExternalFilter: true,
		},

		{
			name: 'property.internalID.keyword',
			accessorFn: row => row?.property?.internalID,
			id: 'property.internalID',
			header: 'Company ID',
			size: 250,
			isPinned: false,
			filter: true,
			type: 'string',
		},

		{
			name: 'property.prospectID.keyword',
			accessorFn: row => row?.property?.prospectID,
			id: 'property.prospectID',
			header: 'Prospect ID',
			size: 250,
			isPinned: false,
			filter: true,
			type: 'string',
		},

		{
			name: 'property.acquisitionID.keyword',
			accessorFn: row => row?.property?.acquisitionID,
			id: 'property.acquisitionID',
			header: 'Acquisition ID',
			size: 250,
			isPinned: false,
			filter: true,
			type: 'string',
		},

		{
			name: 'property.operator.keyword',
			accessorFn: row => row?.property?.operator?.name,
			id: 'property.operator.name',
			header: 'Operator',
			size: 250,
			isPinned: false,
			filter: true,
			type: 'string',
		},

		{
			name: 'property.purchaser.name.keyword',
			accessorFn: row => row?.property?.purchaser?.name,
			id: 'property.purchaser.name',
			header: 'Purchaser Name',
			size: 250,
			isPinned: false,
			filter: true,
			type: 'string',
		},

		{
			name: 'property.interest.interestType.keyword',
			accessorFn: row => row?.property?.interest?.interestType,
			id: 'property.interest.interestType',
			header: 'Interest Type',
			size: 250,
			isPinned: false,
			filter: true,
			type: 'string',
		},

		{
			name: 'property.interest.interestAmount',
			accessorFn: row => row?.property?.interest?.interestAmount,
			id: 'property.interest.interestAmount',
			header: 'Interest Amount',
			size: 250,
			isPinned: false,
			filter: true,
			type: 'string',
		},

		{
			name: 'property.interest.effectiveDate',
			accessorFn: row => row?.interest?.effectiveDate,
			id: 'property.interest.effectiveDate',
			header: 'Effective Date',
			size: 250,
			isPinned: false,
			filter: true,
			type: 'string',
			Cell: ({ renderedCellValue }) => <>{formatDate(renderedCellValue, false)}</>,
		},

		{
			name: 'property.interest.endDate',
			accessorFn: row => row?.property?.interest?.endDate,
			id: 'property.interest.endDate',
			header: 'End Date',
			size: 250,
			isPinned: false,
			filter: true,
			type: 'date',
			Cell: ({ renderedCellValue }) => <>{formatDate(renderedCellValue, false)}</>,
		},

		{
			name: 'property.interest.status.keyword',
			accessorFn: row => row?.property?.interest?.status,
			id: 'property.interest.status',
			header: 'status',
			size: 250,
			isPinned: false,
			filter: true,
			type: 'string',
		},

		{
			name: 'property.interest.costFree.keyword',
			accessorFn: row => row?.property?.interest?.costFree,
			id: 'property.interest.costFree',
			header: 'Cost Free',
			size: 250,
			isPinned: false,
			filter: true,
			type: 'string',
		},

		{
			name: 'wells.apiNumber.keyword',
			accessorFn: row => row?.wells?.apiNumber,
			id: 'wells.apiNumber',
			header: 'Well API',
			size: 250,
			isPinned: false,
			filter: true,
			type: 'string',
		},

		{
			name: 'wells.wellName.keyword',
			accessorFn: row => row?.wells?.wellName,
			id: 'wells.wellName',
			header: 'Well Name',
			size: 250,
			isPinned: false,
			filter: true,
			type: 'string',
		},

		{
			name: 'check.checkDate',
			accessorFn: row => row?.check?.checkDate,
			id: 'check.checkDate',
			header: 'Check Date',
			size: 250,
			isPinned: false,
			filter: true,
			type: 'date',
			Cell: ({ renderedCellValue }) => <>{formatDate(renderedCellValue, false)}</>,
		},

		{
			name: 'property.ownerNumber.keyword',
			accessorFn: row => row?.property?.ownerNumber,
			id: 'property.ownerNumber',
			header: 'Owner Number',
			size: 250,
			isPinned: false,
			filter: true,
			type: 'string',
		},

		{
			name: 'property._owner.name.keyword',
			accessorFn: row => row?.property?._owner?.name,
			id: 'property._owner.name',
			header: 'Owner',
			size: 250,
			isPinned: false,
			filter: true,
			type: 'string',
		},

		{
			name: 'check.depositDate',
			accessorFn: row => row?.check?.depositDate,
			id: 'check.depositDate',
			header: 'Deposit Date',
			size: 250,
			isPinned: false,
			filter: true,
			type: 'string',
			Cell: ({ renderedCellValue }) => <>{formatDate(renderedCellValue, false)}</>,
		},

		{
			name: 'check.checkAmount',
			accessorFn: row => row?.check?.checkAmount,
			id: 'check.checkAmount',
			header: 'Check Amount',
			size: 250,
			isPinned: false,
			filter: true,
			type: 'string',
		},

		{
			name: 'check.source.keyword',
			accessorFn: row => row?.check?.source,
			id: 'check.source',
			header: 'Source',
			size: 250,
			isPinned: false,
			filter: true,
			type: 'string',
		},

		{
			name: 'check.sourceId.keyword',
			accessorFn: row => row?.check?.sourceId,
			id: 'check.sourceId',
			header: 'Source Id',
			size: 250,
			isPinned: false,
			filter: true,
			type: 'string',
		},

		{
			name: 'property.name.keyword',
			accessorFn: row => row?.property?.name,
			id: 'property.name',
			header: 'Property Name',
			size: 250,
			isPinned: false,
			filter: true,
			type: 'string',
		},

		{
			name: 'property.state.keyword',
			accessorFn: row => row?.property?.state,
			id: 'property.state',
			header: 'State',
			size: 250,
			isPinned: false,
			filter: true,
			type: 'string',
			isExternalFilter: true,
		},

		{
			name: 'property.county.keyword',
			accessorFn: row => row?.property?.county,
			id: 'property.county',
			header: 'County',
			size: 250,
			isPinned: false,
			filter: true,
			type: 'string',
		},

		{
			name: 'date',
			accessorKey: 'date',
			header: 'Sales Date',
			size: 250,
			isPinned: false,
			filter: true,
			type: 'string',
			isExternalFilter: true,
			Cell: ({ renderedCellValue }) => <>{formatDate(renderedCellValue, false)}</>,
		},

		{
			name: 'product.keyword',
			accessorKey: 'product',
			header: 'Product',
			size: 250,
			isPinned: false,
			filter: true,
			type: 'string',
		},

		{
			name: 'disbursement',
			accessorKey: 'disbursement',
			header: 'Decimal Interest',
			size: 250,
			isPinned: false,
			filter: true,
			type: 'string',
		},

		{
			name: 'check._id.keyword',
			accessorKey: 'check._id',
			header: 'Check Id',
			size: 250,
			isPinned: false,
			filter: true,
			type: 'string',
		},

		{
			name: 'differnce',
			accessorKey: 'differnce',
			header: 'Difference',
			size: 250,
			isPinned: false,
			filter: true,
			type: 'string',
		},

		{
			name: 'percentageDifference',
			accessorKey: 'percentageDifference',
			header: '% Difference',
			size: 250,
			isPinned: false,
			filter: true,
			type: 'string',
		},

		{
			name: 'potentialGainLoss',
			accessorKey: 'potentialGainLoss',
			header: 'Potential Gain/Loss',
			size: 250,
			isPinned: false,
			filter: true,
			type: 'string',
		},

		{
			name: 'property.purchaserNumber.keyword',
			accessorFn: row => row?.property?.purchaserNumber,
			id: 'property.purchaserNumber',
			header: 'Purchaser Prop #',
			size: 250,
			isPinned: false,
			filter: true,
			type: 'string',
		},

		{
			name: 'property.status.keyword',
			accessorFn: row => row?.property?.status,
			id: 'property.status',
			header: 'Pay Status',
			size: 250,
			isPinned: false,
			filter: true,
			type: 'string',
		},

		{
			name: 'price',
			accessorKey: 'price',
			header: 'Avg Price',
			size: 250,
			isPinned: false,
			filter: true,
			type: 'string',
		},

		{
			name: 'grossPropertyVolume',
			accessorKey: 'grossPropertyVolume',
			header: 'Prop Gross Volume',
			size: 250,
			isPinned: false,
			filter: true,
			type: 'string',
		},

		{
			name: 'grossPropertyValue',
			accessorKey: 'grossPropertyValue',
			header: 'Prop Gross Revenue',
			size: 250,
			isPinned: false,
			filter: true,
			type: 'string',
		},

		{
			name: 'grossOwnerVolume',
			accessorKey: 'grossOwnerVolume',
			header: 'Gross Owner Volume',
			size: 250,
			isPinned: false,
			filter: true,
			type: 'string',
		},

		{
			name: 'grossOwnerValue',
			accessorKey: 'grossOwnerValue',
			header: 'Owner Gross Revenue',
			size: 250,
			isPinned: false,
			filter: true,
			type: 'string',
		},

		{
			name: 'ownerTax',
			accessorKey: 'ownerTax',
			header: 'Owner Tax Amt',
			size: 250,
			isPinned: false,
			filter: true,
			type: 'string',
		},

		{
			name: 'taxType.keyword',
			accessorKey: 'taxType',
			header: 'Tax Type',
			size: 250,
			isPinned: false,
			filter: true,
			type: 'string',
		},

		{
			name: 'ownerDeducts',
			accessorKey: 'ownerDeducts',
			header: 'Deduct Amt',
			size: 250,
			isPinned: false,
			filter: true,
			type: 'string',
		},

		{
			name: 'deductType.keyword',
			accessorKey: 'deductType',
			header: 'Deduct Cd',
			size: 250,
			isPinned: false,
			filter: true,
			type: 'string',
		},

		{
			name: 'netOwnerValue',
			accessorKey: 'netOwnerValue',
			header: 'Owner Net Rev',
			size: 250,
			isPinned: false,
			filter: true,
			type: 'string',
		},

		{
			name: 'propertyId',
			accessorKey: 'propertyId',
			hidden: true,
			enableHiding: false,
			enableColumnActions: false,
		},
	],
};

export default ComparisonMeta;
