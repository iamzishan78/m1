import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import parse from 'autosuggest-highlight/parse';
import throttle from 'lodash/throttle';
import { AppContext } from "../../../AppContext";

function loadScript(src, position, id) {
  if (!position) {
    return;
  }

  const script = document.createElement('script');
  script.setAttribute('async', '');
  script.setAttribute('id', id);
  script.src = src;
  position.appendChild(script);
}

// const autocompleteService = { current: null };

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
}));

export default function Search() {
  const classes = useStyles();
  const [stateApp, setStateApp] = React.useContext(AppContext);
  const [value, setValue] = React.useState(null);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);
  const loaded = React.useRef(false);

//   if (typeof window !== 'undefined' && !loaded.current) {
//     if (!document.querySelector('#google-maps')) {
//       loadScript(
//         'https://maps.googleapis.com/maps/api/js?key=AIzaSyBwRp1e12ec1vOTtGiA4fcCt2sCUS78UYc&libraries=places',
//         document.querySelector('head'),
//         'google-maps',
//       );
//     }

//     loaded.current = true;
//   }

  const callWellSearch = React.useMemo(
    () =>
      throttle((request, callback) => {
        // autocompleteService.current.getPlacePredictions(request, callback);

        const endpoint = 'https://m1neral-search.search.windows.net/indexes/wellheader-index/docs?api-version=2019-05-06&$count=true&searchFields=WellName,ApiNumber&$top=5&search=' + request.input;
                    
        const headers = new Headers();
        headers.append('Content-Type', 'application/json')
        headers.append('api-key', 'C7D8ADB027CCBA30133479D51D669526');
    
        const options = {
        method: 'GET',
        headers: headers
        };
    
        console.log("request made to wellheader-index search at: " + new Date().toString());

        fetch(endpoint, options)
            .then((response) => response.json())
            .then((response) => {
                console.log(response);
                callback(response);
            })
            .catch((error) => {
                console.log(error);
            })
      }, 200),
    [],
  );

  const callOwnerSearch = React.useMemo(
    () =>
      throttle((request, callback) => {
        // autocompleteService.current.getPlacePredictions(request, callback);

        const endpoint = 'https://m1search.search.windows.net/indexes/lod2019-index/docs?api-version=2019-05-06&%24count=true&searchFields=OwnerName%2CAddress1&%24top=5&search=' + request.input;
                    
        const headers = new Headers();
        headers.append('Content-Type', 'application/json')
        headers.append('api-key', '1AE3C6346B38CEB007191D51CFDDFF65');
    
        const options = {
        method: 'GET',
        headers: headers
        };
    
        console.log("request made to lod2019-index search at: " + new Date().toString());

        fetch(endpoint, options)
            .then((response) => response.json())
            .then((response) => {
                console.log(response);
                callback(response);
            })
            .catch((error) => {
                console.log(error);
            })
      }, 200),
    [],
  );

  React.useEffect(() => {
    let active = true;

    // if (!autocompleteService.current && window.google) {
    //   autocompleteService.current = new window.google.maps.places.AutocompleteService();
    // }
    // if (!autocompleteService.current) {
    //   return undefined;
    // }

    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }

    (async () => {
      let newOptions = [];

      Promise.all([
        callWellSearch({ input: inputValue }, (results) => {
          if (active) {

            if (value) {
              newOptions = [value];
            }

            if (results) {
              const indexSource = results["@odata.context"].substring(results["@odata.context"].indexOf("('") + 2, results["@odata.context"].indexOf("')"));
              console.log(indexSource);
              newOptions = [...newOptions, ...results.value.map(result=> ({ ...result, Source: indexSource, Primary: result.WellName, Secondary: result.ApiNumber }))];
            }

            setOptions(newOptions);
          }
        }),
        callOwnerSearch({ input: inputValue }, (results) => {
          if (active) {

            if (value) {
              newOptions = [value];
            }

            if (results) {
              const indexSource = results["@odata.context"].substring(results["@odata.context"].indexOf("('") + 2, results["@odata.context"].indexOf("')"));
              console.log(indexSource);
              newOptions = [...newOptions, ...results.value.map(result=> ({ ...result, Source: indexSource, Primary: result.OwnerName, 
                Secondary: `${result.Address1}\n${result.Address2}\n${result.City}\n${result.State}\n${result.Zip}` }))];
            }

            setOptions(newOptions);
          }
        })
      ])
    })();

    return () => {
      active = false;
    };
  }, [value, inputValue, callWellSearch, callOwnerSearch]);

  return (
    <Autocomplete
      id="google-map-demo"
    //   style={{ width: 300 }}
      getOptionLabel={(option) => option.Primary}
      filterOptions={(x) => x}
      options={options}
      groupBy={(option) => option.Source}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      onChange={(event, newValue) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);

        setStateApp((stateApp) => ({
          ...stateApp,
          popupOpen: false,
          selectedWell: null,
          selectedWellId: newValue ? newValue.Id.toLowerCase() : null,
          flyTo: newValue ? {longitude: newValue.Longitude, latitude: newValue.Latitude} : null,
        }));
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField {...params} label="Add a location" variant="outlined" fullWidth />
      )}
      renderOption={(option) => {
        const matches = option.WellName;
        const parts = parse(
          option.Primary,
          Array(),
        );

        return (
          <Grid container alignItems="center">
            <Grid item>
              <LocationOnIcon className={classes.icon} />
            </Grid>
            <Grid item xs>
              {parts.map((part, index) => (
                <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                  {part.text}
                </span>
              ))}

              <Typography variant="body2" color="textSecondary">
                {option.Secondary}
              </Typography>
            </Grid>
          </Grid>
        );
      }}
    />
  );
}
