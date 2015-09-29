import React from 'react';
import {Navigation} from 'react-router';
import {getUserOrders} from '../cloud';
import {foodFliter} from '../utils';
import cookie from 'cookie-cutter';

import _ from 'underscore';

const MyOrder = React.createClass({
	mixins: [Navigation],
	getInitialState(){
		return{
			orders: [],
			loadCompleted: false,
			loadfailed: false,
		};
	},
	componentWillMount(){
		let username = cookie.get('username');
		getUserOrders(username,'', (data)=>{
			console.log(data);
			if(data['status'] == 'error'){
				this.setState({
					loadCompleted: true,
					loadfailed: true,
				});
			}else{
				_.map(data['orders'], (order)=>{
					order['foods'] = foodFliter(order['foods']);
				});
				this.setState({
					loadCompleted: true,
					orders: data['orders'],
				});
			}
		});
	},
	_back(){
		this.transitionTo('home');
	},
	render(){
		return(
            <div className="app">
            	<header>
	            	<div className="nav row">
		            	<div className="col-xs-2 slogan center-xs" onClick={this._back}>
		            		<i className="zmdi zmdi-chevron-left" style={{fontSize: '1.2em'}} onClick={this._back}></i>
		            	</div>
	            		<div className="col-xs-8 left-slogan center">
	            			我的订单
	            		</div>
	            	</div>
            	</header>
            	<section className="my-order">
	            	<ul>
	            		{this.state.orders.map((order)=>{
	            			return (
	            				<li className="my-order-list">
	            					<div>
	            						订单号: {order['id']}
	            					</div>
		            				<div className="row between-xs" style={{margin: 0}}> 
		            					<div className="start-xs">开始时间: {order['startDate']}</div>
		            					<div className="end-xs">总价: {order['totalPrice']}</div>
		            				</div>
		            				<ul>
		            					{order['foods'].map((food)=>{
		            						return(
					            				<li className="row between-xs middle-xs order-setting">
					            					<div>{food['foodName']}</div>
					            					<div>￥{food['price']} x {food['count']}</div>
					            				</li>
		            						);
		            					})}
		            					<li className="row between-xs middle-xs order-setting">
		            						<div>优惠总折扣: </div>
		            						<div>￥0</div>
		            					</li>
		            					<li className="row between-xs middle-xs order-setting">
		            						<div>总价: </div>
		            						<div className="cart-price">{order['totalPrice']}</div>
		            					</li>
		            				</ul>
		            					
		            			</li>
	            			);
	            		})}
            		</ul>
            	</section>
            	{
            		this.state.loadCompleted ? 
            		null
            		:
            		<div />
            	}
            	{
            		this.state.loadfailed ? 
            		<div />
            		:
            		null
            	}
        	</div>
		);
	}
});

export default MyOrder;