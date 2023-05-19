# Risk Assessment API

The risk assessment API is used to determine a user's risk profile for each line of insurance
(life, disability, home & auto) and then suggest an insurance plan ("economic", "regular", "responsible") 
corresponding to their risk profile.

This application is built assuming it will grow over time, so it may seem unnecessarily complex for the current requirements.
The main business logic is contained in the PolicyManager class, which is responsible for determining the risk profile and
returning a suggested insurance plan.

In order to get a risk assessment, you must post to the /policies endpoint with a JSON object containing the policy request.
### Running the tests

    npm run test

### Running the application

    npm run start

## Contact

   - Kevin Kolz - kckolz@gmail.com

