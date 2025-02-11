import UserManagementToolbar from 'components/MRSimpleTable/TablesOverride/UserManagementTable/UserManagementToolbar';
import moment from 'moment';
import { CommonSchema } from './common_schema';
import { GET_ALL_USERS } from 'graphQL/userManagement';
import { simpleTableGlobalController } from 'hookstate/simpleTableController';
import Grid from '@material-ui/core/Grid';
import ColumnWithLink from 'components/Common/MRTable/ColumnWithLink';


export const userManagementTableKey = 'UserManagement';

const UserManagementMeta = {
	query: GET_ALL_USERS,
	maxTableHeight: 'calc(100vh - 495px)',
	getVariables: tableMeta => {
		return {};
	},
	getDataFromRes: res => res?.data?.users || [],
	getIdsFromRows: rows => rows?.map(row => row?._id) || [],
	CustomToolBar: UserManagementToolbar,
	defaultHeader: {
		label: 'User Management',
	},
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
			isPinned: true,
			Cell: ({ row }) => {
				return (
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							minWidth: '500px',
							maxWidth: '500px',
						}}
					>
						<Grid
							container
							spacing={0}
							direction="row"
							style={{
								position: 'absolute',
								overflow: 'hidden',
								whiteSpace: 'nowrap',
								textOverflow: 'ellipsis',
								alignItems: 'center',

								'&:hover': {
									'& $actionButtons': {
										display: 'flex',
									},
								},
							}}
						>
							<Grid
								item
								style={{
									display: 'flex',
									justifyContent: 'flex-start',
								}}
							>
								<ColumnWithLink
									value={row?.original?.displayName}
									link={''}
									onClick={e => {
										e.stopPropagation();
										if (row?.original?._id) {
											simpleTableGlobalController.updateState({
												dialog: {
													type: 'inviteUser',
													activeUser: row?.original,
												},
											});
										}
									}}
								/>
							</Grid>
						</Grid>
					</div>
				);
			},
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
			accessorFn: row => row?.role || '',
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Role Privileges',
			accessorKey: 'rolePrivileges',
			name: 'rolePrivileges',
			accessorFn: row => row?.rolePrivileges || '',
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Last Login',
			accessorKey: 'ts',
			name: 'ts',
			accessorFn: row => moment(row?.ts).format('MM/DD/YYYY') || '',
		},
	],
};

export default UserManagementMeta;
