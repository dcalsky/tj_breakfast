import React from 'react/addons';
import {Navigation} from 'react-router';

import {createOrder} from '../cloud';
import cookie from 'cookie-cutter';

import _ from 'underscore';

const Order = React.createClass({
	today: new Date(),
	mixins: [ Navigation, React.addons.LinkedStateMixin],
	getInitialState() {
	    return {
	    	goods: [],
	    	account: null,
	    	total: 0,
	    	count: 0,
	    	marks: '',
	    	username: '',
	    	token: '',
	    	name: '',
	    	floor: '',
	    	room: '',
	    	phone: '',
	    	startDate: this.addDate(this.today, 1),
	    	loadCompleted: false,
	    	ableToBuy: false,
	    	discount_activity: 0,
	    	discount_normal: 0,
	    };
	},
	componentWillMount() {
		if(cookie.get('status') != 'success' || cookie.get('total') == 0){
			this.transitionTo('home');
		}
		let account = JSON.parse(cookie.get('account'));
		this.setState({
			goods: cookie.get('cart') ? JSON.parse(cookie.get('cart')) : [],
			account: account,
			name: account['name'],
			username: cookie.get('username'),
			token: cookie.get('token'),
			phone: account['phone'],
			floor: account['floor'],
			room: account['room'],
			gender: 'male',
			total: cookie.get('total'),
			count: cookie.get('count'),
			loadCompleted: true,
			ableToBuy: true,
		});
	},
	addDate(date,days){ 
		let d = new Date(date); 
		d.setDate(d.getDate()+days); 
		let month=d.getMonth()+1; 
		let day = d.getDate(); 
		if(month < 10){ 
			month = '0' + month; 
		} 
		if(day < 10){ 
			day = '0' + day; 
		} 
		let val = month + "-" + day ;  
		//Todo 节假日不送
		return d.getFullYear() + '-' + val;
	},
	handleValidation(order){
		for (let attr in order){
			if(attr !== 'marks' && attr !== 'token' && !order[attr].replace(/^\s+|\s+$/g, '')){
				alert('除了备注以外的任何一项都不能空着哦...');
				return false;
			}
		}
		for (let attr in order){
				if(attr === 'name' && order[attr].match(/\d/)){
					alert('如果您的名字里真的有数字的话...');
					return false;
				}else if(attr === 'room' && order[attr].length > 10){
					alert('寝室房间号似乎有点儿过长了...');
					return false;
				}else if(attr === 'phone' && !order[attr].match(/^\d{11}$|^\d{7}$|^\d{3}-\d{11}$|^\d{4}-\d{7}$/)){
					alert('错误的号码格式...');
					return false;
				}else if(attr === 'marks' && order[attr].length > 20){
					alert('您的备注太长,我们的小票上打印不了那么多...');
					return false;
				}
		}
		return true;
	},
	_back(){
		this.transitionTo('home');
	},
	_buy(){
		let self = this;
		let goods = [];
		this.setState({
			ableToBuy: false,
		});
		this.state.goods.map((food)=>{
			for(let i = 0; i < food['count']; i++){
				goods.push(food['id'])
			}
		});
		let order = {
			gender: 'male',
			name: this.state.name,
			room: this.state.room,
			floor: this.state.floor,
			phone: this.state.phone,
			username: this.state.username,
			token: this.state.token,
			startDate: this.state.startDate,
			marks: this.state.marks,
			foods: goods.join()
		}
		if(!this.handleValidation(order)){
			this.setState({
				ableToBuy: true,
			});
			return ;
		}
		createOrder(this.state.username, this.state.token, order , (data)=>{
			if(data['status'] == 'success'){
				let account = {
					name: data['user']['name'],
					room: data['user']['room'],
				 	gender: data['user']['gender'], 
				 	floor: data['user']['floor'], 
				 	phone: data['user']['phone'],
				}
				cookie.set('cart', '');
				cookie.set('total', '');
				cookie.set('count', '');
				cookie.set('account', JSON.stringify(account));
				self.setState({
					ableToBuy: true,
					account: account,
				});
				self.transitionTo('pay');
			}else{
				self.setState({
					ableToBuy: true,
				});
				alert('网络问题导致订餐失败,请稍后重试...')
			}
		});
	},
	_handleDateChange(e){
		this.setState({
			startDate: this.addDate(this.today, parseInt(e.target.value)),
			endDate: this.addDate(this.today, parseInt(e.target.value)),
		});
	},
	_handleFloorChange(e){
		this.setState({
			floor: e.target.value,
		});
	},
    render() {
        return (
            <div className="order">
            	<header>
	            	<div className="nav row">
		            	<div className="col-xs-2 slogan center-xs" onClick={this._back}>
		            		<i className="zmdi zmdi-chevron-left" style={{fontSize: '1.2em'}} onClick={this._back}></i>
		            	</div>
	            		<div className="col-xs-8 slogan center-xs">
	            			订单提交
	            		</div>
	            	</div>
            	</header>
            	<section >
            		<p className="order-label">送餐配置</p>
            		<div className="order-setting">
            			<ul >
            				<li className="row between-xs middle-xs">
            					<div>送餐开始时间</div>
            					<select onChange={this._handleDateChange}>
            						<option value={1}>明天早晨</option>
            						<option value={2}>{this.addDate(this.today,2)}</option>
            						<option value={3}>{this.addDate(this.today,3)}</option>
            						<option value={4}>{this.addDate(this.today,4)}</option>
            						<option value={5}>{this.addDate(this.today,5)}</option>
            					</select>
            				</li>
            				<li className="row between-xs middle-xs">
            					<div>送餐备注</div>
					            <input
						        	type="text"
					          		valueLink={this.linkState('marks')}
					          		placeholder="备注"
					      	    />
            				</li>
            			</ul>
            		</div>
            		{
            			this.state.hasAddress?
            			null
            			:
            			<div>
		            		<p className="order-label">送餐地址</p>
		            		<div className="order-setting">
		            			<ul >
		            				<li className="row between-xs middle-xs">
		            					<div>学号</div>
								          <input
									        type="text"
								          	valueLink={this.linkState('username')}
								          	placeholder="学号"
								      	  />
		            				</li>
		            				<li className="row between-xs middle-xs">
		            					<div>姓名</div>
								          <input
									        type="text"
								          	valueLink={this.linkState('name')}
								          	placeholder="真实姓名"
								      	  />
		            				</li>
		            				<li className="row between-xs middle-xs">
		            					<div>寝室楼</div>
		            					<select onChange={this._handleFloorChange}>
					                        <optgroup label="男生宿舍">
					                            <option >西南一</option>
					                            <option >西南七</option>
					                            <option >西南八</option>
					                            <option >西南十</option>
					                            <option >西南十一</option>
					                            <option >西北一</option>
					                            <option >西北三</option>
					                            <option >西北五</option>
					                        </optgroup>
					                        <optgroup label="女生宿舍">
					                            <option >西南二</option>
					                            <option >西南三</option>
					                            <option >西南九</option>
					                            <option >西南十二</option>
					                            <option >西北二</option>
					                            <option >学三楼</option>
					                            <option >学四楼</option>
					                            <option >学五楼</option>
					                        </optgroup>
		            					</select>
		            				</li>
		            				<li className="row between-xs middle-xs">
		            					<div>房间号</div>
								          <input
									        type="text"
								          	valueLink={this.linkState('room')}
								          	placeholder="房间号"
								      	  />
		            				</li>
		            				<li className="row between-xs middle-xs">
		            					<div>电话号码</div>
								          <input
									        type="text"
								          	valueLink={this.linkState('phone')}
								          	placeholder="电话号码"
								      	  />
		            				</li>
		            			</ul>
		            		</div>
	            		</div>
            		}
            		<p className="order-label">小结</p>
            		<div className="order-setting">
            			<ul >
            				<li className="row between-xs middle-xs">
            					<div>活动优惠</div>
            					<div>-￥{this.state.discount_activity}</div>
            				</li>
            				<li className="row between-xs middle-xs">
            					<div>立减优惠</div>
            					<div>-￥{this.state.discount_normal}</div>
            				</li>
            				{this.state.goods.map((item)=>{
            					return(
		            				<li className="row between-xs middle-xs">
		            					<div>{item.name}</div>
		            					<div>￥{item.price} x {item.count}</div>
		            				</li>
            					)
            				})}
            				<li className="row between-xs middle-xs">
            					<div>数量</div>
            					<div>{this.state.count}</div>
            				</li>
            			</ul>
            		</div>
            	</section>

            	<footer className="row" style={{marginLeft: 0}}>
            		<div className="total col-xs-8 center">
            			<div className="cart-price">
            				共 <b>￥{this.state.total-this.state.discount_activity-this.state.discount_normal}</b> 元
            			</div>
            		</div>
        			<button className="buy col-xs-4 end-xs" onClick={this._buy} disabled={!this.state.ableToBuy}>
	        			确定下单
        			</button>
            	</footer>
            </div>


        );
    }
});

export default Order;
