import React from 'react/addons';
import '../../css/order.scss';
import {createOrder} from '../cloud';
import cookie from 'cookie-cutter';
import _ from 'underscore';

const Order = React.createClass({
	today: new Date(),
	mixins: [React.addons.LinkedStateMixin],
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
			this.props.history.pushState(null, 'pay');
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
		this.props.history.pushState(null, 'home');
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
				this.props.history.replaceState(null, '/pay');
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
	            	<div className="nav">
	            		<span className="back" onClick={this._back}>
	            			<i className="zmdi zmdi-chevron-left"></i>返回
	            		</span>
	            		<span className="title">
	            			<span>订单提交</span>
	            		</span>
	            		<span className="account" onClick={()=>{this.props.history.pushState(null, '/my-order')}}>
	            			<i className="zmdi zmdi-account"></i>
	            		</span>
	            	</div>
            	</header>
            	<section >
            		<p className="order-label">送餐配置</p>
            		<div className="order-setting">
            			<ul >
            				<li>
            					<div className="left">送餐开始时间</div>
            					<div className="right">
	            					<select onChange={this._handleDateChange}>
	            						<option value={1}>明天早晨</option>
	            						<option value={2}>{this.addDate(this.today,2)}</option>
	            						<option value={3}>{this.addDate(this.today,3)}</option>
	            						<option value={4}>{this.addDate(this.today,4)}</option>
	            						<option value={5}>{this.addDate(this.today,5)}</option>
	            					</select>
            					</div>
            				</li>
            				<li>
            					<div className="left">送餐备注</div>
            					<div className="right">
						            <input
							        	type="text"
						          		valueLink={this.linkState('marks')}
						          		placeholder="备注"
						      	    />
					      	    </div>
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
		            				<li>
		            					<div className="left">学号</div>
		            					<div className="right">
									        <input
										        type="text"
									          	valueLink={this.linkState('username')}
									          	placeholder="学号"
									      	/>
		            					</div>
		            				</li>
		            				<li>
		            					<div className="left">姓名</div>
		            					<div className="right">
								            <input
										        type="text"
									          	valueLink={this.linkState('name')}
									          	placeholder="真实姓名"
								      	    />
								      	</div>
		            				</li>
		            				<li>
		            					<div className="left">寝室楼</div>
		            					<div className="right">
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
		            					</div>

		            				</li>
		            				<li>
		            					<div className="left">房间号</div>
		            					<div className="right">
									        <input
										        type="text"
									          	valueLink={this.linkState('room')}
									          	placeholder="房间号"
									      	/>
								      	</div>
		            				</li>
		            				<li>
		            					<div className="left">电话号码</div>
		            					<div className="right">
									        <input
										        type="text"
									          	valueLink={this.linkState('phone')}
									          	placeholder="电话号码"
									      	/>
								      	</div>
		            				</li>
		            			</ul>
		            		</div>
	            		</div>
            		}
            		<p className="order-label">小结</p>
            		<div className="order-setting">
            			<ul >
            				<li>
            					<div className="left">活动优惠</div>
            					<div className="right">-￥{this.state.discount_activity}</div>
            				</li>
            				<li>
            					<div className="left">立减优惠</div>
            					<div className="right">-￥{this.state.discount_normal}</div>
            				</li>
            				{this.state.goods.map((item)=>{
            					return(
		            				<li>
		            					<div className="left">{item.name}</div>
		            					<div className="right">￥{item.price} x {item.count}</div>
		            				</li>
            					)
            				})}
            				<li>
            					<div className="left">数量</div>
            					<div className="right">{this.state.count}</div>
            				</li>
            			</ul>
            		</div>
            	</section>

            	<footer>
	            	<ul className="container">
	            		<li className="total">
	            			<span className="price">
	            				共 <b>￥{this.state.total-this.state.discount_activity-this.state.discount_normal}</b> 元
	            			</span>
	            		</li>
	            		<li>
		        			<button className="buy" onClick={this._buy} disabled={!this.state.ableToBuy}>
			        			确定下单
		        			</button>
	        			</li>
        			</ul>
            	</footer>
            </div>


        );
    }
});

export default Order;
