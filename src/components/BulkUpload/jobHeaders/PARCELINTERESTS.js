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
    // {
    //     label: "Record Title",
    //     mapped_key: "",
    //     required: false,
    //     actual_key: "parcel.record_title"
    // },
    {
        label: "Working Interest",
        mapped_key: "",
        required: false,
        actual_key: "parcel.operating_rights"
    },
    // {
    //     label: "Net Revenue Interest",
    //     mapped_key: "",
    //     required: false,
    //     actual_key: "parcel.nri"
    // },
    {
        label: "Net Acres",
        mapped_key: "",
        required: false,
        actual_key: "parcel.net_acres"
    },
    {
        label: "Seller Asking Price",
        mapped_key: "",
        required: false,
        actual_key: "parcel.seller_asking_price"
    },
    {
        label: "Competitor Offer Price",
        mapped_key: "",
        required: false,
        actual_key: "parcel.competitor_offer_price"
    },
    {
        label: "Actual Offer Price",
        mapped_key: "",
        required: false,
        actual_key: "parcel.actual_offer_price"
    },
    {
        label: "Max Pricing (per NRA)",
        mapped_key: "",
        required: false,
        actual_key: "parcel.uMaxUnitPricing"
    },
    {
        label: "Target Pricing (per NRA)",
        mapped_key: "",
        required: false,
        actual_key: "parcel.uUnitPricing"
    },
    {
        label: "Target Pricing (per NMA)",
        mapped_key: "",
        required: false,
        actual_key: "parcel.uUnitPricingNMA"
    },
    {
        label: "Max Pricing (per NMA)",
        mapped_key: "",
        required: false,
        actual_key: "parcel.uMaxUnitPricingNMA"
    },
    {
        label: "Target Offer (NRA)",
        mapped_key: "",
        required: false,
        actual_key: "parcel.offer_price"
    },
    {
        label: "Max Offer (NRA)",
        mapped_key: "",
        required: false,
        actual_key: "parcel.max_offer_price"
    },
    {
        label: "Target Offer (NMA)",
        mapped_key: "",
        required: false,
        actual_key: "parcel.offer_price_nma"
    },
    {
        label: "Max Offer (NMA)",
        mapped_key: "",
        required: false,
        actual_key: "parcel.max_offer_price_nma"
    },
    {
        label: "Net Royalty Acres",
        mapped_key: "",
        required: false,
        actual_key: "parcel.nra"
    },
    {
        label: "Gross Acres",
        mapped_key: "",
        required: false,
        actual_key: "parcel.sdGrossAcres"
    },
    {
        label: "Tract Campaign",
        mapped_key: "",
        required: false,
        actual_key: "parcel.campaignName"
    },
    {
        label: "Non-Exec Rights Only",
        mapped_key: "",
        required: false,
        actual_key: "parcel.nonExecRightsOnly"
    },
    {
        label: "Department",
        mapped_key: "",
        required: false,
        actual_key: "parcel.department"
    },
    {
        label: "Map Status",
        mapped_key: "",
        required: false,
        actual_key: "parcel.mapStatus"
    },
    {
        label: "Data Source",
        mapped_key: "",
        required: false,
        actual_key: "parcel.dataSource"
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
        label: "Suggested",
        mapped_key: "",
        required: false,
        actual_key: "parcel.isSuggested"
    },
    {
        label: "Notes/Comments",
        mapped_key: "",
        required: false,
        actual_key: "comment"
    },
    {
        label: "Parcel Tags",
        mapped_key: "",
        required: false,
        actual_key: "parcel.tags"
    },
];