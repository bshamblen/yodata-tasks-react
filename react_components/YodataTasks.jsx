/** @jsx React.DOM */

var React = require('react');
var globals = require('./globals.jsx');
var NavBar = require('./NavBar.jsx');
var UserAvatar = require('./UserAvatar.jsx');
var FilterableTaskList = require('./FilterableTaskList.jsx');
var dataChangeEmitter = require('./DataChangeEmitter.js');

module.exports = React.createClass({
	displayName: 'YodataTasks',
	getInitialState() {
		var loggedIn = localStorage.getItem(globals.YD_AUTH_TOKEN) ? true : false;

		return {
			loggedIn: loggedIn,
			profile: null,
			api: (loggedIn ? new YDClient({authToken: localStorage.getItem(globals.YD_AUTH_TOKEN)}) : null)
		}
	},
	componentDidMount() {
		if (this.state.api) {
			var self = this;

			this.state.api.userProfile(function(err, results) {
				if (err) {
					dataChangeEmitter.emit('error', err);
				} else if (results) {
					self.setState({
						profile: results.profile
					});
				}
			});
		}
	},
	handleUserStateChange(loggedIn) {
		if (loggedIn) {
			this.setState({
				loggedIn: loggedIn,
				api: new YDClient({authToken: localStorage.getItem(globals.YD_AUTH_TOKEN)}),
				profile: null
			});
		} else {
			this.setState({
				loggedIn: loggedIn,
				api: null,
				profile: null
			});
		}
	},
	render() {
		var taskList = (this.state.api ? <FilterableTaskList api={this.state.api} /> : <span></span>);

		return (
			<div>
				<NavBar clientId={globals.clientId} scopes={globals.scopes} api={this.state.api} onUserStateChange={this.handleUserStateChange} />
				<div className="container">
					<UserAvatar profile={this.state.profile}/>
					{taskList}
				</div>
			</div>
		);
	}
});