import React, { useState, useEffect, useContext } from "react";
import moment from "moment";
// QUERIES
import { AppContext } from "AppContext";
import { useLazyQuery } from "@apollo/client";
import uniqBy from "lodash/uniqBy";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { VariableSizeList } from 'react-window';
import PropTypes from 'prop-types';
import { capitalizeFirstLetter, customStartCaseString } from "components/Shared/functions";
import { isArray } from "lodash";

export const AutoCompleteFilter = React.memo(function AutoCompleteFilter({
  filterList,
  onChange,
  index,
  column,
  query,
  extendSearchQuery,
  searchFields,
  esIndex,
  filters,
  custom,
  setFilters,
  multiple,
  isDate,
  ...others
}) {
  const getDefaultSearchValue = () => {
    if (custom?.formatedFilterOptions) {
      const find = custom.formatedFilterOptions.find(op => op.value === filterList[index][0]);

      if (find) return find.label
    }

    return filterList[index][0]
  }

  const getDefaltValue = () => {
    let filterValue = multiple ? filterList[index].map((key) => ({ key })) : { key: filterList[index][0] };

    if (custom?.formatedFilterOptions) {
      filterValue = custom?.formatedFilterOptions.find(f => f.value === filterValue.key) || filterValue;
    }

    return filterValue
  }

  const filterValue = getDefaltValue();
  const [open, setOpen] = useState(false);
  const [, setStateApp] = useContext(AppContext);
  const [options, setOptions] = useState([]);
  const SetOptions = ops => setOptions(ops.filter(op => op.key));
  const [value, setValue] = useState(filterValue);
  const [search, setSearch] = useState(filterList[index][0]);
  const { label, filterKey, type } = column;
  const [getFilters, { data: filtersData, loading }] = useLazyQuery(query, { fetchPolicy: "no-cache" });
  const getFiltersType = query?.definitions?.[0]?.name?.value;

  useEffect(() => {
    const filterVal = filterList[index][0];
    setSearch(isArray(filterVal) ? filterVal[filterVal.length - 1] : filterVal);
    if (!filterVal) {
      setValue(filterValue);
    }
  }, [filterList[index][0]]);

  useEffect(() => {
    if (!custom?.filterOptions) {
      getFiltersAction("");
    } else {
      SetOptions(custom?.filterOptions);
    }
  }, [filters]);

  useEffect(() => {
    if (filtersData) {
      const keys = Object.keys(filtersData);
      if (keys && filtersData[keys[0]] && filtersData[keys[0]]?.hits) {
        if (custom?.isState || custom?.oRFilter) {
          let hits = filtersData[keys[0]].hits.map((hit) => {
            const keys = hit.key_as_string.split('|')
            return ({
              ...hit,
              key: keys[0] || keys[1],
              key_as_string: hit.key_as_string || hit.key,
            })
          });
          hits = uniqBy(hits, "key")
          SetOptions(hits);
        } else if (custom?.isDate) {
          filtersData[keys[0]].hits = filtersData[keys[0]]?.hits.filter((hit) => hit.key);
          const hits = filtersData[keys[0]].hits.map((hit) => ({
            ...hit,
            key: moment(new Date(hit.key)).format("MM/DD/YYYY"),
            key_as_string: hit.key_as_string || hit.key,
          }));
          SetOptions(hits);
          setStateApp((state, props) => {
            return { ...state, filtersData: { ...state.filtersData, [column.name]: hits } };
          });
        } else if (custom?.isDateTime) {
          filtersData[keys[0]].hits = filtersData[keys[0]]?.hits.filter((hit) => hit.key);
          const hits = filtersData[keys[0]].hits.map((hit) => ({
            ...hit,
            key: moment(new Date(hit.key)).format("MM/DD/YYYY HH:mm:ss.SSS"),
            key_as_string: hit.key_as_string || hit.key,
          }));
          SetOptions(hits);
          setStateApp((state, props) => {
            return { ...state, filtersData: { ...state.filtersData, [column.name]: hits } };
          });
        } else if (custom?.toFixed) {
          filtersData[keys[0]].hits = filtersData[keys[0]]?.hits.filter((hit) => hit.key);
          const hits = filtersData[keys[0]].hits.map((hit) => ({ ...hit, key: parseFloat(hit.key.toFixed(custom?.toFixed)) }));
          SetOptions(hits);
        } else if (custom?.formatedFilterOptions) {
          const hits = filtersData[keys[0]].hits;
          for (let i = 0; i < custom.formatedFilterOptions.length; i++) {
            const index = hits.findIndex(
              (h) => h.key === custom.formatedFilterOptions[i].value || h.key_as_string === custom.formatedFilterOptions[i].value
            );
            if (index > -1) {
              hits[index].key = custom.formatedFilterOptions[i].label;
            }
          }
          SetOptions(hits);
          setSearch(getDefaultSearchValue());
        } else {
          SetOptions(filtersData[keys[0]].hits);
        }
      }
    }
  }, [filtersData]);

  const getFiltersAction = (search) => {
    if (filtersData && multiple && filterList[index].length !== 0) return;

    const rawSearch = search;
    if (search) search = type === "number" ? search : `*${search}*`;
    getFilters({
      variables: {
        esIndex,
        index: esIndex,
        filters,
        filterKeys: typeof filterKey !== "string" ? filterKey : undefined,
        filterKey: typeof filterKey === "string" ? filterKey : undefined,
        search,
        ...(getFiltersType === "getESSimpleFilter" && { search: { query: extendSearchQuery, fields: searchFields } }),
        extendSearchQuery,
        size: 10,
        key_as_string: custom?.key_as_string,
        multi_filter_keys: custom?.multi_filter_keys,
        filterAggs: {
          query: rawSearch,
          field: typeof filterKey === "string" ? filterKey : undefined,
          fields: typeof filterKey !== "string" ? filterKey : undefined,
          type: others.aggsType ? others.aggsType : undefined,
          size: 100000,
        },
      },
    });
  };

  return (
    <Autocomplete
      multiple={multiple}
      id={`filter-autocomplete-${custom?.filterLabel || label}`}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      disabled={others.disabled || false}
      disableListWrap
      ListboxComponent={ListboxComponent}
      value={multiple && !value ? [] : value}
      inputValue={customStartCaseString(search?.toString(), isDate)}
      getOptionSelected={(option, value) => option.key === value.key}
      getOptionLabel={(option) => customStartCaseString(capitalizeFirstLetter(option?.key?.toString().replace(/^\,|\,$/gm, "")), isDate)}
      onChange={(e, value2, reason) => {

        if (reason === "clear" || (multiple && value2.length === 0) || (!multiple && !value2?.key)) {
          filterList[index].pop();
          setSearch("");
          setValue(multiple ? [] : {});
        } else {
          if (multiple) {
            filterList[index].length = 0;
            value2.forEach((v) => {
              const val = typeof v.key === "string" ? v.key.replace(/^\,|\,$/gm, "") : v.key;
              filterList[index].push(val);
            });
            // setSearch(value2[value2.length - 1]?.key);
          } else {
            filterList[index][0] = typeof value2.key === "string" ? value2.key.replace(/^\,|\,$/gm, "") : value2.key;
            if (custom?.initialCapitalization) {
              setSearch(capitalizeFirstLetter(value2.key));
            } else {
              setSearch(value2.key);
            }
          }

          setValue(value2);
          if (value2?.esKey) column.activeFilterKey = value2?.esKey;
        }
        if (setFilters) setFilters(filterList);

        column.filterList = filterList[index];

        const filterVal = filterList[index].length > 1 ? [filterList[index]] : filterList[index];

        onChange(filterVal, index, column, value2?.esKey || "");
      }}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          size={others.inputSize ? others.inputSize : undefined}
          variant={others?.variant ? others?.variant : "standard"}
          style={{ background: "white" }}
          label={custom?.filterLabel || label}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            ...params.InputProps,
          }}
        />
      )}
      {...others}
    />
  );
});

