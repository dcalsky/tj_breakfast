import React from 'react';
import {Navigation} from 'react-router';

import cookie from 'cookie-cutter';

import _ from 'underscore';

const Pay = React.createClass({
	mixins: [ Navigation ],
	getInitialState() {
	    return {
	        
	    };
	},
	componentWillMount() {
        this.setState({
      	  	account: cookie.get('account'),
      	  	loadCompleted: true,
      	  	total: cookie.get('total'),
      	  	count: cookie.get('count'),
        });
	},
	_back(){
		this.goBack();
	},
    render() {
        return (
            <div className="app">
            	<header>
	            	<div className="nav">
	            		<div className="left-slogan center">
	            			同济早餐
	            		</div>
	            	</div>
            	</header>
            	<section>
            		支付页面
            	</section>
            </div>


        );
    }
});

export default Pay;
