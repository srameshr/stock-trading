
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## To run
1. Clone this project and cd into the project
2. Run npm install
3. Run npm serve

## Passing Tests
#### Dashboard
 - [x] Should display his current portfolio value
 - [x] Should display current cash
 - [x] Should have search functionality for stocks
 - [x] Should have tabular display of all open positions
 - [x] Should allow further actions on open positions
 - [x] Shouldn’t allow further actions on completely liquidated positions

#### Add / Buy Stocks

 - [x] Should autofill EOD price based on date
 - [x] Should allow to override the autofill price
 - [x] Shouldn’t allow to buy more than available cash
 - [x] Should show current open and closed positions
 - [x] Should save to open positions when saved
 - [x] Should Update Portfolio value
 - [x] Should reduce Cash Balance

#### Sell / Liquidate Stocks

 - [x] Should allow the user to select how many positions he wants to liquidate
 - [x] Shouldn’t allow to select date before the purchase date
 - [x] Should autofill the price for the selected date which can be overridden
 - [x] Should Update Portfolio value
 - [x] Should add to Cash Balance 

## Architecture
	<Provider>
	  <Home>
	    <Portfolio />
	  </Home>
	  <Trade>
	    <Trade.Provider value>
	      <Route mountOnPath>
		     <Trade.Consumer context>
			     <Buy context />
		      </Trade.Consumer>
		      <Trade.Consumer>
			     <Sell context />
		      </Trade.Consumer>
	      </Route>
        </Trade.Provider>
	  </Trade>
	</Provider>
   
## Assumptions and factoring

 - Localstorage is used as the database to store and query positions.
 - Alphavantage API has a low limit and hence is cached globally and handled at utils/api as a configuration.
 - The starting positions and price  are same as the doc.

## Screenshots
![Trading](https://i.ibb.co/9TBcvqC/Screen-Shot-2019-08-18-at-11-55-26-PM.png)

![Dashboard](https://i.ibb.co/stqnKB3/Screen-Shot-2019-08-17-at-1-52-42-AM.png)

![Sell](https://i.ibb.co/bmXGfg2/Screen-Shot-2019-08-17-at-1-53-23-AM.png)

![Error](https://i.ibb.co/zP03jbf/Screen-Shot-2019-08-17-at-1-53-57-AM.png)

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
