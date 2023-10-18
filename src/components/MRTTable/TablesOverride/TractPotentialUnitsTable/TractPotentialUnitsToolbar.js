import React, { memo } from "react";
import { Button } from "@material-ui/core";
import { tableController, tableGlobalController } from "hookstate/tableController";
import { ADD_TRACTS_TOA_SHAPE } from "graphQL/useMutationAddTractsToAShape";
import { useMutation } from "@apollo/client";

function TractPotentialUnitsToolBar({ table, tableKey }) {
    const [addShapeTract] = useMutation(ADD_TRACTS_TOA_SHAPE, {
        refetchQueries: [
            "getESPaginatedList",
            "getESSimpleSearch",
            "getESFilterList",
        ],
        awaitRefetchQueries: true,
    });
    const Controller = tableController(tableKey);
    const { customLayer } = Controller.getValue("customProps");
    const selectedRows = table.getSelectedRowModel().flatRows.map((row) => row.original);
    const addUnitToTract = async (e) => {
        e.stopPropagation();
        const shapeTract = {
            abstract: customLayer?.shapeJson?.properties?.AbstractName,
            altSurvey: customLayer?.shapeJson?.properties?.Grantee,
            block: customLayer?.shapeJson?.properties?.Block,
            county: customLayer?.shapeJson?.properties?.County,
            name: customLayer?.name,
            shapeArea: customLayer?.shapeJson?.properties?.shapeArea,
            sdGrossAcres: customLayer?.shapeJson?.properties?.sdGrossAcres,
            section: customLayer?.shapeJson?.properties?.Section,
            state: customLayer?.state,
            survey: customLayer?.shapeJson?.properties?.Survey,
        };
        const shapeTracts = selectedRows.map((row) => {
            return {
                ...shapeTract,
                parcelId: customLayer._id,
                shapeId: row._id
            }
        });
        table.resetRowSelection();
        tableController(tableKey).updateState({
            isLoading: true,
        });
        await addShapeTract({
            variables: {
                shapeTracts: shapeTracts,
                shapeType: 'Unit',
            },
        });
        tableController(tableKey).updateState({
            isLoading: false,
        });
        tableGlobalController.updateState({
            tabKey: 0
        });
    };
    const isSomeRowsSelected = table.getIsSomeRowsSelected();
    const isAllRowsSelected = table.getIsAllRowsSelected();
    const isSomethingSelected = isSomeRowsSelected || isAllRowsSelected;
    return (
        <>
            <Button
                variant="contained"
                color="primary"
                disabled={!isSomethingSelected}
                onClick={addUnitToTract}
            >
                + ADD RELATED UNIT
            </Button>
        </>
    );
}

export default memo(TractPotentialUnitsToolBar);
