import ColumnWithLink from "components/Shared/M1nTable/components/SubComponents/ColumnWithLink";
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import WellsToolbar from "components/MRTTable/TablesOverride/MyWellsTable/WellsToolbar";
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import { formatDate } from "components/Shared/functions";
import { tableGlobalController } from "hookstate/tableController";
import { globalStateController } from "hookstate/globalStateController";

const esIndex = 'mywells_flat';

const mergeProperties = (parent, property) => {
  if (!Array.isArray(parent)) {
    return <p>{parent?.[property] || ''}</p>;
  }

  let mergedRecord = '';
  parent.forEach(prop => {
    mergedRecord += prop?.[property] ? ' ' + prop?.[property] : '';
  });
  return <p>{mergedRecord}</p>;
}

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
      name: 'wellData.wellName.keyword',
      accessorKey: 'wellData.wellName',
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
              globalStateController.updateState({
                testCase: {
                  name: 'MyWellsNameUpdate',
                  globalWellId: row?.original?.wellData?.Id,
                  mongoWellId: row?.original?._id,
                },
              });
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
      Cell: ({ row }) => mergeProperties(row?.original?.properties, "internalID"),
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'properties.name.keyword',
      accessorFn: row => row?.properties?.name,
      id: 'properties.name',
      header: 'Property Name',
      Cell: ({ row }) => mergeProperties(row?.original?.properties, "name"),
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
      Cell: ({ renderedCellValue, row }) => {
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
      Cell: ({ renderedCellValue, row }) => {
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
      Cell: ({ renderedCellValue, row }) => {
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
      Cell: ({ renderedCellValue, row }) => {
        return <>{formatDate(row?.original?.wellData?.FirstProdDate)}</>
      },
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'wellData.measuredDepth',
      accessorFn: row => row?.wellData?.measuredDepth,
      id: 'wellData.measuredDepth',
      header: 'Measured Depth',
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'wellData.TrueVerticalDepth.keyword',
      accessorFn: row => row?.wellData?.TrueVerticalDepth,
      id: 'wellData.TrueVerticalDepth',
      header: 'TVD',
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'wellData.lateralLength.keyword',
      accessorFn: row => row?.wellData?.lateralLength,
      id: 'wellData.lateralLength',
      header: 'Lateral Length',
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
      Cell: ({ row }) => mergeProperties(row?.original?.properties, "status")
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'properties.divOrderStatus.keyword',
      accessorFn: row => row?.properties?.divOrderStatus,
      id: 'properties.divOrderStatus',
      header: 'DO Status',
      Cell: ({ row }) => mergeProperties(row?.original?.properties, "divOrderStatus")
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'properties.interestType.keyword',
      accessorFn: row => row?.properties?.interestType,
      id: 'properties.interestType',
      header: 'Interest Type',
      Cell: ({ row }) => mergeProperties(row?.original?.properties, "interestType")
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'properties.interestAmount.keyword',
      accessorFn: row => row?.properties?.interestAmount,
      id: 'properties.interestAmount',
      header: 'Interest Amount',
      Cell: ({ row }) => mergeProperties(row?.original?.properties, "interestAmount")
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'properties.effectiveDate',
      accessorFn: row => row?.properties?.effectiveDate,
      id: 'properties.effectiveDate',
      header: 'Effective Date',
      type: 'date',
      Cell: ({ renderedCellValue, row }) => {
        let mergeDate = '';
        row?.original?.properties?.forEach(prop => {
          mergeDate += prop?.effectiveDate ? ' ' + formatDate(prop?.effectiveDate) : '';
        });
        return <>{mergeDate}</>;
      },
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'properties.costFree.keyword',
      accessorFn: row => row?.properties?.costFree,
      id: 'properties.costFree',
      header: 'Cost Free',
      Cell: ({ row }) => mergeProperties(row?.original?.properties, "costFree")
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'properties.internalCompany.keyword',
      accessorFn: row => row?.properties?.internalCompany,
      id: 'properties.internalCompany',
      header: 'Internal Company',
      Cell: ({ row }) => mergeProperties(row?.original?.properties, "internalCompany")
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'properties.acquisitionID.keyword',
      accessorFn: row => row?.properties?.acquisitionID,
      id: 'properties.acquisitionID',
      header: 'Acquisition',
      Cell: ({ row }) => mergeProperties(row?.original?.properties, "acquisitionID")
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'properties.prospectID.keyword',
      accessorFn: row => row?.properties?.prospectID,
      id: 'properties.prospectID',
      header: 'Prospect',
      Cell: ({ row }) => mergeProperties(row?.original?.properties, "prospectID")
    },
    {
      ...CommonSchema.COMMENTS,
      Cell: ({ renderedCellValue, row }) => {
        const id = row.getValue('_id');
        const targetLabel = 'well';
        return <CommentCell id={id} value={renderedCellValue?.length} targetLabel={targetLabel} />;
      },
    }
  ],
};

export default MyWellsMeta;