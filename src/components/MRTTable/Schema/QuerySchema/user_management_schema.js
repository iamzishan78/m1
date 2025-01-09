/* eslint-disable react/prop-types */
import React from 'react';

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
	getVariables: () => {
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
	isExportDisabled: true,
	enableFacetedValues: true,
	TableSchema: [
		{
			...CommonSchema.HIDDEN,
			name: 'id',
			id: 'id',
		},
		{
			...CommonSchema.SELECT_STRING_COLUMN,
			header: 'Name',
			id: 'displayName',
			name: 'displayName',
		},
		{
			...CommonSchema.SELECT_STRING_COLUMN,
			header: 'User Email',
			id: 'email',
			name: 'email',
		},
		{
			...CommonSchema.SELECT_STRING_COLUMN,
			header: 'Role',
			id: 'role',
			name: 'role',
			Cell: ({ row }) => {
				const value = row?.original?.role;
				// Use the enum to get the user-friendly name for the role
				const displayValue = UserRole[value] || '';
				return <>{displayValue}</>;
			},
		},
		{
			...CommonSchema.SELECT_STRING_COLUMN,
			header: 'Role Privileges',
			id: 'rolePrivileges',
			name: 'rolePrivileges',
			Cell: ({ row }) => {
				const value = row?.original?.rolePrivileges;
				// Use the enum to get the user-friendly name for the role privileges
				const displayValue = RolePrivilege[value] || '';
				return <>{displayValue}</>;
			},
		},
		{
			...CommonSchema.SELECT_STRING_COLUMN,
			header: 'Last Login',
			id: 'lastLogin',
			name: 'lastLogin',
		},
	],
};

export default UserManagementMeta;
