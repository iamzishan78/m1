import ColumnWithLink from "components/Shared/M1nTable/components/SubComponents/ColumnWithLink";
import TractPotentialUnitsToolbar from "components/MRTTable/TablesOverride/TractPotentialUnitsTable/TractPotentialUnitsToolbar";
import { CommonSchema } from "./common_schema";

const esIndex = "shapes_flat";

const TractPotentialUnitsMeta = {
    esIndex,
    pageSize: 25,
    pagination: {
        pageIndex: 0,
        pageSize: 25,
    },
    CustomToolBar: TractPotentialUnitsToolbar,
    defaultSort: { field: "_ts", order: "asc" },
    height: '767px',
    isInFiniteScroll: true,
    columnVirtualization: true,
    disableDelete: true,
    TableSchema: [
        {
            ...CommonSchema.HIDDEN,
            name: "id",
            accessorKey: "id",
        },

        {
            ...CommonSchema.HIDDEN,
            name: "_id",
            accessorKey: "_id",
        },
        {
            ...CommonSchema.HIDDEN,
            name: "_id.keyword",
            accessorFn: (row) => row?._id,
            id: "_id",
        },
        {
            ...CommonSchema.INITAIL_PINNED,
            name: "name.keyword",
            accessorKey: "name",
            header: "Unit Name",
            Cell: ({ renderedCellValue, row }) => (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <ColumnWithLink
                        value={renderedCellValue}
                        link={`/map/units/${row.getValue("_id")}`}
                    />
                </div>
            ),
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: "shapeJson.properties.uNumber.keyword",
            accessorFn: (row) => row?.shapeJson?.properties?.uNumber,
            id: "shapeJson.properties.uNumber",
            header: "Unit Number",
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: "shapeJson.properties.uType.keyword",
            accessorFn: (row) => row?.shapeJson?.properties?.uType,
            id: "shapeJson.properties.uType",
            header: "Unit Type",
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: "shapeJson.properties.uAcres.keyword",
            accessorFn: (row) => row?.shapeJson?.properties?.uAcres,
            id: "shapeJson.properties.uAcres",
            header: "Unit Acres",
        },

        {
            ...CommonSchema.COMMON_COLUMN,
            name: "shapeJson.properties.uStatus.keyword",
            accessorFn: (row) => row?.shapeJson?.properties?.uStatus,
            id: "shapeJson.properties.uStatus",
            header: "Unit Status",
        },

        {
            ...CommonSchema.COMMON_COLUMN,
            name: "shapeJson.properties.uPrimaryOperator.keyword",
            accessorFn: (row) => row?.shapeJson?.properties?.uPrimaryOperator,
            id: "shapeJson.properties.uPrimaryOperator",
            header: "Current Operator",
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: "shapeJson.properties.uUnitPricing.keyword",
            accessorFn: (row) => row?.shapeJson?.properties?.uUnitPricing,
            id: "shapeJson.properties.uUnitPricing",
            header: "Target Unit Pricing (Per NRA)",
            size: 320,
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: "shapeJson.properties.uMaxUnitPricing.keyword",
            accessorFn: (row) => row?.shapeJson?.properties?.uMaxUnitPricing,
            id: "shapeJson.properties.uMaxUnitPricing",
            header: "Max Unit Pricing (Per NRA)",
            size: 320,
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: "shapeJson.properties.qualifier.name.keyword",
            accessorFn: (row) => row?.shapeJson?.properties?.qualifier?.name,
            id: "shapeJson.properties.qualifier.name",
            header: "Qualifier",
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: "shapeJson.properties.reviewer.name.keyword",
            accessorFn: (row) => row?.shapeJson?.properties?.reviewer?.name,
            id: "shapeJson.properties.reviewer.name",
            header: "Reviewer",
        },
        {
            ...CommonSchema.COMMON_COLUMN,
            name: "shapeJson.properties.campaignName.keyword",
            accessorFn: (row) => row?.shapeJson?.properties?.campaignName,
            id: "shapeJson.properties.campaignName",
            header: "Campaign Name",
            size: 270,
        },
    ],
};

export default TractPotentialUnitsMeta;