// Adapter for react-window
const ListboxComponent = React.forwardRef(function ListboxComponent(props, ref) {
  const { children, ...other } = props;
  const itemData = [];
  children.forEach((item) => {
    itemData.push(item);
    itemData.push(...(item.children || []));
  });

  const itemCount = itemData.length;
  const itemSize = 40;
  const LISTBOX_PADDING = 5; // px

  // const getChildSize = (child) => {
  //   // if (child.hasOwnProperty('group')) {
  //   //   return 48;
  //   // }
  //   return itemSize;
  // };

  const getHeight = () => {
    // adding 10px as padding
    if (itemCount > 8) {
      return (8 * itemSize) + LISTBOX_PADDING;
    }
    // const items = itemData.map(getChildSize).reduce((a, b) => a + b, 0);
    // const height = items * LISTBOX_PADDING
    // return height;
    return (itemData.length * itemSize) + LISTBOX_PADDING;
  };

  function renderRow(props) {
    const { data, index, style } = props;

    if (!data[index]) {
      return null;
    }

    return React.cloneElement(data[index], {
      style: {
        ...style,
        top: style.top + LISTBOX_PADDING,
      },
    });
  }

  const OuterElementContext = React.createContext({});

  const OuterElementType = React.forwardRef((props, ref) => {
    const outerProps = React.useContext(OuterElementContext);
    return <div ref={ref} {...props} {...outerProps} />;
  });

  const useResetCache = (data) => {
    const ref = React.useRef(null);
    React.useEffect(() => {
      if (ref.current != null) {
        ref.current.resetAfterIndex(0, true);
      }
    }, [data]);
    return ref;
  }

  const gridRef = useResetCache(itemCount);

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight()}
          width="100%"
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={() => itemSize}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});

ListboxComponent.propTypes = {
  children: PropTypes.node,
};