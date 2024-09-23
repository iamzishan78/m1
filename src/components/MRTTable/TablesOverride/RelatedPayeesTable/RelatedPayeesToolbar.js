import React, { memo } from "react";
import { Button } from "@material-ui/core";
import { detailCardController } from "hookstate/detailCardController";

// This component is used in the RelatedPayeesTable component for the toolbar
function RelatedPayeesToolbar({ table, tableKey }) {
    return (
        <>
            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    detailCardController.updateState({ drawer: "payee" })
                }}
            >
                + ADD Payee
            </Button>
        </>
    );
}

export default memo(RelatedPayeesToolbar);
