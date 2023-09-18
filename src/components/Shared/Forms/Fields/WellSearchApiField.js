import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";

import Grid from "@material-ui/core/Grid";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Typography } from "@material-ui/core";
import debounce from "lodash/debounce";
import parse from "autosuggest-highlight/parse";

import { TENANTWELL } from "graphQL/useQueryTenantWell";


const useStyles = makeStyles((theme) => ({
}));

function WellSearchApiField(props) {
    const classes = useStyles();

    const [foundWells, setFoundWells] = useState([]);
    const [selectedWell, setSelectedWell] = useState(null);
    const [valid, setValid] = useState({});

    const [getTenantWell, { data: dataTenantWell }] = useLazyQuery(TENANTWELL, {
        // must be network-only to trigger state change for field updates
        fetchPolicy: "network-only",
    });

    const callWellSearch2 = React.useMemo(
        () =>
            debounce((request, callback) => {
                const endpoint =
                    "https://m1search.search.windows.net/indexes/wellheader-index-m1corev3/docs?api-version=2020-06-30&queryType=full&count=true&%24filter=Latitude%20ne%20null%20and%20Longitude%20ne%20null&searchFields=WellName%2CApiNumber&$top=" +
                    50 +
                    "&search=" +
                    encodeURIComponent(request.input.replace(/\b(?<=\w)(?=\s+)|$(?<=\w)/g, "~"));

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
            }, 500),
        []
    );

    useEffect(()=> {
        callWellSearch2({ input: "" }, (results) => {
            if (results) {
                const indexSource = results["@odata.context"].substring(
                    results["@odata.context"].indexOf("('") + 2,
                    results["@odata.context"].indexOf("')")
                );

                let newOptions = [
                    ...results.value.map((result) => {
                        result.Score = result["@search.score"];
                        delete result["@search.score"];
                        return {
                            ...result,
                            Source: indexSource,
                            Primary: result.WellName,
                            Secondary: result.ApiNumber,
                        };
                    })
                ];

                setFoundWells(newOptions)
            }
        });
    }, [])

    useEffect(() => {
        if (!dataTenantWell?.tenantWell) return;

        const leaseToSet = dataTenantWell?.tenantWell?.lease || "";
        const leaseAcresToSet = dataTenantWell?.tenantWell?.leaseAcres;

        setSelectedWell({
            ...selectedWell,
            Lease: leaseToSet,
            LeaseAcreage: leaseAcresToSet
        });
        props.setSelectedWell({
            ...selectedWell,
            Lease: leaseToSet,
            LeaseAcreage: leaseAcresToSet
        });
        props.setTenantWell(dataTenantWell?.tenantWell)
    }, dataTenantWell);

    return (
        <FormControl
            variant="outlined"
            fullWidth
            size="small"
        >
            <Autocomplete
                options={foundWells || []}
                id="selectWell"
                onChange={(e, well) => {
                    setSelectedWell(well);
                    well && getTenantWell({
                        variables: {
                            globalWellId: well.Id,
                        },
                    });
                    well && setValid({
                        ...valid,
                        'selectedWell.Id': false
                    })
                }}
                value={selectedWell}
                getOptionLabel={(option, value) => option.Primary}
                filterOptions={(x) => x}
                renderOption={(option) => {
                    const parts = parse(option.Primary, Array());

                    return (
                        <Grid container spacing={0}>
                            <Grid container item xs={11} alignItems="center">
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
                            <Grid container item xs={1} alignItems="center">
                                <Grid item style={{ position: "relative" }}>
                                    <div
                                        className={classes.score}
                                        style={{
                                            zIndex: "1300",
                                            backgroundColor: "#12ABE0",
                                        }}
                                    />
                                    <div
                                        className={classes.score}
                                        style={{
                                            zIndex: "1301",
                                            backgroundImage:
                                                "repeating-linear-gradient(135deg, #ffffff , #ffffffb7 4.5%, #ffffff 15%)",
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    );
                }}
                renderInput={(params) => (
                    <TextField
                        margin="dense"
                        {...params}
                        required
                        error={valid['selectedWell.Id']}
                        helperText={
                            valid['selectedWell.Id'] ? "Select a well to get started" : ""
                        }
                        variant="outlined"
                        label={props.label}
                        InputLabelProps={{ shrink: true }}
                        onChange={(event) => {
                            callWellSearch2({ input: event.target.value }, (results) => {
                                if (results) {
                                    const indexSource = results["@odata.context"].substring(
                                        results["@odata.context"].indexOf("('") + 2,
                                        results["@odata.context"].indexOf("')")
                                    );

                                    let newOptions = [
                                        ...results.value.map((result) => {
                                            result.Score = result["@search.score"];
                                            delete result["@search.score"];
                                            return {
                                                ...result,
                                                Source: indexSource,
                                                Primary: result.WellName,
                                                Secondary: result.ApiNumber,
                                            };
                                        })
                                    ];

                                    setFoundWells(newOptions)
                                }
                            });
                        }}
                    />
                )}
            />
        </FormControl>


    );
}

WellSearchApiField.defaultProps = {
    label: "Search for a well by name or API"
}

export default WellSearchApiField;
