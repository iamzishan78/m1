import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';

export const CommonSchema = {
	COMMENTS: {
		name: 'comments',
		accessorKey: 'comments',
		header: '',
		size: 120,
		isPinned: false,
		hidden: false,
		filter: false,
		isSearchField: false,
		enableSorting: false,
		type: 'string',
		enableColumnActions: false,
		enableHiding: false,
		enableColumnFilter: false,
		enableColumnOrdering: false,
		enableResizing: false,
		Cell: ({ renderedCellValue, row }) => {
			const id = row.getValue('_id');
			return <CommentCell id={id} value={renderedCellValue.length} />;
		},
	},
	TAGS: {
		name: 'tags.tag.keyword',
		accessorKey: 'tags.tag',
		header: 'Tags',
		size: 250,
		isPinned: false,
		hidden: false,
		filter: true,
		isSearchField: true,
		enableSorting: true,
		type: 'string',
		enableColumnFilter: false,
		enableColumnActions: false,
		enableColumnOrdering: false,
		enableResizing: false,
		Cell: ({ row }) => {
			const targetSourceId = row.getValue('_id');
			return <TagCell id={targetSourceId} targetSourceId={targetSourceId} tags={row?.original?.tags} />;
		},
	},
	HIDDEN: {
		isSearchField: false,
		hidden: true,
		enablePinning: false,
		enableHiding: false,
		enableColumnActions: false,
		enableColumnOrdering: false,
		enableSorting: false,
	},
	INITAIL_PINNED: {
		isPinned: true,
		enableHiding: false,
		filter: true,
		type: 'string',
		isExternalFilter: false,
		enableColumnActions: true,
		enableColumnOrdering: false,
		size: 350,
	},
	COMMON_COLUMN: {
		size: 250,
		isPinned: false,
		hidden: false,
		filter: true,
		isSearchField: true,
		enableSorting: true,
		type: 'string',
	},
	ACTION_COLUMN: {
		isPinned: false,
		hidden: false,
		filter: true,
		isSearchField: false,
		enableSorting: true,
		enableColumnActions: false,
		enableHiding: false,
		type: 'string',
		enableColumnFilter: false,
		enableColumnOrdering: false,
		enableResizing: false,
	},
};
