import { CurrencyFormatCustom } from "components/Shared/Forms/Formatting/CurrencyFormatCustom";

const parcelOwnerForm = (contact) => {
  return [
    {
      label: "Entity Type",
      name: "entity type ",
      fieldtype: "entity_type"
    },
    {
      label: "Surface Interest",
      name: "surface_interest",
      type: "number",
    },
    {
      label: "Mineral Interest",
      name: "mineral_interest",
      type: "number",
    },
    {
      label: "Non-Exec Rights Only",
      name: "nonExecRightsOnly"
    },
    {
      label: "Royalty Interest (Lease)",
      name: "royalty_interest"
    },
    {
      label: "Overriding Royalty Interest (ORRI)",
      name: "orri"
    },
    {
      label: "Working Interest",
      name: "operating_rights"
    },
    {
      label: "Net Acres",
      name: "net_acres"
    },
    {
      label: "Target Offer Price (NMA)",
      name: "offer_price_nma"
    },
    {
      label: "Max Offer Price (NMA)",
      name: "max_offer_price_nma"
    },
    {
      label: "Net Royalty Acres (NRA)",
      name: "nra"
    },
    {
      label: "Target Offer Price (per NRA)",
      name: "offer_price"
    },
    {
      label: "Max Offer Price (per NRA)",
      name: "max_offer_price"
    },
    {
      label: "Company Net Acres",
      name: "company_net_acres"
    },
    {
      label: "Seller Asking Price",
      name: "seller_asking_price"
    },
    {
      label: "Competitor Offer Price",
      name: "competitor_offer_price"
    },
    {
      label: "Actual Offer Price",
      name: "actual_offer_price"
    },
    // {
    //   label: "Cost Bearing",
    //   name: "cost_bearing"
    // },
    // {
    //   label: "Cost Free High Value",
    //   name: "cost_free_high_value"
    // },
    // {
    //   label: "Cost Bearing High Value",
    //   name: "cost_bearing_high_value"
    // },
    {
      label: "QTR 1",
      name: "qtr[0]"
    },
    {
      label: "QTR 2",
      name: "qtr[1]"
    },
    {
      label: "QTR 3",
      name: "qtr[2]"
    },
    {
      label: "QTR 4",
      name: "qtr[3]"
    },

    {
      label: "Contact Status",
      name: "contactStatus"
    },
    {
      label: "Contact Stage",
      name: "status"
    },
    {
      label: "Campaign Names",
      name: "campaignName"
    },
    {
      label: "Campaign Priority",
      name: "campaignPriority"
    },
    {
      label: "Lease Status",
      name: "leaseStatus"
    },
    {
      label: "Associated Deals",
      name: "deals"
    },
    {
      label: "Depth Restrictions",
      name: ""
    },
    {
      label: "Depth From",
      name: "depthFrom"
    },
    {
      label: "Depth To",
      name: "depthTo"
    },
  ]
};

export default parcelOwnerForm;