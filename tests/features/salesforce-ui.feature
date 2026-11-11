Feature: Salesforce UI smoke check

        @Test1
        Scenario: Salesforce admin can sign in
            Given I sign in to Salesforce as the admin
             When the Salesforce home page loads
             Then the login page is no longer displayed
