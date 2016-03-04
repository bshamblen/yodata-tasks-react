/** @jsx React.DOM */

var React = require('react');
var dataChangeEmitter = require('./DataChangeEmitter.js');
var Button = require('react-bootstrap').Button

module.exports = React.createClass({
	displayName: 'TaskCompleteButton',
	propTypes: {
		api: React.PropTypes.object.isRequired,
		task: React.PropTypes.object.isRequired
	},
	handleButtonClick() {
		var task = this.props.task;

		if (task.deleted) {
			var query = {$set: {deleted: false}};

			this.props.api.update('yodata.task', task.objectId, query, updateCallback);
		} else {
			this.props.api.update('yodata.task', task.objectId, {$set: {completed: !task.completed}}, updateCallback);
		}
	},
	render() {
		if (this.props.task.deleted) {
			return (
				<Button bsStyle="default" title="Undelete" onClick={this.handleButtonClick}>
					<i className="fa fa-undo"></i>
				</Button>
			);
		} else {
			return (
				<Button bsStyle={this.props.task.completed ? 'success' : 'default'} onClick={this.handleButtonClick}>
					<i className="fa fa-check"></i>
				</Button>
			);
		}
	}
});

function updateCallback(err, results) {
	if (err) {
		dataChangeEmitter.emit('error', err);
	} else {
		dataChangeEmitter.emit('event');
	}
}
