import ListChips from 'components/Common/ListChips';
import { vf_currency_to_fixed } from 'components/Shared/valueformatters/vf_currency';
import { GlobalStickyStyles } from 'GlobalSettings';

const UnitInterestsPageHeadCells = [
    {
        name: '_id',
        options: { filter: false, display: false, sort: false, viewColumns: false },
    },
    {
        name: 'name',
        label: 'Contact Name',
        esKey: 'contact.entityDetail.name.keyword',
        options: {
            ...GlobalStickyStyles({}),
            sort: true,
            filter: true,
        },
    },
    {
        name: 'unitName',
        label: 'Unit Name',
        esKey: 'shape.shapeJson.properties.uName.keyword',
        options: {
            sort: true,
            filter: true,
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
        },
    },
    {
        name: 'working_interest',
        esKey: 'working_interest',
        type: 'number',
        label: 'WI',
        options: { filter: true },
    },
    {
        name: 'royalty_interest',
        esKey: 'royalty_interest',
        type: 'number',
        label: 'RI',
        options: { filter: true },
    },
    {
        name: 'orri',
        label: 'ORRI',
        esKey: 'orri',
        options: { sort: true, filter: true },
    },
    {
        name: 'nri',
        label: 'NRI',
        esKey: 'nri',
        options: { sort: true, filter: true },
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
        },
    },
    {
        name: 'uUnitPricing',
        label: 'Price/NRA',
        esKey: 'shape.shapeJson.properties.uUnitPricing.keyword',
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
        name: 'offer_price',
        label: 'Offer Price',
        esKey: 'offer_price',
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
            searchable: true,
            sort: true,
        },
    },
    {
        name: 'campaignName',
        label: 'Campaign Name',
        esKey: 'campaignName.keyword',
        options: {
            display: true,
            filter: true,
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
            searchable: false,
            sort: true,
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
        name: "tags",
        label: "Tags",
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
];

export default UnitInterestsPageHeadCells;
