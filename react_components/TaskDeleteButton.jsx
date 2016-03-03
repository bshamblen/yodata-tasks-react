/** @jsx React.DOM */

var React = require('react');
var Button = require('react-bootstrap').Button;
var TaskDeleteModal = require('./TaskDeleteModal.jsx');

module.exports = React.createClass({
	displayName: 'TaskDeleteButton',
	propTypes: {
		api: React.PropTypes.object.isRequired,
		task: React.PropTypes.object.isRequired
	},
	getInitialState() {
		return {
			show: false
		}
	},
	showDeleteModal() {
		this.setState({show: true});
	},
	handleModalState(show) {
		this.setState({show: show});
	},
	render() {
		var modal = '';

		if (this.state.show) {
			modal = <TaskDeleteModal showModal={this.handleModalState} task={this.props.task} api={this.props.api} />;
		}

		return (
			<span>
				<Button bsStyle="danger" style={{zIndex: 100}} onClick={this.showDeleteModal}>
					<i className="fa fa-trash"></i>
				</Button>
				{modal}
			</span>
		);
	}
});
