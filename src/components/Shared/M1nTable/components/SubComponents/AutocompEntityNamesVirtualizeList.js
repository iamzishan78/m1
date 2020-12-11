import React, { useRef, useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import Autocomplete from "@material-ui/lab/Autocomplete";
import PropTypes from "prop-types";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme, makeStyles } from "@material-ui/core/styles";
import { FixedSizeList, VariableSizeList } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { Typography } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import debounce from "lodash/debounce";

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
const joinAddress = (row) => {
  let rowData = {
    address1: row.address1,
    address2: row.address2,
    city: row.city,
    state: row.state,
    zip: row.zip,
    country: row.country,
  };
  let textArray = [];
  for (const key in rowData) {
    if (rowData.hasOwnProperty(key) && rowData[key] && rowData[key] !== "") {
      if (key === "zip" || key === "country") {
        textArray = [
          [textArray.join(", "), capitalizeFirstLetter(rowData[key])].join(" "),
        ];
      } else textArray.push(capitalizeFirstLetter(rowData[key]));
    }
  }

  return textArray.join(", ");
};

const LISTBOX_PADDING = 8; // px

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

// Adapter for react-window
const ListboxComponent = React.forwardRef(function ListboxComponent(
  props,
  ref
) {
  const {
    children,
    isItemLoaded,
    loadMoreItems,
    itemCount,
    isNextPageLoading,
    nameAutInputValue,
    ...other
  } = props;

  const itemData = React.Children.toArray(children);
  const theme = useTheme();
  // const smUp = useMediaQuery(theme.breakpoints.up("sm"), { noSsr: true });
  // const itemCount = /*hasNextPage ? itemData.length + 1 : */itemData.length;
  // const itemSize = smUp ? 36 : 48;
  const itemSize = 65;

  const getChildSize = (child) => {
    // if (React.isValidElement(child) && child.type === ListSubheader) {
    //   return 48;
    // }

    return itemSize;
  };

  const getHeight = () => {
    if (itemCount > 4) {
      return 4 * itemSize;
    }
    return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
  };

  const renderRow = (props) => {
    const { data, index, style } = props;

    if (!isItemLoaded(index)) {
      // TODO - improve loading state
      return null;
      // return <li style={style}>Loading...</li>;
    }

    if (!data[index]) {
      // eslint-disable-next-line
      console.log("isLoaded but no data", { data, index });
      return null;
    }

    return React.cloneElement(data[index], {
      style: {
        ...style,
        top: style.top + LISTBOX_PADDING,
      },
    });
  };

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <InfiniteLoader
          isItemLoaded={isItemLoaded}
          itemCount={itemCount}
          loadMoreItems={loadMoreItems}
          minimumBatchSize={25}
        >
          {({ onItemsRendered, ref: refList }) => (
            <VariableSizeList
              ref={refList}
              itemData={itemData}
              height={getHeight() + 2 * LISTBOX_PADDING}
              width="100%"
              outerElementType={OuterElementType}
              innerElementType="ul"
              itemSize={() => itemSize}
              overscanCount={5}
              itemCount={itemCount}
              onItemsRendered={onItemsRendered}
            >
              {renderRow}
            </VariableSizeList>
          )}
        </InfiniteLoader>
      </OuterElementContext.Provider>
    </div>
  );
});

ListboxComponent.propTypes = {
  children: PropTypes.node,
};

const useStyles = makeStyles({
  inputRoot: {
    backgroundColor: "#fff",
  },
  listbox: {
    boxSizing: "border-box",
    "& ul": {
      padding: 0,
      margin: 0,
    },
  },
});

export default function AutocompEntityNamesVirtualizeList(props) {
  const {
    mongoEntitiesArray,
    setMongoEntitiesArray,
    nameAutValue,
    setNameAutValue,
    nameAutInputValue,
    setNameAutInputValue,
    variant = "standard",
    label = "",
    placeholder = "",
    hasNextPage,
    isNextPageLoading,
    loadNextPage,
    ...other
  } = props;
  const classes = useStyles();

  const isItemLoaded = (index) => {
    if (!hasNextPage) {
      return true;
    }

    return !!mongoEntitiesArray[index];
  };

  const loadMoreItems = async (startIndex, stopIndex) => {
    if (isNextPageLoading || !hasNextPage) {
      return () => {};
    } else {
      console.log(mongoEntitiesArray[startIndex - 1]);
      return loadNextPage({
        variables: {
          pagination: {
            after: mongoEntitiesArray[startIndex - 1]?._id,
          },
          search: nameAutInputValue,
        },
      });
    }
  };

  const itemCount = mongoEntitiesArray.length + 1;

  const ListboxProps = {
    isItemLoaded,
    loadMoreItems,
    itemCount,
    isNextPageLoading,
    nameAutInputValue,
  };

  const onInputChange = React.useMemo(
    () =>
      debounce((event, value, reason) => {
        console.log("here");
        setNameAutInputValue(value);
      }, 500),
    []
  );

  return (
    <Autocomplete
      defaultValue={nameAutValue}
      value={nameAutValue}
      disableListWrap
      classes={classes}
      ListboxComponent={ListboxComponent}
      ListboxProps={ListboxProps}
      options={mongoEntitiesArray}
      getOptionLabel={(option) => (option?.name ? option?.name : "")}
      getOptionSelected={(option, value) => {
        return option?._id === value?._id;
      }}
      renderOption={(option) => {
        if (option._id === "newEntity")
          return (
            <Typography style={{ color: "midnightblue" }}>
              {option.name}
            </Typography>
          );

        return (
          <Grid container spacing={0}>
            <Grid container item xs={12} alignItems="center">
              <Grid item xs>
                <span style={{ fontWeight: 400 }}>{option.name}</span>

                <Typography variant="body2" color="textSecondary">
                  {joinAddress(option)}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        );
      }}
      onInputChange={onInputChange}
      filterOptions={(options, state) => options}
      onChange={(event, newValue) => {
        if (newValue && newValue._id) {
          if (newValue._id !== "newEntity") setNameAutValue(newValue);
          else
            setNameAutValue({
              _id: "newEntity",
              name: newValue.inputValue,
            });
        } else setNameAutValue(null);
      }}
      renderInput={(params) => (
        <TextField
          margin="dense"
          {...params}
          label={label}
          placeholder={placeholder}
          variant={variant}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isNextPageLoading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          size="small"
          // placeholder="E.g. Jacob"
        />
      )}
      {...other}
    />
  );
}
