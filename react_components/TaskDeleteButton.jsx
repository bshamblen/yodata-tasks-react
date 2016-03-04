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
		return (
			<span>
				<Button bsStyle="danger" style={{zIndex: 100}} onClick={this.showDeleteModal}>
					<i className="fa fa-trash"></i>
				</Button>
				{this.state.show ? <TaskDeleteModal showModal={this.handleModalState} {...this.props} /> : null}
			</span>
		);
	}
});
