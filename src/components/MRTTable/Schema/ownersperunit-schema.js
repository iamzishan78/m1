import vf_currency from 'components/Shared/valueformatters/vf_currency';
import CampaignNameField from 'components/ContactDetailCard/components/FieldContent/CampaignNameField';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import ContactActionMenu from 'components/MRTTable/Common/TableCells/ContactActionMenu';
import IsContactCell from 'components/MRTTable/Common/TableCells/isContactIcone';
import NameCell from 'components/MRTTable/TablesOverride/OwnersPerUnit/TableCell/NameCell';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import OwnersPerUnitToolBar from 'components/MRTTable/TablesOverride/OwnersPerUnit/OwnersPerUnitToolBar';
import { tableController, tableGlobalController } from 'hookstate/tableController';
import ListChips from 'components/Common/ListChips';
import { addTrailingZeros } from 'components/Shared/functions';

const esIndex = 'shapeowners_flat';

const onClickedRow = selectedRow => {
	const Controller = tableController('OwnersPerUnitTable');
	const { customLayer } = Controller.getValue('customProps');
	tableGlobalController.updateState({
		ownerPerUnitDialog: {
			type: 'addOwnerToUnit',
			shapeId: customLayer._id,
			uAcres: customLayer?.shapeJson?.properties?.uAcres,
			uUnitPricing: customLayer?.shapeJson?.properties?.uUnitPricing,
			shapeType: 'Unit',
			selectedRow,
		},
	});
};

