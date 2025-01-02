import ColumnWithLink from 'components/MRTTable/Common/ColumnWithLink';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import FlyToMap from 'components/MRTTable/Common/TableCells/coordinates_fly_map';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';

const esIndex = 'shapewellinterests_flat';
const onClickedRow = selectedRow => {
	window.setDrawer('relatedWell');
	window.setStateApp(stateApp => ({ ...stateApp, selectedWell: selectedRow }));
};

const RelatedWellsMeta = {
	esIndex,
	pageSize: 25,
	pagination: {
		pageIndex: 0,
		pageSize: 25,
	},
	defaultSort: { field: '_ts', order: 'desc' },
	isInFiniteScroll: true,
	columnVirtualization: true,
	onClickedRow,
	TableSchema: [
		{
			...CommonSchema.HIDDEN,
			name: '_id',
			accessorKey: '_id',
		},
		{
			...CommonSchema.INITAIL_PINNED,
			header: 'Well',
			name: 'well.wellName',
			accessorKey: 'well.wellName',
			filter: false,
			enableColumnFilter: false,
			enableSorting: false,
			Cell: ({ row }) => {
				return (
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
						}}
					>
						<ColumnWithLink
							value={
								row?.original?.well?.apiNumber
									? `${row?.original?.well?.apiNumber} - ${row?.original?.well?.wellName}`
									: row?.original?.well?.wellName || ''
							}
							link={`/map/wells/${row?.original?.well?.globalWell}`}
							onClick={e => {
								e.stopPropagation();
							}}
						/>
					</div>
				);
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Lease Number',
			name: 'leaseId.keyword',
			accessorKey: 'leaseId',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Lease Name',
			name: 'lease.keyword',
			accessorKey: 'lease',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Operator',
			name: 'operator.keyword',
			accessorKey: 'operator',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Well Type',
			name: 'wellType.keyword',
			accessorKey: 'wellType',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			header: 'WellBore Profile',
			name: 'wellBoreProfile.keyword',
			accessorKey: 'wellBoreProfile',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Well Status',
			name: 'wellStatus.keyword',
			accessorKey: 'wellStatus',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Last 12 (BOE)',
			name: 'lastTwelveMonthBOE.keyword',
			accessorKey: 'lastTwelveMonthBOE',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'MD (ft)',
			name: 'measuredDepth.keyword',
			accessorKey: 'measuredDepth',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Lateral Length (ft)',
			name: 'lateralLength.keyword',
			accessorKey: 'lateralLength',
		},
		{
			...CommonSchema.TAGS,
			Cell: ({ row }) => {
				const id = row.getValue('_id');
				return <TagCell id={id} targetSourceId={id} tags={row?.original?.tags} targetLabel={'well'} />;
			},
		},

		{
			...CommonSchema.COMMENTS,
			Cell: ({ renderedCellValue, row }) => {
				const id = row.getValue('_id');
				return <CommentCell id={id} value={renderedCellValue?.length} targetLabel={'well'} />;
			},
		},
		{
			...CommonSchema.ACTION_COLUMN,
			name: 'coordinates',
			accessorKey: 'coordinates',
			header: '',
			size: 70,
			Cell: ({ row }) => {
				return (
					<FlyToMap
						id={row?.original?.well?.globalWell}
						type="shape"
						shape="wells"
						disabled={!row?.original?.well?.globalWell}
					/>
				);
			},
		},
	],
};

export default RelatedWellsMeta;
