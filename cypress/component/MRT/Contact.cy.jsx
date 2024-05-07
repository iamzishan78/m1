/* eslint-disable no-undef */
import MRTTable from 'components/MRTTable';
import { basic_timeouts, retries } from '../../cypressUtils/data';
import moment from 'moment';

let responseHits = [];

const columns = [
  {
    name: 'Last Updated Date',
    type: 'date',
  },
  {
    name: 'Name',
    type: 'string',
    selector: 'div > p > div > div > a',
  },
];

const checkPrimaryAddress = (job) => {
  cy.wrap(job.resultsPayload.datasets[0].exportResponse[0]['Primary Address'])
    .should('exist')
    .and('not.be.empty');
};

const checkPurchasedPhoneNumbers = (job) => {
  cy.wrap(job.resultsPayload.datasets[0].exportResponse[0]['Phone 1'])
    .should('exist')
    .and('not.be.empty');
  cy.wrap(job.resultsPayload.datasets[0].exportResponse[0]['Phone 2'])
    .should('exist')
    .and('not.be.empty');
  cy.wrap(job.resultsPayload.datasets[0].exportResponse[0]['Phone 3'])
    .should('exist')
    .and('not.be.empty');
  cy.wrap(job.resultsPayload.datasets[0].exportResponse[0]['Phone 4'])
    .should('exist')
    .and('not.be.empty');
  cy.wrap(job.resultsPayload.datasets[0].exportResponse[0]['Phone 5'])
    .should('exist')
    .and('not.be.empty');
};

