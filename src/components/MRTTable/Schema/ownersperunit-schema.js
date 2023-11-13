import vf_currency from 'components/Shared/valueformatters/vf_currency';
import CampaignNameField from 'components/ContactDetailCard/components/FieldContent/CampaignNameField';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import ContactActionMenu from 'components/MRTTable/Common/TableCells/ContactActionMenu';
import IsContactCell from 'components/MRTTable/Common/TableCells/isContactIcone';
import NameCell from 'components/MRTTable/TablesOverride/OwnersPerUnit/TableCell/NameCell';
import OwnersPerUnitToolBar from 'components/MRTTable/TablesOverride/OwnersPerUnit/OwnersPerUnitToolBar';
import { tableController, tableGlobalController } from 'hookstate/tableController';
import ListChips from 'components/Common/ListChips';
import { addTrailingZeros } from 'components/Shared/functions';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import UnitIcon from 'components/Shared/svgIcons/unit';

const esIndex = 'shapeowners_flat';

const onClickedRow = selectedRow => {
	const Controller = tableController('OwnersPerUnitTable');
	const { customLayer } = Controller.getValue('customProps');
	tableGlobalController.updateState({
		ownerPerUnitDialog: {
			type: 'addOwnerToUnit',
			shapeId: customLayer?._id,
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
	gridViewSettings: {
		label: 'Unit Owners',
		module: 'UnitOwner',
		Icon: UnitIcon,
		defaultView: {
			name: 'All Unit Owners',
			type: 'Default',
		},
		handleDefaultView: (view, user) => {
			if (view?.name === 'My Unit Owner') {
				view.filters[0].value = user._id;
			}
			return view;
		},
		cssOverride: {
			top: '361px',
			left: '295px',
		},
	},
	CustomToolBar: OwnersPerUnitToolBar,
	onClickedRow,
	defaultSort: { field: '_ts', order: 'asc' },
	maxTableHeight: 'calc(100vh - 489px)',
	height: '767px',
	isInFiniteScroll: true,
	columnVirtualization: true,
	defaultFlterMode: 'multiselect',
	deletedKeys: {
		mainRecord: { key: '_id' },
		parentRecord: { key: 'shape._id' }
	},
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
			accessorKey: 'contact.entityDetail.name',
			isExport: 'name',
			header: 'Owner Name',
			Cell: ({ renderedCellValue, row }) => {
				const isPurchased = row.getValue('contact.isPurchased');
				return <NameCell renderedCellValue={renderedCellValue} isPurchased={isPurchased} />;
			},
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'contact.ownerType.keyword',
			accessorFn: row => row?.contact?.ownerType,
			id: 'contact.ownerType',
			header: 'Entity Type',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'taxYear',
			type: 'number',
			accessorFn: row => row?.taxYear,
			id: 'taxYear',
			header: 'Tax Year',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'working_interest',
			accessorKey: 'working_interest',
			header: 'Working Interest',
			isSearchField: false,
			type: 'number',
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
			...CommonSchema.COMMON_COLUMN,
			name: 'orri',
			accessorKey: 'orri',
			header: 'ORRI',
			isSearchField: false,
			type: 'number',
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
			...CommonSchema.COMMON_COLUMN,
			name: 'nri',
			accessorKey: 'nri',
			header: 'NRI',
			isSearchField: false,
			type: 'number',
			Aggregation: {
				sumNri: {
					sum: { field: 'nri' },
				},
			},
			Cell: ({ row }) => {
				if (row?.original?.nri) {
					return <>{addTrailingZeros(parseFloat(row?.original?.nri).toFixed(8))}</>;
				}
			},
			Footer: () => {
				const Controller = tableController('OwnersPerUnitTable');
				const { sumNri } = Controller.getValue('footerProps') || {};
				return <div>{sumNri?.value ? addTrailingZeros(parseFloat(sumNri?.value).toFixed(8)) : 0}</div>;
			},
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'nra',
			accessorKey: 'nra',
			header: 'NRA',
			isSearchField: false,
			type: 'number',
			Aggregation: {
				sumNRA: {
					sum: { field: 'nra' },
				},
			},
			Cell: ({ row }) => {
				if (row?.original?.nra) {
					return <>{addTrailingZeros(parseFloat(row?.original?.nra).toFixed(8))}</>;
				}
			},
			Footer: () => {
				const Controller = tableController('OwnersPerUnitTable');
				const { sumNRA } = Controller.getValue('footerProps') || {};
				return <div>{sumNRA?.value ? addTrailingZeros(parseFloat(sumNRA?.value).toFixed(8)) : 0}</div>;
			},
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'seller_asking_price',
			accessorKey: 'seller_asking_price',
			header: 'Seller Asking Price',
			isSearchField: false,
			type: 'number',
			Cell: ({ renderedCellValue }) => <>{vf_currency(renderedCellValue)}</>,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'competitor_offer_price',
			accessorKey: 'competitor_offer_price',
			header: 'Competitor Offer Price',
			isSearchField: false,
			type: 'number',
			size: 300,
			Cell: ({ renderedCellValue }) => <>{vf_currency(renderedCellValue)}</>,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'offer_price',
			accessorKey: 'offer_price',
			header: 'Target Offer Price',
			isSearchField: false,
			type: 'number',
			Cell: ({ renderedCellValue }) => <>{vf_currency(renderedCellValue)}</>,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'max_offer_price',
			accessorKey: 'max_offer_price',
			header: 'Max Offer Price',
			isSearchField: false,
			type: 'number',
			Cell: ({ renderedCellValue }) => <>{vf_currency(renderedCellValue)}</>,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'actual_offer_price',
			accessorKey: 'actual_offer_price',
			header: 'Actual Offer Price',
			isSearchField: false,
			type: 'number',
			Cell: ({ renderedCellValue }) => <>{vf_currency(renderedCellValue)}</>,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'contact.contactStatus.keyword',
			accessorFn: row => row?.contact?.contactStatus,
			id: 'contact.contactStatus',
			header: 'Status',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'contactOwners.keyword',
			accessorKey: 'contactOwners',
			header: 'Contact Owner',
			Cell: ({ row }) => {
				return <div>{row?.original?.contactOwners[0]}</div>
			}
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'contact.status.keyword',
			accessorFn: row => row?.contact?.status,
			id: 'contact.status',
			header: 'Stage',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'campaignName.keyword',
			accessorFn: row => row?.campaignName,
			id: 'campaignName',
			header: 'Campaign Name',
			Cell: ({ renderedCellValue }) => <CampaignNameField value={renderedCellValue} fullWidth disabled />,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'campaignPriority.keyword',
			accessorKey: 'campaignPriority',
			header: 'Campaign Priority',
		},


		{
			...CommonSchema.COMMON_COLUMN,
			name: 'deals.name.keyword',
			accessorFn: row => row?.deals?.name,
			id: 'deals.name',
			header: 'Associated Deals',
			isSearchField: false,
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
				return <TagCell id={targetSourceId} targetSourceId={targetSourceId} tags={row?.original?.tags} targetLabel={'Unit Ownership'} />;
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
				return <CommentCell id={id} value={renderedCellValue.length} targetLabel={'Unit Ownership'} />;
			},
		},

		{
			...CommonSchema.ACTION_COLUMN,
			name: 'actionMenu',
			accessorKey: 'actionMenu',
			Cell: ({ row }) => {
				const id = row.getValue('_id');
				const name = row.getValue('name');

				return <ContactActionMenu id={id} name={name} esIndex={esIndex} dialogType="ownerPerUnitDialog" />;
			},
		},

		{
			...CommonSchema.HIDDEN,
			name: 'isPurchased',
			accessorFn: row => row?.contact?.isPurchased,
			id: 'contact.isPurchased',
		},
	],
};

export default OwnersPerUnitMeta;
