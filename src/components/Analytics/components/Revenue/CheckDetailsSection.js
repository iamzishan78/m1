import React, { useState, useEffect } from "react";
import { Container } from "@material-ui/core";
import TableESHOC from "components/Table/TableESHOC";
import Table from "components/Shared/M1nTable/components/Table";
import { deepEqualObjects, copy } from "components/Shared/functions";
import TableHeader from 'components/Table/constants/check-details-section-header-schema';

// value formatters
import convert_date from "components/Shared/valueformatters/convert_date.js";

import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({

    container: {
        padding: "0 !important",
        "& .MuiTableCell-head": {
            paddingLeft: (p) => (p.isAgreementsTable ? "17px !important" : " "),
        },

        "& .MuiTableRow-hover": {
            "&:hover": {
                "& .MuiTableCell-root": {
                    backgroundColor: "#dfdfdf !important",
                },
            },
        },
        // "& ::-webkit-scrollbar": {
        //   height: "0.7em !important",
        // },
        '& .MuiTableRow-footer': {
            visibility: (p) => p.isHideFooter ? 'hidden' : '',
            display: (p) => p.isHideFooter ? 'none' : '',
        },
        "& .MuiGrid-item": {
            display: "flex",
            alignItems: "center",

        },
        '& .MuiTableHead-root, .MuiTableRow-head, .MuiPaper-root > .MuiToolbar-gutters': {
            // zIndex: '9999',s
            position: 'sticky',
            top: 0
        },
        '& .MUIDataTable-responsiveBase': {
            maxHeight: '35vh'
        }
    }
}));

function CheckDetailsSection(props) {
    const classes = useStyles();
    const { setTableMeta } = props;

    const formatHits = (hits) => {
        return hits.map((hit) => {
            hit.number = hit?.property?.number;
            hit.name = hit?.property?.name;
            hit.purchaser = hit?.property?.purchaser?.name;
            hit.state = hit.property?.state;
            hit.county = hit.property?.county;
            hit.ownerNumber = hit.property?.ownerNumber;
            hit._owner = hit.property?._owner?.name;
            hit.checkAmount = hit.check?.checkAmount;
            hit.source = hit.check?.source;
            hit.sourceId = hit.check?.sourceId;
            hit.propertyName = hit.property.name;
            hit.date = hit.date ? convert_date(hit.date) : null;
            hit.checkDate = hit.check?.checkDate ? convert_date(hit.check.checkDate) : null;
            hit.depositDate = hit.check?.depositDate ? convert_date(hit.check.depositDate) : null;
            hit.propertyId = hit?.property?._id;
            return hit;
        });
    };

    useEffect(() => {
        setTableMeta({
            filters: [],
            TableHeader: copy(TableHeader),
            esIndex: "checkdetails_flat",
            startPaginationAt: 100,
            defaultSort: { field: "flatSyncAt", order: "desc" },
            formatHits,
            downloadAll: { exportPx: '176px' },
        });

    }, [setTableMeta]);



    return (
        <Container
            maxWidth={false}
            className={`${classes.container}`}
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

export default React.memo(TableESHOC(CheckDetailsSection), deepEqualObjects);
