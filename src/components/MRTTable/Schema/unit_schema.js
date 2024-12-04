import FlyToMap from 'components/MRTTable/Common/TableCells/coordinates_fly_map';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import UnitIcon from 'components/Shared/svgIcons/unit';
import _ from 'lodash';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import ColumnWithLink from 'components/Common/MRTable/ColumnWithLink';
import CampaignNameField from 'components/ContactDetailCard/components/FieldContent/CampaignNameField';
import vf_currency from 'components/Shared/valueformatters/vf_currency.js';
import vf_number from 'components/Shared/valueformatters/vf_number';
import Loader from 'components/Loaders';
import { globalStateController } from 'hookstate/globalStateController';
import { UPDATECUSTOMLAYER } from 'graphQL/useMutationUpdateCustomLayer';
import { tableGlobalController } from 'hookstate/tableController';
import { copy } from 'utils/helper';
import UnitToolbar from 'components/MRTTable/TablesOverride/UnitTable/UnitToolbar';

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

const UnitMeta = {
	esIndex,
	pageSize: 50,
	CustomToolBar: UnitToolbar, // Add custom toolbar for showing bulkupdate button
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	gridViewSettings: {
		label: 'Units',
		module: 'Units',
		Icon: UnitIcon,
		defaultView: {
			name: 'All Units',
			type: 'Default',
		},
		handleDefaultView: (view, user) => {
			if (view?.name === 'My Units') {
				view.filters[0].value = user._id;
			}
			return view;
		},
		cssOverride: {
			top: '161px',
			left: '140px',
		},
	},
	defaultSort: { field: '_ts', order: 'desc' },
	defaultFilters: [{ field: 'layer.keyword', value: 'unit' }],
	maxTableHeight: 'calc(100vh - 215px)',
	isInFiniteScroll: true,
	columnVirtualization: true,
	isElasticQuery: false,
	fetchMetaData: {
		category: 'Unit', // enable to show custom field inside unit grid
	},
	onCustomKeyChange,
	TableSchema: [
		{
			...CommonSchema.HIDDEN,
			name: 'id',
			accessorKey: 'id',
			header: 'ID',
		},

		{
			...CommonSchema.MONGO_ID,
			name: '_id',
			accessorKey: '_id',
		},

		{
			...CommonSchema.INITAIL_PINNED,
			name: 'name.keyword',
			accessorKey: 'name',
			header: 'Unit Name',
			Cell: ({ renderedCellValue, row }) => (
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
					}}
				>
					<ColumnWithLink value={renderedCellValue} link={`/map/units/${row.getValue('_id')}`} />
				</div>
			),
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.uNumber.keyword',
			accessorFn: row => row?.shapeJson?.properties?.uNumber,
			id: 'shapeJson.properties.uNumber',
			header: 'Unit #',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.originalProperties.State.keyword',
			accessorFn: row =>
				row?.shapeJson?.properties?.originalProperties?.State || // Use either state of stateAbbreviation
				row?.shapeJson?.properties?.originalProperties?.StateAbbreviation,
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
			name: 'shapeJson.properties.uAcres.keyword',
			accessorFn: row => vf_number(row?.shapeJson?.properties?.uAcres),
			id: 'shapeJson.properties.uAcres',
			header: 'Unit Acres',
		},

		{
			// Total unit NRA column
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.netRoyalityAcres.unitNra.keyword',
			accessorFn: row => vf_number(row?.shapeJson?.properties?.netRoyalityAcres?.unitNra),
			id: 'shapeJson.properties.netRoyalityAcres.unitNra',
			header: 'Total Unit NRA',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.uStatus.keyword',
			accessorFn: row => row?.shapeJson?.properties?.uStatus,
			id: 'shapeJson.properties.uStatus',
			header: 'Unit Status',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.uPrimaryOperator.keyword',
			accessorFn: row => row?.shapeJson?.properties?.uPrimaryOperator,
			id: 'shapeJson.properties.uPrimaryOperator',
			header: 'Current Operator',
		},

		//added Total Unit Interest column from here
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.totalUnitInterest.keyword',
			accessorFn: row => row?.shapeJson?.properties?.totalUnitInterest,
			id: 'shapeJson.properties.totalUnitInterest',
			header: 'Total Unit Interest',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.uUnitPricing.keyword',
			accessorFn: row => vf_currency(row?.shapeJson?.properties?.uUnitPricing), // format value with $ sign
			id: 'shapeJson.properties.uUnitPricing',
			header: 'Target Price/Acre',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.uMaxUnitPricing.keyword',
			accessorFn: row => vf_currency(row?.shapeJson?.properties?.uMaxUnitPricing), // format value with $ sign
			id: 'shapeJson.properties.uMaxUnitPricing',
			header: 'Max Price/Acre',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'interestSummary.unitInterestCount',
			accessorKey: 'interestSummary.unitInterestCount',
			header: 'Owner Count',
			isSearchField: false,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.campaignName.keyword',
			accessorFn: row => row?.shapeJson?.properties?.campaignName,
			id: 'shapeJson.properties.campaignName',
			header: 'Campaign Name',
			size: 270,
			Cell: ({ renderedCellValue }) => <CampaignNameField value={renderedCellValue} fullWidth disabled />,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.qualifier.name.keyword',
			accessorFn: row => row?.shapeJson?.properties?.qualifier?.name,
			id: 'shapeJson.properties.qualifier.name',
			header: 'Qualifier',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.reviewer.name.keyword',
			accessorFn: row => row?.shapeJson?.properties?.reviewer?.name,
			id: 'shapeJson.properties.reviewer.name',
			header: 'Reviewer',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.ownerName.keyword',
			accessorFn: row => row?.shapeJson?.properties?.ownerName,
			id: 'shapeJson.properties.ownerName',
			header: 'Owner',
		},

		CommonSchema.CREATED_BY,
		CommonSchema.CREATED_DATE,
		CommonSchema.LAST_UPDATED_BY,
		CommonSchema.LAST_UPDATED_DATE,

		{
			...CommonSchema.TAGS,
			Cell: ({ row }) => {
				const targetSourceId = row.getValue('_id');
				return (
					<TagCell
						id={targetSourceId}
						targetSourceId={targetSourceId}
						tags={row?.original?.tags}
						targetLabel={'unit'}
					/>
				);
			},
		},

		{
			...CommonSchema.COMMENTS,
			Cell: ({ renderedCellValue, row }) => {
				const id = row.getValue('_id');
				return <CommentCell id={id} value={renderedCellValue.length} targetLabel={'unit'} rowNumber={row?.index} />;
			},
		},

		{
			...CommonSchema.ACTION_COLUMN,
			name: 'coordinates',
			accessorKey: 'coordinates',
			header: '',
			size: 70,
			Cell: ({ row }) => {
				const id = row.getValue('_id');

				return <FlyToMap id={id} type="unit" />;
			},
			isHiddenFieldExport: true, // Hide location field from the export csv
			hidden: true, // Hide location field from the export
		},
	],
};

export default UnitMeta;
