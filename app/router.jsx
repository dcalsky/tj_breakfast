import React from 'react';
import { Router, Route, Link, IndexRoute } from 'react-router'
import createBrowserHistory from 'history/lib/createBrowserHistory'

/* Import Component */
import Home from './js/home.jsx';
import Order from './js/order.jsx';
import Pay from './js/pay.jsx';
import Login from './js/login.jsx';
import MyOrder from './js/my-order.jsx';
import Layout from './js/layout.jsx';

/* create history for router */
const history = createBrowserHistory();

/* Router Config */
const routes = 
	<Router history={history}>
	    <Route path="/" component={Layout}>
			<Route path="home" component={Home} />
			<Route path="order" component={Order} />
			<Route path="pay" component={Pay} />
			<Route path="login" component={Login} />
			<Route path="my-order" component={MyOrder} />
			 <IndexRoute component={Layout} />
	    </Route>
	</Router>
	;

/* export a function for app.js to run whole the app. */
export function start(){
		let rootInstance = React.render(routes , document.getElementById('app'));
		if (module.hot) {
		  require('react-hot-loader/Injection').RootInstanceProvider.injectProvider({
		    getRootInstances: function () {
		      return [rootInstance];
		    }
		  });
		}
};
