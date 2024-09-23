import React, { memo } from "react";
import { Button } from "@material-ui/core";
import { detailCardController } from "hookstate/detailCardController";

// This component is used in the RelatedCostAllocationsTable component for the toolbar
function RelatedCostAllocationsToolbar({ table, tableKey }) {
    return (
        <>
            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    detailCardController.updateState({ drawer: "costAllocation" })
                }}
            >
                + ADD Cost Allocation
            </Button>
        </>
    );
}

export default memo(RelatedCostAllocationsToolbar);
