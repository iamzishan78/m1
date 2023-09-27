import React, { useContext, useEffect, useState } from "react";
// context
import { useHistory } from "react-router-dom";
import { Container, Button, Tooltip, IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import EditIcon from "@material-ui/icons/Edit";
import { useMutation } from "@apollo/client";

import { AppContext } from "AppContext";
import TableESHOC from "components/Table/TableESHOC";
import Table from "components/Shared/M1nTable/components/Table";
import { FEATURES } from "components/Shared/FeatureFlag/common";
import RequestPageIcon from "components/Shared/svgIcons/request_page";
import ButtonDropDown from "components/Shared/M1nTable/components/ButtonGroup";

import { NavigationContext } from "components/Navigation/NavigationContext";
import FeatureFlag from "components/Shared/FeatureFlag/FeatureFlagComponent";
import RightDialog from "components/ContactDetailCard/components/RightDialog";
import ExportOwnersAndContacts from "components/Shared/ExportOwnerAndContacts";
import AddParcelOwnerDialogContent from "components/Shared/M1nTable/components/SubComponents/AddParcelOwnerDialogContent";
import BuyContactsInfoDialogContent from "components/Shared/M1nTable/components/SubComponents/BuyContactsInfoDialogContent";
import DeleteConfirmationDialogContent from "components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";

import TableHeader from "components/Table/constants/parcel-agreement-header-schema";
import { UPDATEPARCELOWNER } from "graphQL/useMutationUpdateParcelOwner";
import vf_currency from "components/Shared/valueformatters/vf_currency";
import { deepEqualObjects, copy } from "components/Shared/functions";
import { addTrailingZeros } from "components/Shared/functions";
import { usetableStyles } from "../Styles";
import { AssignOwnerToContactDrawerContainer } from "store/containers";
import { DELETE_PARCEL_RUNSHEET } from "graphQL/useMutationDeleteParcelAgreement";
import ParcelInstrument from "components/ParcelsDetailCard/ParcelInstrument";

const genericDataActions = ["comments", "tracks", "ifAreContacts"];
const interestKeys = [
    "nra",
    "surface_interest",
    "mineral_interest",
    "royalty_interest",
    "orri",
    "record_title",
    "operating_rights",
    "nri",
    "net_acres",
    "company_net_acres",
    "unknown_interest",
];
const startPaginationAt = 25;

function ParcelAgreementTable(props) {
    let history = useHistory();
    const classes = usetableStyles();
    const [selectedRows, setSelectedRows] = useState([]);
    const [resetSelectedRow, setResetSelectedRow] = useState(false);
    const [isSelectAll, setIsSelectAll] = useState(false);
    const [stateApp, setStateApp] = useContext(AppContext);
    const [stateNav, setStateNav] = useContext(NavigationContext);
    const { customLayer, esIndex, searchFields, clickedRow } = props;

    const addAble = { type: "parcelRunsheet" }
    const [showSlider, setShowSlider] = useState(false)
    const [openCustomDialog, setOpenCustomDialog] = useState("");
    const [selectedOwner, setSelectedOwner] = useState(null);

    const [deleteParcelRunsheet] = useMutation(DELETE_PARCEL_RUNSHEET, { refetchQueries: ["getParcelAgreement"], awaitRefetchQueries: true });


    const appliedFilters = [
        { field: "descriptorObject", value: customLayer._id },
        { field: "isDeleted", value: true }
    ];

    const formatHits = (hits) => {
        return hits;
    };

    useEffect(() => {
        props.setTableMeta({
            filters: appliedFilters,
            extendSearchQuery: stateApp.activitySearchQuery,
            searchFields,
            TableHeader: copy(TableHeader),
            esIndex,
            startPaginationAt,
            formatHits,
            defaultSort: { field: "_ts", order: "asc" },
            setAppliedFilters: props.filtersChange,

        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stateApp.activitySearchQuery, props.filterToggle]);

    useEffect(() => {
        if (clickedRow) {
            setSelectedOwner({
                ...clickedRow,
            });
            setShowSlider(true)
        }
    }, [clickedRow]);

    const getRows = () => {
        const selectedRows = [];
        for (let i = 0; i < props.selectedRows.length; i++) {
            if (props.rows[props.selectedRows[i].index])
                selectedRows.push({
                    ...props.rows[props.selectedRows[i].index],
                    _id: props.rows[props.selectedRows[i].index].contactId,
                });
        }
        return selectedRows;
    };

    const onBulkUpdateComplete = () => {
        setSelectedRows([]);
        setResetSelectedRow(!resetSelectedRow);
    };

    const deleteFunc = (ids) => {
        for (let i = 0; i < ids.length; i++) {
            const record = props.rows.find(row => row._id === ids[i])
            if (record) {
                deleteParcelRunsheet({
                    variables: {
                        id: record.descriptorObject,
                        parcelId: props.customLayer._id,
                        fileId: record.fileId
                    },
                    refetchQueries: [
                        "getParcelAgreement",
                        "getESSimpleSearch"
                    ],
                    awaitRefetchQueries: true,
                })
            }
        }

        setResetSelectedRow(!resetSelectedRow)
    };

    return (
        <Container
            maxWidth={false}
            className={classes.container}
            id={props.id ? props.id : props.parent}
        >
            {showSlider && (
                <ParcelInstrument parcelId={props.customLayer._id} setShowSlider={setShowSlider} />
            )}
            {openCustomDialog === "deleteInstruments" && (
                <DeleteConfirmationDialogContent
                    header="Delete Runsheet Instrument(s)"
                    onClose={() => setOpenCustomDialog("")}
                    deleteFunc={deleteFunc}
                    m1nSelectedRowsIds={props.selectedRows.map(
                        (sR) => props.rows[sR.dataIndex]?._id
                    )}
                    setM1nSelectedRowsIndexes={props.setSelectedRows}
                >
                    {`Do you want to permanently delete the Runsheet Instrument${props.selectedRows &&
                        props.selectedRows.length > 1 &&
                        props.selectedRows.length > 1
                        ? "s"
                        : ""
                        }?`}
                </DeleteConfirmationDialogContent>
            )}
            <Table
                style={{ backgroundColor: "#fff" }}
                header={props.header}
                columns={props.columns}
                rows={props.rows}
                total={false}
                loading={props.loading}
                targetLabel={props.targetLabel}
                uploadIcon={null}
                deleteFunc={deleteFunc}
                dense
                orderByTracks={false}
                startPaginationAt={null}
                onTableChange={props.onTableChange}
                resetSelectedRow={resetSelectedRow}
                options={{
                    ...props.options,
                    customToolbar: () => {
                        const options = [
                            {
                                text: "+ ADD Instrument",
                                isShow: false,
                                action: () => setShowSlider(true),
                            },

                        ];
                        return (
                            <div
                                style={{
                                    display: "inline",
                                    float: "left",
                                    marginTop: "5px",
                                    marginRight: "5px",
                                }}
                            >
                                <ButtonDropDown options={options} />
                            </div>
                        );
                    },
                    customToolbarSelect: () => {
                        return (
                            <div
                                style={{
                                    height: "48px",
                                    display: "flex",
                                }}
                            >
                                <div
                                    style={{
                                        marginTop: "6px",
                                        height: "35px",
                                        display: "flex",
                                    }}
                                >
                                    <Tooltip title={"Delete"}>
                                        <IconButton
                                            size="medium"
                                            style={{ margin: "0 5px" }}
                                            onClick={(e) => {
                                                setOpenCustomDialog("deleteInstruments");
                                            }}
                                            aria-label="delete"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            </div>
                        );
                    }
                }}
                onRowSelectionChange={(
                    currentRowsSelected,
                    allRowsSelected,
                    rowsSelected
                ) => {
                    if (
                        allRowsSelected.length === startPaginationAt ||
                        allRowsSelected.length === props.options.count
                    ) {
                        setIsSelectAll(true);
                    } else {
                        setIsSelectAll(false);
                    }
                }}
                parent={props.parent}
                setColumnsBase={[]}
                {...props.esHocProps}
            />
        </Container>
    );
}

export default React.memo(
    TableESHOC(ParcelAgreementTable),
    deepEqualObjects
);
