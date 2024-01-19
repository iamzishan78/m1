import { get } from 'lodash';
import FlyToMap from 'components/MRTTable/Common/TableCells/coordinates_fly_map';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';

const onClickedRow = selectedRow => { };

const ShapesFilesGenericMeta = {
	pageSize: 25,
	pagination: {
		pageIndex: 0,
		pageSize: 25,
	},
	onClickedRow,
	maxTableHeight: 'calc(100vh - 489px)',
	// isInFiniteScroll: true,
	// columnVirtualization: true,
	defaultFlterMode: 'multiselect',
	isGeneric: true,
	density: 'compact',
	TableSchema: [],

	esIndex: 'shapefile_flat',
	orderKeys: ['_id', 'id', 'ID', 'layerShapeName', 'layerGeometry', 'geometry'],
	excludedKeys: ['sort', 'file', 'IsDeleted', 'isDeleted', 'flatSyncAt'],
	nestedKey: 'properties',
	generateSchema: (keys, rows) => {
		const baseKeys = ['_id', 'id', 'geometry'];

		keys.splice(3, 0, 'actions');

		return keys.map(key => {
			if (key === 'actions')
				return {
					...CommonSchema.ACTION_COLUMN,
					showInLast: false,
					name: 'coordinates',
					accessorKey: 'coordinates',
					header: '',
					size: 70,
					Cell: ({ row }) => {
						const id = row.getValue('_id');

						return <FlyToMap id={id} />;
					},
				};

			let accessorKey;
			if (baseKeys.includes(key)) accessorKey = key;
			else accessorKey = `properties.${key}`;

			const value = rows.find(r => !!r[accessorKey])?.[accessorKey];

			let filter = false;
			let isSearchField = false;
			let enableSorting = false;
			let type = 'string';

			if (typeof value !== 'object') {
				const isNumberKey = isNaN(value);

				filter = true;
				if (isNumberKey) type = 'number';
				if (!isNumberKey) isSearchField = true;
			}

			return {
				size: ['id', 'ID'].includes(key) ? 150 : 250,
				isPinned: false,
				hidden: key === '_id',
				filter,
				isSearchField,
				enableSorting,
				type,
				name: accessorKey,
				id: accessorKey,
				accessorFn: row => {
					let value = get(row, accessorKey);

					switch (typeof value) {
						case 'object':
							value = JSON.stringify(value);
							break;

						case 'string':
							break;

						default:
							break;
					}

					return value;
				},
				header: key,
			};
		});
	},
};

export default ShapesFilesGenericMeta;
