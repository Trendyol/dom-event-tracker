/// <reference types="Cypress" />
const path = require('path');

context('Click Detection', () => {
  it('should fire click event', () => {
    cy.visit(path.join(__dirname, './click.html'));

    cy
      .get('#click')
      .click();

    cy.window()
      .its('dataTrackerEvents')
      .should('deep.equal', [{
        event: 'test',
        type: 'click'
      }]);
  });

  it('should fire click event multiple times', () => {
    cy.visit(path.join(__dirname, './click.html'));

    cy
      .get('#click')
      .click();

    cy
      .get('#click')
      .click();

    const event = {
      event: 'test',
      type: 'click'
    };

    cy.window()
      .its('dataTrackerEvents')
      .should('deep.equal', [event, event]);
  });

  it('should fire click event for async item', () => {
    cy.visit(path.join(__dirname, './click_async.html'));

    cy
      .get('#click')
      .click();

    const event = {
      event: 'async',
      type: 'click'
    };

    cy.window()
      .its('dataTrackerEvents')
      .should('deep.equal', [event]);
  });

  it('should fire click event for async item innerhtml', () => {
    cy.visit(path.join(__dirname, './click_async_inner.html'));

    cy
      .get('#click')
      .click();

    const event = {
      event: 'test',
      type: 'click'
    };

    cy.window()
      .its('dataTrackerEvents')
      .should('deep.equal', [event]);
  });

  it('should fire click event on link', () => {
    cy.visit(path.join(__dirname, './click_with_registered_callbacks.html'));

    cy
      .get('#click')
      .click();

    cy.window()
      .its('dataTrackerEvents')
      .should('deep.equal', [{
        event: 'test',
        type: 'click'
      }]);
  });

  it('should fire click event on links with click events', () => {
    cy.visit(path.join(__dirname, './click_with_registered_callbacks.html'));

    cy
      .get('#link')
      .click();

    cy.window()
      .its('dataTrackerEvents')
      .should('deep.equal', [{
        event: 'link',
        type: 'click'
      }]);
  });

  it('should fire click event on links with #', () => {
    cy.visit(path.join(__dirname, './click_with_registered_callbacks.html'));

    cy
      .get('#link2')
      .click();

    cy.window()
      .its('dataTrackerEvents')
      .should('deep.equal', [{
        event: 'link2',
        type: 'click'
      }]);
  });

  it('should fire click event for async item innerhtml with deeper multiple instances', () => {
    cy.visit(path.join(__dirname, './click_async_inner_multiple.html'));

    cy
      .get('#click')
      .click();

    cy
      .get('#click2')
      .click();

    cy
      .get('#click3')
      .click();


    cy.window()
      .its('dataTrackerEvents')
      .should('deep.equal', [
        {"event": "test", "type": "click"},
        {"event": "test2", "type": "click"},
        {"event": "test", "type": "click"},
        {"event": "test3", "type": "click"},
        {"event": "test2", "type": "click"},
        {"event": "test", "type": "click"}
      ]);
  });

  it('should fire click event for async item innerhtml with deeper multiple instances with capture mode', () => {
    cy.visit(path.join(__dirname, './click_async_inner_multiple_capture.html'));

    cy
      .get('#click')
      .click();

    cy
      .get('#click2')
      .click();

    cy
      .get('#click3')
      .click();


    cy.window()
      .its('dataTrackerEvents')
      .should('deep.equal', [
        {"event": "test", "type": "click-capture"},
        {"event": "test", "type": "click-capture"},
        {"event": "test2", "type": "click-capture"},
        {"event": "test", "type": "click-capture"},
        {"event": "test2", "type": "click-capture"},
        {"event": "test3", "type": "click-capture"}
      ]);
  });
});
