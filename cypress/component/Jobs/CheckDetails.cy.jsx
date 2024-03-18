/* eslint-disable no-undef */
import { v4 as uuid } from 'uuid';
import BulkUpload from 'components/BulkUpload/BulkUpload';
import { VERIFY_CHECK_DETAIL_JOB } from 'graphQL/useMutationCypressVerifyCheckDetailsJob';
import ldata from '../../fixtures/ldata.json';
import { headers } from '../../cypressUtils/cypressHeaders';
import { basic_timeouts } from '../../cypressUtils/data';

const sourceId = uuid();

const fileName = 'Checkdetail Test Upload.csv';

// let job = null;

describe('BulkUpload Component Check Details Uplaod', () => {
  beforeEach(() => {
    cy.viewport(1800, 1200).mount(
      <BulkUpload routes={[]} initialJobType="CHECKDETAILS" />
    );
  });

  it('Check Details Uplaod works', () => {
    cy.get('#sourceId').type(sourceId);

    cy.get('[data-testid="csv-dropzone"] input', { force: true }).selectFile(
      `cypress/files/${fileName}`,
      {
        force: true,
      }
    );

    cy.wait(500);

    cy.get('#Continue-button').click();

    cy.wait(500);

    cy.interceptAndWait(
      ['createJob'],
      alias => {
        cy.get('#Upload-button').click();

        cy.wait(alias, { timeout: basic_timeouts.longTimeout }).then(response => {
          const jobId = response.request.body.variables.jobId;

          const callback = res => {
            // job = res;
          };

          cy.pollJobStatus({ jobId, callback });
        });
      },
      { wait: false }
    );
  });

  it('Check Details Uplaod is verified', () => {
    cy.request({
      method: 'POST',
      url: ldata.url,
      headers: headers,
      body: {
        operationName: 'verifyCheckDetailsJob',
        variables: {
          sourceId,
          purchaserName: 'Cypress Test Upload',
          propertyNames: ['1397122.1', '1397122.2'],
          propertyNumbers: ['1397122.1', '1397122.2'],
          propertyCount: 2,
          checkCount: 1,
          checkDetailCount: 5,
        },
        query: VERIFY_CHECK_DETAIL_JOB.loc.source.body,
      },
      timeout: basic_timeouts.longTimeout,
    }).then(response => {
      const res = response.body.data.verifyCheckDetailsJob;

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

      expect(response.status).to.equal(200);
      expect(res.success).to.be.equal(true);
    });
  });
});
