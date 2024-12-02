/* eslint-disable no-undef */
import MRTTable from 'components/MRTTable';
import { basic_timeouts } from '../../../cypress/cypressUtils/data';
import { UPDATECONTACT } from 'graphQL/useMutationUpdateContact';
import ldata from '../../fixtures/ldata.json';
import { headers } from '../../cypressUtils/cypressHeaders';

const updateContactPayload = {
	operationName: 'UpdateContact',
	variables: {
		contact: {
			_id: '65ad9213ede1b8fc69df499f',
			lastUpdateBy: '659ce7cf97935e0ffa857858',
			campaignName: ['contact campaign (Cypress do not Delete)'],
		},
		ignoreResponse: true,
	},
	query: UPDATECONTACT.loc.source.body,
};

const columns = [
	{
		name: 'Contact Owner',
		type: 'string',
	},
];

describe('Campaign Contact Table', () => {
	beforeEach(() => {
		cy.request({
			method: 'POST',
			url: ldata.url,
			headers: headers,
			body: updateContactPayload,
		}).then(response => {
			cy.interceptAndWait(['getESSimpleSearch', 'contacts_flat'], () => {
				cy.viewport(1600, 1200).mount(
					<MRTTable
						name="CampaignContactTable"
						overrideMeta={{
							defaultFilters: [
								{
									field: 'campaignName.keyword',
									value: 'contact campaign (Cypress do not Delete)',
								},
							],
						}}
					/>
				);
			});
		});
	});

	it('checks default filter is not missing in job', () => {
		cy.get(`[data-testid="over-ride-select-all-div"] input`).click();
		cy.get('.MuiButtonBase-root[data-testid="export-contact-and-purchse-icon-button"]').click();

		cy.interceptAndWait(
			['initializeExportJob'],
			alias => {
				cy.get('[data-testid="export-contact-and-purchse-icon-checkbox"]').click();

				cy.get('.MuiButtonBase-root[data-testid="export-contact-and-purchse-confirm-button"]').click();

				cy.wait(alias, { timeout: basic_timeouts.longTimeout }).then(jobResponse => {
					cy.wrap(jobResponse?.request?.body?.variables?.requestPayload?.filters)
						.should('exist')
						.and('be.an', 'array')
						.and('not.have.length', 0);
				});
			},
			{ wait: false }
		);
	});

	it('validates the syntax of the sort request sent to the backend', () => {
		cy.mrtSort({ column: columns[0], sorting: 'descending' });

		cy.interceptAndWait(
			['initializeExportJob'],
			alias => {
				cy.get('.MuiButtonBase-root[data-testid="download-csv"]').click();
				cy.get('.MuiButtonBase-root[data-testid="export-confirm"]').click();

				cy.wait(alias, { timeout: basic_timeouts.longTimeout }).then(jobResponse => {
					const sorting = jobResponse?.request?.body?.variables?.requestPayload?.sortOrder;
					expect(sorting.field.endsWith('.keyword')).to.be.true;
				});
			},
			{ wait: false }
		);
	});
});
