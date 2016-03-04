import React from 'react';
import {Modal, Button, Alert} from 'react-bootstrap';
import LoadingSpinner from './LoadingSpinner.jsx';
import _ from 'underscore';
import './underscore_mixins.jsx';
import utils from './utils.jsx';
import dataChangeEmitter from './DataChangeEmitter.js';

module.exports = React.createClass({
	displayName: 'TaskModal',
	propTypes: {
		task: React.PropTypes.object,
		api: React.PropTypes.object.isRequired,
		onClose: React.PropTypes.func.isRequired,
		show: React.PropTypes.bool
	},
	getInitialState() {
		return {
			saving: false,
			error: null
		}
	},
	showAttachmentsModal() {
		this.props.onClose(true);
	},
	clearValidationErrors() {
		$('#generalError').addClass('hidden');
		$('input').parent().removeClass('has-error');
		$('input').siblings('.error-message').text('')
		$('textarea').siblings('.error-message').text('');
	},
	buildDocFromForm() {
		let doc = {};
		doc.title = $('#title').val();
		doc.priority = $('#priority').val();
		doc.dueDate = $('#dueDate').val();
		doc.notes = $('#notes').val();
		doc.completed = $('#completed').is(':checked');
		doc.tags = $('#tags').tagsinput('items');
		let completedDate = $('#completedDate').val();
		doc.completedDate = (doc.completed ? (completedDate.length > 0 ? completedDate : new Date()) : null);

		return _.compactObject(doc);
	},
	hideModal() {
		this.props.onClose();
	},
	clearError() {
		this.setState({error: null});
	},
	saveTask() {
		this.setState({saving: true}, () => {
			this.clearValidationErrors();
			let doc = this.buildDocFromForm();

			if (this.props.task) {
				this.updateTask(doc);
			} else {
				doc.deleted = false;
				this.insertTask(doc);
			}
		});
	},
	displayValidationErrors(errors) {
		let keys = Object.keys(errors);

		for (let index = 0; index < keys.length; index++) {
			let key = keys[index];
			$('#' + key).parent().addClass('has-error');
			$('#' + key).siblings('.error-message').text(errors[key].message);
		}
	},
	insertTask(task) {
		this.props.api.insert('yodata.task', task, (err, result) => {
			this.setState({saving: false});

			if (err) {
				if (err.error && err.error.name === 'ValidationError') {
					this.displayValidationErrors(err.error.errors);
				} else {
					this.setState({error: err});
				}
			} else {
				dataChangeEmitter.emit('event');
				this.props.onClose();
			}
		});
	},
	updateTask(updatedTask) {
		let updateStatment = utils.buildMongoDbUpdate(_.omit(this.props.task, 'objectId', 'createdAt', 'modifiedAt', 'deleted', 'files'), updatedTask);

		this.props.api.update('yodata.task', this.props.task.objectId, updateStatment, (err, result) => {
			if (err) {
				if (err.error && err.error.name === 'ValidationError') {
					this.displayValidationErrors(err.error.errors);
				} else {
					this.setState({error: err});
				}
			} else {
				dataChangeEmitter.emit('event');
				this.props.onClose();
			}
		});
	},
	onEntered() {
		this.setState({error: null, saving: false});

		if (this.props.show) {
			$('#tags').tagsinput();
			$('#tags').on('beforeItemAdd', (event) => {
		  		event.item = event.item.toLowerCase();
		  		return event;
			});

			if (this.props.task) {
				var task = this.props.task;
				$('#title').val(task.title);
				$('#priority').val(task.priority);
				$('#dueDate').val(utils.formatDateString(task.dueDate));
				$('#notes').val(task.notes);
				$('#completed').prop('checked', task.completed);
				$('#completedDate').val(utils.formatDateString(task.completedDate));

				if (task.tags) {
					for (var index = 0; index < task.tags.length; index++) {
						$('#tags').tagsinput('add', task.tags[index]);
					}
				}
			} else {
				$('#priority').val('medium');
			}
		} else {
			$('#tags').tagsinput('destroy');
		}
	},
	render() {
		let hasTask = this.props.task ? true : false;
		let modalTitle = hasTask? 'Edit Task' : 'Insert Task';
		let errorAlert = '';

		if (this.state.error) {
			errorAlert = <Alert bsStyle="warning" onDismiss={this.clearError}><p>{this.state.error.error.name}: {this.state.error.error.message}</p></Alert>;
		}

		let commonProps = {autoComplete: 'off', autoCorrect: 'off', spellCheck: 'false'};

		return (
			<Modal show={this.props.show} onEntered={this.onEntered}>
				<Modal.Header className="panel-heading" onHide={this.hideModal}>
					<button type="button" className="close" onClick={this.hideModal}>x</button>
					<Modal.Title>{modalTitle}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{errorAlert}
					<div className="form-group">
						<label className="control-label" htmlFor="title">Title *</label>
						<input type="text" id="title" className="form-control" {...commonProps}/>
						<div className="help-block error-message has-error"></div> 
					</div>
					<div className="form-group">
						<label className="control-label" htmlFor="tags">Tags</label>
						<input type="text" id="tags" className="form-control" data-role="tagsinput"/>
						<div className="help-block error-message has-error"></div> 
					</div>
					<div className="form-group">
						<label className="control-label" htmlFor="title">Priority</label>
						<select id="priority" className="form-control">
							<option value="high">High</option>
							<option value="medium">Medium</option>
							<option value="low">Low</option>
						</select>
						<div className="help-block error-message has-error"></div> 
					</div>
					<div className="form-group">
						<label className="control-label" htmlFor="title">Due Date</label>
						<input type="date" id="dueDate" className="form-control" {...commonProps}/>
						<div className="help-block error-message has-error"></div> 
					</div>
					<div className="form-group">
						<label className="control-label" htmlFor="title">Notes</label>
						<textarea id="notes" className="form-control" rows="3"></textarea>
						<div className="help-block error-message has-error"></div> 
					</div>
            		<div className="checkbox">
						<label>
							<input type="checkbox" id="completed"/>
							Completed
						</label>
            		</div>
            		<div className="form-group">
						<label className="control-label" htmlFor="title">Completed Date</label>
						<input type="date" id="completedDate" className="form-control" {...commonProps}/>
						<div className="help-block error-message has-error"></div> 
					</div>
            	</Modal.Body>
				<Modal.Footer>
					<Button bsStyle="primary" className="pull-left" onClick={this.saveTask}>{this.props.task ? 'Update' : 'Save'}</Button>
					{hasTask ? <Button bsStyle="default" className="pull-left" onClick={this.showAttachmentsModal}>View/Edit Attachments</Button> : ''}
					<LoadingSpinner className="pull-right" show={this.state.saving} />
				</Modal.Footer>
			</Modal>
		);
	}	
});
