import React from 'react';

import _ from 'lodash';

import CampaignField from 'components/ContactDetailCard/components/FieldContent/CampaignField';
import Loader from 'components/Loaders';
import ColumnWithLink from 'components/MRTTable/Common/ColumnWithLink';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import FlyToMap from 'components/MRTTable/Common/TableCells/coordinates_fly_map';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import UnitToolbar from 'components/MRTTable/TablesOverride/UnitTable/UnitToolbar';
import UnitIcon from 'components/Shared/svgIcons/unit';
import { vf_currency_to_fixed } from 'components/Shared/valueformatters/vf_currency';
import vf_number from 'components/Shared/valueformatters/vf_number';

import { UPDATECUSTOMLAYER } from 'graphQL/useMutationUpdateCustomLayer';

import { globalStateController } from 'stateManagement/globalStateController';
import { tableGlobalController } from 'stateManagement/tableController';

import { CURRENCY_TO_FIXED } from 'utils/consts';
import { copy } from 'utils/helper';

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
			refetchQueries: ['getDbFilters'],
		});
		Loader.successToast(loaderId, 'Updation Complete');
		tableGlobalController.refetch();
	} catch {
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
		//here
		handleDefaultView: (view, user) => {
			if (view?.name === 'My Units') {
				const newFilters = [...view.filters];
				newFilters[0] = {
					...newFilters[0],
					value: user._id,
				};

				return {
					...view,
					filters: newFilters,
				};
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
	fetchMetaData: {
		category: 'Unit', // enable to show custom field inside unit grid
	},
	onCustomKeyChange,
	TableSchema: [
		{
			...CommonSchema.HIDDEN,
			name: 'id',
			id: 'id',
			header: 'ID',
		},

		{
			...CommonSchema.MONGO_ID,
			name: '_id',
			id: '_id',
		},

		{
			...CommonSchema.INITAIL_PINNED,
			name: 'name.keyword',
			id: 'name',
			header: 'Unit Name',
			Cell: ({ renderedCellValue, row }) => {
				const id = row.original._id; // Get unit id
				const comments = row.original.comments || []; // Get unit comments
				return (
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
						}}
					>
						<ColumnWithLink value={renderedCellValue} link={`/map/units/${id}`} />
						{/* Added comment icon with unit name */}
						<CommentCell id={id} value={comments?.length} targetLabel={'unit'} />
					</div>
				);
			},
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.uNumber.keyword',
			id: 'shapeJson.properties.uNumber',
			header: 'Unit #',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.originalProperties.State.keyword',
			accessorFn: row =>
				row?.shapeJson?.properties?.originalProperties?.State || // Use either state of stateAbbreviation
				row?.shapeJson?.properties?.originalProperties?.StateAbbreviation,
			id: 'shapeJson.properties.originalProperties.State',
			header: 'State',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.originalProperties.County.keyword',
			id: 'shapeJson.properties.originalProperties.County',
			header: 'County',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.originalProperties.surveyMerdian.keyword',
			id: 'shapeJson.properties.originalProperties.surveyMerdian',
			header: 'Survey/ Meridian',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.originalProperties.blockTownship.keyword',
			id: 'shapeJson.properties.originalProperties.blockTownship',
			header: 'Block/ Township',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.originalProperties.rangeSection.keyword',
			id: 'shapeJson.properties.originalProperties.rangeSection',
			header: 'Section/ Range',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.originalProperties.abstractNameShortName.keyword',
			id: 'shapeJson.properties.originalProperties.abstractNameShortName',
			header: 'Abstract/ Section',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.uAcres.keyword',
			accessorFn: row => vf_number(row?.shapeJson?.properties?.uAcres),
			id: 'shapeJson.properties.uAcres',
			header: 'Unit Acres',
		},

		{
			// Total unit NRA column
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.netRoyalityAcres.unitNra.keyword',
			accessorFn: row => vf_number(row?.shapeJson?.properties?.netRoyalityAcres?.unitNra),
			id: 'shapeJson.properties.netRoyalityAcres.unitNra',
			header: 'Total Unit NRA',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.uStatus.keyword',
			id: 'shapeJson.properties.uStatus',
			header: 'Unit Status',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.uPrimaryOperator.keyword',
			id: 'shapeJson.properties.uPrimaryOperator',
			header: 'Current Operator',
		},

		//added Total Unit Interest column from here
		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.totalUnitInterest.keyword',
			id: 'shapeJson.properties.totalUnitInterest',
			header: 'Total Unit Interest',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.uUnitPricing.keyword',
			accessorFn: row => vf_currency_to_fixed(row?.shapeJson?.properties?.uUnitPricing, CURRENCY_TO_FIXED), // format value with $ sign
			subType: 'price',
			id: 'shapeJson.properties.uUnitPricing',
			header: 'Target Price/Acre',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.uMaxUnitPricing.keyword',
			accessorFn: row => vf_currency_to_fixed(row?.shapeJson?.properties?.uMaxUnitPricing, CURRENCY_TO_FIXED), // format value with $ sign
			subType: 'price',
			id: 'shapeJson.properties.uMaxUnitPricing',
			header: 'Max Price/Acre',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'interestSummary.unitInterestCount',
			id: 'interestSummary.unitInterestCount',
			header: 'Owner Count',
			isSearchField: false,
		},

		{
			...CommonSchema.STRING_COLUMN,
			type: 'array',
			name: 'shapeJson.properties.campaigns.keyword',
			id: 'shapeJson.properties.campaigns',
			header: 'Campaigns',
			size: 270,
			Cell: ({ row }) => {
				return <CampaignField value={row?.original?.shapeJson?.properties?.campaigns} fullWidth disabled />;
			},
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.qualifier.name.keyword',
			id: 'shapeJson.properties.qualifier.name',
			header: 'Qualifier',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.reviewer.name.keyword',
			id: 'shapeJson.properties.reviewer.name',
			header: 'Reviewer',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.ownerName.keyword',
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
			id: 'coordinates',
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
