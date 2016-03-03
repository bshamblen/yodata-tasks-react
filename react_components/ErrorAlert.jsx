/** @jsx React.DOM */

var React = require('react');
var Alert = require('react-bootstrap').Alert;
var dataChangeEmitter = require('./DataChangeEmitter.js');

module.exports = React.createClass({
	displayName: 'ErrorAlert',
	getInitialState() {
		return {
			error: null,
			timeout: null,
		}
	},
	componentDidMount() {
		var self = this;

		this.emitter = dataChangeEmitter.addListener('error', function(err) {
			var timeout = setTimeout(function() {
				self.setState({error: null});
			}, 8000);

			self.setState({error: err, timeout: timeout});
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
			return (
				<span></span>
			);
		}
	}
});
