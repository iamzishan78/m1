import React, { useEffect } from "react";
import { usetableStyles } from "../Styles";
import { Button, Container, Tooltip, IconButton } from "@material-ui/core";
import TableESHOC from "components/Table/TableESHOC";
import Table from "components/Shared/M1nTable/components/Table";
import { deepEqualObjects, copy } from "components/Shared/functions";
import TableHeader from 'components/Table/constants/check-details-header-schema';
import { history } from "store";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

// value formatters
import convert_date from "components/Shared/valueformatters/convert_date.js";

function CheckDetailsTable(props) {
    const classes = usetableStyles();
    const { checkId, setTableMeta, onDownload, isExporting } = props;

    const formatHits = (hits) => {
        return hits.map((hit) => {
            hit.number = hit?.property?.number;
            hit.name = hit?.property?.name;
            hit.state = hit.property?.state;
            hit.county = hit.property?.county;
            hit.date = hit.date ? convert_date(hit.date) : null;
            hit.propertyId = hit?.property?._id;
            return hit;
        });
    };

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

    const handleInputModeClick = () => {
        let checkId;
        const { pathname } = window.location;

        if (pathname.slice(-1) === '/')
            checkId = pathname.split("/")[pathname.split("/").length - 2];
        else
            checkId = pathname.split("/")[pathname.split("/").length - 1];

        history.push(`/revenue/statement/details/${checkId}/line-item/`);
    }

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
            <Table
                style={{ backgroundColor: "#fff" }}
                header={props.header}
                columns={props.columns}
                rows={props.rows}
                total={false}
                loading={props.loading}
                targetLabel={props.targetLabel}
                uploadIcon={null}
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