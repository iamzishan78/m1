/* eslint-disable no-undef */
import MRTTable from 'components/MRTTable';
import { basic_timeouts, retries } from '../../cypressUtils/data';
import moment from 'moment';
import ldata from '../../fixtures/ldata.json';
import { GET_JOBS_STATUS } from 'graphQL/useQueryGetJobStatus';

let responseHits = [];
const getJobPayload = {
  operationName: 'getJobsStatus',
  variables: {
    "userId": "659ce7cf97935e0ffa857858",
    "showProgress": true
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

const checkPrimaryAddress = (job) => {
  cy.wrap(job.resultsPayload.datasets[0].exportResponse[0]["Primary Address"])
    .should('exist')
    .and('not.be.empty');
}

const pollExportJobStatus = (ldata, headers, getJobPayload, jobId, callback) => {
  cy.request({
    method: 'POST',
    url: ldata.url,
    headers: headers,
    body: getJobPayload,
  }).then(response => {
    const job = response.body.data.getJobsStatus.jobs.find((job) => (job._id === jobId));
    if (job.status !== "Completed") {
      cy.wait(5000);
      pollExportJobStatus(ldata, headers, getJobPayload, jobId, callback);
    } else {
      callback(job);
    }
  });
}



describe('Contact Table', () => {
  beforeEach(() => {
    cy.interceptAndWait(
      ['getESSimpleSearch'],
      alias => {
        cy.viewport(1600, 1200).mount(<MRTTable name="ContactTable" />, { spec: 'ContactTableSpec' });
        cy.wait(alias, { timeout: basic_timeouts.longTimeout }).then(response => {
          responseHits = response.response.body.data.getESSimpleSearch.hits;
        });
      },
      { wait: false }
    );
  });

  it('sorts by Name & Last Updated', () => {
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

  it('Filters by name and checks is primary address value is exporting', retries.fiveTries, () => {
    cy.mrtFilterBySearch({
      value: "CLARK (Cypress do not delete)",
      columnlabel: "Name",
      alias: "Name"
    });
    cy.get('[data-testid="download-csv"]').click();

    cy.interceptAndWait(['initializeExportJob'], (alias) => {
      cy.contains('span.MuiButton-label', 'Export').click();
      cy.wait(alias, { timeout: basic_timeouts.longTimeout }).then((response) => {
        const jobId = response.response.body.data.initializeExportJob.job._id
        const exportJob = pollExportJobStatus(ldata, headers, getJobPayload, jobId, checkPrimaryAddress);
      });
    }, { wait: false });
  });
});
