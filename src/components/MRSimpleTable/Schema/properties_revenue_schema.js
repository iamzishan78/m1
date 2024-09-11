import { CommonSchema } from "./common_schema";
import { Grid } from "@material-ui/core";
import ColumnWithLink from "components/Common/MRTable/ColumnWithLink";
import { GET_PROPERTIES_REVENUE } from "graphQL/useQueryGetPropertiesRevenue";
import PropertiesRevenueToolbar from "../TablesOverride/PropertiesRevenue/PropertiesRevenueToolbar";

export const propertiesRevenueTableKey = "PropertiesRevenue";

const PropertiesRevenueMeta = {
  query: GET_PROPERTIES_REVENUE,
  getVariables: (tableMeta) => {
    const { filters, filterDate } = tableMeta?.customProps || {};

    if (!filters && !filterDate) return;

    return {
      filters,
      filterDate,
    };
  },
  getDataFromRes: (res) => res?.data?.getPropertiesRevenue || [],
  getIdsFromRows: (rows) => rows?.map((row) => row.node?.propertyId) || [],
  CustomToolBar: PropertiesRevenueToolbar,
  isSelectAllAllowed: false,
  isDeleteAllowed: false,
  isExportAllowed: false,
  columnVirtualization: true,
  TableSchema: [
    {
      ...CommonSchema.HIDDEN,
      name: "propertyId",
      accessorKey: "propertyId",
      accessorFn: (row) => row?.node?.propertyId,
    },
    {
      ...CommonSchema.INITAIL_PINNED,
      header: "Property",
      name: "propertyName",
      accessorKey: "propertyName",
      Cell: ({ row }) => {
        let link = `/revenue/property/details/${row?.original?.propertyId}`;
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              minWidth: "500px",
              maxWidth: "500px",
            }}
          >
            <Grid
              container
              spacing={0}
              direction="row"
              style={{
                position: "absolute",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                alignItems: "center",

                "&:hover": {
                  "& $actionButtons": {
                    display: "flex",
                  },
                },
              }}
            >
              <Grid
                item
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                <ColumnWithLink
                  value={`${row?.original?.purchaserNumber || ""} - ${row?.original?.propertyName || ""}`}
                  link={link}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                />
              </Grid>
            </Grid>
          </div>
        );
      },
    },
  ],
};

export default PropertiesRevenueMeta;
