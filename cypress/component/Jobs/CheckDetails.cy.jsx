/* eslint-disable no-undef */
import { v4 as uuid } from 'uuid';
import BulkUpload from 'components/BulkUpload/BulkUpload';
import { VERIFY_CHECK_DETAIL_JOB } from 'graphQL/useMutationCypressVerifyCheckDetailsJob';
import ldata from '../../fixtures/ldata.json';
import { headers } from '../../cypressUtils/cypressHeaders';
import { basic_timeouts } from '../../cypressUtils/data';

// Generate a unique source ID using UUID v4
const sourceId = uuid();

// Define the filename for the CSV file
const fileName = 'Checkdetail Test Upload.csv';

// Describe block for the test suite
describe('BulkUpload Component Check Details Upload', () => {
  // Before each test case, mount the BulkUpload component
  beforeEach(() => {
    cy.viewport(1800, 1200).mount(
      <BulkUpload routes={[]} initialJobType="CHECKDETAILS" />
    );
  });

  // Test case for Check Details Upload functionality
  it('Check Details Upload works', () => {
    // Type the generated source ID into the input field
    cy.get('#sourceId').type(sourceId);

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
    cy.get('#Continue-button').click();

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

  // Test case for verifying the Check Details Upload
  it('Check Details Upload is verified', () => {
    // Send a request to verify the Check Details Upload
    cy.request({
      method: 'POST',
      url: ldata.url,
      headers: headers,
      body: {
        operationName: 'verifyCheckDetailsJob',
        variables: {
          sourceId,
          purchaserName: 'Cypress Test Upload',
          propertyNames: ['Test Property 1', 'Test Property 2'],
          propertyNumbers: ['1397122.1', '1397122.2'],
          propertyCount: 2,
          checkCount: 1,
          checkDetailCount: 5,
        },
        query: VERIFY_CHECK_DETAIL_JOB.loc.source.body, // GraphQL query
      },
      timeout: basic_timeouts.longTimeout, // Set timeout
    }).then(response => {
      const res = response.body.data.verifyCheckDetailsJob; // Extract response data

      // Log assertions
      Cypress.log({
        name: 'Property Count Match',
        message: res.data.doesPopertyCountMatch,
      });

      Cypress.log({
        name: 'Check Count Match',
        message: res.data.doesCheckCountMatch,
      });

      Cypress.log({
        name: 'Check Detail Count Match',
        message: res.data.doesCheckDetailCountMatch,
      });

      Cypress.log({
        name: 'Check and Check Detail Amounts Match',
        message: res.data.checkAndCheckDetailAmountsMatch,
      });

      Cypress.log({
        name: 'Properties Linked Correctly',
        message: res.data.propertiesLinkedCorrectly,
      });

      // Assertions
      expect(response.status).to.equal(200); // Check response status
      expect(res.success).to.be.equal(true); // Check if the response indicates success
    });
  });
});
