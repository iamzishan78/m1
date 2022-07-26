import React, { useState, useEffect } from "react";
import { CircularProgress } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { useLazyQuery } from "@apollo/client";

import { GET_ES_FILTER_LIST } from "graphQL/useQueryESFilterList";
import "components/Shared/Tagger.css";


export default function CampaignNameField(props) {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const [getCampaignFilters, { data: campaignfiltersData, loading }] = useLazyQuery(GET_ES_FILTER_LIST, { fetchPolicy: "no-cache" });

  useEffect(() => {
    if (campaignfiltersData?.getESFilterList?.hits) {
      const allFiltersData = campaignfiltersData.getESFilterList.hits.map((hit) => hit.key);
      setOptions(allFiltersData.filter((d) => d));
    }
  }, [campaignfiltersData]);

  useEffect(() => {
    const campaignName = typeof props.value === "string" ? props.value : props.value[0];
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

  const handleChange = (value) => {
    props.onChange(value);
  };

  return (
    <>
      {!loading ? (
        <Autocomplete
          id="tags-outlined"
          onChange={(e, newValue) => {
            handleChange(newValue);
          }}
          options={options}
          // freeSolo
          value={inputValue}
          renderInput={(params) => (
            <TextField
              {...params}
              variant={"standard"}
              fullWidth
              onChange={(e) => setInputValue(e.target.value)}
              InputProps={{
                ...params.InputProps,
              }}
            />
          )}
        />
      ) : (
        <CircularProgress color="secondary" />
      )}
    </>
  );
}

CampaignNameField.defaultProps = {
  type: "textfield",
};
