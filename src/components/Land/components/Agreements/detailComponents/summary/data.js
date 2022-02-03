import { InputAdornment } from "@material-ui/core";

export const agreementTypes = [
  { label: "Lease", value: "lease" },
  { label: "Deed", value: "deed" },
  { label: "Contract", value: "contract" },
  { label: "Surface/ROW", value: "surface" },
];
const fieldsList = [
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
    type: "dropdown",
    options: agreementTypes,
    formatValue: (value) => agreementTypes.find((at) => at.value === value)?.label || "",
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
    label: "Expiration Date",
    type: "date",
    key: "expirationDate",
  },
  {
    label: "Extension Date",
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
    label: "Approval Status",
    type: "autocomplete",
    key: "approvalStatus",
  },
];
export default fieldsList;
