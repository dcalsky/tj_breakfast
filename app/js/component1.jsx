import React from 'react';
import {History, State} from 'react-router';

import '../css/main.css';

const Component = React.createClass({
	mixins: [History, State],
	render(){
		return(
			<div className="component">
				Hello WebPack!!!
				<button onClick={()=>{this.history.pushState({state: 'asd'}, `/com2/`, null);}}>
					transition
				</button>
			</div>	
		);
	}
});

export default Component;