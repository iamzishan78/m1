import React, { useContext, useEffect, useState } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import { useMutation } from "@apollo/client";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";

// context
import { Container, Dialog, Button, IconButton, Tooltip } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import TableESHOC from "components/Table/TableESHOC";

// QUERIES

import { deepEqualObjects } from "components/Shared/functions";
import DeleteConfirmationDialogContent from "components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";

// Header Schemas
import TableHeader from "components/Table/constants/parcel-payments-header-schema.js";

// Utilities
import { usetableStyles } from "./style";
import { AppContext } from "AppContext";
import convert_date from "components/Shared/valueformatters/convert_date";
import { REMOVEPAYMENT } from "graphQL/useMutationRemovePayment";
import { detailCardController } from "hookstate/detailCardController";

function AgreementPaymentsTable(props) {
    const classes = usetableStyles();
    const [isDeletePopup, setDeletePopup] = useState(false);
    const [resetSelectedRow, setResetSelectedRow] = useState(false);
    const { moduleId } = props;

    const [stateApp, setStateApp] = useContext(AppContext);

    const [removePayment] = useMutation(REMOVEPAYMENT, {
        onCompleted: () => {
            props.setLoading(false);
            props.setSelectedRows([]);
            setResetSelectedRow(!resetSelectedRow)
        },
        onError: (err) => { },
    }, { refetchQueries: ["getESSimpleSearch"], awaitRefetchQueries: true });

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
                            detailCardController.updateState({ drawer: "pymnt" })
                        }}
                    >
                        + ADD Payment
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
        onRowClick: (rowData, { dataIndex, rowIndex }) => {
            setStateApp((state) => ({
                ...state,
                paymentMultiGrid: { showMultiGrid: true, paymentId: props.rows[dataIndex]?._id },
            }));
        },
    };

    const formatHits = (hits) => {
        hits = hits.map((hit) => {
            // Update the agreementDate property
            hit.startDate = hit.startDate ? convert_date(hit.startDate) : null;
            hit.endDate = hit.endDate ? convert_date(hit.endDate) : null;
            hit.amount = hit.amount ? `$${hit.amount}` : '';

            // Return the modified object
            return hit;
        });
        return hits;
    };
    const deleteFunc = (ids) => {
        props.setLoading(true);
        for (let i = 0; i < ids.length; i++) {
            removePayment({
                variables: {
                    paymentId: ids[i],
                },
                refetchQueries: ["getESSimpleSearch"],
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
                filters: [{ field: "shapeObj._id", value: moduleId }],
                TableHeader: TableHeader,
                downloadAll: { exportPx: '121px' },
                esIndex: "payment_flat",
                startPaginationAt: 25,
                formatHits,
            });
    }, [moduleId]);

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
                header={props.header ?? "Related Payments"}
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

export default React.memo(TableESHOC(AgreementPaymentsTable), deepEqualObjects);
