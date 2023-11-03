import ListChips from 'components/Common/ListChips';
import CampaignNameField from 'components/ContactDetailCard/components/FieldContent/CampaignNameField';
import { vf_currency_to_fixed } from 'components/Shared/valueformatters/vf_currency';
import { GlobalStickyStyles } from 'GlobalSettings';

const UnitInterestsPageHeadCells = (isSnapGrid = false) => [
    {
        name: '_id',
        options: { filter: false, display: false, sort: false, viewColumns: false },
    },
    {
        name: 'name',
        label: 'Contact Name',
        esKey: 'contact.entityDetail.name.keyword',
        options: {
            ...GlobalStickyStyles({ isSnapGrid }),
            sort: true,
            filter: true,
            isMultiFilter: true,
        },
    },
    {
        name: 'unitName',
        label: 'Unit Name',
        esKey: 'shape.shapeJson.properties.uName.keyword',
        options: {
            sort: true,
            filter: true,
            isMultiFilter: true,
            setCellProps: () => ({
                style: {
                    maxWidth: "450px",
                    minWidth: "450px",
                },
            }),
            setCellHeaderProps: () => ({
                style: {
                    maxWidth: "450px",
                    minWidth: "450px",
                },
            }),
        },
    },
    {
        name: 'uNumber',
        label: 'Unit #',
        esKey: 'shape.shapeJson.properties.uNumber.keyword',
        options: {
            sort: true,
            filter: true,
            isMultiFilter: true,
            // setCellProps: () => ({ style: { minWidth: "125px" } }),
        },
    },
    {
        name: 'uAcres',
        label: 'Unit Acres',
        esKey: 'shape.shapeJson.properties.uAcres.keyword',
        options: {
            sort: true,
            filter: true,
            isMultiFilter: true,
        },
    },
    {
        name: "unitTractId",
        esKey: "unitTractId.keyword",
        label: "Unit Tract ID",
        options: { filter: true },
    },
    {
        name: "tractAcres",
        esKey: "tractAcres.keyword",
        label: "Tract Acres",
        options: { filter: true },
    },
    {
        name: 'working_interest',
        esKey: 'working_interest',
        type: 'number',
        label: 'WI',
        options: {
            filter: true,
            isMultiFilter: true
        },
    },
    {
        name: 'royalty_interest',
        esKey: 'royalty_interest',
        type: 'number',
        label: 'RI',
        options: {
            filter: true,
            isMultiFilter: true
        },
    },
    {
        name: 'orri',
        label: 'ORRI',
        esKey: 'orri',
        options: {
            sort: true, filter: true,
            isMultiFilter: true
        },
    },
    {
        name: 'nri',
        label: 'NRI',
        esKey: 'nri',
        options: {
            sort: true, filter: true,
            isMultiFilter: true
        },
    },
    {
        name: "net_acres",
        esKey: "net_acres",
        label: "Net Acres",
        type: "number",
        options: { filter: true },
    },
    {
        name: 'nra',
        label: 'NRA',
        esKey: 'nra',
        // editable: false,
        noFilter: true,
        options: {
            display: true,
            sort: true,
            filter: true,
            isMultiFilter: true,
        },
    },
    {
        name: 'uUnitPricing',
        label: 'Target Price/NRA',
        esKey: 'shape.shapeJson.properties.uUnitPricing.keyword',
        // editable: false,
        noFilter: true,
        options: {
            display: true,
            sort: true,
            filter: true,
            isMultiFilter: true,
            customRender: (value) => <p>{vf_currency_to_fixed(value, 2)}</p>
        },
    },
    {
        name: 'offer_price',
        label: 'Target Offer Price',
        esKey: 'offer_price',
        // editable: false,
        noFilter: true,
        options: {
            display: true,
            sort: true,
            filter: true,
            isMultiFilter: true,
            customRender: (value) => <p>{vf_currency_to_fixed(value, 2)}</p>
        },
    },
    {
        name: 'uMaxUnitPricing',
        label: 'Max Price/NRA',
        esKey: 'shapeJson.properties.uMaxUnitPricing.keyword',
        // editable: false,
        noFilter: true,
        options: {
            display: true,
            sort: true,
            filter: true,
            isMultiFilter: true,
            customRender: (value) => <p>{vf_currency_to_fixed(value, 2)}</p>
        },
    },
    {
        name: 'max_offer_price',
        label: 'Max Offer Price',
        esKey: 'max_offer_price',
        // editable: false,
        noFilter: true,
        options: {
            display: true,
            sort: true,
            filter: true,
            customRender: (value) => <p>{vf_currency_to_fixed(value, 2)}</p>
        },
    },
    {
        name: 'actual_offer_price',
        label: 'Actual Offer Price',
        esKey: 'actual_offer_price',
        // editable: false,
        noFilter: true,
        options: {
            display: true,
            sort: true,
            filter: true,
            customRender: (value) => <p>{vf_currency_to_fixed(value, 2)}</p>
        },
    },
    {
        name: 'contactStatus',
        label: 'Contact Status',
        esKey: 'contact.contactStatus.keyword',
        options: {
            display: true,
            filter: true,
            isMultiFilter: true,
            searchable: true,
            sort: true,
        },
    },
    {
        name: 'contactOwners',
        label: 'Contact Owner',
        esKey: 'contactOwners.keyword',
        options: {
            display: true,
            filter: true,
            searchable: false,
            isMultiFilter: true,
            sort: true,
        },
    },
    {
        name: "status",
        esKey: "contact.status.keyword",
        label: "Stage",
        options: {
            filter: true,
            isMultiFilter: true
        },
    },
    {
        name: "campaignName",
        label: "Campaign Name",
        esKey: "campaignName.keyword",
        options: {
            customRender: (value) => {
                return <CampaignNameField value={value} fullWidth disabled />;
            },
            setCellProps: () => ({ style: { minWidth: "200px" } }),
            sort: true,
            isMultiFilter: true,
            filter: true,
        },
    },
    {
        name: 'campaignPriority',
        label: 'Campaign Priority',
        esKey: 'campaignPriority.keyword',
        options: {
            display: true,
            filter: true,
            isMultiFilter: true,
            searchable: false,
            sort: true,
        },
    },
    {
        name: 'reviewer',
        label: 'Reviewer',
        esKey: 'shape.shapeJson.properties.reviewer.name.keyword',
        options: {
            display: true,
            filter: true,
            isMultiFilter: true,
            searchable: false,
            sort: true,
        },
    },
    {
        name: 'qualifier',
        label: 'Qualifier',
        esKey: 'shape.shapeJson.properties.qualifier.name.keyword',
        options: {
            display: true,
            filter: true,
            isMultiFilter: true,
            searchable: false,
            sort: true,
        },
    },
    {
        name: 'offer_price',
        label: 'Target Offer Price',
        esKey: 'offer_price',
        options: {
            display: false,
            download: true,
            viewColumns: false,
        },
    },
    {
        name: 'description',
        label: 'Unit description',
        esKey: 'shape.shapeJson.properties.description.keyword',
        options: {
            display: false,
            download: true,
            viewColumns: false,
        },
    },
    {
        name: 'State',
        label: 'State',
        esKey: 'shape.shapeJson.properties.originalProperties.State.keyword',
        options: {
            display: false,
            download: true,
            viewColumns: false,
        },
    },
    {
        name: "SurveyMeridian", label: "Survey", esKey: [
            'shape.shapeJson.properties.originalProperties.Survey.keyword',
            'shape.shapeJson.properties.originalProperties.PrincipalMeridian.keyword'
        ],
        options: {
            dbName: "shape.shapeJson.properties.originalProperties.0?.Survey?.PrincipalMeridian?",
            display: false,
            download: true,
            viewColumns: false,
            isMultiFilter: true,
        },
        custom: {
            oRFilter: true,
        },
    },
    {
        name: 'block',
        label: 'Block',
        esKey: 'shape.shapeJson.properties.originalProperties.Block.keyword',
        options: {
            display: false,
            download: true,
            viewColumns: false,
        },
    },
    {
        name: 'township',
        label: 'Township',
        esKey: 'shape.shapeJson.properties.originalProperties.Township.keyword',
        options: {
            display: false,
            download: true,
            viewColumns: false,
        },
    },
    {
        name: "SectionRange", label: "Section/ Range", esKey: [
            'shape.shapeJson.properties.originalProperties.Section.keyword',
            'shape.shapeJson.properties.originalProperties.Range.keyword'
        ],
        options: {
            dbName: "shape.shapeJson.properties.originalProperties.0?.Section?.Range?",
            display: false,
            download: true,
            viewColumns: false,
            isMultiFilter: true,
        },
        custom: {
            oRFilter: true,
        },
    },
    {
        name: "AbstractSection", label: "Abstract", esKey: [
            'shape.shapeJson.properties.originalProperties.AbstractName.keyword',
            'shape.shapeJson.properties.originalProperties.ShortName.keyword'
        ],
        options: {
            dbName: "shape.shapeJson.properties.originalProperties.0?.AbstractName?.ShortName?",
            display: false,
            download: true,
            viewColumns: false,
            isMultiFilter: true,
        },
        custom: {
            oRFilter: true,
        },
    },
    {
        name: 'city',
        label: 'City',
        esKey: 'shape.shapeJson.properties.city.keyword',
        options: {
            display: false,
            download: true,
            viewColumns: false,
        },
    },
    {
        name: 'County',
        label: 'County',
        esKey: 'shape.shapeJson.properties.originalProperties.County.keyword',
        options: {
            display: false,
            download: true,
            viewColumns: false,
        },
    },
    {
        name: 'address1',
        label: 'Address1',
        esKey: 'contact.entityDetail.address1.keyword',
        options: {
            display: false,
            download: true,
            viewColumns: false,
        },
    },
    {
        name: 'address2',
        label: 'Address2',
        esKey: 'contact.entityDetail.address2.keyword',
        options: {
            display: false,
            download: true,
            viewColumns: false,
        },
    },

    {
        name: 'zip',
        label: 'Zip Code',
        esKey: 'contact.entityDetail.zip.keyword',
        options: {
            display: false,
            download: true,
            viewColumns: false,
        },
    },
    {
        name: 'ownerType',
        label: 'Owner Type',
        esKey: 'contact.ownerType.keyword',
        options: {
            display: false,
            download: true,
            viewColumns: false,
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
            isMultiFilter: true,
        },
    },
    {
        name: "dataSource",
        esKey: "dataSource.keyword",
        label: "Data Source",
        options: { filter: true },
    },
    {
        name: 'taxYear',
        label: 'Tax Year',
        esKey: 'taxYear.keyword',
        options: {
            sort: true,
            filter: true,
            isMultiFilter: true,
        },
    },
    {
        name: "tags",
        label: "Tags",
        esKey: "tags.tag.keyword",
        options: {
            filter: true,
            isMultiFilter: true,
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
];

export default UnitInterestsPageHeadCells;
