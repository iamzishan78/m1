import { CommonSchema } from 'components/MRSimpleTable/Schema/common_schema';
import PropertiesRevenueMeta from 'components/MRSimpleTable/Schema/properties_revenue_schema';
import { vf_currency_to_fixed } from 'components/Shared/valueformatters/vf_currency';
import moment from 'moment';

export function generateMonthYearArray(startDate, endDate) {
	const start = moment(startDate);
	const end = moment(endDate);

	const result = [];

	while (start.isSameOrBefore(end, 'month')) {
		result.push(start.format('MMM YYYY'));
		start.add(1, 'month');
	}

	return result;
}

export function getPropertiesRevenueTableSchema(months) {
	const schema = months.map(month => ({
		...CommonSchema.STRING_COLUMN,
		header: month,
		accessorKey: month,
		name: month,
		accessorFn: row => {
			const value = row?.[month] === 0 ? '0' : row?.[month] || '0';
			return vf_currency_to_fixed(value, value === '0' ? 0 : 2);
		},
	}));

	return [...PropertiesRevenueMeta.TableSchema, ...schema];
}
