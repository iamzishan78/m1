import ColumnWithLink from 'components/Shared/M1nTable/components/SubComponents/ColumnWithLink';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import CampaignNameField from 'components/ContactDetailCard/components/FieldContent/CampaignNameField';

const esIndex = 'shapeowners_flat';

const TractInterestsMeta = {
  esIndex,
  pageSize: 50,
  pagination: {
    pageIndex: 0,
    pageSize: 50,
  },
  defaultSort: { field: '_ts', order: 'desc' },
  defaultFilters: [
    { field: 'shape.layer.keyword', value: 'parcel' },
    { field: 'contact.IsDeleted', value: 'false' },
    { field: 'shape.IsDeleted', value: 'false' },
  ],
  maxTableHeight: 'calc(100vh - 550px)',
  isInFiniteScroll: true,
  columnVirtualization: true,
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
      ...CommonSchema.HIDDEN,
      name: "shape._id.keyword",
      accessorFn: (row) => row?.shape?._id,
      id: "shape._id",
    },
    {
      ...CommonSchema.INITAIL_PINNED,
      name: 'shape.shapeJson.properties.shapeLabel.keyword',
      accessorKey: 'shape.shapeJson.properties.shapeLabel',
      header: 'Tract Name',
      Cell: ({ renderedCellValue, row }) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ColumnWithLink value={renderedCellValue} link={`/map/parcels/${row.getValue('shape._id')}`} />
        </div>
      ),
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'layer.keyword',
      accessorFn: row => row?.layer,
      id: 'layer',
      header: 'Layer',
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'shape.layer.keyword',
      accessorFn: row => row?.shape?.layer,
      id: 'shape.layer',
      header: 'Layer2',
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'shape.shapeJson.properties.originalProperties.State.keyword',
      accessorFn: row => row?.shape?.shapeJson?.properties?.originalProperties?.State,
      id: 'shape.shapeJson.properties.originalProperties.State',
      header: 'State',
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'shape.shapeJson.properties.originalProperties.County.keyword',
      accessorFn: row => row?.shape?.shapeJson?.properties?.originalProperties?.County,
      id: 'shape.shapeJson.properties.originalProperties.County',
      header: 'County',
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'shape.shapeJson.properties.originalProperties.surveyMerdian.keyword',
      accessorFn: row => row?.shape?.shapeJson?.properties?.originalProperties?.surveyMerdian,
      id: 'shape.shapeJson.properties.originalProperties.surveyMerdian',
      header: 'Survey/ Meridian',
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'shape.shapeJson.properties.originalProperties.blockTownship.keyword',
      accessorFn: row => row?.shape?.shapeJson?.properties?.originalProperties?.blockTownship,
      id: 'shape.shapeJson.properties.originalProperties.blockTownship',
      header: 'Block/ Township',
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'shape.shapeJson.properties.originalProperties.rangeSection.keyword',
      accessorFn: row => row?.shape?.shapeJson?.properties?.originalProperties?.rangeSection,
      id: 'shape.shapeJson.properties.originalProperties.rangeSection',
      header: 'Section/ Range',
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'shape.shapeJson.properties.originalProperties.abstractNameShortName.keyword',
      accessorFn: row => row?.shape?.shapeJson?.properties?.originalProperties?.abstractNameShortName,
      id: 'shape.shapeJson.properties.originalProperties.abstractNameShortName',
      header: 'Abstract/ Section',
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'campaignName.keyword',
      accessorKey: 'campaignName',
      header: 'Campaign Name',
      Cell: ({ renderedCellValue }) => <CampaignNameField value={renderedCellValue} fullWidth disabled />,
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'qtr.keyword',
      accessorFn: row => row?.qtr,
      id: 'qtr',
      header: 'QTR Calls',
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'shape.shapeJson.properties.sdGrossAcres.keyword',
      accessorFn: row => row?.shape?.shapeJson?.properties?.sdGrossAcres,
      id: 'shape.shapeJson.properties.sdGrossAcres',
      header: 'Gross Acres',
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'depthFrom.keyword',
      accessorFn: row => row?.depthFrom,
      id: 'depthFrom',
      header: 'Depth From',
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'depthTo.keyword',
      accessorFn: row => row?.depthTo,
      id: 'depthTo',
      header: 'Depth To',
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'contact.entityDetail.name.keyword',
      accessorFn: row => row?.contact?.entityDetail?.name,
      id: 'contact.entityDetail.name',
      header: 'Owner Name',
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'mineral_interest',
      accessorFn: row => row?.mineral_interest,
      id: 'mineral_interest',
      header: 'Mineral Interest',
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'royalty_interest',
      accessorFn: row => row?.royalty_interest,
      id: 'royalty_interest',
      header: 'Royalty Ineterest',
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'orri',
      accessorFn: row => row?.orri,
      id: 'orri',
      header: 'ORRI',
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'net_acres',
      accessorFn: row => row?.net_acres,
      id: 'net_acres',
      header: 'Net Acres',
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'nra',
      accessorFn: row => row?.nra,
      id: 'nra',
      header: 'NRA',
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'shape.shapeJson.properties.department.keyword',
      accessorFn: row => row?.shape?.shapeJson.properties.department,
      id: 'shape.shapeJson.properties.department',
      header: 'Department',
    },
    {
      ...CommonSchema.TAGS,
      Cell: ({ row }) => {
        const targetSourceId = row.getValue('_id');
        const targetLabel = 'Parcel Ownership';
        return <TagCell id={targetSourceId} targetSourceId={targetSourceId} tags={row?.original?.tags} targetLabel={targetLabel} />;
      },
    },
    {
      ...CommonSchema.COMMENTS,
      Cell: ({ renderedCellValue, row }) => {
        const id = row.getValue('_id');
        const targetLabel = 'Parcel Ownership';
        return <CommentCell id={id} value={renderedCellValue?.length} targetLabel={targetLabel} />;
      },
    }
  ],
};

export default TractInterestsMeta;

