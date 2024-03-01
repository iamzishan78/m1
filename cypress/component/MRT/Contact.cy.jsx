/* eslint-disable no-undef */
import MRTTable from 'components/MRTTable';
import { basic_timeouts, retries } from '../../cypressUtils/data';
import moment from 'moment';

let responseHits = [];

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

describe('Contact Table', () => {
  beforeEach(() => {
    cy.interceptAndWait(
      ['getESSimpleSearch'],
      alias => {
        cy.viewport(1600, 1200).mount(<MRTTable name="ContactTable" />);
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
    console.log(responseHits);
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

  it('Campaign Name Bulk Update Works', () => {
    cy.interceptAndWait(
      ['getESSimpleSearch'],
      alias => {
        cy.viewport(1600, 1200).mount(<MRTTable name="ContactTable" />, {
          mrtOverrideMeta: { isDefaultGridView: false, gridViewOverride: 'Purchased' },
        });
        cy.wait(alias, { timeout: basic_timeouts.longTimeout }).then(response => {
          responseHits = response.response.body.data.getESSimpleSearch.hits;
        });
      },
      { wait: false }
    );

    cy.get('[aria-label="Toggle select all"]').eq(0).click();

    cy.get('[data-testid="bulk-update"]').click();

    cy.get('[data-testid="select-field-autocomplete"]', { timeout: 10000 })
      .clear()
      .type('Campaign Name');

    cy.get('.MuiAutocomplete-option').contains('Campaign Name').click({ force: true });

    cy.wait(5000);

    cy.get(
      '[aria-labelledby="alert-dialog-slide-title"] [data-testid="campaign-name-autocomplete"] input'
    ).clear();
    cy.get('.MuiAutocomplete-option').eq(0).click({ force: true });
    cy.get(
      '[aria-labelledby="alert-dialog-slide-title"] [data-testid="campaign-name-chip"]'
    )
      .eq(0)
      .invoke('text')
      .then(campaignName => {
        cy.interceptAndWait(['getESSimpleSearch'], () => {
          cy.get('[data-testid="action-button"]', { timeout: 5000 }).click();
        });
        cy.get('[data-testid="campaign-name-chip"]')
          .eq(0)
          .should('have.text', campaignName);
      });
  });
});
