describe("Employees Page", () => {
  beforeEach(() => {
    cy.restoreSession();
    cy.visit("http://localhost:5001/employees");
  });

  it("should display the list of employees", () => {
    cy.intercept("GET", "http://localhost:3000/api/employees").as(
      "getEmployees"
    );

    cy.wait("@getEmployees").then((interception) => {
      expect([200, 304]).to.include(interception.response.statusCode);
    });

    cy.get("[data-test=add-employee-button]").should("be.visible");
    cy.get("[data-test=employees-table]").should("be.visible");
  });

  it("should add a new employee", () => {
    cy.get('[data-test="add-employee-button"]').click();
    cy.url().should("include", "/employees/create");

    cy.intercept("POST", "http://localhost:3000/api/employees").as(
      "createEmployee"
    );

    cy.get("[data-test=input-id]").type("998");
    cy.get("[data-test=input-name]").type("John Doe");
    cy.get("[data-test=input-email]").type("john.doe@example.com");
    cy.get("[data-test=input-designation]").type("Software Engineer");
    cy.get("[data-test=input-hire-date]").type("2023-08-01");

    cy.get("[data-test=save-button]").click();

    cy.wait("@createEmployee").then((interception) => {
      expect([201, 409]).to.include(interception.response.statusCode);
    });

    cy.url().should("include", "/employees");
    cy.contains("Employee created successfully");
    cy.contains("John Doe").should("be.visible");
  });

  it("should edit an existing employee", () => {
    cy.intercept("PUT", "http://localhost:3000/api/employees/*").as(
      "editEmployee"
    );

    cy.get("table")
      .contains("td", "John Doe")
      .parent("tr")
      .find("[data-test=edit-employee-998]")
      .click();

    cy.url().should("include", "/employees/edit/");

    cy.get('input[type="text"]').eq(0).clear().type("Jane Doe");
    cy.get('input[type="email"]').clear().type("jane.doe@example.com");

    cy.contains("button", "Save").click();

    cy.wait("@editEmployee").then((interception) => {
      expect([200]).to.include(interception.response.statusCode);
    });

    cy.url().should("include", "/employees");
    cy.contains("Employee edited successfully");
    cy.contains("Jane Doe").should("be.visible");
  });

  it("should view employee details", () => {
    cy.contains("tr", "Jane Doe").find("[data-test=view-employee-998]").click();

    cy.url().should("include", "/employees/details/");
    cy.contains("Employee Details").should("be.visible");
    cy.contains("Jane Doe").should("be.visible");
    cy.contains("jane.doe@example.com").should("be.visible");
  });

  it("should delete an employee", () => {
    cy.intercept("DELETE", "http://localhost:3000/api/employees/*").as(
      "deleteEmployee"
    );

    cy.get("table")
      .contains("td", "Jane Doe")
      .parent("tr")
      .find("[data-test=delete-employee-998]")
      .click();
    cy.url().should("include", "/employees/delete/");

    cy.contains("Are you sure you want to delete this employee?").should(
      "be.visible"
    );

    cy.contains("button", "Yes, Delete it").click();

    cy.wait("@deleteEmployee").then((interception) => {
      expect([200]).to.include(interception.response.statusCode);
    });

    cy.url().should("include", "/employees");
    cy.contains("Employee Deleted successfully");
    cy.contains("Jane Doe").should("not.exist");
  });
});
