import React, { memo } from "react";
import { Button } from "@material-ui/core";
import { detailCardController } from "hookstate/detailCardController";

// This component is used in the RelatedBillingPartiesTable component for the toolbar
function RelatedBillingPartiesToolbar({ table, tableKey }) {
    return (
        <>
            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    detailCardController.updateState({ drawer: "billingParty" })
                }}
            >
                + ADD Billing Party
            </Button>
        </>
    );
}

export default memo(RelatedBillingPartiesToolbar);
