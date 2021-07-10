import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

// context
import { AppContext } from "AppContext";

import { Container } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import TableHOC from "components/Table/TableHOC";

// QUERIES 
import { useLazyQuery } from "@apollo/client";
import { SHAPE_OWNERS } from "graphQL/useQueryPaginatedShapeOwners";
import { SHAPEOWNERSCOUNT } from "graphQL/useQueryShapeOwnersCount";

import { deepEqualObjects, setStateIfDeepEqual } from "components/Shared/functions";

// Header Schemas 
import TableHeader from 'components/Table/constants/track-owners-header-schema.js'
import { handleTagColumn } from "../helpers";

// Utilities
import isEmpty from "lodash/isEmpty";

const useStyles = makeStyles((theme) => ({
    container: {
        padding: "0 !important"
    },
}));

function ShapeGridTaxOwnersTable(props) {
    const classes = useStyles();

    // contexts
    const [stateApp, setStateApp] = useContext(AppContext);


    // function states 
    const [columns, Columns] = useState([]);
    const setColumns = (newState) => { setStateIfDeepEqual(Columns, newState); };
    const [selectedYear, setSelectedYear] = useState(2020)  // production selected year state 
    const [count, setCount] = useState()  // local state for async count query

    // queries 
    const [getPaginatedShapeOwners, { data: dataShapeOwners, variables: variablesShapeOwners }] = useLazyQuery(SHAPE_OWNERS, { fetchPolicy: "cache-and-network", skip: true,
        onCompleted: (dataShapeOwners) => {
            setCount((state, props) => {
                let newState = state || dataShapeOwners?.paginatedShapeOwners?.edges?.length;
                let newStateIncrement = !variablesShapeOwners?.pagination?.before &&
                    dataShapeOwners?.paginatedShapeOwners?.pageInfo?.hasNextPage
                    ? 1
                    : 0;

                return newState + newStateIncrement
            })
        },
    });
    const tableData = dataShapeOwners?.paginatedShapeOwners
    const [getShapeOwnersCount, { data: dataShapeOwnersCount }] = useLazyQuery(SHAPEOWNERSCOUNT, { fetchPolicy: "cache-and-network", skip: true,
        onCompleted: (dataShapeOwnersCount) => {
            setStateApp((state) => ({
                ...state,
                shapeGridOwnersCount: dataShapeOwnersCount?.shapeOwnersCount,
            }));
        },
    });

    const addAble = false
    const total = false
    const orderByTracks = false

    ////////////Contact Wells begin///////////////////////////////////////////////
    useEffect(() => {
        getPaginatedShapeOwners({
            variables: {
                polygon: stateApp.gridPolygonString,
                userId: stateApp.user.mongoId,
            },
        });
        getShapeOwnersCount({
            variables: {
                polygon: stateApp.gridPolygonString,
            },
        });
    }, [props.parent]);

    useEffect(() => {
        if (tableData?.edges?.length > 0) {
            let owners = tableData.edges.map((el) => el.node)
            const objectsIdsArray = owners.map((owner) => owner.globalOwnerId);
            props.initializeGenericData(objectsIdsArray, ['comments', 'tags', 'ifAreContacts'])
        }

    }, [tableData])

    useEffect(() => {
        if (tableData?.edges?.length > 0) {
            let owners = tableData.edges.map((el) => ({ ...el.node, cursor: el.cursor }))
            owners = owners.map((o) => {
                let owner = { ...o };
                owner.isTracked = true;
                owner.commentsCounter = 0;
                owner.tags = [[], 0];
                owner.wellsCounter = [];
                owner.coordinates = {
                    objToPopulateSearchLayer: {
                        objectType: "owner",
                        objectId: owner.id,
                    },
                };
                owner.isContact = false;

                owner = props.setGenricData(owner, owner.globalOwnerId, ['comments', 'tracks', 'tags', 'ifAreContacts'])

                return owner;
            });
            props.setRows(owners);

            const cleanAvailableTags = []; // get from backend
            const columns = handleTagColumn(TableHeader, cleanAvailableTags);
            setColumns(columns);
            props.setLoading(false);
        }
        else if (tableData?.edges?.length === 0) {
            props.setLoading(false);
        }
    }, [tableData, props.dependencyUpdate]);

    ////////////Contact Wells end///////////////////////////////////////////////


    const onTableChange = (action, tableState, rows, meta) => {

        const pageVariables = {
            variables: {
                polygon: stateApp.gridPolygonString,
                userId: stateApp.user.mongoId,
                pagination: {
                    first: tableState.rowsPerPage,
                    after: null,
                },
                ...(!isEmpty(tableState.sortOrder)) && {
                    sort:
                    {
                        field: tableState.columns.find(el => el.name === tableState.sortOrder?.name)?.dbName ||
                            tableState.columns.find(el => el.name === tableState.sortOrder?.name)?.name,
                        order:
                            tableState.sortOrder?.direction === "asc"
                                ? 1
                                : -1,
                    }
                },

                filters: {},
            },
        };

        switch (action) {
            case "changeRowsPerPage":
                props.setLoading(true);
                tableState.page = 0;
                meta.setPageInd(tableState.page);
                meta.setRowsPerPage(tableState.rowsPerPage);
                getPaginatedShapeOwners(
                    pageVariables
                );
                break;
            case "changePage":
                props.setLoading(true);
                if (tableState.page > meta.pageInd) {
                    setCount((state, props) => {
                        return (tableState.page + 1) * tableState.rowsPerPage
                    })
                }
                getPaginatedShapeOwners({
                    ...pageVariables,
                    variables: {
                        ...pageVariables.variables,
                        pagination: {
                            ...pageVariables.variables.pagination,
                            before:
                                props.rows && tableState.page < meta.pageInd
                                    ? props.rows[0]?.cursor
                                    : null,
                            after:
                                props.rows && tableState.page > meta.pageInd
                                    ? props.rows[props.rows.length - 1]?.cursor
                                    : null,
                        },
                    },
                });
                break;
            case "sort":
                props.setLoading(true);
                tableState.page = 0;
                meta.setPageInd(tableState.page);
                getPaginatedShapeOwners(
                    pageVariables
                );
                break;
            case "search":
                break;
            case "onSearchClose":
                break;
            case "propsUpdate":
                break;
            case "filterChange":
                break;
            case "resetFilters":
                break;
            default:
        }
    }

    const options = {
        rowsPerPageOptions: count > 25 ? [10, 25, 50, 100] : count > 10 ? [10, 25] : [],
        count: stateApp.shapeGridOwnersCount || count || 0,
        serverSide: true, 
        filter: false,
    }
    ////////////-----Add your code section here-----///////////////////////
    const getWellOwnersByYear = (selectedYear) => {
        setSelectedYear(selectedYear)
    }
    return (
        <Container
            maxWidth={false}
            className={classes.container}
            id={props.id ? props.id : props.parent}
        >
            <Table
                style={{ backgroundColor: "#fff" }}
                header={props.header}
                columns={columns}
                rows={props.rows}
                total={total}
                loading={props.loading}
                addAble={addAble}
                targetLabel={props.targetLabel}
                deleteFunc={null}
                uploadIcon={null}
                dense={props.dense ? props.dense : undefined}
                orderByTracks={orderByTracks}
                startPaginationAt={null}
                onTableChange={onTableChange}
                options={options}
                parent={props.parent}
                setColumnsBase={[]}
                getWellOwnersByYear={getWellOwnersByYear}
            />
        </Container>
    );
}

export default React.memo(TableHOC(ShapeGridTaxOwnersTable), deepEqualObjects);