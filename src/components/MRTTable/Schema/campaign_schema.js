import ColumnWithLink from 'components/Common/MRTable/ColumnWithLink';
import Loaders from 'components/Loaders';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import { formatDate } from 'components/Shared/functions';
import CampaignIcon from 'components/Shared/svgIcons/campaign';
import { UPDATE_CAMPAIGN } from 'graphQL/useMutationCampaign';
import { tableGlobalController } from 'hookstate/tableController';
import { isEmpty, pickBy } from 'lodash';
import { copy } from 'utils/helper';

const esIndex = 'campaigns_flat';

const onCustomKeyChange = async (client, row, value, item) => {
  const loaderId = `upadting-${row?._id}`;

  try {
    Loaders.createToast(loaderId, 'Updation in Progress');
    const customData = copy(row?.custom_data) ?? {};
    const filteredCustomData = pickBy(
      customData,
      value => value !== '' && !isEmpty(value)
    );

    const campaign = {
      _id: row._id,
      custom_data: {
        ...filteredCustomData,
        [item.name]: value,
      },
    };

    await client.mutate({
      variables: {
        campaign,
      },
      mutation: UPDATE_CAMPAIGN,
    });

    Loaders.successToast(loaderId, 'Updation Complete');
    tableGlobalController.refetch();
  } catch (err) {
    Loaders.errorToast(loaderId, 'Failed to Update');
  }
};

const CampaignMeta = {
  esIndex,
  pageSize: 50,
  pagination: {
    pageIndex: 0,
    pageSize: 50,
  },
  defaultSort: { field: 'flatSyncAt', order: 'desc' },
  maxTableHeight: 'calc(100vh - 490px)',
  onCustomKeyChange,
  isInFiniteScroll: true,
  columnVirtualization: true,
  fetchMetaData: {
    category: 'Campaign Name',
  },
  gridViewSettings: {
    label: 'Campaign Name',
    module: 'Campaigns',
    Icon: CampaignIcon,
    defaultView: {
      name: 'All Campaigns',
      type: 'Default',
    },
    handleDefaultView: (view, user) => {
      if (view?.name === 'My Campaigns') {
        view.filters[0].value = user._id;
      }
      return view;
    },
    cssOverride: {
      top: '461px',
      left: '40px',
      marginLeft: '-7px',
      maxHeight: '445px'
    },
  },
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
      isExternalFilter: true,
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
      isExternalFilter: true,
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      showInLast: true,
      name: 'createdAt',
      accessorKey: 'createdAt',
      header: 'Created Date',
      type: 'date',
      isExternalFilter: true,
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
            value={renderedCellValue?.length}
            targetLabel={'Campaign'}
          />
        );
      },
    },
  ],
};

export default CampaignMeta;
