import { useLazyQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { GETPIPELINES } from 'graphQL/useQueryPipelines';

import { setFlowState } from 'actions';

export default function PipelinesFetchHoc(Component, module = 'flow') {
	return function HOC(props) {
		const [getPipelines, { data: pipelinesData }] = useLazyQuery(GETPIPELINES);
		const { selectedPipe, pipelines } = useSelector(({ Flow }) => Flow);

		const history = useHistory();
		const dispatch = useDispatch();

		useEffect(() => {
			if (!pipelines || pipelines.length === 0) {
				getPipelines();
			}
		}, []);

		useEffect(() => {
			if (pipelinesData) {
				//// select first one as default
				const pipelineId = history.location.pathname.split('/')[2];
				let laneId = '';
				let cardId = '';
				if (history.location.pathname.includes('lane')) {
					laneId = history.location.pathname.split('/')[4];
				}
				if (history.location.pathname.includes('card')) {
					cardId = history.location.pathname.split('/')[6];
				}

				if (pipelinesData.pipelines && pipelinesData.pipelines.length > 0) {
					let activePipeline = undefined;

					if (pipelineId) {
						activePipeline = pipelinesData.pipelines.find(p => p._id === pipelineId);
					}
					if (!activePipeline) {
						const isExist = !!pipelinesData.pipelines.find(p => p._id === selectedPipe?._id);
						if (selectedPipe && isExist) {
							activePipeline = pipelinesData.pipelines.find(p => p._id === selectedPipe._id);
						} else {
							activePipeline = pipelinesData.pipelines[0];
						}
					}
					if (module === 'module') {
						if (activePipeline && laneId && cardId) {
							history.push(`/flow/${activePipeline._id}/lane/${laneId}/card/${cardId}`);
						} else if (activePipeline) {
							history.push(`/flow/${activePipeline._id}`);
						}
					}

					dispatch(
						setFlowState({
							selectedPipe: activePipeline,
							pipelines: pipelinesData.pipelines,
						})
					);
				} else {
					dispatch(
						setFlowState({
							selectedPipe: null,
							pipelines: [],
							pipeToShow: false,
						})
					);
				}
			}
		}, [pipelinesData]);

		return <Component {...props} />;
	};
}
