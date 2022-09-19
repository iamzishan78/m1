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
Remove DD in "GoodwillDD" to "Goodwill"
Sort contact owner
Reverse sort
Click on GOODWILL IND REV TR.
Click contacts breadcrumb
Remove search
Click columns
Add Age
Sort Age Column
Open Filter
Click contact owner
Set as Jacob
Click CHEVRON USA INC
Click breadcrumb
Remove filter tag*/


describe('Contact Grid Spec', () => {
    it('passes', () => {
        // Constants 
        const { longTimeout, extraTimeout } = basic_timeouts

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

        cy.log('==== STEP: SEARCH jacob in CONTACT ====')
        cy.gridSearch('jacob', 'getESSimpleSearch')

        cy.get('.MuiTableCell-root.MuiTableCell-body', { timeout: longTimeout }).contains('SGF TRUST LEGAL').click();

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

        cy.sortColumn('Contact Owner', 'desc')
        cy.wait(1000)
        cy.sortColumn('Contact Owner', 'asc')

        cy.get('.MuiTableCell-root.MuiTableCell-body', { timeout: longTimeout }).contains('GOODWILL IND REVOC TR LEGAL').click();
        cy.get('.MuiBreadcrumbs-li', { timeout: longTimeout }).contains("Contacts").should('be.visible').click()

        cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: longTimeout })
        cy.wait(1000)

        cy.get("#viewColumnIcon").click()
        cy.get('#customViewColumns').parent().scrollTo('center')

        cy.wait(1000)

        cy.get("#age").check({ force: true })
        cy.get('body').type('{esc}');
        cy.sortColumn('Age', 'asc')

        cy.get("#filterIcon").click()

        cy.interceptApi('getESSimpleSearch', {
            filter: {
                field: "contactOwners.name.keyword",
                value: "Jacob"
            }
        })

        cy.typeAndSelect('[id="filter-autocomplete-Contact Owner"]', 'jacob', 'filter-autocomplete-Contact Owner-option-0')
        cy.get('.MuiTypography-root').contains("FILTERS").click()
        cy.get('body').type('{esc}');
        cy.get('.MuiChip-label', { timeout: longTimeout }).contains('Jacob')
        cy.verifyApiResponse('@getESSimpleSearchWithFilterApi', { responseTimeout: longTimeout })

        cy.reload()
        cy.get('#addButton', { timeout: longTimeout }).should('be.visible')

        cy.wait(4000)
        cy.get('.MuiTableCell-root.MuiTableCell-body').contains('CHEVRON USA INC').click();

        cy.interceptApi('getESSimpleSearch')
        cy.get('.MuiBreadcrumbs-li', { timeout: longTimeout }).contains("Contacts").should('be.visible').click()
        cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: longTimeout })

        cy.removeFilter('Jacob')

        cy.wait(3000)

    })

})