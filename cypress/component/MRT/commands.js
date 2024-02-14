/* eslint-disable no-undef */
import { basic_timeouts } from '../../cypressUtils/data';

Cypress.Commands.add('mrtInvokeText', ({ selector, as, index = 0, rowIndex = 0 }) => {
  if (selector) {
    cy.get(`tr.MuiTableRow-root[data-index="${rowIndex}"] > td.MuiTableCell-root`)
      .eq(index)
      .find(selector)
      .invoke('text')
      .as(as);
  } else {
    cy.log(index)
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

    cy.interceptAndWait(['getESSimpleSearch'], () => {

      cy.get('table > thead > tr > th.MuiTableCell-root.MuiTableCell-head')
        .contains(column.name)
        .click();

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

Cypress.Commands.add('mrtSortColumn', ({ column }) => {
  cy.mrtSort({ column, sorting: 'ascending' });
  cy.mrtSort({ column, sorting: 'descending' });
  cy.mrtSort({ column });
});

Cypress.Commands.add('mrtApplyFilter', ({ column, callback }) => {
  cy.interceptAndWait(['getESSimpleFilter'], () => {
    cy.get(`[data-testid="single-filter-${column.name}"]`).as(`single-filter-${column.name}`).click();
  });

  cy.wait(100);

  cy.get('.MuiAutocomplete-popper').should('exist');

  cy.get('.MuiAutocomplete-option', {
    timeout: basic_timeouts.midTimeout,
  })
    .first()
    .as(`${column.name}-option`)
    .invoke('text')
    .then(columOpton => {
      cy.interceptAndWait(['getESSimpleSearch'], (alias) => {
        cy.get(`@${column.name}-option`).click();

        cy.wait(alias, { timeout: basic_timeouts.longTimeout }).then(
          (selectedRows) => {
            const responseData = selectedRows?.response?.body?.data?.getESSimpleSearch.hits;
            callback(responseData);

          }
        );

      }, { wait: false });
    });
});


Cypress.Commands.add('mrtApplySpecificFilter', ({ column, optioText, callback }) => {

  cy.interceptAndWait(['getESSimpleFilter'], () => {
    cy.get(`[data-testid="single-filter-${column.name}"]`).as(`single-filter-${column.name}`).click();
  });

  cy.wait(100);

  cy.get('.MuiAutocomplete-popper').should('exist');

  cy.get(
    `.MuiFormControl-root[data-testid="mrt-grid-filter-text-field-${column.name}"]`
  )
    .click()
    .clear()
    .type(`${optioText}`);

  cy.get('.MuiAutocomplete-option', {
    timeout: basic_timeouts.midTimeout,
  })
    .first()
    .as(`${column.name}-option`)
    .invoke('text')
    .then(columOpton => {
      cy.interceptAndWait(['getESSimpleSearch'], (alias) => {
        cy.get(`@${column.name}-option`).click();

        cy.wait(alias, { timeout: basic_timeouts.longTimeout }).then(
          (selectedRows) => {
            const responseData = selectedRows?.response?.body?.data?.getESSimpleSearch.hits;
            callback(responseData);

          }
        );

      }, { wait: false });
    });
});


Cypress.Commands.add('mrtSingleSelect', ({ column }) => {
  cy.interceptAndWait(['getESSimpleFilter'], () => {
    cy.get(`[data-testid="single-filter-${column.name}"]`).as(`single-filter-${column.name}`).click();
  });

  cy.wait(100);

  cy.get('.MuiAutocomplete-popper').should('exist');

  cy.get('.MuiAutocomplete-option', {
    timeout: basic_timeouts.midTimeout,
  })
    .first()
    .as(`${column.name}-option`)
    .invoke('text')
    .then(columOpton => {

      cy.interceptAndWait(['getESSimpleSearch'], () => {
        cy.get(`@${column.name}-option`).click();
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
        });
    });
});

Cypress.Commands.add('mrtExport', ({ columns }) => {

  if (columns[0].name === 'M1neral System ID') {
    cy.get('.MuiButtonBase-root[aria-label="Show/Hide columns"]').click();

    cy.get('ul.MuiList-root > li.MuiButtonBase-root').contains(columns[0].name).click();
    cy.get('body').click();
  }

  cy.get('input.PrivateSwitchBase-input[aria-label="Toggle select row"]').first().click();
  cy.get('input.PrivateSwitchBase-input[aria-label="Toggle select row"]').eq(1).click();

  cy.get('.MuiButtonBase-root[data-testid="download-csv"]').click();

  cy.interceptAndWait(['initializeExportJob'], (alias) => {

    cy.get('.MuiButtonBase-root[data-testid="export-confirm"]').click();


    cy.wait(alias, { timeout: basic_timeouts.longTimeout }).then((response) => {
      const responseColumns =
        response.response.body.data.initializeExportJob.job.requestPayload.columns;

      cy.expect(
        columns.every(column =>
          responseColumns.some(responseColumn => responseColumn.label === column.name)
        )
      ).to.be.equal(true);
    });

  }, { wait: false });
});

Cypress.Commands.add('mrtMultiSelect', ({ column }) => {
  function selectAndVerifyOption(index, wait) {

    cy.interceptAndWait(['getESSimpleFilter'], () => {
      cy.get(`[data-testid="multi-filter-${column.name}"]`).as(`multi-filter-${column.name}`).click();
    }, { wait });

    cy.get('.MuiAutocomplete-popper').should('exist');

    cy.get('.MuiAutocomplete-option', { timeout: basic_timeouts.midTimeout })
      .eq(index)
      .as(`${column.name}-option`)
      .invoke('text')
      .then(columnOption => {
        cy.interceptAndWait(['getESSimpleSearch'], () => {
          cy.get(`@${column.name}-option`).click();
        });

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
              // eslint-disable-next-line no-unused-expressions
              expect(optionFound).to.be.true;
            });
          });
      });
  }

  cy.get(`[data-testid="MoreVertIcon"]`).first().click();
  cy.wait(basic_timeouts.shorTimeout);
  cy.get('[data-testid="sentinelStart"] + div ul li:nth-child(5)').click();
  cy.wait(basic_timeouts.shorTimeout);
  cy.get('[data-testid="sentinelStart"] + div ul li:nth-child(10):eq(1)').click();

  // Select and verify the first option
  selectAndVerifyOption(0, true);

  // Select and verify the second option
  selectAndVerifyOption(1, false);
});


Cypress.Commands.add('mrtComparisonFilterCheck', ({ column, type, value, filter, placeholder }) => {
  cy.get(`input[placeholder="${placeholder}"]`).clear().type(value);
  cy.wait(10000)

  cy.get('table > thead > tr > th.MuiTableCell-root.MuiTableCell-head')
    .filter((index, element) => {
      return Cypress.$(element).text().includes(column.name);
    })
    .invoke('index')
    .then(index => {
      cy.mrtInvokeText({
        selector: column.selector,
        as: `${column.name}-value`,
        index,
      });
      cy.get(`@${column.name}-value`).then(columValue => {
        switch (filter) {
          case "greaterThanEqualTo":
            if (type === "date") {
              expect(new Date(columValue)).to.be.at.least(new Date(value));
            } else {
              expect(parseFloat(columValue)).to.be.at.least(parseFloat(value));
            }
            break;

          case "lessThanEqualTo":
            if (type === "date") {
              expect(new Date(columValue)).to.be.at.most(new Date(value));
            } else {
              expect(parseFloat(columValue)).to.be.at.most(parseFloat(value));
            }
            break;

          default:
            break;
        }
      });
    });
});


Cypress.Commands.add('VerifyAuthInfoMRT', () => {
  cy.get('table thead th div.Mui-TableHeadCell-Content-Wrapper')
    .contains('Created By')
    .should('exist');

  cy.get('table thead th div.Mui-TableHeadCell-Content-Wrapper')
    .contains('Created By')
    .should('exist');
  cy.get('table thead th div.Mui-TableHeadCell-Content-Wrapper')
    .contains('Created Date')
    .should('exist');
  cy.get('table thead th div.Mui-TableHeadCell-Content-Wrapper')
    .contains('Last Updated By')
    .should('exist');
  cy.get('table thead th div.Mui-TableHeadCell-Content-Wrapper')
    .contains('Last Updated Date')
    .should('exist');
});



