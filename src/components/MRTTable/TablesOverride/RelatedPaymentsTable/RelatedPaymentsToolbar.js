import React, { memo } from "react";
import { Button } from "@material-ui/core";
import { detailCardController } from "hookstate/detailCardController";
import { PaymentRightDialog } from "./RightDialog";

// This component is used in the RelatedPaymentsTable component for the toolbar
function RelatedPaymentsToolbar({ table, tableKey }) {
    return (
        <>
            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    detailCardController.updateState({ drawer: "paymentDialog" })
                }}
            >
                + ADD Payment
            </Button>
            <PaymentRightDialog/>
        </>
    );
}

export default memo(RelatedPaymentsToolbar);
