/* global cy */

import { useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import AddDealDialog from 'components/Transact/components/DealDialog/AddDealDialog';

import { GETPIPELINE } from 'graphQL/useQueryPipeline';
import { GETPIPELINES } from 'graphQL/useQueryPipelines';

import { setFlowState } from 'actions';

import { AppContext } from '../../../../src/AppContext';
import { headers } from '../../../cypressUtils/cypressHeaders';
import ldata from '../../../fixtures/ldata.json';

const TestComponent = ({ pipe, deals, pipelines }) => {
	const [, setStateApp] = useContext(AppContext);
	const dispatch = useDispatch();

	dispatch(
		setFlowState({
			selectedPipe: pipe,
			pipeToShow: pipe,
			pipeToShowTab: deals,
			pipelines: pipelines,
		})
	);

	useEffect(() => {
		setStateApp(stateApp => ({
			...stateApp,
			dealDialog: true,
			activeDeal: {
				...deals[1],
			},
		}));
	}, [deals, setStateApp]);

	return <AddDealDialog open={true} width="450px" isTransactPage onClose={() => {}} />;
};

describe('Transact Deal Dialog', () => {
	it('Checks if flowline is being changed in the deal', () => {
		// Payload for GETPIPELINE Api
		const getPipeLinePayload = {
			operationName: 'getPipeline',
			variables: { id: '65a15844bce604464fc1f0ad' },
			query: GETPIPELINE.loc.source.body,
		};

		// Payload for GETPIPELINES Api
		const getPipeLinesPayload = {
			operationName: 'getPipelines',
			variables: {},
			query: GETPIPELINES.loc.source.body,
		};

		// sending request to GETPIPELINE
		cy.request({
			method: 'POST',
			url: ldata.url,
			headers: headers,
			body: getPipeLinePayload,
		}).then(response => {
			const result = response.body.data;

			let deals = [];
			// creating data for component to load
			let pipe = {
				...result.pipeline,
				lanes: result.pipeline.lanes?.map(lane => ({
					...lane,
					cards: lane.cards?.map(card => {
						if (!card.metadata.IsDeleted) {
							deals.push({
								cardId: card.id,
								laneId: lane.id,
								laneName: lane.title,
								pipeline: result.pipeline._id,
								pipelineName: result.pipeline.name,
								ownerName:
									card?.metadata?.owners && card.metadata.owners[0]?.relatedObject?.name
										? card.metadata.owners[0].relatedObject.name
										: null,
								contactName:
									card?.metadata?.contacts && card.metadata.contacts[0]?.relatedObject?.entity?.name
										? card.metadata.contacts[0].relatedObject.entity.name
										: null,
								isContact:
									card?.metadata?.contacts && card.metadata.contacts[0]?.relatedObject?._id
										? card.metadata.contacts[0].relatedObject._id
										: null,
								...card.metadata,
							});
						}

						return { ...card };
					}),
				})),
			};
			// sending request to GETPIPELINES
			cy.request({
				method: 'POST',
				url: ldata.url,
				headers: headers,
				body: getPipeLinesPayload,
			}).then(res => {
				const { data } = res.body;

				// Mounting the component
				cy.viewport(1600, 1200).mount(<TestComponent deals={deals} pipe={pipe} pipelines={data.pipelines} />);

				// checking flowline field exists
				cy.get('#flowline').should('exist');

				// selecting options and verifying it is selected.
				cy.get('#flowline option')
					.first()
					.invoke('val')
					.then(value => {
						cy.get('#flowline').select(value);
						cy.get('#flowline').should('have.value', value);
					});

				cy.get('#flowline option')
					.last()
					.invoke('val')
					.then(value => {
						cy.get('#flowline').select(value);
						cy.get('#flowline').should('have.value', value);
					});
			});
		});
	});
});
