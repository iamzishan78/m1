import React, { useState, useEffect } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { useLazyQuery, useMutation } from "@apollo/client";

import { GET_ES_FILTER_LIST } from "graphQL/useQueryESFilterList";
import { UPSERT_CAMPAIGN_DESCRIPTORS } from "graphQL/useMutationCampaign";
import "components/Shared/Tagger.css";

export default function CampaignNameField(props) {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState([]);

  const [getCampaignFilters, { data: campaignfiltersData }] = useLazyQuery(GET_ES_FILTER_LIST, { fetchPolicy: "no-cache" });
  const [upsertCampaignDescriptors] = useMutation(UPSERT_CAMPAIGN_DESCRIPTORS);

  useEffect(() => {
    if (campaignfiltersData?.getESFilterList?.hits) {
      const allFiltersData = campaignfiltersData.getESFilterList.hits.map((hit) => hit.key);
      setOptions(allFiltersData.filter((d) => d));
    }
  }, [campaignfiltersData]);

  useEffect(() => {
    const campaignName = props.value ? typeof props.value === "string" ? [props.value] : props.value : [];
    setInputValue(campaignName);
  }, [props.value]);

  useEffect(() => {
    getCampaignFilters({
      variables: {
        esIndex: "campaigns_flat",
        filterKey: "name.keyword",
        size: 50,
      },
    });
  }, [getCampaignFilters]);

  const handleChange = (values, reason) => {
    let campaign, payload = {
      relatedObjectType: props.targetLabel,
      relatedObject: props.targetLabelId,
      isDeleted: false
    };
    if (reason === 'select-option') {
      campaign = campaignfiltersData.getESFilterList.hits.find(hit => hit.key === values[values.length - 1]);
      if (campaign) {
        payload.descriptorObject = campaign.original.hits.hits[0]._id;
      }
    } else {
      const deletedCampaign = campaignfiltersData.getESFilterList.hits.find(hit => hit.key === inputValue.find(v => !values.includes(v)));
      if (deletedCampaign) {
        payload.descriptorObject = deletedCampaign.original.hits.hits[0]._id;
      }
      payload.isDeleted = true;
    }
    props.onChange(values, payload.descriptorObject);
    if (payload.relatedObject)
      upsertCampaignDescriptors({
        variables: {
          descriptors: [payload]
        }
      });
    setInputValue(values);
  };

  return (
    <Autocomplete
      id="tags-outlined"
      onChange={(e, newValue, reason) => handleChange(newValue, reason)}
      options={options}
      value={inputValue}
      multiple
      renderInput={(params) => (
        <TextField
          {...params}
          variant={"standard"}
          fullWidth
          InputProps={{
            ...params.InputProps,
          }}
        />
      )}
    />
  );
}

CampaignNameField.defaultProps = {
  type: "textfield",
};
