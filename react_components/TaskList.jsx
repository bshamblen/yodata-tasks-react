/** @jsx React.DOM */

var React = require('react');
var TaskListItem = require('./TaskListItem.jsx');

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

		var self = this;
		var taskList = this.props.tasks.map(function(task) {
			return (
				<TaskListItem
					key={task.objectId}
					task={task}
					showDeleted={self.props.showDeleted}
					api={self.props.api}
					onRowClick={self.handleRowClick}
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
