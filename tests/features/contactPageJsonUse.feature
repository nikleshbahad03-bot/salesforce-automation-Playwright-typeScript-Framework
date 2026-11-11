Feature: Salesforce contact record with JSON test data

  @Test4
  Scenario: Verify contact details using contactPage.json
    Given I sign in to Salesforce as the admin
    When I open Contacts using contact JSON data
    Then the JSON contact is present
    When I open the JSON contact
    Then the contact details match contactPage.json
    And the Show All Activities button is displayed for the JSON contact
