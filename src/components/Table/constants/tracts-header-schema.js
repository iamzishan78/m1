import WarningIcon from "@material-ui/icons/Warning";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { history } from "store";

const TractsHeadCells = (isSnapGrid = false) => [
  {
    name: "_id",
    options: { filter: false, display: false, sort: false, viewColumns: false },
  },
  {
    name: "name", label: "Tract Name", esKey: 'name.keyword',
    options: {
      dbName: "name",
      sort: true,
      filter: true,
      setCellProps: () => ({
        style: {
          minWidth: "250px",
          whiteSpace: "nowrap",
          position: "sticky",
          left: "77px",
          background: "white",
          zIndex: 200,
          boxShadow: 'inset -1px 0px 0px 0px lightgrey',
        }
      }),
      setCellHeaderProps: () => ({
        style: {
          position: "sticky",
          minWidth: "250px",
          left: "77px",
          zIndex: 201
        }
      }),
      customRender: (value, tableMeta, updateValue) => {
        return (
          <p
            onClick={(e) => {
              e.stopPropagation();
              history.push(`/map/parcels/${tableMeta.rowData[0]}`, { showTractsBreadcrumb: !isSnapGrid });
            }}
            style={{ fontWeight: 600, color: "#17aadd", cursor: "pointer" }}
          >
            {value}
          </p>
        );
      },
    }
  },
  {
    name: "State", label: "State", esKey: [
      'shapeJson.properties.originalProperties.State.keyword',
      'shapeJson.properties.originalProperties.StateAbbreviation.keyword'
    ],
    options: {
      dbName: "shapeJson.properties.originalProperties.0?.State?.StateAbbreviation?",
      sort: true,
      filter: true
    },
    custom: {
      multi_filter_keys: true,
    },
  },
  {
    name: "County", label: "County", esKey: 'shapeJson.properties.originalProperties.County.keyword',
    options: {
      dbName: "shapeJson.properties.originalProperties.0?.County",
      sort: true,
      filter: true
    }
  },
  {
    name: "SurveyMeridian", label: "Survey/ Meridian", esKey: [
      'shapeJson.properties.originalProperties.Survey.keyword',
      'shapeJson.properties.originalProperties.PrincipalMeridian.keyword'
    ],
    options: {
      dbName: "shapeJson.properties.originalProperties.0?.Survey?.PrincipalMeridian?",
      sort: true,
      filter: true
    },
    custom: {
      multi_filter_keys: true,
    },
  },
  {
    name: "BlockTownship", label: "Block/ Township", esKey: [
      'shapeJson.properties.originalProperties.Block.keyword',
      'shapeJson.properties.originalProperties.Township.keyword'
    ],
    options: {
      dbName: "shapeJson.properties.originalProperties.0?.Block?.Township?",
      sort: true,
      filter: true
    },
    custom: {
      multi_filter_keys: true,
    },
  },
  {
    name: "SectionRange", label: "Section/ Range", esKey: [
      'shapeJson.properties.originalProperties.Section.keyword',
      'shapeJson.properties.originalProperties.Range.keyword'
    ],
    options: {
      dbName: "shapeJson.properties.originalProperties.0?.Section?.Range?",
      sort: true,
      filter: true
    },
    custom: {
      multi_filter_keys: true,
    },
  },
  {
    name: "AbstractSection", label: "Abstract/ Section", esKey: [
      'shapeJson.properties.originalProperties.AbstractName.keyword',
      'shapeJson.properties.originalProperties.ShortName.keyword'
    ],
    options: {
      dbName: "shapeJson.properties.originalProperties.0?.AbstractName?.ShortName?",
      sort: true,
      filter: true
    },
    custom: {
      multi_filter_keys: true,
    },
  },
  {
    name: "GrossAcres", label: "Gross Acres", esKey: 'shapeJson.properties.sdGrossAcres.keyword',
    options: {
      dbName: "shapeJson.properties.sdGrossAcres",
      sort: true,
      filter: true
    }
  },
  {
    name: "CalcAcres", label: "Calc Acres", esKey: 'shapeJson.properties.shapeArea.keyword',
    options: {
      dbName: "shapeJson.properties.shapeArea",
      sort: true,
      filter: true
    }
  },
  {
    name: "department", label: "Department", esKey: 'shapeJson.properties.department.keyword',
    options: {
      dbName: "shapeJson.properties.department",
      sort: true,
      filter: true
    }
  },
  {
    name: "tags",
    label: "Tags",
    esKey: "tags.tag.keyword",
    options: { sort: true, filter: true },
  },
  {
    name: "commentsCounter",
    label: " ",
    options: {
      dbName: "comments.comment",
      filter: false,
      searchable: false,
      sort: true,
      download: false,
      print: false,
      viewColumns: false,
    },
  },
  // {
  //   name: "approvalStatus",
  //   label: " ",
  //   esKey: "shapeJson.properties.approvalStatus.keyword",
  //   options: {
  //     dbName: "shapeJson.properties.approvalStatus",
  //     sort: true,
  //     filter: true,
  //     customRender: (value, tableMeta, updateValue) => {
  //       return (
  //         <div style={{ display: "flex", alignItems: "center" }}>
  //           {value?.toLowerCase() === "approved" ? (
  //             <CheckCircleIcon style={{ color: "forestgreen" }} />
  //           ) : (
  //             <WarningIcon style={{ color: "orange" }} />
  //           )}
  //         </div>
  //       );
  //     },
  //   },
  // },
];

export default TractsHeadCells;
