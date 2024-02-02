/* eslint-disable no-undef */
import Wells from 'components/Land/components/Wells';

describe('MyWellsNameUpdate.cy.jsx', () => {
  beforeEach(() => {

    cy.interceptAndWait(['getESSimpleSearch', 'mywells_flat'], () => {
      cy.viewport(1600, 1200).mount(<Wells />, { testCase: "MyWellsNameUpdate" });
    });

  });

  it('checks well name is updating correctly', () => {
    // Generate a random number between 1 and 1000 (adjust range as needed)
    const randomNumber = Math.floor(Math.random() * 1000) + 1;
    const wellName = `Testing well name ${randomNumber}`;

    cy.get('#MUIDataTableBodyRow-0 > td:nth-child(2) > div:nth-child(2) > div > div > a').click();
    cy.wait(15000);

    cy.get('[data-testid="Well Name"]').clear().type(wellName);
    cy.wait(15000);

    cy.get('[data-testid="close-dialog"]').click();

    cy.get('#MUIDataTableBodyRow-0 > td:nth-child(2) > div:nth-child(2) > div > div > a')
      .should('have.text', wellName);
  });
});
