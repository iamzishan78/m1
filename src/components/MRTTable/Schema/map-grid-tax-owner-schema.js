import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import IsContactCell from '../TablesOverride/TaxOwnerTable/TableCells/IsContactCell';
import WellFlyToMap, {
	useTaxOwnerWellFlyto,
} from '../TablesOverride/TaxOwnerTable/TableCells/wells_coordinates_fly_map';
import { tableController } from 'hookstate/tableController';
import ColumnWithLink from 'components/MRTTable/Common/ColumnWithLink';

const esIndex = 'platformData:globalowner';

const TaxOwnerMeta = {
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
	columnVirtualization: false, // Turned off virtualization
	getIdsFromRows: rows => rows?.map(row => row?.id) || [],
	additionalQueries: ['isContact', 'comments'],
	TableSchema: [
		{
			...CommonSchema.HIDDEN,
			name: 'id',
			accessorKey: 'id',
		},
		{
			...CommonSchema.INITAIL_PINNED,
			name: 'ownerName.keyword',
			accessorKey: 'ownerName',
			header: 'Name',
			getFilterByServerSide: true,
			Cell: ({ renderedCellValue, row }) => {
				const { handleFlyto } = useTaxOwnerWellFlyto();
				const id = row.getValue('id');
				return row?.original?.wellCount ? (
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
						}}
					>
						<ColumnWithLink value={renderedCellValue} onClick={() => handleFlyto(id)} />
					</div>
				) : (
					<>{renderedCellValue}</>
				);
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'ownerType.keyword',
			accessorKey: 'ownerType',
			header: 'Owner Type',
			getFilterByServerSide: true,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'streetAddress.keyword',
			accessorKey: 'streetAddress',
			header: 'Street Address',
			getFilterByServerSide: true,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'city.keyword',
			accessorKey: 'city',
			header: 'City',
			getFilterByServerSide: true,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'state.keyword',
			accessorKey: 'state',
			header: 'State',
			getFilterByServerSide: true,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'zip.keyword',
			accessorKey: 'zip',
			header: 'Zip Code',
			getFilterByServerSide: true,
		},
		{
			...CommonSchema.ACTION_COLUMN,
			name: 'iscontact',
			accessorKey: 'iscontact',
			Cell: ({ _, row }) => {
				return <IsContactCell id={row?.original?.id} selectedRow={row?.original} />;
			},
		},
		{
			...CommonSchema.COMMENTS,
			Cell: ({ row }) => {
				const id = row.getValue('id');
				const { stateValues } = tableController('TaxOwnerTable').useState(['commentsCounter']);
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
				const id = row.getValue('id');
				return <WellFlyToMap id={id} disabled={!row?.original?.wellCount} />;
			},
		},
	],
};

export default TaxOwnerMeta;
