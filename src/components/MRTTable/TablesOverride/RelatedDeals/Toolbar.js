import React, { memo, useCallback, useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { useLazyQuery } from '@apollo/client';
import PropTypes from 'prop-types';

import ButtonDropDown from 'components/Shared/M1nTable/components/ButtonGroup';

import { GETPIPELINE } from 'graphQL/useQueryPipeline';

import { tableController } from 'hookstate/tableController';

import { AppContext } from 'AppContext';

function DealsToolbar({ tableKey }) {
	const [, setStateApp] = useContext(AppContext);
	const { selectedPipe } = useSelector(({ Flow }) => Flow);

	const [getPipeline, { data: pipelineData }] = useLazyQuery(GETPIPELINE, {
		fetchPolicy: 'cache-and-network',
	});

	useEffect(() => {
		if (selectedPipe?._id) {
			getPipeline({ variables: { id: selectedPipe._id } });
		}
	}, [selectedPipe, getPipeline]);

	const onClickedRow = useCallback(
		selectedRow => {
			const pipeline = pipelineData?.pipeline;
			const lanes = pipeline?.lanes ?? [];
			const lane = lanes.find(lane => lane.id === selectedRow?.stage?._id);
			const card = lane?.cards?.find(card => card.id === selectedRow?._id);

			if (!lane || !card) {
				return;
			}

			const { metadata } = card;
			const activeDeal = {
				cardId: selectedRow._id,
				laneId: selectedRow.stage._id,
				laneName: selectedRow.stage.name,
				pipeline: selectedRow.stage.pipeline._id,
				pipelineName: selectedRow.stage.pipeline.name,
				ownerName: metadata?.owners?.[0]?.relatedObject?.name ?? null,
				contactName: metadata?.contacts?.[0]?.relatedObject?.entity?.name ?? null,
				isContact: metadata?.contacts?.[0]?.relatedObject?._id ?? null,
				...metadata,
				...selectedRow,
			};

			setStateApp(stateApp => ({
				...stateApp,
				dealDialog: true,
				activeDeal,
			}));
		},
		[pipelineData, setStateApp]
	);

	const Controller = tableController(tableKey);
	Controller.updateState({
		onClickedRow,
	});

	const options = [
		{
			text: `+ ADD ${selectedPipe?.flowLineType === 'general' ? 'NEW TASK' : 'NEW DEAL'}`,
			isShow: false,
			action: () => {
				setStateApp(stateApp => ({
					...stateApp,
					dealDialog: true,
					activeDeal: { cardId: null, laneId: null },
				}));
			},
		},
	];

	if (tableKey === 'RelatedDealsTable') {
		options.push({
			text: 'Add existing deal',
			isShow: true,
			action: () => {
				setStateApp(stateApp => ({
					...stateApp,
					dealDialog: true,
					addExistingDeal: true,
					activeDeal: { cardId: null, laneId: null },
				}));
			},
		});
	}

	return (
		<ButtonDropDown
			options={options}
			buttonStyles={{ padding: '12px 6px' }}
			sideButtonStyles={{ minWidth: '25px', padding: 0 }}
		/>
	);
}

DealsToolbar.propTypes = {
	tableKey: PropTypes.string.isRequired,
};

export default memo(DealsToolbar);
