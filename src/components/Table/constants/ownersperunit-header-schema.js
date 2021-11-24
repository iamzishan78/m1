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
    esKey: 'contact.entityDetail.name.keyword',
    options: { filter: true, setCellProps: () => ({ style: { minWidth: "270px" } }) }
  },
  { name: "working_interest", esKey: 'working_interest', type: "number", label: "Working Interest", options: { filter: true } },
  { name: "royalty_interest", esKey: 'royalty_interest', type: "number", label: "Royalty Interest", options: { filter: true } },
  { name: "orri", esKey: 'orri', label: "ORRI", type: "number", options: { filter: true } },
  { name: "nri", esKey: 'nri', label: "NRI", type: "number", options: { filter: true } },
  { name: "nra", esKey: 'nra', label: "NRA", type: "number", editable: true, options: { filter: true } },
  { name: "seller_asking_price", esKey: 'seller_asking_price', type: "number", label: "Seller Asking Price", options: { filter: true, customBodyRender: (value) => vf_currency(value) } },
  { name: "competitor_offer_price", esKey: 'competitor_offer_price', type: "number", label: "Competitor Offer Price", options: { filter: true, customBodyRender: (value) => vf_currency(value) } },
  {
    name: "offer_price", esKey: 'offer_price', label: "Offer Price", type: "number", options: {
      filter: true, customBodyRender: (value) => vf_currency(value),
    }
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
    name: "isTracked",
    label: "Track",
    options: {
      filter: false,
      searchable: false,
      download: false,
      print: false,
      filterOptions: {
        names: ["Tracked", "Untracked"],
        logic(tracked, filterVal) {
          return !(
            (filterVal.indexOf("Tracked") >= 0 && tracked) ||
            (filterVal.indexOf("Untracked") >= 0 && !tracked)
          );
        },
      },
      filterType: "dropdown",
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

];

export default OwnersPerUnitHeadCells;

