/* eslint-disable no-undef */

import { authMe, baseUrls } from "../cypressUtils/data";


const tenant = Cypress.env('TENENT') || "localhost"

describe('Save Login for Component Testing', () => {
    it('Login', () => {
        cy.viewport(1400, 900);
        cy.log(tenant, baseUrls, Cypress.env('TENENT'))
        cy.intercept(authMe[tenant]).as('me')
        cy.intercept(baseUrls[tenant]).as('getSettings')

        cy.visit('http://localhost:3000', { timeout: 100000 });

        cy.checkAndLogin();

        cy.wait('@me', { timeout: 100000 }).then((meResp) => {
            cy.wait('@getSettings', { timeout: 100000 }).then((interception) => {
                cy.writeFile('cypress/fixtures/ldata.json', {
                    url: interception.request.url, x_zumo_auth: interception.request.headers['x-zumo-auth'],
                    access_token: meResp.response?.body[0]?.access_token
                });

                cy.readFile('cypress/fixtures/ldata.json').then((ldata) => {
                    expect(ldata.url).to.equal(interception.request.url) // true
                    expect(ldata.x_zumo_auth).to.equal(interception.request.headers['x-zumo-auth']) // true
                    expect(ldata.access_token).to.equal(meResp.response?.body[0]?.access_token) // true
                  })
            })
        })
    });
});
