import React, { useState, useEffect, memo, useMemo } from "react";
import { useLazyQuery } from '@apollo/client';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { GET_ES_SIMPLE_SEARCH } from "graphQL/useQueryESSimpleSearch";
import get from "lodash/get";
import { TextField, CircularProgress } from "@material-ui/core";

const RelationshipTypeOptions = [
  'Child',
  'Cousin',
  'Parent',
  'Spouse'
]

function RelatedContact({ setFieldKey }) {
  const [getESSearch, { data: esFilter, loading }] = useLazyQuery(GET_ES_SIMPLE_SEARCH, {
    fetchPolicy: "no-cache",
  });

  const [descriptorObject, setDescriptorObject] = useState();
  const [relationshipType, setRelationshipType] = useState();


  const getContacts = (search = "") => {
    getESSearch({
      variables: {
        index: "contacts_flat",
        pagination: {
          first: 25,
          after: null
        },
        search: {
          query: search ? `*${search}*` : null,
          fields: [
            "name^4",
            "_id",
          ]
        },
        sort: {
          field: "lastUpdateAt",
          order: "desc",
          unmapped_type: "date"
        },
        filters: []
      }
    });
  }

  useEffect(() => {
    getContacts()
  }, [])

  const onInputChange = (_, value) => {
    getContacts(value);
  }


  useEffect(() => {
    if (descriptorObject && relationshipType) {
      setFieldKey({
        descriptorObject,
        relationshipType
      });
    } else {
      setFieldKey(false);
    }
  }, [descriptorObject, relationshipType]);

  const formattedContactOptions = useMemo(() => {
    const options = get(esFilter, "getESSimpleSearch.hits", []).map(option => ({
      value: option._id,
      name: option.name,
      fullObject: option
    }))

    return options;
  }, [esFilter, loading])

  return (
    <div>
      <div style={{ marginTop: '20px' }}>
        <Autocomplete
          id="search-contacts"
          data-testid={"contact-search-drop-down"}
          getOptionSelected={(option, value) => option.name === value.name}
          getOptionLabel={(option) => option.name}
          options={formattedContactOptions}
          loading={loading}
          value={descriptorObject}
          onInputChange={onInputChange}
          onChange={(_, newValue) => {
            setDescriptorObject(newValue)
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              data-testid={"contact-search-text-field"}
              label="Search Contact"
              variant="outlined"
              size="small"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
        />
      </div>

      <div style={{ marginTop: '30px' }}>
        <Autocomplete
          id="combo-box-demo 1"
          data-testid={"relation-ship-drop-down"}
          options={RelationshipTypeOptions}
          onChange={(e, newValue) => {
            setRelationshipType(newValue);
          }}
          value={relationshipType}
          renderInput={params => (
            <TextField {...params}
              data-testid={"relation-ship-text-field"}
              size="small"
              variant="outlined"
              placeholder="Select Relation"
            />
          )}
        />

      </div>
    </ div>
  )
}

export default memo(RelatedContact)