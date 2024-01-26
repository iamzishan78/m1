/* eslint-disable no-undef */
import { basic_timeouts } from '../../cypressUtils/data';

Cypress.Commands.add(
  'mrtCompareSort',
  ({ selector, index = 0, type = 'string', sorting }) => {
    if (selector) {
      cy.get('tr.MuiTableRow-root[data-index="0"] > td.MuiTableCell-root')
        .eq(index)
        .find(selector)
        .invoke('text')
        .as('firstText');
      cy.get('tr.MuiTableRow-root[data-index="10"] > td.MuiTableCell-root')
        .eq(index)
        .find(selector)
        .invoke('text')
        .as('nthText');
    } else {
      cy.get('tr.MuiTableRow-root[data-index="0"] > td.MuiTableCell-root')
        .eq(index)
        .invoke('text')
        .as('firstText');
      cy.get('tr.MuiTableRow-root[data-index="10"] > td.MuiTableCell-root')
        .eq(index)
        .invoke('text')
        .as('nthText');
    }

    cy.get('@firstText').then(firstText => {
      cy.get('@nthText').then(secondText => {
        switch (type) {
          case 'string':
            expect(
              sorting === 'ascending' ? firstText <= secondText : secondText <= firstText
            ).to.be.equal(true);
            break;

          case 'date':
            if (sorting === 'ascending')
              expect(new Date(firstText)).to.be.at.most(new Date(secondText));
            else expect(new Date(firstText)).to.be.at.least(new Date(secondText));
            break;

          default:
            break;
        }
      });
    });
  }
);

Cypress.Commands.add(
  'mrtSort',
  ({ column, apiAlias = '@getESSimpleSearchApiByIndex', sorting = false }) => {
    cy.get('table > thead > tr > th.MuiTableCell-root.MuiTableCell-head')
      .contains(column.name)
      .click();

    cy.verifyApiResponse(apiAlias, {
      responseTimeout: basic_timeouts.midTimeout,
    });

    cy.wait(500);

    let ariaLabel = `Sort by ${column.name} ascending`;
    if (sorting === 'ascending') ariaLabel = `Sorted by ${column.name} ascending`;
    if (sorting === 'descending') ariaLabel = `Sorted by ${column.name} descending`;

    cy.get('table > thead > tr > th.MuiTableCell-root.MuiTableCell-head')
      .contains(column.name)
      .get(`[aria-label="${ariaLabel}"]`);

    if (!!sorting)
      cy.mrtCompareSort({
        sorting,
        ...column,
      });
  }
);

Cypress.Commands.add('mrtSortColumns', ({ columns }) => {
  columns.forEach(column => {
    cy.mrtSort({ column, sorting: 'ascending' });
    cy.mrtSort({ column, sorting: 'descending' });
    cy.mrtSort({ column });
  });
});
