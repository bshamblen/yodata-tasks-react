/** @jsx React.DOM */

var React = require('react');
var TaskList = require('./TaskList.jsx');
var TaskModal = require('./TaskModal.jsx');
var ErrorAlert = require('./ErrorAlert.jsx');
var TagsSidebar = require('./TagsSidebar.jsx');
var TaskListFooter = require('./TaskListFooter.jsx');
var dataChangeEmitter = require('./DataChangeEmitter.js');
var TaskAttachmentsModal = require('./TaskAttachmentsModal.jsx');

module.exports = React.createClass({
	displayName: 'FilterableTaskList',
	propTypes: {
		api: React.PropTypes.object.isRequired
	},
	getInitialState() {
		return {
			tags: [],
			tasks: [],
			showDeleted: false,
			currentPage: 1,
			selectedTag: null,
			loadingTags: true,
			loadingTasks: true,
			currentOffset: 0,
			meta: null,
			editTask: null,
			showTaskModal: false,
			showAttachmentsModal: false
		}
	},
	handleTagSelect(tag) {
		var self = this;

		this.setState({currentOffset: 0, selectedTag: tag}, function() {
			self.reloadTasks();
		});
	},
	handleStateChange(obj) {
		var self = this;

		this.setState(obj, function() {
			self.reloadTasks();
		});
	},
	reloadTags() {
		var self = this;
		this.setState({loadingTags: true});

		var options = {
			pipeline: [{$unwind: '$tags'}, { $group: { _id: '$tags', count: { $sum: 1 } }}, { $sort: {_id: 1}}]
		}

		this.props.api.aggregate('yodata.task', options, function(err, results) {
			if (err) {
				dataChangeEmitter.emit('error', err);
			} else if (results && results.length > 0) {
				self.setState({tags: results});
			}

			self.setState({loadingTags: false});
		});
	},
	reloadTasks() {
		var self = this;
		self.setState({loadingTasks: true});

		var options = {
			limit: 10,
			sort: {createdAt: -1},
			offset: this.state.currentOffset
		}

		var criteria = {deleted: this.state.showDeleted};

		if (this.state.selectedTag) {
			criteria['tags'] = this.state.selectedTag;
		}

		options['criteria'] = criteria;
	
		this.props.api.find('yodata.task', options, function(err, results) {
			if (err) {
				dataChangeEmitter.emit('error', err);
			} else if (results && results.data && results.data.length > 0) {
				self.setState({tasks: results.data, meta: results.meta});
			} else {
				self.setState({tasks: [], meta: null})
			}

			self.setState({loadingTasks: false});
		});
	},
	componentDidMount() {
		var self = this;

		this.reloadTags();
		this.reloadTasks();

		this.emitter = dataChangeEmitter.addListener('event', function() {
			self.reloadTasks();
		});
	},
	componentWillUnmount() {
		this.emitter.remove();
	},
	showTaskModal() {
		this.setState({editTask: null, showTaskModal: true});
	},
	hideTaskModal(showAttachmentsModal) {
		if (showAttachmentsModal) {
			this.setState({showAttachmentsModal: true, showTaskModal: false});
		} else {
			this.setState({editTask: null, showAttachmentsModal: false, showTaskModal: false});
		}
	},
	handleRowClick(task) {
		this.setState({editTask: task, showTaskModal: true});
	},
	render() {
		var spinner = (
			<i className="pull-right fa fa-circle-o-notch fa-spin fa-2x"></i>
		);

		if (!this.state.loadingTasks && !this.state.loadingTags) {
			spinner = '';
		}

		return (
			<div className="row">
				<ErrorAlert />
				<TagsSidebar
					tags={this.state.tags}
					selectedTag={this.state.selectedTag}
					onTagSelect={this.handleTagSelect}
				/>
				<div className={this.state.tags.length > 0 ? 'col-sm-9' : 'col-sm-12'}>
					<div className="panel panel-default">
						<div className="panel-heading">
							<button type="button" className="btn btn-primary" onClick={this.showTaskModal}>New Task</button>
							{spinner}
						</div>
						<TaskList
							tasks={this.state.tasks}
							showDeleted={this.state.showDeleted}
							api={this.props.api}
							onRowClick= {this.handleRowClick}
						/>
						<TaskListFooter 
							currentOffset={this.state.currentOffset}
							meta={this.state.meta}
							showDeleted={this.state.showDeleted}
							onStateChange={this.handleStateChange}
						/>
					</div>
				</div>
				<TaskModal
					task={this.state.editTask}
					show={this.state.showTaskModal}
					onClose={this.hideTaskModal}
					api={this.props.api}
				/>
				<TaskAttachmentsModal
					task={this.state.editTask}
					show={this.state.showAttachmentsModal}
					onClose={this.hideTaskModal}
					api={this.props.api}
				/>
			</div>
		);
	}
});