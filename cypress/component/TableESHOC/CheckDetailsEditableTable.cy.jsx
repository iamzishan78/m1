/* eslint-disable no-undef */
import CheckDetailsEditableTable from 'components/Revenue/components/Statements/DetailComponents/LineItem/index.js';

describe('CheckDetailsEditableTable  ESHOC Table', () => {
  beforeEach(() => {
    cy.viewport(1600, 1200).mount(
      <CheckDetailsEditableTable parent="CheckDetailsTable" header="Check Details" showPdfSection={false} checkId={"65cdeea0cb417fd5f2285c7e"} />
    );
    cy.wait(5000);
  });

  it('checks state and county are populating on selecting property', () => {
    cy.get('#0-0').click().type('random property{enter}');
    cy.wait(5000);
    cy.get('#0-0').click().type('test purchaser minerals{enter}');
    cy.wait(5000);
    cy.get('#0-0').click();
    // now it will check whether the fields are populated or not
    cy.get('#0-1 input').should('not.have.value', '');
    cy.get('#0-2 input').should('not.have.value', '');
    cy.get('#0-3 input').should('not.have.value', '');
  });
});
