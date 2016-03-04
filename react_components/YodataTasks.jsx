import React from 'react';
import globals from './globals.jsx';
import NavBar from './NavBar.jsx';
import UserAvatar from './UserAvatar.jsx';
import FilterableTaskList from './FilterableTaskList.jsx';
import dataChangeEmitter from './DataChangeEmitter.js';

module.exports = React.createClass({
	displayName: 'YodataTasks',
	getInitialState() {
		let loggedIn = localStorage.getItem(globals.YD_AUTH_TOKEN) ? true : false;

		return {
			profile: null,
			api: (loggedIn ? new YDClient({authToken: localStorage.getItem(globals.YD_AUTH_TOKEN)}) : null)
		}
	},
	componentDidMount() {
		if (this.state.api) {
			this.state.api.userProfile((err, results) => {
				if (err) {
					dataChangeEmitter.emit('error', err);
				} else if (results) {
					this.setState({profile: results.profile});
				}
			});
		}
	},
	handleUserStateChange(loggedIn) {
		if (loggedIn) {
			this.setState({
				api: new YDClient({authToken: localStorage.getItem(globals.YD_AUTH_TOKEN)}),
				profile: null
			});
		} else {
			this.setState({
				api: null,
				profile: null
			});
		}
	},
	render() {
		return (
			<div>
				<NavBar clientId={globals.clientId} scopes={globals.scopes} api={this.state.api} onUserStateChange={this.handleUserStateChange} />
				<div className="container">
					<UserAvatar profile={this.state.profile}/>
					{this.state.api ? <FilterableTaskList api={this.state.api} /> : null}
				</div>
			</div>
		);
	}
});