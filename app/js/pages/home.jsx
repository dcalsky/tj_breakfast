import React from 'react';
import {getGenres, getFoods} from '../cloud';  // Connect back-end
import '../../css/home.scss'; // Import inline style
import cookie from 'cookie-cutter'; 
import _ from 'underscore';
import Loading from '../components/loading.jsx';

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
	getInitialState(){
	    return {
	    	count: 0
	    };
	},
	componentWillMount() {
        this.setState({
            count: this.props.cart.foods[this.props.item.id] ? this.props.cart.foods[this.props.item.id] : 0,
        });
	},
	_addCart(){
        let _count = this.state.count + 1;
		this.setState({
			count: _count,
		});
		this.props._addCart({name: this.props.item.name, price: this.props.item.price,id: this.props.item.id,count: _count});
	},
	_removeCart(){
        if(this.state.count > 0){
            let _count = this.state.count - 1;
            this.setState({
                count: _count,
            });
            this.props._removeCart({title: this.props.item.title, price: this.props.item.price,id: this.props.item.id,count: _count});
        }
	},
	render(){
		return(
			<li>
				<div className="list-img"></div>
				<div className="list-content">
					<h4 className="title">{this.props.item.name}</h4>
					<p className="description">{this.props.item.desc}</p>
					<p className="price">￥{this.props.item.price}</p>
					<div className="add">
						{
							this.state.count == 0 ?
							null
							:
							<button className="min-button" onClick={this._removeCart}><i className="zmdi zmdi-minus"></i></button>
						}
						{
							this.state.count == 0 ?
							null
							:
							<span className="item-count">{this.state.count}</span>
						}
						<button className="plus-button" onClick={this._addCart}><i className="zmdi zmdi-plus"></i></button>
					</div>
				</div>
			</li>
		)
	}
});

const Home = React.createClass({
	getInitialState() {
	    return {
	        genreList: [],
	        goodsList: [],
	        currentFoods: [],
	        active_id: '',
	        loadCompleted: false,
            cart: {
                foods: {},
                total: 0.0,
                count: 0,
            }
	    };
	},
	componentWillMount() {
		let self = this;

        // Find out the storage
        if(!sessionStorage.getItem('goodsList') || !sessionStorage.getItem('genreList')){
            getGenres((genre)=>{
                self.setState({
                    genreList: genre.genres,
                });
                sessionStorage.setItem('genreList', JSON.stringify(genre.genres));
            });
            getFoods('', true, (data)=>{
                this.setState({
                    username: cookie.get('username'),
                    goodsList: data.foods,
                    currentFoods: data.foods,
                    loadCompleted: true
                });
                sessionStorage.setItem('goodsList', JSON.stringify(data.foods))
            });
        }else{
            this.setState({
                goodsList: JSON.parse(sessionStorage.getItem('goodsList')),
                genreList: JSON.parse(sessionStorage.getItem('genreList')),
                currentFoods: JSON.parse(sessionStorage.getItem('goodsList')),
                loadCompleted: true,
            });
        }

        this.setState({
            cart: sessionStorage.getItem('cart') ? JSON.parse(sessionStorage.getItem('cart')) : {
                foods: {},
                total: 0.00,
                count: 0,
            },
        });
	},
	_buy(){
		sessionStorage.setItem('cart',JSON.stringify(this.state.cart));
		if(cookie.get('username') && cookie.get('token') ){
			this.props.history.pushState(null, '/order');
		}else{
			this.props.history.pushState(null, '/login');
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
        /*
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
		*/

        let _foods = this.state.cart.foods;
        // id : count
        _foods[item.id] = _foods[item.id] ?  _foods[item.id] + 1 : 1 ;
        this.setState({
            cart: {
                count: this.state.cart.count + 1,
                total: (parseFloat(this.state.cart.total) + parseFloat(item.price)).toFixed(2),
                foods: _foods,
            }
        });

	},
	_removeCart(item){
        /*
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
		*/
        let _foods = this.state.cart.foods;
        _foods[item.id] = _foods[item.id] ? _foods[item.id] -- : 0;
        this.setState({
            cart: {
                count: this.state.cart.count - 1,
                total: parseFloat(this.state.cart.total - item.price).toFixed(2),
                foods: _foods,
            }
        });
	},
    render() {
        if(this.state.loadCompleted){
            return (
                <div className="home">
                    <header>
                        <div className="nav">
	            		<span className="title">
	            			<span>同济早餐</span>
	            		</span>
	            		<span className="account" onClick={()=>{this.props.history.pushState(null, '/my-order')}}>
	            			<i className="zmdi zmdi-account"></i>
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
                                {this.state.currentFoods.map((item)=>{return <GoodsList item={item} _addCart={this._addCart} cart={this.state.cart} _removeCart={this._removeCart} />})}
                            </ul>
                        </div>
                    </section>
                    <footer>
                        <ul className="container">
                            <li className="cart">
                                <i className="zmdi zmdi-shopping-cart"></i>
                                <em className="cart-count" style={{visibility :this.state.cart.count ? 'visible' : 'hidden'}}>{this.state.cart.count}</em>
                            </li>
                            <li className="total">
	            			<span className="price">
            				共 <b>￥{this.state.cart.total}</b> 元
            				</span>
                            </li>
                            <li>
                                <button className="buy" onClick={this._buy} disabled={this.state.cart.count == 0 ? true : false || !(this.state.loadCompleted)}>
                                    选好了
                                </button>
                            </li>
                        </ul>
                    </footer>
                </div>
            );
        }else{
            return(
                <Loading />
            );
        }

    }
});

export default Home;
