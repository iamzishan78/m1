import ColumnWithLink from 'components/Shared/M1nTable/components/SubComponents/ColumnWithLink';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import CampaignField from 'components/ContactDetailCard/components/FieldContent/CampaignField';
import vf_currency from 'components/Shared/valueformatters/vf_currency';
import Loader from 'components/Loaders';
import { globalStateController } from 'hookstate/globalStateController';
import { UPDATECUSTOMLAYER } from 'graphQL/useMutationUpdateCustomLayer';
import { tableGlobalController } from 'hookstate/tableController';
import { copy } from 'utils/helper';
import TractIcon from 'components/Shared/svgIcons/tract';
import { formatDate } from 'components/Shared/functions';
import _ from 'lodash';

const esIndex = 'shapes_flat';

const onCustomKeyChange = async (client, row, value, item) => {
	const loaderId = `upadting-${row?._id}`;

	try {
		Loader.createToast(loaderId, 'Updation in Progress');
		const user = globalStateController.getValue('user');

		const customData = copy(row?.shapeJson?.properties?.custom_data) ?? {};
		const filteredCustomData = _.pickBy(customData, value => value !== '' && !_.isEmpty(value));

		const shapeJson = {
			...row?.shapeJson,
			properties: {
				...row?.shapeJson?.properties,
				custom_data: {
					...filteredCustomData,
					[item.name]: value,
				},
			},
		};

		await client.mutate({
			variables: {
				customLayerId: row?._id,
				userId: user?._id,
				customLayer: {
					shape: JSON.stringify(shapeJson),
					shapeJson,
				},
			},
			mutation: UPDATECUSTOMLAYER,
			refetchQueries: ['getESSimpleFilter'],
		});
		Loader.successToast(loaderId, 'Updation Complete');
		tableGlobalController.refetch();
	} catch (err) {
		Loader.errorToast(loaderId, 'Updation in Complete');
	}
};

