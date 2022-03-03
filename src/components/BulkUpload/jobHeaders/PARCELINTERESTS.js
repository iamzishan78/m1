const CONTACTS_FIELDS = require("./CONTACTS").default

export default [
    ...CONTACTS_FIELDS,
    {
        label: "Parcel Id",
        mapped_key: "",
        required: true,
        actual_key: "parcel._id",
    },
    {
        label: "Parcel Name",
        mapped_key: "",
        required: true,
        actual_key: "parcel.name",
    },
    {
        label: "Surface Interest",
        mapped_key: "",
        required: false,
        actual_key: "parcel.surface_interest"
    },
    {
        label: "Mineral Interest",
        mapped_key: "",
        required: false,
        actual_key: "parcel.mineral_interest"
    },
    {
        label: "Royalty Interest",
        mapped_key: "",
        required: false,
        actual_key: "parcel.royalty_interest"
    },
    {
        label: "Overriding Royalty",
        mapped_key: "",
        required: false,
        actual_key: "parcel.orri"
    },
    {
        label: "Record Title",
        mapped_key: "",
        required: false,
        actual_key: "parcel.record_title"
    },
    {
        label: "Operating Rights",
        mapped_key: "",
        required: false,
        actual_key: "parcel.operating_rights"
    },
    {
        label: "Net Revenue Interest",
        mapped_key: "",
        required: false,
        actual_key: "parcel.nri"
    },
    {
        label: "Net Acres",
        mapped_key: "",
        required: false,
        actual_key: "parcel.net_acres"
    },
    {
        label: "Net Royalty Acres",
        mapped_key: "",
        required: false,
        actual_key: "parcel.nra"
    },
    {
        label: "Depth From",
        mapped_key: "",
        required: false,
        actual_key: "parcel.depthFrom"
    },
    {
        label: "Depth To",
        mapped_key: "",
        required: false,
        actual_key: "parcel.depthTo"
    },
    {
        label: "QTR1",
        mapped_key: "",
        required: false,
        actual_key: "parcel.qtr.0"
    },
    {
        label: "QTR2",
        mapped_key: "",
        required: false,
        actual_key: "parcel.qtr.1"
    },
    {
        label: "QTR3",
        mapped_key: "",
        required: false,
        actual_key: "parcel.qtr.2"
    },
    {
        label: "QTR4",
        mapped_key: "",
        required: false,
        actual_key: "parcel.qtr.3"
    },
    {
        label: "Cost Bearing",
        mapped_key: "",
        required: false,
        actual_key: "parcel.cost_bearing"
    },
    {
        label: "Cost Free High Value",
        mapped_key: "",
        required: false,
        actual_key: "parcel.cost_free_high_value"
    },
    {
        label: "Cost Bearing High Value",
        mapped_key: "",
        required: false,
        actual_key: "parcel.cost_bearing_high_value"
    },
    {
        label: "Notes/Comments",
        mapped_key: "",
        required: false,
        actual_key: "comment"
    },
];