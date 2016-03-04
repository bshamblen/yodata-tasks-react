/** @jsx React.DOM */

var React = require('react');
var Modal = require('react-bootstrap').Modal;
var Button = require('react-bootstrap').Button;
var Alert = require('react-bootstrap').Alert;
var LoadingSpinner = require('./LoadingSpinner.jsx');
var _ = require('underscore');
require('./underscore_mixins.jsx');
var utils = require('./utils.jsx');
var dataChangeEmitter = require('./DataChangeEmitter.js');

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
		var doc = {};
		doc.title = $('#title').val();
		doc.priority = $('#priority').val();
		doc.dueDate = $('#dueDate').val();
		doc.notes = $('#notes').val();
		doc.completed = $('#completed').is(':checked');
		doc.tags = $('#tags').tagsinput('items');
		var completedDate = $('#completedDate').val();
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
		var self = this;

		self.setState({saving: true}, function() {
			self.clearValidationErrors();
			var doc = self.buildDocFromForm();

			if (self.props.task) {
				self.updateTask(doc);
			} else {
				doc.deleted = false;
				self.insertTask(doc);
			}
		});
	},
	displayValidationErrors(errors) {
		var keys = Object.keys(errors);

		for (var index = 0; index < keys.length; index++) {
			var key = keys[index];
			$('#' + key).parent().addClass('has-error');
			$('#' + key).siblings('.error-message').text(errors[key].message);
		}
	},
	insertTask(task) {
		var self = this;

		this.props.api.insert('yodata.task', task, function(err, result) {
			self.setState({saving: false});

			if (err) {
				if (err.error && err.error.name === 'ValidationError') {
					self.displayValidationErrors(err.error.errors);
				} else {
					self.setState({error: err});
				}
			} else {
				dataChangeEmitter.emit('event');
				self.props.onClose();
			}
		});
	},
	updateTask(updatedTask) {
		var self = this;
		var updateStatment = utils.buildMongoDbUpdate(_.omit(this.props.task, 'objectId', 'createdAt', 'modifiedAt', 'deleted', 'files'), updatedTask);

		this.props.api.update('yodata.task', this.props.task.objectId, updateStatment, function(err, result) {
			if (err) {
				if (err.error && err.error.name === 'ValidationError') {
					self.displayValidationErrors(err.error.errors);
				} else {
					self.setState({error: err});
				}
			} else {
				dataChangeEmitter.emit('event');
				self.props.onClose();
			}
		});
	},
	onEntered() {
		this.setState({error: null, saving: false});

		if (this.props.show) {
			$('#tags').tagsinput();
			$('#tags').on('beforeItemAdd', function(event) {
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
		var hasTask = this.props.task ? true : false;
		var modalTitle = hasTask? 'Edit Task' : 'Insert Task';
		var errorAlert = '';

		if (this.state.error) {
			errorAlert = <Alert bsStyle="warning" onDismiss={this.clearError}><p>{this.state.error.error.name}: {this.state.error.error.message}</p></Alert>;
		}

		var commonProps = {autoComplete: 'off', autoCorrect: 'off', spellCheck: 'false'};

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
