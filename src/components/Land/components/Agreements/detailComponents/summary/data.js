import { InputAdornment } from "@material-ui/core";
import { CurrencyFormatCustomWithoutPrefix } from "components/Shared/Forms/Formatting/CurrencyFormatCustomWithoutPrefix";

export const agreementTypes = [
  { label: "Lease", value: "lease" },
  { label: "Deed", value: "deed" },
  { label: "Contract", value: "contract" },
  { label: "Surface/ROW", value: "surface" },
];

const fieldsList = (activeUser) => {
  return [
    {
      label: "Agreement Number",
      type: "text",
      key: "agreementNumber",
    },
    {
      label: "Agreement Name",
      type: "text",
      key: "agreementName",
      disabled: activeUser.rolePrivileges === "READ_ONLY",
    },
    {
      label: "Agreement Type",
      type: "select",
      options: agreementTypes,
      formatValue: (value) =>
        agreementTypes.find((at) => at.value === value)?.label || "",
      key: "agreementType",
      disabled: activeUser.rolePrivileges === "READ_ONLY",
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
      label: "Term (months)",
      type: "number",
      key: "agreementTerm",
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
      // formatValue: (value) => (value ? `$ ${value}` : ""),
      InputProps: {
        startAdornment: <InputAdornment position="start">$</InputAdornment>,
      },
    },
    {
      label: "Approval Status",
      type: "autocomplete",
      key: "approvalStatus",
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
      label: "Total Acquisition Cost",
      type: "currency",
      key: "totalAcquisitionCost",
      InputProps: {
        startAdornment: <InputAdornment position="start">$</InputAdornment>,
        inputComponent: CurrencyFormatCustomWithoutPrefix,
      },
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
  ];
}
export default fieldsList;
