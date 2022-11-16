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

                cy.get("[id='Pugh - Vertical']", { timeout: longTimeout }).scrollIntoView().check({force:true})

                cy.get("[id='provision-value-0']", { timeout: longTimeout }).clear().type("$1,000/acre per year")

                cy.get("[id='start-date-picker-0']", { timeout: longTimeout }).clear().wait(3000).type("06/ 12/2022")
                cy.get("[id='last-date-picker-0']", { timeout: longTimeout }).clear().wait(3000).type("07/29/2022")

                cy.get("[id='frequency-0']").click().type("{downArrow}{downArrow}{enter}")
                cy.wait(5000)
                cy.get("[id='partyName-0']").click().type("{downArrow}{enter}")
                cy.get("[id='provisionDescription-0']").clear().type("A cypress description")

                cy.get("#commentIcon").click()
                cy.get("#commentInput").type("A cypress comment {enter}")
                cy.get('body').type('{esc}')

                cy.get("#addProvisionButton", { timeout: longTimeout }).click()

                cy.get("#provisionType").type("rental{downArrow}{downArrow}{enter}")

                cy.get("#applicable-1").click()
                cy.get('body').type('{upArrow}{enter}')

                cy.get("[id='provision-value-1']", { timeout: longTimeout }).clear().type("$1,000/acre per year")

                cy.get("[id='start-date-picker-1']", { timeout: longTimeout }).clear().wait(3000).type("06/ 12/2022")
                cy.get("[id='last-date-picker-1']", { timeout: longTimeout }).clear().wait(3000).type("07/29/2022")

                cy.get("[id='frequency-1']").click().type("{downArrow}{downArrow}{enter}")

                cy.get("[id='partyName-1']").click().type("{downArrow}{enter}")

                cy.get("[id='provisionDescription-1']").clear().type("A cypress description 2")

                cy.get("#applicable-1").scrollIntoView().click()

                cy.interceptApi('upsertAgreementProvision')
                cy.get("[id='frequency-1']").scrollIntoView().trigger('mouseover')
                cy.get("#moreVertIconProvision").scrollIntoView().click()
                cy.get("#deleteProvision", {timeout:longTimeout}).click()
                cy.verifyApiResponse('@upsertAgreementProvisionApi', { responseTimeout: longTimeout })

                cy.interceptApi('upsertAgreementProvision')
                cy.get("[id='frequency-0']").scrollIntoView().trigger('mouseover')
                cy.get("#moreVertIconProvision").scrollIntoView().click()
                cy.get("#deleteProvision", {timeout:longTimeout}).click()
                cy.verifyApiResponse('@upsertAgreementProvisionApi', { responseTimeout: longTimeout })
            })
        })

    })
})