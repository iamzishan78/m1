/* eslint-disable no-undef */

describe('Add Document Spec', () => {
    it('passes', () => {
        cy.viewport(1400, 900)
        cy.visit('http://localhost:3000/documents')

        cy.checkAndLogin('#workSpaceSignin')


        cy.log('==== STEP: ADD DOCUMENT ====')
        cy.get('#addDocument', { timeout: 50000 }).should('be.visible').click()

        cy.log('==== STEP: ADD FILE NUMBER ====')
        cy.get('#filenumber', { timeout: 50000 }).type('99934033').should('be.visible')
        
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

        cy.get('input[type=file]', { force: true }).selectFile('cypress/files/documentSample.png', {
            force: true
        })

        cy.wait(3000)
        cy.intercept('POST', 'https://enerxgraphql.azurewebsites.net/api/m1graph?code=Rhr8LQFXNnl/TE26EVD296voKbGVWZQDupqWAAWMaZXjzvgdvktPqg==', req => {
            if (req.body.operationName === 'updateDocument') {
                req.alias = 'updateDocumentApi';
            }
        });

        cy.wait(2000)
        cy.get("#documentSaveButton").trigger("click");

        cy.wait('@updateDocumentApi', { timeout: 10000 }).then((interception) => {
            assert.isNotNull(interception.response.body, 'updateDocument api run succesfully')
        })


    })

})