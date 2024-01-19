import { get } from "lodash";

const onClickedRow = selectedRow => { };

const GenericMeta = {
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
	generateSchema: (keys, rows) => keys.map(key => ({
		size: 250,
		isPinned: false,
		hidden: false,
		filter: false,
		isSearchField: false,
		enableSorting: false,
		type: 'string',
		name: key,
		accessorKey: key,
		accessorFn: (row) => {
			let value = get(row, key);

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
	})),
};

export default GenericMeta;
