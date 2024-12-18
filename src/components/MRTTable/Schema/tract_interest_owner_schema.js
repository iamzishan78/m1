import ColumnWithLink from 'components/Common/MRTable/ColumnWithLink';
import FeatureFlag from 'components/MRTTable/Common/TableCells/FeatureFlagComponent';
import { FEATURES } from 'components/Shared/FeatureFlag/common';
import MonetizationOnIcon from '@material-ui/icons/LocalAtmOutlined';
import { tableController, tableGlobalController } from 'hookstate/tableController';
import ListChips from 'components/Common/ListChips';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import IsContactCell from 'components/MRTTable/Common/TableCells/isContactIcone';
import ContactActionMenu from 'components/MRTTable/Common/TableCells/ContactActionMenu';
import TractInterestOwnerToolBar from 'components/MRTTable/TablesOverride/TractInterestOwnerTable/TractInterestOwnerToolBar';
import { addTrailingZeros } from 'components/Shared/functions';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import TractIcon from 'components/Shared/svgIcons/tract';
import CampaignField from 'components/ContactDetailCard/components/FieldContent/CampaignField';
import vf_currency from 'components/Shared/valueformatters/vf_currency';

const esIndex = 'shapeowners_flat';

const onClickedRow = selectedRow => {
	const Controller = tableController('TractPerUnitTable');
	const { customLayer } = Controller.getValue('customProps');
	tableGlobalController.updateState({
		dialog: {
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
	gridViewSettings: {
		label: 'Tract Owners',
		module: 'TractOwner',
		Icon: TractIcon,
		defaultView: {
			name: 'All Tract Owners',
			type: 'Default',
		},
		handleDefaultView: (view, user) => {
			if (view?.name === 'My Tract Owner') {
				view.filters[0].value = user._id;
			}
			return view;
		},
		cssOverride: {
			top: '300px',
			left: '300px',
		},
	},
	CustomToolBar: TractInterestOwnerToolBar,
	onClickedRow,
	defaultSort: { field: '_ts', order: 'asc' },
	maxTableHeight: 'calc(100vh - 461px)',
	height: '700px',
	isInFiniteScroll: true,
	columnVirtualization: true,

	TableSchema: [
		{
			...CommonSchema.MONGO_ID,
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
			Cell: ({ renderedCellValue, row }) => {
				// Check if the contact is purchased
				const isPurchased = [true, 'true', 'True'].includes(row.getValue('contact.isPurchased'));
				return (
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
						}}
					>
						<p
							style={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								minWidth: '300px',
								marginLeft: '10px',
							}}
						>
							<ColumnWithLink
								value={renderedCellValue}
								link={`/contact/details/${row.getValue('ownerEntity')}`}
								onClick={e => {
									e.stopPropagation();
								}}
							/>
							{isPurchased && (
								<FeatureFlag feature={FEATURES.IDICORE}>
									<MonetizationOnIcon
										style={{
											marginLeft: '10px',
											color: 'gray',
										}}
									/>
								</FeatureFlag>
							)}
							{/* check if agreement record is present and not deleted */}
							{/* functionality not working properly commenting this code until further notice */}
							{/* {!row?.original?.agreement?.IsDeleted && row?.original?.agreement?._id && (
								<div
									style={{ marginLeft: '15px', cursor: 'pointer', position: 'absolute', right: 0, marginRight: '15px' }}
									onClick={e => {
										e.stopPropagation();
										history.push(`/land/agreement/details/${row?.original?.agreement?._id}`);
									}}
								>
									<AgreementIcon color={'#17aadd'} />
								</div>
							)} */}
						</p>
					</div>
				);
			},
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
			Cell: ({ row }) => {
				const surfaceInterest = row.getValue('surface_interest');
				if (surfaceInterest) {
					return <>{addTrailingZeros(parseFloat(surfaceInterest).toFixed(8))}</>;
				}
			},
			...CommonSchema.AGGREGATED_FOOTER('surface_interest', 'TractPerUnitTable'),
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'mineral_interest',
			accessorKey: 'mineral_interest',
			header: 'Mineral Interest',
			isSearchField: false,
			type: 'number',
			Cell: ({ row }) => {
				const mineralInterest = row.getValue('mineral_interest');
				if (mineralInterest) {
					return <>{addTrailingZeros(parseFloat(mineralInterest).toFixed(8))}</>;
				}
			},
			...CommonSchema.AGGREGATED_FOOTER('mineral_interest', 'TractPerUnitTable'),
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'nonExecRightsOnly.keyword',
			accessorKey: 'nonExecRightsOnly',
			header: 'Non-Exec Rights Only',
			id: 'nonExecRightsOnly',
			size: 200,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'royalty_interest',
			accessorKey: 'royalty_interest',
			header: 'Royalty Interest (Lease)',
			isSearchField: false,
			type: 'number',
			size: 275,
			// Cell: ({ row }) => {
			// 	const royaltyInterest = row.getValue('royalty_interest');
			// 	if (royaltyInterest) {
			// 		return <>{addTrailingZeros(parseFloat(royaltyInterest).toFixed(8))}</>;
			// 	}
			// },
			...CommonSchema.AGGREGATED_FOOTER('royalty_interest', 'TractPerUnitTable'),
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'orri',
			accessorKey: 'orri',
			header: 'ORRI',
			size: 230,
			isSearchField: false,
			type: 'number',
			Cell: ({ row }) => {
				const orri = row.getValue('orri');
				if (orri) {
					return <>{addTrailingZeros(parseFloat(orri).toFixed(8))}</>;
				}
			},
			...CommonSchema.AGGREGATED_FOOTER('orri', 'TractPerUnitTable'),
		},

		// {
		// 	...CommonSchema.COMMON_COLUMN,
		// 	name: 'record_title',
		// 	accessorKey: 'record_title',
		// 	header: 'Record Title',
		// 	isSearchField: false,
		// 	type: 'number',
		// 	Cell: ({ row }) => {
		// 		const recordTiitle = row.getValue('record_title');
		// 		if (recordTiitle) {
		// 			return <>{addTrailingZeros(parseFloat(recordTiitle).toFixed(8))}</>;
		// 		}
		// 	},
		// },

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
			...CommonSchema.AGGREGATED_FOOTER('operating_rights', 'TractPerUnitTable'),
		},

		// {
		// 	...CommonSchema.COMMON_COLUMN,
		// 	name: 'nri',
		// 	accessorKey: 'nri',
		// 	header: 'NRI',
		// 	isSearchField: false,
		// 	type: 'number',
		// 	Cell: ({ row }) => {
		// 		const nri = row.getValue('nri');
		// 		if (nri) {
		// 			return <>{addTrailingZeros(parseFloat(nri).toFixed(8))}</>;
		// 		}
		// 	},
		// },

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
			...CommonSchema.AGGREGATED_FOOTER('net_acres', 'TractPerUnitTable'),
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'company_net_acres',
			accessorKey: 'company_net_acres',
			header: 'Co Net Acres',
			isSearchField: false,
			type: 'number',
			Cell: ({ row }) => {
				const company_net_acres = row.getValue('company_net_acres');
				if (company_net_acres) {
					return <>{addTrailingZeros(parseFloat(company_net_acres).toFixed(8))}</>;
				}
			},
			...CommonSchema.AGGREGATED_FOOTER('company_net_acres', 'TractPerUnitTable'),
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
			...CommonSchema.AGGREGATED_FOOTER('nra', 'TractPerUnitTable'),
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'offer_price_nma',
			accessorKey: 'offer_price_nma',
			header: 'Target Offer (NMA)',
			isSearchField: false,
			type: 'number',
			Cell: ({ row }) => <>{vf_currency(row?.original?.offer_price_nma)}</>,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'max_offer_price_nma',
			accessorKey: 'max_offer_price_nma',
			header: 'Max Offer (NMA)',
			isSearchField: false,
			type: 'number',
			Cell: ({ row }) => <>{vf_currency(row?.original?.max_offer_price_nma)}</>,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'offer_price',
			accessorKey: 'offer_price',
			header: 'Target Offer (NRA)',
			isSearchField: false,
			type: 'number',
			Cell: ({ row }) => <>{vf_currency(row?.original?.offer_price)}</>,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'max_offer_price',
			accessorKey: 'max_offer_price',
			header: 'Max Offer (NRA)',
			isSearchField: false,
			type: 'number',
			Cell: ({ row }) => <>{vf_currency(row?.original?.max_offer_price)}</>,
		},
		// Bonus payment column
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'bonus_payment',
			accessorKey: 'bonus_payment',
			header: 'Bonus Payment',
			isSearchField: false,
			type: 'number',
			Cell: ({ row }) => <>{vf_currency(row?.original?.bonus_payment)}</>,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'seller_asking_price',
			accessorKey: 'seller_asking_price',
			header: 'Seller Asking Price',
			isSearchField: false,
			type: 'number',
			Cell: ({ row }) => <>{vf_currency(row?.original?.seller_asking_price)}</>,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'competitor_offer_price',
			accessorKey: 'competitor_offer_price',
			header: 'Competitor Offer Price',
			isSearchField: false,
			type: 'number',
			size: 300,
			Cell: ({ row }) => <>{vf_currency(row?.original?.competitor_offer_price)}</>,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'actual_offer_price',
			accessorKey: 'actual_offer_price',
			header: 'Actual Offer Price',
			isSearchField: false,
			type: 'number',
			Cell: ({ row }) => <>{vf_currency(row?.original?.actual_offer_price)}</>,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'contact.contactStatus.keyword',
			accessorFn: row => row?.contact?.contactStatus,
			id: 'contact.contactStatus',
			header: 'Contact Status',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'contact.status.keyword',
			accessorFn: row => row?.contact?.status,
			id: 'contact.status',
			header: 'Contact Stage',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'contactOwners.keyword',
			accessorKey: 'contactOwners',
			header: 'Contact Owner',
			Cell: ({ row }) => {
				return <div>{row?.original?.contactOwners[0]}</div>;
			},
		},

		{
			...CommonSchema.COMMON_COLUMN,
			type: 'array',
			name: 'campaigns',
			accessorFn: row => row?.campaigns,
			id: 'campaigns',
			header: 'Campaigns',
			Cell: ({ row }) => {
				return <CampaignField value={row?.original?.campaigns} fullWidth disabled />;
			},
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'campaignPriority.keyword',
			accessorKey: 'campaignPriority',
			header: 'Campaign Priority',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'leaseStatus.keyword',
			accessorKey: 'leaseStatus',
			header: 'Lease Status',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'dataSource.keyword',
			accessorKey: 'dataSource',
			id: 'dataSource',
			header: 'Data Source',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'deals.name.keyword',
			accessorKey: 'deals.name',
			isExport: 'dealsName',
			header: 'Associated Deals',
			handleArrayExport: {
				esType: 'collection',
				actualKey: 'name',
			},
			isSearchField: true,
			Cell: ({ row }) => {
				return (
					<div>
						{row?.original?.deals && Array.isArray(row?.original?.deals) ? (
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
			name: 'contact.isPurchased',
			accessorFn: row => row?.contact?.isPurchased,
			header: 'Purchased Data Exists',
			filterSelectOptions: [
				{ label: 'Yes', value: 'true' },
				{ label: 'No', value: 'false' },
			],
			Cell: ({ row }) => {
				const isPurchased = [true, 'true', 'True'].includes(row.getValue('contact.isPurchased'));
				return <>{isPurchased ? 'Yes' : 'No'}</>;
			},
			isSearchField: false,
		},

		{
			...CommonSchema.TAGS,
			Cell: ({ row }) => {
				const targetSourceId = row.getValue('ownerEntity');
				return (
					<TagCell
						id={targetSourceId}
						targetSourceId={targetSourceId}
						tags={row?.original?.tags}
						targetLabel={'Parcel Ownership'}
					/>
				);
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
				return (
					<CommentCell
						id={id}
						value={row?.original?.commentsCount}
						targetLabel={'Parcel Ownership'}
						hideShareCommentsToggle
					/>
				);
			},
		},

		{
			...CommonSchema.ACTION_COLUMN,
			name: 'actionMenu',
			accessorKey: 'actionMenu',
			Cell: ({ row }) => {
				const id = row.getValue('_id');
				const name = row.getValue('name');

				return <ContactActionMenu id={id} name={name} esIndex={esIndex} dialogType="dialog" />;
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
