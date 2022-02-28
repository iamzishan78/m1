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
      customRender: (value) => {
        return value ? (
          <p
            onClick={(e) => {
              e.stopPropagation();
              // history.push(`/revenue/statement/details/${tableMeta.rowData[0]}`);
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
    label: "Campaign Type",
    esKey: "type.keyword",
    options: {
      display: true,
      sort: true,
      filter: true,
    },
  },
  {
    name: "entityType",
    label: "Entity Type",
    esKey: "type.keyword",
    options: {
      display: true,
      sort: true,
      filter: true,
    },
  },
  {
    name: "currentEntities",
    label: "# Current Entities",
    esKey: "type.keyword",
    options: {
      display: true,
      sort: true,
      filter: true,
    },
  },
  {
    name: "type",
    label: "# Sent",
    esKey: "type.keyword",
    options: {
      display: true,
      sort: true,
      filter: true,
    },
  },
  {
    name: "status",
    label: "Campaign Status",
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
];

export default CampaignsHeadCells;
