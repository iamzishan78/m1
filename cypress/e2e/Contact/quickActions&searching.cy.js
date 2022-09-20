/* eslint-disable no-undef */

import { basic_timeouts } from "../../cypressUtils/data"

/*CONTACTS GRID TEST CASE
Launch contacts
Click leads
Click prospects
Click Contacts
Click All Entities
Search jacob
Click SGF TRUST LEGAL
Click breadcrumb back
Delete search
Click leads
Search GoodwillDD
Remove DD in "GoodwillDD" to "Goodwill"*/


describe('Quick Actions And Searching Spec', () => {
    it('passes', () => {
        // Constants 
        const { longTimeout } = basic_timeouts

        cy.viewport(1400, 900)
        cy.visit('http://localhost:3000/contacts')

        cy.checkAndLogin()

        cy.get('#addButton', { timeout: longTimeout }).should('be.visible')
        cy.wait(3000)


        cy.log('==== STEP: Remove IF PREVIOUSLY FILTERS ARE APPLIED ====')
        cy.removeFilter('Jacob')
        cy.removeFilter('Lead')
        cy.removeFilter('Prospect')

        cy.interceptApi('getESSimpleSearch')

        cy.selectQuickAction('Leads 101', 'Lead', true)
        cy.selectQuickAction('Prospects 101', 'Prospect', true)
        cy.selectQuickAction('Contacts 101', 'Contact', true)
        cy.selectQuickAction('All Entities 101', 'All Entities')

        const contactName = 'SGF TRUST LEGAL'
        cy.log('==== STEP: SEARCH jacob in CONTACT ====')

        cy.gridSearch('jacob', 'getESSimpleSearch').then(response => {
            // const hits = response.response.body.data.getESSimpleSearch.hits

            // const indexofContact = hits.findIndex(hit => hit.name === contactName)

            // if (indexofContact < 0)
            //     throw new Error(`Could not find ${contactName} in api response`)

            // cy.getTableCell("Name", indexofContact).scrollIntoView().wait(500).click({ force: true })

            // cy.get('.MuiTableCell-root.MuiTableCell-body', { timeout: longTimeout }).contains(contactName).should('be.visible').click();

            cy.wait(2000)
            cy.getTableCell("Name", 3).click()

            cy.wait(5000)
            cy.interceptApi('getESSimpleSearch')
            cy.get('.MuiBreadcrumbs-li', { timeout: longTimeout }).contains("Contacts").should('be.visible').click()

            cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: longTimeout })

            cy.interceptApi('getESSimpleSearch')

            cy.selectQuickAction('Leads 101', 'Lead', true)

            cy.log('==== STEP: SEARCH GoodwillDD in CONTACT ====')
            cy.gridSearch('GoodwillDD', 'getESSimpleSearch')

            cy.wait(1000)

            cy.interceptApi('getESSimpleSearch', { searchString: 'Goodwill' })
            cy.get('.MuiInputBase-input.MuiOutlinedInput-input.MuiInputBase-inputAdornedStart').type('{backspace}{backspace}')
            cy.verifyApiResponse('@getESSimpleSearchWithSearchStringApi', { responseTimeout: longTimeout })

            cy.get("#crossButton").click()
        })

    })

})