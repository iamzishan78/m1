import { get } from 'lodash';
import FlyToMap from 'components/MRTTable/Common/TableCells/coordinates_fly_map';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import { popupController } from 'hookstate/popupStateController';
import { drawBoundary } from 'components/MapControls/components/DrawShapes/drawShapesHelpers';

const onClickedRow = selectedRow => {};

const ShapesFilesGenericMeta = {
	pageSize: 25,
	pagination: {
		pageIndex: 0,
		pageSize: 25,
	},
	onClickedRow,
	maxTableHeight: 'calc(100vh - 290px)',
	isInFiniteScroll: true,
	isElasticQuery: false,
	// columnVirtualization: true,
	defaultFlterMode: 'multiselect',
	globalSearch: true,
	isGeneric: true,
	enableHiding: false,
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
						const Action = () => {
							drawBoundary(row.original);
							popupController.updateState({ selectedShapeFile: row.original });
						};
						return <FlyToMap id={id} Action={Action} type="shapefile" />;
					},
				};

			let accessorKey;
			if (baseKeys.includes(key)) accessorKey = key;
			else accessorKey = `properties.${key}`;

			const value = rows.find(r => !!r[accessorKey])?.[accessorKey];

			let filter = false;
			let isSearchField = true;
			let enableSorting = true;
			let enableHiding = false;
			let enableColumnFilter = true;
			let type = 'custom';

			if (typeof value !== 'object') {
				const isNumberKey = !isNaN(value);

				filter = true;
				// if (isNumberKey) type = 'number';
				if ((!isNumberKey || typeof value === 'string') && accessorKey === key) isSearchField = true;
			} else {
				enableSorting = false;
				enableColumnFilter = false;
			}

			return {
				size: ['id', 'ID'].includes(key) ? 150 : 250,
				isPinned: false,
				hidden: key === '_id',
				filter,
				isSearchField,
				enableSorting,
				enableColumnFilter,
				enableHiding,
				type,
				name: `${accessorKey}${isSearchField ? '.keyword' : ''}`,
				id: accessorKey,
				accessorFn: row => {
					let value = get(row, accessorKey);

					switch (typeof value) {
						case 'object':
							value = value ? JSON.stringify(value) : value;
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
