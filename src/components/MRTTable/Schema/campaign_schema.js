import React from 'react';

import { isEmpty, pickBy } from 'lodash';

import Loaders from 'components/Loaders';
import ColumnWithLink from 'components/MRTTable/Common/ColumnWithLink';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import CampaignIcon from 'components/Shared/svgIcons/campaign';

import { UPDATE_CAMPAIGN } from 'graphQL/useMutationCampaign';

import { tableGlobalController } from 'stateManagement/tableController';

import { copy } from 'utils/helper';

const esIndex = 'campaigns_flat';

const onCustomKeyChange = async (client, row, value, item) => {
	const loaderId = `upadting-${row?._id}`;

	try {
		Loaders.createToast(loaderId, 'Updation in Progress');
		const customData = copy(row?.custom_data) ?? {};
		const filteredCustomData = pickBy(customData, value => value !== '' && !isEmpty(value));

		const campaign = {
			_id: row._id,
			custom_data: {
				...filteredCustomData,
				[item.name]: value,
			},
		};

		await client.mutate({
			variables: {
				campaign,
			},
			mutation: UPDATE_CAMPAIGN,
			refetchQueries: ['getDbFilters'],
		});

		Loaders.successToast(loaderId, 'Updation Complete');
		tableGlobalController.refetch();
	} catch {
		Loaders.errorToast(loaderId, 'Failed to Update');
	}
};

const CampaignMeta = {
	esIndex,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	defaultSort: { field: 'flatSyncAt', order: 'desc' },
	refetchQueries: ['getCampaignAnalytics'],
	maxTableHeight: 'calc(100vh - 490px)',
	onCustomKeyChange,
	isInFiniteScroll: true,
	columnVirtualization: true,
	fetchMetaData: {
		category: 'Campaign Name',
	},
	gridViewSettings: {
		label: 'Campaign Name',
		module: 'Campaigns',
		Icon: CampaignIcon,
		defaultView: {
			name: 'All Campaigns',
			type: 'Default',
		},
		handleDefaultView: (view, user) => {
			if (view?.name === 'My Campaigns') {
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
			top: '461px',
			left: '40px',
			marginLeft: '-7px',
			maxHeight: '445px',
		},
	},
	TableSchema: [
		{
			...CommonSchema.MONGO_ID,
			name: '_id',
			id: '_id',
		},
		{
			...CommonSchema.INITAIL_PINNED,
			name: 'name',
			id: 'name',
			header: 'Campaign Name',
			Cell: ({ renderedCellValue, row }) => (
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
					}}
				>
					<ColumnWithLink
						value={renderedCellValue || 'N/A'}
						muted={!renderedCellValue}
						link={`/contacts/campaign/details/${row.getValue('_id')}`}
					/>
				</div>
			),
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'status',
			id: 'status',
			header: 'Campaign Stage',
			isExternalFilter: true,
		},
		{
			...CommonSchema.NUMBER_COLUMN,
			name: 'unitCount',
			id: 'unitCount',
			header: 'Units',
			isSearchField: false,
		},
		{
			...CommonSchema.NUMBER_COLUMN,
			name: 'totalNra',
			id: 'totalNra',
			header: 'Total Unit NRA',
			isSearchField: false,
		},
		{
			...CommonSchema.NUMBER_COLUMN,
			name: 'tractCount',
			id: 'tractCount',
			header: 'Tracts',
			isSearchField: false,
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'owner.name',
			id: 'owner.name',
			header: 'Supervisor',
			isExternalFilter: true,
		},

		CommonSchema.CREATED_BY,
		{
			...CommonSchema.CREATED_DATE,
			isExternalFilter: true,
		},
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
						targetLabel={'Campaign'}
					/>
				);
			},
		},
		{
			...CommonSchema.COMMENTS,
			Cell: ({ renderedCellValue, row }) => {
				const id = row.getValue('_id');
				return <CommentCell id={id} value={renderedCellValue?.length} targetLabel={'Campaign'} />;
			},
		},
	],
};

export default CampaignMeta;
