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
};

export default GenericMeta;
