import React from 'react';
import Switch from 'react-bootstrap-switch';
import TasksPager from './TasksPager.jsx';

module.exports = React.createClass({
	displayName: 'TaskListFooter',
	propTypes: {
		currentOffset: React.PropTypes.number.isRequired,
		meta: React.PropTypes.object,
		showDeleted: React.PropTypes.bool,
		onStateChange: React.PropTypes.func.isRequired
	},
	handleDeleteToggle(state) {
		this.props.onStateChange({showDeleted: state, currentOffset: 0});
	},
	handleStateChange(obj) {
		this.props.onStateChange(obj);
	},
	render() {
		return (
			<div className="panel-footer">
				<span className="pull-right">
					<Switch
						onChange={this.handleDeleteToggle}
						onColor="danger" size="small"
						onText={String.fromCharCode(160)}
						offText={String.fromCharCode(160)}
						labelText="trash"
						state={this.props.showDeleted}
					/>
				</span>
				<TasksPager 
					meta={this.props.meta}
					currentOffset={this.props.currentOffset}
					onStateChange={this.handleStateChange}
				/>
				<div className="clearfix"></div>
			</div>
		)
	}
});
