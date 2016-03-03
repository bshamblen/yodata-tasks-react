/** @jsx React.DOM */

var React = require('react');
var Modal = require('react-bootstrap').Modal;
var Button = require('react-bootstrap').Button;
var Alert = require('react-bootstrap').Alert;
var FileListItem = require('./FileListItem.jsx');
var dataChangeEmitter = require('./DataChangeEmitter.js');

module.exports = React.createClass({
	displayName: 'TaskAttachmentsModal',
	propTypes: {
		onClose: React.PropTypes.func.isRequired,
		show: React.PropTypes.bool.isRequired,
		api: React.PropTypes.object,
		task: React.PropTypes.object
	},
	getInitialState() {
		return {
			loading: false,
			saving: false,
			files: [],
			error: null
		}
	},
	hideModal() {
		this.props.onClose();
	},
	selectFile(isPublic) {
		this.setState({error: null});
		$('#isPublic').val(isPublic);
		$('.fileInput').click();
	},
	reloadFileList() {
		var self = this;
		self.setState({loading: true});

		var options = {
			fields: 'files',
			populate: {
				path: 'files'
			} 
		};

		self.props.api.findById('yodata.task', self.props.task.objectId, options, function(err, results) {
			if (err) {
				self.setState({error: err, loading: false});
			} else {
				self.setState({files: results.files, loading: false});
			}
		});
	},
	handleFileDownload(file) {
		var self = this;

		if (file.isPublic && file.publicFileUrl) {
			document.location.href = file.publicFileUrl;
		} else {
			self.setState({error: null, loading: true});

			this.props.api.generateDownloadUrlForPrivateFileById(file.objectId, function(err, url) {
				if (err) {
					self.setState({error: err, loading: false});
				} else {
					window.location.href = url;
					self.setState({loading: false});
				}
			});
		}
	},
	handleFileDelete(file) {
		var self = this;
		var task = self.props.task;
		var updateStatement = {
			$pull: {
				files: file.objectId
			}
		}

		self.setState({saving: true});

		self.props.api.update('yodata.task', task.objectId, updateStatement , function(err, results) {
			if (err) {
				self.setState({error: err, saving: false});
			} else {
				self.props.api.remove('files', file.objectId, function(err, results) {
					if (err) {
						self.setState({error: err, saving: false});
					} else {
						self.setState({saving: false});
						self.reloadFileList();
						dataChangeEmitter.emit('event');
					}
				});
			}
		});
	},
	onEntered() {
		var self = this;
		var task = self.props.task;
		self.reloadFileList();

		$('.fileInput').change(function(event) {
			self.setState({saving: true});
			var file = event.target.files[0];
			var formData = new FormData();
			formData.append(file.name, file);
			formData.append('isPublic', $("#isPublic").val());

		    self.props.api.uploadFile(formData, function(err, result) {
		    	if (err) {
		    		self.setState({error: err});
		    	} else {
					self.props.api.update('yodata.task', task.objectId, {$push: {files: result.objectId}}, function(err, result) {
						if (err) {
							self.setState({error: err, saving: false});
						} else {
							self.setState({saving: false});
							self.reloadFileList();
							dataChangeEmitter.emit('event');
						}
					});
		    	}
		    })
		});
	},
	onExited() {
		this.setState({
			loading: false,
			saving: false,
			files: [],
			error: null
		});
	},
	render() {
		var self = this;
		var errorAlert = '';

		if (this.state.error) {
			errorAlert = <Alert bsStyle="warning" onDismiss={this.clearError}><p>{this.state.error.error.name}: {this.state.error.error.message}</p></Alert>;
		}

		var spinnerClasses = 'pull-right fa fa-circle-o-notch fa-spin fa-2x' + (!this.state.saving && !this.state.loading ? ' hidden' : '');

		var fileList = this.state.files.map(function(file) {
			return (
				<FileListItem
					key={file.objectId}
					api={self.props.api}
					task={self.props.task}
					file={file}
					onDelete={self.handleFileDelete}
					onDownload={self.handleFileDownload}
				/>
			);
		});

		if (fileList.length === 0) {
			fileList = <li className="list-group-item">This task currently has no attachments. Click one of the buttons below to attach a file to this task.</li>;
		}

		return (
			<Modal show={this.props.show} onEntered={this.onEntered}>
				<Modal.Header onHide={this.hideModal}>
					<button type="button" className="close" onClick={this.hideModal}>x</button>
					<Modal.Title>Attachments</Modal.Title>
				</Modal.Header>
				{errorAlert}
				<ul className="list-group" style={{marginBottom: '-1px', marginTop: '-1px'}}>
  					{fileList}
				</ul>
				<Modal.Footer>
					<form className="text-left" style={{margin:0}}>
						<input type="file" className="fileInput" style={{display:'none', visibility:'hidden', width:'1px'}}/>
						<input type="hidden" id="isPublic"/>
    					<Button bsStyle="primary" onClick={this.selectFile.bind(this, false)}>Add Private File</Button>
    					<Button bsStyle="warning" onClick={this.selectFile.bind(this, true)}>Add Public File</Button>
    					<i className={spinnerClasses}></i>
					</form>
				</Modal.Footer>
			</Modal>
		);
	}	
});
