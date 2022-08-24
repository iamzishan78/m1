import React, { useEffect } from "react";
import { usetableStyles } from "../Styles";
import { Button, Container } from "@material-ui/core";
import TableESHOC from "components/Table/TableESHOC";
import Table from "components/Shared/M1nTable/components/Table";
import { deepEqualObjects, copy } from "components/Shared/functions";
import TableHeader from 'components/Table/constants/check-details-header-schema';
import { history } from "store";


function CheckDetailsTable(props) {
    const classes = usetableStyles();
    const { checkId, setTableMeta } = props;

    const formatHits = (hits) => {
        return hits.map((hit) => {
            hit.number = hit?.property?.number;
            hit.name = hit?.property?.name;
            hit.state = hit.property?.state;
            hit.county = hit.property?.county;
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

    props.options.customToolbar = () => {
        return <div style={{ display: "inline", "float": "left", marginRight: "15px", marginTop: "5px" }}>
            <Button
                color="secondary"
                className={classes.multiSelectionTopBarButtons}
                onClick={() => {
                    const checkId = window.location.pathname.split("/")[window.location.pathname.split("/").length - 1];
                    history.push(`/revenue/statement/details/${checkId}/line-item`);
                }}
            >
                INPUT MODE
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