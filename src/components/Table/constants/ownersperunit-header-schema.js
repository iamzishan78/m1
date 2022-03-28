import vf_currency from "components/Shared/valueformatters/vf_currency";

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
      setCellProps: () => ({ style: { minWidth: "270px" } }),
    },
  },
  {
    name: "ownerType",
    esKey: 'contact.ownerType',
    label: "Entity Type",
    options: { filter: true }
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
    label: "Offer Price",
    type: "number",
    options: {
      filter: true,
      customRender: (value) => vf_currency(value),
    },
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
    name: "tags",
    label: "Tags ",
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
    esKey: "isPurchased",
    options: {
      display: false,
      filter: false,
      forceFilter: false,
      searchable: false,
      sort: false,
      download: false,
      print: false,
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
];

export default OwnersPerUnitHeadCells;
