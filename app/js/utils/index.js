import _ from 'underscore';

let Utils = {
	foodFliter(foods){
		let _foods = [];
		_.map(foods, (food)=>{
			if(_.findWhere(_foods, {foodId: food['foodId']})){
				_.map(_foods, (_food)=>{
					if(_food['foodId'] == food['foodId']){
						_food['count'] ++;
					}
				});
			}else{
				food['count'] = 1;
				_foods.push(food);
			}
		});
		return _foods;
	}
};

export default Utils;