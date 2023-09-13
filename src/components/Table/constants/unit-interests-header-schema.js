import ColumnWithLink from "components/Shared/M1nTable/components/SubComponents/ColumnWithLink";
import ListChips from "components/Common/ListChips";
import vf_currency, { vf_currency_to_fixed } from "components/Shared/valueformatters/vf_currency";
import { GlobalStickyStyles } from "GlobalSettings";
import { history } from "store";
import CampaignNameField from 'components/ContactDetailCard/components/FieldContent/CampaignNameField';

const UnitInterestsHeadCells = [
    {
        name: "_id", options: { filter: false, display: false, sort: false, viewColumns: false, }
    },
    {
        name: "contactId", options: {
            dbName: "contact._id",
            filter: false,
            display: false,
            sort: false,
            viewColumns: false
        }
    },
    {
        name: "customLayerId", options: {
            filter: false,
            display: false,
            sort: false,
            viewColumns: false
        }
    },
    {
        name: "unitName", label: "Unit Name", esKey: 'shape.shapeJson.properties.shapeLabel.keyword',
        options: {
            dbName: "shape.shapeJson.properties.shapeLabel",
            sort: true,
            filter: true,
            ...GlobalStickyStyles({
                setCellProps: {
                    left: '77px',
                    padding: "0px 25px 0px 35px"
                },
                setCellHeaderProps: {
                    left: '77px',
                }
            }),
            customRender: (value, tableMeta) => {
                const unitInterestId = tableMeta.rowData[2]

                return <ColumnWithLink value={value} link={`/map/units/${unitInterestId}`} />;
            },
        }
    },
    {
        name: "State", label: "State", esKey: [
            'shape.shapeJson.properties.originalProperties.State.keyword',
            'shape.shapeJson.properties.originalProperties.StateAbbreviation.keyword'
        ],
        options: {
            dbName: "shape.shapeJson.properties.originalProperties.0?.State?.StateAbbreviation?",
            sort: true,
            filter: true
        }
    },
    {
        name: "County", label: "County", esKey: 'shape.shapeJson.properties.originalProperties.County.keyword',
        options: {
            dbName: "shape.shapeJson.properties.originalProperties.0?.County",
            sort: true,
            filter: true
        }
    },
    {
        name: "SurveyMeridian", label: "Survey/ Meridian", esKey: [
            'shape.shapeJson.properties.originalProperties.Survey.keyword',
            'shape.shapeJson.properties.originalProperties.PrincipalMeridian.keyword'
        ],
        options: {
            dbName: "shape.shapeJson.properties.originalProperties.0?.Survey?.PrincipalMeridian?",
            sort: true,
            filter: true
        }
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
        name: "BlockTownship", label: "Block/ Township", esKey: [
            'shape.shapeJson.properties.originalProperties.Block.keyword',
            'shape.shapeJson.properties.originalProperties.Township.keyword'
        ],
        options: {
            dbName: "shape.shapeJson.properties.originalProperties.0?.Block?.Township?",
            sort: true,
            filter: true
        }
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
        name: "SectionRange", label: "Section/ Range", esKey: [
            'shape.shapeJson.properties.originalProperties.Section.keyword',
            'shape.shapeJson.properties.originalProperties.Range.keyword'
        ],
        options: {
            dbName: "shape.shapeJson.properties.originalProperties.0?.Section?.Range?",
            sort: true,
            filter: true
        }
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
        name: "AbstractSection", label: "Abstract/ Section", esKey: [
            'shape.shapeJson.properties.originalProperties.AbstractName.keyword',
            'shape.shapeJson.properties.originalProperties.ShortName.keyword'
        ],
        options: {
            dbName: "shape.shapeJson.properties.originalProperties.0?.AbstractName?.ShortName?",
            sort: true,
            filter: true
        }
    },
    {
        name: "name", label: "Owner Name", esKey: 'contact.entityDetail.name.keyword',
        options: {
            dbName: "contact.entityDetail.name",
            sort: true,
            filter: true
        }
    },
    // {
    //     name: "QtrCalls", label: "QTR Calls", esKey: 'qtr.keyword', 
    //     options: { 
    //         dbName: "qtr",
    //         sort: true, 
    //         filter: true 
    //     }
    // },
    // {
    //     name: "GrossAcres", label: "Gross Acres", esKey: 'shape.shapeJson.properties.sdGrossAcres.keyword', 
    //     options: { 
    //         dbName: "shape.shapeJson.properties.sdGrossAcres",
    //         sort: true, 
    //         filter: true 
    //     }
    // },
    // {
    //     name: "depthFrom", label: "Depth From", esKey: 'depthFrom.keyword', 
    //     options: { 
    //         dbName: "depthFrom",
    //         sort: true, 
    //         filter: true 
    //     }
    // },
    // {
    //     name: "depthTo", label: "Depth To", esKey: 'depthTo.keyword', 
    //     options: { 
    //         dbName: "depthTo",
    //         sort: true, 
    //         filter: true 
    //     }
    // },
    // {

    {
        name: "working_interest", label: "Working Interest", esKey: 'working_interest',
        options: {
            dbName: "working_interest",
            sort: true,
            filter: true
        }
    },
    // {
    //     name: "mineral_interest", label: "Mineral Interest", esKey: 'mineral_interest', 
    //     options: { 
    //         dbName: "mineral_interest",
    //         sort: true, 
    //         filter: true 
    //     }
    // },
    {
        name: "royalty_interest", label: "Royalty Interest", esKey: 'royalty_interest',
        options: {
            dbName: "royalty_interest",
            sort: true,
            filter: true
        }
    },
    {
        name: "orri", label: "ORRI", esKey: 'orri',
        options: {
            dbName: "orri",
            sort: true,
            filter: true
        }
    },

    {
        name: "nri", label: "NRI", esKey: 'nri',
        options: {
            dbName: "nri",
            sort: true,
            filter: true
        }
    },
    // {
    //     name: "net_acres", label: "Net Acres", esKey: 'net_acres', 
    //     options: { 
    //         dbName: "net_acres",
    //         sort: true, 
    //         filter: true 
    //     }
    // },
    {
        name: "nra", label: "NRA", esKey: 'nra',
        options: {
            dbName: "nra",
            sort: true,
            filter: true
        }
    },
    //remove until max offer price logic has been fixed
    // {
    //     name: "uMaxUnitPricing", label: "Max Offer Price", esKey: 'shape.shapeJson.properties.uMaxUnitPricing.keyword',
    //     options: {
    //         dbName: "uMaxUnitPricing",
    //         sort: true,
    //         filter: true,
    //         customRender: (value) => vf_currency_to_fixed(value, 2)
    //     }
    // },
    {
        name: "offer_price", label: "Offer Price", esKey: 'offer_price',
        options: {
            dbName: "offer_price",
            sort: true,
            filter: true,
            customRender: (value) => vf_currency_to_fixed(value, 2)
        }
    },
    // {
    //     name: "ShortName", label: "ShortName", esKey: 'shapeJson.properties.originalProperties.ShortName.keyword', 
    //     options: { 
    //         dbName: "shapeJson.properties.originalProperties.ShortName",
    //         sort: true, 
    //         filter: true 
    //     }
    // },
    // {
    //     name: "tractType", label: "Type", esKey: 'shape.shapeJson.properties.tractType.keyword', 
    //     options: { 
    //         dbName: "shape.shapeJson.properties.tractSubtype",
    //         sort: true, 
    //         filter: true 
    //     }
    // },
    // {
    //     name: "tractSubtype", label: "Subtype", esKey: 'shapeJson.properties.tractSubtype.keyword', 
    //     options: { 
    //         dbName: "shapeJson.properties.tractSubtype",
    //         sort: true, 
    //         filter: true 
    //     }
    // },
    // {
    //     name: "rightsType", label: "Rights", esKey: 'shapeJson.properties.rightsType.keyword', 
    //     options: { 
    //         dbName: "shapeJson.properties.rightsType",
    //         sort: true, 
    //         filter: true 
    //     }
    // },
    // {
    //     name: "grantor", label: "Grantor (Party 1)", esKey: 'shapeJson.properties.grantor.keyword', 
    //     options: { 
    //         dbName: "shapeJson.properties.grantor",
    //         sort: true, 
    //         filter: true 
    //     }
    // },
    // {
    //     name: "grantee", label: "Grantee (Party 2)", esKey: 'shapeJson.properties.grantee.keyword', 
    //     options: { 
    //         dbName: "shapeJson.properties.grantee",
    //         sort: true, 
    //         filter: true 
    //     }
    // },
    // {
    //     name: "tractDate", label: "Agmt Date", esKey: 'shapeJson.properties.tractDate.keyword', 
    //     options: { 
    //         dbName: "shapeJson.properties.tractDate",
    //         sort: true, 
    //         filter: true 
    //     }
    // },
    // {
    //     name: "effectiveDate", label: "Efftv Date", esKey: 'shapeJson.properties.effectiveDate.keyword', 
    //     options: { 
    //         dbName: "shapeJson.properties.effectiveDate",
    //         sort: true, 
    //         filter: true 
    //     }
    // },
    // {
    //     name: "expirationDate", label: "Exp Date", esKey: 'shapeJson.properties.expirationDate.keyword', 
    //     options: { 
    //         dbName: "shapeJson.properties.expirationDate",
    //         sort: true, 
    //         filter: true 
    //     }
    // },
    // {
    //     name: "extensionDate", label: "Ext Date", esKey: 'shapeJson.properties.extensionDate.keyword', 
    //     options: { 
    //         dbName: "shapeJson.properties.extensionDate",
    //         sort: true, 
    //         filter: true 
    //     }
    // },
    // {
    //     name: "tractStatus", label: "Status", esKey: 'shapeJson.properties.tractStatus.keyword', 
    //     options: { 
    //         dbName: "shapeJson.properties.tractStatus",
    //         sort: true, 
    //         filter: true 
    //     }
    // },
    // {
    //     name: "reportGrossAcres", label: "RPT GRS", esKey: 'shapeJson.properties.reportGrossAcres.keyword', 
    //     options: { 
    //         dbName: "shapeJson.properties.reportGrossAcres",
    //         sort: true, 
    //         filter: true 
    //     }
    // },
    // {
    //     name: "netAcres", label: "NET", esKey: 'shapeJson.properties.netAcres.keyword', 
    //     options: { 
    //         dbName: "shapeJson.properties.netAcres",
    //         sort: true, 
    //         filter: true 
    //     }
    // },
    // {
    //     name: "status", label: "Status", esKey: 'shapeJson.properties.approvalStatus.keyword', 
    //     options: { 
    //         dbName: "shapeJson.properties.approvalStatus",
    //         sort: true, 
    //         filter: true
    //     }
    // },
    {
        name: "campaignName", label: "Campaign", esKey: 'campaignName.keyword',
        options: {
            dbName: "campaignName.keyword",
            customRender: (value) => {
                return <CampaignNameField value={value} fullWidth disabled />;
            },
            setCellProps: () => ({ style: { minWidth: "200px" } }),
            sort: true,
            filter: true
        }
    },
    {
        name: "campaignPriority", label: "Campaign Priority", esKey: 'campaignPriority.keyword',
        options: {
            dbName: "campaignPriority.keyword",
            sort: true,
            filter: true
        }
    },
    {
        name: "deals",
        label: "Associated Deals",
        esKey: "deals.keyword",
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
        name: "tags", label: "Tags", esKey: 'tags.tag.keyword', options: { sort: true, filter: true }
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
    {
        name: "detailCard",
        label: " ",
        options: {
            display: false,
            filter: false,
            sort: false,
            searchable: false,
            download: false,
            print: false,
            viewColumns: false,
        },
    },
];

export default UnitInterestsHeadCells;