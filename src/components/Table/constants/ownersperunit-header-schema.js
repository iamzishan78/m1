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
    name: "contactStatus",
    esKey: "contact.contactStatus.keyword",
    label: "Status",
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
];

export default OwnersPerUnitHeadCells;
