/* eslint-disable no-undef */

import { baseUrls } from "../cypressUtils/data";


const tenant = Cypress.env('TENENT') || "localhost"

describe('Save Login for Component Testing', () => {
    it('passes', () => {


        cy.viewport(1400, 900);
        cy.log(tenant, baseUrls, Cypress.env('TENENT'))
        cy.intercept(baseUrls[tenant]).as('getSettings')

        cy.visit('https://m1neral-preview.azurewebsites.net/admin/map', { timeout: 100000 });

        cy.checkAndLogin();

        cy.wait('@getSettings', { timeout: 100000 }).then((interception) => {
            cy.log(interception)
            cy.writeFile('cypress/fixtures/ldata.json', { url: interception.request.url, x_zumo_auth: interception.request.headers['x-zumo-auth'] });
        })
    });
});
