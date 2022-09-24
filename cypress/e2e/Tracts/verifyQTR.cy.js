/* eslint-disable no-undef */

import { basic_timeouts } from "../../cypressUtils/data"

describe('Verify QTR Calls Spec', () => {
    it('passes', () => {
        const { shorTimeout, longTimeout } = basic_timeouts
        const tractName = "FRASER, BURR & OLYPHANT A-1393"

        cy.viewport(1400, 900)

        cy.interceptApi('getESSimpleSearch')
        cy.visit('http://localhost:3000/land/agreements')

        cy.checkAndLogin()

        cy.get('#addButton', { timeout: longTimeout }).should('be.visible')

        cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: longTimeout })

        cy.interceptApi('getESSimpleSearch')
        cy.getTableCell('Agreement', 1).click()
        cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: longTimeout }).then(response => {
            const hits = response.response.body.data.getESSimpleSearch.hits
            const tractToTest = hits.find(hit => hit?.shapeLabel === tractName)

            cy.get('#documentIcon', { timeout: longTimeout }).should('be.visible')
            cy.get("#AgreementOwnersTractsTable").scrollIntoView().click()

            if (!tractToTest) {
                cy.get(".MuiButtonBase-root").contains('+ ADD Tract To AGREEMENT').click({ force: true })
                cy.get("#existingTractTab").click()
            }

            console.log("hits : ", hits)
        })





        cy.wait(1000)

    })

})