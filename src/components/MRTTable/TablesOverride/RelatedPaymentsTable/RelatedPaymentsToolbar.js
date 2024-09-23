import React, { memo } from "react";
import { Button } from "@material-ui/core";
import { detailCardController } from "hookstate/detailCardController";

// This component is used in the RelatedPaymentsTable component for the toolbar
function RelatedPaymentsToolbar({ table, tableKey }) {
    return (
        <>
            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    detailCardController.updateState({ drawer: "pymnt" })
                }}
            >
                + ADD Payment
            </Button>
        </>
    );
}

export default memo(RelatedPaymentsToolbar);
