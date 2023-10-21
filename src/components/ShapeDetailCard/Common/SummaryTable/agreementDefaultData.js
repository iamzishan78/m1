import { InputAdornment } from "@material-ui/core";

export const agreementTypes = [
  { label: "Lease", value: "lease" },
  { label: "Deed", value: "deed" },
  { label: "Contract", value: "contract" },
  { label: "Surface/ROW", value: "surface" },
];
const tableData = [
  {
    label: "Agreement Number",
    type: "text",
    key: "agreementNumber",
  },
  {
    label: "Agreement Name",
    type: "text",
    key: "agreementName",
  },
  {
    label: "Agreement Type",
    type: "select",
    options: agreementTypes,
    formatValue: (value) =>
      agreementTypes.find((at) => at.value === value)?.label || "",
    key: "agreementType",
  },
  {
    label: "Agreement Subtype",
    type: "autocomplete",
    key: "agreementSubtype",
  },
  {
    label: "Rights Type",
    type: "autocomplete",
    key: "rightsType",
  },
  {
    label: "Agreement Status",
    type: "autocomplete",
    key: "agreementStatus",
  },
  {
    label: "Lessor (Grantor)",
    type: "text",
    key: "grantor",
  },
  {
    label: "Lessee (Grantee)",
    type: "text",
    key: "grantee",
  },
  {
    label: "Agreement Date",
    type: "date",
    key: "agreementDate",
  },
  {
    label: "Effective Date",
    type: "date",
    key: "effectiveDate",
  },
  {
    label: "Primary Term (months)",
    type: "number",
    key: "agreementTerm",
  },
  {
    label: "Expiration Date",
    type: "date",
    key: "expirationDate",
  },
  {
    label: "Extension Term (months)",
    type: "number",
    key: "extensionTerm",
  },
  {
    label: "Extension Expiration Date",
    type: "date",
    key: "extensionDate",
  },
  {
    label: "Bonus Payment",
    type: "text",
    key: "bounusPayment",
    formatValue: (value) => (value ? `$ ${value}` : ""),
    InputProps: {
      startAdornment: <InputAdornment position="start">$</InputAdornment>,
    },
  },
  {
    label: "Agreement Royalty (%)",
    type: "text",
    key: "agmtRoyalty",
    // formatValue: (value) => (value ? `$ ${value}` : ""),
    InputProps: {
      endAdornment: <InputAdornment position="positionEnd">%</InputAdornment>,
    },
  },
  {
    label: "Acquisition ID",
    type: "autocomplete",
    key: "acquisitionID",
  },
  {
    label: "Acquisition Date",
    type: "date",
    key: "acquisitionDate",
  },
  {
    label: "Prospect",
    type: "autocomplete",
    key: "prospectID",
  },
  {
    label: "Internal Company",
    type: "autocomplete",
    key: "internalCompany",
  },
  {
    label: "Approval Status",
    type: "autocomplete",
    key: "approvalStatus",
  },
  {
    label: "State",
    type: "state",
    key: "state"
  },
  {
    label: "County",
    type: "county",
    key: "county"
  },
];
export default tableData;
