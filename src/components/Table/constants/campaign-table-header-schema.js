import ColumnWithLink from "components/Shared/M1nTable/components/SubComponents/ColumnWithLink";
import { history } from "store";
import vf_number from "components/Shared/valueformatters/vf_number";

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
          <ColumnWithLink
            value={value}
            link={`/contacts/campaign/details/${tableMeta.rowData[0]}`}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        ) : (
          <p style={{ color: "#898989b0" }}>N/A</p>
        );
      },
    },
  },
  {
    name: "status",
    label: "Campaign Status",
    esKey: "status.keyword",
    options: {
      display: true,
      sort: true,
      filter: true,
    },
  },
  {
    name: "unitCount",
    label: "Units",
    esKey: "unitCount",
    options: {
      display: true,
      sort: true,
      filter: false,
      customRender: (value, tableMeta) => {
        return <p>{value}</p>;
      },
    },
  },
  {
    name: "totalNra",
    label: "Total Unit NRA",
    esKey: "totalNra",
    options: {
      display: true,
      sort: true,
      filter: false,
      customRender: (value, tableMeta) => {
        return <p>{vf_number(value.toFixed(0))}</p>;
      },
    },
  },
  {
    name: "owner",
    label: "Supervisor",
    esKey: "owner.name.keyword",
    options: {
      display: true,
      sort: true,
      filter: true,
    },
  },
  {
    name: "createdAt",
    label: "Created Date",
    esKey: "createdAt",
    options: {
      display: true,
      sort: true,
      filter: true,
    },
  },

  {
    name: "tags",
    label: "Tags",
    esKey: "tags",
    options: {
      display: true,
      sort: true,
      filter: true,
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
];

export default CampaignsHeadCells;
