Feature: Salesforce contact record page

        @Test3
        Scenario: Verify the Test1 Niklesh1 contact details
            Given I sign in to Salesforce as the admin
             When I open the Contacts page
             Then the contact "Test1 Niklesh1" is present
             When I open the contact "Test1 Niklesh1"
             Then the contact details are displayed
              And the contact email is "test@example.com"
              And the contact name contains "Mr. Test1 Niklesh1"
              And the Show All Activities button is displayed
