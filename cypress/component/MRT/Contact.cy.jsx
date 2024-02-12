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

describe('Contact Table', () => {
  beforeEach(() => {
    cy.interceptAndWait(['getESSimpleSearch'], (alias) => {
      cy.viewport(1600, 1200).mount(<MRTTable name="ContactTable" />);
      cy.wait(alias, { timeout: basic_timeouts.longTimeout }).then((response) => {
        responseHits = response.response.body.data.getESSimpleSearch.hits;
      });
    }, { wait: false });
  });

  it('sorts by Name & Last Updated', () => {
    cy.wait(100);

    cy.mrtSortColumn({ column: columns[0] });
    cy.mrtSortColumn({ column: columns[1] });
  });

  it(
    'Filters by Name & Last Updated Single Select',
    retries.fiveTries,
    () => {
      cy.get('.MuiButtonBase-root[aria-label="Show/Hide filters"]').click();

      cy.mrtSingleSelect({ column: columns[0] });
      cy.mrtSingleSelect({ column: columns[1] });
    }
  );

  it('Filters by Name Multi Select', retries.fiveTries, () => {
    cy.get('.MuiButtonBase-root[aria-label="Show/Hide filters"]').click();
    cy.mrtMultiSelect({ column: columns[1] });
  });

  it('Filters by last updated Comparison Check', retries.fiveTries, () => {
    console.log(responseHits)
    if (responseHits?.length) {
      const placeholder = "Filter by Last Updated Date";
      cy.get('.MuiButtonBase-root[aria-label="Show/Hide filters"]').click();

      const lastUpdateAt = responseHits[0].lastUpdateAt;
      const currentDateForPreviousDay = new Date(lastUpdateAt);
      currentDateForPreviousDay.setDate(currentDateForPreviousDay.getDate() - 1)
      const oneDayPriorDate = currentDateForPreviousDay.toISOString().split('T')[0];
      cy.get(`[data-testid="MoreVertIcon"]`).eq(19).click();
      cy.wait(500);
      cy.get('[data-testid="sentinelStart"] + div ul li:nth-child(5)').click();
      cy.wait(500);
      cy.get('[data-testid="sentinelStart"] + div ul li:nth-child(1):eq(1)').click();
      cy.mrtComparisonFilterCheck({ column: columns[0], type: "date", value: moment.parseZone(new Date(oneDayPriorDate)).format('MM/DD/YY'), filter: "greaterThanEqualTo", placeholder });

      const currentDateForNextDay = new Date(lastUpdateAt);
      currentDateForNextDay.setDate(currentDateForNextDay.getDate() + 1)
      const nextDayDate = currentDateForNextDay.toISOString().split('T')[0];
      cy.get('[data-testid="MoreVertIcon"]').eq(19).scrollIntoView().click({ force: true });
      cy.wait(500);
      cy.get('[data-testid="sentinelStart"] + div ul li:nth-child(5)').click();
      cy.wait(500);
      cy.get('[data-testid="sentinelStart"] + div ul li:nth-child(2):eq(1)').click();
      cy.mrtComparisonFilterCheck({ column: columns[0], type: "date", value: moment.parseZone(new Date(nextDayDate)).format('MM/DD/YY'), filter: "lessThanEqualTo", placeholder });
    }
  });

});
