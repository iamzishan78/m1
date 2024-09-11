import PotentialOwnersMeta, { potentialOwnerTableKey } from './potential_owners_schema';
import PropertiesRevenueMeta, { propertiesRevenueTableKey } from './properties_revenue_schema';

export const SCHEMA = {
	[potentialOwnerTableKey]: PotentialOwnersMeta,
	[propertiesRevenueTableKey]: PropertiesRevenueMeta,
};
