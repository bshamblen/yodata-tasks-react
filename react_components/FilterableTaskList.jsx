import React from 'react';
import TaskList from './TaskList.jsx';
import TaskModal from './TaskModal.jsx';
import ErrorAlert from './ErrorAlert.jsx';
import TagsSidebar from './TagsSidebar.jsx';
import LoadingSpinner from './LoadingSpinner.jsx';
import TaskListFooter from './TaskListFooter.jsx';
import dataChangeEmitter from './DataChangeEmitter.js';
import TaskAttachmentsModal from './TaskAttachmentsModal.jsx';

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
		this.setState({currentOffset: 0, selectedTag: tag}, () => {
			this.reloadTasks();
		});
	},
	handleStateChange(obj) {
		this.setState(obj, () => {
			this.reloadTasks();
		});
	},
	reloadTags() {
		this.setState({loadingTags: true});

		let options = {
			pipeline: [{$unwind: '$tags'}, { $group: { _id: '$tags', count: { $sum: 1 } }}, { $sort: {_id: 1}}]
		}

		this.props.api.aggregate('yodata.task', options, (err, results) => {
			if (err) {
				dataChangeEmitter.emit('error', err);
			} else if (results && results.length > 0) {
				this.setState({tags: results});
			}

			this.setState({loadingTags: false});
		});
	},
	reloadTasks() {
		this.setState({loadingTasks: true});

		let options = {
			limit: 10,
			sort: {createdAt: -1},
			offset: this.state.currentOffset
		}

		let criteria = {deleted: this.state.showDeleted};

		if (this.state.selectedTag) {
			criteria['tags'] = this.state.selectedTag;
		}

		options['criteria'] = criteria;
	
		this.props.api.find('yodata.task', options, (err, results) => {
			if (err) {
				dataChangeEmitter.emit('error', err);
			} else if (results && results.data && results.data.length > 0) {
				this.setState({tasks: results.data, meta: results.meta});
			} else {
				this.setState({tasks: [], meta: null})
			}

			this.setState({loadingTasks: false});
		});
	},
	componentDidMount() {
		this.reloadTags();
		this.reloadTasks();

		this.emitter = dataChangeEmitter.addListener('event', () => {
			this.reloadTasks();
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
							<LoadingSpinner className="pull-right" show={this.state.loadingTasks || this.state.loadingTags} />
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