

The is simple weather react app with react and redux
  - take a zip code as a parameter
  - respond with 3-day forecast for the zip location
  - support response content types: "text/plain" and "application/json"
  X respond accordingly when Zip code is malformed or not found
  X respond accordingly when external service is not available (Right now only shows waiting for data).  Have to do error handling and messaging.

Optional features:
  - Add 7-day forecast; (Save in LocalStorage)
  - Save Favorite Locations (Dropdown select menu)

More to do
  - Move out from LocalSotrage to may be sign in require to save personalized favorite locations. (Google firebase/ Authenication....)

For testing
  - We have to test each component (Content, FavoritePlaces, Redux) and overall testing the whole App from entering zipCode to result and any possible wrong request send.

Features:
  - Sign in or Subscribe alert services (Optional E-mail, SMS or robot call but can implement as Mobile App has Alarm customized)
  - Save past data up to years for data science if there is needed (Premium service.


to get all packages before running the app
## run `npm i`
## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
