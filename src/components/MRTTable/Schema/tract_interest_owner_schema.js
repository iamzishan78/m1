import { tableController, tableGlobalController } from 'hookstate/tableController';
import NameCell from 'components/MRTTable/TablesOverride/OwnersPerUnit/TableCell/NameCell';
import ListChips from 'components/Common/ListChips';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import IsContactCell from 'components/MRTTable/Common/TableCells/isContactIcone';
import ContactActionMenu from 'components/MRTTable/Common/TableCells/ContactActionMenu';
import TractInterestOwnerToolBar from 'components/MRTTable/TablesOverride/TractInterestOwnerTable/TractInterestOwnerToolBar';
import { addTrailingZeros } from 'components/Shared/functions';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';

const esIndex = 'shapeowners_flat';

const onClickedRow = selectedRow => {
	console.log('selectedRow', selectedRow)
	const Controller = tableController('TractPerUnitTable');
	const { customLayer } = Controller.getValue('customProps');
	tableGlobalController.updateState({
		tractInterestDialog: {
			type: 'addTractInterest',
			customLayerId: customLayer?._id,
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
			...CommonSchema.HIDDEN,
			name: '_id',
			accessorKey: '_id',
		},

		{
			...CommonSchema.HIDDEN,
			name: 'ownerEntity',
			accessorKey: 'ownerEntity',
		},

		{
			...CommonSchema.INITAIL_PINNED,
			name: 'contact.entityDetail.name.keyword',
			accessorFn: row => row?.contact?.entityDetail?.name,
			id: 'contact.entityDetail.name',
			header: 'Owner Name',
			Cell: ({ renderedCellValue, row }) => (
				<NameCell renderedCellValue={renderedCellValue} isPurchased={row.getValue('contact.isPurchased')} />
			),
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'contact.ownerType.keyword',
			accessorKey: 'contact.ownerType',
			header: 'Entity Type',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'surface_interest',
			accessorKey: 'surface_interest',
			header: 'Surface Interest',
			isSearchField: false,
			type: 'number',
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
			...CommonSchema.COMMON_COLUMN,
			name: 'mineral_interest',
			accessorKey: 'mineral_interest',
			header: 'Mineral Interest',
			isSearchField: false,
			type: 'number',
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
			...CommonSchema.COMMON_COLUMN,
			name: 'royalty_interest',
			accessorKey: 'royalty_interest',
			header: 'Royalty Interest',
			isSearchField: false,
			type: 'number',
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
			...CommonSchema.COMMON_COLUMN,
			name: 'orri',
			accessorKey: 'orri',
			header: 'ORRI',
			size: 230,
			isSearchField: false,
			type: 'number',
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

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'record_title',
			accessorKey: 'record_title',
			header: 'Record Title',
			isSearchField: false,
			type: 'number',
			Cell: ({ row }) => {
				const recordTiitle = row.getValue('record_title');
				if (recordTiitle) {
					return <>{addTrailingZeros(parseFloat(recordTiitle).toFixed(8))}</>;
				}
			},
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'operating_rights',
			accessorKey: 'operating_rights',
			header: 'Working Interest',
			isSearchField: false,
			type: 'number',
			Cell: ({ row }) => {
				const operatingRights = row.getValue('operating_rights');
				if (operatingRights) {
					return <>{addTrailingZeros(parseFloat(operatingRights).toFixed(8))}</>;
				}
			},
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'nri',
			accessorKey: 'nri',
			header: 'NRI',
			isSearchField: false,
			type: 'number',
			Cell: ({ row }) => {
				const nri = row.getValue('nri');
				if (nri) {
					return <>{addTrailingZeros(parseFloat(nri).toFixed(8))}</>;
				}
			},
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'net_acres',
			accessorKey: 'net_acres',
			header: 'Net Acres',
			isSearchField: false,
			type: 'number',
			Cell: ({ row }) => {
				const netAcres = row.getValue('net_acres');
				if (netAcres) {
					return <>{addTrailingZeros(parseFloat(netAcres).toFixed(8))}</>;
				}
			},
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'company_net_acres',
			accessorKey: 'company_net_acres',
			header: 'Co Net Acres',
			isSearchField: false,
			type: 'number',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'nra',
			accessorKey: 'nra',
			header: 'NRA',
			isSearchField: false,
			type: 'number',
			Cell: ({ row }) => {
				const nra = row.getValue('nra');
				if (nra) {
					return <>{addTrailingZeros(parseFloat(nra).toFixed(8))}</>;
				}
			},
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'depthFrom.keyword',
			accessorKey: 'depthFrom',
			header: 'Depth From',
			isSearchField: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'depthTo.keyword',
			accessorKey: 'depthTo',
			header: 'Depth To',
			isExternalFilter: false,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'deals.name.keyword',
			accessorKey: 'deals.name',
			isExport: 'dealsName',
			header: 'Associated Deals',
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
			...CommonSchema.TAGS,
			Cell: ({ row }) => {
				const targetSourceId = row.getValue('ownerEntity');
				return <TagCell id={targetSourceId} targetSourceId={targetSourceId} tags={row?.original?.tags} targetLabel={'Parcel Ownership'} />;
			},
		},

		{
			...CommonSchema.ACTION_COLUMN,
			name: 'isContact',
			accessorKey: 'isContact',
			Cell: ({ row }) => {
				const ownerEntity = row.getValue('ownerEntity');
				return <IsContactCell contactId={ownerEntity} />;
			},
		},

		{
			...CommonSchema.COMMENTS,
			Cell: ({ renderedCellValue, row }) => {
				const id = row.getValue('ownerEntity');
				return <CommentCell id={id} value={renderedCellValue.length} targetLabel={'Parcel Ownership'} />;
			},
		},

		{
			...CommonSchema.ACTION_COLUMN,
			name: 'actionMenu',
			accessorKey: 'actionMenu',
			Cell: ({ row }) => {
				const id = row.getValue('_id');
				const name = row.getValue('name');

				return <ContactActionMenu id={id} name={name} esIndex={esIndex} dialogType="tractInterestDialog" />;
			},
		},

		{
			...CommonSchema.HIDDEN,
			name: 'contact.isPurchased',
			accessorKey: 'contact.isPurchased',
		},
	],
};

export default TractPerUnitMeta;
