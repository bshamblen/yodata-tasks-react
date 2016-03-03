/** @jsx React.DOM */

var React = require('react');
var Switch = require('react-bootstrap-switch');
var TasksPager = require('./TasksPager.jsx');

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
						onText="&nbsp;"
						offText="&nbsp;"
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
