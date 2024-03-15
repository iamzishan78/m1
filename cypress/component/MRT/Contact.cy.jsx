/* eslint-disable no-undef */
import MRTTable from 'components/MRTTable';
import { basic_timeouts, retries } from '../../cypressUtils/data';
import moment from 'moment';
import ldata from '../../fixtures/ldata.json';
import { GET_JOBS_STATUS } from 'graphQL/useQueryGetJobStatus';

let responseHits = [];

// headers for job polling
const getJobPayload = {
  operationName: 'getJobsStatus',
  variables: {
    userId: '659ce7cf97935e0ffa857858',
    showProgress: true,
  },
  query: GET_JOBS_STATUS.loc.source.body,
};

const headers = {
  'Content-Type': 'application/json',
  'X-ZUMO-AUTH': ldata.x_zumo_auth,
};

const columns = [
  {
    name: 'Last Updated',
    type: 'date',
  },
  {
    name: 'Name',
    type: 'string',
    selector: 'div > p > div > div > a',
  },
];

const checkPrimaryAddress = job => {
  cy.wrap(job.resultsPayload.datasets[0].exportResponse[0]['Primary Address'])
    .should('exist')
    .and('not.be.empty');
};

const checkPurchasedPhoneNumbers = job => {
  console.log(job.resultsPayload.datasets);
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

// Function to poll and check the status of an export job
const pollExportJobStatus = (ldata, headers, getJobPayload, jobId, callback) => {
  // Make a POST request to get jobs
  cy.request({
    method: 'POST',
    url: ldata.url,
    headers: headers,
    body: getJobPayload,
  }).then(response => {
    // Find the job with the specified jobId in the response
    const job = response.body.data.getJobsStatus.jobs.find(job => job._id === jobId);

    // Check if the job status is 'Failed'
    if (job.status === 'Failed') {
      cy.fail('The job has failed.');
    }

    // Check if the job status is 'Completed'
    if (job.status === 'Completed') {
      // If completed, invoke the callback with the job details
      callback(job);
    } else {
      // If the job is still in progress, wait for 5 seconds and then recursively call the function
      cy.wait(5000);
      pollExportJobStatus(ldata, headers, getJobPayload, jobId, callback);
    }
  });
};

describe('Contact Table', () => {
  beforeEach(() => {
    cy.interceptAndWait(
      ['getESSimpleSearch'],
      alias => {
        cy.viewport(1600, 1200).mount(<MRTTable name="ContactTable" />, {
          spec: 'ContactTableSpec',
        });
        cy.wait(alias, { timeout: basic_timeouts.longTimeout }).then(response => {
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
      const placeholder = 'Filter by Last Updated';
      cy.get('.MuiButtonBase-root[aria-label="Show/Hide filters"]').click();

      const lastUpdateAt = responseHits[0].lastUpdateAt;
      const currentDateForPreviousDay = new Date(lastUpdateAt);
      currentDateForPreviousDay.setDate(currentDateForPreviousDay.getDate() - 1);
      const oneDayPriorDate = currentDateForPreviousDay.toISOString().split('T')[0];
      cy.get(`[data-testid="MoreVertIcon"]`).eq(16).click();
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
      cy.get('[data-testid="MoreVertIcon"]')
        .eq(16)
        .scrollIntoView()
        .click({ force: true });
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
      alias => {
        // Set the viewport size to simulate a desktop environment
        cy.viewport(1600, 1200).mount(<MRTTable name="ContactTable" />, {
          // Pass custom settings to the MRTTable component for the test
          mrtOverrideMeta: { isDefaultGridView: false, gridViewOverride: 'Purchased' },
        });
        // Wait for the API call to finish with a custom timeout and process the response
        cy.wait(alias, { timeout: basic_timeouts.longTimeout }).then(response => {
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
    cy.get(
      '[aria-labelledby="alert-dialog-slide-title"] [data-testid="campaign-name-chip"]'
    )
      .eq(0)
      .invoke('text')
      .then(campaignName => {
        // Intercept and wait for the 'getESSimpleSearch' API call again after clicking the action button to submit the update
        cy.interceptAndWait(['getESSimpleSearch'], () => {
          cy.get('[data-testid="action-button"]', { timeout: 5000 }).click();
        });
        // Assert that the campaign name displayed in the UI matches the one selected for the update
        cy.get('[data-testid="campaign-name-chip"]')
          .eq(0)
          .should('have.text', campaignName);
      });
  });

  it(
    'Filters by name and checks is primary address value is exporting',
    retries.fiveTries,
    () => {
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
        alias => {
          cy.contains('span.MuiButton-label', 'Export').click();
          cy.wait(alias, { timeout: basic_timeouts.longTimeout }).then(response => {
            const jobId = response.response.body.data.initializeExportJob.job._id;
            // passed a callback(checkPrimaryAddress) which is called after the job execution
            pollExportJobStatus(
              ldata,
              headers,
              getJobPayload,
              jobId,
              checkPrimaryAddress
            );
          });
        },
        { wait: false }
      );
    }
  );

  it(
    'Filters by name and verifies purchased phone 1-5 are exporting',
    retries.fiveTries,
    () => {
      cy.mrtFilterBySearch({
        value: 'CLARK (Cypress do not delete)',
        columnlabel: 'Name',
        alias: 'Name',
      });
      cy.get('[data-testid="download-csv"]').click();

      cy.interceptAndWait(
        ['initializeExportJob'],
        alias => {
          cy.contains('span.MuiButton-label', 'Export').click();
          cy.wait(alias, { timeout: basic_timeouts.longTimeout }).then(response => {
            const jobId = response.response.body.data.initializeExportJob.job._id;
            // passed a callback(checkPurchasedPhoneNumbers) which is called after the job execution
            pollExportJobStatus(
              ldata,
              headers,
              getJobPayload,
              jobId,
              checkPurchasedPhoneNumbers
            );
          });
        },
        { wait: false }
      );
    }
  );
});
