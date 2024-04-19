import { CurrencyFormatCustom } from "components/Shared/Forms/Formatting/CurrencyFormatCustom";

const parcelOwnerForm = (contact) => [
  {
    label: "Seller Asking Price",
    name: "seller_asking_price",
    defaultValue: "",
    InputProps: {
      inputComponent: CurrencyFormatCustom,
    }
  },
  {
    label: "Competitor Offer Price",
    name: "competitor_offer_price",
    defaultValue: "",
    InputProps: {
      inputComponent: CurrencyFormatCustom,
    }
  },
  {
    label: "Actual Offer Price",
    name: "actual_offer_price",
    defaultValue: "",
    InputProps: {
      inputComponent: CurrencyFormatCustom,
    }
  },
];

export default parcelOwnerForm;