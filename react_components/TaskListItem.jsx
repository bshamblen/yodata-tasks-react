import React from 'react';
import TaskDeleteButton from './TaskDeleteButton.jsx';
import TaskCompleteButton from './TaskCompleteButton.jsx';
import utils from './utils.jsx';

module.exports = React.createClass({
	displayName: 'TaskListItem',
	propTypes: {
		api: React.PropTypes.object.isRequired,
		task: React.PropTypes.object.isRequired,
		onRowClick: React.PropTypes.func.isRequired,
		showDeleted: React.PropTypes.bool
	},
	handleEditTask() {
		this.props.onRowClick(this.props.task);
	},
	render() {
		let api = this.props.api;
		let task = this.props.task;
		let dueDate = (task.dueDate && !task.completed ? new Date(task.dueDate) : null);
		let now = new Date();
		let pastDue = (dueDate && dueDate < now);
		let headingClass = 'list-group-item-heading'
		let taskPriority, hasFiles, dueDateDiv, taskNotes; 

		if (task.completed) {
			headingClass += ' task-muted';
		}

		if (pastDue) {
			headingClass += ' text-danger';
		}

		if (task.priority && task.priority === 'high' || task.priority === 'low') {
			taskPriority = <i className={task.priority === 'high' ? 'fa fa-arrow-up text-danger' : 'fa fa-arrow-down text-success'} style={{marginLeft: '5px'}}></i>;
		}

		if (task.files && task.files.length > 0) {
			hasFiles = <i className="fa fa-paperclip" style={{marginLeft: '5px'}}></i>;
		}

		if (dueDate) {
			dueDateDiv = <div className={pastDue ? 'text-danger small' : 'small'}>Due: {utils.formatDateString(task.dueDate)}</div>;
		}

		if (task.notes && task.notes.length > 0) {
			taskNotes = <p className={task.completed ? 'list-group-item-text task-muted' : 'list-group-item-text'} style={{whiteSpace: 'pre-wrap', marginTop: '9px'}}>{task.notes}</p>; 
		}

		return (
			<tr>
				<td className="yodata-task" onClick={this.handleEditTask}> 
					<h4 className={headingClass}>
						{task.title}
						{taskPriority}
						{hasFiles}
					</h4>
					{dueDateDiv}
					{taskNotes}
				</td>
				<td className="text-right text-nowrap">
					<TaskCompleteButton task={task} api={api} /> <TaskDeleteButton task={task} api={api} showDeleted={this.props.showDeleted}/>
				</td>
			</tr>
		);
	}
});