describe('Contact Table', () => {
  beforeEach(() => {
    cy.interceptAndWait(
      ['getESSimpleSearch'],
      (alias) => {
        cy.viewport(1600, 1200).mount(<MRTTable name="ContactTable" />, {
          spec: 'ContactTableSpec',
        });
        cy.wait(alias, { timeout: basic_timeouts.longTimeout }).then((response) => {
          responseHits = response.response.body.data.getESSimpleSearch.hits;
        });
      },
      { wait: false }
    );
  });

  it('Sorts by Name & Last Updated', () => {
    cy.wait(100);

    cy.mrtSortColumn({ column: columns[0] });
    cy.mrtSortColumn({ column: columns[1] });
  });

  it('Filters by Name & Last Updated Single Select', retries.fiveTries, () => {
    cy.get('.MuiButtonBase-root[aria-label="Show/Hide filters"]').click();

    cy.mrtSingleSelect({ column: columns[0] });
    cy.mrtSingleSelect({ column: columns[1] });
  });

  it('Filters by Name Multi Select', retries.fiveTries, () => {
    cy.get('.MuiButtonBase-root[aria-label="Show/Hide filters"]').click();
    cy.mrtMultiSelect({ column: columns[1] });
  });

  it('Filters by last updated Comparison Check', retries.fiveTries, () => {
    if (responseHits?.length) {
      const placeholder = 'Filter by Last Updated Date';
      cy.get('.MuiButtonBase-root[aria-label="Show/Hide filters"]').click();

      const lastUpdateAt = responseHits[0].lastUpdateAt;
      const currentDateForPreviousDay = new Date(lastUpdateAt);
      currentDateForPreviousDay.setDate(currentDateForPreviousDay.getDate() - 1);
      const oneDayPriorDate = currentDateForPreviousDay.toISOString().split('T')[0];
      cy.get(`[data-testid="MoreVertIcon"]`).eq(19).click();
      cy.wait(500);
      cy.get('[data-testid="sentinelStart"] + div ul li:nth-child(5)').click();
      cy.wait(500);
      cy.get('[data-testid="sentinelStart"] + div ul li:nth-child(1):eq(1)').click();
      cy.mrtComparisonFilterCheck({
        column: columns[0],
        type: 'date',
        value: moment.parseZone(new Date(oneDayPriorDate)).format('MM/DD/YY'),
        filter: 'greaterThanEqualTo',
        placeholder,
      });

      const currentDateForNextDay = new Date(lastUpdateAt);
      currentDateForNextDay.setDate(currentDateForNextDay.getDate() + 1);
      const nextDayDate = currentDateForNextDay.toISOString().split('T')[0];
      cy.get('[data-testid="MoreVertIcon"]').eq(19).scrollIntoView().click({ force: true });
      cy.wait(500);
      cy.get('[data-testid="sentinelStart"] + div ul li:nth-child(5)').click();
      cy.wait(500);
      cy.get('[data-testid="sentinelStart"] + div ul li:nth-child(2):eq(1)').click();
      cy.mrtComparisonFilterCheck({
        column: columns[0],
        type: 'date',
        value: moment.parseZone(new Date(nextDayDate)).format('MM/DD/YY'),
        filter: 'lessThanEqualTo',
        placeholder,
      });
    }
  });

  // Define a test case to verify the Campaign Name Bulk Update functionality
  it('Campaign Name Bulk Update Works', () => {
    // Intercept and wait for a specific API call ('getESSimpleSearch') and perform actions after the call is made
    cy.interceptAndWait(
      ['getESSimpleSearch'],
      (alias) => {
        // Set the viewport size to simulate a desktop environment
        cy.viewport(1600, 1200).mount(<MRTTable name="ContactTable" />, {
          // Pass custom settings to the MRTTable component for the test
          mrtOverrideMeta: {
            isDefaultGridView: false,
            gridViewOverride: 'Purchased',
          },
        });
        // Wait for the API call to finish with a custom timeout and process the response
        cy.wait(alias, { timeout: basic_timeouts.longTimeout }).then((response) => {
          // Store the hits from the API response for later assertions or usage
          responseHits = response.response.body.data.getESSimpleSearch.hits;
        });
      },
      { wait: false } // Do not automatically wait for the intercepted request
    );

    // Select all entries in a table or list for bulk updating by clicking the select all checkbox
    cy.get('[aria-label="Toggle select all"]').eq(0).click();

    // Initiate the bulk update process by clicking the bulk update button
    cy.get('[data-testid="bulk-update"]').click();

    // Find and interact with the field selection autocomplete input for choosing "Campaign Name"
    cy.get('[data-testid="select-field-autocomplete"]', { timeout: 10000 })
      .clear() // Clear any existing input
      .type('Campaign Name'); // Type the field name to update

    // Select the "Campaign Name" option from the autocomplete suggestions
    cy.get('.MuiAutocomplete-option').contains('Campaign Name').click({ force: true });

    // Wait for 5 seconds, possibly to allow for UI updates or transitions
    cy.wait(5000);

    // Clear the current selection in the campaign name input field for updating
    cy.get(
      '[aria-labelledby="alert-dialog-slide-title"] [data-testid="campaign-name-autocomplete"] input'
    ).clear();

    // Select the first option from the campaign name autocomplete suggestions
    cy.get('.MuiAutocomplete-option').eq(0).click({ force: true });

    // Retrieve and store the name of the campaign selected for the update
    cy.get('[aria-labelledby="alert-dialog-slide-title"] [data-testid="campaign-name-chip"]')
      .eq(0)
      .invoke('text')
      .then((campaignName) => {
        // Intercept and wait for the 'getESSimpleSearch' API call again after clicking the action button to submit the update
        cy.get('[data-testid="action-button"]', { timeout: 5000 }).click();
        cy.wait(100000);
        // Assert that the campaign name displayed in the UI matches the one selected for the update
        cy.get('[data-testid="campaign-name-chip"]').eq(0).should('have.text', campaignName);
      });
  });

  it('Filters by name and checks is primary address value is exporting', retries.fiveTries, () => {
    cy.get(`[data-testid="MoreVertIcon"]`).first().click();
    cy.wait(basic_timeouts.shorTimeout);
    cy.get('[data-testid="sentinelStart"] + div ul li:nth-child(5)').click();
    cy.wait(basic_timeouts.shorTimeout);
    cy.get(`[data-testid="MoreVertIcon"]`).first().click();
    cy.wait(basic_timeouts.shorTimeout);
    cy.get('[data-testid="sentinelStart"] + div ul li:nth-child(5)').click();
    cy.wait(basic_timeouts.shorTimeout);
    cy.get('[data-testid="sentinelStart"] + div ul li:nth-child(9):eq(1)').click();
    cy.get('.MuiButtonBase-root[aria-label="Show/Hide filters"]').click();
    cy.mrtFilterBySearch({
      value: 'CLARK (Cypress do not delete)',
      columnlabel: 'Name',
      alias: 'Name',
    });
    cy.get('[data-testid="download-csv"]').click();

    cy.interceptAndWait(
      ['initializeExportJob'],
      (alias) => {
        cy.contains('span.MuiButton-label', 'Export').click();
        cy.wait(alias, { timeout: basic_timeouts.longTimeout }).then((response) => {
          const jobId = response.response.body.data.initializeExportJob.job._id;
          // passed a callback(checkPrimaryAddress) which is called after the job execution
          cy.pollJobStatus({ jobId, callback: checkPrimaryAddress });
        });
      },
      { wait: false }
    );
  });

  it('Filters by name and verifies purchased phone 1-5 are exporting', retries.fiveTries, () => {
    cy.mrtFilterBySearch({
      value: 'CLARK (Cypress do not delete)',
      columnlabel: 'Name',
      alias: 'Name',
    });
    cy.get('[data-testid="download-csv"]').click();

    cy.interceptAndWait(
      ['initializeExportJob'],
      (alias) => {
        cy.contains('span.MuiButton-label', 'Export').click();
        cy.wait(alias, { timeout: basic_timeouts.longTimeout }).then((response) => {
          const jobId = response.response.body.data.initializeExportJob.job._id;
          // passed a callback(checkPurchasedPhoneNumbers) which is called after the job execution
          cy.pollJobStatus({ jobId, callback: checkPurchasedPhoneNumbers });
        });
      },
      { wait: false }
    );
  });
});
