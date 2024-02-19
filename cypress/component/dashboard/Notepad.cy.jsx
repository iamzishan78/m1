/* eslint-disable no-undef */
import Notepad from '../../../src/components/Dashboard/components/Notepad.js';
import { basic_timeouts, retries } from '../../cypressUtils/data';
import ldata from "../../fixtures/ldata.json";
import { useLazyQuery, useMutation } from "@apollo/client";
import { CREATE_NOTE } from 'graphQL/useMutationNote';

describe('Notepad Component', () => {

    beforeEach(() => {
        cy.window().then((win) => {
            win.stateProfile = {
              fields: {
                _id: '65b2a4d3c7f379e513f91913', 
              },
            };
          });
          cy.viewport(1800, 1400).mount(<Notepad />);
    });

    it('Debugging test case', () => {
        cy.window().then((win) => {
          console.log('stateProfile:', win.stateProfile);
        });
    });

    it('Displays Notes inside textarea', () => {
        cy.interceptAndWait(["GetUserNotes"], (alias) => {
            cy.get('[data-testid="notes-description-text-area"]').type('Your text goes here');

              cy.wait(alias, { timeout: basic_timeouts.longTimeout }).then(
                (response) => {
                  const data = response?.response
                  expect(response?.response?.statusCode).to.eq(200);

                  cy.request({
                    method: "POST",
                    url: ldata.url,
                    headers: headers,
                    body: '',
                  }).then((r) => {
                    expect(r.status).to.eq(200);
                  });
                }
              );
            },
            { wait: false }
        );
    });

   
});