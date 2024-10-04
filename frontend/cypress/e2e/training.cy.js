describe("Trainings Page", () => {
  beforeEach(() => {
    cy.restoreSession();
    cy.visit("http://localhost:5001/trainings");
  });

  it("should display the list of trainings", () => {
    cy.intercept("GET", "http://localhost:3000/api/trainings").as("getTrainings");

    cy.wait("@getTrainings").then((interception) => {
      expect([200, 304]).to.include(interception.response.statusCode);
    });

    cy.contains("Create Training").should("be.visible");
    cy.contains("SAFETY AWARENESS").should("be.visible");
  });

  it("should add a new training", () => {
    cy.contains("Create Training").click();
    cy.url().should("include", "/trainings/create");

    cy.intercept("POST", "http://localhost:3000/api/trainings").as("createTraining");

    cy.get("[data-test=input-title]").type("Test Training");
    cy.get("[data-test=input-description]").select("INTERNAL");
    cy.get("[data-test=input-validity]").type("12");
    cy.get("[data-test=input-provider]").type("Test Provider");

    cy.get('button').contains('Save').click();
    cy.wait("@createTraining").then((interception) => {
      expect([201, 409]).to.include(interception.response.statusCode);
    });

    cy.contains('Training created successfully');
    cy.url().should('include', '/trainings');
  });

  it("should edit an existing training", () => {
    cy.intercept("PUT", "http://localhost:3000/api/trainings/*").as("editTraining");

    cy.get("table")
      .contains("td", /Test Training/i)
      .parent("tr")
      .find("[data-test=edit-training]")
      .click();

    cy.url().should("include", "/trainings/edit/");

    cy.get("[data-test=input-title]").clear().type("Updated Training");
    cy.get("[data-test=input-description]").select("EXTERNAL");
    cy.get("[data-test=input-validity]").clear().type("24");

    cy.contains("button", "Save").click();

    cy.wait("@editTraining").then((interception) => {
      expect([200]).to.include(interception.response.statusCode);
    });

    cy.contains('Training edited successfully');
    cy.url().should("include", "/trainings");
    cy.contains(/Updated Training/i).should("be.visible");
  });

  it("should view training details", () => {
    cy.intercept("GET", "http://localhost:3000/api/trainings/*").as("getTrainingDetails");

    cy.contains("tr", /Updated Training/i).find("[data-test=view-training]").click();

    cy.wait("@getTrainingDetails").then((interception) => {
      expect([200]).to.include(interception.response.statusCode);
    });

    cy.url().should("include", "/trainings/details/");
    cy.contains(/Training Details/i).should("be.visible");
    cy.contains(/Updated Training/i).should("be.visible");
  });

  it("should delete a training", () => {
    cy.intercept("DELETE", "http://localhost:3000/api/trainings/*").as("deleteTraining");

    cy.get("table")
      .contains("td", /Updated Training/i)
      .parent("tr")
      .find("[data-test=delete-training]")
      .click();

    cy.url().should("include", "/trainings/delete/");

    cy.contains("Are you sure you want to delete this training?").should("be.visible");

    cy.contains("button", "Yes, Delete it").click();

    cy.wait("@deleteTraining").then((interception) => {
      expect([200]).to.include(interception.response.statusCode);
    });

    cy.url().should("include", "/trainings");
    cy.contains("Training Deleted successfully");
  });
});
