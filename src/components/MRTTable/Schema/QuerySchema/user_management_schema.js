import moment from 'moment';

import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import UserManagementToolbar from 'components/MRTTable/TablesOverride/UserManagementTable/UserManagementToolbar';

import { GET_ALL_USERS } from 'graphQL/userManagement';

import { tableGlobalController } from 'hookstate/tableController';

import { UserRole, RolePrivilege } from 'utils/data';

const onClickedRow = selectedRow => {
	if (selectedRow?._id) {
		tableGlobalController.updateState({
			dialog: {
				type: 'inviteUser',
				activeUser: selectedRow,
			},
		});
	}
};

const UserManagementMeta = {
	query: GET_ALL_USERS,
	maxTableHeight: 'calc(100vh - 495px)',
	getVariables: tableMeta => {
		return {};
	},
	getDataFromRes: res => res?.data?.users || [],
	getIdsFromRows: rows => rows?.map(row => row?._id) || [],
	isInFiniteScroll: true, // added infinite scroll
	CustomToolBar: UserManagementToolbar,
	onClickedRow,
	isClientSide: true,
	isSelectAllAllowed: true,
	isDeleteAllowed: true,
	isExportAllowed: false,
	enableFacetedValues: true,
	TableSchema: [
		{
			...CommonSchema.HIDDEN,
			name: 'id',
			accessorKey: 'id',
			accessorFn: row => row?._id,
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Name',
			accessorKey: 'displayName',
			name: 'displayName',
			accessorFn: row => row?.displayName || '',
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'User Email',
			accessorKey: 'email',
			name: 'email',
			accessorFn: row => row?.email,
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Role',
			accessorKey: 'role',
			name: 'role',
			accessorFn: row => UserRole[row?.role] || '',
			Cell: ({ row }) => {
				const value = row?.original?.role;
				// Use the enum to get the user-friendly name for the role
				const displayValue = UserRole[value] || '';
				return <>{displayValue}</>;
			},
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Role Privileges',
			accessorKey: 'rolePrivileges',
			name: 'rolePrivileges',
			accessorFn: row => RolePrivilege[row?.rolePrivileges] || '',
			Cell: ({ row }) => {
				const value = row?.original?.rolePrivileges;
				// Use the enum to get the user-friendly name for the role privileges
				const displayValue = RolePrivilege[value] || '';
				return <>{displayValue}</>;
			},
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Last Login',
			accessorKey: 'lastLogin',
			name: 'lastLogin',
			accessorFn: row => (row?.lastLogin ? moment(row?.lastLogin).format('MM/DD/YYYY') || '' : ''),
		},
	],
};

export default UserManagementMeta;
