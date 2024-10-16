import PotentialOwnersMeta, { potentialOwnerTableKey } from './potential_owners_schema';
import UserManagementMeta, { userManagementTableKey } from './user_management_schema';

export const SCHEMA = {
	[potentialOwnerTableKey]: PotentialOwnersMeta,
	[userManagementTableKey]: UserManagementMeta,
};
