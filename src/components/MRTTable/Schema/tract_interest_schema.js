import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import CampaignNameField from 'components/ContactDetailCard/components/FieldContent/CampaignNameField';
import vf_currency from 'components/Shared/valueformatters/vf_currency';
import ListChips from 'components/Common/ListChips';
import ContactNameLink from '../Common/TableCells/ContactNameLink';
import TractIcon from "components/Shared/svgIcons/tract";

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
  maxTableHeight: 'calc(100vh - 450px)',
  isInFiniteScroll: true,
  columnVirtualization: true,
  deletedKeys: { // Deletion keys mapping
		mainRecord: { key: '_id' },
		parentRecord: { key: 'shape._id' }
	},
  gridViewSettings: { // Grid view 
		label: 'Tract Interests',
		module: 'TractInterest',
		Icon: TractIcon,
		defaultView: {
			name: 'All Tract Interests',
			type: 'Default',
		},
		handleDefaultView: (view, user) => {
			if (view?.name === 'My Tract Interest') {
				view.filters[0].value = user._id;
			}
			return view;
		},
		cssOverride: {
			top: '161px',
			left: '190px',
		},
	},
  TableSchema: [
    {
      ...CommonSchema.HIDDEN,
      name: 'id',
      accessorKey: 'id',
    },
    {
      ...CommonSchema.MONGO_ID,
      name: '_id',
      accessorKey: '_id',
    },
    {
      ...CommonSchema.HIDDEN,
      name: 'ownerEntity',
      accessorKey: 'ownerEntity',
    },
    {
      ...CommonSchema.HIDDEN,
      name: 'contact._id',
      accessorKey: 'contact._id',
    },
    {
      ...CommonSchema.HIDDEN,
      name: "shape._id.keyword",
      accessorFn: (row) => row?.shape?._id,
      id: "shape._id",
    },

    {
      ...CommonSchema.INITAIL_PINNED,
      name: 'contact.entityDetail.name.keyword',
      accessorKey: 'contact.entityDetail.name',
      header: 'Contact Name',
      size: 500,
      Cell: ({ row }) => {
        return <ContactNameLink contact={row?.original?.contact} />
      }
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
      name: 'shape.shapeJson.properties.shapeLabel.keyword',
      accessorKey: 'shape.shapeJson.properties.shapeLabel',
      header: 'Tract Name',

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
      type: 'number',
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
      name: 'mineral_interest',
      accessorFn: row => row?.mineral_interest,
      id: 'mineral_interest',
      header: 'Mineral Interest',
      type: 'number',
      isSearchField: false,
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'nonExecRightsOnly',
      accessorFn: row => row?.nonExecRightsOnly,
      id: 'nonExecRightsOnly',
      header: 'Non-Exec Rights Only',
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'royalty_interest',
      accessorFn: row => row?.royalty_interest,
      id: 'royalty_interest',
      header: 'Royalty Interest',
      type: 'number',
      isSearchField: false,
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'orri',
      accessorFn: row => row?.orri,
      id: 'orri',
      header: 'ORRI',
      type: 'number',
      isSearchField: false,
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'net_acres',
      accessorFn: row => row?.net_acres,
      id: 'net_acres',
      header: 'Net Acres',
      type: 'number',
      isSearchField: false,
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'nra',
      accessorFn: row => row?.nra,
      id: 'nra',
      header: 'NRA',
      type: 'number',
      isSearchField: false,
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'offer_price_nma',
      accessorKey: 'offer_price_nma',
      header: 'Target Offer (NMA)',
      isSearchField: false,
      type: 'number',
      Cell: ({ row }) => <>{vf_currency(row?.original?.offer_price_nma)}</>,
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'max_offer_price_nma',
      accessorKey: 'max_offer_price_nma',
      header: 'Max Offer (NMA)',
      isSearchField: false,
      type: 'number',
      Cell: ({ row }) => <>{vf_currency(row?.original?.max_offer_price_nma)}</>,
    },


    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'offer_price',
      accessorKey: 'offer_price',
      header: 'Target Offer (NRA)',
      isSearchField: false,
      type: 'number',
      Cell: ({ row }) => <>{vf_currency(row?.original?.offer_price)}</>,
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'max_offer_price',
      accessorKey: 'max_offer_price',
      header: 'Max Offer (NRA)',
      isSearchField: false,
      type: 'number',
      Cell: ({ row }) => <>{vf_currency(row?.original?.max_offer_price)}</>,
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'seller_asking_price',
      accessorKey: 'seller_asking_price',
      header: 'Seller Asking Price',
      isSearchField: false,
      type: 'number',
      Cell: ({ row }) => <>{vf_currency(row?.original?.seller_asking_price)}</>,
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'competitor_offer_price',
      accessorKey: 'competitor_offer_price',
      header: 'Competitor Offer Price',
      isSearchField: false,
      type: 'number',
      size: 300,
      Cell: ({ row }) => <>{vf_currency(row?.original?.competitor_offer_price)}</>,
    },


    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'actual_offer_price',
      accessorKey: 'actual_offer_price',
      header: 'Actual Offer Price',
      isSearchField: false,
      type: 'number',
      Cell: ({ row }) => <>{vf_currency(row?.original?.actual_offer_price)}</>,
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'contact.contactStatus.keyword',
      accessorFn: row => row?.contact?.contactStatus,
      id: 'contact.contactStatus',
      header: 'Contact Status',
    },

    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'contact.status.keyword',
      accessorFn: row => row?.contact?.status,
      id: 'contact.status',
      header: 'Contact Stage',
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'contactOwners.keyword',
      accessorKey: 'contactOwners',
      header: 'Contact Owner',
      Cell: ({ row }) => {
        return <div>{row?.original?.contactOwners[0]}</div>
      }
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'leaseStatus.keyword',
      accessorKey: 'leaseStatus',
      header: 'Lease Status',
    },


    // {
    //   ...CommonSchema.COMMON_COLUMN,
    //   name: 'shape.shapeJson.properties.department.keyword',
    //   accessorFn: row => row?.shape?.shapeJson.properties.department,
    //   id: 'shape.shapeJson.properties.department',
    //   header: 'Department',
    // },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'campaignName.keyword',
      accessorKey: 'campaignName',
      header: 'Campaign Name',
      Cell: ({ renderedCellValue }) => <CampaignNameField value={renderedCellValue} fullWidth disabled />,
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'campaignPriority.keyword',
      accessorKey: 'campaignPriority',
      header: 'Campaign Priority',
    },
    {
      ...CommonSchema.COMMON_COLUMN,
      name: 'deals.name.keyword',
      accessorKey: 'deals.name',
      isExport: 'dealsName',
      header: 'Associated Deals',
      handleArrayExport: {
        esType: "collection",
        actualKey: "name"
      },
      isSearchField: true,
      Cell: ({ row }) => {
        return (
          <div>
            {(row?.original?.deals && Array.isArray(row?.original?.deals)) ? (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                }}
              >
                <ListChips list={row?.original?.deals} />
              </div>
            ) : (
              <div />
            )}
          </div>
        );
      },
    },
    {
      ...CommonSchema.TAGS,
      Cell: ({ row }) => {
        const targetSourceId = row.getValue('ownerEntity');
        return <TagCell id={targetSourceId} targetSourceId={targetSourceId} tags={row?.original?.tags} targetLabel={'Parcel Ownership'} />;
      },
    },
    {
      ...CommonSchema.COMMENTS,
      Cell: ({ renderedCellValue, row }) => {
        const id = row.getValue('ownerEntity');
        return <CommentCell id={id} value={row?.original?.commentsCount} targetLabel={'Parcel Ownership'} />;
      },
    },
  ],
};

export default TractInterestsMeta;

