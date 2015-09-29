import React from 'react';

const Layout = React.createClass({
	render(){
		return(
			<div>{this.props.children}</div>
		);
	}
});

export default Layout;