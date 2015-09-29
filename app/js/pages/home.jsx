import React from 'react';
import {Navigation} from 'react-router';
import {getGenres, getFoods} from '../cloud';  // Connect back-end
import '../../css/home.scss'; // Import inline style
import cookie from 'cookie-cutter'; 
import _ from 'underscore'; 
import history from '../components/history.js';


const GenreList = React.createClass({
	_getGoods(){
		this.props._getGoods(this.props.item.id);
	},
	render(){
		return(
			<li className={this.props.active_id == this.props.item.id ? 'active' : ''} onClick={this._getGoods}>
				{this.props.item.name}
			</li>
		)
	}
});

const GoodsList = React.createClass({
	count: 0,
	getInitialState(){
	    return {
	    	count: 0,
	    };
	},
	componentWillMount() {
		let _item = _.findWhere(this.props.cart,{id: this.props.item.id});
	    this.setState({
	    	count: _item ? _item.count : 0 , 
	    });
	    this.count = _item ? _item.count : 0;
	    
	},
	_addCart(){
		this.setState({
			count: this.state.count+1,
		});
		++this.count;
		this.props._addCart({name: this.props.item.name, price: this.props.item.price,id: this.props.item.id,count: this.count});
	},
	_removeCart(){
		this.setState({
			count: this.state.count-1,
		});
		--this.count;
		if(this.count > -1){
			this.props._removeCart({title: this.props.item.title, price: this.props.item.price,id: this.props.item.id,count: this.count});
		}
	},
	render(){
		return(
			<li>
				<div className="list-img">

				</div>
				<div className="list-content">
					<h4 className="title">{this.props.item.name}</h4>
					<p className="description">{this.props.item.desc}</p>
					<p className="price">￥{this.props.item.price}</p>
					<div className="add">
						{
							this.state.count == 0 ?
							null
							:
							<button className="btn" onClick={this._removeCart}><i className="zmdi zmdi-minus"></i></button>
						}
						{
							this.state.count == 0 ?
							null
							:
							<span className="item-count">{this.state.count}</span>
						}
						<button className="btn" onClick={this._addCart}><i className="zmdi zmdi-plus"></i></button>
					</div>
				</div>


			</li>
			
		)
	}
});

const Home = React.createClass({
	cart: [],
	getInitialState() {
	    return {
	        username: null,
	        count: 0,
	        total: 0,
	        genreList: [],
	        goodsList: [],
	        currentFoods: [],
	        active_id: '',
	        loadCompleted: false,
	    };
	},
	componentWillMount() {
		let self = this;
		getGenres((genres)=>{
			self.setState({
				genreList: genres.genres,
			});
		});
		getFoods('', true, (data)=>{
	        this.setState({
	      	  	username: cookie.get('username'),
	      	  	goodsList: data.foods,
	      	  	currentFoods: data.foods,
	      	  	loadCompleted: true,
	        });
		});
        this.cart = cookie.get('cart') ? JSON.parse(cookie.get('cart')) : [];
        this.setState({
        	total: _.reduce(this.cart, function(memo, item){ return memo + item.price * item.count; }, 0).toFixed(2),
        	count: _.reduce(this.cart, function(memo, item){ return memo + item.count; }, 0),
        });
	},
	_buy(){
		cookie.set('cart',JSON.stringify(this.cart));
		cookie.set('total',this.state.total);
		cookie.set('count',this.state.count);
		if(cookie.get('account') != '' && cookie.get('status') == 'success'){
			history.replaceState(null, '/order');
		}else{
			history.replaceState(null, '/login');
		}
	},
	_getGoods(id){
		let self = this;
		this.setState({
			currentFoods: id == '' ? this.state.goodsList : _.where(this.state.goodsList, {genreId: id.toString()}),
			active_id: id,
		});
	},
	_addCart(item){
		let _item = _.findWhere(this.cart,{id: item.id});
		let total, count;
		if(_item){
			_item.count = item.count;
		}else{
			this.cart.push(item);
		}
		this.setState({
			total: _.reduce(this.cart, function(memo, item){ return memo + item.price * item.count; }, 0),
			count: _.reduce(this.cart, function(memo, item){ return memo + item.count; }, 0),
		});
	},
	_removeCart(item){
		if(item.count == 0){
			this.cart = _.reject(this.cart,(_item)=>{
				return _item.id == item.id; 
			});
		}else{
			_.findWhere(this.cart,{id: item.id}).count = item.count;
		}
		this.setState({
			total: _.reduce(this.cart, function(memo, item){ return memo + item.price * item.count; }, 0),
			count: _.reduce(this.cart, function(memo, item){ return memo + item.count; }, 0),
		});
	},
	_back(){
		this.goBack();
	},
    render() {
        return (
            <div className="home">
            	<header>
	            	<div className="nav">
	            		<span className="back">
	            			<i className="zmdi zmdi-chevron-left"></i>返回
	            		</span>
	            		<span className="title">
	            			<span>同济早餐</span>
	            		</span>
	            	</div>
            	</header>
            	<section className="wrap">
            		<div className="genre">
            			<ul className="genre-list">
							<li className={this.state.active_id == '' ? 'active' : ''} onClick={()=>{this._getGoods('')}}>
								全部
							</li>
            				{this.state.genreList.map((item)=>{return <GenreList item={item} active_id={this.state.active_id} _getGoods={this._getGoods} />})}
            			</ul>
            		</div>

            		<div className="goods">
            			<ul className="goods-list">
            				{this.state.currentFoods.map((item)=>{return <GoodsList item={item} _addCart={this._addCart} cart={this.cart} _removeCart={this._removeCart} />})}
            			</ul>
            		</div>
            	</section>
            	<footer>
            		<ul className="container">
	            		<li className="cart">
	            			<i className="zmdi zmdi-shopping-cart"></i>
	            			<em className="cart-count" style={{visibility :this.state.count ? 'visible' : 'hidden'}}>{this.state.count}</em>
	            		</li>
	            		<li className="total">
	            			<span className="price">
            				共 <b>￥{this.state.total}</b> 元
            				</span>
	            		</li>
	            		<li>
		        			<button className="buy" onClick={this._buy} disabled={!(this.state.count ? true : false) || !(this.state.loadCompleted)}>
			        			选好了
		        			</button>
	        			</li>
            		</ul>

            	</footer>
            </div>


        );
    }
});

export default Home;
