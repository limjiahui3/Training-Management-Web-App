describe('Training Session Page', () => {

  beforeEach(() => {
    cy.restoreSession();
    cy.visit('http://localhost:5001/sessions');
  });

  it('should contain page components', () => {
    cy.url().should('include', '/sessions');

    cy.get('[data-test=create-session-button]').should('be.visible');
    cy.get('[data-test=edit-session-button]').should('be.visible');
    cy.get('[data-test=delete-session-button]').should('be.visible');
    cy.get('[data-test=mark-attendance-button').should('be.visible');
    cy.get('[data-test=session-table]').should('be.visible');
  })

  it('should fetch and display session data', () => {
    cy.intercept("GET", "http://localhost:3000/api/sessions").as(
      "getSessions");

    cy.wait("@getSessions").then((interception) => {
      expect([200, 304]).to.include(interception.response.statusCode);
    })

    cy.get('[data-test=session-table]').should('contain', 'Brandon');
    cy.get('[data-test=session-table]').should('contain', 'MEASUREMENT AND CALIBRATION');
    cy.get('[data-test=session-table]').should('contain', '15/09/2024');
    cy.get('[data-test=session-table]').should('contain', '20/10/2024');
    cy.get('[data-test=session-table]').should('contain', '20/10/2025');

  })
})