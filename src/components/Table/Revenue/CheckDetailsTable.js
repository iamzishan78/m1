import React, { useEffect, useState } from "react";
import { usetableStyles } from "../Styles";
import { Tooltip, Grid, IconButton, Button, Dialog, Container, TextField } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TableESHOC from "components/Table/TableESHOC";
import Table from "components/Shared/M1nTable/components/Table";
import { deepEqualObjects, copy } from "components/Shared/functions";
import TableHeader from 'components/Table/constants/check-details-header-schema';
import { history } from "store";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_ES_SIMPLE_FILTER } from "graphQL/useQueryESSimpleFilter";
import { UPSERT_CHECK_PROPERTY } from "graphQL/useMutationCheckPropertyUpdate";
import { GET_ES_SIMPLE_SEARCH } from "graphQL/useQueryESSimpleSearch";
import DeleteConfirmationDialogContent from "components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";
import Loader from "components/Loaders";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

// value formatters
import convert_date from "components/Shared/valueformatters/convert_date.js";

function CheckDetailsTable(props) {
    const classes = usetableStyles();
    const { checkId, setTableMeta, onDownload, isExporting } = props;
    const [propertiesNumbers, setPropertiesNumbers] = useState([]);
    const [resetSelectedRow, setResetSelectedRow] = useState(false);
    const [openDialog, setOpenDialog] = useState(null);
    const [totalProperties, setTotalProperties] = useState(0);
    const [getESSimpleFilter] = useLazyQuery(GET_ES_SIMPLE_FILTER, { fetchPolicy: "no-cache" });
    const [getESSimpleSearch] = useLazyQuery(GET_ES_SIMPLE_SEARCH, {
        fetchPolicy: "no-cache",
    });

    const [upsertCheckProperties] = useMutation(UPSERT_CHECK_PROPERTY, {
        onCompleted: () => {
            Loader.successToast('checks-updation', "Checks updated successfully");
            props.setSelectedRows([]);
            setResetSelectedRow(!resetSelectedRow)
        },
        refetchQueries: ["getESSimpleSearch"],
    });
    useEffect(() => {
        (async () => {
            await new Promise((resolve, reject) => {
                getESSimpleSearch({
                    variables: {
                        index: "checkdetails_flat",
                        filters: [],
                        pagination: {
                            first: 0,
                            after: null,
                        },
                    },
                    onCompleted: (res) => {
                        if (res) {
                            const { total } = res?.getESSimpleSearch;
                            setTotalProperties(total);
                        }
                    },
                    onError: (error) => reject(error),
                });
            });
        })();
    }, []);

    useEffect(() => {
        (async () => {
            await new Promise((resolve, reject) => {
                getESSimpleFilter({
                    variables: {
                        index: "checkdetails_flat",
                        filters: [],
                        filterKey: "property.number.keyword",
                        filterAggs: { query: "", field: "property.number.keyword", size: totalProperties },
                    },
                    onCompleted: (res) => {
                        if (res) {
                            const propertiesNumbers = res?.getESSimpleFilter?.hits?.map((obj) => obj.key);
                            setPropertiesNumbers(propertiesNumbers);
                        }
                    },
                    onError: (error) => reject(error),
                });
            });
        })();
    }, [totalProperties]);

    useEffect(() => {
        setTableMeta({
            addBtnText: "INPUT MODE",
            addWithInput: true,
            filters: [{ field: "check._id.keyword", value: checkId }],
            TableHeader: copy(TableHeader),
            esIndex: "checkdetails_flat",
            startPaginationAt: 50,
            formatHits,
        });

    }, [checkId, setTableMeta]);

    const formatHits = (hits) => {
        return hits.map((hit) => {
            hit.purchaserNumber = hit?.property?.purchaserNumber;
            hit.name = hit?.property?.name;
            hit.number = hit?.property?.number;
            hit.state = hit.property?.state;
            hit.county = hit.property?.county;
            hit.date = hit.date ? convert_date(hit.date) : null;
            hit.propertyId = hit?.property?._id;
            hit.clickable = !hit?.property?.IsDeleted
            return hit;
        });
    };

    const handleInputModeClick = () => {
        let checkId;
        const { pathname } = window.location;

        if (pathname.slice(-1) === '/')
            checkId = pathname.split("/")[pathname.split("/").length - 2];
        else
            checkId = pathname.split("/")[pathname.split("/").length - 1];

        history.push(`/revenue/statement/details/${checkId}/line-item/`);
    }

    const handleChecksUpdate = async (propertyNumber) => {
        if (propertyNumber) {
            Loader.createToast('checks-updation', 'Checks Bulk Update in progress')
            const checksIds = props.selectedRows.map((sR) => props.rows[sR.dataIndex]?._id);
            await new Promise((resolve, reject) => {
                upsertCheckProperties({
                    variables: {
                        propertyNumber,
                        checksIds,
                    },
                    onCompleted: (res) => resolve(res?.upsertCheckProperty),
                    onError: (error) => reject(error),
                });
            });
        }
    }

    const deleteFunc = (ids) => {
        // console.log(ids)    
    };

    props.options.customToolbarSelect = () => {
        return (
            <div style={{ display: "flex", marginRight: "15px", marginTop: "5px" }}>
                <Grid item xs md={2} style={{ marginTop: "2px", minWidth: "285px" }}>
                    <Autocomplete
                        size="small"
                        onChange={(event, newValue) => { handleChecksUpdate(newValue) }}
                        options={propertiesNumbers}
                        style={{ marginTop: "2px", minWidth: "285px" }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Update Property"
                                variant="outlined"
                                placeholder=""
                                style={{ backgroundColor: "white", color: "black" }}
                            />
                        )}
                        disableListWrap
                        id="custom-date-dropdown"
                    />
                </Grid>
                <div style={{ height: "48px", display: "flex" }}>
                    <div style={{ marginTop: "6px", height: "35px", display: "flex" }}>
                        <Tooltip title={"Delete"}>
                            <IconButton
                                size="medium"
                                style={{ margin: "0 5px" }}
                                aria-label="delete"
                                onClick={(e) => setOpenDialog("delete")}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
            </div>
        );
    };

    props.options.customToolbar = () => {
        return <>

            <div style={{
                display: "inline",
                position: "absolute",
                right: '121px',
            }}>
                <IconButton onClick={onDownload} disabled={isExporting}>
                    <Tooltip title="Download to CSV" aria-label="add">
                        <CloudDownloadIcon />
                    </Tooltip>
                </IconButton>
            </div>

            <div style={{ display: "inline", "float": "left", marginRight: "15px", marginTop: "5px" }}>
                <Button
                    id="inputModeButton"
                    color="secondary"
                    className={classes.multiSelectionTopBarButtons}
                    onClick={() => handleInputModeClick()}
                >
                    INPUT MODE
                </Button>
            </div>
        </>
    }
    return (
        <Container
            maxWidth={false}
            className={classes.container}
            id={props.id ? props.id : props.parent}
        >
            <Dialog open={openDialog ? true : false} onClose={() => setOpenDialog(null)} fullWidth={true} maxWidth={"sm"}>
                {openDialog === "delete" && (
                    <DeleteConfirmationDialogContent
                        header="Delete Check(s)"
                        onClose={() => setOpenDialog(null)}
                        deleteFunc={deleteFunc}
                        m1nSelectedRowsIds={props.selectedRows.map((sR) => props.rows[sR.dataIndex]?._id)}
                        setM1nSelectedRowsIndexes={props.setSelectedRows}
                    >
                        {`Do you want to permanently delete the checks${props.selectedRows && props.selectedRows.length > 1 && props.selectedRows.length > 1 ? "s" : ""
                            }?`}
                    </DeleteConfirmationDialogContent>
                )}
            </Dialog>
            <Table
                style={{ backgroundColor: "#fff" }}
                header={props.header}
                columns={props.columns}
                rows={props.rows}
                total={false}
                loading={props.loading}
                targetLabel={props.targetLabel}
                uploadIcon={null}
                resetSelectedRow={resetSelectedRow}
                dense={props.dense ? props.dense : undefined}
                orderByTracks={false}
                startPaginationAt={null}
                onTableChange={props.onTableChange}
                options={props.options}
                addAble={{ type: 'revenueStatementDetails' }}
                parent={props.parent}
                setColumnsBase={[]}
                {...props.esHocProps}
            />
        </Container>
    );
}

export default React.memo(TableESHOC(CheckDetailsTable), deepEqualObjects);