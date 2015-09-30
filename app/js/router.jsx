import React from 'react';
import { Router, Route, Link, IndexRoute } from 'react-router';
import { createHashHistory } from 'history';

/* Import Component */
import Home from './pages/home.jsx';
import Order from './pages/order.jsx';
import Pay from './pages/pay.jsx';
import Login from './pages/login.jsx';
import MyOrder from './pages/my-order.jsx';
import Layout from './pages/layout.jsx';

/* create history for router */
let history = new createHashHistory();

/* Router Config */
const routes = 
	<Router history={history}>
	    <Route path="/" component={Layout}>
		    <IndexRoute component={Home} />
			<Route path="home" component={Home} />
			<Route path="order" component={Order} />
			<Route path="pay" component={Pay} />
			<Route path="login" component={Login} />
			<Route path="my-order" component={MyOrder} />
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
