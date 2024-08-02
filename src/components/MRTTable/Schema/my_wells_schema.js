import ColumnWithLink from "components/Shared/M1nTable/components/SubComponents/ColumnWithLink";
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import WellsToolbar from "components/MRTTable/TablesOverride/MyWellsTable/WellsToolbar";
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import { formatDate } from "components/Shared/functions";
import { tableController, tableGlobalController } from "hookstate/tableController";
import { globalStateController } from "hookstate/globalStateController";

const esIndex = 'mywells_flat';

const MyWellsMeta = {
  esIndex,
  pageSize: 50,
  pagination: {
    pageIndex: 0,
    pageSize: 50,
  },
  CustomToolBar: WellsToolbar,
  maxTableHeight: 'calc(100vh - 290px)',
  defaultSort: { field: "lastUpdateAt", order: "desc" },
  deletedKeys: {
    mainRecord: { key: 'wellData.Id' },
  },
  isInFiniteScroll: true,
  columnVirtualization: true,
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
      name: 'wellData.WellName',
      accessorKey: 'wellData.WellName',
      header: 'Well Name',
      Cell: ({ row }) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ColumnWithLink
            value={row?.original?.wellData?.wellName}
            link={`/land/well/details/${row?.original?.wellData?.Id}?mongoWellId=${row?.original?._id}`}
            onClickForTestCase={() => {
              globalStateController.handleMyWellTestCase(row?.original?.wellData?.Id, row?.original?._id)
              tableGlobalController.updateState({
                addWellDialog: {
                  type: 'addWell',
                  showDialog: true,
                },
              });
            }}
          />
        </div>
      ),
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'wellData.api.keyword',
      accessorKey: "wellData.api",
      id: 'wellData.api',
      header: 'API',
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'properties.internalID.keyword',
      accessorKey: 'properties.internalID',
      accessorFn: row => row?.properties?.internalID,
      id: 'properties.internalID',
      header: 'Internal ID',
      Cell: ({ row }) => {
        return <>{row?.original?.properties?.[0]?.internalID}</>
      },
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'properties.name.keyword',
      accessorFn: row => row?.properties?.name,
      id: 'properties.name',
      header: 'Property Name',
      Cell: ({ row }) => {
        return <>{row?.original?.properties?.[0]?.name}</>
      },
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'wellData.operator.keyword',
      accessorFn: row => row?.wellData?.operator,
      id: 'wellData.operator',
      header: 'Operator',
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'wellData.wellType.keyword',
      accessorFn: row => row?.wellData?.wellType,
      id: 'wellData.wellType',
      header: 'Well Type',
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'wellData.wellBoreProfile.keyword',
      accessorFn: row => row?.wellData?.wellBoreProfile,
      id: 'wellData.wellBoreProfile',
      header: 'Well Profile',
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'wellData.wellStatus.keyword',
      accessorFn: row => row?.wellData?.wellStatus,
      id: 'wellData.wellStatus',
      header: 'Well Status',
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'wellData.basin.keyword',
      accessorFn: row => row?.wellData?.basin,
      id: 'wellData.basin',
      header: 'Basin',
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'wellData.field.keyword',
      accessorFn: row => row?.wellData?.field,
      id: 'wellData.field',
      header: 'Field',
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'wellData.state.keyword',
      accessorFn: row => row?.wellData?.state,
      id: 'wellData.state',
      header: 'State',
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'wellData.county.keyword',
      accessorFn: row => row?.wellData?.county,
      id: 'wellData.county',
      header: 'County',
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'wellData.GrId1.keyword',
      accessorFn: row => row?.wellData?.GrId1,
      id: 'wellData.GrId1',
      header: 'Survey',
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'wellData.GrId2.keyword',
      accessorFn: row => row?.wellData?.GrId2,
      id: 'wellData.GrId2',
      header: 'Block/Twsp',
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'wellData.GrId3.keyword',
      accessorFn: row => row?.wellData?.GrId3,
      id: 'wellData.GrId3',
      header: 'Sec/Range',
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'wellData.GrId4.keyword',
      accessorFn: row => row?.wellData?.GrId4,
      id: 'wellData.GrId4',
      header: 'Abstract/Sec',
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'wellData.PermitDate',
      accessorFn: row => row?.wellData?.PermitDate,
      id: 'wellData.PermitDate',
      header: 'Permit Date',
      type: 'date',
      isSearchField: false,
      Cell: ({ row }) => {
        return <>{formatDate(row?.original?.wellData?.PermitDate)}</>
      },
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'wellData.SpudDate',
      accessorFn: row => row?.wellData?.SpudDate,
      id: 'wellData.SpudDate',
      header: 'Spud Date',
      type: 'date',
      isSearchField: false,
      Cell: ({ row }) => {
        return <>{formatDate(row?.original?.wellData?.SpudDate)}</>
      },
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'wellData.CompletionDate',
      accessorFn: row => row?.wellData?.CompletionDate,
      id: 'wellData.CompletionDate',
      header: 'Completion Date',
      type: 'date',
      isSearchField: false,
      Cell: ({ row }) => {
        return <>{formatDate(row?.original?.wellData?.CompletionDate)}</>
      },
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'wellData.FirstProdDate',
      accessorFn: row => row?.wellData?.FirstProdDate,
      id: 'wellData.FirstProdDate',
      header: 'First Prod Date',
      type: 'date',
      isSearchField: false,
      Cell: ({ row }) => {
        return <>{formatDate(row?.original?.wellData?.FirstProdDate)}</>
      },
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'wellData.measuredDepth',
      accessorFn: row => row?.wellData?.measuredDepth,
      id: 'wellData.measuredDepth',
      header: 'Measured Depth',
      isSearchField: false,
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'wellData.TrueVerticalDepth.keyword',
      accessorFn: row => row?.wellData?.TrueVerticalDepth,
      id: 'wellData.TrueVerticalDepth',
      header: 'TVD',
      isSearchField: false,
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'wellData.lateralLength.keyword',
      accessorFn: row => row?.wellData?.lateralLength,
      id: 'wellData.lateralLength',
      header: 'Lateral Length',
      isSearchField: false,
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'wellData.primaryFormation.keyword',
      accessorFn: row => row?.wellData?.primaryFormation,
      id: 'wellData.primaryFormation',
      header: 'Formation',
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'properties.status.keyword',
      accessorFn: row => row?.properties?.status,
      id: 'properties.status',
      header: 'Pay Status',
      Cell: ({ row }) => {
        return <>{row?.original?.properties?.[0]?.status}</>
      },
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'properties.divOrderStatus.keyword',
      accessorFn: row => row?.properties?.divOrderStatus,
      id: 'properties.divOrderStatus',
      header: 'DO Status',
      Cell: ({ row }) => {
        return <>{row?.original?.properties?.[0]?.divOrderStatus}</>
      },
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'propertyDescriptor.interestType.keyword',
      accessorFn: row => row?.propertyDescriptor?.interestType,
      id: 'propertyDescriptor.interestType',
      header: 'Interest Type',
      Cell: ({ row }) => {
        const value = row?.original?.propertyDescriptor
        return <p>{value && value?.length > 0 ? (value.length > 1 ? "MULTIPLE" : value[0]?.interestType) : ""}</p>;
      },
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'propertyDescriptor.interestAmount.keyword',
      accessorFn: row => row?.propertyDescriptor?.interestAmount,
      id: 'propertyDescriptor.interestAmount',
      header: 'Interest Amount',
      isSearchField: false,
      Cell: ({ row }) => {
        const value = row?.original?.propertyDescriptor
        return <p>{value && value?.length > 0 ? (value.length > 1 ? "MULTIPLE" : value[0]?.interestAmount) : ""}</p>;
      },
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'propertyDescriptor.effectiveDate',
      accessorFn: row => row?.propertyDescriptor?.effectiveDate,
      id: 'propertyDescriptor.effectiveDate',
      header: 'Effective Date',
      type: 'date',
      isSearchField: false,
      Cell: ({ row }) => {
        const value = row?.original?.propertyDescriptor
        return <p>{value && value?.length > 0 ? (value.length > 1 ? "MULTIPLE" : formatDate(value[0]?.effectiveDate)) : ""}</p>;
      },
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'propertyDescriptor.costFree.keyword',
      accessorFn: row => row?.propertyDescriptor?.costFree,
      id: 'propertyDescriptor.costFree',
      header: 'Cost Free',
      Cell: ({ row }) => {
        const value = row?.original?.propertyDescriptor
        return <p>{value && value?.length > 0 ? (value.length > 1 ? "MULTIPLE" : value[0]?.costFree) : ""}</p>;
      },
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'properties.internalCompany.keyword',
      accessorFn: row => row?.properties?.internalCompany,
      id: 'properties.internalCompany',
      header: 'Internal Company',
      Cell: ({ row }) => {
        return <>{row?.original?.properties?.[0]?.internalCompany}</>
      },
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'properties.acquisitionID.keyword',
      accessorFn: row => row?.properties?.acquisitionID,
      id: 'properties.acquisitionID',
      header: 'Acquisition',
      Cell: ({ row }) => {
        return <>{row?.original?.properties?.[0]?.acquisitionID}</>
      },
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'properties.prospectID.keyword',
      accessorFn: row => row?.properties?.prospectID,
      id: 'properties.prospectID',
      header: 'Prospect',
      Cell: ({ row }) => {
        return <>{row?.original?.properties?.[0]?.prospectID}</>
      },
    },
    {
      ...CommonSchema.COMMENTS,
      Cell: ({ row }) => {
        const id = row.getValue('_id');
        const { stateValues } = tableController('MyWellsTable').useState([
          'commentsCounter',
        ]);
        const comment = stateValues?.commentsCounter?.find((comment) => comment._id === id)
        return (
          <CommentCell
            id={id}
            value={comment?.total}
            targetLabel={'well'}
          />
        );
      },
    }
  ],
};

export default MyWellsMeta;