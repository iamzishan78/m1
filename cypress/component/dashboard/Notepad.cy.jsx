/* eslint-disable no-undef */
import Notepad from '../../../src/components/Dashboard/components/Notepad.js';
import ldata from '../../fixtures/ldata.json';

describe('Notepad Component', () => {

beforeEach(() => {
  cy.intercept('POST', ldata.url, (req) => {
    if (req.body?.operationName === 'GetUserNotes') {
      req.alias = 'getNoteAlias';
    }
  });

  cy.intercept('POST', ldata.url, (req) => {
    if (req.body?.operationName === 'createNote') {
      req.alias = 'createNote';
    }
  });

  cy.viewport(1600, 1200).mount(<Notepad/>);
});


  it('get notes description from the api and compare with textarea value', () => {
    cy.wait('@getNoteAlias', { timeout: 10000 }).then((interception) => {
      // Now you can make assertions on the component or the API response
      const description = interception.response.body.data.getUserNotes.description;
      cy.get('[data-testid="notes-description-text-area"] textarea').invoke('val').then((textareaText) => {
        // Compare the values
        expect(textareaText).to.equal(description);
      });
    });
  });

  it('Edit description and call save data api', () => {
    cy.wait(11000); 
    cy.get('[data-testid="notes-description-text-area"]').type('Edit Notes description');
    cy.get('[data-testid="notes-description-text-area"]').find('textarea').blur();  
    cy.wait('@createNote', { timeout: 10000 }).then((interception) => {
      const description = interception.response.body.data.createNote.description;
      cy.get('[data-testid="notes-description-text-area"] textarea').invoke('val').then((textareaText) => {
        expect(textareaText).to.equal(description);
      });
    });
  });

  it('revert changes', () => {
    cy.wait(12000); // Wait for 1 second
    cy.get('[data-testid="notes-description-text-area"] textarea').type('{selectall}{backspace}');
    cy.get('[data-testid="notes-description-text-area"]').type('Test  Notes description');
    cy.get('[data-testid="notes-description-text-area"]').find('textarea').blur();
  });

});