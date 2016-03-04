import React from 'react';
import dataChangeEmitter from './DataChangeEmitter.js';
import {Button} from 'react-bootstrap';

module.exports = React.createClass({
	displayName: 'TaskCompleteButton',
	propTypes: {
		api: React.PropTypes.object.isRequired,
		task: React.PropTypes.object.isRequired
	},
	handleButtonClick() {
		let task = this.props.task;

		if (task.deleted) {
			let query = {$set: {deleted: false}};

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

let updateCallback = (err, results) => {
	if (err) {
		dataChangeEmitter.emit('error', err);
	} else {
		dataChangeEmitter.emit('event');
	}
}
