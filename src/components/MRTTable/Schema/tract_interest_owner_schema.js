import { tableController, tableGlobalController } from 'hookstate/tableController';
import NameCell from 'components/MRTTable/TablesOverride/OwnersPerUnit/TableCell/NameCell';
import ListChips from 'components/Common/ListChips';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import IsContactCell from 'components/MRTTable/Common/TableCells/isContactIcone';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import ContactActionMenu from 'components/MRTTable/Common/TableCells/ContactActionMenu';
import TractInterestOwnerToolBar from 'components/MRTTable/TablesOverride/TractInterestOwnerTable/TractInterestOwnerToolBar';
import { addTrailingZeros } from 'components/Shared/functions';

const esIndex = 'shapeowners_flat';

const onClickedRow = selectedRow => {
	const Controller = tableController('TractPerUnitTable');
	const { customLayer } = Controller.getValue('customProps');
	tableGlobalController.updateState({
		tractInterestDialog: {
			type: 'addTractInterest',
			customLayerId: customLayer._id,
			customLayer,
			selectedRow,
		},
	});
};

const TractPerUnitMeta = {
	esIndex,
	pageSize: 25,
	pagination: {
		pageIndex: 0,
		pageSize: 25,
	},
	CustomToolBar: TractInterestOwnerToolBar,
	onClickedRow,
	defaultSort: { field: '_ts', order: 'asc' },
	height: '700px',
	isInFiniteScroll: true,
	columnVirtualization: true,

	TableSchema: [
		{
			name: '_id',
			accessorKey: '_id',
			isSearchField: false,
			hidden: true,
			enablePinning: false,
			enableHiding: false,
			enableColumnActions: false,
			enableColumnOrdering: false,
			enableSorting: false,
		},

		{
			name: 'ownerEntity',
			accessorKey: 'ownerEntity',
			isSearchField: false,
			hidden: true,
			enablePinning: false,
			enableHiding: false,
			enableColumnActions: false,
			enableColumnOrdering: false,
			enableSorting: false,
		},

		{
			name: 'contact.entityDetail.name.keyword',
			accessorFn: row => row?.contact?.entityDetail?.name,
			id: 'contact.entityDetail.name',
			header: 'Owner Name',
			size: 270,
			isPinned: true,
			enableHiding: false,
			filter: true,
			type: 'string',
			isExternalFilter: false,
			enableColumnActions: true,
			enableColumnOrdering: false,
			enableSorting: true,
			isSearchField: true,
			Cell: ({ renderedCellValue, row }) => (
				<NameCell renderedCellValue={renderedCellValue} isPurchased={row.getValue('contact.isPurchased')} />
			),
		},

		{
			name: 'contact.ownerType.keyword',
			accessorKey: 'contact.ownerType',
			header: 'Entity Type',
			size: 230,
			isPinned: false,
			filter: true,
			type: 'string',
			enableSorting: true,
			isExternalFilter: false,
			isSearchField: true,
		},

		{
			name: 'surface_interest',
			accessorKey: 'surface_interest',
			header: 'Surface Interest',
			size: 230,
			isPinned: false,
			filter: true,
			type: 'string',
			enableSorting: true,
			isExternalFilter: false,
			isSearchField: false,
			Aggregation: {
				sumSurfaceInterest: {
					sum: { field: 'surface_interest' },
				},
			},
			Cell: ({ row }) => {
				const surfaceInterest = row.getValue('surface_interest');
				if (surfaceInterest) {
					return <>{addTrailingZeros(parseFloat(surfaceInterest).toFixed(8))}</>;
				}
			},
			Footer: () => {
				const Controller = tableController('TractPerUnitTable');
				const { sumSurfaceInterest } = Controller.getValue('footerProps') || {};
				return (
					<div>
						{sumSurfaceInterest?.value ? addTrailingZeros(parseFloat(sumSurfaceInterest?.value).toFixed(8)) : 0}
					</div>
				);
			},
		},

		{
			name: 'mineral_interest',
			accessorKey: 'mineral_interest',
			header: 'Mineral Interest',
			size: 230,
			isPinned: false,
			filter: true,
			type: 'string',
			enableSorting: true,
			isExternalFilter: false,
			isSearchField: false,
			Aggregation: {
				sumMineralInterest: {
					sum: { field: 'mineral_interest' },
				},
			},
			Cell: ({ row }) => {
				const mineralInterest = row.getValue('mineral_interest');
				if (mineralInterest) {
					return <>{addTrailingZeros(parseFloat(mineralInterest).toFixed(8))}</>;
				}
			},
			Footer: () => {
				const Controller = tableController('TractPerUnitTable');
				const { sumMineralInterest } = Controller.getValue('footerProps') || {};
				return (
					<div>
						{sumMineralInterest?.value ? addTrailingZeros(parseFloat(sumMineralInterest?.value).toFixed(8)) : 0}
					</div>
				);
			},
		},

		{
			name: 'royalty_interest',
			accessorKey: 'royalty_interest',
			header: 'Royalty Interest',
			size: 230,
			isPinned: false,
			filter: true,
			type: 'string',
			enableSorting: true,
			isExternalFilter: false,
			isSearchField: false,
			Aggregation: {
				sumRoyaltyInterest: {
					sum: { field: 'royalty_interest' },
				},
			},
			Cell: ({ row }) => {
				const royaltyInterest = row.getValue('royalty_interest');
				if (royaltyInterest) {
					return <>{addTrailingZeros(parseFloat(royaltyInterest).toFixed(8))}</>;
				}
			},
			Footer: () => {
				const Controller = tableController('TractPerUnitTable');
				const { sumRoyaltyInterest } = Controller.getValue('footerProps') || {};
				return (
					<div>
						{sumRoyaltyInterest?.value ? addTrailingZeros(parseFloat(sumRoyaltyInterest?.value).toFixed(8)) : 0}
					</div>
				);
			},
		},

		{
			name: 'orri',
			accessorKey: 'orri',
			header: 'ORRI',
			size: 230,
			isPinned: false,
			filter: true,
			type: 'string',
			enableSorting: true,
			isExternalFilter: false,
			isSearchField: false,
			Aggregation: {
				sumORRI: {
					sum: { field: 'orri' },
				},
			},
			Cell: ({ row }) => {
				const orri = row.getValue('orri');
				if (orri) {
					return <>{addTrailingZeros(parseFloat(orri).toFixed(8))}</>;
				}
			},
			Footer: () => {
				const Controller = tableController('TractPerUnitTable');
				const { sumORRI } = Controller.getValue('footerProps') || {};
				return <div>{sumORRI?.value ? addTrailingZeros(parseFloat(sumORRI?.value).toFixed(8)) : 0}</div>;
			},
		},

		// {
		// 	name: 'unknown_interest',
		// 	accessorKey: 'unknown_interest',
		// 	header: 'Unknown Interest',
		// 	size: 230,
		// 	isPinned: false,
		// 	filter: true,
		// 	type: 'string',
		// 	enableSorting: true,
		// 	isExternalFilter: false,
		// 	isSearchField: false,
		// },

		{
			name: 'record_title',
			accessorKey: 'record_title',
			header: 'Record Title',
			size: 230,
			isPinned: false,
			filter: true,
			type: 'string',
			enableSorting: true,
			isExternalFilter: false,
			isSearchField: false,
			Cell: ({ row }) => {
				const recordTiitle = row.getValue('record_title');
				if (recordTiitle) {
					return <>{addTrailingZeros(parseFloat(recordTiitle).toFixed(8))}</>;
				}
			},
		},

		{
			name: 'operating_rights',
			accessorKey: 'operating_rights',
			header: 'Working Interest',
			size: 230,
			isPinned: false,
			filter: true,
			type: 'string',
			enableSorting: true,
			isExternalFilter: false,
			isSearchField: false,
			Cell: ({ row }) => {
				const operatingRights = row.getValue('operating_rights');
				if (operatingRights) {
					return <>{addTrailingZeros(parseFloat(operatingRights).toFixed(8))}</>;
				}
			},
		},

		{
			name: 'nri',
			accessorKey: 'nri',
			header: 'NRI',
			size: 230,
			isPinned: false,
			filter: true,
			type: 'string',
			enableSorting: true,
			isExternalFilter: false,
			isSearchField: false,
			Cell: ({ row }) => {
				const nri = row.getValue('nri');
				if (nri) {
					return <>{addTrailingZeros(parseFloat(nri).toFixed(8))}</>;
				}
			},
		},

		{
			name: 'net_acres',
			accessorKey: 'net_acres',
			header: 'Net Acres',
			size: 230,
			isPinned: false,
			filter: true,
			type: 'string',
			enableSorting: true,
			isExternalFilter: false,
			isSearchField: false,
			Cell: ({ row }) => {
				const netAcres = row.getValue('net_acres');
				if (netAcres) {
					return <>{addTrailingZeros(parseFloat(netAcres).toFixed(8))}</>;
				}
			},
		},

		{
			name: 'company_net_acres',
			accessorKey: 'company_net_acres',
			header: 'Co Net Acres',
			size: 230,
			isPinned: false,
			filter: true,
			type: 'number',
			enableSorting: true,
			isExternalFilter: false,
			isSearchField: false,
		},

		{
			name: 'nra',
			accessorKey: 'nra',
			header: 'NRA',
			size: 230,
			isPinned: false,
			filter: true,
			type: 'string',
			enableSorting: true,
			isExternalFilter: false,
			isSearchField: false,
			Cell: ({ row }) => {
				const nra = row.getValue('nra');
				if (nra) {
					return <>{addTrailingZeros(parseFloat(nra).toFixed(8))}</>;
				}
			},
		},

		{
			name: 'depthFrom.keyword',
			accessorKey: 'depthFrom',
			header: 'Depth From',
			size: 250,
			isPinned: false,
			filter: true,
			type: 'string',
			enableSorting: true,
			isExternalFilter: false,
			isSearchField: true,
		},

		{
			name: 'depthTo.keyword',
			accessorKey: 'depthTo',
			header: 'Depth To',
			size: 250,
			isPinned: false,
			filter: true,
			type: 'string',
			enableSorting: true,
			isSearchField: true,
			isExternalFilter: false,
		},

		{
			name: 'deals.name.keyword',
			accessorKey: 'deals',
			isExport: 'dealsName',
			header: 'Associated Deals',
			size: 250,
			isPinned: false,
			filter: true,
			type: 'string',
			enableSorting: true,
			isExternalFilter: false,
			isSearchField: true,
			Cell: ({ row }) => {
				return (
					<div>
						{(row?.original?.deals && Array.isArray(row?.original?.deals)) ? (
							<div
								style={{
									display: 'flex',
									flexWrap: 'wrap',
								}}
							>
								<ListChips list={row?.original?.deals} />
							</div>
						) : (
							<div />
						)}
					</div>
				);
			},
		},

		{
			name: 'tags.tag.keyword',
			accessorKey: 'tags.tag',
			header: 'Tags',
			size: 270,
			isPinned: false,
			filter: false,
			type: 'string',
			isExternalFilter: false,
			enableSorting: false,
			enableColumnFilter: false,
			isSearchField: false,
			enableColumnActions: false,
			enableColumnOrdering: false,
			enableResizing: false,
			Cell: ({ row }) => {
				const targetSourceId = row.getValue('ownerEntity');
				return <TagCell id={targetSourceId} targetSourceId={targetSourceId} tags={row?.original?.tags} />;
			},
		},

		{
			name: 'isContact',
			accessorKey: 'isContact',
			enablePinning: false,
			enableHiding: false,
			enableColumnActions: false,
			enableSorting: false,
			size: 100,
			enableColumnFilter: false,
			isSearchField: false,
			enableColumnOrdering: false,
			enableResizing: false,
			Cell: ({ row }) => {
				const ownerEntity = row.getValue('ownerEntity');
				return <IsContactCell contactId={ownerEntity} />;
			},
		},

		{
			name: 'commentsCounter',
			accessorKey: 'comments',
			enablePinning: false,
			enableHiding: false,
			enableColumnActions: false,
			enableSorting: false,
			size: 100,
			enableColumnFilter: false,
			isSearchField: false,
			enableColumnOrdering: false,
			enableResizing: false,
			Cell: ({ renderedCellValue, row }) => {
				const ownerEntity = row.getValue('ownerEntity');

				return <CommentCell id={ownerEntity} value={renderedCellValue?.length || 0} />;
			},
		},

		{
			name: 'actionMenu',
			accessorKey: 'actionMenu',
			enablePinning: false,
			enableHiding: false,
			enableColumnActions: false,
			enableSorting: false,
			size: 100,
			enableColumnFilter: false,
			isSearchField: false,
			enableColumnOrdering: false,
			enableResizing: false,
			Cell: ({ row }) => {
				const id = row.getValue('_id');
				const name = row.getValue('name');

				return <ContactActionMenu id={id} name={name} esIndex={esIndex} dialogType="tractInterestDialog" />;
			},
		},

		{
			name: 'contact.isPurchased',
			accessorKey: 'contact.isPurchased',
			isSearchField: false,
			enablePinning: false,
			enableHiding: false,
			hidden: true,
			enableColumnActions: false,
			enableSorting: false,
		},
	],
};

export default TractPerUnitMeta;
