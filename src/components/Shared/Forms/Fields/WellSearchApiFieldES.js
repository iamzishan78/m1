import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Typography } from "@material-ui/core";
import debounce from "lodash/debounce";

// Queries 
import { GET_ES_PAGINATED_LIST } from "graphQL/useQueryESPaginatedList";

const useStyles = makeStyles((theme) => ({
    secondaryText: {
        color: "grey",
        fontSize: "15px",
        margin: 0
    }
}));

function WellSearchApiField(props) {
    //Intials
    const classes = useStyles();
    const startPaginationAt = 50;
    const [foundWells, setFoundWells] = useState([]);
    const [selectedWell, setSelectedWell] = useState(null);

    // Queries
    const [getESWellsPaginatedList, { data: constDataWells }] = useLazyQuery(GET_ES_PAGINATED_LIST, { fetchPolicy: "no-cache" });

    // searching wells
    const callWellESSearch = React.useMemo(
        () =>
            debounce((request, callback) => {
                getESWellsPaginatedList({
                    variables: {
                        esIndex: "platformData:wells",
                        pagination: {
                            first: startPaginationAt,
                            keep_alive: "1micros"
                        },
                        search: request.input ? `((wellName:*${request.input}*) OR (api:*${request.input}*))` : '',
                        sort: [],
                    }
                })
            }, 500),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    // setting the wells in set
    useEffect(() => {
        const allESWell = constDataWells?.getESPaginatedList?.hits
        setFoundWells(allESWell)
    }, [constDataWells])

    return (
        <FormControl variant="outlined" fullWidth size="small">
            <Autocomplete
                options={foundWells || []}
                onChange={(e, well) => { setSelectedWell(well); }}
                value={selectedWell}
                getOptionLabel={(option, value) => option.wellName}
                filterOptions={(x) => x}
                renderOption={(option) => {
                    return (
                        <div >
                            <Typography variant="subtitle1">{option?.wellName}</Typography>
                            <p className={classes.secondaryText}>{option?.ApiNumber}</p>
                        </div>
                    );
                }}
                renderInput={(params) => (
                    <TextField
                        margin="dense"
                        {...params}
                        required
                        variant="outlined"
                        label="Search for a well by name or API"
                        InputLabelProps={{ shrink: true }}
                        onChange={(event) => { callWellESSearch({ input: event.target.value }, (results) => null); }}
                    />
                )}
            />
        </FormControl>
    );
}

export default WellSearchApiField;
