import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import { CurrencyFormatCustom } from 'components/Shared/Forms/Formatting/CurrencyFormatCustom';
import { contactStatusOptions } from 'components/ContactDetailedInfo/helper';
import { entityTypeOptions } from "components/ContactDetailedInfo/helper";
import { popupController } from 'hookstate/popupStateController';
import { addTrailingZeros } from 'components/Shared/functions';
import { sideDialogController } from "hookstate/sideDialogController"
import { calculateStandardNraForTract } from 'utils/calculatedNraHelper';

const calculateNetAcres = interest => {
  const selectedParcel = popupController.getValue('selectedParcel');
  if (!interest) return null;
  const netAcres = addTrailingZeros(
    selectedParcel?.sdGrossAcres ? (selectedParcel.sdGrossAcres * interest).toFixed(8) : null
  );
  return netAcres;
};

const calculateOfferPrice = (nra, offer) => {
  return parseFloat((parseFloat(nra || 0) * parseFloat(offer || 0)).toFixed(2));
};

const parcelOwnerForm = (getValues, setValue) => {

  return [
    {
      label: "Entity Type",
      name: "ownerType",
      defaultOptions: entityTypeOptions,
      renderField: "autoComplete",
      filterKey: "ownerType.keyword",
      esIndex: "contacts_flat",
    },
    {
      label: "Surface Interest",
      name: "surface_interest",
      type: "number",
      onBlur: (value) => {
        return parseFloat(value).toFixed(8)
      },
    },
    {
      label: "Mineral Interest",
      name: "mineral_interest",
      type: "number",
      onBlur: (value) => {
        return parseFloat(value).toFixed(8)
      },
    },
    {
      label: "Non-Exec Rights Only",
      name: "nonExecRightsOnly",
      renderField: "autoComplete",
      defaultOptions: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }]
    },
    {
      label: "Royalty Interest (Lease)",
      name: "royalty_interest",
      type: "number",
      onBlur: (value) => {
        return parseFloat(value).toFixed(8)
      },
    },
    {
      label: "Overriding Royalty Interest (ORRI)",
      name: "orri",
      type: "number",
      onBlur: (value) => {
        return parseFloat(value).toFixed(8)
      },
    },
    {
      label: "Working Interest",
      name: "operating_rights",
      type: "number",
    },
    {
      label: "Net Acres",
      name: "net_acres",
      isValueOverridden: (value) => {
        const { mineral_interest } = getValues()

        if (!value) return
        const netAcres = calculateNetAcres(mineral_interest);
        const isOverride = parseFloat(netAcres) !== parseFloat(value)
        sideDialogController.updateState({ 'showNetAcresRecalculate': isOverride })
        return isOverride
      },
      onChange: (value) => {
        const { mineral_interest, nra, royalty_interest, orri } = getValues()
        const selectedParcel = popupController.getValue('selectedParcel');
        const workspaceSettings = sideDialogController.getValue('workspaceSettings')
        const uUnitPricingNMA = sideDialogController.getValue('uUnitPricingNMA')
        const uMaxUnitPricingNMA = sideDialogController.getValue('uMaxUnitPricingNMA')
        setValue('net_acres', value)
        if (!nra) {
          const calculatedNra = calculateStandardNraForTract(selectedParcel?.sdGrossAcres, mineral_interest, royalty_interest, orri, workspaceSettings)
          setValue('nra', calculatedNra)
        }
        setValue('offer_price_nma', calculateOfferPrice(value, uUnitPricingNMA))
        setValue('max_offer_price_nma', calculateOfferPrice(value, uMaxUnitPricingNMA))
      },
      InputProps: {
        endAdornment: (
          <InputAdornment position="end">
            {!!sideDialogController.getValue('showNetAcresRecalculate') && (
              <IconButton
                aria-label="toggle offer_price_nma"
                onClick={() => {
                  const selectedParcel = popupController.getValue('selectedParcel');
                  const workspaceSettings = sideDialogController.getValue('workspaceSettings')
                  const uUnitPricingNMA = sideDialogController.getValue('uUnitPricingNMA')
                  const uMaxUnitPricingNMA = sideDialogController.getValue('uMaxUnitPricingNMA')
                  const { mineral_interest, nra, royalty_interest, orri } = getValues()
                  const netAcres = calculateNetAcres(mineral_interest);
                  setValue('net_acres', netAcres)
                  if (!nra) {
                    const calculatedNra = calculateStandardNraForTract(selectedParcel?.sdGrossAcres, mineral_interest, royalty_interest, orri, workspaceSettings)
                    setValue('nra', calculatedNra)
                  }
                  setValue('offer_price_nma', calculateOfferPrice(netAcres, uUnitPricingNMA))
                  setValue('max_offer_price_nma', calculateOfferPrice(netAcres, uMaxUnitPricingNMA))
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
      label: "Target Offer Price (NMA)",
      name: "offer_price_nma",
      isValueOverridden: (value) => {
        if (!value) return
        const { net_acres } = getValues();
        const uUnitPricingNMA = sideDialogController.getValue('uUnitPricingNMA')
        const calculatedOfferPrice = calculateOfferPrice(net_acres, uUnitPricingNMA);
        const isOverride = parseFloat(calculatedOfferPrice) !== parseFloat(value)
        sideDialogController.updateState({ 'showTargetOfferPriceRecalculate': isOverride })
        return isOverride
      },
      InputProps: {
        inputComponent: CurrencyFormatCustom,
        endAdornment: (
          <InputAdornment position="end">
            {!!sideDialogController.getValue('showTargetOfferPriceRecalculate') && (
              <IconButton
                aria-label="toggle offer_price_nma"
                onClick={() => {
                  const { net_acres } = getValues();
                  const uUnitPricingNMA = sideDialogController.getValue('uUnitPricingNMA')
                  setValue('offer_price_nma', calculateOfferPrice(net_acres, uUnitPricingNMA))
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
      label: "Max Offer Price (NMA)",
      name: "max_offer_price_nma",
      InputProps: {
        inputComponent: CurrencyFormatCustom,
        endAdornment: (
          <InputAdornment position="end">
            {true && (
              <IconButton
                aria-label="toggle offer_price_nma"
                onClick={() => {
                  console.log('recalculate')
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
      label: "Net Royalty Acres (NRA)",
      name: "nra",
      type: "number",
      InputProps: {
        endAdornment: (
          <InputAdornment position="end">
            {true && (
              <IconButton
                aria-label="toggle offer_price_nma"
                onClick={() => {
                  console.log('recalculate')
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
      label: "Target Offer Price (per NRA)",
      name: "offer_price",
      InputProps: {
        inputComponent: CurrencyFormatCustom,
        endAdornment: (
          <InputAdornment position="end">
            {true && (
              <IconButton
                aria-label="toggle offer_price_nma"
                onClick={() => {
                  console.log('recalculate')
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
      label: "Max Offer Price (per NRA)",
      name: "max_offer_price",
      InputProps: {
        inputComponent: CurrencyFormatCustom,
        endAdornment: (
          <InputAdornment position="end">
            {true && (
              <IconButton
                aria-label="toggle offer_price_nma"
                onClick={() => {
                  console.log('recalculate')
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
      label: "Company Net Acres",
      name: "company_net_acres",
      type: "number",
    },
    {
      label: "Seller Asking Price",
      name: "seller_asking_price",
      InputProps: {
        inputComponent: CurrencyFormatCustom,
      }
    },
    {
      label: "Competitor Offer Price",
      name: "competitor_offer_price",
      InputProps: {
        inputComponent: CurrencyFormatCustom,
      }
    },
    {
      label: "Actual Offer Price",
      name: "actual_offer_price",
      InputProps: {
        inputComponent: CurrencyFormatCustom,
      }
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
      name: "qtr1",
      renderField: "autoComplete",
      defaultOptions: [
        { label: 'E2', value: 'E2' },
        { label: 'NE', value: 'NE' },
        { label: 'NW', value: 'NW' },
        { label: 'N2', value: 'N2' },
        { label: 'SE', value: 'SE' },
        { label: 'SW', value: 'SW' },
        { label: 'S2', value: 'S2' },
        { label: 'W2', value: 'W2' }
      ]
    },
    {
      label: "QTR 2",
      name: "qtr2",
      renderField: "autoComplete",
      defaultOptions: [
        { label: 'E2', value: 'E2' },
        { label: 'NE', value: 'NE' },
        { label: 'NW', value: 'NW' },
        { label: 'N2', value: 'N2' },
        { label: 'SE', value: 'SE' },
        { label: 'SW', value: 'SW' },
        { label: 'S2', value: 'S2' },
        { label: 'W2', value: 'W2' }
      ]
    },
    {
      label: "QTR 3",
      name: "qtr3",
      renderField: "autoComplete",
      defaultOptions: [
        { label: 'E2', value: 'E2' },
        { label: 'NE', value: 'NE' },
        { label: 'NW', value: 'NW' },
        { label: 'N2', value: 'N2' },
        { label: 'SE', value: 'SE' },
        { label: 'SW', value: 'SW' },
        { label: 'S2', value: 'S2' },
        { label: 'W2', value: 'W2' }
      ]
    },
    {
      label: "QTR 4",
      name: "qtr4",
      renderField: "autoComplete",
      defaultOptions: [
        { label: 'E2', value: 'E2' },
        { label: 'NE', value: 'NE' },
        { label: 'NW', value: 'NW' },
        { label: 'N2', value: 'N2' },
        { label: 'SE', value: 'SE' },
        { label: 'SW', value: 'SW' },
        { label: 'S2', value: 'S2' },
        { label: 'W2', value: 'W2' }
      ]
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
      label: "Lease Status",
      name: "leaseStatus",
      renderField: "autoComplete",
      esIndex: 'shapeowners_flat',
      filterKey: 'leaseStatus.keyword',
      defaultOptions: [{ label: "HBP", value: "HBP" }, { label: "Leased", value: "Leased" }, { label: "Unleased", value: "Unleased" }]
    },
    {
      label: "Associated Deals",
      name: "deals",
      renderField: "associatedDeals"
    },
    {
      label: "Depth Restrictions",
      name: "depthBoth",
      renderField: "radioButton",
      options: [
        { value: "true", label: "All Depths" },
        { value: "false", label: "Footages/Formations" },
      ]
    },
    // {
    //   label: "Depth From",
    //   name: "depthFrom",
    // },
    // {
    //   label: "Depth To",
    //   name: "depthTo",
    // },
  ]
};

export default parcelOwnerForm;