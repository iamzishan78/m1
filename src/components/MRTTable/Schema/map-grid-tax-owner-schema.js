import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import IsContactCell from '../TablesOverride/TaxOwnerTable/TableCells/IsContactCell';
import WellFlyToMap from '../TablesOverride/TaxOwnerTable/TableCells/wells_coordinates_fly_map';



const esIndex = 'platformData:globalowner';

const TaxOwnerMeta = {
    esIndex,
    pageSize: 50,
    pagination: {
        pageIndex: 0,
        pageSize: 50,
    },
    maxTableHeight: 'calc(100vh - 290px)',
    isInFiniteScroll: true,
    isDeleteDisabled: true,
    columnVirtualization: true,
    additionalQueries: ['isContact'],
    TableSchema: [
        {
            ...CommonSchema.HIDDEN,
            name: 'id',
            accessorKey: 'id',
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: "ownerName.keyword",
            accessorKey: 'ownerName',
            header: "Name",
            getFilterByServerSide: true,
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: "ownerType.keyword",
            accessorKey: 'ownerType',
            header: "Owner Type",
            getFilterByServerSide: true,
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: "streetAddress.keyword",
            accessorKey: 'streetAddress',
            header: "Street Address",
            getFilterByServerSide: true,
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: "city.keyword",
            accessorKey: 'city',
            header: "City",
            getFilterByServerSide: true,
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: "state.keyword",
            accessorKey: 'state',
            header: "State",
            getFilterByServerSide: true,
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: "zip.keyword",
            accessorKey: 'zip',
            header: "Zip Code",
            getFilterByServerSide: true,
        },
        {
            ...CommonSchema.ACTION_COLUMN,
            name: 'iscontact',
            accessorKey: 'iscontact',
            Cell: ({ _, row }) => {

                return <IsContactCell id={row?.original?.id} selectedRow={row?.original} />
            }
        },
        {
            ...CommonSchema.COMMENTS,
            Cell: ({ renderedCellValue, row }) => {
                const id = row.getValue('id');
                const targetLabel = 'Tax Owner';
                return <CommentCell id={id} value={renderedCellValue?.length} targetLabel={targetLabel} />;
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
