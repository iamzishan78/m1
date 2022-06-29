import React, { useState, useContext } from "react";
import { useDispatch } from "react-redux";
import { Grid, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useSelector } from "react-redux";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { AutoCompleteFilter } from "components/Table/AutoCompleteFilter";
import { GET_ES_SIMPLE_FILTER } from "graphQL/useQueryESSimpleFilter";
import { updateUserGridViewSettingAction } from "store/actions/sessionActions";
import { AppContext } from "AppContext";


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

    const [stateApp] = useContext(AppContext);
    const dispatch = useDispatch();
    const [, setFilters] = useState([]);
    const userGridViewSettings = useSelector(({ session }) => session.userGridViewSettings);
    const TractGridViewModule = userGridViewSettings[`Tracts`]



    const filterColumns = [{
        label: "Department",
        filterKey: "shapeJson.properties.department.keyword",
        type: undefined,
        name: "department"
    },
    {
        label: "State",
        filterKey: ["shapeJson.properties.originalProperties.State.keyword",
            "shapeJson.properties.originalProperties.StateAbbreviation.keyword"],
        type: undefined,
        name: "state"
    },
    {
        label: "Count",
        filterKey: "shapeJson.properties.originalProperties.County.keyword",
        type: undefined,
        name: "count"
    },
    {
        label: "Owners",
        filterKey: "shapeJson.properties.department.keyword",
        type: undefined,
        name: "department"
    }
    ]

    const appliedFilters = [{
        field: "layer.keyword",
        value: "parcel"
    }]

    const handleMultiFieldFilter = (esFilter) => {
        const filters = []
        const filterHistory = {}

        if (esFilter) {
            esFilter.forEach((filter) => {
                if (typeof filter?.field === 'string') {
                    if (!filterHistory[filter.field])
                        filters.push(filter)
                    filterHistory[filter.field] = true
                } else {
                    filter?.field?.forEach((_, index) => {
                        if (!filterHistory[filter.field])
                            filters.push({ field: filter.field[index], value: filter.value[index] })
                        filterHistory[filter.field] = true
                    })
                }
            })
        }
        return filters
    }

    const onChange = (filter, index, column) => {

        if (TractGridViewModule) {
            let { filters } = TractGridViewModule
            filters.push({ field: filterColumns[index].filterKey, value: filter[0] })
            debugger
            filters = handleMultiFieldFilter(filters)

            dispatch(updateUserGridViewSettingAction.STARTED({
                userGridViewSetting: {
                    module: TractGridViewModule?.module,
                    gridView: TractGridViewModule._id,
                    gridViewPatch: {
                        filters: filters,
                        columns: TractGridViewModule?.columns,
                    },
                    user: stateApp.user?.mongoId,
                }
            }));
        }

    }

    return (
        <div className={classes.actionBar} >
            <Grid
                container
                alignItems="center"
                style={{ padding: "5px 36px 5px 45px", maxWidth: "1350px" }}
                // justifyContent="space-between"
                spacing={2}
            >
                {
                    filterColumns.map((filterColumn, index) => (
                        <Grid item xs md style={{ minWidth: "205px", maxWidth: "305px" }}>
                            <AutoCompleteFilter
                                esIndex={"shapes_flat"}
                                variant="outlined"
                                setFilters={setFilters}
                                filterList={[[''], [''], [''], ['']]}
                                column={filterColumn}
                                index={index}
                                onChange={onChange}
                                query={GET_ES_SIMPLE_FILTER}
                                searchFields={["*"]}
                                filters={appliedFilters}
                                extendSearchQuery={""}
                                custom={undefined}
                            />
                        </Grid>
                    ))
                }

            </Grid>
        </div >
    );
}

export default TractsGreyFilter