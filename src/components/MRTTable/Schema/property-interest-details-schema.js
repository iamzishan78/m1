import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import PropertyInterestDetailTableTolBar from 'components/MRTTable/TablesOverride/PropertyInterestDetailTable/PropertyInterestDetailTableTolBar';
import { formatDate } from 'components/Shared/functions';

import { detailCardController } from 'hookstate/detailCardController';
import { tableGlobalController } from 'hookstate/tableController';

const esIndex = 'propertyinterest_flat';

const onClickedRow = selectedRow => {
	const { summaryData: propertyData } = detailCardController.getValue('summaryData');

	tableGlobalController.updateState({
		propertyInterestDetaillDialog: {
			type: 'addInterestDetail',
			propertyDetails: propertyData,
			selectedInterest: selectedRow,
		},
	});
};

const PropertyInterestDetailMeta = {
	esIndex,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	maxTableHeight: 'calc(60vh - 200px)',
	isInFiniteScroll: true,
	columnVirtualization: true,
	CustomToolBar: PropertyInterestDetailTableTolBar,
	onClickedRow,
	TableSchema: [
		{
			...CommonSchema.HIDDEN,
			name: '_id',
			accessorKey: '_id',
		},

		{
			...CommonSchema.INITAIL_PINNED,
			name: 'owner.entityDetail.name.keyword',
			accessorKey: 'owner.entityDetail.name',
			header: 'Owner Name',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'interestType.keyword',
			accessorKey: 'interestType',
			header: 'Interest Type',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'productType.keyword',
			accessorKey: 'productType',
			header: 'Product Type',
		},

		{
			...CommonSchema.INTEREST_COLUMN,
			name: 'interestAmount',
			accessorKey: 'interestAmount',
			header: 'Interest Amount',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'effectiveDate.keyword',
			accessorKey: 'effectiveDate',
			header: 'Effective Date',
			type: 'date',
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.effectiveDate)}</>;
			},
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'endDate.keyword',
			accessorKey: 'endDate',
			header: 'End Date',
			type: 'date',
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.endDate)}</>;
			},
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'status.keyword',
			accessorKey: 'status',
			header: 'Status',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'costFree.keyword',
			accessorKey: 'costFree',
			header: 'Cost Free?',
		},

		{
			...CommonSchema.TAGS,
			Cell: ({ row }) => {
				const targetSourceId = row.getValue('_id');
				return (
					<TagCell
						id={targetSourceId}
						targetSourceId={targetSourceId}
						tags={row?.original?.tags}
						targetLabel={'propertyInterest'}
					/>
				);
			},
		},

		{
			...CommonSchema.COMMENTS,
			Cell: ({ renderedCellValue, row }) => {
				const id = row.getValue('_id');
				return <CommentCell id={id} value={renderedCellValue.length} targetLabel={'propertyInterest'} />;
			},
		},
	],
};

export default PropertyInterestDetailMeta;
