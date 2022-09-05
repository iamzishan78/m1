/* eslint-disable no-undef */

describe('Document Grid Spec', () => {
    it('passes', () => {
        cy.viewport(1400, 900)
        cy.visit('http://localhost:3000/contacts')

        cy.checkAndLogin('#workSpaceSignin')

        cy.get('#addButton', { timeout: 50000 }).should('be.visible')
        cy.wait(3000)

        cy.interceptApi('getESSimpleSearch')

        cy.selectQuickAction('Leads 101', 'Lead', true)
        // cy.selectQuickAction('Prospects 101', 'Prospect', true)
        cy.selectQuickAction('Contacts 101', 'Contact', true)
        cy.selectQuickAction('All Entities 101', 'All Entities')

        cy.gridSearch('jacob')

        cy.get('.MuiTableCell-root.MuiTableCell-body', { timeout: 10000 }).contains('SGF TRUST LEGAL').click();

        cy.interceptApi('getESSimpleSearch')
        cy.get('.MuiBreadcrumbs-li', { timeout: 10000 }).contains("Contacts").should('be.visible').click()

        cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: 30000 })

        cy.interceptApi('getESSimpleSearch')

        cy.selectQuickAction('Leads 101', 'Lead', true)

        cy.gridSearch('GoodwillDD')

        cy.wait(1000)

        cy.interceptApi('getESSimpleSearch', { searchString: 'Goodwill' })
        cy.get('.MuiInputBase-input.MuiOutlinedInput-input.MuiInputBase-inputAdornedStart').type('{backspace}{backspace}')
        cy.verifyApiResponse('@getESSimpleSearchWithSearchStringApi', { responseTimeout: 30000 })

        cy.sortColumn('Contact Owner', 'desc')
        cy.wait(1000)
        cy.sortColumn('Contact Owner', 'asc')

        cy.get('.MuiTableCell-root.MuiTableCell-body', { timeout: 10000 }).contains('GOODWILL IND REVOC TR LEGAL').click();
        cy.get('.MuiBreadcrumbs-li', { timeout: 10000 }).contains("Contacts").should('be.visible').click()

        cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: 30000 })
        cy.wait(1000)

        cy.get("#viewColumnIcon").click()
        cy.get('#customViewColumns').parent().scrollTo('center')

        cy.wait(1000)

        cy.get("#age").check({ force: true })
        cy.get('body').type('{esc}');
        cy.sortColumn('Age', 'asc')

        cy.get("#filterIcon").click()
        cy.typeAndSelect('[id="filter-autocomplete-Contact Owner"]', 'jacob', 'filter-autocomplete-Contact Owner-option-0')
        cy.get('.MuiTypography-root').contains("FILTERS").click()
        cy.get('body').type('{esc}');
        cy.get('.MuiChip-label', { timeout: 10000 }).contains('Jacob')

        cy.get('.MuiTableCell-root.MuiTableCell-body').contains('CHEVRON USA INC').click();

        cy.interceptApi('getESSimpleSearch')
        cy.get('.MuiBreadcrumbs-li', { timeout: 10000 }).contains("Contacts").should('be.visible').click()

        cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: 30000 })

        cy.get('.MuiChip-label', { timeout: 10000 }).contains('Jacob').siblings().click()

        cy.wait(1000)

    })

})