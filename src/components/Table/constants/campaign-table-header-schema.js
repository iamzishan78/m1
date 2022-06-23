import { history } from "store";
import CampaignStatus from "components/Table/Contact/CampaignStatus";

const CampaignsHeadCells = [
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
    name: "name",
    label: "Campaign Name",
    esKey: "name.keyword",
    options: {
      display: true,
      sort: true,
      filter: true,
      customRender: (value, tableMeta) => {
        return value ? (
          <p
            onClick={(e) => {
              e.stopPropagation();
              
              history.push(
                {
                  pathname: `/contacts/campaign/details/${tableMeta.rowData[0]}`,
                  state: { campaignName: value }
                }
              );
            }}
            style={{ fontWeight: 600, color: "#17aadd", cursor: "pointer" }}
          >
            {value}
          </p>
        ) : (
          <p style={{ color: "#898989b0" }}>N/A</p>
        );
      },
    },
  },
  {
    name: "type",
    label: "Campaign Status",
    esKey: "type.keyword",
    options: {
      display: true,
      sort: true,
      filter: true,
    },
  },
  {
    name: "entityType",
    label: "Units",
    esKey: "type.keyword",
    options: {
      display: true,
      sort: true,
      filter: true,
    },
  },
  {
    name: "currentEntities",
    label: "Total NRA",
    esKey: "type.keyword",
    options: {
      display: true,
      sort: true,
      filter: true,
    },
  },
  {
    name: "type",
    label: "Created Date",
    esKey: "type.keyword",
    options: {
      display: true,
      sort: true,
      filter: true,
    },
  },
  {
    name: "status",
    label: "SuperVisor",
    esKey: "type.keyword",
    options: {
      display: true,
      sort: true,
      filter: true,
      customRender: (value, tableMeta) => {
        return <CampaignStatus status={value} />;
      },
    },
  },
  {
    name: "type",
    label: "Tags",
    esKey: "type.keyword",
    options: {
      display: true,
      sort: true,
      filter: true,
    },
  },
];

export default CampaignsHeadCells;
