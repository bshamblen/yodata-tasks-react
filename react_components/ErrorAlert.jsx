import React from 'react';
import {Alert} from 'react-bootstrap';
import dataChangeEmitter from './DataChangeEmitter.js';

module.exports = React.createClass({
	displayName: 'ErrorAlert',
	getInitialState() {
		return {
			error: null,
			timeout: null,
		}
	},
	componentDidMount() {
		this.emitter = dataChangeEmitter.addListener('error', (err) => {
			let timeout = setTimeout(function() {
				this.setState({error: null});
			}, 8000);

			this.setState({error: err, timeout: timeout});
		});
	},
	componentWillUnmount() {
		this.emitter.remove();

		if (this.timeout) {
			clearTimeout(this.timeout);
		}
	},
	clearError() {
		this.setState({error: null});
	},
	render() {
		if (this.state.error) {
			return (
				<Alert bsStyle="warning" onDismiss={this.clearError}>
					<p>{this.state.error.error.name}: {this.state.error.error.message}</p>
				</Alert>
			);
		} else {
			return null;
		}
	}
});
