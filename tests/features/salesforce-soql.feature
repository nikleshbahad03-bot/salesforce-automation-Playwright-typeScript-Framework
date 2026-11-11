Feature: Salesforce API smoke check
        @Test2
        Scenario: A basic Account SOQL query executes
            Given the Salesforce API connection is authenticated
             When I query Account records with SOQL
             Then the SOQL query completes successfully
