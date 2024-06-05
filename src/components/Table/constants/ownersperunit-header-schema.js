import vf_currency from "components/Shared/valueformatters/vf_currency";
import CampaignNameField from "components/ContactDetailCard/components/FieldContent/CampaignNameField";
import { GlobalStickyStyles } from "GlobalSettings";
import ListChips from "components/Common/ListChips";

const OwnersPerUnitHeadCells = [
  {
    name: "_id",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: false,
      download: false,
      print: false,
      viewColumns: false,
    },
  },
  {
    name: "ownerEntity",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: false,
      download: false,
      print: false,
      viewColumns: false,
    },
  },
  {
    name: "name",
    label: "Owner Name",
    esKey: "contact.entityDetail.name.keyword",
    options: {
      filter: true,
      ...GlobalStickyStyles({
        setCellProps: {
          maxWidth: "300px",
          left: "77px"
        },
        setCellHeaderProps: {
          paddingLeft: "35px",
          left: "77px"
        },
      }),
    },
  },
  {
    name: "ownerType",
    esKey: "contact.ownerType.keyword",
    label: "Entity Type",
    options: { filter: true },
  },
  {
    name: "unitTractId",
    esKey: "unitTractId.keyword",
    label: "Unit Tract ID",
    options: { filter: true },
  },
  {
    name: "tractAcres",
    esKey: "tractAcres.keyword",
    label: "Tract Acres",
    options: { filter: true },
  },
  {
    name: "working_interest",
    esKey: "working_interest",
    type: "number",
    label: "Working Interest",
    options: { filter: true },
  },
  {
    name: "royalty_interest",
    esKey: "royalty_interest",
    type: "number",
    label: "Royalty Interest",
    options: { filter: true },
  },
  {
    name: "orri",
    esKey: "orri",
    label: "ORRI",
    type: "number",
    options: { filter: true },
  },
  {
    name: "nri",
    esKey: "nri",
    label: "NRI",
    type: "number",
    options: { filter: true },
  },
  {
    name: "net_acres",
    esKey: "net_acres",
    label: "Net Acres",
    type: "number",
    options: { filter: true },
  },
  {
    name: "nra",
    esKey: "nra",
    label: "NRA",
    type: "number",
    editable: true,
    options: { filter: true },
  },
  {
    name: "seller_asking_price",
    esKey: "seller_asking_price",
    type: "number",
    label: "Seller Asking Price",
    options: { filter: true, customRender: (value) => vf_currency(value) },
  },
  {
    name: "competitor_offer_price",
    esKey: "competitor_offer_price",
    type: "number",
    label: "Competitor Offer Price",
    options: { filter: true, customRender: (value) => vf_currency(value) },
  },
  {
    name: "offer_price",
    esKey: "offer_price",
    label: "Target Offer Price",
    type: "number",
    options: { filter: true, customRender: (value) => vf_currency(value) },
  },
  {
    name: "max_offer_price",
    esKey: "",
    label: "Max Offer Price",
    type: "number",
    options: { customRender: (value) => vf_currency(value) },
  },
  {
    name: "actual_offer_price",
    esKey: "actual_offer_price",
    label: "Actual Offer Price",
    type: "number",
    options: { customRender: (value) => vf_currency(value) },
  },
  {
    name: "contactStatus",
    esKey: "contact.contactStatus.keyword",
    label: "Status",
    options: {
      filter: true,
    },
  },
  {
    name: 'contactOwners',
    label: 'Contact Owner',
    esKey: 'contactOwners.keyword',
    options: {
      display: true,
      filter: true,
      searchable: false,
      sort: true,
    },
  },
  {
    name: "status",
    esKey: "contact.status.keyword",
    label: "Stage",
    options: {
      filter: true,
    },
  },
  {
    name: "campaignName",
    label: "Campaign Name",
    esKey: "campaignName.keyword",
    options: {
      customRender: (value) => {
        return <CampaignNameField value={value} fullWidth disabled />;
        // if (typeof value.campaignName === "string") {
        //   return value.campaignName;
        // } else {
        //   return value.campaignName?.map((v, index) => `${v}${index < value?.length - 1 ? ", " : ""}`);
        // }
      },
      setCellProps: () => ({ style: { minWidth: "200px" } }),
      sort: true,
      filter: true,
    },
  },
  {
    name: "campaignPriority",
    esKey: "campaignPriority.keyword",
    label: "Campaign Priority",
    options: { filter: true },
  },
  {
    name: "deals",
    label: "Associated Deals",
    esKey: "deals.name.keyword",
    options: {
      customRender: (value) => {
        return value && <ListChips list={value} />
      },
      setCellProps: () => ({ style: { minWidth: "200px" } }),
      sort: true,
      filter: true,
    },
  },
  {
    name: "dataSource",
    esKey: "dataSource.keyword",
    label: "Data Source",
    options: { filter: true },
  },
  {
    name: "taxYear",
    esKey: "taxYear.keyword",
    label: "Tax Year",
    options: { filter: true },
  },
  {
    name: "tags",
    label: "Tags",
    esKey: "tags.tag.keyword",
    options: {
      filter: true,
      sort: false,
      download: false,
      print: false,
      filterOptions: {
        names: [],
        logic(rowVal, pickedTags) {
          let containIts = true;
          pickedTags.map((pickedTag) => {
            if (rowVal[0].indexOf(pickedTag) === -1) {
              containIts = false;
            }
          });
          return !containIts;
        },
      },
    },
  },
  {
    name: "isContact",
    label: " ",
    options: {
      filter: false,
      searchable: false,
      sort: false,
      download: false,
      print: false,
      viewColumns: false,
    },
  },
  {
    name: "commentsCounter",
    esKey: "commentsCount",
    label: " ",
    options: {
      filter: false,
      searchable: false,
      sort: false,
      download: false,
      print: false,
      viewColumns: false,
    },
  },
  {
    name: "isSuggested",
    label: " ",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: false,
      download: false,
      print: false,
      viewColumns: false,
    },
  },
  {
    name: "isOverridden",
    label: " ",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: false,
      download: false,
      print: false,
      viewColumns: false,
    },
  },

  {
    name: "isPurchased",
    label: "Purchased Data Exists",
    esKey: "contact.isPurchased",
    options: {
      display: false,
      filter: true,
      forceFilter: true,
      viewColumns: false,
    },
    custom: {
      key_as_string: true,
      isPurchased: true,
      formatedFilterOptions: [
        {
          label: "Yes",
          value: "true",
        },
        {
          label: "No",
          value: "false",
        },
      ],
    },
  },
  {
    name: "actionMenu",
    label: " ",
    options: {
      filter: false,
      searchable: false,
      sort: true,
      download: false,
      print: false,
      viewColumns: false,
      parent: "Unit detail",
    },
  },
  {
    name: 'offer_price',
    label: 'Target Offer Price',
    esKey: 'offer_price',
    options: {
      display: false,
      download: true,
      viewColumns: false,
    },
  },
  {
    name: 'description',
    label: 'Unit description',
    esKey: 'shape.shapeJson.properties.description.keyword',
    options: {
      display: false,
      download: true,
      viewColumns: false,
    },
  },
  {
    name: 'State',
    label: 'State',
    esKey: 'shape.shapeJson.properties.originalProperties.State.keyword',
    options: {
      display: false,
      download: true,
      viewColumns: false,
    },
  },
  {
    name: "SurveyMeridian", label: "Survey", esKey: [
      'shape.shapeJson.properties.originalProperties.Survey.keyword',
      'shape.shapeJson.properties.originalProperties.PrincipalMeridian.keyword'
    ],
    options: {
      dbName: "shape.shapeJson.properties.originalProperties.0?.Survey?.PrincipalMeridian?",
      display: false,
      download: true,
      viewColumns: false,
      isMultiFilter: true,
    },
    custom: {
      oRFilter: true,
    },
  },
  {
    name: 'block',
    label: 'Block',
    esKey: 'shape.shapeJson.properties.originalProperties.Block.keyword',
    options: {
      display: false,
      download: true,
      viewColumns: false,
    },
  },
  {
    name: 'township',
    label: 'Township',
    esKey: 'shape.shapeJson.properties.originalProperties.Township.keyword',
    options: {
      display: false,
      download: true,
      viewColumns: false,
    },
  },
  {
    name: "SectionRange", label: "Section/ Range", esKey: [
      'shape.shapeJson.properties.originalProperties.Section.keyword',
      'shape.shapeJson.properties.originalProperties.Range.keyword'
    ],
    options: {
      dbName: "shape.shapeJson.properties.originalProperties.0?.Section?.Range?",
      display: false,
      download: true,
      viewColumns: false,
      isMultiFilter: true,
    },
    custom: {
      oRFilter: true,
    },
  },
  {
    name: "AbstractSection", label: "Abstract", esKey: [
      'shape.shapeJson.properties.originalProperties.AbstractName.keyword',
      'shape.shapeJson.properties.originalProperties.ShortName.keyword'
    ],
    options: {
      dbName: "shape.shapeJson.properties.originalProperties.0?.AbstractName?.ShortName?",
      display: false,
      download: true,
      viewColumns: false,
      isMultiFilter: true,
    },
    custom: {
      oRFilter: true,
    },
  },
  {
    name: 'city',
    label: 'City',
    esKey: 'shape.shapeJson.properties.city.keyword',
    options: {
      display: false,
      download: true,
      viewColumns: false,
    },
  },
  {
    name: 'County',
    label: 'County',
    esKey: 'shape.shapeJson.properties.originalProperties.County.keyword',
    options: {
      display: false,
      download: true,
      viewColumns: false,
    },
  },
  {
    name: "address1",
    label: "Address1",
    esKey: "contact.entityDetail.address1.keyword",
    options: {
      display: false,
      download: true,
      viewColumns: false,
    },
  },
  {
    name: "address2",
    label: "Address2",
    esKey: "contact.entityDetail.address2.keyword",
    options: {
      display: false,
      download: true,
      viewColumns: false,
    },
  },

  {
    name: "zip",
    label: "Zip Code",
    esKey: "contact.entityDetail.zip.keyword",
    options: {
      display: false,
      download: true,
      viewColumns: false,
    },
  },
  {
    name: "ownerType",
    label: "Owner Type",
    esKey: "contact.ownerType.keyword",
    options: {
      display: false,
      download: true,
      viewColumns: false,
    },
  },
];

export default OwnersPerUnitHeadCells;
