import React, { useState, useContext } from "react";
import { useDispatch } from "react-redux";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useSelector } from "react-redux";
import { AutoCompleteFilter } from "components/Table/AutoCompleteFilter";
import { GET_ES_SIMPLE_FILTER } from "graphQL/useQueryESSimpleFilter";
import { updateUserGridViewSettingAction } from "store/actions/sessionActions";
import { AppContext } from "AppContext";
import { tractFilterColumnsHeader, tractInterestFilterColumnsHeader } from "utils/data";


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


const TractsFilters = ({ selectedTractTab }) => {
    const classes = useStyles();

    const [stateApp] = useContext(AppContext);
    const dispatch = useDispatch();
    const [, setFilters] = useState([]);
    const userGridViewSettings = useSelector(({ session }) => session.userGridViewSettings);
    const TractGridViewModule = userGridViewSettings?.Tracts
    const TractInterestGridViewModule = userGridViewSettings?.TractInterest


    const handleMultiFieldFilter = (esFilter) => {
        const filters = []
        const filterHistory = {}

        if (esFilter) {
            esFilter.forEach((filter) => {
                if (typeof filter?.field === 'string') {
                    if (!filterHistory[filter.field])
                        filters.push(filter)
                    else {
                        const filterIndex = filters.findIndex(f => f.field === filter.field);
                        filters[filterIndex].value = filter.value
                    }
                    filterHistory[filter.field] = true
                } else {
                    if (!filterHistory[filter.field[0]])
                        filters.push({ field: filter.field[0], value: filter.value[0] })
                    else {
                        const filterIndex = filters.findIndex(f => f.field === filter.field[0]);
                        filters[filterIndex].value = filter.value[0]
                    }
                    filterHistory[filter.field] = true

                }
            })
        }
        return filters
    }


    const onChange = (filter, index, column, esKey) => {
        let GridViewModule, moduleName, columnsHeader

        if (selectedTractTab === 0) {
            GridViewModule = TractGridViewModule
            moduleName = "Tracts"
            columnsHeader = tractFilterColumnsHeader
        }
        else {
            GridViewModule = TractInterestGridViewModule
            moduleName = "TractInterest"
            columnsHeader = tractInterestFilterColumnsHeader
        }

        if (GridViewModule) {
            let { filters } = GridViewModule
            if (filter.length) {
                filters.push({ field: esKey || columnsHeader[index].filterKey, value: filter[0] })
                filters = handleMultiFieldFilter(filters)
            }
            else {
                const { filterKey } = column
                if (Array.isArray(filterKey))
                    filters = filters.filter(filter => !filterKey.includes(filter.field))
                else filters = filters.filter(filter => filter.field !== filterKey)
            }

            dispatch(updateUserGridViewSettingAction.STARTED({
                userGridViewSetting: {
                    module: GridViewModule?.module,
                    gridView: GridViewModule._id,
                    gridViewPatch: {
                        filters: filters,
                        columns: GridViewModule?.columns,
                    },
                    user: stateApp.user?.mongoId,
                }
            }));
        }
        else {
            let filters = [{ field: columnsHeader[index].filterKey, value: filter[0] }]
            dispatch(updateUserGridViewSettingAction.STARTED({
                userGridViewSetting: {
                    module: moduleName,
                    gridView: undefined,
                    gridViewPatch: {
                        filters: filters,
                        columns: [],
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
                style={{ padding: "5px 36px 5px 14px", maxWidth: "1350px" }}
                // justifyContent="space-between"
                spacing={2}
            >
                {selectedTractTab ? (
                    tractInterestFilterColumnsHeader.map((filterColumn, index) => {
                        const custom = {
                            multi_filter_keys: true,
                        }
                        const appliedFilters = [{
                            field: "shape.layer.keyword",
                            value: "parcel"
                        }]
                        let filterList = [[''], [''], [''], ['']]
                        const gridViewFilters = TractGridViewModule?.filters

                        if (gridViewFilters && typeof filterColumn?.filterKey === 'string') {
                            const gridViewFilter = gridViewFilters.find(filter => filter.field === filterColumn?.filterKey)
                            if (gridViewFilter)
                                filterList[index] = [gridViewFilter?.value]

                            if (filterColumn.name === 'County') {
                                const stateFilter = gridViewFilters.find(filter => filter.field === 'shape.shapeJson.properties.originalProperties.State.keyword')

                                if (stateFilter)
                                    appliedFilters.push(stateFilter)
                            }
                        }

                        return (
                            <Grid item xs md style={{ minWidth: "205px", maxWidth: "305px" }}>
                                <AutoCompleteFilter
                                    esIndex={"shapeowners_flat"}
                                    variant="outlined"
                                    setFilters={setFilters}
                                    filterList={[[''], [''], [''], ['']]}
                                    column={filterColumn}
                                    disabled={filterColumn?.disabled}
                                    index={index}
                                    custom={Array.isArray(filterColumn.filterKey) ? custom : undefined}
                                    onChange={onChange}
                                    query={GET_ES_SIMPLE_FILTER}
                                    searchFields={["*"]}
                                    filters={appliedFilters}
                                    extendSearchQuery={""}
                                />
                            </Grid>
                        )
                    })

                ) : (

                    tractFilterColumnsHeader.map((filterColumn, index) => {
                        const custom = {
                            multi_filter_keys: true,
                        }
                        const appliedFilters = [{
                            field: "layer.keyword",
                            value: "parcel"
                        }]
                        let filterList = [[''], [''], [''], ['']]
                        const gridViewFilters = TractGridViewModule?.filters

                        if (gridViewFilters && typeof filterColumn?.filterKey === 'string') {
                            const gridViewFilter = gridViewFilters.find(filter => filter.field === filterColumn?.filterKey)
                            if (gridViewFilter)
                                filterList[index] = [gridViewFilter?.value]

                            if (filterColumn.name === 'County') {
                                const stateFilter = gridViewFilters.find(filter => filter.field === 'shapeJson.properties.originalProperties.State.keyword')

                                if (stateFilter)
                                    appliedFilters.push(stateFilter)
                            }
                        }

                        return (
                            <Grid item xs md style={{ minWidth: "205px", maxWidth: "305px" }}>
                                <AutoCompleteFilter
                                    esIndex={"shapes_flat"}
                                    variant="outlined"
                                    setFilters={setFilters}
                                    filterList={filterList}
                                    column={filterColumn}
                                    disabled={filterColumn?.disabled}
                                    index={index}
                                    custom={Array.isArray(filterColumn.filterKey) ? custom : undefined}
                                    onChange={onChange}
                                    query={GET_ES_SIMPLE_FILTER}
                                    searchFields={["*"]}
                                    filters={appliedFilters}
                                    extendSearchQuery={""}
                                />
                            </Grid>
                        )
                    }

                    )
                )}


            </Grid>
        </div >
    );
}

export default TractsFilters