/* eslint-disable no-undef */

describe('Document Grid Spec', () => {
    it('passes', () => {
        cy.viewport(1400, 900)
        cy.visit('http://localhost:3000/documents')

        cy.checkAndLogin()

        cy.get('#addDocument', { timeout: 50000 }).should('be.visible')

        cy.gridSearch('view_week_black', 'getESDocuments').then((apiResponse) => {
            console.log(apiResponse.response.body.data.getESFiles.hits)
            console.log(JSON.stringify(apiResponse.response.body.data.getESFiles.hits))
            cy.log(apiResponse)


        })
    })

})