import React from 'react';
import {History, State} from 'react-router';

import '../css/main.css';

const Component = React.createClass({
	mixins: [History, State],
	render(){
		return(
			<div className="component">
				Hello Component2!!!
			</div>	
		);
	}
});

export default Component;