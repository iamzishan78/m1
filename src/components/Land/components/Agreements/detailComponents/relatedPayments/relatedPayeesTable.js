import React, { useContext, useEffect, useState } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import { useMutation } from "@apollo/client";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";

// context
import { Container, Dialog, Button, IconButton, Tooltip, CircularProgress } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import TableESHOC from "components/Table/TableESHOC";

// QUERIES

import { deepEqualObjects } from "components/Shared/functions";

// Header Schemas
import TableHeader from "components/Table/constants/parcel-payees-header-schema.js";

// Utilities
import { usetableStyles } from "./style";
import { AppContext } from "AppContext";
import { DrawerContext } from "../DrawerContext";
import { REMOVECONTACTPAYMENT } from "graphQL/useMutationRemoveContactPayment";
import DeleteConfirmationDialogContent from "components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";
import { detailCardController } from "hookstate/detailCardController";

function AgreementPayeesTable(props) {
    const classes = usetableStyles();
    const [isDeletePopup, setDeletePopup] = useState(false);
    const [resetSelectedRow, setResetSelectedRow] = useState(false);
    const { moduleId } = props;

    const [stateApp, setStateApp] = useContext(AppContext);
    const [, setDrawer] = useContext(DrawerContext);

    const { paymentId } = stateApp?.paymentMultiGrid;

    const [removeContactPayment] = useMutation(REMOVECONTACTPAYMENT, {
        onCompleted: () => {
            props.setLoading(false);
            props.setSelectedRows([]);
            setResetSelectedRow(!resetSelectedRow)
        },
        onError: (err) => { },
    });

    const options = {
        ...props.options,
        customToolbar: () => {
            return (
                <div style={{ display: "inline", float: "left" }}>
                    <Button
                        style={{ marginRight: "15px" }}
                        id="addRelatedDcmnButton"
                        color="secondary"
                        className={classes.multiSelectionTopBarButtons}
                        onClick={() => {
                            detailCardController.updateState({ drawer: "payee" })
                        }}
                    >
                        + ADD Payee
                    </Button>

                    <div style={{ display: "inline" }}>
                        <IconButton onClick={props.onDownload} disabled={props.isExporting}>
                            <Tooltip title="Download CSV" aria-label="add">
                                <CloudDownloadIcon />
                            </Tooltip>
                        </IconButton>
                    </div>
                </div>
            );
        },
        customToolbarSelect: ({ data }) => {
            return (
                <div style={{ height: "48px", display: "flex" }}>
                    <div style={{ marginTop: "6px", height: "35px", display: "flex" }}>
                        <Tooltip title={"Delete"}>
                            <IconButton
                                size="medium"
                                style={{ margin: "0 5px" }}
                                aria-label="delete"
                                onClick={(e) => {
                                    setDeletePopup("delete");
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
            );
        },
        onRowClick: (_, { dataIndex }) => {

        }
    };

    const formatHits = (hits) => {
        hits = hits.map((hit) => {
            const formattedHit = {};
            const { payments } = hit;
            if (Array.isArray(payments) && payments.length > 0) {
                const payment = payments.find((payment) => payment.paymentId === paymentId);
                if (payment) {
                    formattedHit._id = hit._id;
                    formattedHit.payeeName = payment.payeeName;
                    formattedHit.payeeAddress = payment.payeeAddress;
                    formattedHit.paymentAllocation = payment.paymentAllocation;
                    formattedHit.paymentAmount = payment.paymentAmount ? `$${payment.paymentAmount}` : '';
                    formattedHit.status = payment.status;
                }
            }
            return formattedHit;
        });
        return hits;
    };



    const deleteFunc = (ids) => {
        props.setLoading(true);
        for (let i = 0; i < ids.length; i++) {
            removeContactPayment({
                variables: {
                    paymentId,
                    contactId: ids[i],
                },
                refetchQueries: ["getESSimpleSearch", "getAgreementPaymentSummary"],
                awaitRefetchQueries: true,
            });
        }

        props.setSelectedRows([]);
    };

    useEffect(() => {
        if (moduleId)
            props.setTableMeta({
                shapeType: props.shapeType,
                addableName: "Payment",
                searchFields: [],
                filters: [{ field: "payments.paymentId", value: paymentId }],
                TableHeader: TableHeader,
                downloadAll: { exportPx: '121px' },
                esIndex: "contacts_flat",
                startPaginationAt: 25,
                formatHits,
            });
    }, [moduleId, paymentId]);

    useEffect(() => {
        if (props.setCounter) props.setCounter(props.rows.length);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.rows]);

    return (
        <Container maxWidth={false} className={classes.container} id={props.id ? props.id : props.parent}>
            <Dialog open={isDeletePopup} onClose={() => setDeletePopup(false)} fullWidth={true} maxWidth={"sm"}>

                <DeleteConfirmationDialogContent
                    header={`Delete Related Document(s)`}
                    onClose={() => setDeletePopup(false)}
                    deleteFunc={deleteFunc}
                    m1nSelectedRowsIds={props.selectedRows.map((sR) => props.rows[sR.dataIndex]?._id)}
                    setM1nSelectedRowsIndexes={props.setSelectedRows}
                >
                    {`Do you want to delete the selected related document${props.selectedRows && props.selectedRows.length > 1 && props.selectedRows.length > 1 ? "s" : ""
                        }?`}
                </DeleteConfirmationDialogContent>
            </Dialog>
            <Table
                style={{ backgroundColor: "#fff" }}
                header={props.header ?? "Payees"}
                columns={props.columns}
                rows={props.rows}
                total={false}
                loading={props.loading}
                targetLabel={props.targetLabel}
                resetSelectedRow={resetSelectedRow}
                uploadIcon={null}
                dense={props.dense ? props.dense : undefined}
                orderByTracks={false}
                startPaginationAt={null}
                onTableChange={props.onTableChange}
                options={options}
                parent={props.parent}
                setColumnsBase={[]}
                {...props.esHocProps}
            />
        </Container>
    );
}

export default React.memo(TableESHOC(AgreementPayeesTable), deepEqualObjects);
