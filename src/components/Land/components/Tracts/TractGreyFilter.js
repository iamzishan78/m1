import React, { useState, useEffect } from "react";
import { Grid, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { GET_ES_MIN_VALUE } from "graphQL/useQueryESMinValue";
import { useLazyQuery } from "@apollo/client";
import moment from "moment";
import { useSelector } from "react-redux";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { AutoCompleteFilter } from "components/Table/AutoCompleteFilter";
import { GET_ES_SIMPLE_FILTER } from "graphQL/useQueryESSimpleFilter";
import { GET_ES_SIMPLE_SEARCH } from "graphQL/useQueryESSimpleSearch";


const useStyles = makeStyles((theme) => ({
    actionBar: {
        backgroundColor: "#f7f7f7",
        width: "100%",
        minHeight: "65px",
        marginBottom: "46px",

    },
    actionsGrid: {
        marginTop: "6px",
        "& .MuiButtonBase-root": {
            width: "149px",
            height: "35px",
            fontWeight: "bold",
        },
    },
    viewSwitcher: {
        height: "40px",
        backgroundColor: "white",
    },

    formControl: {
        width: '100%'
    }
}));


const TractsGreyFilter = ({ setESFilters }) => {
    const classes = useStyles();

    const [filters, setFilters] = useState([]);

    const [getESSimpleSearch, { data: elasticData }] = useLazyQuery(GET_ES_SIMPLE_SEARCH, {
        fetchPolicy: "no-cache", onCompleted: () => {

        }
    });

    const column = {
        label: "Department",
        filterKey: "shapeJson.properties.department.keyword",
        type: undefined,
        name: "department"
    }

    const appliedFilters = [{
        field: "layer.keyword",
        value: "parcel"
    }]

    const propertiesReportGroup = useSelector(
        ({ Revenue }) => Revenue.propertiesReportGroup
    );
    const onChange = (filter, index, column) => {
        debugger
        const pageEsVariable = {
            esIndex: "shapes_flat",
            index: "shapes_flat",
            filters: [{ field: "shapeJson.properties.department.keyword", value: "Land" }, { field: "layer.keyword", value: "parcel" }],
            filterKey: "name.keyword",
            search: {
                query: "",
                fields: ["*"]
            },
            extendSearchQuery: "",
            size: 50,
            filterAggs: {
                query: "",
                field: "name.keyword", size: 50
            }
        }

        getESSimpleSearch({
            variables: { ...pageEsVariable }
        });

        console.log("column : ", column)
    }

    return (
        <div className={classes.actionBar} >
            <Grid
                container
                alignItems="center"
                style={{ padding: "5px 36px 0px 45px", maxWidth: "1350px" }}
                // justifyContent="space-between"
                spacing={2}
            >
                <Grid item xs md style={{ minWidth: "205px", maxWidth: "305px" }}>
                    <AutoCompleteFilter
                        esIndex={"shapes_flat"}
                        setFilters={setFilters}
                        filterList={[[''], [''], [''], ['']]}
                        column={column}
                        index={1}
                        onChange={onChange}
                        query={GET_ES_SIMPLE_FILTER}
                        searchFields={["*"]}
                        filters={appliedFilters}
                        extendSearchQuery={""}
                        custom={undefined}
                    />
                </Grid>

                <Grid item xs md style={{ minWidth: "205px", maxWidth: "305px" }}>
                    <Autocomplete
                        size="small"
                        onChange={(event, newValue) => { }}

                        renderInput={(params) => (
                            <TextField {...params} label="Check Date Range" variant="outlined" placeholder="" style={{ backgroundColor: "white" }} />
                        )}
                        // defaultValue={CUSTOM_DATES.THIS_YEAR_TO_DATE}
                        disableListWrap
                        id="custom-date-dropdown"
                    />
                </Grid>
                <Grid item xs md style={{ minWidth: "205px", maxWidth: "305px" }}>
                    <Autocomplete
                        size="small"
                        onChange={(event, newValue) => { }}

                        renderInput={(params) => (
                            <TextField {...params} label="Check Date Range" variant="outlined" placeholder="" style={{ backgroundColor: "white" }} />
                        )}
                        // defaultValue={CUSTOM_DATES.THIS_YEAR_TO_DATE}
                        disableListWrap
                        id="custom-date-dropdown"
                    />
                </Grid>
                <Grid item xs md style={{ minWidth: "205px", maxWidth: "305px" }}>
                    <Autocomplete
                        size="small"
                        onChange={(event, newValue) => { }}

                        renderInput={(params) => (
                            <TextField {...params} label="Check Date Range" variant="outlined" placeholder="" style={{ backgroundColor: "white" }} />
                        )}
                        // defaultValue={CUSTOM_DATES.THIS_YEAR_TO_DATE}
                        disableListWrap
                        id="custom-date-dropdown"
                    />
                </Grid>
            </Grid>
        </div >
    );
}

export default TractsGreyFilter