import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Typography } from "@material-ui/core";
import CircularProgress from '@material-ui/core/CircularProgress';

import debounce from "lodash/debounce";

// Queries 
// import { GET_ES_PAGINATED_LIST } from "graphQL/useQueryESPaginatedList";
import { GET_ES_SIMPLE_SEARCH } from "graphQL/useQueryESSimpleSearch";
import { useLocation } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    secondaryText: {
        color: "grey",
        fontSize: "15px",
        margin: 0
    },
    alignCenter: {
        textAlign: "center"
    }
}));

function WellSearchApiField(props) {
    //Intials
    const location = useLocation();
    const classes = useStyles();
    const startPaginationAt = 50;
    const [foundWells, setFoundWells] = useState([]);
    const [selectedWell, setSelectedWell] = useState(null);
    const [focused, setFocused] = useState(false);

    // Queries
    // const [getESWellsPaginatedList, { data: constDataWells, loading }] = useLazyQuery(GET_ES_PAGINATED_LIST, { fetchPolicy: "no-cache" });

    const [getESSimpleSearch, { data: constDataWells }] = useLazyQuery(
        GET_ES_SIMPLE_SEARCH,
        { fetchPolicy: "no-cache" }
    );
    // searching wells
    const callWellESSearch = React.useMemo(
        () =>
            debounce((request, callback) => {
                getESSimpleSearch({
                    variables: {
                        index: "platformData:wells",
                        pagination: {
                            first: request.searchTop ? request.searchTop : startPaginationAt,
                            keep_alive: "1micros"
                        },
                        search: {
                            query: request.input,
                            fields: ["wellName", "api"],
                        },
                        sort: [],
                    }
                })
                // getESWellsPaginatedList({
                //     variables: {
                //         // polygon: {},
                //         esIndex: "platformData:wells",
                //         pagination: {
                //             first: startPaginationAt,
                //             keep_alive: "1micros"
                //         },
                //         search: (() => {
                //             let searchString = ""
                //             if (request.input) {
                //               searchString = request.input.replace(/([\!\*\+\&\|\(\)\[\]\{\}\^\~\?\:\"])/g, "\\$1").split(/\s+/)
                //             }

                //             return searchString
                //               ? `(wellName:(${searchString.join('* AND ')}*) OR api:(${searchString.join('* AND ')}*))^2 OR (wellName:(${searchString.join('* ')}*) OR api:(${searchString.join('* ')}*))`
                //               : ""
                //           })(),
                //         sort: [],
                //     }
                // })
            }, 500),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    // setting the wells in set
    useEffect(() => {
        const allESWell = constDataWells?.getESSimpleSearch?.hits
        setFoundWells(allESWell)
    }, [constDataWells])

    // ON change of selected well
    const onChange = (well) => {
        props.getSelectedWell(well);
        setSelectedWell(well);
    }

    useEffect(() => {
        if (location.state?.focusOnWellSearch) {
            setFocused(true);
        }
    }, [location.state]);

    return (
        <FormControl variant="outlined" fullWidth size="small">
            <Autocomplete
                options={foundWells || []}
                onChange={(e, well) => { onChange(well) }}
                value={selectedWell}
                getOptionLabel={(option, value) => option.wellName}
                filterOptions={(x) => x}
                loading
                id="wellSearch"
                loadingText={<div className={classes.alignCenter}><CircularProgress /></div>}
                renderOption={(option) => {
                    return <div >
                        <Typography variant="subtitle1">{option?.wellName}</Typography>
                        <p className={classes.secondaryText}>{option?.ApiNumber}</p>
                    </div>
                }

                }
                renderInput={(params) => (
                    <TextField
                        margin="dense"
                        focused={focused}
                        {...params}
                        required
                        variant="outlined"
                        label="Search for a well by name or API"
                        InputLabelProps={{ shrink: true }}
                        onChange={(event) => { callWellESSearch({ input: event.target.value }, (results) => null); }}
                        onBlur={() => setFocused(false)}
                    />
                )}
            />
        </FormControl>
    );
}

export default WellSearchApiField;
