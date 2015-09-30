import React from 'react/addons';
import '../../css/login.scss';
import {login, register} from '../cloud';
import cookie from 'cookie-cutter';
import _ from 'underscore';

const Login = React.createClass({
	mixins: [React.addons.LinkedStateMixin],
	getInitialState() {
	    return {
	      	username: null,
	      	password: null,
	      	passwordConfirm: null,
	      	username_message: null,
	      	password_message: null,
	      	passwordConfirm_message: null,
	      	loginCompleted: true,
	    };
	},
	login(username,password){
		let self = this;
		login(username, password, (data)=>{
			if(data.status == 'success'){
				for (let key in data['user']){
					if(data['user'][key] == 'null' || data['user'][key] == null){
						data['user'][key] = ''
					}
				}
	            let account = {
	            	gender: data['user']['gender'],
	            	room: data['user']['room'],
	            	floor: data['user']['floor'] == '' ? '西南一' : data['user']['floor'],
	            	name: data['user']['name'],
	            	phone: data['user']['phone'],
	            }
	            cookie.set('username', data['user']['username']);
	            cookie.set('token', data['user']['token']);
	            cookie.set('authority', data['user']['authority']);
	            cookie.set('account', JSON.stringify(account));
	            cookie.set('status','success');
	            console.log('log in!');
	            this.props.history.pushState(null, '/order');
			}else if(data.status == 'error' && data.code == 211){
				register(username, password ,(data)=>{
					if(data.status == 'success'){
			            cookie.set('username',username);
			            cookie.set('status','success');
			            cookie.set('authority', data['user']['authority']);
			            cookie.set('token', data['user']['token']);
			            cookie.set('account', '{}');
			            console.log('sign up!');
			            this.props.history.pushState(null, '/order');
					}else{
			      		self.setState({
			      			password_message: '请确保网络正常连接!',
			      			password: null,
			      			passwordConfirm: null,
			      			loginCompleted: true,
			      		});
					}
				});
			}else if(data.code == 201){
	      		self.setState({
	      			password_message: '账号或者密码错误!',
	      			password: null,
	      			passwordConfirm: null,
	      			loginCompleted: true,
	      		});
			}else{
	      		self.setState({
	      			password_message: '请确保网络正常连接!',
	      			password: null,
	      			passwordConfirm: null,
	      			loginCompleted: true,
	      		});
			}
		})
	},
	checkOut(){
		if(this._checkUserName() && this._checkPassword() && this._verifyPassword()){
			return true;
		}else{
			return false;
		}
	},
	_checkUserName(){
		let username = this.state.username;
		if(username && username.length == 7 && _.isFinite(username)){
			this.setState({
				username_message: null,
			});
			return true;
		}else if(!(_.isFinite(username))){
			this.setState({
				username_message: '学号应为纯数字!',
			});
			return false;
		}else{
			this.setState({
				username_message: '学号应为7位!',
			});
			return false;
		}
	},
	_checkPassword(){
		let password = this.state.password;
		if(password && password.length == 6 && _.isFinite(password)){
			this.setState({
				password_message: null,
			});
			return true;
		}else if(!(_.isFinite(password))){
			this.setState({
				password_message: '密码应为纯数字!',
			});
			return false;
		}else{
			this.setState({
				password_message: '密码应为6位!',
			});
			return false;
		}
	},
	_verifyPassword(){
		let passwordConfirm = this.state.passwordConfirm;
		if(passwordConfirm && passwordConfirm.length == 6 && passwordConfirm == this.state.password){
			this.setState({
				passwordConfirm_message: null,
			});
			return true;
		}else if(passwordConfirm != this.state.password){
			this.setState({
				passwordConfirm_message: '上下密码不同!',
			});
			return false;
		}else{
			this.setState({
				passwordConfirm_message: '密码应为6位!',
			});
			return false;
		}
	},
	_handleForm(e){
		e.preventDefault();
		if(!this.checkOut()){
			return ;
		}
		this.setState({loginCompleted: false});
		this.login(this.state.username,this.state.password);
	},
	_back(){
		this.props.history.pushState({}, `/home/`, null);
	},
	render(){
		return(
        	<section>
            	<div className="loginbox" style={{marginLeft: 0}}>
					<form onSubmit={this._handleForm} className="login-form">
			            <h4>登陆</h4>
			          	<div className="col-xs-12">
				          <input
					        type="text"
				          	onBlur={this._checkUserName}
				          	valueLink={this.linkState('username')}
				          	placeholder="学号"
				      	  />
				      	  <p className="messageBox">{this.state.username_message}</p>
				      	</div>

				      	<div className="col-xs-12">
				          <input
					        type="password"
				          	onBlur={this._checkPassword}
				          	valueLink={this.linkState('password')}
				          	placeholder="密码"
				      	  />
				      	  <p className="messageBox">{this.state.password_message}</p>
				        </div>  

				        <div className="col-xs-12">
				          <input
					        type="password"
				          	onBlur={this._verifyPassword}
				          	valueLink={this.linkState('passwordConfirm')}
				          	placeholder="请再次输入密码"
				      	  />
				      	  <p className="messageBox">{this.state.passwordConfirm_message}</p>
				      	</div>
				      	<div>
				      	    <div className="buttonGroup">
				      	  	  <button className="left" type="button" onClick={this._back}>返回</button>
				      	    </div>
				      	    <div className="buttonGroup">
				      	  	  <button className="right" type="submit" disabled={!this.state.loginCompleted}>{this.state.loginCompleted ? '登陆' : '登陆中...'}</button>
				      	    </div>
			      	    </div>
		          </form>
        		</div>
        	</section>
		);
	},
})

export default Login ;