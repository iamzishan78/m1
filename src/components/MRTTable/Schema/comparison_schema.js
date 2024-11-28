import { ErrorOutline } from '@material-ui/icons';
import { formatDate } from 'components/Shared/functions';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import ColumnWithLink from 'components/Common/MRTable/ColumnWithLink';

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
			...CommonSchema.MONGO_ID,
			name: '_id',
			accessorKey: '_id',
		},

		{
			...CommonSchema.INITAIL_PINNED,
			name: 'check.checkNumber.keyword',
			accessorFn: row => row?.check?.checkNumber,
			id: 'check.checkNumber',
			isExternalFilter: true,
			header: 'Check Number',
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
			...CommonSchema.COMMON_COLUMN,
			name: 'property.number.keyword',
			accessorFn: row => row?.property?.number,
			id: 'property.number',
			header: 'Operator Prop # / Property Number',
			size: 400,
			isExternalFilter: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.internalID.keyword',
			accessorFn: row => row?.property?.internalID,
			id: 'property.internalID',
			header: 'Company ID',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.prospectID.keyword',
			accessorFn: row => row?.property?.prospectID,
			id: 'property.prospectID',
			header: 'Prospect ID',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.acquisitionID.keyword',
			accessorFn: row => row?.property?.acquisitionID,
			id: 'property.acquisitionID',
			header: 'Acquisition ID',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.operator.keyword',
			accessorFn: row => row?.property?.operator,
			id: 'property.operator',
			header: 'Operator',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.purchaser.name.keyword',
			accessorFn: row => row?.property?.purchaser?.name,
			id: 'property.purchaser.name',
			header: 'Payor Name',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.interest.interestType.keyword',
			accessorFn: row => row?.property?.interest?.interestType,
			id: 'property.interest.interestType',
			header: 'Interest Type',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.interest.interestAmount',
			accessorFn: row => row?.property?.interest?.interestAmount,
			id: 'property.interest.interestAmount',
			header: 'Interest Amount',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.interest.effectiveDate',
			accessorFn: row => row?.interest?.effectiveDate,
			id: 'property.interest.effectiveDate',
			header: 'Effective Date',
			type: 'date',
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.property?.interest?.effectiveDate)}</>
			},
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.interest.endDate',
			accessorFn: row => row?.property?.interest?.endDate,
			id: 'property.interest.endDate',
			header: 'End Date',
			type: 'date',
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.property?.interest?.endDate)}</>
			},
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.interest.status.keyword',
			accessorFn: row => row?.property?.interest?.status,
			id: 'property.interest.status',
			header: 'status',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.interest.costFree.keyword',
			accessorFn: row => row?.property?.interest?.costFree,
			id: 'property.interest.costFree',
			header: 'Cost Free',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'wells.apiNumber.keyword',
			accessorFn: row => row?.wells?.apiNumber,
			id: 'wells.apiNumber',
			header: 'Well API',
			Cell: ({ row }) => {
				const apiNumbers = row?.original?.wells?.map(item => item.apiNumber) || [];
				return (apiNumbers?.length && apiNumbers?.length > 1) ? "Multiple" : apiNumbers[0];
			},
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'wells.wellName.keyword',
			accessorFn: row => row?.wells?.wellName,
			id: 'wells.wellName',
			header: 'Well Name',
			Cell: ({ row }) => {
				const wellName = row?.original?.wells?.map(item => item.wellName) || [];
				return (wellName?.length && wellName?.length > 1) ? "Multiple" : wellName[0];
			},
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'check.checkDate',
			accessorFn: row => row?.check?.checkDate,
			id: 'check.checkDate',
			header: 'Check Date',
			type: 'date',
			isExternalFilter: true,
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.check?.checkDate)}</>
			},
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.ownerNumber.keyword',
			accessorFn: row => row?.property?.ownerNumber,
			id: 'property.ownerNumber',
			header: 'Owner Number',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property._owner.name.keyword',
			accessorFn: row => row?.property?._owner?.name,
			id: 'property._owner.name',
			header: 'Owner',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'check.depositDate',
			accessorFn: row => row?.check?.depositDate,
			id: 'check.depositDate',
			header: 'Deposit Date',
			type: 'date',
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.check?.depositDate)}</>
			},
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'check.checkAmount',
			accessorFn: row => row?.check?.checkAmount,
			id: 'check.checkAmount',
			header: 'Check Amount',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'check.source.keyword',
			accessorFn: row => row?.check?.source,
			id: 'check.source',
			header: 'Source',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'check.sourceId.keyword',
			accessorFn: row => row?.check?.sourceId,
			id: 'check.sourceId',
			header: 'Source Id',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.name.keyword',
			accessorFn: row => row?.property?.name,
			id: 'property.name',
			header: 'Property Name',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.state.keyword',
			accessorFn: row => row?.property?.state,
			id: 'property.state',
			header: 'State',
			isExternalFilter: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.county.keyword',
			accessorFn: row => row?.property?.county,
			id: 'property.county',
			header: 'County',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'date',
			accessorKey: 'date',
			header: 'Sales Date',
			type: 'date',
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.date)}</>
			},
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'product.keyword',
			accessorKey: 'product',
			header: 'Product',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'disbursement',
			accessorKey: 'disbursement',
			header: 'Decimal Interest',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'check._id.keyword',
			accessorKey: 'check._id',
			header: 'Check Id',
			size: 300,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'differnce',
			accessorKey: 'differnce',
			header: 'Difference',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'percentageDifference',
			accessorKey: 'percentageDifference',
			header: '% Difference',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'potentialGainLoss',
			accessorKey: 'potentialGainLoss',
			header: 'Potential Gain/Loss',
			type: 'number',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.purchaserNumber.keyword',
			accessorFn: row => row?.property?.purchaserNumber,
			id: 'property.purchaserNumber',
			header: 'Payor Prop #',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'property.status.keyword',
			accessorFn: row => row?.property?.status,
			id: 'property.status',
			header: 'Pay Status',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'price',
			accessorKey: 'price',
			header: 'Avg Price',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'grossPropertyVolume',
			accessorKey: 'grossPropertyVolume',
			header: 'Prop Gross Volume',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'grossPropertyValue',
			accessorKey: 'grossPropertyValue',
			header: 'Prop Gross Revenue',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'grossOwnerVolume',
			accessorKey: 'grossOwnerVolume',
			header: 'Gross Owner Volume',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'grossOwnerValue',
			accessorKey: 'grossOwnerValue',
			header: 'Owner Gross Revenue',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'ownerTax',
			accessorKey: 'ownerTax',
			header: 'Owner Tax Amt',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'taxType.keyword',
			accessorKey: 'taxType',
			header: 'Tax Type',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'ownerDeducts',
			accessorKey: 'ownerDeducts',
			header: 'Deduct Amt',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'deductType.keyword',
			accessorKey: 'deductType',
			header: 'Deduct Cd',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'netOwnerValue',
			accessorKey: 'netOwnerValue',
			header: 'Owner Net Rev',
		},

		{
			...CommonSchema.HIDDEN,
			name: 'propertyId',
			accessorKey: 'propertyId',
		},
	],
};

export default ComparisonMeta;
