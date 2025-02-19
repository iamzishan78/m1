/* eslint-disable no-undef */
import React from 'react';

import MRTTable from 'components/MRTTable';

import { REVERTCYPRESSDELETE } from 'graphQL/useMutationCommonCypressRevert';

import { SUCCESS_STATUS } from 'utils/consts';

import { headers } from '../../cypressUtils/cypressHeaders';
import { basic_timeouts } from '../../cypressUtils/data';
import ldata from '../../fixtures/ldata.json';

// Describe block for testing the Tract Interest Owners Table
describe('Tract Interest Owners Table', () => {
	// Before each test, intercept and wait for specific requests and mount the MRTTable component with predefined props
	beforeEach(() => {
		cy.interceptAndWait(['getDbData', 'shapeowners_flat'], () => {
			// Mounting the MRTTable component with predefined props

			cy.viewport(1600, 1200).mount(
				<MRTTable
					name="TractInterestOwnerTable"
					// Overriding meta information with default filters
					overrideMeta={{
						defaultFilters: [
							{
								field: 'shape._id',
								value: '65a9129609723f222ab5a4e8',
							},
							{
								field: 'contact.IsDeleted',
								value: 'false',
							},
							{
								field: 'descriptor',
								value: 'ParcelDescriptor',
							},
						],
					}}
				/>,
				// Providing additional props for test case execution
				{
					testCase: {
						cypressDelete: true,
					},
				}
			);
		});
	});

	// Test case to verify deletion of selected rows
	it('Should delete selected rows', () => {
		// Intercepting and waiting for specific requests to perform deletion
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
					// Asserting that the status code is 200 for successful deletion
					expect(deleteResponse?.response?.statusCode).to.eq(SUCCESS_STATUS);
					// Waiting for some time before reverting the deletion
					cy.wait(1000).then(() => {
						// Building payload for reverting the deletion
						const getLayerPayload = {
							operationName: 'revertCypressDelete',
							variables: { data: { ...data, modelKey: 'ParcelDescriptor', keyToBeUpdate: 'isDeleted' } },
							query: REVERTCYPRESSDELETE.loc.source.body,
						};
						// Making a request to revert the deletion
						cy.request({
							method: 'POST',
							url: ldata.url,
							headers: headers,
							body: getLayerPayload,
						}).then(r => {
							// Asserting that the revert operation is successful
							expect(r.status).to.eq(SUCCESS_STATUS);
							expect(r.body.data?.revertCypressDelete?.success).to.eq(true);
						});
					});
				});
			},
			// Options for interception
			{ wait: false }
		);
	});
});
