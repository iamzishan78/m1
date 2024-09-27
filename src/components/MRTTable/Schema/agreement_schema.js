import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import Agreements from "components/Shared/svgIcons/agreements";
import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import Grid from "@material-ui/core/Grid";
import ColumnWithLink from 'components/Shared/M1nTable/components/SubComponents/ColumnWithLink';
import { formatDate } from 'components/Shared/functions';
import { tableGlobalController } from 'hookstate/tableController';
import { UPDATECUSTOMLAYER } from "graphQL/useMutationUpdateCustomLayer";
import { globalStateController } from 'hookstate/globalStateController';
import { copy } from "utils/helper";
import _ from 'lodash';
import Loader from 'components/Loaders';
import AgreementToolBar from 'components/MRTTable/TablesOverride/AgreementTable/AgreementToolbar';
import { vf_currency_to_fixed } from "components/Shared/valueformatters/vf_currency";

const esIndex = 'shapes_flat';

const onCustomKeyChange = async (client, row, value, item) => {
  const loaderId = `upadting-${row?._id}`;

  try {
    Loader.createToast(loaderId, 'Updation in Progress');
    const user = globalStateController.getValue('user')

    const customData = copy(row?.shapeJson?.properties?.custom_data) ?? {};
    const filteredCustomData = _.pickBy(customData, (value) => value !== "" && !_.isEmpty(value));

    const shapeJson = {
      ...row?.shapeJson,
      properties: {
        ...row?.shapeJson?.properties,
        custom_data: {
          ...filteredCustomData,
          [item.name]: value,
        }
      },
    }

    await client.mutate({
      variables: {
        customLayerId: row?._id,
        userId: user?._id,
        customLayer: {
          shape: JSON.stringify(shapeJson),
          shapeJson,
        },
      },
      mutation: UPDATECUSTOMLAYER,
    });
    Loader.successToast(loaderId, 'Updation Complete');
    tableGlobalController.refetch();
  } catch (err) {
    Loader.errorToast(loaderId, 'Updation in Complete');
  }
};

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
  gridViewSettings: {
    label: 'Agreements',
    module: 'Agreements',
    Icon: Agreements,
    defaultView: {
      name: 'All Agreements',
      type: 'Default',
    },
    handleDefaultView: (view, user) => {
      if (view?.name === 'My Agreements') {
        view.filters[0].value = user._id;
      }
      return view;
    },
    cssOverride: {
      top: '138px',
      left: '10px',
      marginLeft: '-7px',
    },
  },
  onCustomKeyChange,
  CustomToolBar: AgreementToolBar,
  defaultSort: { field: "_ts", order: "desc" },
  defaultFilters: [{ field: "shapeJson.properties.type.keyword", value: "agreement" }],
  maxTableHeight: 'calc(100vh - 200px)',
  isInFiniteScroll: true,
  columnVirtualization: true,
  fetchMetaData: {
    category: 'Agreement',
  },
  TableSchema: [
    {
      ...CommonSchema.HIDDEN,
      name: '_id',
      accessorKey: '_id',
    },

    {
      ...CommonSchema.INITAIL_PINNED,
      name: 'shapeJson.properties.agreementNumber.keyword',
      accessorKey: 'shapeJson.properties.agreementNumber',
      header: 'Agreement',
      Cell: ({ row }) => {
        let value = row?.original?.shapeJson.properties.agreementNumber
        let layer = row?.original?.layer
        value = value?.toString();
        const splitNumber = value?.split("_");
        let link = ''
        if (window.location.pathname.includes('/land/'))
          link = `/land/agreement/details/${row?.original?._id}`
        else
          link = `/map/${layer}s/${row?.original?._id}`
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
                    ? `${splitNumber?.[0].trim()} - ${row?.original?.shapeJson?.properties?.agreementName}`
                    : row?.original?.shapeJson?.properties?.agreementName}
                  link={link}
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
      name: 'shapeJson.properties.agreementName.keyword',
      accessorKey: 'shapeJson.properties.agreementName',
      header: 'Agreement Name',
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'shapeJson.properties.agreementType.keyword',
      accessorKey: 'shapeJson.properties.agreementType',
      header: 'Type',
      Cell: ({ row }) => {


        const value = row?.original?.shapeJson?.properties?.agreementType
        return <>{AgreementTypes[value] || ""}</>
      }
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'shapeJson.properties.agreementSubtype.keyword',
      accessorKey: 'shapeJson.properties.agreementSubtype',
      header: 'Agreement Subtype',
    },
    // state column
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'shapeJson.properties.originalProperties.State.keyword',
      accessorKey: 'shapeJson.properties.originalProperties.State',
      header: 'State',
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'shapeJson.properties.originalProperties.County.keyword',
      accessorKey: 'shapeJson.properties.originalProperties.County',
      header: 'County',
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'shapeJson.properties.rightsType.keyword',
      accessorKey: 'shapeJson.properties.rightsType',
      header: 'Rights',
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'shapeJson.properties.grantor.keyword',
      accessorKey: 'shapeJson.properties.grantor',
      header: 'Grantor (Party 1)',
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'shapeJson.properties.grantee.keyword',
      accessorKey: 'shapeJson.properties.grantee',
      header: 'Grantee (Party 2)',
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'shapeJson.properties.agreementDate',
      accessorKey: 'shapeJson.properties.agreementDate',
      type: 'date',
      header: 'Agmt Date',
      isSearchField: false,
      Cell: ({ row }) => {
        const value = row?.original?.shapeJson?.properties?.agreementDate
        return <>{formatDate(value)}</>
      }
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'shapeJson.properties.effectiveDate.keyword',
      accessorKey: 'shapeJson.properties.effectiveDate',
      header: 'Efftv Date',
      type: 'date',
      isSearchField: false,
      Cell: ({ row }) => {
        return <>{formatDate(row?.original?.shapeJson?.properties?.effectiveDate)}</>
      },
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'shapeJson.properties.agreementTerm.keyword',
      accessorKey: 'shapeJson.properties.agreementTerm',
      header: 'Primary Term (Mo)',
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'shapeJson.properties.expirationDate.keyword',
      accessorKey: 'shapeJson.properties.expirationDate',
      header: 'Exp Date',
      type: 'date',
      isSearchField: false,
      Cell: ({ row }) => {
        return <>{formatDate(row?.original?.shapeJson?.properties?.expirationDate)}</>
      },
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'shapeJson.properties.extensionTerm.keyword',
      accessorKey: 'shapeJson.properties.extensionTerm',
      header: 'Extension Term (Mo)',
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'shapeJson.properties.extensionDate.keyword',
      accessorKey: 'shapeJson.properties.extensionDate',
      header: 'Extension Exp Date',
      type: 'date',
      isSearchField: false,
      Cell: ({ row }) => {
        return <>{formatDate(row?.original?.shapeJson?.properties?.extensionDate)}</>
      },
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'shapeJson.properties.bounusPayment.keyword',
      accessorKey: 'shapeJson.properties.bounusPayment',
      header: 'Bonus Payment',
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'shapeJson.properties.agmtRoyalty.keyword',
      accessorKey: 'shapeJson.properties.agmtRoyalty',
      header: 'Agmt Royalty(%)',
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'shapeJson.properties.agreementStatus.keyword',
      accessorKey: 'shapeJson.properties.agreementStatus',
      header: 'Status',
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'shapeJson.properties.acquisitionID.keyword',
      accessorKey: 'shapeJson.properties.acquisitionID',
      header: 'Acquisition ID',
      size: 280,
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'shapeJson.properties.acquisitionDate',
      accessorKey: 'shapeJson.properties.acquisitionDate',
      header: 'Acquisition Date',
      type: 'date',
      isSearchField: false,
      Cell: ({ row }) => {
        return <>{formatDate(row?.original?.shapeJson?.properties?.acquisitionDate)}</>
      },
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'shapeJson.properties.prospectID.keyword',
      accessorKey: 'shapeJson.properties.prospectID',
      header: 'Prospect',
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'shapeJson.properties.totalAcquisitionCost.keyword',
      accessorKey: 'shapeJson.properties.totalAcquisitionCost',
      header: 'Total Acquisition Cost',
      isSearchField: false,
      Cell: ({ row }) => {
        const value = row?.original?.shapeJson?.properties?.totalAcquisitionCost
        return <p>{value ? `${vf_currency_to_fixed(value, 2)}` : ""}</p>;
      },
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'shapeJson.properties.internalCompany.keyword',
      accessorKey: 'shapeJson.properties.internalCompany',
      header: 'Company ID',
    },



    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'shapeJson.properties.metaDescription.keyword',
      accessorKey: 'shapeJson.properties.metaDescription.keyword',
      header: 'Description',
    },


    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'shapeJson.properties.recordedDate.keyword',
      accessorKey: 'shapeJson.properties.recordedDate',
      header: 'Recorded Date',
      type: 'date',
      isSearchField: false,
      Cell: ({ row }) => {
        return <>{formatDate(row?.original?.shapeJson?.properties?.recordedDate)}</>
      },
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'shapeJson.properties.recordedBook.keyword',
      accessorKey: 'shapeJson.properties.recordedBook',
      header: 'Book',
      isSearchField: false,
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'shapeJson.properties.recordedPage.keyword',
      accessorKey: 'shapeJson.properties.recordedPage',
      header: 'Page',
      isSearchField: false,
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'shapeJson.properties.recordedInstrumentNumber.keyword',
      accessorKey: 'shapeJson.properties.recordedInstrumentNumber',
      header: 'Instrument #',
    },

    CommonSchema.CREATED_BY,
    CommonSchema.CREATED_DATE,
    CommonSchema.LAST_UPDATED_BY,
    CommonSchema.LAST_UPDATED_DATE,
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'shapeJson.properties.reportGrossAcres.keyword',
      accessorKey: 'shapeJson.properties.reportGrossAcres',
      header: 'Report Gross',
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'shapeJson.properties.grossAcres.keyword',
      accessorKey: 'shapeJson.properties.grossAcres',
      header: 'Gross',
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'shapeJson.properties.netAcres.keyword',
      accessorKey: 'shapeJson.properties.netAcres',
      header: 'Net',
    },


    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'shapeJson.properties.companyNetAcres.keyword',
      accessorKey: 'shapeJson.properties.companyNetAcres',
      header: 'Company Net',
    },


    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'shapeJson.properties.netRoyalty.keyword',
      accessorKey: 'shapeJson.properties.netRoyalty',
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
