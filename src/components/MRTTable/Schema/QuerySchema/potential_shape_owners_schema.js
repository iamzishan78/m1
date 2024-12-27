import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import IsContactCell from 'components/MRTTable/Common/TableCells/isContactIcone';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import PotentialShapeOwnersToolbar from 'components/MRTTable/TablesOverride/PotentialShapeOwnersTable/PotentialShapeOwnersToolbar';
import { getPolygonString } from 'components/Shared/functions';

import { SHAPE_OWNERS } from 'graphQL/useQueryPaginatedShapeOwners';

import { globalStateController } from 'hookstate/globalStateController';
import { tableController } from 'hookstate/tableController';

const PotentialShapeOwnersMeta = {
	query: SHAPE_OWNERS,
	additionalQueries: ['comments', 'tags', 'isContact'],
	maxTableHeight: 'calc(100vh - 461px)',
	getVariables: tableMeta => {
		const { customLayer } = tableMeta?.customProps || {};

		if (!customLayer) {
			return;
		}

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
			polygon,
			userId: user._id,
		};
	},
	getDataFromRes: res => res?.data?.paginatedShapeOwners?.edges?.map(edge => edge.node) || [],
	getIdsFromRows: rows => rows?.map(row => row?.id) || [],
	CustomToolBar: PotentialShapeOwnersToolbar,
	isClientSide: true,
	isSelectAllAllowed: true,
	isDeleteAllowed: false,
	isExportAllowed: false,
	enableFacetedValues: true,
	TableSchema: [
		{
			...CommonSchema.HIDDEN,
			name: 'id',
			id: 'id',
			accessorFn: row => row?.id,
		},
		{
			...CommonSchema.HIDDEN,
			name: 'entity',
			id: 'entity',
			accessorFn: row => row?.entity,
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Name',
			id: 'name',
			name: 'name',
			accessorFn: row => row?.name,
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Entity Type',
			id: 'ownershipType',
			name: 'ownershipType',
			accessorFn: row => row?.ownershipType,
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Street Address',
			id: 'StreetAddress',
			name: 'StreetAddress',
			accessorFn: row => row?.StreetAddress,
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'City',
			id: 'City',
			name: 'City',
			accessorFn: row => row?.City,
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'State',
			id: 'State',
			name: 'State',
			accessorFn: row => row?.State,
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Zip Code',
			id: 'Zip',
			name: 'Zip',
			accessorFn: row => row?.Zip,
		},

		{
			...CommonSchema.TAGS,
			Cell: ({ row }) => {
				const id = row.getValue('id');
				let tags = row?.original?.tags;

				const Controller = tableController('PotentialShapeOwnersTable');
				const { stateValues } = Controller.useState(['tagsList']);

				tags = stateValues.tagsList?.find(tag => tag._id === id)?.tags || tags;

				return (
					<TagCell
						id={id}
						targetSourceId={id}
						tags={tags}
						targetLabel={'well'}
						tableKey={'PotentialShapeOwnersTable'}
					/>
				);
			},
		},
		{
			...CommonSchema.ACTION_COLUMN,
			name: 'isContact',
			id: 'isContact',
			Cell: ({ row }) => {
				const Controller = tableController('PotentialShapeOwnersTable');
				const { stateValues } = Controller.useState(['ownersWhoAreContact', 'data']);

				const contact = stateValues.ownersWhoAreContact?.find(contact => contact?.globalOwner === row?.original?.id);

				return <IsContactCell contactId={contact?._id || 'false'} rows={[row.original.node]} />;
			},
		},
		{
			...CommonSchema.COMMENTS,
			Cell: ({ renderedCellValue, row }) => {
				const id = row.getValue('id');

				let value = renderedCellValue?.length || 0;

				const Controller = tableController('PotentialShapeOwnersTable');
				const { stateValues } = Controller.useState(['commentsCounter']);

				value = stateValues.commentsCounter?.find(counter => counter._id === id)?.total || value;

				return <CommentCell id={id} value={value} targetLabel={'well'} tableKey={'PotentialShapeOwnersTable'} />;
			},
		},
	],
};

export default PotentialShapeOwnersMeta;
