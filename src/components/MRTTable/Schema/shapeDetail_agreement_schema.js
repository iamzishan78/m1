import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import Grid from "@material-ui/core/Grid";
import ColumnWithLink from 'components/Shared/M1nTable/components/SubComponents/ColumnWithLink';
import { formatDate } from 'components/Shared/functions';

// Schema for units/tracts Related agreements

// Elastic search index
const esIndex = 'shapeowners_flat';

// Grid Schema
const AgreementTypes = {
  lease: "Lease",
  deed: "Deed",
  contract: "Contract",
  surface: "Surface/ROW",
};

const AgreementMeta = {
  esIndex,
  pageSize: 50,
  pagination: {
    pageIndex: 0,
    pageSize: 50,
  },
  defaultSort: { field: "_ts", order: "desc" },
  maxTableHeight: 'calc(100vh - 200px)',
  isInFiniteScroll: true,
  columnVirtualization: true,
  TableSchema: [
    {
      ...CommonSchema.HIDDEN,
      name: '_id',
      accessorKey: '_id',
    },

    {
      ...CommonSchema.INITAIL_PINNED,
      name: 'customLayer.shapeJson.properties.agreementNumber.keyword',
      accessorKey: 'customLayer.shapeJson.properties.agreementNumber',
      header: 'Agreement',
      Cell: ({ row }) => {
        let value = row?.original?.customLayer?.shapeJson.properties.agreementNumber
        value = value?.toString();
        const splitNumber = value?.split("_");
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              minWidth: '500px',
              maxWidth: '500px'
            }}
          >
            <Grid container spacing={0} direction="row"
              style={{
                position: 'absolute',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                alignItems: 'center',

                "&:hover": {
                  "& $actionButtons": {
                    display: "flex",
                  },
                },
              }}
            >
              <Grid item
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                <ColumnWithLink
                  value={splitNumber?.[0]
                    ? `${splitNumber?.[0].trim()} - ${row?.original?.customLayer?.shapeJson?.properties?.agreementName}`
                    : row?.original?.customLayer?.shapeJson?.properties?.agreementName}
                  link={`/land/agreement/details/${row?.original?.customLayer?._id}`}
                  onClick={e => {
                    e.stopPropagation();
                  }}
                />
              </Grid>
            </Grid>
          </div>
        )
      },
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'customLayer.shapeJson.properties.agreementName.keyword',
      accessorKey: 'customLayer.shapeJson.properties.agreementName',
      header: 'Agreement Name',
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'customLayer.shapeJson.properties.agreementType.keyword',
      accessorKey: 'customLayer.shapeJson.properties.agreementType',
      header: 'Type',
      Cell: ({ row }) => {


        const value = row?.original?.customLayer?.shapeJson?.properties?.agreementType
        return <>{AgreementTypes[value] || ""}</>
      }
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'customLayer.shapeJson.properties.agreementSubtype.keyword',
      accessorKey: 'customLayer.shapeJson.properties.agreementSubtype',
      header: 'Agreement Subtype',
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'customLayer.shapeJson.properties.originalProperties.stateDetails.keyword',
      accessorKey: 'customLayer.shapeJson.properties.originalProperties.stateDetails',
      header: 'State',
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'customLayer.shapeJson.properties.originalProperties.County.keyword',
      accessorKey: 'customLayer.shapeJson.properties.originalProperties.County',
      header: 'County',
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'customLayer.shapeJson.properties.rightsType.keyword',
      accessorKey: 'customLayer.shapeJson.properties.rightsType',
      header: 'Rights',
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'customLayer.shapeJson.properties.grantor.keyword',
      accessorKey: 'customLayer.shapeJson.properties.grantor',
      header: 'Grantor (Party 1)',
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'customLayer.shapeJson.properties.grantee.keyword',
      accessorKey: 'customLayer.shapeJson.properties.grantee',
      header: 'Grantee (Party 2)',
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'customLayer.shapeJson.properties.agreementDate',
      accessorKey: 'customLayer.shapeJson.properties.agreementDate',
      type: 'date',
      header: 'Agmt Date',
      isSearchField: false,
      Cell: ({ row }) => {
        const value = row?.original?.customLayer?.shapeJson?.properties?.agreementDate
        return <>{formatDate(value)}</>
      }
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'customLayer.shapeJson.properties.effectiveDate.keyword',
      accessorKey: 'customLayer.shapeJson.properties.effectiveDate',
      header: 'Efftv Date',
      isSearchField: false,
      type: 'date',
      Cell: ({ row }) => {
        return <>{formatDate(row?.original?.customLayer?.shapeJson?.properties?.effectiveDate)}</>
      },
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'customLayer.shapeJson.properties.agreementTerm.keyword',
      accessorKey: 'customLayer.shapeJson.properties.agreementTerm',
      header: 'Primary Term (Mo)',
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'customLayer.shapeJson.properties.expirationDate.keyword',
      accessorKey: 'customLayer.shapeJson.properties.expirationDate',
      header: 'Exp Date',
      isSearchField: false,
      type: 'date',
      Cell: ({ row }) => {
        return <>{formatDate(row?.original?.customLayer?.shapeJson?.properties?.expirationDate)}</>
      },
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'customLayer.shapeJson.properties.extensionTerm.keyword',
      accessorKey: 'customLayer.shapeJson.properties.extensionTerm',
      header: 'Extension Term (Mo)',
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'customLayer.shapeJson.properties.extensionDate.keyword',
      accessorKey: 'customLayer.shapeJson.properties.extensionDate',
      header: 'Extension Exp Date',
      isSearchField: false,
      type: 'date',
      Cell: ({ row }) => {
        return <>{formatDate(row?.original?.customLayer?.shapeJson?.properties?.extensionDate)}</>
      },
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'customLayer.shapeJson.properties.bounusPayment.keyword',
      accessorKey: 'customLayer.shapeJson.properties.bounusPayment',
      header: 'Bonus Payment',
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'customLayer.shapeJson.properties.agmtRoyalty.keyword',
      accessorKey: 'customLayer.shapeJson.properties.agmtRoyalty',
      header: 'Agmt Royalty(%)',
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'customLayer.shapeJson.properties.agreementStatus.keyword',
      accessorKey: 'customLayer.shapeJson.properties.agreementStatus',
      header: 'Status',
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'customLayer.shapeJson.properties.acquisitionID.keyword',
      accessorKey: 'customLayer.shapeJson.properties.acquisitionID',
      header: 'Acquisition ID',
      size: 280,
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'customLayer.shapeJson.properties.acquisitionDate',
      accessorKey: 'customLayer.shapeJson.properties.acquisitionDate',
      header: 'Acquisition Date',
      type: 'date',
      isSearchField: false,
      Cell: ({ row }) => {
        return <>{formatDate(row?.original?.customLayer?.shapeJson?.properties?.acquisitionDate)}</>
      },
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'customLayer.shapeJson.properties.prospectID.keyword',
      accessorKey: 'customLayer.shapeJson.properties.prospectID',
      header: 'Prospect',
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'customLayer.shapeJson.properties.recordedDate.keyword',
      accessorKey: 'customLayer.shapeJson.properties.recordedDate',
      header: 'Recorded Date',
      type: 'date',
      isSearchField: false,
      Cell: ({ row }) => {
        return <>{formatDate(row?.original?.customLayer?.shapeJson?.properties?.recordedDate)}</>
      },
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'customLayer.shapeJson.properties.recordedBook.keyword',
      accessorKey: 'customLayer.shapeJson.properties.recordedBook',
      header: 'Book',
      isSearchField: false,
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'customLayer.shapeJson.properties.recordedPage.keyword',
      accessorKey: 'customLayer.shapeJson.properties.recordedPage',
      header: 'Page',
      isSearchField: false,
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'customLayer.shapeJson.properties.recordedInstrumentNumber.keyword',
      accessorKey: 'customLayer.shapeJson.properties.recordedInstrumentNumber',
      header: 'Instrument #',
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'customLayer.shapeJson.properties.reportGrossAcres.keyword',
      accessorKey: 'customLayer.shapeJson.properties.reportGrossAcres',
      header: 'Report Gross',
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'customLayer.shapeJson.properties.grossAcres.keyword',
      accessorKey: 'customLayer.shapeJson.properties.grossAcres',
      header: 'Gross',
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'customLayer.shapeJson.properties.netAcres.keyword',
      accessorKey: 'customLayer.shapeJson.properties.netAcres',
      header: 'Net',
    },


    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'customLayer.shapeJson.properties.companyNetAcres.keyword',
      accessorKey: 'customLayer.shapeJson.properties.companyNetAcres',
      header: 'Company Net',
    },


    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'customLayer.shapeJson.properties.netRoyalty.keyword',
      accessorKey: 'customLayer.shapeJson.properties.netRoyalty',
      header: 'NRA',
    },


    {
      ...CommonSchema.TAGS,
      Cell: ({ row }) => {
        const targetSourceId = row.getValue('_id');
        return <TagCell id={targetSourceId} targetSourceId={targetSourceId} tags={row?.original?.tags} targetLabel={'agreement'} />;
      },
    },

  ],
};

export default AgreementMeta;
