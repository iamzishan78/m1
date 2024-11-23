import UnitIcon from 'components/Shared/svgIcons/unit';
import { vf_currency_to_fixed } from 'components/Shared/valueformatters/vf_currency';
import ListChips from 'components/Common/ListChips';
import { CommonSchema } from './common_schema';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import CampaignNameField from 'components/ContactDetailCard/components/FieldContent/CampaignNameField';
import ContactNameLink from '../Common/TableCells/ContactNameLink';

const esIndex = 'shapeowners_flat';

const UnitInterestMeta = {
	esIndex,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	gridViewSettings: {
		label: 'Unit Interests',
		module: 'UnitInterest',
		Icon: UnitIcon,
		defaultView: {
			name: 'All Unit Interests',
			type: 'Default',
		},
		handleDefaultView: (view, user) => {
			if (view?.name === 'My Unit Interest') {
				view.filters[0].value = user._id;
			}
			return view;
		},
		cssOverride: {
			top: '161px',
			left: '190px',
		},
	},
	defaultSort: { field: '_ts', order: 'desc' },
	defaultFilters: [
		{ field: 'shape.layer.keyword', value: 'unit' },
		{ field: 'contact.IsDeleted', value: 'false' },
		{ field: 'shape.IsDeleted', value: 'false' },
		{ field: "descriptor", value: "ShapeOwnerDescriptor" }
	  ],
	maxTableHeight: 'calc(100vh - 215px)',
	isInFiniteScroll: true,
	columnVirtualization: true,
	deletedKeys: {
		mainRecord: { key: '_id' },
		parentRecord: { key: 'shape._id' },
	},
	TableSchema: [
		{
			...CommonSchema.MONGO_ID,
			name: '_id',
			accessorKey: '_id',
		},

		{
			...CommonSchema.HIDDEN,
			name: 'contact._id.keyword',
			accessorKey: 'contact._id',
		},

		{
			...CommonSchema.INITAIL_PINNED,
			name: 'contact.entityDetail.name.keyword',
			accessorKey: 'contact.entityDetail.name',
			header: 'Contact Name',
			size: 500,
			Cell: ({ renderedCellValue, row }) => {
				return <ContactNameLink contact={row?.original?.contact} />;
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
			header: 'Primary Address - Full',
			isHiddenFieldExport: true,
			hidden: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'contact.entityDetail.address1.keyword',
			accessorKey: 'contact.entityDetail.address1',
			header: 'Primary Address 1',
			isHiddenFieldExport: true,
			hidden: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'contact.entityDetail.address2.keyword',
			accessorKey: 'contact.entityDetail.address2',
			header: 'Primary Address 2',
			isHiddenFieldExport: true,
			hidden: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'contact.entityDetail.city.keyword',
			accessorKey: 'contact.entityDetail.city',
			header: 'Primary Address City',
			isHiddenFieldExport: true,
			hidden: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'contact.entityDetail.state.keyword',
			accessorKey: 'contact.entityDetail.state',
			header: 'Primary Address State',
			isHiddenFieldExport: true,
			hidden: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'contact.entityDetail.zip.keyword',
			accessorKey: 'contact.entityDetail.zip',
			header: 'Primary Address Zip Code',
			isHiddenFieldExport: true,
			hidden: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.uName.keyword',
			accessorKey: 'shape.shapeJson.properties.uName',
			header: 'Unit Name',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.uNumber.keyword',
			accessorKey: 'shape.shapeJson.properties.uNumber',
			header: 'Unit #',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.originalProperties.State.keyword',
			id: 'shape.shapeJson.properties.originalProperties.State',
			accessorFn: row => row?.shape?.shapeJson?.properties?.originalProperties?.State,
			header: 'State',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.originalProperties.County.keyword',
			id: 'shape.shapeJson.properties.originalProperties.County',
			accessorFn: row => row?.shape?.shapeJson?.properties?.originalProperties?.County,
			header: 'County',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.originalProperties.surveyMerdian.keyword',
			accessorFn: row => row?.shape?.shapeJson?.properties?.originalProperties?.surveyMerdian,
			id: 'shape.shapeJson.properties.originalProperties.surveyMerdian',
			header: 'Survey/ Meridian',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.originalProperties.blockTownship.keyword',
			accessorFn: row => row?.shape?.shapeJson?.properties?.originalProperties?.blockTownship,
			id: 'shape.shapeJson.properties.originalProperties.blockTownship',
			header: 'Block/ Township',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.originalProperties.rangeSection.keyword',
			accessorFn: row => row?.shape?.shapeJson?.properties?.originalProperties?.rangeSection,
			id: 'shape.shapeJson.properties.originalProperties.rangeSection',
			header: 'Section/ Range',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.originalProperties.abstractNameShortName.keyword',
			accessorFn: row => row?.shape?.shapeJson?.properties?.originalProperties?.abstractNameShortName,
			id: 'shape.shapeJson.properties.originalProperties.abstractNameShortName',
			header: 'Abstract/ Section',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.uAcres.keyword',
			accessorKey: 'shape.shapeJson.properties.uAcres',
			header: 'Unit Acres',
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
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'working_interest',
			accessorKey: 'working_interest',
			header: 'WI',
			isSearchField: false,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'royalty_interest',
			accessorKey: 'royalty_interest',
			header: 'RI',
			isSearchField: false,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'orri',
			accessorKey: 'orri',
			header: 'ORRI',
			isSearchField: false,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'nri',
			accessorKey: 'nri',
			header: 'NRI',
			isSearchField: false,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'net_acres',
			accessorKey: 'net_acres',
			header: 'Net Acres',
			isSearchField: false,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'nra',
			accessorKey: 'nra',
			header: 'NRA',
			isSearchField: false,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'offer_price',
			accessorKey: 'offer_price',
			header: 'Target Offer Price',
			isSearchField: false,
			Cell: ({ row }) => {
				return <p>{vf_currency_to_fixed(row?.original?.offer_price, 2)}</p>;
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'uUnitPricingInterest',
			accessorKey: 'uUnitPricingInterest',
			header: 'Target Price/NRA',
			isSearchField: false,
			type: 'number',
			Cell: ({ row }) => {
				return <p>{vf_currency_to_fixed(row?.original?.uUnitPricingInterest, 2)}</p>;
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'max_offer_price',
			accessorKey: 'max_offer_price',
			header: 'Max Offer Price',
			isSearchField: false,
			Cell: ({ row }) => {
				return <p>{vf_currency_to_fixed(row?.original?.max_offer_price, 2)}</p>;
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'uMaxUnitPricingInterest',
			accessorKey: 'uMaxUnitPricingInterest',
			header: 'Max Price/NRA',
			isSearchField: false,
			type: 'number',
			Cell: ({ row }) => {
				return <p>{vf_currency_to_fixed(row?.original?.uMaxUnitPricingInterest, 2)}</p>;
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'actual_offer_price',
			accessorKey: 'actual_offer_price',
			header: 'Actual Offer Price',
			isSearchField: false,
			Cell: ({ row }) => {
				return <p>{vf_currency_to_fixed(row?.original?.actual_offer_price, 2)}</p>;
			},
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'contact.contactStatus.keyword',
			accessorKey: 'contact.contactStatus',
			header: 'Contact Status',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'contactOwners.keyword',
			accessorKey: 'contactOwners',
			header: 'Contact Owner',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'contact.status.keyword',
			accessorKey: 'contact.status',
			header: 'Stage',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'campaignName.keyword',
			accessorKey: 'campaignName',
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
			name: 'shape.shapeJson.properties.reviewer.name.keyword',
			accessorKey: 'shape.shapeJson.properties.reviewer.name',
			header: 'Reviewer',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.qualifier.name.keyword',
			accessorKey: 'shape.shapeJson.properties.qualifier.name',
			header: 'Qualifier',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'deals.name.keyword',
			accessorKey: 'deals.name',
			header: 'Associated Deals',
			handleArrayExport: {
				esType: 'collection',
				actualKey: 'name',
			},
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
			name: 'dataSource.keyword',
			accessorKey: 'dataSource',
			header: 'Data Source',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'taxYear',
			type: 'number',
			accessorKey: 'taxYear',
			header: 'Tax Year',
			isSearchField: false,
		},

		{
			...CommonSchema.TAGS,
			Cell: ({ row }) => {
				const targetSourceId = row.getValue('contact._id');
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
	],
};

export default UnitInterestMeta;
