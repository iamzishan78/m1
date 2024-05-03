import MRTTable from 'components/MRTTable';
import { basic_timeouts } from '../../cypressUtils/data';
import _ from 'lodash';

let responseHits;
describe('Unit Interest Owners Table', () => {
  beforeEach(() => {
    cy.interceptAndWait(
      ['getESSimpleSearch', 'shapeowners_flat'],
      (alias) => {
        cy.viewport(1600, 1200).mount(
          <MRTTable
            name="OwnersPerUnitTable"
            overrideMeta={{
              defaultFilters: [
                {
                  field: 'shape._id',
                  value: '65eeef41f1e14c0724bee441',
                },
                {
                  field: 'contact.IsDeleted',
                  value: 'false',
                },
              ],
            }}
          />,
          {
            spec: 'OwnersPerUnitTable',
          }
        );

        cy.wait(alias, { timeout: basic_timeouts.longTimeout }).then((response) => {
          responseHits = response.response.body.data.getESSimpleSearch.hits;
        });
      },
      { wait: false }
    );
  });

  it('checks slideouts has offer price fields', () => {
    cy.wait(15000);
    cy.get('tr').eq(1).find('td').eq(3).click();
    cy.wait(15000);
    // Will check if the field exists
    cy.get('[data-testid="max-offer-price-field"]').should('exist');
    cy.get('[data-testid="uUnitPricingInterest-field"]').should('exist');
    cy.get('[data-testid="uMaxUnitPricingInterest-field"]').should('exist');
    cy.get('body').click();
  });

  it('should export contact and contact purchaser', () => {
    cy.wait(1000);
    cy.get(`[data-testid="over-ride-select-all-div"] input`).click();
    cy.get('.MuiButtonBase-root[data-testid="export-contact-and-purchse-icon-button"]').click();

    cy.interceptAndWait(
      ['initializeExportJob'],
      (alias) => {
        cy.get('[data-testid="export-contact-and-purchse-icon-checkbox"]').click();

        cy.get(
          '.MuiButtonBase-root[data-testid="export-contact-and-purchse-confirm-button"]'
        ).click();

        cy.wait(alias, { timeout: basic_timeouts.longTimeout }).then((jobResponse) => {
          const jobId = jobResponse.response.body.data.initializeExportJob.job._id;

          //response.body.data.initializeExportJob.job._id

          const callback = (res) => {
            const datasets = res.resultsPayload.datasets;
            let exportData = _.find(datasets, { dataset: 'exportContacts' }) || {};
            exportData = exportData.exportResponse;

            expect(responseHits).to.have.lengthOf(exportData.length);

            const gridFullName = `${responseHits[0]?.firstName} ${responseHits[0]?.lastName}`;
            const exportFullNameObj = _.find(exportData, { 'Full Name': gridFullName }) || {};

            expect(exportFullNameObj['Full Name']).to.equal(gridFullName);
          };

          cy.pollJobStatus({ jobId, callback });
        });
      },
      { wait: false }
    );

    //done
  });
});
