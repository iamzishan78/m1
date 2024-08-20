const CONTACTS_FIELDS = require("./CONTACTS").default

const fields = JSON.parse(JSON.stringify(CONTACTS_FIELDS))
fields.splice(CONTACTS_FIELDS.length - 1, 1)

// eslint-disable-next-line import/no-anonymous-default-export
export default [
    ...fields,
    // Added contact level tags key
    {
        label: "Owner Tags",
        mapped_key: "",
        required: false,
        actual_key: "contact.tags"
    },
    {
        label: "Shape Id",
        mapped_key: "",
        required: true,
        actual_key: "shape._id",
    },
    {
        label: "Shape Name",
        mapped_key: "",
        required: true,
        actual_key: "shape.name",
    },
    {
        label: "Shape Type",
        mapped_key: "",
        required: true,
        actual_key: "shape.shapeType",
    },
    // {
    //     label: "Surface Interest",
    //     mapped_key: "",
    //     required: false,
    //     actual_key: "parcel.surface_interest"
    // },
    // {
    //     label: "Mineral Interest",
    //     mapped_key: "",
    //     required: false,
    //     actual_key: "parcel.mineral_interest"
    // },
    {
        label: "Working Interest",
        mapped_key: "",
        required: false,
        actual_key: "shape.working_interest"
    },
    {
        label: "Royalty Interest",
        mapped_key: "",
        required: false,
        actual_key: "shape.royalty_interest"
    },
    {
        label: "Target Offer Price",
        mapped_key: "",
        required: false,
        actual_key: "shape.offer_price"
    },
    {
        label: "Max Offer Price",
        mapped_key: "",
        required: false,
        actual_key: "shape.max_offer_price"
    },
    {
        label: "Actual Offer Price",
        mapped_key: "",
        required: false,
        actual_key: "shape.actual_offer_price"
    },
    {
        label: "Closed Price", // Add new field to bulkupload for shapeOwners
        mapped_key: "",
        required: false,
        actual_key: "shape.closed_price"
    },
    {
        label: "Overriding Royalty",
        mapped_key: "",
        required: false,
        actual_key: "shape.orri"
    },
    // {
    //     label: "Record Title",
    //     mapped_key: "",
    //     required: false,
    //     actual_key: "parcel.record_title"
    // },
    // {
    //     label: "Operating Rights",
    //     mapped_key: "",
    //     required: false,
    //     actual_key: "parcel.operating_rights"
    // },
    {
        label: "Net Revenue Interest",
        mapped_key: "",
        required: false,
        actual_key: "shape.nri"
    },
    // {
    //     label: "Net Acres",
    //     mapped_key: "",
    //     required: false,
    //     actual_key: "parcel.net_acres"
    // },
    {
        label: "Net Royalty Acres",
        mapped_key: "",
        required: false,
        actual_key: "shape.nra"
    },
    {
        label: "Unit Tract ID",
        mapped_key: "",
        required: false,
        actual_key: "shape.unitTractId"
    },
    {
        label: "Tract Acres",
        mapped_key: "",
        required: false,
        actual_key: "shape.tractAcres"
    },
    {
        label: "Net Acres",
        mapped_key: "",
        required: false,
        actual_key: "shape.net_acres"
    },
    {
        label: "Data Source",
        mapped_key: "",
        required: false,
        actual_key: "shape.dataSource"
    },

    // {
    //     label: "Depth From",
    //     mapped_key: "",
    //     required: false,
    //     actual_key: "parcel.depthFrom"
    // },
    // {
    //     label: "Depth To",
    //     mapped_key: "",
    //     required: false,
    //     actual_key: "parcel.depthTo"
    // },
    // {
    //     label: "QTR1",
    //     mapped_key: "",
    //     required: false,
    //     actual_key: "parcel.qtr.0"
    // },
    // {
    //     label: "QTR2",
    //     mapped_key: "",
    //     required: false,
    //     actual_key: "parcel.qtr.1"
    // },
    // {
    //     label: "QTR3",
    //     mapped_key: "",
    //     required: false,
    //     actual_key: "parcel.qtr.2"
    // },
    // {
    //     label: "QTR4",
    //     mapped_key: "",
    //     required: false,
    //     actual_key: "parcel.qtr.3"
    // },
    // {
    //     label: "Cost Bearing",
    //     mapped_key: "",
    //     required: false,
    //     actual_key: "parcel.cost_bearing"
    // },
    // {
    //     label: "Cost Free High Value",
    //     mapped_key: "",
    //     required: false,
    //     actual_key: "parcel.cost_free_high_value"
    // },
    // {
    //     label: "Cost Bearing High Value",
    //     mapped_key: "",
    //     required: false,
    //     actual_key: "parcel.cost_bearing_high_value"
    // },
    {
        label: "Global Owner Id",
        mapped_key: "",
        required: false,
        actual_key: "shape.globalOwnerId"
    },
    {
        label: "Suggested",
        mapped_key: "",
        required: false,
        actual_key: "shape.isSuggested"
    },
    {
        label: "Notes/Comments",
        mapped_key: "",
        required: false,
        actual_key: "comment"
    },
    {
        label: "Unit Tags",
        mapped_key: "",
        required: false,
        actual_key: "shape.tags"
    },
];