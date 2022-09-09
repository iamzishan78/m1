/* eslint-disable no-undef */

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


describe('Document Grid Spec', () => {
    it('passes', () => {
        cy.viewport(1400, 900)
        cy.visit('http://localhost:3000/contacts')

        cy.checkAndLogin()

        cy.get('#addButton', { timeout: 50000 }).should('be.visible')
        cy.wait(3000)

        cy.interceptApi('getESSimpleSearch')

        cy.selectQuickAction('Leads 101', 'Lead', true)
        cy.selectQuickAction('Prospects 101', 'Prospect', true)
        cy.selectQuickAction('Contacts 101', 'Contact', true)
        cy.selectQuickAction('All Entities 101', 'All Entities')

        cy.gridSearch('jacob', 'getESSimpleSearch')

        cy.get('.MuiTableCell-root.MuiTableCell-body', { timeout: 10000 }).contains('SGF TRUST LEGAL').click();

        cy.interceptApi('getESSimpleSearch')
        cy.get('.MuiBreadcrumbs-li', { timeout: 10000 }).contains("Contacts").should('be.visible').click()

        cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: 30000 })

        cy.interceptApi('getESSimpleSearch')

        cy.selectQuickAction('Leads 101', 'Lead', true)

        cy.gridSearch('GoodwillDD', 'getESSimpleSearch')

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

        cy.interceptApi('getESSimpleSearch', {
            filter: {
                field: "contactOwners.name.keyword",
                value: "Jacob"
            }
        })

        cy.typeAndSelect('[id="filter-autocomplete-Contact Owner"]', 'jacob', 'filter-autocomplete-Contact Owner-option-0')
        cy.get('.MuiTypography-root').contains("FILTERS").click()
        cy.get('body').type('{esc}');
        cy.get('.MuiChip-label', { timeout: 10000 }).contains('Jacob')
        cy.verifyApiResponse('@getESSimpleSearchWithFilterApi', { responseTimeout: 30000 })

        cy.get('.MuiTableCell-root.MuiTableCell-body').contains('CHEVRON USA INC').click();

        cy.interceptApi('getESSimpleSearch')
        cy.get('.MuiBreadcrumbs-li', { timeout: 10000 }).contains("Contacts").should('be.visible').click()
        cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: 30000 })

        cy.removeFilter('Jacob')

        cy.wait(3000)

    })

})