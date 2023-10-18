import React, { useContext, useEffect, useState } from "react";
// context
import { useHistory } from "react-router-dom";
import { Container, IconButton } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import { useSelector } from "react-redux";
import debounce from "lodash/debounce";
import CloseIcon from "@material-ui/icons/Close";
import GetAppIcon from "@material-ui/icons/GetApp";
import Dialog from "@material-ui/core/Dialog";

import { AppContext } from "AppContext";
import TableESHOC from "components/Table/TableESHOC";
import Table from "components/Shared/M1nTable/components/Table";

import { NavigationContext } from "components/Navigation/NavigationContext";

// import TableHeader from "components/Table/constants/map-grid-wells-header-schema";
import TableHeader from 'components/Table/constants/well-header-schema.js'

import { deepEqualObjects, copy, getPolygonString } from "components/Shared/functions";
import { usetableStyles } from "../Styles";
import { downloadPdfsFile, getMapFilters } from "utils/helper";

const genericDataActions = ['tags', 'comments', 'tracks'];
const startPaginationAt = 25;

function ShapeGridWellsTable(props) {
    let history = useHistory();
    const classes = usetableStyles();
    const [resetSelectedRow, setResetSelectedRow] = useState(false);
    const [isSelectAll, setIsSelectAll] = useState(false);
    const [stateApp, setStateApp] = useContext(AppContext);
    const [stateNav, setStateNav] = useContext(NavigationContext);
    const { customLayer, clickedRow } = props;
    const searchInput = useSelector(
        (state) => state.MapGridCard.searchInputValue
    );
    const formatColumns = (headers, hits) => {
        if (stateNav.operatorName?.length > 0) {
            const index = headers.findIndex(header => header.name === 'operator')
            headers[index].options.display = true
        }
        if (stateNav.profileName?.length > 0) {
            const index = headers.findIndex(header => header.name === 'wellBoreProfile')
            headers[index].options.display = true
        }
        return headers;
    };

    const formatHits = (hits) => {
        hits = hits.map((hit) => {
            hit.coordinates = {};
            if (hit.Longitude && hit.Latitude) {
                hit.coordinates.center = [hit.Longitude, hit.Latitude];
                hit.coordinates.wellId = hit.Id;
            }
            hit.globalWell = hit.Id
            hit = props.setGenricData(hit, hit.id, genericDataActions, genericDataActions);
            return hit;
        });
        return hits
    }

    const setTableMeta = React.useMemo(
        () =>
            debounce((request, top, callback) => {
                props.setTableMeta(request);
            }, 500),
        // eslint-disable-next-line
        []
    );

    useEffect(() => {
        const { filters } = getMapFilters(stateNav, "", getPolygonString(props.customLayer?.shape), "simple");
        setTableMeta({
            extendSearchQuery: searchInput,
            searchFields: ["wellName", "api"],
            filters,
            polygon: props.customLayer?.shape?.geometry && {
                type: "geo_intersects",
                field: "geoJSON",
                value: props.customLayer?.shape?.geometry
            },
            TableHeader: copy(TableHeader),
            esIndex: "platformData:wells",
            startPaginationAt: 25,
            formatColumns,
            formatHits,
            initializeGenericData: { key: 'id', actions: genericDataActions }
        });
        // eslint-disable-next-line
    }, [
        searchInput,
    ]);

    useEffect(() => {
        if (clickedRow) {
            setSelectedInstrument({
                ...clickedRow,
            });
        }
    }, [clickedRow]);

    return (
        <Container
            maxWidth={false}
            className={classes.container}
            id={props.id ? props.id : props.parent}
        >
            <Table
                style={{ backgroundColor: "#fff" }}
                header={props.header}
                columns={props.columns}
                rows={props.rows}
                total={false}
                loading={props.loading}
                targetLabel={props.targetLabel}
                uploadIcon={null}
                dense
                orderByTracks={false}
                startPaginationAt={null}
                onTableChange={props.onTableChange}
                resetSelectedRow={resetSelectedRow}
                options={{
                    ...props.options
                }}
                onRowSelectionChange={(
                    allRowsSelected,
                ) => {
                    if (
                        allRowsSelected.length === startPaginationAt ||
                        allRowsSelected.length === props.options.count
                    ) {
                        setIsSelectAll(true);
                    } else {
                        setIsSelectAll(false);
                    }
                }}
                parent={props.parent}
                setColumnsBase={[]}
                {...props.esHocProps}
            />
            <Dialog
                className={classes.dialogExpCard}
                fullWidth
                maxWidth="xl"
                open={stateApp.pdfView ? true : false}
                onClose={() => {
                    setStateApp((state) => ({
                        ...state,
                        pdfView: null,
                    }));
                }}
            >
                <Toolbar>
                    <Grid
                        justify="space-between" // Add it here :)
                        container
                        spacing={24}
                    >
                        <Grid item>
                            <Typography className={classes.fileTitle} type="title" color="inherit">
                                {stateApp.pdfView?.fileName}
                            </Typography>
                        </Grid>

                        <Grid item>
                            {stateApp.pdfView && (
                                <IconButton onClick={() => downloadPdfsFile(stateApp.pdfView)}>
                                    <GetAppIcon />
                                </IconButton>
                            )}
                            <IconButton
                                className="float-right"
                                color="inherit"
                                onClick={() => {
                                    setStateApp((state) => ({
                                        ...state,
                                        pdfView: null,
                                        viewDoc: null,
                                    }));
                                }}
                                aria-label="close"
                            >
                                <CloseIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Toolbar>

            </Dialog>
        </Container>
    );
}

export default React.memo(
    TableESHOC(ShapeGridWellsTable),
    deepEqualObjects
);