const OwnersPerUnitMeta = {
	esIndex,
	pageSize: 25,
	pagination: {
		pageIndex: 0,
		pageSize: 25,
	},
	CustomToolBar: OwnersPerUnitToolBar,
	onClickedRow,
	defaultSort: { field: '_ts', order: 'asc' },
	// maxTableHeight: 'calc(100vh - 200px)',
	height: '767px',
	isInFiniteScroll: true,
	columnVirtualization: true,
	defaultFlterMode: 'multiselect',

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
			accessorKey: 'contact.entityDetail.name',
			isExport: 'name',
			header: 'Owner Name',
			enableColumnActions: true,
			enableColumnOrdering: true,
			size: 350,
			isPinned: true,
			enableHiding: false,
			filter: true,
			type: 'string',
			isExternalFilter: false,
			isSearchField: true,
			enableSorting: true,
			Cell: ({ renderedCellValue, row }) => {
				const isPurchased = row.getValue('contact.isPurchased');
				return <NameCell renderedCellValue={renderedCellValue} isPurchased={isPurchased} />;
			},
		},

		{
			name: 'contact.ownerType.keyword',
			accessorFn: row => row?.contact?.ownerType,
			id: 'contact.ownerType',
			header: 'Entity Type',
			size: 230,
			isPinned: false,
			filter: true,
			type: 'string',
			isExternalFilter: false,
			enableSorting: true,
			isSearchField: true,
			enableColumnOrdering: true,
		},

		{
			name: 'working_interest',
			accessorKey: 'working_interest',
			header: 'Working Interest',
			size: 230,
			isPinned: false,
			filter: true,
			type: 'number',
			isExternalFilter: false,
			isSearchField: true,
			enableColumnOrdering: true,
			Aggregation: {
				sumWorkingInterest: {
					sum: { field: 'working_interest' },
				},
			},
			enableSorting: true,
			Cell: ({ renderedCellValue }) => {
				if (renderedCellValue) {
					return <>{addTrailingZeros(parseFloat(renderedCellValue).toFixed(8))}</>;
				}
			},
			Footer: () => {
				const Controller = tableController('OwnersPerUnitTable');
				const { sumWorkingInterest } = Controller.getValue('footerProps') || {};
				return (
					<div>
						{sumWorkingInterest?.value ? addTrailingZeros(parseFloat(sumWorkingInterest?.value).toFixed(8)) : 0}
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
			type: 'number',
			isExternalFilter: false,
			enableSorting: true,
			isSearchField: true,
			enableColumnOrdering: true,
			Aggregation: {
				sumRoyaltyInterest: {
					sum: { field: 'royalty_interest' },
				},
			},
			Cell: ({ renderedCellValue }) => {
				if (renderedCellValue) {
					return <>{addTrailingZeros(parseFloat(renderedCellValue).toFixed(8))}</>;
				}
			},
			Footer: () => {
				const Controller = tableController('OwnersPerUnitTable');
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
			type: 'number',
			isExternalFilter: false,
			enableSorting: true,
			isSearchField: true,
			enableColumnOrdering: true,
			Aggregation: {
				sumOrri: {
					sum: { field: 'orri' },
				},
			},
			Cell: ({ renderedCellValue }) => {
				if (renderedCellValue) {
					return <>{addTrailingZeros(parseFloat(renderedCellValue).toFixed(8))}</>;
				}
			},
			Footer: () => {
				const Controller = tableController('OwnersPerUnitTable');
				const { sumOrri } = Controller.getValue('footerProps') || {};

				return <div>{sumOrri?.value ? addTrailingZeros(parseFloat(sumOrri?.value).toFixed(8)) : 0}</div>;
			},
		},

		{
			name: 'nri',
			accessorKey: 'nri',
			header: 'NRI',
			size: 230,
			isPinned: false,
			filter: true,
			type: 'number',
			isExternalFilter: false,
			enableSorting: true,
			isSearchField: true,
			enableColumnOrdering: true,
			Aggregation: {
				sumNri: {
					sum: { field: 'nri' },
				},
			},
			Cell: ({ renderedCellValue }) => {
				if (renderedCellValue) {
					return <>{addTrailingZeros(parseFloat(renderedCellValue).toFixed(8))}</>;
				}
			},
			Footer: () => {
				const Controller = tableController('OwnersPerUnitTable');
				const { sumNri } = Controller.getValue('footerProps') || {};
				return <div>{sumNri?.value ? addTrailingZeros(parseFloat(sumNri?.value).toFixed(8)) : 0}</div>;
			},
		},

		{
			name: 'nra',
			accessorKey: 'nra',
			header: 'NRA',
			size: 230,
			isPinned: false,
			filter: true,
			type: 'number',
			isExternalFilter: false,
			enableSorting: true,
			isSearchField: true,
			enableColumnOrdering: true,
		},

		{
			name: 'seller_asking_price',
			accessorKey: 'seller_asking_price',
			header: 'Seller Asking Price',
			size: 230,
			isPinned: false,
			filter: true,
			type: 'number',
			enableSorting: true,
			isExternalFilter: false,
			isSearchField: true,
			enableColumnOrdering: true,
			Cell: ({ renderedCellValue }) => <>{vf_currency(renderedCellValue)}</>,
		},

		{
			name: 'competitor_offer_price',
			accessorKey: 'competitor_offer_price',
			header: 'Competitor Offer Price',
			size: 270,
			isPinned: false,
			filter: true,
			type: 'number',
			isExternalFilter: false,
			enableSorting: true,
			isSearchField: true,
			enableColumnOrdering: true,
			Cell: ({ renderedCellValue }) => <>{vf_currency(renderedCellValue)}</>,
		},

		{
			name: 'offer_price',
			accessorKey: 'offer_price',
			header: 'Offer Price',
			size: 230,
			isPinned: false,
			filter: true,
			type: 'number',
			isExternalFilter: false,
			enableSorting: true,
			isSearchField: true,
			enableColumnOrdering: true,
			Cell: ({ renderedCellValue }) => <>{vf_currency(renderedCellValue)}</>,
		},

		{
			name: 'contact.contactStatus.keyword',
			accessorFn: row => row?.contact?.contactStatus,
			id: 'contact.contactStatus',
			header: 'Status',
			size: 230,
			isPinned: false,
			filter: true,
			type: 'string',
			isExternalFilter: false,
			enableSorting: true,
			isSearchField: true,
			enableColumnOrdering: true,
		},

		{
			name: 'campaignName.keyword',
			accessorFn: row => row?.campaignName,
			id: 'campaignName',
			header: 'Campaign Name',
			size: 230,
			isPinned: false,
			filter: true,
			type: 'string',
			isExternalFilter: false,
			isSearchField: true,
			enableSorting: true,
			enableColumnOrdering: true,
			Cell: ({ renderedCellValue }) => <CampaignNameField value={renderedCellValue} fullWidth disabled />,
		},

		{
			name: 'deals',
			accessorFn: row => row?.deals?.name,
			id: 'deals.name',
			header: 'Associated Deals',
			size: 230,
			isPinned: false,
			filter: true,
			type: 'string',
			isExternalFilter: false,
			isSearchField: true,
			enableSorting: true,
			enableColumnOrdering: true,
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
			enableColumnOrdering: false,
			enableColumnActions: false,
			enableResizing: false,
			Cell: ({ row }) => {
				const id = `unit`;
				const targetSourceId = row.getValue('ownerEntity');
				return <TagCell id={id} targetSourceId={targetSourceId} tags={row?.original?.tags} />;
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

				return <ContactActionMenu id={id} name={name} esIndex={esIndex} dialogType="ownerPerUnitDialog" />;
			},
		},

		// {
		//   name: 'contactId',
		//   accessorKey: 'contactId',
		//   isSearchField: false,
		//   hidden: true,
		//   enablePinning: false,
		//   enableHiding: false,
		//   enableColumnActions: false,
		//   enableColumnOrdering: false,
		//   enableSorting: false,
		// },

		// {
		//   name: 'isSuggested',
		//   accessorKey: 'isSuggested',
		//   isSearchField: false,
		//   hidden: true,
		//   enablePinning: false,
		//   enableHiding: false,
		//   enableColumnActions: false,
		//   enableColumnOrdering: false,
		//   enableSorting: false,
		// },

		// {
		//   name: 'isOverridden',
		//   accessorKey: 'isOverridden',
		//   isSearchField: false,
		//   hidden: true,
		//   enablePinning: false,
		//   enableHiding: false,
		//   enableColumnActions: false,
		//   enableColumnOrdering: false,
		//   enableSorting: false,
		// },

		{
			name: 'isPurchased',
			accessorFn: row => row?.contact?.isPurchased,
			id: 'contact.isPurchased',
			isSearchField: false,
			enablePinning: false,
			enableHiding: false,
			hidden: true,
			enableColumnActions: false,
			enableSorting: false,
		},
	],
};

export default OwnersPerUnitMeta;
