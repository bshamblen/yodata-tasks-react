import React from 'react';
import {Modal, Button, ListGroup, ListGroupItem, Alert} from 'react-bootstrap';
import FileListItem from './FileListItem.jsx';
import dataChangeEmitter from './DataChangeEmitter.js';
import LoadingSpinner from './LoadingSpinner.jsx';

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
		this.setState({loading: true});

		let options = {
			fields: 'files',
			populate: {
				path: 'files'
			} 
		};

		this.props.api.findById('yodata.task', this.props.task.objectId, options, (err, results) => {
			if (err) {
				this.setState({error: err, loading: false});
			} else {
				this.setState({files: results.files, loading: false});
			}
		});
	},
	handleFileDownload(file) {
		if (file.isPublic && file.publicFileUrl) {
			document.location.href = file.publicFileUrl;
		} else {
			this.setState({error: null, loading: true});

			this.props.api.generateDownloadUrlForPrivateFileById(file.objectId, (err, url) => {
				if (err) {
					this.setState({error: err, loading: false});
				} else {
					window.location.href = url;
					this.setState({loading: false});
				}
			});
		}
	},
	handleFileDelete(file) {
		let task = this.props.task;
		let updateStatement = {
			$pull: {
				files: file.objectId
			}
		}

		this.setState({saving: true});

		this.props.api.update('yodata.task', task.objectId, updateStatement , (err, results) => {
			if (err) {
				this.setState({error: err, saving: false});
			} else {
				this.props.api.remove('files', file.objectId, (err, results) => {
					if (err) {
						this.setState({error: err, saving: false});
					} else {
						this.setState({saving: false});
						this.reloadFileList();
						dataChangeEmitter.emit('event');
					}
				});
			}
		});
	},
	onEntered() {
		let task = this.props.task;
		this.reloadFileList();

		$('.fileInput').change((event) => {
			this.setState({saving: true});
			let file = event.target.files[0];
			let formData = new FormData();
			formData.append(file.name, file);
			formData.append('isPublic', $("#isPublic").val());

		    this.props.api.uploadFile(formData, (err, result) => {
		    	if (err) {
		    		this.setState({error: err, saving: false});
		    	} else {
					this.props.api.update('yodata.task', task.objectId, {$push: {files: result.objectId}}, (err, result) => {
						if (err) {
							this.setState({error: err, saving: false});
						} else {
							this.setState({saving: false});
							this.reloadFileList();
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
		let fileList = this.state.files.map((file) => {
			return (
				<FileListItem
					key={file.objectId}
					api={this.props.api}
					task={this.props.task}
					file={file}
					onDelete={this.handleFileDelete}
					onDownload={this.handleFileDownload}
				/>
			);
		});

		if (fileList.length === 0) {
			fileList = <ListGroupItem>This task currently has no attachments. Click one of the buttons below to attach a file to this task.</ListGroupItem>
		}

		return (
			<Modal show={this.props.show} onEntered={this.onEntered}>
				<Modal.Header onHide={this.hideModal}>
					<button type="button" className="close" onClick={this.hideModal}>x</button>
					<Modal.Title>Attachments</Modal.Title>
				</Modal.Header>
				{ this.state.error ? <Alert bsStyle="warning" onDismiss={this.clearError}><p>{this.state.error.error.name}: {this.state.error.error.message}</p></Alert> : null }
				<ListGroup style={{marginBottom: '-1px', marginTop: '-1px'}}>
  					{fileList}
				</ListGroup>
				<Modal.Footer>
					<form className="text-left" style={{margin:0}}>
						<input type="file" className="fileInput" style={{display:'none', visibility:'hidden', width:'1px'}}/>
						<input type="hidden" id="isPublic"/>
    					<Button bsStyle="primary" onClick={this.selectFile.bind(this, false)}>Add Private File</Button>
    					<Button bsStyle="warning" onClick={this.selectFile.bind(this, true)}>Add Public File</Button>
    					<LoadingSpinner className="pull-right" show={this.state.saving || this.state.loading} />
					</form>
				</Modal.Footer>
			</Modal>
		);
	}	
});
