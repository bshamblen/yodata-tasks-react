/** @jsx React.DOM */

var React = require('react');
var Button = require('react-bootstrap').Button;

module.exports = React.createClass({
	displayName: 'FileListItem',
	propTypes: {
		api: React.PropTypes.object.isRequired,
		file: React.PropTypes.object.isRequired,
		onDelete: React.PropTypes.func.isRequired,
		onDownload: React.PropTypes.func.isRequired
	},
	handleDownloadClick() {
		this.props.onDownload(this.props.file);
	},
	handleDeleteClick() {
		if (confirm('Are you sure you want to delete this fiel?')) {
			this.props.onDelete(this.props.file);
		}
	},
	render() {
		var file = this.props.file;
		var url = '';

		if (file.isPublic && file.publicFileUrl) {
			url = (
				<div>
					<div className="external-url">{file.publicFileUrl}</div>
					<div className="clearfix"></div>
				</div>
			);
		}

		return (
			<li className="list-group-item" style={{borderRadius: 0}}>
				<span className="pull-right button-group">
					<Button bsStyle="default" onClick={this.handleDownloadClick}>
						<i className="fa fa-cloud-download"></i>
					</Button>
					{' '}
					<Button bsStyle="danger" onClick={this.handleDeleteClick}>
						<i className="fa fa-trash"></i>
					</Button>
				</span>
				<h5 className="list-group-item-heading">{file.fileName + file.fileExtension}</h5>
				<div className="clearfix"></div>
				{url}
			</li>
		);
	}
});
