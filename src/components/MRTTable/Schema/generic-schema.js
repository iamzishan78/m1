import { get } from 'lodash';

// eslint-disable-next-line no-unused-vars
const onClickedRow = selectedRow => {};

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
	// eslint-disable-next-line no-unused-vars
	generateSchema: (keys, rows) =>
		keys.map(key => ({
			size: 250,
			isPinned: false,
			hidden: false,
			filter: false,
			isSearchField: false,
			enableSorting: false,
			type: 'string',
			name: key,
			id: key,
			accessorFn: row => {
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
