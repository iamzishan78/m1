import React, { useEffect, useCallback, useState, useMemo } from "react";

import TextField from "@material-ui/core/TextField";
import { Controller } from "react-hook-form";
import { US_STATES_CODES } from "utils/data";
import AutoCompleteShapeLayer from "components/Shared/Forms/Fields/AutoCompleteShapeLayer";
import { AutoCompleteLandgrid } from "components/Shared/Forms/Fields/AutoCompleteLandgrid";
import { upperFirst } from "lodash";
import { GET_AUTOCOMPLETE_LIST } from "graphQL/useQueryGetAutoCompleteList";
import { useLazyQuery } from "@apollo/client";
import AutoCompleteWithNewOption from "components/Shared/Forms/Fields/AutoCompleteWithNewOption";

function TractForm({ isNewTract, tract, tractValue, setSelectedShapeLayer, control, prefix = "" }) {
  const [stateName, setStateName] = useState(tract.state);

  const [getautoCompleteListBasin, { data: dataAutoCompleteListBasin = [] }] = useLazyQuery(GET_AUTOCOMPLETE_LIST);
  const [getautoCompleteListField, { data: dataAutoCompleteListField = [] }] = useLazyQuery(GET_AUTOCOMPLETE_LIST);

  useEffect(() => {
    if (tract.state && tract.state !== stateName) setStateName(tract.state);
  }, [tract.state]);

  useEffect(() => {
    getautoCompleteListBasin({ variables: { type: "AgreementShapeOwner", data: { key: "basin", inTract: true } } });
    getautoCompleteListField({ variables: { type: "AgreementShapeOwner", data: { key: "field", inTract: true } } });
  }, []);

  const getDependencies = useCallback(
    (deps) => {
      const county = tract.county
        ?.toLowerCase()
        .split(" ")
        .reduce((county, current) => county + " " + upperFirst(current), "");
      const dependency = {
        state: { field: "level1Name.keyword", value: US_STATES_CODES[stateName] },
        county: { field: "level2Name.keyword", value: county?.trim() },
        survey: { field: "level3Name.keyword", value: tract.survey },
        meridian: { field: "level3Name.keyword", value: tract.meridian },
        block: { field: "level4Name.keyword", value: tract.block },
        section: { field: "level5Name.keyword", value: tract.section },
        townshipRange: { field: "level5Name.keyword", value: tract.township && tract.range ? `${tract.township} ${tract.range}` : "" },
        abstract: { field: "level6Name.keyword", value: tract.abstract },
        sectionNTX: { field: "level6Name.keyword", value: tract.section },
      };
      const dependencies = [];
      deps?.forEach((dep) => {
        if (dependency[dep].value) dependencies.push(dependency[dep]);
      });
      return dependencies;
    },
    [tract, stateName]
  );

  const autoCompleteListBasin = React.useMemo(
    () => dataAutoCompleteListBasin?.autoCompleteList || [],
    [dataAutoCompleteListBasin?.autoCompleteList]
  );
  const autoCompleteListField = React.useMemo(
    () => dataAutoCompleteListField?.autoCompleteList || [],
    [dataAutoCompleteListField?.autoCompleteList]
  );

  const filters = useMemo(() => {
    return {
      'state': { "field": "level1Type.keyword", "value": "State" },
      'county': [{ "field": "level2Type.keyword", "value": "County" }, ...getDependencies(['state'])],
      'meridian': [
        { "field": "level3Type.keyword", "value": "Meridian" },
        ...getDependencies(['state', 'county'])
      ],
      'township': [
        { "field": "level5Type.keyword", "value": "TownshipRange" },
        ...getDependencies(['state', 'county', 'meridian'])
      ],
      'range': [
        { "field": "level5Type.keyword", "value": "TownshipRange" },
        ...getDependencies(['state', 'county', 'meridian'])
      ],

      'section': [
        { "field": "level6Type.keyword", "value": "Section" },
        ...getDependencies(['state', 'county', 'meridian', 'townshipRange'])
      ],
      'survey': [
        { "field": "level3Type.keyword", "value": "Survey" },
        ...getDependencies(['state', 'county'])
      ],
      'block': [
        { "field": "level4Type.keyword", "value": "Block" },
        ...getDependencies(['state', 'county', 'survey'])
      ],
      'sectiontx': [
        { "field": "level5Type.keyword", "value": "Section" },
        ...getDependencies(['state', 'county', 'survey', 'block'])
      ],

      'abstract': [
        { "field": "level6Type.keyword", "value": "Abstract" },
        ...getDependencies(['state', 'county', 'survey', 'block', 'section'])
      ]
    }
  }, [tract.state, tract.county, tract.township, tract.range, tract.section, tract.survey, tract.block, tract.sectiontx, tract.abstract])

  return (
    <>
      {!isNewTract && <AutoCompleteShapeLayer value={tractValue} shapeType="parcel" setSelectedShapeLayer={setSelectedShapeLayer} />}
      <Controller
        as={TextField}
        id="tractName"
        style={{ display: isNewTract ? "inherit" : "none" }}
        control={control}
        variant="outlined"
        margin="dense"
        name="tract.tractName"
        label={"Tract Name"}
        InputLabelProps={{ shrink: true }}
        fullWidth
        defaultValue={tract?.tractName || ""}
      />
      <Controller
        control={control}
        name={`${prefix}state`}
        defaultValue={tract?.state || ""}
        render={(props) => (
          <AutoCompleteLandgrid
            {...props}
            value={props.value}
            filterKey="level1Name.keyword"
            filters={{ field: "level1Type.keyword", value: "State" }}
            label="State"
            variant="outlined"
            onChange={(value) => {
              props.onChange(value.key);
              setStateName(value.key);
            }}
            autoFocus={false}
          />
        )}
      />

      <Controller
        control={control}
        name={`${prefix}county`}
        id="tractCounty"
        defaultValue={tract?.county || ""}
        render={(props) => (
          <AutoCompleteLandgrid
            value={props.value}
            filterKey="level2Name.keyword"
            filters={[{ field: "level2Type.keyword", value: "County" }, ...getDependencies(["state"])]}
            label="County"
            variant="outlined"
            onChange={(value) => {
              props.onChange(value.key);
            }}
            autoFocus={false}
          />
        )}
      />

      <Controller
        control={control}
        name={`${prefix}basin`}
        defaultValue={tract?.basin || ""}
        render={({ onChange, value, ref }) => (
          <AutoCompleteWithNewOption
            margin="dense"
            label="Basin"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            options={autoCompleteListBasin}
            value={value}
            onChange={(_, value) => {
              onChange(value?.name ?? "");
            }}
          />
        )}
      />

      <Controller
        control={control}
        name={`${prefix}field`}
        defaultValue={tract?.field || ""}
        render={({ onChange, value, ref }) => (
          <AutoCompleteWithNewOption
            margin="dense"
            label="Field"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            options={autoCompleteListField}
            value={value}
            onChange={(_, value) => {
              onChange(value?.name ?? "");
            }}
          />
        )}
      />

      {!["TX", "Texas"].includes(stateName) && (
        <>
          <Controller
            control={control}
            name={`${prefix}meridian`}
            defaultValue={tract?.meridian || ""}
            render={(props) => (
              <AutoCompleteLandgrid
                value={props.value}
                filterKey="level3Name.keyword"
                filters={[{ field: "level3Type.keyword", value: "Meridian" }, ...getDependencies(["state", "county"])]}
                label="Meridian"
                variant="outlined"
                onChange={(value) => {
                  props.onChange(value.key);
                }}
                autoFocus={false}
              />
            )}
          />

          <Controller
            control={control}
            name={`${prefix}township`}
            defaultValue={tract?.township || ""}
            render={(props) => (
              <AutoCompleteLandgrid
                value={props.value}
                filterKey="level5Name.keyword"
                filters={[{ field: "level5Type.keyword", value: "TownshipRange" }, ...getDependencies(["state", "county", "meridian"])]}
                label="Township"
                variant="outlined"
                onChange={(value) => {
                  props.onChange(value.key);
                }}
                autoFocus={false}
              />
            )}
          />

          <Controller
            control={control}
            name={`${prefix}range`}
            defaultValue={tract?.range || ""}
            render={(props) => (
              <AutoCompleteLandgrid
                value={props.value}
                filterKey="level5Name.keyword"
                compoundValue={tract.township}
                filters={[{ field: "level5Type.keyword", value: "TownshipRange" }, ...getDependencies(["state", "county", "meridian"])]}
                label="Range"
                variant="outlined"
                onChange={(value) => {
                  props.onChange(value.key);
                }}
                autoFocus={false}
              />
            )}
          />

          <Controller
            control={control}
            name={`${prefix}section`}
            defaultValue={tract?.section || ""}
            render={(props) => (
              <AutoCompleteLandgrid
                value={props.value}
                filterKey="level6Name.keyword"
                filters={[
                  { field: "level6Type.keyword", value: "Section" },
                  ...getDependencies(["state", "county", "meridian", "townshipRange"]),
                ]}
                label="Section"
                variant="outlined"
                onChange={(value) => {
                  props.onChange(value.key);
                }}
                autoFocus={false}
              />
            )}
          />
        </>
      )}

      {["TX", "Texas"].includes(stateName) && (
        <>
          <Controller
            control={control}
            name={`${prefix}survey`}
            defaultValue={tract?.survey || ""}
            render={(props) => (
              <AutoCompleteLandgrid
                value={props.value}
                filterKey="level3Name.keyword"
                filters={[{ field: "level3Type.keyword", value: "Survey" }, ...getDependencies(["state", "county"])]}
                label="Survey"
                variant="outlined"
                onChange={(value) => {
                  props.onChange(value.key);
                }}
                autoFocus={false}
              />
            )}
          />

          <Controller
            control={control}
            name={`${prefix}block`}
            defaultValue={tract?.block || ""}
            render={(props) => (
              <AutoCompleteLandgrid
                value={props.value}
                filterKey="level4Name.keyword"
                filters={[{ field: "level4Type.keyword", value: "Block" }, ...getDependencies(["state", "county", "survey"])]}
                label="Block"
                variant="outlined"
                onChange={(value) => {
                  props.onChange(value.key);
                }}
                autoFocus={false}
              />
            )}
          />

          <Controller
            control={control}
            name={`${prefix}section`}
            defaultValue={tract?.section || ""}
            render={(props) => (
              <AutoCompleteLandgrid
                value={props.value}
                filterKey="level5Name.keyword"
                filters={[{ field: "level5Type.keyword", value: "Section" }, ...getDependencies(["state", "county", "survey", "block"])]}
                label="Section"
                variant="outlined"
                onChange={(value) => {
                  props.onChange(value.key);
                }}
                autoFocus={false}
              />
            )}
          />

          <Controller
            control={control}
            id="tractAbstract"
            name={`${prefix}abstract`}
            defaultValue={tract?.abstract || ""}
            render={(props) => (
              <AutoCompleteLandgrid
                value={props.value}
                filterKey="level6Name.keyword"
                filters={[
                  { field: "level6Type.keyword", value: "Abstract" },
                  ...getDependencies(["state", "county", "survey", "block", "section"]),
                ]}
                label="Abstract"
                variant="outlined"
                onChange={(value) => {
                  props.onChange(value.key);
                }}
                autoFocus={false}
              />
            )}
          />
        </>
      )}

      <Controller
        as={TextField}
        id="tractDescription"
        control={control}
        variant="outlined"
        margin="dense"
        name={`${prefix}legalDescription`}
        label={"Tract Legal Description"}
        InputLabelProps={{ shrink: true }}
        multiline
        rows={4}
        fullWidth
        defaultValue={tract?.legalDescription || ""}
      />
    </>
  );
}

export default TractForm;
