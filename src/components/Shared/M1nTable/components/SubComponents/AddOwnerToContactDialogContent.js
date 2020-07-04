import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import parse from "autosuggest-highlight/parse";
import throttle from "lodash/throttle";
import { useMutation } from "@apollo/react-hooks";
import { CircularProgress } from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import { ADDREMOVEOWNERTOACONTACT } from "../../../../../graphQL/useMutationAddRemoveOwnerToAContact";
import { AppContext } from "../../../../../AppContext";

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    width: "400px",
    overflowY: "hidden",
  },
  dialogTitle: {
    paddingBottom: "16px",
  },
}));

export default function AddOwnerToContactDialogContent(props) {
  const classes = useStyles();
  const [stateApp, setStateApp] = React.useContext(AppContext);
  const [value, setValue] = React.useState(null);
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState([]);
  const [loadingOwners, setLoadingOwners] = React.useState(false);

  const [addRemoveOwnerToAContact] = useMutation(ADDREMOVEOWNERTOACONTACT);

  const callOwnerSearch = React.useMemo(
    () =>
      throttle((request, top, callback) => {
        const endpoint =
          "https://m1search.search.windows.net/indexes/lod2019-index/docs?api-version=2019-05-06&%24count=true&searchFields=OwnerName%2CAddress1&%24top=" +
          top +
          "&search=" +
          request.input;

        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("api-key", "1AE3C6346B38CEB007191D51CFDDFF65");

        const options = {
          method: "GET",
          headers: headers,
        };

        fetch(endpoint, options)
          .then((response) => response.json())
          .then((response) => {
            callback(response);
          })
          .catch((error) => {
            console.log(error);
          });
      }, 200),
    []
  );

  React.useEffect(() => {
    if (inputValue === "") {
      return undefined;
    }

    (async () => {
      let newOptions = [];

      Promise.all([
        callOwnerSearch({ input: inputValue }, 20, (results) => {
          if (results) {
            const indexSource = results["@odata.context"].substring(
              results["@odata.context"].indexOf("('") + 2,
              results["@odata.context"].indexOf("')")
            );
            newOptions = [
              ...results.value.map((result) => {
                return {
                  ...result,
                  Source: indexSource,
                  Primary: result.OwnerName,
                  Secondary: `${result.Address1}\n${result.Address2}\n${result.City}\n${result.State}\n${result.Zip}`,
                };
              }),
              ...newOptions,
            ];
          }

          setOptions(
            newOptions.filter(
              (owner) => props.existingOwners.indexOf(owner.Id) === -1
            )
          );
          setLoadingOwners(false);
        }),
      ]);
    })();
  }, [inputValue, callOwnerSearch]);

  const handleClickAdd = () => {
    if (value && value.Id) {
      addRemoveOwnerToAContact({
        variables: {
          contactId: props.parent,
          ownerId: value.Id,
        },
        refetchQueries: [
          "getContacts",
          "getContactsByOwnerId",
          "getContactsCounter",
          "getContact",
          "getContactInM1nTable",
        ],
        awaitRefetchQueries: true,
      });
      props.onClose();
      setStateApp((state) => ({ ...state, universalCircularLoaderAct: true }));
    }
  };

  const handleChange = (newValue) => {
    if (
      !value ||
      (newValue &&
        (value.Id !== newValue.Id ||
          value.Source !== newValue.Source ||
          value.Primary !== newValue.Primary ||
          value.Secondary !== newValue.Secondary))
    ) {
      setValue(newValue);
    }
  };

  //// adding loader ////
  const loader = {
    Source: "loader",
    Score: 0,
    Id: "0",
    Primary: "",
    Secondary: "",
  };
  let optionsWithLoader = options;
  if (loadingOwners) {
    optionsWithLoader = [loader];
  }
  if (value) {
    optionsWithLoader = [...optionsWithLoader, value];
  }
  const searchAutocomplete = (
    <Autocomplete
      id="add-owner-to-contact-autocomplete"
      getOptionLabel={(option, value) =>
        option && option.Primary ? option.Primary : option ? option : ""
      }
      forcePopupIcon
      filterOptions={(x) => x}
      options={optionsWithLoader}
      groupBy={(option) => {
        if (option.Source === "lod2019-index") return "Owners";
        if (option.Source === "loader") return "loader";
        return "textField text";
      }}
      renderGroup={(option) => {
        if (option.group === "loader")
          return (
            <CircularProgress
              key="loader"
              style={{ margin: "10px 0 0 48%" }}
              size={28}
              color="secondary"
            />
          );
        if (option.group === "Owners")
          return (
            <Grid key={option.group} container item>
              <Grid item xs={12}>
                {option.children}
              </Grid>
            </Grid>
          );
      }}
      autoComplete
      includeInputInList
      value={value}
      onChange={(event, newValue) => {
        handleChange(newValue);
      }}
      onInputChange={(event, newInputValue, reason) => {
        if (reason == "input") {
          setInputValue(newInputValue);

          if (newInputValue !== "") {
            setValue(newInputValue);
            setLoadingOwners(true);
          } else {
            setOptions([]);
            setValue(null);
            setLoadingOwners(false);
          }
        }
        if (reason == "clear") {
          setInputValue("");
          setOptions([]);
          setValue(null);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search by owner name or address"
          variant="outlined"
        />
      )}
      renderOption={(option) => {
        if (option.group === "loader") {
          console.log("rrrrrrrrr", option); /////////////////////////////////////////
          return null;
        }

        if (option.Source === "lod2019-index") {
          const parts = parse(option.Primary, Array());
          return (
            <Grid container spacing={0}>
              <Grid container item xs={12} alignItems="center">
                <Grid item xs>
                  {parts.map((part, index) => (
                    <span
                      key={index}
                      style={{ fontWeight: part.highlight ? 700 : 400 }}
                    >
                      {part.text}
                    </span>
                  ))}

                  {option && option.Secondary && (
                    <Typography variant="body2" color="textSecondary">
                      {option.Secondary}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Grid>
          );
        }
        return null; //////////////////////////////////
      }}
    />
  );

  return (
    <React.Fragment>
      <DialogTitle
        id="alert-dialog-slide-title"
        className={classes.dialogTitle}
      >
        Add an Owner
      </DialogTitle>
      <DialogContent dividers className={classes.dialogContent}>
        {searchAutocomplete}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            props.onClose();
          }}
          color="primary"
        >
          Cancel
        </Button>
        <Button
          disabled={!value || (value && !value.Id)}
          onClick={handleClickAdd}
          color="secondary"
        >
          Add
        </Button>
      </DialogActions>
    </React.Fragment>
  );
}
