import { basic_timeouts } from '../../cypressUtils/data';

Cypress.Commands.add('mrtInvokeText', ({ selector, as, index = 0, rowIndex = 0 }) => {
  if (selector) {
    cy.get(`tr.MuiTableRow-root[data-index="${rowIndex}"] > td.MuiTableCell-root`)
      .eq(index)
      .find(selector)
      .invoke('text')
      .as(as);
  } else {
    cy.get(`tr.MuiTableRow-root[data-index="${rowIndex}"] > td.MuiTableCell-root`)
      .eq(index)
      .invoke('text')
      .as(as);
  }
});

Cypress.Commands.add(
  'mrtCompareSort',
  ({ selector, index = 0, type = 'string', sorting }) => {
    cy.mrtInvokeText({ selector, as: 'firstText', index });
    cy.mrtInvokeText({ selector, as: 'nthText', index, rowIndex: 10 });

    cy.get('@firstText').then(firstText => {
      cy.get('@nthText').then(secondText => {
        switch (type) {
          case 'string':
            expect(
              sorting === 'ascending' ? firstText <= secondText : secondText <= firstText
            ).to.be.equal(true);
            break;

          case 'date':
          case 'number':
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

    cy.wait(100);

    let ariaLabel = `Sort by ${column.name} ascending`;
    if (sorting === 'ascending') ariaLabel = `Sorted by ${column.name} ascending`;
    if (sorting === 'descending') ariaLabel = `Sorted by ${column.name} descending`;

    cy.get('table > thead > tr > th.MuiTableCell-root.MuiTableCell-head')
      .contains(column.name)
      .get(`[aria-label="${ariaLabel}"]`);

    if (!!sorting)
      cy.get('table > thead > tr > th.MuiTableCell-root.MuiTableCell-head')
        .filter((index, element) => {
          // Use a filter function to find the correct column header by text content
          return Cypress.$(element).text().includes(column.name);
        })
        .invoke('index') // Get the index of the matching column header
        .then(index => {
          cy.mrtCompareSort({
            sorting,
            index,
            ...column,
          });
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

Cypress.Commands.add('mrtSingleSelect', ({ column }) => {
  cy.get(`[data-testid="single-filter-${column.name}"]`)
    .as(`single-filter-${column.name}`)
    .click();

  cy.get('.MuiAutocomplete-popper').should('exist');

  cy.get('.MuiAutocomplete-option', {
    timeout: basic_timeouts.midTimeout,
  })
    .first()
    .as(`${column.name}-option`)
    .invoke('text')
    .then(columOpton => {
      cy.get(`@${column.name}-option`).click();

      cy.verifyApiResponse('@getESSimpleSearchApiByIndex', {
        responseTimeout: basic_timeouts.midTimeout,
      });

      cy.get('table > thead > tr > th.MuiTableCell-root.MuiTableCell-head')
        .filter((index, element) => {
          // Use a filter function to find the correct column header by text content
          return Cypress.$(element).text().includes(column.name);
        })
        .invoke('index') // Get the index of the matching column header
        .then(index => {
          cy.mrtInvokeText({
            selector: column.selector,
            as: `${column.name}-value`,
            index,
          });

          cy.get(`@${column.name}-value`).then(columValue => {
            expect(columValue).to.be.equal(columOpton);
          });

          // cy.get(`@single-filter-${column.name}`).next().find('.MuiButtonBase-root[aria-label="Clear"]').click();

          // cy.verifyApiResponse('@getESSimpleSearchApiByIndex', {
          //   responseTimeout: basic_timeouts.midTimeout,
          // });
        });
    });
});

Cypress.Commands.add('mrtMultiSelect', ({ column }) => {
  function selectAndVerifyOption(index) {
    cy.get(`[data-testid="multi-filter-${column.name}"]`)
      .as(`multi-filter-${column.name}`)
      .click();

    cy.get('.MuiAutocomplete-popper').should('exist');

    cy.get('.MuiAutocomplete-option', { timeout: basic_timeouts.midTimeout })
      .eq(index)
      .as(`${column.name}-option`)
      .invoke('text')
      .then(columnOption => {
        cy.get(`@${column.name}-option`).click();
        cy.verifyApiResponse('@getESSimpleSearchApiByIndex', { responseTimeout: basic_timeouts.midTimeout });
        cy.wait(5000);

        let optionFound = false;

        cy.get('table > thead > tr > th.MuiTableCell-root.MuiTableCell-head')
          .filter((index, element) => {
            return Cypress.$(element).text().includes(column.name);
          })
          .invoke('index')
          .then(index => {
            cy.get('table > tbody > tr').each(($row) => {
              cy.wrap($row)
                .find(`td.MuiTableCell-root.MuiTableCell-body:eq(${index})`)
                .invoke('text')
                .then((columnValue) => {
                  if (columnValue.includes(columnOption)) {
                    optionFound = true;
                  }
                });
            }).then(() => {
              expect(optionFound).to.be.true;
            });
          });
      });
  }

  cy.get(`[data-testid="MoreVertIcon"]`).first().click();
  cy.wait(5000);
  cy.get('[data-testid="sentinelStart"] + div ul li:nth-child(5)').click();
  cy.wait(5000);
  cy.get('[data-testid="sentinelStart"] + div ul li:nth-child(10):eq(1)').click();

  // Select and verify the first option
  selectAndVerifyOption(0);

  // Select and verify the second option
  selectAndVerifyOption(1);
});

