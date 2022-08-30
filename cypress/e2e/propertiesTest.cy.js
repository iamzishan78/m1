/* eslint-disable no-undef */

describe('empty spec', () => {
    it('passes', () => {
        cy.visit('http://localhost:3000/revenue/properties')

        cy.get('input').type('localhost')
        cy.get('.MuiButtonBase-root').click()

        cy.wait(4000)

        cy.get('#signInName', { timeout: 10000 }).should('be.visible').type('support@m1neral.com')
        cy.get('#password').type('M1neral2022')
        cy.wait(4000)
        cy.get('#next').click()

        cy.wait(12000)
        cy.intercept({
            method: 'POST',
            url: 'http://localhost:7071/api/m1graph',
        }).as('paginationApiCheck')


        cy.get('#pagination-next').click({ force: true })

        cy.wait('@paginationApiCheck').then((interception) => {
            assert.isNotNull(interception.response.body, 'paginationApiCheck call has data')
        })

        cy.wait(3000)

        cy.intercept({
            method: 'POST',
            url: 'http://localhost:7071/api/m1graph',
        }).as('paginationApiCheck')

        cy.get('#pagination-next').click({ force: true })

        cy.wait('@paginationApiCheck').then((interception) => {
            assert.isNotNull(interception.response.body, 'paginationApiCheck api call has data')
        })

        cy.wait(3000)

        cy.intercept({
            method: 'POST',
            url: 'http://localhost:7071/api/m1graph',
        }).as('paginationApiCheck')

        cy.get('#pagination-next').click({ force: true })

        cy.wait('@paginationApiCheck').then((interception) => {
            assert.isNotNull(interception.response.body, 'paginationApiCheck api call has data')
        })

        cy.wait(3000)

        cy.intercept({
            method: 'POST',
            url: 'http://localhost:7071/api/m1graph',
        }).as('paginationApiCheck')

        cy.get('#pagination-back').click({ force: true })

        cy.wait('@paginationApiCheck').then((interception) => {
            // assertFalse(interception.response.body.isEmpty(),  'pagination-back api call has data)
            console.log(interception.response.body)
            assert.isNotNull(interception.response.body, 'pagination-back api call has data')
        })

        cy.wait(9000)

        cy.intercept({
            method: 'POST',
            url: 'http://localhost:7071/api/m1graph',
        }).as('paginationApiCheck')

        cy.get('#pagination-back').click({ force: true })

        cy.wait('@paginationApiCheck').then((interception) => {
            console.log(interception.response.body)
            assert.isNotNull(interception.response.body, 'pagination-back api call has data')
        })

        cy.wait(3000)

        cy.intercept({
            method: 'POST',
            url: 'http://localhost:7071/api/m1graph',
        }).as('paginationApiCheck')

        cy.get('#pagination-back').click({ force: true })

        cy.wait('@paginationApiCheck').then((interception) => {
            console.log(interception.response.body)
            assert.isNotNull(interception.response.body, 'pagination-back api call has data')
        })

        cy.wait(3000)

        cy.intercept({
            method: 'POST',
            url: 'http://localhost:7071/api/m1graph',
        }).as('paginationApiCheck')

        cy.get('#pagination-back').click({ force: true })

        cy.wait('@paginationApiCheck').then((interception) => {
            console.log(interception.response.body)
            assert.isNotNull(interception.response.body, 'pagination-back api call has data')
        })


    })

})