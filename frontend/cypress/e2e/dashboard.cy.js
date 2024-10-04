describe("Dashboard Page", () => {
  beforeEach(() => {
    cy.restoreSession();
    cy.visit("http://localhost:5001/dashboard");
  });

  it("should display dashboard components", () => {
    cy.url().should("include", "/dashboard");

    cy.get("[data-test=dashboard-header]").should("be.visible");
    cy.get("[data-test=dashboard-content]").should("be.visible");
  });

  it("should fetch and display employee data", () => {
    cy.intercept("GET", "http://localhost:3000/api/dashboard").as(
      "getEmployees"
    );

    cy.wait("@getEmployees").then((interception) => {
      expect([200, 304]).to.include(interception.response.statusCode);
    });

    cy.contains("Brandon");
    cy.contains("Maintenance/Construction");
    cy.contains("10/2/2022");
    cy.contains("5/10/2025");
  });

  it("should fetch and display training data", () => {
    cy.intercept("GET", "http://localhost:3000/api/dashboard/numbers").as(
      "getTrainings"
    );

    cy.wait("@getTrainings").then((interception) => {
      expect([200, 304]).to.include(interception.response.statusCode);
    });

    cy.get("[data-test=training-titles]").should("exist");
    cy.get("[data-test=training-latest-end-dates]").should("exist");
    cy.get("[data-test=training-expiry-dates]").should("exist");
    cy.get("[data-test=scheduled-training-dates]").should("exist");

    cy.get("[data-test=training-titles]").should("contain", "COUNTERFEIT");
    cy.get("[data-test=training-titles]").should(
      "contain",
      "MEASUREMENT AND CALIBRATION"
    );
    cy.get("[data-test=training-titles]").should("contain", "FOD");
    cy.get("[data-test=training-titles]").should(
      "contain",
      "DEBURING AND BUFFING"
    );
  });

  it("should fetch and display percentage data", () => {
    cy.intercept("GET", "http://localhost:3000/api/dashboard/percentage").as(
      "getPercentage"
    );

    cy.wait("@getPercentage").then((interception) => {
      expect([200, 304]).to.include(interception.response.statusCode);
    });
    cy.get(".piechart-title").should(
      "contain",
      "Percentage Of Employees Who Are Fully Certified"
    );
  });

  it("should navigate to the report generation page", () => {
    cy.contains("Report").click();
    cy.url().should("include", "/report");
  });
});
