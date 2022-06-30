import React, { useState, useContext } from "react";
import { useDispatch } from "react-redux";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useSelector } from "react-redux";
import { AutoCompleteFilter } from "components/Table/AutoCompleteFilter";
import { GET_ES_SIMPLE_FILTER } from "graphQL/useQueryESSimpleFilter";
import { GET_ES_FILTER_LIST } from "graphQL/useQueryESFilterList";
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


const TractsFilters = ({ setGreyBarFilters, selectedTractTab }) => {
    const classes = useStyles();

    const [stateApp] = useContext(AppContext);
    const dispatch = useDispatch();
    const [, setFilters] = useState([]);
    const userGridViewSettings = useSelector(({ session }) => session.userGridViewSettings);
    const TractGridViewModule = userGridViewSettings[`Tracts`]

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

    const onChange = (filter, index, column) => {
        if (selectedTractTab === 0) {
            if (TractGridViewModule) {
                let { filters } = TractGridViewModule
                if (filter.length) {
                    filters.push({ field: tractFilterColumnsHeader[index].filterKey, value: filter[0] })
                    filters = handleMultiFieldFilter(filters)
                }
                else
                    filters = filters.filter(filter => filter.field !== column.filterKey)

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

        else {
            setGreyBarFilters({ name: tractInterestFilterColumnsHeader[index].name, value: filter[0] })
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
                {selectedTractTab ? (
                    tractInterestFilterColumnsHeader.map((filterColumn, index) => (
                        <Grid item xs md style={{ minWidth: "205px", maxWidth: "305px" }}>
                            <AutoCompleteFilter
                                esIndex={"shapeowners_flat"}
                                variant="outlined"
                                setFilters={setFilters}
                                filterList={[[''], [''], [''], ['']]}
                                column={filterColumn}
                                disabled={filterColumn?.disabled}
                                index={index}
                                onChange={onChange}
                                query={GET_ES_FILTER_LIST}
                                searchFields={["*"]}
                                extendSearchQuery={""}
                                custom={undefined}
                            />
                        </Grid>
                    ))

                ) : (

                    tractFilterColumnsHeader.map((filterColumn, index) => {
                        let filterList = [[''], [''], [''], ['']]
                        const gridViewFilters = TractGridViewModule.filters
                        if (typeof filterColumn?.filterKey === 'string') {
                            const filterValue = gridViewFilters.find(filter => filter.field === filterColumn?.filterKey)?.value
                            if (filterValue)
                                filterList[index] = [filterValue]
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
                                    onChange={onChange}
                                    query={GET_ES_SIMPLE_FILTER}
                                    searchFields={["*"]}
                                    filters={appliedFilters}
                                    extendSearchQuery={""}
                                    custom={undefined}
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