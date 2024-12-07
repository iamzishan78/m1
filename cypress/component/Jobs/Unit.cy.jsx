/* eslint-disable no-undef */
import BulkUpload from 'components/BulkUpload/BulkUpload';
import ldata from '../../fixtures/ldata.json';
import { headers } from '../../cypressUtils/cypressHeaders';
import { VERIFY_SHAPE_UPLOAD_JOB } from 'graphQL/useMutationCypressVerifyShapeUploadJob';
import { basic_timeouts } from '../../cypressUtils/data';

// Define the filename for the CSV file
const fileName = 'TEST_UNITS_Upload.csv';

// Describe block for the test suite
describe('BulkUpload Component Unit Upload', () => {
	// Before each test case, mount the BulkUpload component
	beforeEach(() => {
		cy.viewport(1800, 1200).mount(<BulkUpload routes={[]} initialJobType="UNITS" />);
	});

	// Test case for Units Upload functionality
	it('Check Units Upload works', () => {
		// Select the CSV file using the file input
		cy.get('[data-testid="csv-dropzone"] input', { force: true }).selectFile(`cypress/files/${fileName}`, {
			force: true,
		});

		// Wait for 500 milliseconds
		cy.wait(500);

		// Click the Continue button
		cy.get('#Continue-button').click({ force: true });

		// Wait for 500 milliseconds
		cy.wait(500);

		// Intercept and wait for the createJob request, then perform assertions
		cy.interceptAndWait(
			['createJob'],
			alias => {
				cy.get('#Upload-button').click(); // Click the Upload button

				cy.wait(alias, { timeout: basic_timeouts.longTimeout }).then(response => {
					const jobId = response.request.body.variables.jobId; // Extract jobId from the response

					const callback = res => {
						// Callback function
					};

					cy.pollJobStatus({ jobId, callback }); // Poll the job status
				});
			},
			{ wait: false } // Set wait option to false
		);
	});

	// Test case for verifying the Units Upload
	it('Units Upload is verified', () => {
		// Send a request to verify the Units Upload
		cy.request({
			method: 'POST',
			url: ldata.url,
			headers: headers,
			body: {
				operationName: 'verifyShapeUploadJob',
				variables: {
					_id: '663c7440c5501cd9af29e719',
					royalty_interest: '0.000068',
					offer_price: '3283.99',
					uAcres: '500',
					uUnitPricing: '12500',
					nra: '0.26271936',
					shapeType: 'unit',
					campaignName: 'Summer Camapaign',
					name: 'TEST UPLOAD UNIT A-678',
				},
				query: VERIFY_SHAPE_UPLOAD_JOB.loc.source.body, // GraphQL query
			},
			timeout: basic_timeouts.longTimeout, // Set timeout
		}).then(response => {
			const res = response.body.data.verifyShapeUploadJob; // Extract response data

			Cypress.log({
				name: 'Check Unit Added',
				message: res.data.isShapeAdded,
			});

			Cypress.log({
				name: 'Check Unit Updated',
				message: res.data.isShapeUpdated,
			});

			// Assertions
			expect(response.status).to.equal(200); // Check response status
			expect(res.success).to.be.equal(true); // Check if the response indicates success
		});
	});
});
