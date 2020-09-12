import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import PropTypes from "prop-types";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme, makeStyles } from "@material-ui/core/styles";
import { VariableSizeList } from "react-window";
import { Typography } from "@material-ui/core";
import { Grid } from "@material-ui/core";

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

function renderRow(props) {
  const { data, index, style } = props;
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

function useResetCache(data) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}

// Adapter for react-window
const ListboxComponent = React.forwardRef(function ListboxComponent(
  props,
  ref
) {
  const { children, ...other } = props;
  const itemData = React.Children.toArray(children);
  const theme = useTheme();
  //   const smUp = useMediaQuery(theme.breakpoints.up("sm"), { noSsr: true });
  const itemCount = itemData.length;
  //   const itemSize = smUp ? 36 : 48;
  const itemSize = 65;

  const getHeight = () => {
    if (itemCount > 4) {
      return 4 * itemSize;
    }
    return itemCount * itemSize;
  };

  const gridRef = useResetCache(itemCount);

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
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

const useStyles = makeStyles({
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
  } = props;
  const classes = useStyles();
  //   const [nameAutValue, setNameAutValue] = useState(null);
  //   const [nameAutInputValue, setNameAutInputValue] = useState("");
  //   const [mongoEntitiesArray, setMongoEntitiesArray] = useState([]);

  useEffect(() => {
    if (nameAutInputValue && nameAutInputValue !== "") {
      setMongoEntitiesArray((eArray) => [
        {
          _id: "newEntity",
          name: `Add "${nameAutInputValue}"`,
          inputValue: nameAutInputValue,
        },
        ...eArray.filter((entity) => entity._id !== "newEntity"),
      ]);
    } else {
      setMongoEntitiesArray((eArray) => [
        ...eArray.filter((entity) => entity._id !== "newEntity"),
      ]);
    }
  }, [nameAutInputValue]);

  return (
    <Autocomplete
      getOptionLabel={(option) => option.name}
      getOptionSelected={(option) => option.name}
      value={nameAutValue}
      onChange={(event, newValue) => {
        setNameAutInputValue("");

        if (newValue && newValue._id) {
          if (newValue._id !== "newEntity") setNameAutValue(newValue);
          else
            setNameAutValue({
              _id: "newEntity",
              name: newValue.inputValue,
            });
        } else setNameAutValue(null);
      }}
      options={mongoEntitiesArray}
      renderInput={(params) => (
        <TextField
          {...params}
          value={nameAutInputValue}
          onChange={(e) => {
            setNameAutInputValue(e.target.value.trim());
          }}
          size="small"
          multiline
          placeholder="E.g. Jacob"
        />
      )}
      disableListWrap
      classes={classes}
      ListboxComponent={ListboxComponent}
      renderOption={(option) => {
        if (option._id === "newEntity")
          return (
            <Typography style={{ color: "blue" }}>{option.name}</Typography>
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

        // return <Typography>{option.name}</Typography>;
      }}
    />
  );
}
