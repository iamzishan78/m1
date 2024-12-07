import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import { addTrailingZeros } from 'components/Shared/functions';
import WellInterestToolBar from 'components/MRTTable/TablesOverride/ContactDetailWellInterestTable/WellInterestToolbar';
import { tableController, tableGlobalController } from 'hookstate/tableController';

const esIndex = 'wellinterests_flat';

const onClickedRow = selectedRow => {
	const Controller = tableController('ContactWellInterestTable');
	const { contactId } = Controller.getValue('customProps');
	tableGlobalController.updateState({
		dialog: {
			type: 'addAndUpdateWell',
			contactId,
			activeWellInterest: selectedRow,
		},
	});
};

const ContactWellInterestMeta = {
	esIndex,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	maxTableHeight: 'calc(100vh - 215px)',
	isInFiniteScroll: true,
	columnVirtualization: true,
	defaultSort: { field: '_ts', order: 'desc' },
	CustomToolBar: WellInterestToolBar,
	onClickedRow,
	TableSchema: [
		{
			...CommonSchema.MONGO_ID,
			name: 'wellId',
			accessorKey: 'wellId',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			header: 'API',
			name: 'well.apiNumber.keyword',
			accessorKey: 'well.apiNumber',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Well Name',
			name: 'well.wellName.keyword',
			accessorKey: 'well.wellName',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			header: 'County',
			name: 'well.county.keyword',
			accessorKey: 'well.county',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Lease',
			name: 'well.leaseDescription.keyword',
			accessorKey: 'well.leaseDescription',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Lease Acres',
			name: 'well.leaseAcres',
			accessorKey: 'well.leaseAcres',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Interest Owner',
			name: 'interestOwner.keyword',
			accessorKey: 'interestOwner',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Type',
			name: 'type.keyword',
			accessorKey: 'type',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Amount',
			name: 'amount.keyword',
			accessorKey: 'amount',
			enableColumnFilter: false,
			Cell: ({ row }) => {
				const amount = row.getValue('amount');
				if (amount) {
					return <>{addTrailingZeros(parseFloat(amount).toFixed(8))}</>;
				}
			},
		},

		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Tax Value',
			name: 'value',
			accessorKey: 'value',
			Cell: ({ row }) => {
				const value = row.getValue('value');
				if (value) {
					return <>{`$${value}`}</>;
				}
			},
		},

		{
			...CommonSchema.COMMON_COLUMN,
			header: 'NRA',
			name: 'nra',
			accessorKey: 'nra',
			Cell: ({ row }) => {
				const nra = row.getValue('nra');
				if (nra) {
					return <>{addTrailingZeros(parseFloat(nra).toFixed(8))}</>;
				}
			},
		},

		{
			...CommonSchema.TAGS,
			enableSorting: false,
			enableColumnFilter: false,
			Cell: ({ row }) => {
				const targetSourceId = row.getValue('wellId');
				return (
					<TagCell
						id={targetSourceId}
						targetSourceId={targetSourceId}
						tags={row?.original?.tags}
						targetLabel={'well'}
					/>
				);
			},
		},
		{
			...CommonSchema.COMMENTS,
			Cell: ({ renderedCellValue, row }) => {
				const id = row.getValue('wellId');
				return <CommentCell id={id} value={renderedCellValue?.length} targetLabel={'well'} />;
			},
		},
	],
};

export default ContactWellInterestMeta;
