import React, { useEffect } from "react";
import { usetableStyles } from "../Styles";
import { Button, Container } from "@material-ui/core";
import TableESHOC from "components/Table/TableESHOC";
import Table from "components/Shared/M1nTable/components/Table";
import { deepEqualObjects, copy } from "components/Shared/functions";
import TableHeader from 'components/Table/constants/property-revenue-details-header-schema';

function PropertyRevenueDetailsTable(props) {
    const classes = usetableStyles();
    const { propertyId, setTableMeta } = props;

    const formatHits = (hits) => {
        return hits.map((hit) => {
            hit.number = hit?.property?.number;
            hit.name = hit?.property?.name;
            hit.checkNumber = hit?.check?.checkNumber;
            hit.checkId = hit?.check?._id;
            hit.purchaser = hit?.check?.payor?.name;
            return hit;
        });
    };

    useEffect(() => {
        setTableMeta({
            addBtnText: "INPUT MODE",
            addWithInput: true,
            filters: [{ field: "property._id.keyword", value: propertyId }],
            TableHeader: copy(TableHeader),
            esIndex: "checkdetails_flat",
            startPaginationAt: 10,
            formatHits,
        });

    }, [propertyId, setTableMeta]);

    props.options.customToolbar = () => {
        return <div style={{ display: "inline", "float": "left", marginRight: "15px", marginTop: "5px" }}>
            <Button
                color="secondary"
                className={classes.multiSelectionTopBarButtons}
                disabled
            >
                + ADD INTEREST
            </Button>
        </div>
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
                startPaginationAt={10}
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

export default React.memo(TableESHOC(PropertyRevenueDetailsTable), deepEqualObjects);
