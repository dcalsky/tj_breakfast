const URL = 'http://localhost:8000';

let Cloud = {
	login(username, password, callback){
	    fetch(URL + '/users/login', {
	    	method: 'post',
			headers: {
			    'Accept': 'application/json',
			    'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username: username,
				password: password
			})
	    }).then((data)=>{
	    	return data.json();
	    }).then((resp)=>{
	    	callback(resp)
	    }).catch((err)=>{
	    	callback(err)
	    })
	},
	register(username, password, callback){
	    fetch(URL + '/users/register', {
	    	method: 'post',
			headers: {
			    'Accept': 'application/json',
			    'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username: username,
				password: password,
			})
	    }).then((data)=>{
	    	return data.json();
	    }).then((resp)=>{
	    	callback(resp)
	    }).catch((err)=>{
	    	callback(err)
	    })
	},
	getFoods(genreId, all, callback){
	    fetch(URL + '/foods/get?genreId='+ genreId + '&all=' + all, {
	    	method: 'GET',
			headers: {
			    'Accept': 'application/json',
			    'Content-Type': 'application/json'
			},
	    }).then((data)=>{
	    	return data.json();
	    }).then((resp)=>{
	    	callback(resp)
	    }).catch((err)=>{
	    	callback(err)
	    })
	},
	getGenres(callback){
	    fetch(URL + '/genres/get', {
	    	method: 'GET',
			headers: {
			    'Accept': 'application/json',
			    'Content-Type': 'application/json'
			},
	    }).then((data)=>{
	    	return data.json();
	    }).then((resp)=>{
	    	callback(resp)
	    }).catch((err)=>{
	    	callback(err)
	    })
	},
	createOrder(username, token, order, callback){
	    fetch(URL + '/orders/create', {
	    	method: 'POST',
			headers: {
			    'Accept': 'application/json',
			    'Content-Type': 'application/json'
			},
			body: JSON.stringify({
	      		username: username,
	      		room: order['room'],
	      		floor: order['floor'],
	      		name: order['name'],
	      		gender: order['gender'],
	      		token: order['token'],
	      		phone: order['phone'],
	      		foods: order['foods'],
	      		startDate: order['startDate'],
	      		marks: order['marks'],
			})
	    }).then((data)=>{
	    	return data.json();
	    }).then((resp)=>{
	    	callback(resp)
	    }).catch((err)=>{
	    	callback(err)
	    })
	},
	getUserOrders(username, token, callback){
	    fetch(URL + '/users/getUserOrders', {
	    	method: 'GET',
			headers: {
			    'Accept': 'application/json',
			    'Content-Type': 'application/json'
			},
			body: JSON.stringify({
	      		username: username,
			})
	    }).then((data)=>{
	    	return data.json();
	    }).then((resp)=>{
	    	callback(resp)
	    }).catch((err)=>{
	    	callback(err)
	    });
	}

}

module.exports = Cloud ;