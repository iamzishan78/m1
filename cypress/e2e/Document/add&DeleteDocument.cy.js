/* eslint-disable no-undef */

describe('Add & Delete Document Spec', () => {
    it('passes', () => {
        cy.viewport(1400, 900)
        cy.visit('http://localhost:3000/documents')

        cy.checkAndLogin()

        cy.log('==== STEP: ADD DOCUMENT ====')
        cy.get('#addDocument', { timeout: 50000 }).should('be.visible').click()

        cy.log('==== STEP: ADD FILE NUMBER ====')
        cy.get('#filenumber', { timeout: 50000 }).type('99934034').should('be.visible')

        cy.log('==== STEP: ADD FILE NAME ====')
        cy.get('#filename').type('Cydoc et el')

        cy.log('==== STEP: ADD FILE TYPE ====')
        cy.get('#filetype', { timeout: 50000 }).type('L')
        cy.get("#filetype-popup").children('#filetype-option-1').click()

        cy.log('==== STEP: ADD FILE DATE  ====')
        cy.get('#filedate').type('2022-01-01')
        cy.get('#documentdetails').scrollTo('bottom')

        cy.log('==== STEP: ADD COMPANY ID ====')
        cy.get('#dropdown-3').children(1).children(0).type('924{enter}')

        cy.get('#multiselect-4').children(1).children(0).click()
        cy.get('.react-select__menu-list').children().eq(1).click()
        cy.get('.react-select__menu-list').children().eq(2).click()

        cy.contains('State').click({ force: true })

        cy.log('==== STEP: ADD DOCUMENT ====')
        cy.interceptApi('AddDescriptorFile')
        cy.get('input[type=file]', { force: true }).selectFile('cypress/files/documentSample.png', {
            force: true
        })
        cy.verifyApiResponse('@AddDescriptorFileApi')

        cy.wait(3000)

        cy.interceptApi('updateDocument')
        cy.interceptApi('getESDocuments')

        cy.get("#documentSaveButton", { timeout: 5000 }).should('be.visible').trigger("click");
        cy.verifyApiResponse('@updateDocumentApi')

        cy.log('==== STEP: DELETING RECENTLY ADDED DOCUMENT ====')

        cy.log('==== STEP: OPENING FILE DETAIL DRAWER ====')
        cy.get('table').contains('td', '99934034').click();

        cy.log('==== STEP: CLICKING ON HORIZON ICON ====')
        cy.get("#fileDetailHorzIcon").click()

        cy.interceptApi('updateDocument')
        cy.deleteConfirmation()
        cy.verifyApiResponse('@updateDocumentApi')

    })

})