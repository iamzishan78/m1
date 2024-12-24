/* eslint-disable no-undef */
import Wells from 'components/Land/components/Wells';

import { REMOVE_WELLS } from 'graphQL/useMutationRemoveWells';

import { headers } from '../../cypressUtils/cypressHeaders';
import { basic_timeouts } from '../../cypressUtils/data';
import ldata from '../../fixtures/ldata.json';

let wellIds;
let wellName;

describe('MyWells ESHOC Table', () => {
	it('adds and remove well from slideout', () => {
		let addedWellId;
		cy.interceptAndWait(['getESSimpleSearch', 'mywells_flat'], () => {
			cy.viewport(1600, 1200).mount(<Wells />, { testCase: 'MyWellsNameUpdate' });
		});
		cy.contains('+ ADD WELL').click({ force: true });
		cy.get('[data-testid="well-search-field"]').clear().type('JJ PRATER HEIRS JJ-I1');
		cy.wait(15000);
		cy.interceptAndWait(
			['getESSimpleSearch'],
			alias => {
				cy.get('.MuiAutocomplete-option').first().click();
				cy.wait(10000);
				cy.get('[data-testid="close-dialog"]').click();
				cy.wait(alias, { timeout: basic_timeouts.longTimeout }).then(response => {
					addedWellId = response.response.body.data.getESSimpleSearch.hits[0]._id;
				});
				cy.get("[data-testid='column-with-link']", {
					timeout: basic_timeouts.midTimeout,
				})
					.eq(0)
					.click({ force: true });

				cy.wait(15000);
				cy.get('[data-testid="menu-icon"]').click();
				cy.get('[data-testid="delete-button"]').click();
				cy.interceptAndWait(
					['getESSimpleSearch'],
					alias => {
						cy.get('[data-testid="deleteButton-popup"]').click();
						cy.wait(alias, { timeout: basic_timeouts.longTimeout }).then(response => {
							expect(addedWellId).to.not.equal(response.response.body.data.getESSimpleSearch.hits?.[0]?._id);
						});
					},
					{ wait: false }
				);
			},
			{ wait: false }
		);
	});

	it('adds well from slideout', () => {
		let addedWellId;
		cy.interceptAndWait(['getESSimpleSearch', 'mywells_flat'], () => {
			cy.viewport(1600, 1200).mount(<Wells />, {
				testCase: 'MyWellsNameUpdate',
			});
		});
		cy.contains('+ ADD WELL').click({ force: true });
		cy.get('[data-testid="well-search-field"]').clear().type('JJ PRATER HEIRS JJ-I1');
		cy.wait(15000);
		cy.interceptAndWait(
			['getESSimpleSearch'],
			alias => {
				cy.get('.MuiAutocomplete-option').first().click();
				cy.wait(10000);
				cy.get('[data-testid="close-dialog"]').click();
				cy.wait(alias, { timeout: basic_timeouts.longTimeout }).then(response => {
					addedWellId = response.response.body.data.getESSimpleSearch.hits[0]._id;
				});
			},
			{ wait: false }
		);
	});

	it('checks well name is updating correctly', () => {
		cy.interceptAndWait(['getESSimpleSearch', 'mywells_flat'], () => {
			cy.viewport(1600, 1200).mount(<Wells />, {
				testCase: 'MyWellsNameUpdate',
			});
		});

		// Generate a random number between 1 and 1000 (adjust range as needed)
		const randomNumber = Math.floor(Math.random() * 1000) + 1;
		wellName = `Testing well name ${randomNumber}`;

		cy.get("[data-testid='column-with-link']", {
			timeout: basic_timeouts.midTimeout,
		})
			.eq(0)
			.click({ force: true });

		cy.wait(15000);

		cy.get('[data-testid="Well Name"]').clear().type(wellName);

		cy.get('[data-testid="close-dialog"]').click();

		cy.wait(15000);

		cy.get("[data-testid='column-with-link']", {
			timeout: basic_timeouts.midTimeout,
		})
			.eq(0)
			.should('have.text', wellName);
	});

	it('deletes wells correctly', () => {
		cy.interceptAndWait(['getESSimpleSearch', 'mywells_flat'], () => {
			cy.viewport(1600, 1200).mount(<Wells />, { testCase: 'MyWellsNameUpdate' });
		});

		cy.interceptAndWait(
			['gridGenericRemove'],
			alias => {
				// Selecting all rows for deletion
				cy.get('[data-testid="over-ride-select-all-div"] input').click();
				// Clicking on the delete icon button to delete selected rows
				cy.get('.MuiButtonBase-root[data-testid="delete-icon-button"]').click();
				// Confirming the deletion
				cy.get('.MuiButtonBase-root[data-testid="delete-confirm"]').click();
				// Waiting for the delete response and processing the response data
				cy.wait(alias, { timeout: basic_timeouts.longTimeout }).then(deleteResponse => {
					const data = deleteResponse?.response?.body?.data?.gridGenericRemove.data;
					wellIds = data?.deletedData?.mainRecord;
					// Asserting that the status code is 200 for successful deletion
					expect(deleteResponse?.response?.statusCode).to.eq(200);
				});
			},
			// Options for interception
			{ wait: false }
		);
	});

	it('restores deleted wells', () => {
		const payload = {
			operationName: 'removeWells',
			variables: {
				wellIds,
				isDeleted: false,
			},
			query: REMOVE_WELLS.loc.source.body,
		};

		cy.request({
			method: 'POST',
			url: ldata.url,
			headers: headers,
			body: payload,
		}).then(response => {
			expect(response.status).to.eq(200);
			expect(response.body.data.removeWells.success).to.eq(true);
		});
	});
});