const TractMeta = {
	esIndex,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	// Grid views for tract
	gridViewSettings: {
		label: 'Tracts',
		module: 'Tracts',
		Icon: TractIcon,
		defaultView: {
			name: 'All Tracts',
			type: 'Default',
		},
		handleDefaultView: (view, user) => {
			if (view?.name === 'My Tracts') {
				view.filters[0].value = user._id;
			}
			return view;
		},
		cssOverride: {
			top: '340px',
			left: '225px',
		},
	},
	defaultSort: { field: '_ts', order: 'desc' },
	defaultFilters: [{ field: 'layer.keyword', value: 'parcel' }],
	maxTableHeight: 'calc(100vh - 450px)',
	isInFiniteScroll: true,
	columnVirtualization: true,
	onCustomKeyChange,
	// get metadata for the grid
	fetchMetaData: {
		category: 'Parcel',
	},
	TableSchema: [
		{
			...CommonSchema.HIDDEN,
			name: 'id',
			accessorKey: 'id',
		},
		// M1neral System ID field added
		{
			...CommonSchema.MONGO_ID, // Mongo Id Column
			name: '_id',
			accessorKey: '_id',
			header: 'M1neral System ID',
			isHiddenFieldExport: true,
		},
		{
			...CommonSchema.INITAIL_PINNED,
			name: 'name.keyword',
			accessorKey: 'name',
			header: 'Tract Name',
			Cell: ({ renderedCellValue, row }) => (
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
					}}
				>
					<ColumnWithLink
						value={renderedCellValue || row.getValue('shapeJson.properties.originalProperties.State')}
						link={`/map/parcels/${row.getValue('_id')}`}
					/>
				</div>
			),
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.originalProperties.State.keyword',
			accessorFn: row => row?.shapeJson?.properties?.originalProperties?.State,
			id: 'shapeJson.properties.originalProperties.State',
			header: 'State',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.originalProperties.County.keyword',
			accessorFn: row => row?.shapeJson?.properties?.originalProperties?.County,
			id: 'shapeJson.properties.originalProperties.County',
			header: 'County',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.originalProperties.surveyMerdian.keyword',
			accessorFn: row => row?.shapeJson?.properties?.originalProperties?.surveyMerdian,
			id: 'shapeJson.properties.originalProperties.surveyMerdian',
			header: 'Survey/ Meridian',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.originalProperties.blockTownship.keyword',
			accessorFn: row => row?.shapeJson?.properties?.originalProperties?.blockTownship,
			id: 'shapeJson.properties.originalProperties.blockTownship',
			header: 'Block/ Township',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.originalProperties.rangeSection.keyword',
			accessorFn: row => row?.shapeJson?.properties?.originalProperties?.rangeSection,
			id: 'shapeJson.properties.originalProperties.rangeSection',
			header: 'Section/ Range',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.originalProperties.abstractNameShortName.keyword',
			accessorFn: row => row?.shapeJson?.properties?.originalProperties?.abstractNameShortName,
			id: 'shapeJson.properties.originalProperties.abstractNameShortName',
			header: 'Abstract/ Section',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.sdGrossAcres',
			accessorFn: row => row?.shapeJson?.properties?.sdGrossAcres,
			id: 'shapeJson.properties.sdGrossAcres',
			header: 'Gross Acres',
			isSearchField: false, // Don't pass in search fields
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.shapeArea.keyword',
			accessorFn: row => row?.shapeJson?.properties?.shapeArea,
			id: 'shapeJson.properties.shapeArea',
			header: 'Calc Acres',
		},
		// Added tract NRA column
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.netRoyalityAcres.calculatedNra',
			accessorFn: row => row?.shapeJson?.properties?.netRoyalityAcres?.calculatedNra,
			id: 'shapeJson.properties.netRoyalityAcres.calculatedNra',
			header: 'Tract NRA',
			isSearchField: false, // Don't pass in search fields
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.execNetAcres',
			accessorFn: row => row?.shapeJson?.properties?.execNetAcres,
			id: 'shapeJson.properties.execNetAcres',
			header: 'Exec Net Acres',
			isSearchField: false, // Don't pass in search fields
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.nonExecNetAcres',
			accessorFn: row => row?.shapeJson?.properties?.nonExecNetAcres,
			id: 'shapeJson.properties.nonExecNetAcres',
			header: 'Non-Exec Net Acres',
			isSearchField: false, // Don't pass in search fields
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.uUnitPricingNMA.keyword',
			accessorFn: row => row?.original?.uUnitPricingNMA,
			id: 'shapeJson.properties.uUnitPricingNMA',
			header: 'Target Pricing (per NMA)',
			Cell: ({ row }) => <>{vf_currency(row?.original?.uUnitPricingNMA)}</>,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.uMaxUnitPricingNMA.keyword',
			accessorFn: row => row?.original?.uMaxUnitPricingNMA,
			id: 'shapeJson.properties.uMaxUnitPricingNMA',
			header: 'Max Pricing (per NMA)',
			Cell: ({ row }) => <>{vf_currency(row?.original?.uMaxUnitPricingNMA)}</>,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.uUnitPricing.keyword',
			accessorFn: row => row?.original?.uUnitPricing,
			id: 'shapeJson.properties.uUnitPricing',
			header: 'Target Pricing (per NRA)',
			Cell: ({ row }) => <>{vf_currency(row?.original?.uUnitPricing)}</>,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.uMaxUnitPricing.keyword',
			accessorFn: row => row?.original?.uMaxUnitPricing,
			id: 'shapeJson.properties.uMaxUnitPricing',
			header: 'Max Pricing (per NRA)',
			Cell: ({ row }) => <>{vf_currency(row?.original?.uMaxUnitPricing)}</>,
		},
		// {
		// 	...CommonSchema.COMMON_COLUMN,
		// 	name: 'shapeJson.properties.department.keyword',
		// 	accessorFn: row => row?.shapeJson?.properties?.department,
		// 	id: 'shapeJson.properties.department',
		// 	header: 'Department',
		// },
		{
			...CommonSchema.COMMON_COLUMN,
			type: 'array',
			name: 'shapeJson.properties.campaigns.keyword',
			accessorFn: row => row?.shapeJson?.properties?.campaigns,
			id: 'shapeJson.properties.campaigns',
			header: 'Campaigns',
			size: 270,
			Cell: ({ row }) => {
				return <CampaignField value={row?.original?.shapeJson?.properties?.campaigns} fullWidth disabled />;
			},
		},
		// Department column
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.department.keyword',
			accessorFn: row => row?.shapeJson?.properties?.department,
			id: 'shapeJson.properties.department',
			header: 'Department',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.ownerName.keyword',
			accessorFn: row => row?.shapeJson?.properties?.ownerName,
			id: 'shapeJson.properties.ownerName',
			header: 'Owner',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'createBy.name.keyword',
			accessorFn: row => row?.createBy?.name,
			id: 'createBy.name',
			header: 'Created By',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'createAt.keyword',
			id: 'createAt',
			header: 'Created Date',
			Cell: ({ row }) => <>{formatDate(row?.original?.createAt)}</>, // format date before showing
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'lastUpdateBy.name.keyword',
			accessorFn: row => row?.lastUpdateBy?.name,
			id: 'lastUpdateBy.name',
			header: 'Last Updated By',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'lastUpdateAt.keyword',
			id: 'lastUpdateAt',
			header: 'Last Updated Date',
			Cell: ({ row }) => <>{formatDate(row?.original?.lastUpdateAt)}</>, // format date before showing
		},
		{
			...CommonSchema.TAGS,
			Cell: ({ row }) => {
				const targetSourceId = row.getValue('_id');
				const targetLabel = 'parcel';
				return (
					<TagCell
						id={targetSourceId}
						targetSourceId={targetSourceId}
						tags={row?.original?.tags}
						targetLabel={targetLabel}
					/>
				);
			},
		},
		{
			...CommonSchema.COMMENTS,
			Cell: ({ renderedCellValue, row }) => {
				const id = row.getValue('_id');
				const targetLabel = 'parcel';
				return <CommentCell id={id} value={renderedCellValue.length} targetLabel={targetLabel} />;
			},
		},
	],
};

export default TractMeta;
