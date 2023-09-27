const tableData = [
  {
    label: "Unit Name",
    type: "text",
    key: "uName",
  },
  {
    label: "Unit Number",
    type: "text",
    key: "uNumber",
  },
  {
    label: "Unit Type",
    type: "autocomplete",
    key: "uType",
  },
  {
    label: "Unit Status",
    type: "autocomplete",
    options: ["Held by Production"],
    key: "uStatus",
  },
  {
    label: "Unit Acres",
    type: "comma-number",
    key: "uAcres",
  },
  {
    label: "Calculated Acres",
    type: "comma-number",
    key: "shapeArea",
    nonEditable: true,
  },
  {
    label: "Total Unit Interest",
    type: "comma-number",
    key: "totalUnitInterest",
    nonEditable: true,
  },
  {
    label: "Current Operator",
    type: "text",
    key: "uPrimaryOperator",
  },
  {
    label: "Field Name",
    type: "text",
    key: "uFieldName",
  },
  {
    label: "Unit Depth",
    type: "number",
    key: "uDepth",
  },
  {
    label: "Primary Bench",
    type: "text",
    key: "uPrimaryBench",
  },
  {
    label: "Net Royalty Acres (NRA)",
    type: "calculation",
    key: "netRoyalityAcres",
  },
  {
    label: "Target Pricing (per NRA)",
    type: "currency",
    key: "uUnitPricing",
  },

  {
    label: "Max Pricing (per NRA)",
    type: "currency",
    key: "uMaxUnitPricing",
  },
  {
    label: "Qualifier",
    type: "custom",
    key: "qualifier",
  },
  {
    label: "Reviewer",
    type: "custom",
    key: "reviewer",
  },
  {
    label: "Campaign Name",
    type: "custom",
    key: "campaignName",
  },
];
export default tableData;
