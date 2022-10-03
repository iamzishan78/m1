/* eslint-disable no-undef */

import { basic_timeouts } from "../../cypressUtils/data"

/*CONTACTS GRID TEST CASE
Sort contact owner
Reverse sort
Click on SUSAN CHERYL BLALOCK
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

describe('Sort Filter ViewColumn Grid Spec', () => {
    it('passes', () => {
        // Constants 
        const { longTimeout } = basic_timeouts

        cy.viewport(1400, 900)
        cy.visit('http://localhost:3000/contacts')

        cy.checkAndLogin()

        cy.get('#addButton', { timeout: longTimeout }).should('be.visible')
        cy.wait(3000)
        cy.log('==== STEP: APPLY SORTING ON CONTACT OWNER DESCENDING ====')
        cy.sortColumn('Contact Owner', 'asc')

        cy.wait(1000)

        cy.log('==== STEP: APPLY SORTING ON CONTACT OWNER DESCENDING ====')
        cy.sortColumn('Contact Owner', 'desc').then(response => {
            cy.log('==== STEP: CLICK ON CONTACT====')
            cy.getTableCell("Name", 3).click()

            cy.interceptApi('getESSimpleSearch')
            cy.log('==== STEP: CLICK CONTACT BREADCRUMB 1 ====')
            cy.get('.MuiBreadcrumbs-li', { timeout: longTimeout }).contains("Contacts").should('be.visible').click()

            cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: longTimeout })
            cy.wait(1000)

            cy.log('==== STEP: CLICK ON VIEW COLUMN ICON ====')
            cy.get("#viewColumnIcon").click()
            cy.get('#customViewColumns').parent().wait(3000).scrollTo('center')

            cy.wait(1000)

            cy.log('==== STEP: CLICK ON AGE VIEW COLUMN CHECKBOX ====')
            cy.get("#age").check({ force: true })
            cy.get('body').type('{esc}');
            cy.sortColumn('Age', 'asc')

            cy.log('==== STEP: CLICK ON FILTER ICON ====')
            cy.get("#filterIcon").click()

            cy.interceptApi('getESSimpleSearch', {
                filter: {
                    field: "contactOwners.name.keyword",
                    value: "Jacob"
                }
            })

            cy.log('==== STEP: APPLLY CONTACT OWNER FILTER ====')
            cy.typeAndSelect('[id="filter-autocomplete-Contact Owner"]', 'jacob', 'filter-autocomplete-Contact Owner-option-0')
            cy.get('.MuiTypography-root').contains("FILTERS").click()
            cy.get('body').type('{esc}');
            cy.get('.MuiChip-label', { timeout: longTimeout }).contains('Jacob')
            cy.verifyApiResponse('@getESSimpleSearchWithFilterApi', { responseTimeout: longTimeout })

            cy.log('==== STEP: RELOAD PAGE ====')
            cy.reload()
            cy.get('#addButton', { timeout: longTimeout }).should('be.visible')

            cy.wait(4000)

            cy.log('==== STEP: CLICK ON CONTACT AGAIN ====')
            cy.getTableCell("Name", 5).click()

            cy.interceptApi('getESSimpleSearch')
            cy.log('==== STEP: CLICK CONTACT BREADCRUMB 2====')
            cy.get('.MuiBreadcrumbs-li', { timeout: longTimeout }).contains("Contacts").should('be.visible').click()
            cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: longTimeout })

            cy.log('==== STEP: REMOVE FILTER JACOB ====')
            cy.get('.MuiChip-label', { timeout: longTimeout }).contains('Jacob')
            cy.removeFilter('Jacob')

            cy.wait(3000)

        })



    })

})