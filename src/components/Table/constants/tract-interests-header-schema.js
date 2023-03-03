import { history } from "store";
import ColumnWithLink from "components/Shared/M1nTable/components/SubComponents/ColumnWithLink";
import { GlobalStickyStyles } from "GlobalSettings";

const TractInterestsHeadCells = [
    {
        name: "_id",
        options: { filter: false, display: false, sort: false, viewColumns: false },
    },
    {
        name: "contactId",
        options: {
            dbName: "contact._id",
            filter: false,
            display: false,
            sort: false,
            viewColumns: false,
        },
    },
    {
        name: "customLayerId",
        options: {
            filter: false,
            display: false,
            sort: false,
            viewColumns: false,
        },
    },
    {
        name: "tractName", label: "Tract Name", esKey: 'shape.shapeJson.properties.shapeLabel.keyword',
        options: {
            ...GlobalStickyStyles({
                setCellProps: {
                    left: '124.5px',
                    minWidth: "450px",
                    paddingLeft: '0px !important'
                },
                setCellHeaderProps: {
                    paddingLeft: '0px'
                }
            }),
            dbName: "shape.shapeJson.properties.shapeLabel",
            sort: true,
            filter: true,
            customRender: (value, tableMeta, updateValue) => {
                return (
                    <ColumnWithLink
                        onClick={(e) => {
                            e.stopPropagation();
                            history.push(`/map/parcels/${tableMeta.rowData[2]}`, { showTractsBreadcrumb: true });
                        }}
                        value={value}
                        link={`/map/parcels/${tableMeta.rowData[2]}`}
                    />
                );
            },
        }
    },
    {
        name: "State",
        label: "State",
        esKey: [
            "shape.shapeJson.properties.originalProperties.State.keyword",
            "shape.shapeJson.properties.originalProperties.StateAbbreviation.keyword",
        ],
        options: {
            dbName: "shape.shapeJson.properties.originalProperties.0?.State?.StateAbbreviation?",
            sort: true,
            filter: true,
        },
        custom: {
            multi_filter_keys: true,
        },
    },
    {
        name: "County",
        label: "County",
        esKey: "shape.shapeJson.properties.originalProperties.County.keyword",
        options: {
            dbName: "shape.shapeJson.properties.originalProperties.0?.County",
            sort: true,
            filter: true,
        },
    },
    {
        name: "SurveyMeridian",
        label: "Survey/ Meridian",
        esKey: [
            "shape.shapeJson.properties.originalProperties.Survey.keyword",
            "shape.shapeJson.properties.originalProperties.PrincipalMeridian.keyword",
        ],
        options: {
            dbName: "shape.shapeJson.properties.originalProperties.0?.Survey?.PrincipalMeridian?",
            sort: true,
            filter: true,
        },
        custom: {
            multi_filter_keys: true,
        },
    },
    // {
    //     name: "PrincipalMeridian", label: "PrincipalMeridian", esKey: 'shapeJson.properties.originalProperties.PrincipalMeridian.keyword',
    //     options: {
    //         dbName: "shapeJson.properties.originalProperties.PrincipalMeridian",
    //         sort: true,
    //         filter: true
    //     }
    // },
    {
        name: "BlockTownship",
        label: "Block/ Township",
        esKey: [
            "shape.shapeJson.properties.originalProperties.Block.keyword",
            "shape.shapeJson.properties.originalProperties.Township.keyword",
        ],
        options: {
            dbName: "shape.shapeJson.properties.originalProperties.0?.Block?.Township?",
            sort: true,
            filter: true,
        },
        custom: {
            multi_filter_keys: true,
        },
    },
    // {
    //     name: "Township", label: "Township", esKey: 'shapeJson.properties.originalProperties.Township.keyword',
    //     options: {
    //         dbName: "shapeJson.properties.originalProperties.Township",
    //         sort: true,
    //         filter: true
    //     }
    // },
    {
        name: "SectionRange",
        label: "Section/ Range",
        esKey: ["shape.shapeJson.properties.originalProperties.Section.keyword", "shape.shapeJson.properties.originalProperties.Range.keyword"],
        options: {
            dbName: "shape.shapeJson.properties.originalProperties.0?.Section?.Range?",
            sort: true,
            filter: true,
        },
        custom: {
            multi_filter_keys: true,
        },
    },
    // {
    //     name: "Range", label: "Range", esKey: 'shapeJson.properties.originalProperties.Range.keyword',
    //     options: {
    //         dbName: "shapeJson.properties.originalProperties.Range",
    //         sort: true,
    //         filter: true
    //     }
    // },
    {
        name: "AbstractSection",
        label: "Abstract/ Section",
        esKey: [
            "shape.shapeJson.properties.originalProperties.AbstractName.keyword",
            "shape.shapeJson.properties.originalProperties.ShortName.keyword",
        ],
        options: {
            dbName: "shape.shapeJson.properties.originalProperties.0?.AbstractName?.ShortName?",
            sort: true,
            filter: true,
        },
        custom: {
            multi_filter_keys: true,
        },
    },
    {
        name: "QtrCalls",
        label: "QTR Calls",
        esKey: "qtr.keyword",
        options: {
            dbName: "qtr",
            sort: true,
            filter: true,
        },
    },
    {
        name: "GrossAcres",
        label: "Gross Acres",
        esKey: "shape.shapeJson.properties.sdGrossAcres.keyword",
        options: {
            dbName: "shape.shapeJson.properties.sdGrossAcres",
            sort: true,
            filter: true,
        },
    },
    {
        name: "depthFrom",
        label: "Depth From",
        esKey: "depthFrom.keyword",
        options: {
            dbName: "depthFrom",
            sort: true,
            filter: true,
        },
    },
    {
        name: "depthTo",
        label: "Depth To",
        esKey: "depthTo.keyword",
        options: {
            dbName: "depthTo",
            sort: true,
            filter: true,
        },
    },
    {
        name: "name",
        label: "Owner Name",
        esKey: "contact.entityDetail.name.keyword",
        options: {
            dbName: "contact.entityDetail.name",
            sort: true,
            filter: true,
            setCellProps: () => ({ style: { minWidth: "225px" } }),
        },
    },
    {
        name: "mineral_interest",
        label: "Mineral Interest",
        esKey: "mineral_interest",
        options: {
            dbName: "mineral_interest",
            sort: true,
            filter: true,
        },
    },
    {
        name: "royalty_interest",
        label: "Royalty Interest",
        esKey: "royalty_interest",
        options: {
            dbName: "royalty_interest",
            sort: true,
            filter: true,
        },
    },
    {
        name: "orri",
        label: "ORRI",
        esKey: "orri",
        options: {
            dbName: "orri",
            sort: true,
            filter: true,
        },
    },
    {
        name: "net_acres",
        label: "Net Acres",
        esKey: "net_acres",
        options: {
            dbName: "net_acres",
            sort: true,
            filter: true,
        },
    },
    {
        name: "nra",
        label: "NRA",
        esKey: "nra",
        options: {
            dbName: "nra",
            sort: true,
            filter: true,
        },
    },

    {
        name: "department",
        label: "Department",
        esKey: "shape.shapeJson.properties.department.keyword",
        options: {
            dbName: "shape.shapeJson.properties.department",
            sort: true,
            filter: true,
        },
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
            ignoreGlobal: true,
            dbName: "comments.comment",
            filter: false,
            searchable: false,
            sort: true,
            download: false,
            print: false,
            viewColumns: false,
        },
    },
];

export default TractInterestsHeadCells;
