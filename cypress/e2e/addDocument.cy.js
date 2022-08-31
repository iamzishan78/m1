/* eslint-disable no-undef */

describe('Add Document Spec', () => {
    it('passes', () => {
        cy.viewport(1400, 900)
        cy.visit('http://localhost:3000/documents')

        cy.checkAndLogin('#workSpaceSignin')

        cy.get('#addDocument', { timeout: 30000 }).should('be.visible').click()

        cy.get('#filenumber', { timeout: 10000 }).type('99934033')

        cy.get('#filename').type('Cydoc et el')

        cy.get('#filetype', { timeout: 10000 }).type('L')

        cy.get("#filetype-popup").children('#filetype-option-1').click()

        cy.get('#filedate').type('2022-01-01')

        cy.get('#documentdetails').scrollTo('bottom')

        cy.wait(2000)
        cy.get('#listitem-3').children(1).click()

        cy.wait(2000)

        // cy.get('#cognitive-search-autocomplete', { timeout: 10000 }).should('be.visible').type('T&P').then((option) => {
        //     option[0].click();
        // })

        // cy.wait(4000)

        // cy.get('ul.MuiAutocomplete-listbox').children({ timeout: 8000 }).eq(1).children().eq(1).children().eq(1).click({ force: true })
        // // cy.visit('http://localhost:3000/map/units/6297e022992e6a5c9b92e6d4')
        // cy.wait(4000)
        // cy.get('#expandIcon').click()

        // cy.intercept('POST', 'http://localhost:7071/api/m1graph', req => {
        //     if (req.body.operationName === 'updateCustomLayer') {
        //         req.alias = 'updateCustomLayerApiCheck';
        //     }
        // });

        // cy.wait(2000)
        // cy.contains('Tract Name').siblings('.MuiTableCell-root').children().children().children().eq(1).trigger('mouseover', { force: true }).children().click({ force: true })


        // cy.contains('Tract Name').siblings().eq(0).children().children().children().eq(0).type('{backspace}{backspace}{backspace}PR{enter}')

        // cy.wait('@updateCustomLayerApiCheck', { timeout: 10000 }).then((interception) => {
        //     assert.isNotNull(interception.response.body, 'Update Custom Layer api call has data')
        // })
        // cy.get('.MuiList-root', { timeout: 10000 }).should('be.visible').contains('Units').click()

    })

})