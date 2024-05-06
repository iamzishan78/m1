import { CurrencyFormatCustom } from 'components/Shared/Forms/Formatting/CurrencyFormatCustom';
import { sideDialogController } from "hookstate/sideDialogController"
import InputAdornment from '@material-ui/core/InputAdornment';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import IconButton from '@material-ui/core/IconButton';
import { contactStatusOptions } from 'components/ContactDetailedInfo/helper';
import { entityTypeOptions } from "components/ContactDetailedInfo/helper";
import { calculateStandardNraForUnit } from "utils/calculatedNraHelper"
import { GET_ES_FILTER_LIST } from "graphQL/useQueryESFilterList";

const calculateOfferPrice = nra => {
  const uUnitPricing = sideDialogController("unitInterestDialog").getValue('uUnitPricing')
  return parseFloat((parseFloat(nra || 0) * parseFloat(uUnitPricing || 0)).toFixed(2));
};

const unitInterestOwnerForm = ({ getValues, setValue }) => {

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
      label: "Working Interest",
      name: "working_interest",
      type: "number",
      onBlur: (value) => {
        if (!sideDialogController('unitInterestDialog').getValue('showNetRoyaltyAcresRecalculate')) {
          const { royalty_interest, orri, nri } = getValues() || {}

          const workspaceSettings = sideDialogController("unitInterestDialog").getValue('workspaceSettings')
          const uAcres = sideDialogController("unitInterestDialog").getValue('uAcres')
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

        if (!sideDialogController("unitInterestDialog").getValue('showNetRoyaltyAcresRecalculate')) {
          const { working_interest, orri, nri } = getValues() || {}

          const workspaceSettings = sideDialogController("unitInterestDialog").getValue('workspaceSettings')
          const uAcres = sideDialogController("unitInterestDialog").getValue('uAcres')
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

        if (!sideDialogController("unitInterestDialog").getValue('showNetRoyaltyAcresRecalculate')) {
          const { working_interest, royalty_interest, nri } = getValues() || {}

          const workspaceSettings = sideDialogController("unitInterestDialog").getValue('workspaceSettings')
          const uAcres = sideDialogController("unitInterestDialog").getValue('uAcres')
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


        if (!sideDialogController("unitInterestDialog").getValue('showNetRoyaltyAcresRecalculate')) {
          const { working_interest, royalty_interest, orri } = getValues() || {}

          const workspaceSettings = sideDialogController("unitInterestDialog").getValue('workspaceSettings')
          const uAcres = sideDialogController("unitInterestDialog").getValue('uAcres')
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

        const workspaceSettings = sideDialogController("unitInterestDialog").getValue('workspaceSettings')
        const uAcres = sideDialogController("unitInterestDialog").getValue('uAcres')
        const calculatedNra = calculateStandardNraForUnit({ uAcres, working_interest, royalty_interest, orri, nri, workspaceSettings })

        setValue('offer_price', calculateOfferPrice(calculatedNra));
        const isOverride = parseFloat(calculatedNra) !== parseFloat(value)
        sideDialogController("unitInterestDialog").updateState({ 'showNetRoyaltyAcresRecalculate': isOverride, rerenderJson: isOverride })
        return isOverride
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
        sideDialogController("unitInterestDialog").updateState({ 'showTargetOfferRecalculate': isOverride, rerenderJson: isOverride })
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

  return formFields;
}

export default unitInterestOwnerForm;
