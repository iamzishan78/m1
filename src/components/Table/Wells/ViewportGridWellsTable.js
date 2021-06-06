import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

// context
import { AppContext } from "AppContext";

import { Container } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import TableHOC from "components/Table/TableHOC";

import { deepEqualObjects, setStateIfDeepEqual } from "components/Shared/functions";

// Header Schemas 
import TableHeader from 'components/Table/constants/well-header-schema.js'

import ticksToDateString from "../../Shared/valueformatters/ticks-to-string.js";
import { handleTagColumn } from "../helpers/index.js";


const useStyles = makeStyles((theme) => ({
    container: {
        padding: "0 !important"
    },
}));

function ShapeGridWellsTable(props) {
    const classes = useStyles();

    // contexts
    const [stateApp, setStateApp] = useContext(AppContext);

    // function states 
    const [columns, Columns] = useState([]);
    const setColumns = (newState) => { setStateIfDeepEqual(Columns, newState); };
    const [selectedYear, setSelectedYear] = useState(2020)  // production selected year state 

    const addAble = false
    const total = false
    const orderByTracks = false

    useEffect(() => {
        if (stateApp?.viewportWells?.length > 0) {
            const objectsIdsArray = stateApp.viewportWells.map((well) => well.id);
            props.initializeGenericData(objectsIdsArray, ['comments', 'tags'])
        }

    }, [stateApp?.viewportWells])

    useEffect(() => {
        if (stateApp?.viewportWells?.length > 0) {
            let wells = stateApp.viewportWells
            wells = wells.map((w) => {
                let well = { ...w };
                well.wellId = w.id
                //// temporary to fix the ticks dates fields comming from the rest api
                if (well.permitApprovedDate && well.permitApprovedDate != "null")
                    well.permitApprovedDate = ticksToDateString(
                        well.permitApprovedDate
                    );
                if (well.spudDate && well.spudDate != "null")
                    well.spudDate = ticksToDateString(well.spudDate);
                if (well.completionDate && well.completionDate != "null")
                    well.completionDate = ticksToDateString(well.completionDate);
                if (well.firstProductionDate && well.firstProductionDate != "null")
                    well.firstProductionDate = ticksToDateString(
                        well.firstProductionDate
                    );
                //// temporary end

                well.coordinates = {};
                well.coordinates.wellId = well.wellId
                if (well.longitude && well.latitude)
                    well.coordinates.center = [well.longitude, well.latitude];

                well.detailCard = well.id;
                well.isTracked = false;
                well.commentsCounter = 0;
                well.tags = [[], 0];

                well = props.setGenricData(well, well.id, ['comments', 'tracks', 'tags'])

                return well;
            });
            props.setRows(wells);

            const cleanAvailableTags = []; // get from backend
            const columns = handleTagColumn(TableHeader, cleanAvailableTags);
            setColumns(columns);
            props.setLoading(false);

            setStateApp((state) => ({
                ...state,
                shapeGridWellsCount: stateApp.viewportWells.length
            }));
        }
        else if (stateApp?.viewportWells?.length === 0) {
            props.setLoading(false);
        }
    }, [stateApp?.viewportWells, props.dependencyUpdate]);

    const count = stateApp?.viewportWells?.length || 0
    const options = {
        rowsPerPageOptions: count > 25 ? [10, 25, 50, 100] : count > 10 ? [10, 25] : [],
        count: count,
        serverSide: true
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
                options={options}
                parent={props.parent}
                setColumnsBase={[]}
                getWellOwnersByYear={getWellOwnersByYear}
            />
        </Container>
    );
}

export default React.memo(TableHOC(ShapeGridWellsTable), deepEqualObjects);