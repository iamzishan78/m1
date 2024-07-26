import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import Wells from 'components/Shared/svgIcons/well';
import { formatDateTime, formatDate } from 'components/Shared/functions';
import vf_number from "components/Shared/valueformatters/vf_number";
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import { tableController, tableGlobalController } from 'hookstate/tableController';

 const esIndex = 'mywells_flat';


const WellMasterMeta = {
    esIndex,
    pageSize: 50,
    pagination: {
        pageIndex: 0,
        pageSize: 50,
    },
    search: {
        fields: ["name^4", "_all"]
    },
    maxTableHeight: 'calc(100vh - 215px)',
    isDeleteDisabled: true,
    gridViewSettings: {
        label: 'Well Master',
        Icon: Wells,
        cssOverride: {
            top: '138px',
            left: '40px',
            marginLeft: '-9px',
        },
    },
    isInFiniteScroll: true,
    defaultSort: { field: "lastUpdateAt", order: "desc" },
    TableSchema: [
        {
            ...CommonSchema.MONGO_ID,
            name: '_id',
            accessorKey: '_id',
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'wellData.api.keyword',
            accessorKey: 'wellData.api',
            header: "API Number",
            isHiddenFieldExport: true,
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'wellData.wellName.keyword',
            accessorKey: 'wellData.wellName',
            header: "Well Name",
            isHiddenFieldExport: true,
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'properties.internalID.keyword',
            accessorKey: 'properties.internalID',
            header: "Internal ID",
            isHiddenFieldExport: true,
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'wellData.operator.keyword',
            accessorKey: 'wellData.operator',
            header: "Operator",
            isHiddenFieldExport: true,
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'wellData.wellType.keyword',
            accessorKey: 'wellData.wellType',
            header: "Well Type",
            isHiddenFieldExport: true,
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'wellData.wellBoreProfile.keyword',
            accessorKey: 'wellData.wellBoreProfile',
            header: "Well Profile",
            isHiddenFieldExport: true,
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'wellData.wellStatus.keyword',
            accessorKey: 'wellData.wellStatus',
            header: "Well Status",
            isHiddenFieldExport: true,
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'wellData.basin.keyword',
            accessorKey: 'wellData.basin',
            header: "Basin",
            isHiddenFieldExport: true,
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'wellData.field.keyword',
            accessorKey: 'wellData.field',
            header: "Field",
            isHiddenFieldExport: true,
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'wellData.state.keyword',
            accessorKey: 'wellData.state',
            header: "State",
            isHiddenFieldExport: true,
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'wellData.county.keyword',
            accessorKey: 'wellData.county',
            header: "County",
            isHiddenFieldExport: true,
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'wellData.GrId1.keyword',
            accessorKey: 'wellData.GrId1',
            header: "Survey",
            isHiddenFieldExport: true,
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'wellData.GrId2.keyword',
            accessorKey: 'wellData.GrId2',
            header: "Block/Twsp",
            isHiddenFieldExport: true,
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'wellData.GrId3.keyword',
            accessorKey: 'wellData.GrId3',
            header: "Sec/Range",
            isHiddenFieldExport: true,
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'wellData.GrId4.keyword',
            accessorKey: 'wellData.GrId4',
            header: "Abstract/Sec",
            isHiddenFieldExport: true,
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'SpudDate',
            accessorFn: row => row?.wellData?.SpudDate,
            accessorKey: 'SpudDate',
            header: "Spud Date",
            isHiddenFieldExport: true,
            type: 'date',
            Cell: ({ row }) => {
                return <>{formatDate(row?.original?.wellData?.SpudDate)}</>
            },
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'CompletionDate',
            accessorFn: row => row?.wellData?.CompletionDate,
            accessorKey: 'CompletionDate',
            header: "Completion Date",
            isHiddenFieldExport: true,
            type: 'date',
            Cell: ({ row }) => {
                return <>{formatDate(row?.original?.wellData?.CompletionDate)}</>
            },
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'FirstProdDate',
            accessorFn: row => row?.wellData?.FirstProdDate,
            accessorKey: 'FirstProdDate',
            header: "First Prod Date",
            isHiddenFieldExport: true,
            type: 'date',
            Cell: ({ row }) => {
                return <>{formatDate(row?.original?.wellData?.FirstProdDate)}</>
            },
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'wellData.measuredDepth.keyword',
            accessorKey: 'wellData.measuredDepth',
            header: "Measured Depth",
            isHiddenFieldExport: true,
            Cell: ({ row }) => {
                const value = row?.original?.wellData?.measuredDepth
                return <p>{value ? vf_number(Math.floor(value)) : "--"}</p>
              }
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: 'wellData.TrueVerticalDepth.keyword',
            accessorKey: 'wellData.TrueVerticalDepth',
            header: 'TVD',
            isSearchField: false,
            Cell: ({ row }) => {
                const value = row?.original?.wellData?.TrueVerticalDepth
                return <p>{value ? vf_number(Math.floor(value)) : "--"}</p>
              }
          },
          {
            ...CommonSchema.COMMON_COLUMN,
            name: 'wellData.lateralLength.keyword',
            accessorKey: 'wellData.lateralLength',
            header: 'Lateral Length',
            isSearchField: false,
            Cell: ({ row }) => {
                const value = row?.original?.wellData?.lateralLength
                return <p>{value ? vf_number(Math.floor(value)) : "--"}</p>
              }
          },
          {
            ...CommonSchema.COMMON_COLUMN,
            name: 'wellData.primaryFormation.keyword',
            accessorKey: 'wellData.primaryFormation',
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
    ]
}
export default WellMasterMeta;