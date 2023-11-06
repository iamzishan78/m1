import ColumnWithLink from 'components/Common/MRTable/ColumnWithLink';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import { formatDate } from 'components/Shared/functions';

const esIndex = 'campaigns_flat';

const CampaignMeta = {
  esIndex,
  pageSize: 50,
  pagination: {
    pageIndex: 0,
    pageSize: 50,
  },
  defaultSort: { field: 'flatSyncAt', order: 'desc' },
  maxTableHeight: 'calc(100vh - 480px)',
  TableSchema: [
    {
      ...CommonSchema.HIDDEN,
      name: '_id',
      accessorKey: '_id',
    },
    {
      ...CommonSchema.INITAIL_PINNED,
      name: 'name.keyword',
      accessorKey: 'name',
      header: 'Campaign Name',
      Cell: ({ renderedCellValue, row }) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ColumnWithLink
            value={renderedCellValue || 'N/A'}
            muted={!renderedCellValue}
            link={`/contacts/campaign/details/${row.getValue('_id')}`}
          />
        </div>
      ),
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'status.keyword',
      accessorKey: 'status',
      header: 'Campaign Stage',
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'unitCount',
      accessorKey: 'unitCount',
      header: 'Units',
      isSearchField: false,
      type: 'number',
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'totalNra',
      accessorKey: 'totalNra',
      header: 'Total Unit NRA',
      isSearchField: false,
      type: 'number',
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'owner.name.keyword',
      accessorFn: row => row?.owner?.name,
      id: 'owner.name',
      header: 'Supervisor',
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'createdAt',
      accessorKey: 'createdAt',
      header: 'Created Date',
      type: 'date',
      Cell: ({ renderedCellValue }) => <>{formatDate(renderedCellValue, false)}</>,
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
            targetLabel={'Campaign'}
          />
        );
      },
    },
    {
      ...CommonSchema.COMMENTS,
      Cell: ({ renderedCellValue, row }) => {
        const id = row.getValue('_id');
        return (
          <CommentCell
            id={id}
            value={renderedCellValue.length}
            targetLabel={'Campaign'}
          />
        );
      },
    },
  ],
};

export default CampaignMeta;
