/** @jsx React.DOM */

var React = require('react');
var Modal = require('react-bootstrap').Modal;
var Button = require('react-bootstrap').Button;
var dataChangeEmitter = require('./DataChangeEmitter.js');

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
		var query = {$set: {deleted: true}};

		this.props.api.update('yodata.task', this.props.task.objectId, query, function(err, results) {
			if (err) {
				dataChangeEmitter.emit('error', err);
			} else {
				dataChangeEmitter.emit('event');
			}
		});
	},
	handleButtonClick() {
		var task = this.props.task;

		if (task.deleted) {
			this.props.api.remove('yodata.task', task.objectId, function(err, results) {
				if (err) {
					dataChangeEmitter.emit('error', err);
				} else {
					dataChangeEmitter.emit('event');
				}
			});
		} else {
			this.softDeleteTask();
		}
	},
	render() {
		var spinner = this.state.deleting ? <i class="pull-right fa fa-circle-o-notch fa-spin fa-2x"></i> : '';
		var task = this.props.task;

		return (
			<Modal.Dialog show={this.state.show} dialogClassName="text-left">
				<div className="modal-content panel-danger">
					<Modal.Header className="panel-heading" closeButton onHide={this.hideModal}>
						<Modal.Title>{task.deleted ? 'Hard' : 'Soft' } Delete Task?</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<p>Would you like to delete the task titled:</p>
						<p className="text-danger"><strong>{task.title}</strong></p>
					</Modal.Body>
					<Modal.Footer>
						<Button bsStyle="default" onClick={this.hideModal}>Cancel</Button>
						<Button bsStyle="danger" onClick={this.handleButtonClick}>Delete</Button>
						{spinner}
					</Modal.Footer>
				</div>
			</Modal.Dialog>
		);
	}
});
