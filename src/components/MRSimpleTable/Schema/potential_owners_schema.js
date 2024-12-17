import CommentCell from 'components/MRSimpleTable/Common/TableCells/Comment';
import TagCell from 'components/MRSimpleTable/Common/TableCells/Tag';
import IsContactCell from 'components/MRSimpleTable/Common/TableCells/isContactIcone';
import PotentialOwnersToolbar from 'components/MRSimpleTable/TablesOverride/PotentialOwnersTable/PotentialOwnersToolbar';
import { globalStateController } from 'hookstate/globalStateController';
import { getPolygonString } from 'components/Shared/functions';
import { SHAPE_WELL_OWNERS } from 'graphQL/useQueryPaginatedShapeWellOwners';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';

export const potentialOwnerTableKey = 'PotentialOwners';

const PotentialOwnersMeta = {
	query: SHAPE_WELL_OWNERS,
	additionalQueries: ['comments', 'tags'],
	maxTableHeight: 'calc(100vh - 440px)',
	getVariables: tableMeta => {
		const { customLayer, year, filterByWells } = tableMeta?.customProps || {};

		if (!customLayer) return;

		const polygon = getPolygonString(customLayer?.shape);
		const user = globalStateController.getValue('user');

		return {
			pagination: {
				first: 10000,
				after: null,
			},
			sort: {},
			filters: [],
			search: '',
			selectedYear: `${year || ''}`,
			filterByWells: filterByWells ? customLayer._id : '',
			polygon,
			userId: user._id,
		};
	},
	getDataFromRes: res => res?.data?.paginatedShapeWellOwners?.edges || [],
	getIdsFromRows: rows => rows?.map(row => row.node?.id) || [],
	CustomToolBar: PotentialOwnersToolbar,
	isSelectAllAllowed: true,
	isDeleteAllowed: false,
	isExportAllowed: false,
	enableFacetedValues: true,
	TableSchema: [
		{
			...CommonSchema.HIDDEN,
			name: 'id',
			accessorKey: 'id',
			accessorFn: row => row?.node?.id,
		},
		{
			...CommonSchema.HIDDEN,
			name: 'entity',
			accessorKey: 'entity',
			accessorFn: row => row?.node?.entity,
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Api Number',
			accessorKey: 'api',
			name: 'api',
			accessorFn: row => row?.node?.api,
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Well Name',
			accessorKey: 'wellName',
			name: 'wellName',
			accessorFn: row => row?.node?.wellName,
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Lease',
			accessorKey: 'lease',
			name: 'lease',
			accessorFn: row => row?.node?.lease,
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Lease Number',
			accessorKey: 'leaseNumber',
			name: 'leaseNumber',
			accessorFn: row => row?.node?.leaseNumber,
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Owner Name',
			accessorKey: 'name',
			name: 'name',
			accessorFn: row => row?.node?.name,
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Entity Type',
			accessorKey: 'ownershipType',
			name: 'ownershipType',
			accessorFn: row => row?.node?.ownershipType,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Owner Address',
			accessorKey: 'StreetAddress',
			name: 'StreetAddress',
			accessorFn: row => row?.node?.StreetAddress,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'City',
			accessorKey: 'City',
			name: 'City',
			accessorFn: row => row?.node?.City,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'State',
			accessorKey: 'State',
			name: 'State',
			accessorFn: row => row?.node?.State,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Zip',
			accessorKey: 'Zip',
			name: 'Zip',
			accessorFn: row => row?.node?.Zip,
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Type',
			accessorKey: 'interestType',
			name: 'interestType',
			accessorFn: row => row?.node?.interestType,
		},
		{
			...CommonSchema.NUMBER_COLUMN,
			header: 'Interest',
			accessorKey: 'ownershipPercentage',
			name: 'ownershipPercentage',
			accessorFn: row => row?.node?.ownershipPercentage,
		},
		{
			...CommonSchema.NUMBER_COLUMN,
			header: 'Tax Value',
			accessorKey: 'appraisedValue',
			name: 'appraisedValue',
			accessorFn: row => row?.node?.appraisedValue,
		},
		{
			...CommonSchema.TAGS,
			Cell: ({ row }) => {
				const id = row.getValue('id');
				return (
					<TagCell
						id={id}
						targetSourceId={id}
						tags={row?.original?.tags}
						targetLabel={'well'}
						tableKey={potentialOwnerTableKey}
					/>
				);
			},
		},
		{
			...CommonSchema.ACTION_COLUMN,
			name: 'isContact',
			accessorKey: 'isContact',
			Cell: ({ row }) => {
				return <IsContactCell contactId={'false'} rows={[row.original.node]} />;
			},
		},
		{
			...CommonSchema.COMMENTS,
			Cell: ({ renderedCellValue, row }) => {
				const id = row.getValue('id');
				return (
					<CommentCell
						id={id}
						value={renderedCellValue?.length || 0}
						targetLabel={'well'}
						tableKey={potentialOwnerTableKey}
					/>
				);
			},
		},
	],
};

export default PotentialOwnersMeta;
