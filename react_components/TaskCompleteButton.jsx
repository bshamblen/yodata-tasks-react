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

			this.props.api.update('yodata.task', task.objectId, query, function(err, results) {
				if (err) {
					dataChangeEmitter.emit('error', err);
				} else {
					dataChangeEmitter.emit('event');
				}
			});
		} else {
			this.props.api.update('yodata.task', task.objectId, {$set: {completed: !task.completed}}, function(err, results) {
				if (err) {
					dataChangeEmitter.emit('error', err);
				} else {
					dataChangeEmitter.emit('event');
				}
			});
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
			var buttonClasses = this.props.task.completed ? 'success' : 'default';

			return (
				<Button bsStyle={buttonClasses} onClick={this.handleButtonClick}>
					<i className="fa fa-check"></i>
				</Button>
			);
		}
	}
});
