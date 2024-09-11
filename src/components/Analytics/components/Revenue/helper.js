import { CommonSchema } from "components/MRSimpleTable/Schema/common_schema";
import PropertiesRevenueMeta from "components/MRSimpleTable/Schema/properties_revenue_schema";
import moment from "moment";

export function generateMonthYearArray(startDate, endDate) {
  const start = moment(startDate);
  const end = moment(endDate);

  const result = [];

  while (start.isSameOrBefore(end, "month")) {
    result.push(start.format("MMM YYYY"));
    start.add(1, "month");
  }

  return result;
}

export function getPropertiesRevenueTableSchema(months) {
  const schema = months.map((month) => ({
    ...CommonSchema.STRING_COLUMN,
    header: month,
    accessorKey: month,
    name: month,
    accessorFn: (row) => {
      const value = row?.[month] === 0 ? 0 : row?.[month]?.toFixed(2) || 0;
      return value;
    },
  }));

  return [...PropertiesRevenueMeta.TableSchema, ...schema];
}
