import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import FlyToMap from '../Common/TableCells/coordinates_fly_map';
import ColumnWithLink from 'components/MRTTable/Common/ColumnWithLink';
import { tableController } from 'hookstate/tableController';

const esIndex = 'platformData:wells';

const WellsMeta = {
	esIndex,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	maxTableHeight: 'calc(100vh - 290px)',
	isExportDisabled: true,
	isInFiniteScroll: true,
	isDeleteDisabled: true,
	columnVirtualization: true,
	geoKey: 'geoJSON',
	asyncRowSelection: true,
	getIdsFromRows: rows => rows?.map(row => row?._id) || [],
	additionalQueries: ['comments'],
	TableSchema: [
		{
			...CommonSchema.HIDDEN,
			name: 'id',
			accessorKey: 'id',
		},
		{
			...CommonSchema.HIDDEN,
			name: '_id',
			accessorKey: '_id',
		},
		{
			...CommonSchema.INITAIL_PINNED,
			id: 'api',
			header: 'API',
			name: 'api.keyword',
			accessorFn: row => row?.api,
			getFilterByServerSide: true,
			Cell: ({ renderedCellValue, row }) => {
				const { stateValues } = tableController('WellsTable').useState(['toolbarInternalActions']);
				return (
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
						}}
					>
						<ColumnWithLink
							value={renderedCellValue}
							link={`/map/wells/${row.getValue('_id')}`}
							onClick={stateValues.toolbarInternalActions?.onClose}
						/>
					</div>
				);
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			id: 'wellName',
			header: 'Well Name',
			name: 'wellName.keyword',
			getFilterByServerSide: true,
			accessorFn: row => row?.wellName,
		},
		{
			...CommonSchema.COMMON_COLUMN,

			id: 'state',
			header: 'State',
			name: 'state.keyword',
			accessorFn: row => row?.state,
		},
		{
			...CommonSchema.COMMON_COLUMN,

			id: 'county',
			header: 'County',
			name: 'county.keyword',
			accessorFn: row => row?.county,
		},
		{
			...CommonSchema.COMMON_COLUMN,

			id: 'wellType',
			header: 'Well Type',
			name: 'wellType.keyword',
			accessorFn: row => row?.wellType,
		},
		{
			...CommonSchema.COMMON_COLUMN,

			id: 'wellStatus',
			header: 'Well Status',
			name: 'wellStatus.keyword',
			accessorFn: row => row?.wellStatus,
		},
		{
			...CommonSchema.COMMON_COLUMN,

			id: 'operator',
			header: 'Operator Name',
			name: 'operator.keyword',
			accessorFn: row => row?.operator,
			getFilterByServerSide: true,
		},
		{
			...CommonSchema.COMMON_COLUMN,

			id: 'wellBoreProfile',
			header: 'Well Profile',
			name: 'wellBoreProfile.keyword',
			accessorFn: row => row?.wellBoreProfile,
		},
		{
			...CommonSchema.COMMENTS,
			Cell: ({ row }) => {
				const id = row.getValue('_id');
				const { stateValues } = tableController('WellsTable').useState(['commentsCounter']);
				const comment = stateValues?.commentsCounter?.find(comment => comment._id === id);
				return <CommentCell id={id} value={comment?.total} targetLabel={'well'} />;
			},
		},
		{
			...CommonSchema.ACTION_COLUMN,
			name: 'coordinates',
			accessorKey: 'coordinates',
			header: '',
			size: 70,
			Cell: ({ row }) => {
				const id = row.getValue('_id');

				return <FlyToMap id={id} type="wells" disabled={!id} />;
			},
		},
	],
};

export default WellsMeta;
