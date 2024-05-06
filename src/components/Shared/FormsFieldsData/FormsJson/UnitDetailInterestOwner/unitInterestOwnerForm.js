import { CurrencyFormatCustom } from 'components/Shared/Forms/Formatting/CurrencyFormatCustom';
import { sideDialogController } from "hookstate/sideDialogController"
import InputAdornment from '@material-ui/core/InputAdornment';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import IconButton from '@material-ui/core/IconButton';
import { contactStatusOptions } from 'components/ContactDetailedInfo/helper';
import { entityTypeOptions } from "components/ContactDetailedInfo/helper";
import { calculateStandardNraForUnit } from "utils/calculatedNraHelper"

const calculateOfferPrice = nra => {
  const uUnitPricing = sideDialogController.getValue('uUnitPricing')
  return parseFloat((parseFloat(nra || 0) * parseFloat(uUnitPricing || 0)).toFixed(2));
};

const unitInterestOwnerForm = ({ getValues, setValue }) => {

  const formFields = [
    {
      label: "Entity Type",
      name: "ownerType",
      defaultOptions: entityTypeOptions,
      renderField: "autoComplete",
      filterKey: "ownerType.keyword",
      esIndex: "contacts_flat",
    },
    {
      label: "Working Interest",
      name: "working_interest",
      type: "number",
      onBlur: (value) => {
        if (!sideDialogController.getValue('showNetRoyaltyAcresRecalculate')) {
          const { royalty_interest, orri, nri } = getValues() || {}

          const workspaceSettings = sideDialogController.getValue('workspaceSettings')
          const uAcres = sideDialogController.getValue('uAcres')
          const calculatedNra = calculateStandardNraForUnit({ uAcres, working_interest: value, royalty_interest, orri, nri, workspaceSettings })
          setValue('nra', calculatedNra)
          setValue('offer_price', calculateOfferPrice(calculatedNra));
        }

        return parseFloat(value).toFixed(8)
      },
    },
    {
      label: "Royalty Interest (Lease)",
      name: "royalty_interest",
      type: "number",
      onBlur: (value) => {

        if (!sideDialogController.getValue('showNetRoyaltyAcresRecalculate')) {
          const { working_interest, orri, nri } = getValues() || {}

          const workspaceSettings = sideDialogController.getValue('workspaceSettings')
          const uAcres = sideDialogController.getValue('uAcres')
          const calculatedNra = calculateStandardNraForUnit({ uAcres, working_interest, royalty_interest: value, orri, nri, workspaceSettings })
          setValue('nra', calculatedNra)
          setValue('offer_price', calculateOfferPrice(calculatedNra));
        }

        return parseFloat(value).toFixed(8)
      },
    },
    {
      label: "Overriding Royalty Interest (ORRI)",
      name: "orri",
      type: "number",
      onBlur: (value) => {

        if (!sideDialogController.getValue('showNetRoyaltyAcresRecalculate')) {
          const { working_interest, royalty_interest, nri } = getValues() || {}

          const workspaceSettings = sideDialogController.getValue('workspaceSettings')
          const uAcres = sideDialogController.getValue('uAcres')
          const calculatedNra = calculateStandardNraForUnit({ uAcres, working_interest, royalty_interest, orri: value, nri, workspaceSettings })
          setValue('nra', calculatedNra)
          setValue('offer_price', calculateOfferPrice(calculatedNra));
        }

        return parseFloat(value).toFixed(8)
      },
    },
    {
      label: "Net Revenue Interest (NRI)",
      name: "nri",
      type: "number",
      onBlur: (value) => {


        if (!sideDialogController.getValue('showNetRoyaltyAcresRecalculate')) {
          const { working_interest, royalty_interest, orri } = getValues() || {}

          const workspaceSettings = sideDialogController.getValue('workspaceSettings')
          const uAcres = sideDialogController.getValue('uAcres')
          const calculatedNra = calculateStandardNraForUnit({ uAcres, working_interest, royalty_interest, orri, nri: value, workspaceSettings })
          setValue('nra', calculatedNra)
          setValue('offer_price', calculateOfferPrice(calculatedNra));
        }

        return parseFloat(value).toFixed(8)
      },
    },
    {
      label: "Net Acres",
      name: "net_acres",
      type: "number",
    },
    {
      label: "Net Royalty Acres (NRA)",
      name: "nra",
      type: "number",
      isValueOverridden: (value) => {
        if (!value) return
        const { working_interest, royalty_interest, orri, nri } = getValues() || {}

        const workspaceSettings = sideDialogController.getValue('workspaceSettings')
        const uAcres = sideDialogController.getValue('uAcres')
        const calculatedNra = calculateStandardNraForUnit({ uAcres, working_interest, royalty_interest, orri, nri, workspaceSettings })

        setValue('offer_price', calculateOfferPrice(calculatedNra));
        const isOverride = parseFloat(calculatedNra) !== parseFloat(value)
        sideDialogController.updateState({ 'showNetRoyaltyAcresRecalculate': isOverride, rerenderJson: isOverride })
        return isOverride
      },
      InputProps: {
        endAdornment: (
          <InputAdornment position="end">
            {!!sideDialogController.getValue('showNetRoyaltyAcresRecalculate') && (
              <IconButton
                aria-label="toggle nra"
                onClick={() => {
                  const { working_interest, royalty_interest, orri, nri } = getValues() || {}

                  const workspaceSettings = sideDialogController.getValue('workspaceSettings')
                  const uAcres = sideDialogController.getValue('uAcres')
                  const calculatedNra = calculateStandardNraForUnit({ uAcres, working_interest, royalty_interest, orri, nri, workspaceSettings })

                  setValue('nra', calculatedNra)
                  setValue('offer_price', calculateOfferPrice(calculatedNra));
                }}
              >
                <AutorenewIcon />
              </IconButton>
            )}
          </InputAdornment>
        ),
      }
    },
    {
      label: "Unit Tract ID",
      name: "unitTractId",
    },
    {
      label: "Unit Tract Acres",
      name: "tractAcres",
    },
    {
      label: "Seller Asking Price",
      name: "seller_asking_price",
      InputProps: {
        inputComponent: CurrencyFormatCustom,
      },
      onBlur: (value) => {
        console.log('value', value)
        const numericValue = parseFloat(value.slice(1));
        const formattedValue = numericValue.toFixed(8);
        return parseFloat(formattedValue).toFixed(8)
      },
    },
    {
      label: "Competitor Offer Price",
      name: "competitor_offer_price",
      InputProps: {
        inputComponent: CurrencyFormatCustom,
      },
      onBlur: (value) => {
        console.log('value', value)

        const numericValue = parseFloat(value.slice(1));
        const formattedValue = numericValue.toFixed(8);
        return parseFloat(formattedValue).toFixed(8)
      },
    },
    {
      label: "Target Offer Price",
      name: "offer_price",
      isValueOverridden: (value) => {
        if (!value) return
        const { nra } = getValues() || {}

        const calculatedOfferPrice = calculateOfferPrice(nra);
        const isOverride = parseFloat(calculatedOfferPrice) !== parseFloat(value)
        sideDialogController.updateState({ 'showTargetOfferRecalculate': isOverride, rerenderJson: isOverride })
        return isOverride
      },
      onBlur: (value) => {
        console.log('value', value)
        const numericValue = parseFloat(value.slice(1));
        const formattedValue = numericValue.toFixed(8);
        return parseFloat(formattedValue).toFixed(8)
      },
      InputProps: {
        inputComponent: CurrencyFormatCustom,
        endAdornment: (
          <InputAdornment position="end">
            {!!sideDialogController.getValue('showTargetOfferRecalculate') && (
              <IconButton
                aria-label="toggle offer_price"
                onClick={() => {
                  const { nra } = getValues() || {}

                  setValue('offer_price', calculateOfferPrice(nra))
                }}
              >
                <AutorenewIcon />
              </IconButton>
            )}
          </InputAdornment>
        ),
      }
    },
    {
      label: "Contact Status",
      name: "contactStatus",
      renderField: "autoComplete",
      filterKey: "contactStatus.keyword",
      esIndex: "contacts_flat",
    },
    {
      label: "Contact Stage",
      name: "status",
      defaultOptions: contactStatusOptions,
      renderField: "autoComplete",
      filterKey: "status.keyword",
      esIndex: "contacts_flat",
    },
    {
      label: "Campaign Names",
      name: "campaignName",
      renderField: "campaignName"
    },
    {
      label: "Campaign Priority",
      name: "campaignPriority",
      renderField: "autoComplete",
      esIndex: 'shapeowners_flat',
      filterKey: 'campaignPriority.keyword',
    },
    {
      label: "Associated Deals",
      name: "deals",
      renderField: "associatedDeals"
    },
    {
      label: "Data Source",
      name: "dataSource",
    },
    {
      label: "Tax Year",
      name: "taxYear",
      disabled: true,
    },

  ]

  return formFields;
}

export default unitInterestOwnerForm;
