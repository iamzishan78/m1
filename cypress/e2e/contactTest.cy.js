/* eslint-disable no-undef */

describe('empty spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000')
    cy.get('input').type('enerx')
    cy.get('.MuiButtonBase-root').click()

    cy.wait(4000)

    cy.get('#signInName', { timeout: 10000 }).should('be.visible').type('support@m1neral.com')
    cy.get('#password').type('M1neral2022')
    cy.wait(4000)
    cy.get('#next').click()

    cy.wait(16000)

    cy.get('#data-name-select', { timeout: 10000 }).should('be.visible').click()
    cy.wait(1000)
    cy.get('.MuiList-root', { timeout: 10000 }).should('be.visible').contains('Units').click()

    cy.wait(2000)

    cy.get('#cognitive-search-autocomplete', { timeout: 10000 }).should('be.visible').type('p-t').then((option) => {
      option[0].click();
    })

    cy.wait(2000)

    cy.visit('http://localhost:3000/map/units/6297e022992e6a5c9b92e6d4')
    cy.wait(4000)
    cy.get('#expandIcon').click()
    cy.wait(2000)
    cy.contains('Unit Name').siblings('.MuiTableCell-root').children().children().children().click({ multiple: true })

    // cy.get('.MuiList-root', { timeout: 10000 }).should('be.visible').contains('Units').click()

  })

})