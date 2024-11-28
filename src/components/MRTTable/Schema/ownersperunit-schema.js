import ColumnWithLink from 'components/Common/MRTable/ColumnWithLink';
import FeatureFlag from 'components/MRTTable/Common/TableCells/FeatureFlagComponent';
import { FEATURES } from 'components/Shared/FeatureFlag/common';
import MonetizationOnIcon from '@material-ui/icons/LocalAtmOutlined';
import vf_currency from 'components/Shared/valueformatters/vf_currency';
import CampaignNameField from 'components/ContactDetailCard/components/FieldContent/CampaignNameField';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import ContactActionMenu from 'components/MRTTable/Common/TableCells/ContactActionMenu';
import IsContactCell from 'components/MRTTable/Common/TableCells/isContactIcone';
import OwnersPerUnitToolBar from 'components/MRTTable/TablesOverride/OwnersPerUnit/OwnersPerUnitToolBar';
import { tableController, tableGlobalController } from 'hookstate/tableController';
import ListChips from 'components/Common/ListChips';
import { addTrailingZeros } from 'components/Shared/functions';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import UnitIcon from 'components/Shared/svgIcons/unit';
import Loaders from 'components/Loaders';
import { UPDATE_SHAPE_OWNERS } from 'graphQL/useMutationUpdateShapeOwners';
import { copy } from 'utils/helper';
import { isEmpty, pickBy } from 'lodash';
import { globalStateController } from 'hookstate/globalStateController';

const esIndex = 'shapeowners_flat';

const onCustomKeyChange = async (client, row, value, item) => {
	const loaderId = `upadting-${row?._id}`;

	try {
		const user = globalStateController.getValue('user');
		Loaders.createToast(loaderId, 'Updation in Progress');

		const customData = copy(row?.custom_data) ?? {};
		const filteredCustomData = pickBy(customData, value => value !== '' && !isEmpty(value));

		const shapeOwners = {
			_id: row._id,
			custom_data: {
				...filteredCustomData,
				[item.name]: value,
			},
		};

		await client.mutate({
			variables: {
				shapeOwners,
				shapeType: 'Unit',
				userId: user._id,
			},
			mutation: UPDATE_SHAPE_OWNERS,
			refetchQueries: ['getESSimpleFilter'],
		});

		Loaders.successToast(loaderId, 'Updation Complete');
		tableGlobalController.refetch();
	} catch (err) {
		Loaders.errorToast(loaderId, 'Failed to Update');
	}
};

