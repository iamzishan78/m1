import { CurrencyFormatCustom } from 'components/Shared/Forms/Formatting/CurrencyFormatCustom';
import { sideDialogController } from "hookstate/sideDialogController"
import InputAdornment from '@material-ui/core/InputAdornment';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import IconButton from '@material-ui/core/IconButton';
import { contactStatusOptions } from 'components/ContactDetailedInfo/helper';
import { calculateStandardNraForUnit, safeParseFloat } from "utils/calculatedNraHelper"
import { GET_ES_FILTER_LIST } from "graphQL/useQueryESFilterList";
import contactForm from "components/Shared/FormsFieldsData/RightDialogsSchema/ContactGrid/contact_form_schema"

const calculateOfferPrice = (nra, uUnitPricing = 0) => {
  if (!uUnitPricing) {
    uUnitPricing = sideDialogController("unitInterestDialog").getValue('uUnitPricing');
  }
  // Use safeParseFloat to remove NaN
  return safeParseFloat((safeParseFloat(nra || 0) * safeParseFloat(uUnitPricing || 0)).toFixed(2));
};

const unitInterestOwnerForm = ({ getValues, setValue, newOwner, metafields = [] }) => {

  const uUnitPricing = sideDialogController("unitInterestDialog").getValue('uUnitPricing')
  const uMaxUnitPricing = sideDialogController("unitInterestDialog").getValue('uMaxUnitPricing')
  const contactFields = []
  const unitInterestFields = []
  if (newOwner) {
    let contactArray = contactForm({ getValues, setValue })
    contactFields.splice(-2)
    contactFields.push(...contactArray)
  } else {
    unitInterestFields.push(contactForm({ getValues, setValue })[3])
  }
  const formFields = [
    {
      label: "Working Interest",
      name: "working_interest",
      type: "number",
      onBlur: (value) => {
        if (!sideDialogController('unitInterestDialog').getValue('showNetRoyaltyAcresRecalculate')) {
          const { royalty_interest, orri, nri } = getValues() || {}

          const workspaceSettings = sideDialogController("unitInterestDialog").getValue('workspaceSettings')
          const uAcres = sideDialogController("unitInterestDialog").getValue('uAcres')
          const calculatedNra = calculateStandardNraForUnit({ uAcres, working_interest: parseFloat(value).toFixed(8), royalty_interest, orri, nri, workspaceSettings })
          // Update nra and offer prices
          setValue('nra', calculatedNra)
          setValue('offer_price', calculateOfferPrice(calculatedNra));
          setValue('max_offer_price', calculateOfferPrice(calculatedNra, uMaxUnitPricing));
        }

        // Return 0 if the value is empty string 
        return safeParseFloat(value).toFixed(8)
      },
    },
    {
      label: "Royalty Interest (Lease)",
      name: "royalty_interest",
      type: "number",
      onBlur: (value) => {

        if (!sideDialogController("unitInterestDialog").getValue('showNetRoyaltyAcresRecalculate')) {
          const { working_interest, orri, nri } = getValues() || {}

          const workspaceSettings = sideDialogController("unitInterestDialog").getValue('workspaceSettings')
          const uAcres = sideDialogController("unitInterestDialog").getValue('uAcres')
          const calculatedNra = calculateStandardNraForUnit({ uAcres, working_interest, royalty_interest: parseFloat(value).toFixed(8), orri, nri, workspaceSettings })
          // Update nra and offer prices
          setValue('nra', calculatedNra)
          setValue('offer_price', calculateOfferPrice(calculatedNra));
          setValue('max_offer_price', calculateOfferPrice(calculatedNra, uMaxUnitPricing));
        }

        // Return 0 if the value is empty string 
        return safeParseFloat(value).toFixed(8)
      },
    },
    {
      label: "Overriding Royalty Interest (ORRI)",
      name: "orri",
      type: "number",
      onBlur: (value) => {

        if (!sideDialogController("unitInterestDialog").getValue('showNetRoyaltyAcresRecalculate')) {
          const { working_interest, royalty_interest, nri } = getValues() || {}

          const workspaceSettings = sideDialogController("unitInterestDialog").getValue('workspaceSettings')
          const uAcres = sideDialogController("unitInterestDialog").getValue('uAcres')
          const calculatedNra = calculateStandardNraForUnit({ uAcres, working_interest, royalty_interest, orri: parseFloat(value).toFixed(8), nri, workspaceSettings })
          // Update nra and offer prices
          setValue('nra', calculatedNra)
          setValue('offer_price', calculateOfferPrice(calculatedNra));
          setValue('max_offer_price', calculateOfferPrice(calculatedNra, uMaxUnitPricing));
        }

        // Return 0 if the value is empty string 
        return safeParseFloat(value).toFixed(8)
      },
    },
    {
      label: "Net Revenue Interest (NRI)",
      name: "nri",
      type: "number",
      onBlur: (value) => {


        if (!sideDialogController("unitInterestDialog").getValue('showNetRoyaltyAcresRecalculate')) {
          const { working_interest, royalty_interest, orri } = getValues() || {}

          const workspaceSettings = sideDialogController("unitInterestDialog").getValue('workspaceSettings')
          const uAcres = sideDialogController("unitInterestDialog").getValue('uAcres')
          const calculatedNra = calculateStandardNraForUnit({ uAcres, working_interest, royalty_interest, orri, nri: parseFloat(value).toFixed(8), workspaceSettings }) 
          // Update nra and offer prices
          setValue('nra', calculatedNra)
          setValue('offer_price', calculateOfferPrice(calculatedNra));
          setValue('max_offer_price', calculateOfferPrice(calculatedNra, uMaxUnitPricing));
        }

        // Return 0 if the value is empty string 
        return safeParseFloat(value).toFixed(8)
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

        const workspaceSettings = sideDialogController("unitInterestDialog").getValue('workspaceSettings')
        const uAcres = sideDialogController("unitInterestDialog").getValue('uAcres')
        const calculatedNra = calculateStandardNraForUnit({ uAcres, working_interest, royalty_interest, orri, nri, workspaceSettings })

        // Check if the calculatedNra is overriden
        const isOverride = safeParseFloat(calculatedNra) !== safeParseFloat(value)
        sideDialogController("unitInterestDialog").updateState({ 'showNetRoyaltyAcresRecalculate': isOverride, rerenderJson: isOverride })
        return isOverride
      },
      onChange: (value) => {
        // Update nra and offer prices
        setValue('nra', value);
        setValue('offer_price', calculateOfferPrice(value));
        setValue('max_offer_price', calculateOfferPrice(value, uMaxUnitPricing))
      },
      InputProps: {
        endAdornment: (
          <InputAdornment position="end">
            {!!sideDialogController("unitInterestDialog").getValue('showNetRoyaltyAcresRecalculate') && (
              <IconButton
                aria-label="toggle nra"
                onClick={() => {
                  const { working_interest, royalty_interest, orri, nri } = getValues() || {}

                  const workspaceSettings = sideDialogController("unitInterestDialog").getValue('workspaceSettings')
                  const uAcres = sideDialogController("unitInterestDialog").getValue('uAcres')
                  const calculatedNra = calculateStandardNraForUnit({ uAcres, working_interest, royalty_interest, orri, nri, workspaceSettings })

                  // revert overriden values
                  setValue('nra', calculatedNra)
                  setValue('offer_price', calculateOfferPrice(calculatedNra));
                  setValue('max_offer_price', calculateOfferPrice(calculatedNra, uMaxUnitPricing));

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
        const cleanedValue = value.replace(/[$,]/g, '');
        // Use safeParseFloat to remove NaN
        const numericValue = safeParseFloat(cleanedValue);
        const formattedValue = numericValue.toFixed(8);
        return formattedValue;
      }
    },
    {
      label: "Competitor Offer Price",
      name: "competitor_offer_price",
      InputProps: {
        inputComponent: CurrencyFormatCustom,
      },
      onBlur: (value) => {
        const cleanedValue = value.replace(/[$,]/g, '');
        // Use safeParseFloat to remove NaN
        const numericValue = safeParseFloat(cleanedValue);
        const formattedValue = numericValue.toFixed(8);
        return formattedValue;
      }
    },
    {
      label: "Target Price/NRA",
      name: "uUnitPricingInterest",
      defaultValue: uUnitPricing,
      isValueOverridden: (value) => {
        if (!value) return

        // Check if the uUnitPricing is overriden
        const isOverride = safeParseFloat(value.toString()).toFixed(2) !== safeParseFloat(uUnitPricing).toFixed(2)
        sideDialogController("unitInterestDialog").updateState({ 'showTargetPrice/NraRecalculate': isOverride, rerenderJson: isOverride })
        return isOverride
      },
      onChange: (value) => {
        const { nra } = getValues() || {}

        setValue('uUnitPricingInterest', value)
        setValue('offer_price', calculateOfferPrice(nra, value));
      },

      onBlur: (value) => {
        const cleanedValue = value.replace(/[$,]/g, '');
        // Use safeParseFloat to remove NaN
        const numericValue = safeParseFloat(cleanedValue);
        const formattedValue = numericValue.toFixed(8);
        return formattedValue;
      },
      InputProps: {
        inputComponent: CurrencyFormatCustom,
        endAdornment: (
          <InputAdornment position="end">
            {!!sideDialogController('unitInterestDialog').getValue('showTargetPrice/NraRecalculate') && (
              <IconButton
                aria-label="toggle offer_price"
                onClick={() => {
                  const { nra } = getValues() || {}

                  setValue('uUnitPricingInterest', uUnitPricing)
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
      label: "Target Offer Price",
      name: "offer_price",
      isValueOverridden: (value) => {
        if (!value) return
        const { nra } = getValues() || {}

        const calculatedOfferPrice = calculateOfferPrice(nra);
        // Check if the offer_price is overriden
        const isOverride = safeParseFloat(calculatedOfferPrice) !== safeParseFloat(value)
        sideDialogController("unitInterestDialog").updateState({ 'showTargetOfferRecalculate': isOverride, rerenderJson: isOverride })
        return isOverride
      },
      onBlur: (value) => {
        const cleanedValue = value.replace(/[$,]/g, '');
        // Use safeParseFloat to remove NaN
        const numericValue = safeParseFloat(cleanedValue);
        const formattedValue = numericValue.toFixed(8);
        return formattedValue;
      },
      InputProps: {
        inputComponent: CurrencyFormatCustom,
        endAdornment: (
          <InputAdornment position="end">
            {!!sideDialogController('unitInterestDialog').getValue('showTargetOfferRecalculate') && (
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
      label: "Max Price/NRA",
      name: "uMaxUnitPricingInterest",
      defaultValue: uMaxUnitPricing,
      isValueOverridden: (value) => {
        if (!value) return

        const isOverride = safeParseFloat(value.toString()).toFixed(2) !== safeParseFloat(uMaxUnitPricing).toFixed(2)
        sideDialogController("unitInterestDialog").updateState({ 'showMaxPrice/NraRecalculate': isOverride, rerenderJson: isOverride })
        return isOverride
      },
      onChange: (value) => {
        const { nra } = getValues() || {}

        // Update uMaxUnitPricingInterest and max_offer_price
        setValue('uMaxUnitPricingInterest', value)
        setValue('max_offer_price', calculateOfferPrice(nra, value));
      },

      onBlur: (value) => {
        const cleanedValue = value.replace(/[$,]/g, '');
        // Use safeParseFloat to remove NaN
        const numericValue = safeParseFloat(cleanedValue);
        const formattedValue = numericValue.toFixed(8);
        return formattedValue;
      },
      InputProps: {
        inputComponent: CurrencyFormatCustom,
        endAdornment: (
          <InputAdornment position="end">
            {!!sideDialogController('unitInterestDialog').getValue('showMaxPrice/NraRecalculate') && (
              <IconButton
                aria-label="toggle offer_price"
                onClick={() => {
                  const { nra } = getValues() || {}
                  // revert overriden uMaxUnitPricingInterest and max_offer_price
                  setValue('uMaxUnitPricingInterest', uMaxUnitPricing)
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
      label: "Max Offer Price",
      name: "max_offer_price",
      isValueOverridden: (value) => {
        if (!value) return
        const { nra } = getValues() || {}

        const calculatedOfferPrice = calculateOfferPrice(nra, uMaxUnitPricing);
        // Check if the max_offer_price is overriden
        const isOverride = safeParseFloat(calculatedOfferPrice) !== safeParseFloat(value)
        sideDialogController("unitInterestDialog").updateState({ 'showMaxOfferRecalculate': isOverride, rerenderJson: isOverride })
        return isOverride
      },
      onBlur: (value) => {
        const cleanedValue = value.replace(/[$,]/g, '');
        // Use safeParseFloat to remove NaN
        const numericValue = safeParseFloat(cleanedValue);
        const formattedValue = numericValue.toFixed(8);
        return formattedValue;
      },
      InputProps: {
        inputComponent: CurrencyFormatCustom,
        endAdornment: (
          <InputAdornment position="end">
            {!!sideDialogController('unitInterestDialog').getValue('showMaxOfferRecalculate') && (
              <IconButton
                aria-label="toggle offer_price"
                onClick={() => {
                  const { nra } = getValues() || {}
                  // revert overriden max_offer_price
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
      label: "Actual Offer Price",
      name: "actual_offer_price",
      InputProps: {
        inputComponent: CurrencyFormatCustom,
      },
      onBlur: (value) => {
        const cleanedValue = value.replace(/[$,]/g, '');
        // Use safeParseFloat to remove NaN
        const numericValue = safeParseFloat(cleanedValue);
        const formattedValue = numericValue.toFixed(8);
        return formattedValue;
      }
    },
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

  unitInterestFields.push(...formFields)
  const customDataJson = metafields.map(field => ({
    label: field.label,
    name: field.esKey,
    renderField: (field.type === "dropdown" || field.type === "multiselect") ? "autoComplete" : field.type,
    defaultOptions: (field.type === "dropdown" || field.type === "multiselect") ? field.dropdownOptions.map(op => ({
      value: op.value,
      label: op.value,
    })) : [],
  }));

  return [...contactFields, ...unitInterestFields, ...customDataJson];

}

export default unitInterestOwnerForm;
