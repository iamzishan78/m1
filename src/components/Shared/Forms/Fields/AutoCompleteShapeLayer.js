import React, { useEffect, useState } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useLazyQuery } from "@apollo/client";
import { SHAPE_LAYER_SEARCH } from "graphQL/useQueryShapeTypeSearch";
import { CUSTOMLAYER } from "graphQL/useQueryCustomLayer";


const useStyles = makeStyles({
    inputRoot: {
        // backgroundColor: "#ffffff",
    },
    listbox: {
        boxSizing: "border-box",
        "& ul": {
            padding: 0,
            margin: 0,
        },
    },
});

const AutoCompleteShapeLayer = ({ value, shapeType, setSelectedShapeLayer }) => {

    const [layerList, setLayerList] = useState([])

    const [search, setSearch] = useState('')

    const [shapeLayerQuery, { data: layersDate }] = useLazyQuery(SHAPE_LAYER_SEARCH);

    const [getCustomLayer, { data: dataCustomLayer }] = useLazyQuery(
        CUSTOMLAYER,
        {
            onCompleted: () => {
                if (dataCustomLayer?.customLayer) {
                    const layer = JSON.parse(JSON.stringify(dataCustomLayer?.customLayer))
                    layer.shapeJson = layer.shapeJson ? layer.shapeJson : JSON.parse(layer.shape)
                    setSelectedShapeLayer(layer);
                }
            },
        }
    );

    useEffect(() => {
        shapeLayerQuery({ variables: { shapeType, search } })
    }, [search])

    useEffect(() => {
        if (layersDate && layersDate[Object.keys(layersDate)[0]])
            setLayerList(layersDate[Object.keys(layersDate)[0]])

    }, [layersDate])

    const onInputChange = (e) => {
        if (e?.target?.value) {
            setSearch(e.target.value)
        }
    }

    const onChange = (value) => {
        if (value?._id)
            getCustomLayer({
                variables: { id: value._id }
            });
        else
            setSelectedShapeLayer(value ? value : { clear: true });

    }
    const classes = useStyles();

    return (
        <Autocomplete
            // defaultValue={{ _id: value, name: value }}
            id="autucompleteShapeLayer"
            value={value}
            disableListWrap
            classes={classes}
            options={layerList || []}
            getOptionLabel={(option) => {
                // Value selected with enter, right from the input
                if (typeof option === "string") {
                    return option;
                }
                // Add "xxx" option created dynamically
                if (option.inputValue) {
                    return option.name;
                }

                if (option?.name) return option.name;
                else return "";
            }}
            getOptionSelected={(option, value) => {
                return option?._id === value?._id;
            }}
            renderOption={(option) => {

                return (
                    <Grid container spacing={0}>
                        <Grid container item xs={12} alignItems="center">
                            <Grid item xs>
                                <span style={{ fontWeight: 400 }}>{option.name}</span>

                                <Typography variant="body2" color="textSecondary">
                                    {option.county ? `${option.county},` : ''} {option.state}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                );
            }}
            onInputChange={onInputChange}
            onChange={(event, newValue) => {
                onChange(newValue);
            }}
            renderInput={(params) => (
                <TextField
                    margin="dense"
                    variant="outlined"
                    {...params}
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        )

                    }}
                    fullWidth
                    autoFocus
                    size="small"
                />
            )}
        // {...other}
        />
    );
};

export default AutoCompleteShapeLayer