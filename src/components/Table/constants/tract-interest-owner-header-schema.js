import { Chip } from "@material-ui/core";
import ListChips from "components/Common/ListChips";
import GlobalSettings from "../../../GlobalSettings";
const TractInterestOwnerHeadCells = (isSnapGrid = false) => [
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
      setCellProps: () => ({
        style: {
          ...GlobalSettings.muiGridInfScrollOptions.setCellProps().style,
          left: isSnapGrid ? "77px" : "132px",
        },
      }),
      setCellHeaderProps: () => ({
        style: {
          ...GlobalSettings.muiGridInfScrollOptions.setCellHeaderProps().style,
          left: isSnapGrid ? "77px" : "132px",
        },
      }),
      ignoreGlobal: true,
      dbName: "shapeJson.properties.agreementNumber",
      isSnapGrid,
    },
    style: { minWidth: "320px" },
  },
  {
    name: "ownershipType",
    label: "Entity Type",
    esKey: "contact.ownerType.keyword",
    options: { display: true },
    style: { minWidth: "150px" },
  },
  {
    name: "surface_interest",
    label: "Surface Interest",
    esKey: "surface_interest",
    options: {
      display: true,
    },
  },
  {
    name: "mineral_interest",
    label: "Mineral Interest",
    esKey: "mineral_interest",
    options: {
      display: true,
    },
  },
  {
    name: "royalty_interest",
    label: "Royalty Interest",
    esKey: "royalty_interest",
    options: {
      display: true,
    },
  },
  {
    name: "orri",
    label: "ORRI",
    esKey: "orri",
    options: {
      display: true,
    },
  },
  {
    name: "unknown_interest",
    label: "Unknown Interest",
    esKey: "unknown_interest",
    options: {
      display: false,
    },
  },
  {
    name: "record_title",
    label: "Record Title",
    esKey: "record_title",
    options: {
      display: true,
    },
  },
  {
    name: "operating_rights",
    label: "Working Interest",
    esKey: "operating_rights",
    options: {
      display: true,
    },
  },
  {
    name: "nri",
    label: "NRI",
    esKey: "nri",
    options: {
      display: true,
    },
  },
  {
    name: "net_acres",
    label: "Net Acres",
    esKey: "net_acres",
    options: {
      display: true,
    },
  },
  {
    name: "company_net_acres",
    label: "Co Net Acres",
    esKey: "company_net_acres",
    options: {
      display: true,
    },
  },
  {
    name: "nra",
    label: "NRA",
    esKey: "nra",
    editable: true,
    options: { display: true },
    style: { minWidth: "100px" },
  },
  {
    name: "cost_bearing",
    label: "Cost Bearing",
    esKey: "cost_bearing",
    editabe: true,
    options: { display: false, viewColumns: false },
  },
  {
    name: "cost_free_high_value",
    label: "Cost Free High Value",
    esKey: "cost_free_high_value",
    editabe: true,
    options: { display: false, viewColumns: false },
  },
  {
    name: "cost_bearing_high_value",
    label: "Cost Bearing High Value",
    esKey: "cost_bearing_high_value",
    editabe: true,
    options: { display: false, viewColumns: false },
  },
  {
    name: "depthFrom",
    label: "Depth From",
    esKey: "depthFrom.keyword",
    editabe: true,
    options: {
      display: true,
    },
  },
  {
    name: "depthTo",
    label: "Depth To",
    esKey: "depthTo.keyword",
    editabe: true,
    options: {
      display: true,
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
    name: "qtr_calls",
    label: "QTR Calls",
    options: { display: false, viewColumns: false },
  },
  {
    name: "qtr",
    label: "QTR",
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
    name: "tags",
    label: "Tags ",
    esKey: "tags.tag.keyword",
    options: {
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
    name: "actionMenu",
    label: " ",
    options: {
      filter: false,
      searchable: false,
      sort: true,
      download: false,
      print: false,
      viewColumns: false,
      parent: "Tract detail",
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

export default TractInterestOwnerHeadCells;
