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
            ...GlobalStickyStyles({
                setCellProps: {
                    left: '77px',
                },
                setCellHeaderProps: {
                    left: '77px',
                },
            }),
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
        name: 'shapeArea',
        label: 'Unit Acres',
        esKey: 'shape.shapeJson.properties.shapeArea.keyword',
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
        label: 'Actual RI',
        options: { filter: true },
    },
    {
        name: 'orri',
        label: 'ORRI',
        esKey: 'orri',
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
            filter: false,
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
];

export default UnitInterestsPageHeadCells;
