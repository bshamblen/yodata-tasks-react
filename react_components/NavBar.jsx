import React from 'react';
import YodataLoginButton from './YodataLoginButton.jsx';

module.exports = React.createClass({
	displayName: 'NavBar',
	propTypes: {
		clientId: React.PropTypes.string.isRequired,
		scopes: React.PropTypes.string.isRequired,
		onUserStateChange: React.PropTypes.func.isRequired
	},
	handleUserStateChange(loggedIn) {
		this.props.onUserStateChange(loggedIn);
	},
	render() {
		return (
			<nav role="navigation" className="navbar navbar-inverse">
				<div className="container-fluid">
					<div className="navbar-header">
						<button type="button" data-toggle="collapse" data-target="#yd-navbar-collapse-secure" className="navbar-toggle collapsed" style={{borderColor: 'white', color: 'white'}}>
							<span className="sr-only">Toggle navigation</span>
							<i className="fa fa-bars"></i>
						</button>
						<a href="https://yodata.io" className="navbar-brand" target="_blank"><img className="yd-brand-logo"></img> Yodata Tasks</a>
					</div>
					<div id="yd-navbar-collapse-secure" className="collapse navbar-collapse">
						<ul className="nav navbar-nav navbar-right">
							<li style={{paddingLeft:'15px'}}><YodataLoginButton clientId={this.props.clientId} scopes={this.props.scopes} onUserStateChange={this.handleUserStateChange}/></li>
						</ul>
					</div>
				</div>
			</nav>
		);
	}
});
