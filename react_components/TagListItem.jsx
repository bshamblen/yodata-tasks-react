/** @jsx React.DOM */

var React = require('react');

module.exports = React.createClass({
	displayName: 'TagListItem',
	propTypes: {
		tag: React.PropTypes.object.isRequired,
		onTagSelect: React.PropTypes.func.isRequired
	},
	handleButtonClick() {
		this.props.onTagSelect(this.props.tag._id);
	},
	render() {
		return (
			<li>
				<button type="button" className="btn btn-default btn-xs btn-task-tag" onClick={this.handleButtonClick}>
					{this.props.tag._id}&nbsp;
					<span className="badge">{this.props.tag.count}</span>
				</button>
			</li>
		);
	}
});
