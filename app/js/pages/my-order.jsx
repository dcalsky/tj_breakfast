import React from 'react';
import '../../css/my-order.scss';
import {getUserOrders} from '../cloud';
import {foodFliter} from '../utils';
import cookie from 'cookie-cutter';
import Loading from '../components/loading.jsx';
import _ from 'underscore';

const MyOrder = React.createClass({
	getInitialState(){
		return{
			orders: [],
			loadCompleted: false,
			loadFailed: false,
            loaderShow: true,
            page: 1
		};
	},
	componentWillMount(){
        let username = cookie.get('username'), token = cookie.get('token');
		if(!username || !token) {
            this.props.history.pushState(null, '/login');
        }
		getUserOrders(username,'', this.state.page, (data)=>{
			console.log(data);
			if(data['status'] == 'error'){
				this.setState({
					loadCompleted: true,
					loadFailed: true
				});
			}else {
                this.setState({
                      loaderShow: data['orders'].length >= 5
                });
                _.map(data['orders'], (order)=> {
                    order['foods'] = foodFliter(order['foods']);
                });
                this.setState({
                    loadCompleted: true,
                    orders: data['orders']
                });
            }
		});
	},
	_back(){
		this.props.history.pushState(null, '/home');
	},
	render(){
        if(this.state.loadCompleted){
            return(
                <div className="app">
                    <header>
                        <div className="nav">
	            		<span className="back" onClick={this._back}>
	            			<i className="zmdi zmdi-chevron-left"></i>返回
	            		</span>
	            		<span className="title">
	            			<span>我的订单</span>
	            		</span>
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
                    <div className="loader">
                        <button className="loader" type="button" onClick={this.loadMore}>查看更多</button>
                    </div>
                </div>
            );
        }else if(this.state.loadFaild){
            return(
                <div />
            );
        }else{
            return(
                <Loading />
            );
        }
	}
});

export default MyOrder;