import React, { useState, useEffect } from "react";
import { Container } from "@material-ui/core";
import TableESHOC from "components/Table/TableESHOC";
import Table from "components/Shared/M1nTable/components/Table";
import { deepEqualObjects, copy } from "components/Shared/functions";
import TableHeader from 'components/Table/constants/check-details-section-header-schema';

// value formatters
import convert_date from "components/Shared/valueformatters/convert_date.js";

import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({}));

function CheckDetailsSection(props) {
    const classes = useStyles();
    const { setTableMeta } = props;

    const formatHits = (hits) => {
        return hits.map((hit) => {
            hit.number = hit?.property?.number;
            hit.name = hit?.property?.name;
            hit.state = hit.property?.state;
            hit.county = hit.property?.county;
            hit.ownerNumber = hit.property?.ownerNumber;
            hit.owner = hit.property?.owner;
            hit.checkAmount = hit.check?.checkAmount;
            hit.source = hit.check.source;
            hit.sourceId = hit.check.sourceId;
            hit.propertyName = hit.property.name;
            hit.date = hit.date ? convert_date(hit.date) : null;
            hit.checkDate = hit.check.checkDate ? convert_date(hit.check.checkDate) : null;
            hit.depositDate = hit.check.depositDate ? convert_date(hit.check.depositDate) : null;
            hit.propertyId = hit?.property?._id;
            return hit;
        });
    };

    useEffect(() => {
        setTableMeta({
            filters: [],
            TableHeader: copy(TableHeader),
            esIndex: "checkdetails_flat",
            startPaginationAt: 50,
            formatHits,
        });

    }, [setTableMeta]);



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

export default React.memo(TableESHOC(CheckDetailsSection), deepEqualObjects);
