describe('Login Page', () => {
  it('should redirect to login page if not logged in', () => {
    cy.visit('http://localhost:5001/');
    cy.url().should('include', '/login');
    cy.get('[data-test=username]').should('be.visible');
    cy.get('[data-test=password]').should('be.visible');
    cy.get('[data-test=submit]').should('be.visible');
  });

  it('should display the login form', () => {
    cy.visit('http://localhost:5001/login');
    cy.get('[data-test=username]').should('be.visible');
    cy.get('[data-test=password]').should('be.visible');
    cy.get('[data-test=submit]').should('be.visible');
  });

  it('should not log in with invalid credentials', () => {
    cy.visit('http://localhost:5001/login');
    cy.get('[data-test=username]').type('invalidUsername');
    cy.get('[data-test=password]').type('invalidPassword');
    cy.get('[data-test=submit]').click();

    // Assume login fails and the user stays on the login page
    cy.url().should('include', '/login');
    // Check if token is null in local storage
    cy.window().then((window) => {
      const token = window.localStorage.getItem('token');
      expect(token).to.be.null;
    })
  });

  it('should log in successfully with valid credentials', () => {
    cy.visit('http://localhost:5001/login');
    cy.get('[data-test=username]').type('admin');
    cy.get('[data-test=password]').type('admin');
    cy.get('[data-test=submit]').click();

    // Redirects to dashboard
    cy.url().should('include', '/dashboard');
    // Check if token stored in local storage
    cy.window().then((window) => {
      const token = window.localStorage.getItem('token');
      expect(token).to.exist;
    })
  });

});
