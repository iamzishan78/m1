/* eslint-disable no-undef */
import BulkUpload from 'components/BulkUpload/BulkUpload';
import ldata from '../../fixtures/ldata.json';
import { headers } from '../../cypressUtils/cypressHeaders';
import { VERIFY_SHAPE_UPLOAD_JOB } from 'graphQL/useMutationCypressVerifyShapeUploadJob';
import { basic_timeouts } from '../../cypressUtils/data';

// Define the filename for the CSV file
const fileName = 'TEST_TRACTS_Upload.csv';

// Describe block for the test suite
describe('BulkUpload Component Tract Upload', () => {
  // Before each test case, mount the BulkUpload component
  beforeEach(() => {
    cy.viewport(1800, 1200).mount(<BulkUpload routes={[]} initialJobType="TRACTS" />);
  });

  // Test case for Tracts Upload functionality
  it('Check Tracts Upload works', () => {
    // Select the CSV file using the file input
    cy.get('[data-testid="csv-dropzone"] input', { force: true }).selectFile(
      `cypress/files/${fileName}`,
      {
        force: true,
      }
    );

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

  // Test case for verifying the Tracts Upload
  it('Tracts Upload is verified', () => {
    // Send a request to verify the Tracts Upload
    cy.request({
      method: 'POST',
      url: ldata.url,
      headers: headers,
      body: {
        operationName: 'verifyShapeUploadJob',
        variables: {
          _id: '6634b60129c95c897bd1736e',
          royalty_interest: '0.00067827',
          offer_price: '10000',
          max_offer_price: '11570',
          offer_price_nma: '12000',
          max_offer_price_nma: '16000',
          name: 'TEST UPLOAD PARCEL A-678',
          shapeType: 'parcel',
          campaignName: 'Summer Camapaign',
        },
        query: VERIFY_SHAPE_UPLOAD_JOB.loc.source.body, // GraphQL query
      },
      timeout: basic_timeouts.longTimeout, // Set timeout
    }).then(response => {
      const res = response.body.data.verifyShapeUploadJob; // Extract response data

      Cypress.log({
        name: 'Check Tract Added',
        message: res.data.isShapeAdded,
      });

      Cypress.log({
        name: 'Check Tract Updated',
        message: res.data.isShapeUpdated,
      });

      // Assertions
      expect(response.status).to.equal(200); // Check response status
      expect(res.success).to.be.equal(true); // Check if the response indicates success
    });
  });
});
