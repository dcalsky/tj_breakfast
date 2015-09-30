import React from 'react';
import '../../css/loader.scss';

const Loader = React.createClass({
    render(){
        return(
            <div className="loader">
                <div className="title">
                    {this.props.title ? this.props.title : 'LOADING ...'}
                </div>
            </div>

        );
    }
});

export default Loader;