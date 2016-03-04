import React from 'react';
import {Modal, Button} from 'react-bootstrap';
import dataChangeEmitter from './DataChangeEmitter.js';
import LoadingSpinner from './LoadingSpinner.jsx';

module.exports = React.createClass({
	displayName: 'TaskDeleteModal',
	propTypes: {
		api: React.PropTypes.object.isRequired,
		task: React.PropTypes.object.isRequired,
		showModal: React.PropTypes.func.isRequired
	},
	getInitialState() {
		return {
			deleting: false
		};
	},
	hideModal() {
		this.props.showModal(false);
	},
	softDeleteTask() {
		let query = {$set: {deleted: true}};
		this.props.api.update('yodata.task', this.props.task.objectId, query, apiCallback);
	},
	handleButtonClick() {
		let task = this.props.task;

		if (task.deleted) {
			this.props.api.remove('yodata.task', task.objectId, apiCallback);
		} else {
			this.softDeleteTask();
		}
	},
	render() {
		let task = this.props.task;

		return (
			<Modal.Dialog show={this.state.show} dialogClassName="text-left">
				<div className="modal-content panel-danger">
					<Modal.Header className="panel-heading" onHide={this.hideModal}>
						<button type="button" className="close" onClick={this.hideModal}>x</button>
						<Modal.Title>{task.deleted ? 'Hard' : 'Soft' } Delete Task?</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<p>Would you like to delete the task titled:</p>
						<p className="text-danger"><strong>{task.title}</strong></p>
					</Modal.Body>
					<Modal.Footer>
						<Button bsStyle="default" onClick={this.hideModal}>Cancel</Button>
						<Button bsStyle="danger" onClick={this.handleButtonClick}>Delete</Button>
						<LoadingSpinner className="pull-right" show={this.state.deleting} />
					</Modal.Footer>
				</div>
			</Modal.Dialog>
		);
	}
});

let apiCallback = (err, results) => {
	if (err) {
		dataChangeEmitter.emit('error', err);
	} else {
		dataChangeEmitter.emit('event');
	}
}