const onClickedRow = selectedRow => {
	const Controller = tableController('OwnersPerUnitTable');
	const { customLayer } = Controller.getValue('customProps');
	tableGlobalController.updateState({
		dialog: {
			type: 'addOwnerToUnit',
			shapeId: customLayer?._id,
			uAcres: customLayer?.shapeJson?.properties?.uAcres,
			uUnitPricing: customLayer?.shapeJson?.properties?.uUnitPricing,
			uMaxUnitPricing: customLayer?.shapeJson?.properties?.uMaxUnitPricing,
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
			top: '325px',
			left: '300px',
		},
	},
	fetchMetaData: {
		category: 'Unit Interest Owners', // enable to show custom field inside unit grid
	},
	CustomToolBar: OwnersPerUnitToolBar,
	onClickedRow,
	onCustomKeyChange,
	defaultSort: { field: '_ts', order: 'asc' },
	maxTableHeight: 'calc(100vh - 489px)',
	height: '767px',
	isInFiniteScroll: true,
	columnVirtualization: true,
	deletedKeys: {
		mainRecord: { key: '_id' },
		parentRecord: { key: 'shape._id' },
	},
	defaultFlterMode: 'multiselect',
	isShowActionMenuFirst: true,
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
			accessorKey: 'contact.entityDetail.name',
			isExport: 'name',
			header: 'Owner Name',
			Cell: ({ renderedCellValue, row }) => {
				const isPurchased = [true, 'true', 'True'].includes(row?.original?.contact?.isPurchased);
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
										data-testid="monetization-icon"
										style={{
											marginLeft: '10px',
											color: 'gray',
										}}
									/>
								</FeatureFlag>
							)}
						</p>
					</div>
				);
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'contact.entityDetail.currentAddress.keyword',
			accessorKey: 'contact.entityDetail.currentAddress',
			header: 'Current Address',
			isHiddenFieldExport: true,
			hidden: true,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'contact.entityDetail.primaryAddress.keyword',
			accessorKey: 'contact.entityDetail.primaryAddress',
			header: 'Primary Address',
			isHiddenFieldExport: true,
			hidden: true,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.uName.keyword',
			accessorKey: 'shape.shapeJson.properties.uName',
			header: 'Unit Name',
			isHiddenFieldExport: true,
			hidden: true,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.uNumber.keyword',
			accessorKey: 'shape.shapeJson.properties.uNumber',
			header: 'Unit #',
			isHiddenFieldExport: true,
			hidden: true,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.originalProperties.StateAbbreviation.keyword',
			id: 'shape.shapeJson.properties.originalProperties.StateAbbreviation',
			accessorFn: row => row?.shape?.shapeJson?.properties?.originalProperties?.StateAbbreviation,
			header: 'State',
			isHiddenFieldExport: true,
			hidden: true,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.originalProperties.County.keyword',
			id: 'shape.shapeJson.properties.originalProperties.County',
			accessorFn: row => row?.shape?.shapeJson?.properties?.originalProperties?.County,
			header: 'County',
			isHiddenFieldExport: true,
			hidden: true,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.uAcres.keyword',
			accessorKey: 'shape.shapeJson.properties.uAcres',
			header: 'Unit Acres',
			isHiddenFieldExport: true,
			hidden: true,
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
			name: 'net_acres',
			accessorKey: 'net_acres',
			header: 'Net Acres',
			isSearchField: false,
			type: 'number',
			Aggregation: {
				sumNetAcres: {
					sum: { field: 'net_acres' },
				},
			},
			Cell: ({ row }) => {
				if (row?.original?.net_acres) {
					return <>{addTrailingZeros(parseFloat(row?.original?.net_acres).toFixed(8))}</>;
				}
			},
			Footer: () => {
				const Controller = tableController('OwnersPerUnitTable');
				const { sumNetAcres } = Controller.getValue('footerProps') || {};
				return <div>{sumNetAcres?.value ? addTrailingZeros(parseFloat(sumNetAcres?.value).toFixed(8)) : 0}</div>;
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
			name: 'unitTractId.keyword',
			accessorKey: 'unitTractId',
			header: 'Unit Tract ID',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'tractAcres',
			accessorKey: 'tractAcres',
			header: 'Unit Tract Acres',
			isSearchField: false,
			type: 'number',
			Aggregation: {
				sumUnitTractAcres: {
					sum: { field: 'tractAcres' },
				},
			},
			Cell: ({ row }) => {
				if (row?.original?.tractAcres) {
					return <>{addTrailingZeros(parseFloat(row?.original?.tractAcres).toFixed(8))}</>;
				}
			},
			Footer: () => {
				const Controller = tableController('OwnersPerUnitTable');
				const { sumUnitTractAcres } = Controller.getValue('footerProps') || {};
				return (
					<div>{sumUnitTractAcres?.value ? addTrailingZeros(parseFloat(sumUnitTractAcres?.value).toFixed(8)) : 0}</div>
				);
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
			name: 'uUnitPricingInterest',
			accessorKey: 'uUnitPricingInterest',
			header: 'Target Price/NRA',
			isSearchField: false,
			type: 'number',
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
			name: 'uMaxUnitPricingInterest',
			accessorKey: 'uMaxUnitPricingInterest',
			header: 'Max Price/NRA',
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
			name: 'contact.homePhone.keyword',
			accessorFn: row => row?.contact?.homePhone,
			id: 'contact.homePhone',
			header: 'Contact Home Phone 1',
			size: 275,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'contact.mobilePhone.keyword',
			accessorFn: row => row?.contact?.mobilePhone,
			id: 'contact.mobilePhone',
			header: 'Contact Mobile Phone 1',
			size: 275,
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
			header: 'Campaign Priority 1',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.reviewer.name.keyword',
			accessorKey: 'shape.shapeJson.properties.reviewer.name',
			header: 'Reviewer',
			isHiddenFieldExport: true,
			hidden: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.qualifier.name.keyword',
			accessorKey: 'shape.shapeJson.properties.qualifier.name',
			header: 'Qualifier',
			isHiddenFieldExport: true,
			hidden: true,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'dataSource.keyword',
			accessorKey: 'dataSource',
			header: 'Data Source',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'taxYear',
			type: 'number',
			accessorFn: row => row?.taxYear,
			id: 'taxYear',
			header: 'Tax Year',
			isSearchField: false,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'deals.name.keyword',
			accessorFn: row => row?.deals?.name,
			id: 'deals.name',
			header: 'Associated Deals',
			handleArrayExport: {
				esType: 'collection',
				actualKey: 'name',
			},
			isSearchField: false,
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
			name: 'contact.isPurchased',
			accessorFn: row => row?.contact?.isPurchased,
			header: 'Purchased Data Exists',
			id: 'contact.isPurchased',
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
						targetLabel={'Unit Ownership'}
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
				return <CommentCell id={id} value={row?.original?.commentsCount} targetLabel={'Unit Ownership'} />;
			},
		},

		{
			...CommonSchema.ACTION_COLUMN,
			isPinned: true, // pin action column so it can be moved at first position
			showInLast: false,
			size: 80,
			name: 'actionMenu',
			accessorKey: 'actionMenu',
			Cell: ({ row }) => {
				const name = row.getValue('name');
				const contactId = row.getValue('ownerEntity');

				return <ContactActionMenu id={contactId} name={name} esIndex={esIndex} dialogType="dialog" />;
			},
		},
	],
};

export default OwnersPerUnitMeta;
