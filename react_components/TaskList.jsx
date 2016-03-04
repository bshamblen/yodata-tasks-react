import React from 'react';
import TaskListItem from './TaskListItem.jsx';

module.exports = React.createClass({
	displayName: 'TaskList',
	propTypes: {
		api: React.PropTypes.object.isRequired,
		tasks: React.PropTypes.arrayOf(React.PropTypes.object),
		showDeleted: React.PropTypes.bool
	},
	handleRowClick(task) {
		this.props.onRowClick(task);
	},
	render() {
		if (!this.props.tasks || this.props.tasks.length === 0) {
			return null;
		}

		let taskList = this.props.tasks.map((task) => {
			return (
				<TaskListItem
					key={task.objectId}
					task={task}
					showDeleted={this.props.showDeleted}
					api={this.props.api}
					onRowClick={this.handleRowClick}
				/>
			);
		});

		return (
			<table className="table table-hover">
	      		<tbody>
	      			{taskList}
				</tbody>
			</table>
		);
	}
});
