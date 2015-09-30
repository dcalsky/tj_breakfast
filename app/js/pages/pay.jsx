import React from 'react';
import cookie from 'cookie-cutter';
import _ from 'underscore';

const Pay = React.createClass({
	getInitialState() {
	    return {
	        
	    };
	},
	componentWillMount() {
        this.setState({
      	  	account: cookie.get('account'),
      	  	loadCompleted: true,
      	  	total: cookie.get('total'),
      	  	count: cookie.get('count')
        });
	},
	_back(){
		this.props.history.replaceState(null, '/home');
	},
    render() {
        return (
            <div className="app">
              <header>
                <div className="nav">
                  <span className="back" onClick={this._back}>
                    <i className="zmdi zmdi-chevron-left"></i>返回
                  </span>
                  <span className="title">
                    <span>支付页面</span>
                  </span>
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
