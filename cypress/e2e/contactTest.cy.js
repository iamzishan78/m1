/* eslint-disable no-undef */

describe('empty spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000')

    cy.get('input').type('localhost')
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

    cy.wait(4000)

    cy.get('ul.MuiAutocomplete-listbox').children().eq(1).children().eq(1).children().eq(1).click({ force: true })
    // cy.visit('http://localhost:3000/map/units/6297e022992e6a5c9b92e6d4')
    cy.wait(4000)
    cy.get('#expandIcon').click()

    cy.intercept({
      method: 'POST',
      url: 'http://localhost:7071/api/m1graph',
    }).as('updateCustomLayerApiCheck')

    cy.wait(2000)
    cy.contains('Unit Name').siblings('.MuiTableCell-root').children().children().children().eq(1).trigger('mouseover', { force: true }).children().click({ force: true })


    cy.contains('Unit Name').siblings().eq(0).children().children().children().eq(0).type('{backspace}{backspace}{backspace}PR{enter}')

    cy.wait('@updateCustomLayerApiCheck').then((interception) => {
      assert.isNotNull(interception.response.body, 'Update Custom Layer api call has data')
    })
    // cy.get('.MuiList-root', { timeout: 10000 }).should('be.visible').contains('Units').click()

  })

})