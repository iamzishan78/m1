/* eslint-disable no-undef */

import { basic_timeouts } from "../../cypressUtils/data"

describe('Agreement Provisions Spec', () => {
    it('passes', () => {
        // Constants 
        const { shorTimeout, longTimeout, extraTimeout } = basic_timeouts

        cy.viewport(1536, 960)

        cy.interceptApi('getESSimpleSearch')
        cy.visit('http://localhost:3000/land/agreements')

        cy.checkAndLogin()

        cy.get('#addButton', { timeout: longTimeout }).should('be.visible')

        cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: longTimeout }).then(response => {

            cy.getTableCell('Agreement', 3).then(($row) => {
                cy.log('==== STEP: OPEN Agreement ====')
                cy.wrap($row).scrollIntoView().children().eq(1).children().children().children().click()

                cy.get('.MuiTypography-root', { timeout: longTimeout }).contains('Summary').should('be.visible')

                cy.get("#provisionsTab").click()

                cy.get("[id='Pugh - Vertical']", { timeout: longTimeout }).click()

                cy.get("[id='provision-value-0']", { timeout: longTimeout }).clear().type("$1,000/acre per year")

                cy.get("[id='start-date-picker-0']", { timeout: longTimeout }).type("07/22/2022", { force: true })
                cy.get("[id='last-date-picker-0']", { timeout: longTimeout }).type("07/31/2022", { force: true })

                cy.get("[id='autocompleteWithNewOptions']").click().type("{downArrow}{enter}")
                cy.wait(5000)
                cy.get("[id='partyName']").click().type("{downArrow}{enter}")
                cy.get("[id='provisionDescription']").clear().type("A cypress description")

                cy.get("#commentIcon").click()
                cy.get("#commentInput").type("A cypress comment {enter}")
                cy.get('body').type('{esc}')

                cy.get("#addProvisionButton", { timeout: longTimeout }).click()

                cy.get("#provisionType").type("rental{downArrow}{downArrow}{enter}")

                cy.get("#applicable").click()
                cy.get('body').type('{upArrow}{enter}')
            })
        })

    })
})