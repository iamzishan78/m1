/* eslint-disable no-undef */

const { basic_timeouts } = require("../../cypressUtils/data")


describe('Agreement Existing Tracts Spec', () => {
    it('passes', () => {
        // Constants 
        const { shorTimeout, longTimeout, extraTimeout } = basic_timeouts

        cy.viewport(1536, 960)

        cy.interceptApi('getESSimpleSearch')
        cy.visit('http://localhost:3000/land/agreements')

        cy.checkAndLogin()

        cy.get('#addButton', { timeout: longTimeout }).should('be.visible')

        cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: longTimeout }).then(response => {
            const tractName = "FRASER, BURR & OLYPHANT A-1393"

            cy.getTableCell('Agreement', 3).then(($row) => {
                cy.log('==== STEP: OPEN Agreement ====')
                cy.wrap($row).scrollIntoView().children().eq(1).children().children().children().click()

                cy.get('.MuiTypography-root', { timeout: longTimeout }).contains('Summary').should('be.visible')


                cy.log('==== STEP: CLICK ON LEGAL DESCRIPTION TAB ====')
                cy.wait(10000)
                cy.get("#legalDescriptionTab").click()

                cy.interceptApiByIndex('getESSimpleSearch', 'shapeowners_flat')
                cy.addTract(tractName)
                cy.deleteTractAndVerify(tractName)

                cy.wait(5000)

            })
        })

    })
})