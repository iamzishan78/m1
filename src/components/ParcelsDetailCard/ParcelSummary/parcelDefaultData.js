const tableData = [
    {
        label: "Tract Name",
        type: "text",
        key: "shapeLabel",
        nonEditable: false,
    },
    {
        label: "State",
        type: "text",
        key: "originalProperties.State",
        nonEditable: true,
    },
    {
        label: "Country",
        type: "autocomplete",
        key: "originalProperties.County",
        nonEditable: true,
    },
    {
        label: "Survey",
        type: "autocomplete",
        key: "originalProperties.Survey",
        showStateTX: true,
        nonEditable: true,
    },
    {
        label: "Block",
        type: "autocomplete",
        key: "originalProperties.Block",
        showStateTX: true,
        nonEditable: true,
    },
    {
        label: "Section",
        type: "text",
        key: "originalProperties.Section",
        showStateTX: true,
        nonEditable: true,
    },
    {
        label: "Abstract",
        type: "text",
        key: "originalProperties.AbstractName",
        showStateTX: true,
        nonEditable: true,
    },
    {
        label: "Alt Survey",
        type: "text",
        key: "originalProperties.Grantee",
        showStateTX: true,
        nonEditable: true,
    },
    {
        label: "Meridian",
        type: "text",
        key: "meridian",
        showStateTX: false,
        nonEditable: true,
    },
    {
        label: "Township",
        type: "autocomplete",
        key: "township",
        showStateTX: false,
        nonEditable: true,
    },
    {
        label: "Range",
        type: "number",
        key: "range",
        showStateTX: false,
        nonEditable: true,
    },
    {
        label: "Section",
        type: "text",
        key: "section",
        showStateTX: false,
        nonEditable: true,
    },
    {
        label: "Gross Acres",
        type: "comma-number",
        key: "sdGrossAcres",
        nonEditable: false,
    },
    {
        label: "Calculated Acres",
        type: "comma-number",
        key: "shapeArea",
        nonEditable: true,
    },
    {
        label: "Tract Status",
        type: "autocomplete",
        key: "tractStatus",
        edit: true,
    },
    {
        label: "Map Status",
        type: "autocomplete",
        key: "mapStatus",
        edit: true,
    }
];

export default tableData;
