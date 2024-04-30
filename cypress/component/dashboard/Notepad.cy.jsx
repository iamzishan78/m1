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


  it('Successfully retrieved notes description.', () => {
    cy.wait('@getNoteAlias', { timeout: 10000 }).then((interception) => {
      const description = interception.response.body.data.getUserNotes.description;
      cy.get('[data-testid="notes-description-text-area"] textarea').invoke('val').then((textareaText) => {
        expect(textareaText).to.equal(description);
      });
    });
  });

  it('Successfully edited notes description and saved data through API.', () => {
    cy.wait(10000); 
    cy.get('[data-testid="notes-description-text-area"]').type('Edit Notes description');
    cy.get('[data-testid="notes-description-text-area"]').find('textarea').blur();  
    cy.wait('@createNote', { timeout: 12000 }).then((interception) => {
      const description = interception.response.body.data.createNote.description;
      cy.get('[data-testid="notes-description-text-area"] textarea').invoke('val').then((textareaText) => {
        expect(textareaText).to.equal(description);
      });
    });
  });

  it('Successfully reverted notes description changes.', () => {
    cy.wait(12000); 
    cy.get('[data-testid="notes-description-text-area"] textarea').type('{selectall}{backspace}');
    cy.get('[data-testid="notes-description-text-area"]').type('Test  Notes description');
    cy.get('[data-testid="notes-description-text-area"]').find('textarea').blur();
  });

});