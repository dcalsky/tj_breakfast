import React from 'react';
import '../../css/loading.scss';

const Loading = React.createClass({
    render(){
        return(
            <div className="loading">
                <div className="title">
                    {this.props.title ? this.props.title : 'LOADING ...'}
                </div>
            </div>

        );
    }
});

export default Loading;