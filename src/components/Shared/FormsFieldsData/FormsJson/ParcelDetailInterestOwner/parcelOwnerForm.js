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
import { GET_ES_FILTER_LIST } from "graphQL/useQueryESFilterList";

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

const parcelOwnerForm = ({ getValues, setValue, tenantName, state }) => {

  const formFields = [
    {
      label: "Entity Type",
      name: "ownerType",
      defaultOptions: entityTypeOptions,
      renderField: "autoComplete",
      variables: {
        esIndex: "contacts_flat",
        filterKey: "ownerType.keyword",
        size: 10000,
      },
      query: GET_ES_FILTER_LIST,
      getOptions: (apiRes) => {
        const filterData = apiRes.data.getESFilterList.hits.map(
          (hit) => hit.key
        );
        return filterData
      }
    },
    {
      label: "Surface Interest",
      name: "surface_interest",
      type: "number",
      onBlur: (value) => {
        setValue('surface_interest', parseFloat(value).toFixed(8))
        return parseFloat(value).toFixed(8)
      }
    },
    {
      label: "Mineral Interest",
      name: "mineral_interest",
      type: "number",
      onBlur: (value) => {
        const { net_acres, nra, royalty_interest, orri } = getValues() || {}
        setValue('mineral_interest', parseFloat(value).toFixed(8))


        if (!net_acres) {
          const netAcres = calculateNetAcres(value)
          setValue('net_acres', netAcres)
        }

        if (!nra) {
          const selectedParcel = popupController.getValue('selectedParcel');
          const workspaceSettings = sideDialogController("tractInterestDialog").getValue('workspaceSettings')

          const calculatedNra = calculateStandardNraForTract(selectedParcel?.sdGrossAcres, value, royalty_interest, orri, workspaceSettings)
          setValue('nra', calculatedNra)
        }
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
    },
    {
      label: "Overriding Royalty Interest (ORRI)",
      name: "orri",
      type: "number",
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
        if (!value) return
        const { mineral_interest } = getValues() || {}

        const netAcres = calculateNetAcres(mineral_interest);
        const isOverride = parseFloat(netAcres) !== parseFloat(value)
        sideDialogController("tractInterestDialog").updateState({
          'showNetAcresRecalculate': isOverride,
          rerenderJson: isOverride,
          netAcresOverRideValue: value
        })
        return isOverride
      },
      onChange: (value) => {
        const { mineral_interest, nra, royalty_interest, orri } = getValues() || {}
        const selectedParcel = popupController.getValue('selectedParcel');
        const workspaceSettings = sideDialogController("tractInterestDialog").getValue('workspaceSettings')
        const uUnitPricingNMA = sideDialogController("tractInterestDialog").getValue('uUnitPricingNMA')
        const uMaxUnitPricingNMA = sideDialogController("tractInterestDialog").getValue('uMaxUnitPricingNMA')
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
            {!!sideDialogController("tractInterestDialog").getValue('showNetAcresRecalculate') && (
              <IconButton
                aria-label="toggle offer_price_nma"
                onClick={() => {
                  const selectedParcel = popupController.getValue('selectedParcel');
                  const workspaceSettings = sideDialogController("tractInterestDialog").getValue('workspaceSettings')
                  const { mineral_interest, nra, royalty_interest, orri } = getValues() || {}
                  const netAcres = calculateNetAcres(mineral_interest);
                  setValue('net_acres', netAcres)
                  if (!nra) {
                    const calculatedNra = calculateStandardNraForTract(selectedParcel?.sdGrossAcres, mineral_interest, royalty_interest, orri, workspaceSettings)
                    setValue('nra', calculatedNra)
                  }
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
        const { net_acres } = getValues() || {};
        const uUnitPricingNMA = sideDialogController("tractInterestDialog").getValue('uUnitPricingNMA')
        const calculatedOfferPrice = calculateOfferPrice(net_acres, uUnitPricingNMA);
        const isOverride = parseFloat(calculatedOfferPrice) !== parseFloat(value)
        sideDialogController("tractInterestDialog").updateState({ 'showTargetOfferPriceRecalculate': isOverride, rerenderJson: isOverride })
        return isOverride
      },
      onBlur: (value) => {
        const cleanedValue = value.replace(/[$,]/g, '');
        const numericValue = parseFloat(cleanedValue);
        const formattedValue = numericValue.toFixed(8);
        return formattedValue;
      },
      InputProps: {
        inputComponent: CurrencyFormatCustom,
        endAdornment: (
          <InputAdornment position="end">
            {!!sideDialogController("tractInterestDialog").getValue('showTargetOfferPriceRecalculate') && (
              <IconButton
                aria-label="toggle offer_price_nma"
                onClick={() => {
                  const { net_acres } = getValues() || {};
                  const uUnitPricingNMA = sideDialogController("tractInterestDialog").getValue('uUnitPricingNMA')
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
      isValueOverridden: (value) => {
        if (!value) return
        const { net_acres } = getValues() || {};
        const uMaxUnitPricingNMA = sideDialogController("tractInterestDialog").getValue('uMaxUnitPricingNMA')
        const calculatedOfferPrice = calculateOfferPrice(net_acres, uMaxUnitPricingNMA);
        const isOverride = parseFloat(calculatedOfferPrice) !== parseFloat(value)
        sideDialogController("tractInterestDialog").updateState({ 'showMaxOfferPriceRecalculate': isOverride, rerenderJson: isOverride })
        return isOverride
      },
      onBlur: (value) => {
        const cleanedValue = value.replace(/[$,]/g, '');
        const numericValue = parseFloat(cleanedValue);
        const formattedValue = numericValue.toFixed(8);
        return formattedValue;
      },
      InputProps: {
        inputComponent: CurrencyFormatCustom,
        endAdornment: (
          <InputAdornment position="end">
            {!!sideDialogController("tractInterestDialog").getValue('showMaxOfferPriceRecalculate') && (
              <IconButton
                aria-label="toggle offer_price_nma"
                onClick={() => {
                  const { net_acres } = getValues() || {};
                  const uMaxUnitPricingNMA = sideDialogController("tractInterestDialog").getValue('uMaxUnitPricingNMA')
                  setValue('max_offer_price_nma', calculateOfferPrice(net_acres, uMaxUnitPricingNMA))
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
      onChange: (value) => {
        setValue('nra', value)
        const uUnitPricing = sideDialogController("tractInterestDialog").getValue('uUnitPricing')
        const uMaxUnitPricing = sideDialogController("tractInterestDialog").getValue('uMaxUnitPricing')
        setValue('offer_price', calculateOfferPrice(value, uUnitPricing))
        setValue('max_offer_price', calculateOfferPrice(value, uMaxUnitPricing))
      },

      isValueOverridden: (value) => {
        if (!value) return
        const selectedParcel = popupController.getValue('selectedParcel');
        const workspaceSettings = sideDialogController("tractInterestDialog").getValue('workspaceSettings')
        const { mineral_interest, royalty_interest, orri } = getValues() || {}

        const calculatedNra = calculateStandardNraForTract(selectedParcel?.sdGrossAcres, mineral_interest, royalty_interest, orri, workspaceSettings)
        const isOverride = parseFloat(calculatedNra) !== parseFloat(value)
        sideDialogController("tractInterestDialog").updateState({ 'showNraRecalculate': isOverride, rerenderJson: isOverride })
        return isOverride
      },
      InputProps: {
        endAdornment: (
          <InputAdornment position="end">
            {!!sideDialogController("tractInterestDialog").getValue('showNraRecalculate') && (
              <IconButton
                aria-label="toggle offer_price_nma"
                onClick={() => {
                  const selectedParcel = popupController.getValue('selectedParcel');
                  const workspaceSettings = sideDialogController("tractInterestDialog").getValue('workspaceSettings')
                  const { mineral_interest, royalty_interest, orri } = getValues() || {}

                  const calculatedNra = calculateStandardNraForTract(selectedParcel?.sdGrossAcres, mineral_interest, royalty_interest, orri, workspaceSettings)
                  setValue('nra', calculatedNra)

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
      isValueOverridden: (value) => {
        if (!value) return
        const { nra } = getValues() || {}

        const uUnitPricing = sideDialogController("tractInterestDialog").getValue('uUnitPricing')

        const calculatedOfferPrice = calculateOfferPrice(nra, uUnitPricing);
        const isOverride = parseFloat(calculatedOfferPrice) !== parseFloat(value)
        sideDialogController("tractInterestDialog").updateState({ 'showTargetOfferRecalculate': isOverride, rerenderJson: isOverride })
        return isOverride
      },
      onBlur: (value) => {
        const cleanedValue = value.replace(/[$,]/g, '');
        const numericValue = parseFloat(cleanedValue);
        const formattedValue = numericValue.toFixed(8);
        return formattedValue;
      },
      InputProps: {
        inputComponent: CurrencyFormatCustom,
        endAdornment: (
          <InputAdornment position="end">
            {!!sideDialogController("tractInterestDialog").getValue('showTargetOfferRecalculate') && (
              <IconButton
                aria-label="toggle offer_price"
                onClick={() => {
                  const { nra } = getValues() || {}

                  const uUnitPricing = sideDialogController("tractInterestDialog").getValue('uUnitPricing')
                  setValue('offer_price', calculateOfferPrice(nra, uUnitPricing))
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
      isValueOverridden: (value) => {
        if (!value) return
        const { nra } = getValues() || {}

        const uMaxUnitPricing = sideDialogController("tractInterestDialog").getValue('uMaxUnitPricing')

        const calculatedOfferPrice = calculateOfferPrice(nra, uMaxUnitPricing);
        const isOverride = parseFloat(calculatedOfferPrice) !== parseFloat(value)
        sideDialogController("tractInterestDialog").updateState({ 'showMaxOfferRecalculate': isOverride, rerenderJson: isOverride })
        return isOverride
      },
      onBlur: (value) => {
        const cleanedValue = value.replace(/[$,]/g, '');
        const numericValue = parseFloat(cleanedValue);
        const formattedValue = numericValue.toFixed(8);
        return formattedValue;
      },
      InputProps: {
        inputComponent: CurrencyFormatCustom,
        endAdornment: (
          <InputAdornment position="end">
            {!!sideDialogController("tractInterestDialog").getValue('showMaxOfferRecalculate') && (
              <IconButton
                aria-label="toggle max_offer_price"
                onClick={() => {
                  const { nra } = getValues() || {}
                  const uMaxUnitPricing = sideDialogController("tractInterestDialog").getValue('uMaxUnitPricing')
                  setValue('max_offer_price', calculateOfferPrice(nra, uMaxUnitPricing))
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
      },
      onBlur: (value) => {
        const cleanedValue = value.replace(/[$,]/g, '');
        const numericValue = parseFloat(cleanedValue);
        const formattedValue = numericValue.toFixed(8);
        return formattedValue;
      },
    },
    {
      label: "Competitor Offer Price",
      name: "competitor_offer_price",
      InputProps: {
        inputComponent: CurrencyFormatCustom,
      },
      onBlur: (value) => {
        const cleanedValue = value.replace(/[$,]/g, '');
        const numericValue = parseFloat(cleanedValue);
        const formattedValue = numericValue.toFixed(8);
        return formattedValue;
      },
    },
    {
      label: "Actual Offer Price",
      name: "actual_offer_price",
      InputProps: {
        inputComponent: CurrencyFormatCustom,
      },
      onBlur: (value) => {
        const cleanedValue = value.replace(/[$,]/g, '');
        const numericValue = parseFloat(cleanedValue);
        const formattedValue = numericValue.toFixed(8);
        return formattedValue;
      },
    },
  ]

  if (tenantName === 'Providence') {
    const providenceFields = [
      {
        label: "Cost Bearing",
        name: "cost_bearing"
      },
      {
        label: "Cost Free High Value",
        name: "cost_free_high_value",
        InputProps: {
          inputComponent: CurrencyFormatCustom
        }
      },
      {
        label: "Cost Bearing High Value",
        name: "cost_bearing_high_value",
        InputProps: { inputComponent: CurrencyFormatCustom }
      }
    ];

    formFields.push(...providenceFields);
  }

  if (state !== 'TX') {
    const stateSpecificFields = [
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
    ]
    formFields.push(...stateSpecificFields);
  }

  const otherFields = [
    {
      label: "Contact Status",
      name: "contactStatus",
      renderField: "autoComplete",
      variables: {
        esIndex: "contacts_flat",
        filterKey: "contactStatus.keyword",
        size: 10000,
      },
      query: GET_ES_FILTER_LIST,
      getOptions: (apiRes) => {
        const filterData = apiRes.data.getESFilterList.hits.map(
          (hit) => hit.key
        );
        return filterData
      }
    },
    {
      label: "Contact Stage",
      name: "status",
      defaultOptions: contactStatusOptions,
      renderField: "autoComplete",
      variables: {
        esIndex: "contacts_flat",
        filterKey: "status.keyword",
        size: 10000,
      },
      query: GET_ES_FILTER_LIST,
      getOptions: (apiRes) => {
        const filterData = apiRes.data.getESFilterList.hits.map(
          (hit) => hit.key
        );
        return filterData
      }
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
      variables: {
        esIndex: "shapeowners_flat",
        filterKey: "campaignPriority.keyword",
        size: 10000,
      },
      query: GET_ES_FILTER_LIST,
      getOptions: (apiRes) => {
        const filterData = apiRes.data.getESFilterList.hits.map(
          (hit) => hit.key
        );
        return filterData
      }
    },
    {
      label: "Lease Status",
      name: "leaseStatus",
      renderField: "autoComplete",
      variables: {
        esIndex: "shapeowners_flat",
        filterKey: "leaseStatus.keyword",
        size: 10000,
      },
      query: GET_ES_FILTER_LIST,
      getOptions: (apiRes) => {
        const filterData = apiRes.data.getESFilterList.hits.map(
          (hit) => hit.key
        );
        return filterData
      },
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
  ]

  formFields.push(...otherFields);

  return formFields;

};

export default parcelOwnerForm;
