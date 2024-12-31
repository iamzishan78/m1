import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import { formatDate } from 'components/Shared/functions';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import RunsheetToolbar from '../TablesOverride/RunsheetTable/RunsheetToolbar';
import { tableGlobalController } from 'hookstate/tableController';
import FileDownload from 'components/MRTTable/TablesOverride/DocumentTable/TableCell/FileDownload';
import FileView from 'components/MRTTable/TablesOverride/DocumentTable/TableCell/FileView';

const esIndex = 'runsheetinstrument_flat';

const RunsheetMeta = {
	esIndex,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	onClickedRow: selectedRow => {
		tableGlobalController.updateState({
			selectedInstrument: {
				...selectedRow,
				show: true,
			},
		});
	},
	maxTableHeight: 'calc(100vh - 200px)',
	isInFiniteScroll: true,
	columnVirtualization: true,
	CustomToolBar: RunsheetToolbar,
	deletedKeys: { mainRecord: { key: 'descriptorObject' } },
	TableSchema: [
		{
			...CommonSchema.HIDDEN,
			name: '_id',
			accessorKey: '_id',
		},
		{
			...CommonSchema.INITAIL_PINNED,
			name: 'instrumentType.keyword',
			accessorKey: 'instrumentType',
			header: 'Instrument Type',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'fromPartySummary.keyword',
			accessorKey: 'fromPartySummary',
			header: 'Party of the First (Grantor)',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'toPartySummary.keyword',
			accessorKey: 'toPartySummary',
			header: 'Party of the Second (Grantee)',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'effectiveDate',
			accessorKey: 'effectiveDate',
			header: 'Effective Date',
			type: 'date',
			isSearchField: false, // don't include in search fields
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.effectiveDate)}</>;
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'executionDate',
			accessorKey: 'executionDate',
			header: 'Instrument Date',
			type: 'date',
			isSearchField: false, // don't include in search fields
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.executionDate)}</>;
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'fileDate',
			accessorKey: 'fileDate',
			header: 'File Date',
			type: 'date',
			isSearchField: false, // donn't include in search fields
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.fileDate)}</>;
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'recordType.keyword',
			accessorKey: 'recordType',
			header: 'Record Type',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'recordationNumber.keyword',
			accessorKey: 'recordationNumber',
			header: 'Rec #',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'volume.keyword',
			accessorKey: 'volume',
			header: 'Volume',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'page.keyword',
			accessorKey: 'page',
			header: 'Page',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'legalDescription.keyword',
			accessorKey: 'legalDescription',
			header: 'Legal Description',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'legalDescription.keyword',
			accessorKey: 'legalDescription',
			header: 'Legal Description',
		},
		{
			...CommonSchema.TAGS,
			Cell: ({ row }) => {
				const targetSourceId = row?.original?.descriptorObject;
				return (
					<TagCell
						id={targetSourceId}
						targetSourceId={targetSourceId}
						tags={row?.original?.tags}
						targetLabel={'parcelRunsheet'}
					/>
				);
			},
		},
		{
			...CommonSchema.COMMENTS,
			Cell: ({ renderedCellValue, row }) => {
				const id = row?.original?.descriptorObject;
				return <CommentCell id={id} value={renderedCellValue.length} targetLabel={'parcelRunsheet'} />;
			},
		},

		{
			...CommonSchema.ACTION_COLUMN,
			name: 'actionMenu',
			accessorKey: 'actionMenu',
			header: ' ',
			size: 80,
			Cell: ({ row }) => {
				return <FileDownload id={row?.original?.fileId} />;
			},
		},

		{
			...CommonSchema.ACTION_COLUMN,
			name: 'actionMenu2',
			accessorKey: 'actionMenu2',
			header: ' ',
			size: 80,
			Cell: ({ row }) => {
				return <FileView docInfo={row?.original} />;
			},
		},
	],
};

export default RunsheetMeta;
