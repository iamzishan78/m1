import React, { useContext, useState, useEffect, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {Grid, TextField} from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormControl from "@material-ui/core/FormControl";
import { AppContext } from "AppContext";
import {useLazyQuery} from "@apollo/client";
import {GET_ALL_CUSTOM_DATA_KEYS} from "graphQL/useQueryGetAllCustomKeys";

const useStyles = makeStyles((theme) => ({
  gridItem: {
    display: "flex",
    flexDirection: "column",
  },
  formControl: {
    minWidth: 249,
    color: "black",
    "& .MuiInputBase-root": {
      backgroundColor: "#101d29",
    },
  }
}));

const AutoCompleteDropdown = ({ options, onChange, loading, label, value }) => {
  return (
    <FormControl fullWidth>
      <Autocomplete
        id="combo-box-demo"
        options={options}
        loading={loading}
        onChange={onChange}
        value={value}
        getOptionLabel={(option) => option.label}
        renderInput={(params) => 
          <TextField 
            {...params} 
            label={label}
            variant="outlined"
            fullWidth
          />
        }
      />
    </FormControl>
  );
};
export default function CustomDataFilters(props) {
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [filterList, setFilterList] = useState([[], []]);
  const [selectedKey, setSelectedKey] = useState(null)
  const [selectedValue, setSelectedValue] = useState(null);
  

  const [getCustomKey, { data: customData, loading }] = useLazyQuery(
    GET_ALL_CUSTOM_DATA_KEYS,
    { fetchPolicy: "no-cache" }
  );

  useEffect(()=>{
    getCustomKey();
  },[]);

  useEffect(() => {
    if(selectedKey && selectedValue){
      console.log(stateApp?.landSearchFilters);
        const filterKey = `shapeJson.properties.custom_data.${selectedKey}`;
        const landProvisionsFilters = [...stateApp.landSearchFilters.provisions];
        const _index = landProvisionsFilters.findIndex((f) => f.field.startsWith("shapeJson.properties.custom_data"));
        if (_index === -1 && selectedValue !== null) landProvisionsFilters.push({ field: filterKey, value: selectedValue });
        else if (selectedValue !== null) landProvisionsFilters[_index].value = selectedValue;
        else if (_index !== -1) landProvisionsFilters.splice(_index, 1);


        setStateApp((stateApp) => ({
          ...stateApp,
          landSearchFilters: { ...stateApp.landSearchFilters, provisions: landProvisionsFilters },
        }));
    } else {
      let landProvisionsFilters = [...stateApp.landSearchFilters.provisions];
      const _index = landProvisionsFilters.findIndex((f) => f.field.startsWith("shapeJson.properties.custom_data"));

      if(_index > -1){
        landProvisionsFilters = landProvisionsFilters.filter(f => !f.field.startsWith("shapeJson.properties.custom_data"))
        setStateApp((stateApp) => ({
          ...stateApp,
          landSearchFilters: { ...stateApp.landSearchFilters, provisions: landProvisionsFilters },
        }));
      }
    }
  }, [selectedKey, selectedValue])

  const getKeysOptions = useMemo(() => {
    return Object.keys(_.get(customData, 'getAllKeys', {})).map(key => ({ label: key, value: key }))
  }, [customData])
  
  const getValueOptions = useMemo(() => {
    return (customData?.getAllKeys[selectedKey] || []).map(key => ({ label: key, value: key }))
  }, [customData, selectedKey]);

  const handleKeyChange = (value) => {
    setSelectedKey(value);
    setSelectedValue(null);
  }

  return (
    <Grid container item spacing={2} style={{ padding: "8px", width: "100%", margin: "0" }}>
      <Grid item xs={12}>
        <AutoCompleteDropdown
          onChange={(e, {value}) => handleKeyChange(value)}
          options={getKeysOptions}
          label={"Key"}
          loading={loading}
          value={selectedKey && {label: selectedKey, value: selectedKey}}
        />
      </Grid>
      <Grid item xs={12}>
        <AutoCompleteDropdown
          onChange={(e, {value}) => setSelectedValue(value)}
          options={getValueOptions}
          label={"Value"}
          loading={loading}
          value={selectedKey && {label: selectedValue, value: selectedValue}}
        />
      </Grid>
    </Grid>
  );
}